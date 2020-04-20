import datetime
import logging
import socket
import string

from flask import Flask, request, render_template, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from class_data import User
from class_data import GetCourseFromLectureId
from class_data import GetLectureFromLectureId
from class_data import GetAssignmentFromLectureId
from class_data import GetNotesFromLectureId
from class_data import GetInstitutionFromLectureId 
from class_data import GetCourseNameFromLectureId
from class_data import GetDateOfLectureFromLectureId
from passlib.hash import sha256_crypt
from random import choice, randint
from mailjet_rest import Client
from google.cloud import storage

BUCKET_NAME = 'chalkboards_uploads'
MAILJET_API_KEY = 'bffc84aea3085b6e9ecd32dafe49d81e'
MAILJET_API_SECRET = 'bf4a0b01f8c476331d57396d24f8cc5d'
MAILJET_SENDER = 'register@chalkboards.in'
MALFORMED_REQUEST = 'Malformed request. Operation could not be completed.'
UNAUTHORIZED_USER = 'User is not authorized to make this request.'

mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version='v3.1')

app = Flask(__name__)

users_by_user_id = {}
user_id_by_email = {}
user_credentials = {}
passwords = set()

characters = string.ascii_letters + string.punctuation + string.digits


def is_ipv6(addr):
    """Checks if a given address is an IPv6 address."""
    try:
        socket.inet_pton(socket.AF_INET6, addr)
        return True
    except socket.error:
        return False


app.config['SQLALCHEMY_DATABASE_URI'] = (
    'mysql+pymysql://test_user:bomDiggy@385@/TestDB')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class UserCredential(db.Model):
    user_credential_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(256), nullable=False, unique=True)

    def __init__(self, email, password):
        self.email = email
        self.password = password


class Course(db.Model):
    course_id = db.Column(db.Integer, primary_key=True)
    institution = db.Column(db.String(100), nullable=False)
    section = db.Column(db.String(100), nullable=False)
    course_name = db.Column(db.String(100), nullable=False)
    professor_email = db.Column(db.String(100), nullable=False)

    def __init__(self, institution, section, course_name, professor_email):
        self.institution = institution
        self.section = section
        self.course_name = course_name
        self.professor_email = professor_email


class UserData(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)

    def __init__(self, email):
        self.email = email


class Lecture(db.Model):
    lecture_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey(
        'course.course_id'), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)

    def __init__(self, course_id, date_time):
        self.course_id = course_id
        self.date_time = date_time


class Notes(db.Model):
    notes_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_data.user_id'))
    lecture_id = db.Column(db.Integer, db.ForeignKey('lecture.lecture_id'))
    added_on = db.Column(db.DateTime, nullable=False)
    viewed_on = db.Column(db.DateTime)

    def __init__(self, lecture_id, user_id, added_on):
        self.lecture_id = lecture_id
        self.user_id = user_id
        self.added_on = added_on


class Assignment(db.Model):
    assignment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_data.user_id'))
    lecture_id = db.Column(db.Integer, db.ForeignKey('lecture.lecture_id'))
    added_on = db.Column(db.DateTime, nullable=False)
    viewed_on = db.Column(db.DateTime)
    submitted_on = db.Column(db.DateTime)

    def __init__(self, lecture_id, user_id, added_on):
        self.lecture_id = lecture_id
        self.user_id = user_id
        self.added_on = added_on


class UserCourse(db.Model):
    user_course_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_data.user_id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'))

    def __init__(self, user_id, course_id):
        self.user_id = user_id
        self.course_id = course_id


def _upload_notes(user_id, lecture_id, added_on):
    lecture = GetLectureFromLectureId(lecture_id)
    if lecture is None:
        return
    notes = Notes(
        user_id=user_id,
        lecture_id=lecture_id,
        added_on=added_on)
    db.session.add(notes)
    lecture.add_notes(notes)


def _upload_assignment(user_id, lecture_id, added_on):
    lecture = GetLectureFromLectureId(lecture_id)
    if lecture is None:
        return
    assignment = Assignment(
        user_id=user_id,
        lecture_id=lecture_id,
        added_on=added_on)
    db.session.add(assignment)
    lecture.add_assignment(assignment)


def GetBlobName(lecture_id, file_type):
    return (
        '{institution}/{course_name}/lecture_{date_time}/{file_type}'.format(
            institution=GetInstitutionFromLectureId(lecture_id),
            course_name=GetCourseNameFromLectureId(lecture_id),
            date_time=GetDateOfLectureFromLectureId(lecture_id),
            file_type=file_type))


def GetEmailFromUserId(user_id):
    if user_id in users_by_user_id:
        return users_by_user_id[user_id].email
    return None


def IsUserProfessorForLecture(user_id, lecture_id):
    return (
        GetCourseFromLectureId(
            lecture_id).professor_email == GetEmailFromUserId(user_id))


def IsUserStudentForLecture(user_id, lecture_id):
    return (
        user_id in GetCourseFromLectureId(
            lecture_id).student_user_ids)


def IsUserForLecture(user_id, lecture_id):
    return IsUserProfessorForLecture(
        user_id, lecture_id) or IsUserStudentForLecture(
            user_id, lecture_id)


def generate_upload_signed_url(lecture_id, file_type, content_type):
    blob_name = GetBlobName(lecture_id, file_type)

    storage_client = storage.Client.from_service_account_json('key.json')
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=15),
        method="PUT",
        content_type=content_type,
    )
    return url


def generate_upload_submission_signed_url(user_id, lecture_id, content_type):
    blob_name = (
        '{institution}/{course_name}/lecture_{date_time}/'
        '{file_type}/{user_id}'.format(
            institution=GetInstitutionFromLectureId(lecture_id),
            course_name=GetCourseNameFromLectureId(lecture_id),
            date_time=GetDateOfLectureFromLectureId(lecture_id),
            file_type='submissions', user_id=user_id))

    storage_client = storage.Client.from_service_account_json('key.json')
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=15),
        method="PUT",
        content_type=content_type,
    )
    return url


def generate_download_submission_signed_url(user_id, lecture_id, content_type):
    blob_name = (
        '{institution}/{course_name}/lecture_{date_time}/'
        '{file_type}/{user_id}'.format(
            institution=GetInstitutionFromLectureId(lecture_id),
            course_name=GetCourseNameFromLectureId(lecture_id),
            date_time=GetDateOfLectureFromLectureId(lecture_id),
            file_type='submissions', user_id=user_id))

    storage_client = storage.Client.from_service_account_json('key.json')
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=15),
        method="GET",
    )
    return url


def generate_download_signed_url(lecture_id, file_type):
    blob_name = GetBlobName(lecture_id, file_type)

    storage_client = storage.Client.from_service_account_json('key.json')
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=15),
        method="GET",
    )
    return url


@app.route('/get_download_assignment_url')
def get_download_assignment_url():
    data = request.get_json()
    if data is None or 'user_id' not in data or 'lecture_id' not in data:
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']
    if GetAssignmentFromLectureId(lecture_id) is None:
        return flash('Assignment has not been uploaded yet.','danger')
    if IsUserForLecture(user_id, lecture_id):
        return generate_download_signed_url(lecture_id, 'assignment')
    else:
        flash(UNAUTHORIZED_USER, 'danger')


@app.route('/get_download_notes_url')
def get_download_notes_url():
    data = request.get_json()
    if data is None or 'user_id' not in data or 'lecture_id' not in data:
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']
    if GetNotesFromLectureId(lecture_id) is None:
        return flash('Notes have not been uploaded yet.','danger')
    if IsUserForLecture(user_id, lecture_id):
        return generate_download_signed_url(lecture_id, 'notes')
    else:
        flash(UNAUTHORIZED_USER, 'danger')


@app.route('/get_upload_assignment_url')
def get_upload_assignment_url():
    data = request.get_json()
    if (
        data is None
        or 'user_id' not in data
        or 'lecture_id' not in data
        or 'content_type' not in data):
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']
    content_type = data['content_type']
    if IsUserProfessorForLecture(user_id, lecture_id):
        return generate_upload_signed_url(lecture_id, 'assignment', content_type)
    else:
        flash(UNAUTHORIZED_USER, 'danger')


@app.route('/get_upload_notes_url')
def get_upload_notes_url():
    data = request.get_json()
    if (
        data is None
        or 'user_id' not in data
        or 'lecture_id' not in data
        or 'content_type' not in data):
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']
    content_type = data['content_type']
    if IsUserProfessorForLecture(user_id, lecture_id):
        return generate_upload_signed_url(lecture_id, 'notes', content_type)
    else:
        flash(UNAUTHORIZED_USER, 'danger')


@app.route('/download_notes')
def download_notes():
    data = request.get_json()
    if not data or 'user_id' not in data or 'lecture_id' not in data:
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']

    notes = GetNotesFromLectureId(lecture_id)
    if notes is None:
        return flash(
            'Notes have not been uploaded yet for this lecture.', 'danger')
    notes.view_times_by_user_ids[
        user_id] = datetime.datetime.now()
    Notes.query.filter_by(user_id=user_id).filter_by(
        lecture_id=lecture_id).update(dict(viewed_on=datetime.datetime.now()))
    db.session.commit()


@app.route('/download_assignment')
def download_assignment():
    data = request.get_json()
    if not data or 'user_id' not in data or 'lecture_id' not in data:
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']

    assignment = GetAssignmentFromLectureId(lecture_id)
    if assignment is None:
        return flash(
            'Assignment has not been uploaded yet for this lecture.', 'danger')
    viewed_on = datetime.datetime.now()
    assignment.view_times_by_user_ids[user_id] = viewed_on
    Assignment.query.filter_by(user_id=user_id).filter_by(
        lecture_id=lecture_id).update(dict(viewed_on=viewed_on))
    db.session.commit()


@app.route('/upload_notes')
def upload_notes():
    data = request.get_json()
    if not data or 'user_id' not in data or 'lecture_id' not in data:
        return
    user_id = data['user_id']
    lecture_id = data['lecture_id']

    added_on = datetime.datetime.now()
    _upload_notes(
        user_id=user_id,
        lecture_id=lecture_id,
        added_on=added_on)

    course = GetCourseFromLectureId(lecture_id)
    if course is not None:
        for student_user_id in course.student_user_ids:
            _upload_notes(
                user_id=student_user_id,
                lecture_id=lecture_id,
                added_on=added_on)
    db.session.commit()


@app.route('/upload_assignment')
def upload_assignment():
    data = request.get_json()
    if not data or 'user_id' not in data or 'lecture_id' not in data:
        return
    user_id = data['user_id']
    lecture_id = data['lecture_id']

    added_on = datetime.datetime.now()
    _upload_assignment(
        user_id=user_id,
        lecture_id=lecture_id,
        added_on=added_on)

    course = GetCourseFromLectureId(lecture_id)
    if course is not None:
        for student_user_id in course.student_user_ids:
            _upload_assignment(
                user_id=student_user_id,
                lecture_id=lecture_id,
                added_on=added_on)
    db.session.commit()


@app.route('/submit_assignment')
def submit_assignment():
    data = request.get_json()
    if not data or 'user_id' not in data or 'lecture_id' not in data:
        return
    user_id = data['user_id']
    lecture_id = data['lecture_id']

    assignment = GetAssignmentFromLectureId(lecture_id)
    if assignment is None:
        return flash(
            'Assignment has not yet been uploaded for this lecture.', 'danger')
    submitted_on = datetime.datetime.now()
    assignment.submission_times_by_user_ids[user_id] = submitted_on
    Assignment.query.filter_by(user_id=user_id).filter_by(
        lecture_id=lecture_id).update(dict(submitted_on=submitted_on))
    db.session.commit()


@app.route('/get_upload_submission_url')
def get_upload_submission_url():
    data = request.get_json()
    if (
        data is None
        or 'user_id' not in data
        or 'lecture_id' not in data
        or 'content_type' not in data):
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']
    content_type = data['content_type']

    if GetAssignmentFromLectureId(lecture_id) is None:
        return flash(
            'Assignment has not yet been uploaded for this lecture.', 'danger')

    if IsUserStudentForLecture(user_id, lecture_id):
        return generate_upload_submission_signed_url(
            user_id, lecture_id, content_type)
    else:
        flash(UNAUTHORIZED_USER, 'danger')


@app.route('/get_download_submission_url')
def get_download_submission_url():
    data = request.get_json()
    if (
        data is None
        or 'user_id' not in data
        or 'student_id' not in data
        or 'lecture_id' not in data
        or 'content_type' not in data):
        return flash(MALFORMED_REQUEST, 'danger')
    user_id = data['user_id']
    lecture_id = data['lecture_id']
    student_id = data['student_id']
    content_type = data['content_type']

    if GetAssignmentFromLectureId(lecture_id) is None:
        return flash(
            'Assignment has not yet been uploaded for this lecture.', 'danger')

    if (
        IsUserStudentForLecture(student_id, lecture_id) and 
        IsUserProfessorForLecture(user_id, lecture_id)):
        return generate_download_submission_signed_url(
            student_id, lecture_id, content_type)
    else:
        flash(UNAUTHORIZED_USER, 'danger')


@app.route('/view_submissions')
def view_submissions():
    data = request.get_json()
    if not data or 'lecture_id' not in data:
        return
    lecture_id = data['lecture_id']
    assignment = GetAssignmentFromLectureId(lecture_id)
    if assignment is None:
        return
    users = []
    for user_id in assignment.submission_times_by_user_ids:
        user_data = users_by_user_id[user_id]
        users += [{
            'full_name': user_data[user_id].full_name,
            'roll_number': user_data.roll_number,
            'submitted_on': assignment.submission_times_by_user_ids[user_id]
        }]
    return users


def create_dummy_data():
    db.drop_all()
    db.create_all()

    db.session.add(UserCredential('abc_1@gmail.com', sha256_crypt.hash(
        'password_2')))
    db.session.add(UserCredential('abc_2@gmail.com', sha256_crypt.hash(
        'password_3')))

    _course_2 = Course(
        'NSIT', 'Biotechnology', 'Microbiology', 'abc_2@gmail.com')
    db.session.add(_course_2)
    db.session.commit()

    _user_p_1 = UserData('abc_1@gmail.com')
    db.session.add(_user_p_1)
    _user_p_2 = UserData('abc_2@gmail.com')
    db.session.add(_user_p_2)
    _user_s = UserData('yahska111@gmail.com')
    db.session.add(_user_s)
    db.session.commit()

    #  Add course_1.
    _course_1 = Course(
        'NSIT', 'Biotechnology', 'Microbiology', 'abc_1@gmail.com')
    db.session.add(_course_1)
    db.session.commit()

    db.session.add(UserCourse(_user_p_1.user_id, _course_1.course_id))
    db.session.add(UserCourse(_user_s.user_id, _course_1.course_id))
    db.session.commit()

    _lecture_1 = Lecture(_course_1.course_id, datetime.datetime.now())
    db.session.add(_lecture_1)
    db.session.commit()

    db.session.add(Notes(
        _lecture_1.lecture_id, _user_p_1.user_id, datetime.datetime.now()))
    db.session.add(Assignment(
        _lecture_1.lecture_id, _user_p_1.user_id, datetime.datetime.now()))
    db.session.add(Notes(
        _lecture_1.lecture_id, _user_s.user_id, datetime.datetime.now()))
    db.session.add(Assignment(
        _lecture_1.lecture_id, _user_s.user_id, datetime.datetime.now()))
    db.session.commit()


@app.before_first_request
def load_database():
    create_dummy_data()
    rows = (
        db.session.query(
            UserData, UserCourse, Course, Lecture, Notes, Assignment)
        .join(UserCourse, UserData.user_id == UserCourse.user_id)
        .join(Course, UserCourse.course_id == Course.course_id)
        .join(Lecture, Course.course_id == Lecture.course_id)
        .join(Notes, UserData.user_id == Notes.user_id and (
             Notes.lecture_id == Lecture.lecture_id))
        .join(Assignment, UserData.user_id == Assignment.user_id and (
            Assignment.lecture_id == Lecture.lecture_id)).all())

    for row in rows:
        user = User(row[0])
        user.add_course(row[2]).add_lecture(row[3]).add_notes(
            row[4]).add_assignment(row[5])
        users_by_user_id[user.user_id] = user
        user_id_by_email[user.email] = user.user_id

    rows = db.session.query(UserCredential).all()
    for row in rows:
        user_credentials[row.email] = row.password
        passwords.add(row.password)


@app.errorhandler(500)
def server_error(e):
    logging.exception('An error occurred during a request.')
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500


def send_message(to, password):
    data = {
        'Messages': [{
            "From": {
                    "Email": MAILJET_SENDER,
                    "Name": 'Chalkboards Registration'
            },
            "To": [{
                "Email": to
            }],
            "Subject": 'Password to your chalkboards account.',
            "HTMLPart": 'Password to your chalkboards account is <b>{}</b>.'
            .format(password)
        }]
    }
    result = mailjet.send.create(data=data)
    return result.status_code


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        if email not in user_id_by_email:
            return render_template(
                'login.html',
                error='This email address is not registered with us. '
                'Please get in touch with us or college authorities '
                'for more information.')
        password = ""
        password_enc = ""
        while password_enc in passwords or len(password) < 8:
            password = "".join(
                choice(characters) for x in range(randint(8, 16)))
            password_enc = sha256_crypt.hash(str(password))
        print(password)

        if send_message(to=email, password=password) >= 400:
            return render_template(
                'login.html',
                error='Failed to send an email to {}. Please verify if the '
                'email is correct or reach out to us at issues@chalkboards.in'
                .format(email))
        if email in user_credentials:
            UserCredential.query.filter_by(
                email=email).update(dict(password=password_enc))
        else:
            db.session.add(UserCredential(email, password_enc))
        db.session.commit()
        user_credentials[email] = password_enc
        passwords.add(password_enc)

        flash(
            'Password has been sent to the email address you provided.'
            ' Please use it to Sign In.', 'success')
        return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    return 'Hello world'


@app.route('/')
def main():
    return render_template('login.html')


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if email in user_credentials:
            if sha256_crypt.verify(password, user_credentials[email]):
                return redirect(url_for('dashboard'))
        return render_template(
            'login.html', error='Incorrect email and password combination was '
            'entered. If you are not registered with us or have forgotten '
            'your password, please register to recieve a new password at your '
            'email address.')


if __name__ == '__main__':
    app.secret_key = '1234'
    app.run(host='127.0.0.1', port=8080, debug=True)