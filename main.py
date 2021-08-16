from flask import Flask, render_template, request, redirect, url_for , session, blueprints
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, HiddenField
from werkzeug.security import generate_password_hash, check_password_hash
# from wtforms.validators import InputRequired, Email, Length

import shelve
# import tensorflow as tf
# import cv2
# import numpy as np

app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRET_KEY"
Bootstrap(app)

class LoginForm(FlaskForm):
    name = StringField('Name')
    password = PasswordField('Password')
    FRAuth = HiddenField('FRAuth')

class RegisterForm(FlaskForm):
    name = StringField('Name')
    password = PasswordField('Password')

@app.route("/", methods=['GET', 'POST'])
def login():
    d = shelve.open('Staff', 'c')
    names = list(d.keys())
    form = LoginForm()

    if form.validate_on_submit():
        if form.FRAuth.data == "False":
            if check_password_hash(d[form.name.data],form.password.data):
                session["Name"] = form.name.data
                session['logged_in'] = True
        elif form.FRAuth.data == "True":
            session["Name"] = form.name.data
            session['logged_in'] = True

        return redirect(url_for('home'))

        # if check_password_hash(d[form.name.data],form.password.data):
    d.close()

    return render_template('Login.html', form=form, names=names)


@app.route("/register", methods=['GET', 'POST'])
def register():
    d = shelve.open('Staff', 'c')
    names = list(d.keys())
    form = RegisterForm()

    if form.validate_on_submit():
        d[form.name.data] = generate_password_hash(form.password.data)
        return redirect(url_for('login'))

    d.close()

    return render_template('Register.html', form=form, names=names)

@app.route("/logout")
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

@app.route("/home", methods=['GET', 'POST'])
def home():
    if session.get('logged_in') != True:
        return redirect('/')
    return render_template('placeholder.html')

if __name__ == "__main__":
    app.run(debug=False)
