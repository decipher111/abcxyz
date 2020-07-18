from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify, make_response, send_file
from flask_mysqldb import MySQL
from wtforms import Form, StringField, TextAreaField, PasswordField, validators, DateField, IntegerField
from passlib.hash import sha256_crypt
from functools import wraps
import pandas as pd
import datetime
from sqlalchemy import create_engine
# from flask_restful import Api
from flask_jwt_extended import (JWTManager, jwt_required, 
                                jwt_refresh_token_required, 
                                jwt_optional, fresh_jwt_required, 
                                get_raw_jwt, get_jwt_identity,
                                create_access_token, create_refresh_token, 
                                set_access_cookies, set_refresh_cookies, 
                                unset_jwt_cookies,unset_access_cookies)
from flask_cors import CORS, cross_origin
import json
import xlrd



app = Flask(__name__)

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['BASE_URL'] = 'http://127.0.0.1:5000'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '19071999'
app.config['MYSQL_DB'] = 'myflaskapp'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_CHECK_FORM'] = True
app.config['CORS_HEADERS'] = 'Content-Type'
# cors = CORS(app, resources={"/get_time_table": {"origins": "http://localhost:port"}})
jwt = JWTManager(app) 

# init MYSQL
mysql = MySQL(app)
user_creds = {}
user_roles = {}


# df=pd.read_csv('cb.csv')
# engine = create_engine('mysql://usr/local/mysql/data', echo=False)
# df.to_sql('UserData', con=engine)
# book = xlrd.open_workbook()

def assign_access_refresh_tokens(user_id, url):
    access_token = create_access_token(identity=str(user_id))
    refresh_token = create_refresh_token(identity=str(user_id))
    resp = make_response(redirect(url, 302))
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    print(access_token)
    print(resp)
    return resp

def unset_jwt():
    resp = make_response(redirect(app.config['BASE_URL'] + '/', 302))
    unset_jwt_cookies(resp)
    return resp

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    # No auth header
    return redirect(app.config['BASE_URL'] + '/', 302)

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    # Invalid Fresh/Non-Fresh Access token in auth header
    resp = make_response(redirect(app.config['BASE_URL'] + '/'))
    unset_jwt_cookies(resp)
    return resp, 302


@jwt.expired_token_loader
def expired_token_callback(callback):
    # Expired auth header
    resp = make_response(redirect(app.config['BASE_URL'] + '/token/refresh'))
    unset_access_cookies(resp)
    return resp, 302

@app.route('/token/refresh', methods=['GET'])
@jwt_refresh_token_required
def refresh():
    # Refreshing expired Access token
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=str(user_id))
    resp = make_response(redirect(app.config['BASE_URL'] + '/', 302))
    set_access_cookies(resp, access_token)
    return resp

# TEST ROUTE 
@app.route('/api', methods=["POST"])
def api():
   username = request.form['email']
   password = request.form['password']

   ## <-----------------  verifiy unsername password from data base, if username not found -------------------->
   # flash('please register first', 'danger')
   # return redirect(url_for('login'))

   ## <-----------------  verifiy unsername password from data base, if password not found -------------------->
   # flash('incorrect password', 'danger')
   # return redirect(url_for('login'))
   # else

   return assign_access_refresh_tokens(username , app.config['BASE_URL'])


@app.route('/get_time_table', methods=['GET'])
# @cross_origin(origin='http://127.0.0.1:5000', headers=['Content- Type','Authorization'])
@jwt_required
def get_time_table():
   username = get_jwt_identity()
   print(username)
   date = request.args.get('date')
   print(date)
   return jsonify({'courses': [{'lectures': [{'date_time': '05/24/2020, 15:00:00', 'notes': {'available': 'False', 'new_comments': 10}, 'lecture_id': 2, 'submission': {'available': 'True', 'file_name':'submission_2.pdf', 'time_ago': '9 hours'}, 'assignment': {'available': 'True', 'new_comments': 3, 'file_name':'assignment_2.pdf', 'time_ago': '6 hours', 'to_be_seen': 'True'}}, {'date_time': '05/24/2020, 15:00:00', 'notes': {'available': 'False', 'new_comments': 8}, 'lecture_id': 2, 'submission': {'available': 'True', 'file_name':'submission_2.pdf', 'time_ago': '9 hours'}, 'assignment': {'available': 'True', 'new_comments': 3, 'file_name':'assignment_2.pdf', 'time_ago': '6 hours', 'to_be_seen': 'True'}}], 'course_name':'Physics', 'section':'PY101', 'calendar_notifications': ['05/24/2020', '05/22/2020', '05/21/2020', '05/24/2020'], 'role': 'Student', 'institution': 'NSIT'}], 'user_id': 4, 'email':'student_2@gmail.com', 'name': 'Raghav Khanna', 'calendar_hover_notifications': [{'date':'7/16/2020', 'submissions_due':'3','new_submissions':'3','new_assignments':'3','new_notes':'3', 'rendered':'False' }, {
         "date":"7/17/2020",
         "submissions_due":"3",
         "new_submissions":"3",
         "new_assignments":"3",
         "new_notes":"3",
         'rendered':'False'
      }]})
   # return jsonify({"courses":[{"calendar_notifications":[],"course_name":"Operating Systems","institution":"NSIT","lectures":[{"assignment":{'available': 'False', 'file_name':'submission_2.pdf', 'time_ago': '9 hours'},"date_time":"06/17/2020, 17:00:00","lecture_id":65,"notes":{"available":"False"},"submission":{"total_submissions":0,"unviewed_submissions":0}}],"role":"Professor","section":"CS121"},{"calendar_notifications":[],"course_name":"Computer Architecture","institution":"NSIT","lectures":[{"assignment":{"available":"False"},"date_time":"06/17/2020, 16:00:00","lecture_id":67,"notes":{"available":"False"},"submission":{"total_submissions":0,"unviewed_submissions":0}}],"role":"Professor","section":"CS245"}],"email":"professor_1@gmail.com","user_id":1})


@app.route('/get_tooltip_notification', methods=["GET"])
def get_tooltip_notification():
   return jsonify({"submissions_due": 4, "new_submissions":3, "new_assignments":0, "new_notes":1})
   
@app.route('/return-files', methods=["GET"])
def return_files_tut():
   print(request.data)
   return send_file('/Users/raghav/Desktop/sample.pdf', attachment_filename='sample.pdf')


@app.route('/get_upload_assignment_url')
def get_upload_assignment_url():
    print(request.args.get('lecture_id'))
    return 'signedurl'

@app.route('/upload_assignment')
def upload_assignment():
   print(request.args.get('lecture_id'))
   print('assignment uploaded by user')
   return {'courses': [{'lectures': [{'date_time': '05/24/2020, 15:00:00', 'notes': {'available': 'True', "file_name":"notes.pdf","time_ago":"6 hours"}, 'lecture_id': 2, 'submission': None, 'assignment': {'available': 'True', 'file_name': 'sample.pdf', 'time_ago': '6 hours', 'to_be_seen': 'False'}}], 'course_name': 'Computer Architecture', 'section': 'Computer Science', 'calendar_notifications': ['05/24/2020'], 'role': 'Professor', 'institution': 'NSIT'}], 'user_id': 2, 'email': 'professor_2@gmail.com'}

@app.route('/get_upload_submission_url')
def get_upload_submission_url():
    print(request.args.get('lecture_id'))
    return 'signedurl'

@app.route('/upload_submission')
def upload_submission():
   print(request.args.get('lecture_id'))
   print('assignment uploaded by user')
   return jsonify({'courses': [{'lectures': [{'date_time': '05/24/2020, 11:30:00', 'notes': {'available': 'True', 'file_name':'notes_1.pdf', 'time_ago': '10 hours', 'to_be_seen': 'True'}, 'lecture_id': 1, 'submission': {'available': 'True', 'file_name':'sample.pdf', 'time_ago': '9 hours'} , 'assignment': {'available': 'True', 'file_name':'assignment_1.pdf', 'time_ago': '8 hours', 'to_be_seen': 'True'}}], 'course_name':'Operating Systems', 'section':'Computer Science', 'calendar_notifications': ['05/24/2020', '05/25/2020', '01/01/2021'], 'role': 'Student', 'institution':'NSIT'}, {'lectures': [{'date_time': '05/24/2020, 15:00:00', 'notes': {'available': 'False'}, 'lecture_id': 2, 'submission': {'available': 'True', 'file_name':'submission_2.pdf', 'time_ago': '9 hours'}, 'assignment': {'available': 'True', 'file_name':'assignment_2.pdf', 'time_ago': '6 hours', 'to_be_seen': 'True'}}], 'course_name':'Computer Architecture', 'section':'Computer Science', 'calendar_notifications': ['05/24/2020', '05/22/2020', '05/21/2020', '05/24/2020'], 'role': 'Student', 'institution': 'NSIT'}], 'user_id': 4, 'email':'student_2@gmail.com'})

@app.route('/get_upload_notes_url')
def get_upload_notes_url():
    print(request.args.get('lecture_id'))
    return 'signedurl'

@app.route('/upload_notes')
def upload_notes():
   print(request.args.get('lecture_id'))
   print('notes uploaded by prof')
   return jsonify({'courses': [{'lectures': [{'date_time': '05/24/2020, 15:00:00', 'notes': {'available': 'True', "file_name":"sample.pdf","time_ago":"6 hours"}, 'lecture_id': 2, 'submission': None, 'assignment': {'available': 'False', 'file_name': 'assignment_2.pdf', 'time_ago': '6 hours', 'to_be_seen': 'False'}}], 'course_name': 'Computer Architecture', 'section': 'Computer Science', 'calendar_notifications': ['05/24/2020'], 'role': 'Professor', 'institution': 'NSIT'}], 'user_id': 2, 'email': 'professor_2@gmail.com'})

@app.route('/get_download_assignment_url')
def get_download_assignment_url():
   print(request.args.get('lecture_id'))
   return "signed url"


@app.route('/download_assignment')
def download_assignment():
   print(request.args.get('lecture_id'))
   print('assignment downloaed by user')
   return jsonify({'courses': [{'lectures': [{'date_time': '05/24/2020, 11:30:00', 'notes': {'available': 'True', 'file_name':'notes_1.pdf', 'time_ago': '10 hours', 'to_be_seen': 'True'}, 'lecture_id': 1, 'submission': {'available': 'True', 'file_name':'sample.pdf', 'time_ago': '9 hours'} , 'assignment': {'available': 'True', 'file_name':'assignment_1.pdf', 'time_ago': '8 hours', 'to_be_seen': 'False'}}], 'course_name':'Operating Systems', 'section':'Computer Science', 'calendar_notifications': ['05/24/2020', '05/25/2020', '01/01/2021'], 'role': 'Student', 'institution':'NSIT'}, {'lectures': [{'date_time': '05/24/2020, 15:00:00', 'notes': {'available': 'False'}, 'lecture_id': 2, 'submission': {'available': 'True', 'file_name':'submission_2.pdf', 'time_ago': '9 hours'}, 'assignment': {'available': 'True', 'file_name':'assignment_2.pdf', 'time_ago': '6 hours', 'to_be_seen': 'True'}}], 'course_name':'Computer Architecture', 'section':'Computer Science', 'calendar_notifications': ['05/24/2020', '05/22/2020', '05/21/2020', '05/24/2020'], 'role': 'Student', 'institution': 'NSIT'}], 'user_id': 4, 'email':'student_2@gmail.com'})

@app.route('/get_download_notes_url')
def get_download_notes_url():
   print(request.args.get('lecture_id'))
   return "signed url"


@app.route('/download_notes')
def download_notes():
   print(request.args.get('lecture_id'))
   print('notes downloaed by user')
   return jsonify({'courses': [{'lectures': [{'date_time': '05/24/2020, 11:30:00', 'notes': {'available': 'True', 'file_name':'notes_1.pdf', 'time_ago': '10 hours', 'to_be_seen': 'False'}, 'lecture_id': 1, 'submission': {'available': 'True', 'file_name':'sample.pdf', 'time_ago': '9 hours'} , 'assignment': {'available': 'True', 'file_name':'assignment_1.pdf', 'time_ago': '8 hours', 'to_be_seen': 'False'}}], 'course_name':'Operating Systems', 'section':'Computer Science', 'calendar_notifications': ['05/24/2020', '05/25/2020', '01/01/2021'], 'role': 'Student', 'institution':'NSIT'}, {'lectures': [{'date_time': '05/24/2020, 15:00:00', 'notes': {'available': 'False'}, 'lecture_id': 2, 'submission': {'available': 'True', 'file_name':'submission_2.pdf', 'time_ago': '9 hours'}, 'assignment': {'available': 'True', 'file_name':'assignment_2.pdf', 'time_ago': '6 hours', 'to_be_seen': 'True'}}], 'course_name':'Computer Architecture', 'section':'Computer Science', 'calendar_notifications': ['05/24/2020', '05/22/2020', '05/21/2020', '05/24/2020'], 'role': 'Student', 'institution': 'NSIT'}], 'user_id': 4, 'email':'student_2@gmail.com'})

@app.route('/view_submissions', methods = ['GET'])
def setcookie():
   resp = make_response('/table')
   submissions =  { 'submissions' : [{"user_id":1,"email":"abc@gmail.com", "name": "Raghav Khanna", "section" : "MPAE1", "roll_no" : "2017UMP3507", "time" : "3 hrs ago"}, {"user_id":1,"email":"abc@gmail.com", "name": "Pranay Kohli", "section" : "MPAE1", "roll_no" : "2017UMP3528", "time" : "15 min ago"}, {"user_id":1,"email":"abc@gmail.com", "name": "Akshay", "section" : "MPAE1", "roll_no" : "2017UMP3501", "time" : "1 day ago"}, {"user_id":1,"email":"abc@gmail.com", "name": "Arjun Sharma", "section" : "MPAE1", "roll_no" : "2017UMP3502", "time" : "4 hr ago"}]}
   value = json.dumps(submissions)
   print(value)
   resp.set_cookie('someCookie', json.dumps(submissions), 10000000000) #max_age in seconds
   return resp

@app.route('/redirect_submissions', methods = ['GET'])
def redirect_submissions():
   print(request.args.get('lecture_id'))
   return 'table'

@app.route('/get_submissions', methods = ['GET'])
@jwt_required
def get_submissions():
   print(request.args.get('lecture_id'))
   return jsonify({'submissions' : [{"user_id":1,"email":"abc@gmail.com", "name": "Raghav Khanna", "section" : "MPAE1", "roll_no" : "2017UMP3507", "time" : "3 hrs ago"}, {"user_id":1,"email":"abc@gmail.com", "name": "Pranay Kohli", "section" : "MPAE1", "roll_no" : "2017UMP3528", "time" : "15 min ago"}, {"user_id":1,"email":"abc@gmail.com", "name": "Akshay", "section" : "MPAE1", "roll_no" : "2017UMP3501", "time" : "1 day ago"}, {"user_id":1,"email":"abc@gmail.com", "name": "Arjun Sharma", "section" : "MPAE1", "roll_no" : "2017UMP3502", "time" : "4 hr ago"}]})

@app.route('/get_download_submission_url')
def get_download_submissin_url():
   print(request.args.get('user_id'))
   return "signed url"

@app.route('/add_comment')
def add_comment():
   print(request.args.get('lecture_id'))
   print(request.args.get('comment_text'))
   print(request.args.get('comment_type'))
   return {
   "comment_id":"1234",
   "username":"Raghav Khanna",
   "comment_text":"Lorem Ipsum",
   "timestamp":"12:04pm",
   "is_professor":'true'
}

@app.route('/get_comments')
def get_comments():
   return jsonify({
   "comments":[
      {
         "comment_id":"1234",
         "username":"Raghav",
         "comment_text":"Lorem Ipsum",
         "timestamp":"12:04pm",
         "is_professor": 'true',
         "is_self": 'true'
      },
      {
         "comment_id":"1234",
         "username":"Raghav",
         "comment_text":"Lorem Ipsum",
         "timestamp":"12:04pm",
         "is_professor": 'false',
         "is_self": 'true',
      }
   ]
})


@app.route('/save-post',methods=['POST'])
def savepost():
   return '200'

@app.route('/calendar-notif',methods=['GET'])
def notif():
   return "some random data"


@app.route('/logout')
def logout():
   return unset_jwt(), 302


@app.route('/')
@jwt_optional
def index():
   if(get_jwt_identity() != None):
      return render_template('dashboard.html')   
   return render_template('login.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#    return render_template('login.html')
   

# @app.route('/dashboard') 
# def dashboard():
#    return render_template('dashboard.html')


@app.route('/table')
def table():
   if(request.cookies.get('someCookie') == None):
      return redirect(app.config['BASE_URL'] + '/')
   return render_template('table.html')


@app.route('/course-content')
def course():
   return render_template('course-content.html')

@app.route('/account')
@jwt_required
def account():
   print(get_jwt_identity())
   return render_template('account.html')

@app.route('/register', methods = ['GET', 'POST'])
def register():
   if request.method == 'POST':
      print('now here')
      flash('You are now registered, confirm with you email', 'success')
   return redirect(url_for('login'))



   
if __name__ == '__main__':
   app.config['SECRET_KEY']='secret123'
   with app.app_context():
      cur = mysql.connection.cursor()
      cur.execute("SELECT email, password FROM UserCredentials")
      for row in cur:
         user_creds[row['email']] = row['password']
      cur.execute("SELECT email, role, course_id, college_name, branch_name, course_name FROM UserData ORDER BY 1, 2, 3")
      for row in cur:
         user_roles[row['email']] = row['role']
      cur.close()
   app.run(debug=True)
