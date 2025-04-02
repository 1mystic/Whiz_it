from flask_sqlalchemy import SQLAlchemy
#from flask_bcrypt import Bcrypt
from werkzeug.security import generate_password_hash, check_password_hash

from datetime import datetime, timedelta
import jwt
from config import Config as cfg
JWT_SECRET_KEY = cfg.JWT_SECRET_KEY
JWT_EXPIRATION_DELTA = cfg.JWT_EXPIRATION_DELTA

# Initialize database and bcrypt

db = SQLAlchemy()

# JWT secret key

# new way bbase
class DBase(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class User(DBase):
    __tablename__ = 'users'
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)    
    qualification = db.Column(db.String(120), nullable=True)
    dob = db.Column(db.Date, nullable=True)
    role = db.Column(db.String(10), nullable=False, default='user')  # 'user' or 'admin'
    remember_token = db.Column(db.String(100), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_jwt(self):
        payload = {
            'user_id': self.id,
            'role': self.role,
            'exp': datetime.now() + JWT_EXPIRATION_DELTA
        }
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

    @staticmethod
    def decode_jwt(token):
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None  # Token expired
        except jwt.InvalidTokenError:
            return None  # Invalid token


class Subject(DBase):
    __tablename__ = 'subjects'

    name = db.Column(db.String(120), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    chapters = db.relationship('Chapter', backref='subject', lazy=True, cascade="all, delete-orphan")


    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }
        
class Chapter(DBase):
    __tablename__ = 'chapters'

    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    quizzes = db.relationship('Quiz', backref='chapter', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'subject': self.subject.name if self.subject else None
        }
class Quiz(DBase):
    __tablename__ = 'quizzes'

    title = db.Column(db.String(120), nullable=False)
    date_of_quiz = db.Column(db.DateTime, nullable=False)
    time_duration = db.Column(db.Interval, nullable=False)
    remarks = db.Column(db.Text, nullable=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id'), nullable=False)
    questions = db.relationship('Question', backref='quiz', lazy=True, cascade="all, delete-orphan")
    scores = db.relationship('Score', backref='quiz', lazy=True, cascade="all, delete-orphan")
    release_at = db.Column(db.DateTime, nullable=True)

class Question(DBase):
    __tablename__ = 'questions'

    question_statement = db.Column(db.Text, nullable=False)
    option1 = db.Column(db.String(120), nullable=False)
    option2 = db.Column(db.String(120), nullable=False)
    option3 = db.Column(db.String(120), nullable=True)
    option4 = db.Column(db.String(120), nullable=True)
    correct_option = db.Column(db.Integer, nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)

class Score(DBase):
    __tablename__ = 'scores'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    timestamp_of_attempt = db.Column(db.DateTime, default=datetime.now)
    responses = db.Column(db.Text, nullable=False)
    total_score = db.Column(db.Float, nullable=False)
   

def init_db(app):
    db.init_app(app)    
    with app.app_context():
        db.create_all()
        #  admin
        if not User.query.filter_by(role='admin').first():
            admin = User(
                email='admin@example.com',
                full_name='Administrator',
                role='admin'
            )
            admin.set_password('admin0')  # Admin password
            db.session.add(admin)
            db.session.commit()

