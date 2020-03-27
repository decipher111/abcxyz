from flask import Flask, render_template, flash, redirect, url_for, session, request, logging
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

@app.route('/')
def index():
   return render_template('_signin.html')

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
          print(email)
          flash('This username is not registered with us. Please get in touch '
          'with us or college authorities for more information.', 'failure')
          return render_template('_signin.html')
     if user_cred has email:
	  flash('This username is already registered with us. Please sign-in.', 'failure')
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
      ç
      email = request.form['email']
      user_password = request.form['password']

      cur = mysql.connection.cursor()

      result = cur.execute("SELECT * FROM UserCredentials WHERE email = %s", [email])

      if result > 0:
         data = cur.fetchone() #returns tuple?
         password = data['password']

         if sha256_crypt.verify(user_password, password):
               return render_template('dashboard.html')
         else:
               print('password not matched!')
   return render_template('login.html')


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
