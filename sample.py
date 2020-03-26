from flask import Flask, render_template, flash, redirect, url_for, session, request, logging
from flask_mysqldb import MySQL
from wtforms import Form, StringField, TextAreaField, PasswordField, validators, DateField, IntegerField
from passlib.hash import sha256_crypt
from functools import wraps

app = Flask(__name__)

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '[19071999]'
app.config['MYSQL_DB'] = 'myflaskapp'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# init MYSQL
mysql = MySQL(app)
user_creds = {}
user_roles = {}

@app.route('/student-dashboard')
def studentdashboard():
   return render_template('/dashboard.html')

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

@app.route('/register', methods = ['GET', 'POST'])
def register():
   cur = mysql.connection.cursor()
   for row in cur.execute("SELECT email, password FROM UserCredentials").fetchall():
      user_creds[row["email"]] = user_creds[row["password"]]
   form = RegisterFrom(request.form)
   if request.method == 'POST' and form.validate():
      name = form.name.data
      email = form.email.data
      password = sha256_crypt.encrypt(str(form.password.data))

      cur = mysql.connection.cursor()

     # Execute query
      if user_roles[email] is None:
         flash('This username is not registered with us. Please get in touch with us or college authorities for more information', 'failure')
         return render_template('register.html', form=form)
      cur.execute("INSERT INTO UserCredentials(email, password) VALUES(%s, %s)", (email, password))
  
      # Commit to DB
      mysql.connection.commit()

      # Close connection
      cur.close()
      user_creds[email] = user_creds[password]

      flash('You are now registered and can log in', 'success')

      return redirect(url_for('login'))
   else:
	   if user_creds[form.email.data] == sha256_crypt.encrypt(str(form.password.data)):
	      return redirect(url_for('login'))
	   flash('Username or Password is incorrect. Register, if not a user yet.')
   return render_template('register.html', form=form)


if __name__ == '__main__':
   app.secret_key='secret123'
   cur = mysql.connection.cursor()
   for row in cur.execute("SELECT email, password FROM UserCredentials").fetchall():
	   user_creds[row["email"]] = row["password"]
   for row in cur.execute("SELECT email, role, course_id, college_name, branch_name, course_name FROM UserData ORDER BY 1, 2, 3").fetchall():
	   user_roles[row["email"]] = row["role"]
   app.run(debug=True)
