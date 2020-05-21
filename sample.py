from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify, make_response, send_file
from flask_mysqldb import MySQL
from wtforms import Form, StringField, TextAreaField, PasswordField, validators, DateField, IntegerField
from passlib.hash import sha256_crypt
from functools import wraps
import datetime
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

# def is_logged_in(f):
#     @wraps(f)
#     def wrap(*args, **kwargs):
#         if 'logged_in' in session:
#             return f(*args, **kwargs)
#         else:
#             flash('Unauthorized, Please login', 'danger')
#             return redirect(url_for('login'))
#     return wrap


def assign_access_refresh_tokens(user_id, url):
    access_token = create_access_token(identity=str(user_id))
    refresh_token = create_refresh_token(identity=str(user_id))
    resp = make_response(redirect(url, 302))
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    print(access_token)
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
   return jsonify({
   "user_id":1,
   "email":"abc@gmail.com",
   "courses":[
      {
         "course_id":1,
         "course_name":"Computer Science",
         "section":"CS0421",
         "institution":"NSIT",
         "role":"Student",
         "lectures":[
            {
               "lecture_id":524351,
               "course_id":"CS100",
               "date_time":"04/20/2020, 10:30:00",
               "notes_available":"true",
               "assignment_available":"true",
               "submissions":32,
               "assignment_to_be_seen":'false',
               "notes_to_be_seen":'true',
               "submitted":'true'
            },
            {
               "lecture_id":124351,
               "course_id":"CS101",
               "date_time":"04/20/2020, 11:30:00",
               "notes_available":"false",
               "assignment_available":"false",
               "submissions":0,
               "assignment_to_be_seen":'false',
               "notes_to_be_seen":'false',
               "submitted":'false'
            },
            {
               "lecture_id":832345,
               "course_id":"CS102",
               "date_time":"04/20/2020, 12:30:00",
               "notes_available":"false",
               "assignment_available":"true",
               "submissions":0,
               "assignment_to_be_seen":'true',
               "notes_to_be_seen":'false',
               "submitted":'false'
            }
         ]
      }
   ]
})


   
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
   return ''

@app.route('/get_upload_notes_url')
def get_upload_notes_url():
    print(request.args.get('lecture_id'))
    return 'signedurl'

@app.route('/upload_notes')
def upload_notes():
   print(request.args.get('lecture_id'))
   print('notes uploaded by prof')
   return ''

@app.route('/get_download_assignment_url')
def get_download_assignment_url():
   print(request.args.get('lecture_id'))
   return "signed url"


@app.route('/download_assignment')
def download_assignment():
   print(request.args.get('lecture_id'))
   print('assignment downloaed by user')
   return ""

@app.route('/get_download_notes_url')
def get_download_notes_url():
   print(request.args.get('lecture_id'))
   return "signed url"


@app.route('/download_notes')
def download_notes():
   print(request.args.get('lecture_id'))
   print('notes downloaed by user')
   return ""

@app.route('/submissions', methods = ['GET'])
def setcookie():
   resp = make_response('/table')
   submissions =  {"user_id":1,"email":"abc@gmail.com", "name": "Raghav Khanna", "section" : "MPAE1", "roll_no" : "2017UMP3507", "time" : "3 hrs ago"}
   value = json.dumps(submissions)
   print(value)
   resp.set_cookie('someCookie', json.dumps(submissions), 10) #max_age in seconds
   return resp


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
