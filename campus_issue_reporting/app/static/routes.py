from flask import render_template, redirect, url_for, request, flash
from flask_login import login_user, login_required, logout_user, current_user
from app import app, db
from app.models import User, Issue
from app.forms import LoginForm, RegisterForm, IssueForm
from flask_socketio import emit, join_room
from app.notifications import send_notification


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.password == form.password.data:
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Login Unsuccessful. Please check username and password', 'danger')
    return render_template('login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data,
                    email=form.email.data, password=form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Account created for ' + form.username.data, 'success')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)


@app.route('/dashboard')
@login_required
def dashboard():
    issues = Issue.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', issues=issues)


@app.route('/report_issue', methods=['GET', 'POST'])
@login_required
def report_issue():
    form = IssueForm()
    if form.validate_on_submit():
        issue = Issue(title=form.title.data,
                      description=form.description.data, user_id=current_user.id)
        db.session.add(issue)
        db.session.commit()
        send_notification(f"Issue '{form.title.data}' has been reported.")
        flash('Issue reported successfully!', 'success')
        return redirect(url_for('dashboard'))
    return render_template('report_issue.html', form=form)


@app.route('/admin_dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin:
        return redirect(url_for('dashboard'))
    issues = Issue.query.all()
    return render_template('admin_dashboard.html', issues=issues)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))
