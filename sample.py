from flask import Flask, render_template, flash, redirect, url_for, session, request, logging, jsonify
from flask_mysqldb import MySQL
from wtforms import Form, StringField, TextAreaField, PasswordField, validators, DateField, IntegerField
from passlib.hash import sha256_crypt
from functools import wraps

app = Flask(__name__)

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '19071999'
app.config['MYSQL_DB'] = 'myflaskapp'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# init MYSQL
mysql = MySQL(app)
user_creds = {}
user_roles = {}

def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('Unauthorized, Please login', 'danger')
            return redirect(url_for('login'))
    return wrap

@app.route('/')
def index():
   return redirect(url_for('login'))

@app.route('/table')
def table():
   return render_template('table.html')

@app.route('/course-content')
def course():
   return render_template('course-content.html')

# @app.route('/course-content', methods=["POST"])
# def courseContent():
#    print('got a request form frontend')   
#    response = request.get_json()
#    print(response)
#    data = 'data'
#    return redirect(url_for('login'))

@app.route('/account')
def account():
   return render_template('account.html')

class RegisterFrom(Form):
   name = StringField('Name', [validators.Length(min=1)])
   email = StringField('Email', [validators.Length(min=6)])
   password = PasswordField('Password', [validators.DataRequired(), validators.EqualTo('confirm', message='Passwords do not match')])
   confirm = PasswordField('Confirm Password')
   mobile_no = IntegerField('Mobile Number', [validators.Length(min=10)])
   address = TextAreaField('Address', [validators.length(max=200)])
   dob = DateField('Date of Birth',format='%d-%m-%Y')

def move_forward():
   #Moving forward code
   print("Moving Forward...")

@app.route('/register', methods = ['GET', 'POST'])
def register():
   if request.method == 'POST':
      print('now here')
      flash('You are now registered, confirm with you email', 'success')
   return redirect(url_for('login'))

   
#    form = RegisterFrom(request.form)
#    if request.method == 'POST':
#       email = form.email.data
#       password = sha256_crypt.encrypt(str(form.password.data))

#       cur = mysql.connection.cursor()
#       print()
#       if user_roles[email] is None:
#          flash('This username is not registered with us. Please get in touch '
#          'with us or college authorities for more information.', 'danger')
#          return render_template('_signin.html')

#       if email in user_creds:
#          flash('This username is already registered with us. Please sign-in.', 'danger')
#          return render_template('_signin.html')

#       cur.execute("INSERT INTO UserCredentials(email, password) VALUES(%s, %s)", (email, password))
#       mysql.connection.commit()
#       cur.close()

#       user_creds[email] = password
#       flash('You are now registered and can log in', 'success')
#       return redirect(url_for('index'))
#    elif request.method == 'GET' and form.validate():
#       if user_creds[form.email.data] is sha256_crypt.encrypt(str(form.password.data)):
#          return redirect(url_for('index'))
#       flash('Username or Password is incorrect. Register, if not a user yet.')
#       return render_template('_signin.html')
#    return render_template('register.html', form=form)

   # User login
@app.route('/login', methods=['GET', 'POST'])
def login():
   # if request.method == 'POST':
   #    email = request.form['email']
   #    user_password = request.form['password']

   #    cur = mysql.connection.cursor()

   #    result = cur.execute("SELECT * FROM UserCredentials WHERE email = %s", [email])

   #    if result > 0:
   #       data = cur.fetchone() #returns tuple?
   #       password = data['password']
         
   #       if sha256_crypt.verify(user_password, password):
   #          session['logged_in'] = True
   #          session['email'] = email
            
   #          return redirect(url_for('dashboard'))
   #       else:
   #          error = 'Invalid Login'
   #          return render_template('login.html', error = error)
   #       cur.close()
   #    else: 
   #       error = 'Email not found'
   #       return render_template('login.html', error = error)
   return render_template('login.html')

def dummy():
   print('Click!')

@app.route('/logout')
def logout():
   session.clear()
   flash('Logged Out', 'success')
   return redirect(url_for('login'))
   

@app.route('/dashboard') 
# @is_logged_in      ##FIX THISSSSS AFTERRR
def dashboard():
   return render_template('dashboard.html')















# TEST
@app.route('/api/')
def main_interface():
   print('got a request form frontend!')   
   username = request.args['username']
   password = request.args['password']
   print(username, password)
   return jsonify({"username" : username})
   

















@app.route('/get_time_table', methods=['GET', 'POST'])
def fun1():
   print('got this!')
   response = request.get_json   
   print(response)
   return jsonify({"user_id": 1, "email": "abc@gmail.com", "courses": [{"course_id": 1, "couse_name": "Microbiology", "section": "Biotechnology", "institution": "NSIT", "role": "Professor", "lectures": [{"lecture_id": 1, "course_id": 1, "date_time": "04/20/2020, 10:30:00", "notes_available": 'true', "assignment_available": 'true', "submissions": 1}]}]})















def generate_upload_signed_url(lecture_id, file_type, content_type):
    url = 'https://chalkboards_uploads.storage.googleapis.com/assignments/package.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=uploads%40chalkboards.iam.gserviceaccount.com%2F20200419%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20200419T000303Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&x-goog-signature=7515dbdb603692c326cd4c9c2732dd17297aa8dac27047cfe7abee8db23e9f093362b03a39d1bf463296225c9062fa45f39e7e36cad4f70e0070a9255daaf2b781f33f91c2d7dc18fb94f32b67e9bd6e7e674ec3822e85b847f8cc5f7da654f2e81c498a8d401b5a01ae70a2cc5effb5d9c1bc55a134ad4ebfd2340433e4f8b2b7db9f3dcc49ecce3dd326f05d3614cdb2324bebd3f6c834f728e1e710d76df929cb2a1fae03438f2cb8461e73bce9e6411d275d57f822712fa61da5e134fee2c2f7e4326e5bd7415c26877f23200dc4b4629a58f9620a9d2e1ddada40fbf23011a8f9e371b47c656bafa7d110a9b0c8b4f5afde4b667e15ef288d1dd2633574'
    return url

@app.route('/get_upload_assignment_url', methods=["POST"])
def get_upload_assignment_url():
    data = request.get_json()
    print(data)
    if (
        data is None
        or 'user_id' not in data
        or 'lecture_id' not in data
        or 'content_type' not in data):
        return flash('MALFORMED_REQUEST', 'danger')
    url = 'https://chalkboards_uploads.storage.googleapis.com/assignments/package.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=uploads%40chalkboards.iam.gserviceaccount.com%2F20200419%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20200419T000303Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&x-goog-signature=7515dbdb603692c326cd4c9c2732dd17297aa8dac27047cfe7abee8db23e9f093362b03a39d1bf463296225c9062fa45f39e7e36cad4f70e0070a9255daaf2b781f33f91c2d7dc18fb94f32b67e9bd6e7e674ec3822e85b847f8cc5f7da654f2e81c498a8d401b5a01ae70a2cc5effb5d9c1bc55a134ad4ebfd2340433e4f8b2b7db9f3dcc49ecce3dd326f05d3614cdb2324bebd3f6c834f728e1e710d76df929cb2a1fae03438f2cb8461e73bce9e6411d275d57f822712fa61da5e134fee2c2f7e4326e5bd7415c26877f23200dc4b4629a58f9620a9d2e1ddada40fbf23011a8f9e371b47c656bafa7d110a9b0c8b4f5afde4b667e15ef288d1dd2633574'
    return url



@app.route('/saveDoc', methods=["POST"])
def saveImage():
   data = request.form
   print(data)
   key = 'value'
   return jsonify({"key" : key})


   
if __name__ == '__main__':
   app.secret_key='secret123'
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
