from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user

auth =Blueprint('auth', __name__)

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method =='POST':
        email = request.form.get('email')
        first_name =request.form.get('firstName')
        last_name =request.form.get('lastName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        user = User.query.filter_by(email=email).first()
        # if user:
    #     flash('Email already exists. Try again!, category= 'error  ')
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method =='POST':
        email =request.form.get('email')
        password = request.form.get('password')
    
        user = User.query.filter_by(email =email).first():
        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')
                login_user(user, remember=True)
            else: 
                flash('Incorrect login, try again!', category='error')
        else:
            flash('Email does not exist.', category='error')
    # return render_template()