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
   form = RegisterFrom(request.form)
   if request.method == 'POST':
      email = form.email.data
      password = sha256_crypt.encrypt(str(form.password.data))

      cur = mysql.connection.cursor()
      print()
      if user_roles[email] is None:
         flash('This username is not registered with us. Please get in touch '
         'with us or college authorities for more information.', 'danger')
         return render_template('_signin.html')

      if email in user_creds:
         flash('This username is already registered with us. Please sign-in.', 'danger')
         return render_template('_signin.html')

      cur.execute("INSERT INTO UserCredentials(email, password) VALUES(%s, %s)", (email, password))
      mysql.connection.commit()
      cur.close()

      user_creds[email] = password
      flash('You are now registered and can log in', 'success')
      return redirect(url_for('index'))
   elif request.method == 'GET' and form.validate():
      if user_creds[form.email.data] is sha256_crypt.encrypt(str(form.password.data)):
         return redirect(url_for('index'))
      flash('Username or Password is incorrect. Register, if not a user yet.')
      return render_template('_signin.html')
   return render_template('register.html', form=form)

   # User login
@app.route('/login', methods=['GET', 'POST'])
def login():
   if request.method == 'POST':
      email = request.form['email']
      user_password = request.form['password']

      cur = mysql.connection.cursor()

      result = cur.execute("SELECT * FROM UserCredentials WHERE email = %s", [email])

      if result > 0:
         data = cur.fetchone() #returns tuple?
         password = data['password']

         if sha256_crypt.verify(user_password, password):
            session['logged_in'] = True
            session['email'] = email
            
            return redirect(url_for('dashboard'))
         else:
            error = 'Invalid Login'
            return render_template('login.html', error = error)
         cur.close()
      else: 
         error = 'Email not found'
         return render_template('login.html', error = error)
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
@app.route('/api/', methods=["POST"])
def main_interface():
   print('got a request form frontend')   
   response = request.get_json()
   print(response)
   data = 'data'
   return jsonify(data)


   
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
