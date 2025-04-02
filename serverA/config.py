from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///quizmdb.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '1mystic2')  # Use a more secure secret key in .env
    JWT_EXPIRATION_DELTA = False
    JWT_ACCESS_TOKEN_EXPIRES = False  # minutes

    # Redis and Celery
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

    # Caching
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'redis')
    CACHE_REDIS_URL = os.getenv('CACHE_REDIS_URL', 'redis://localhost:6379/0')
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', 300))  # 5 minutes default cache timeout

    # Mail
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', 'mail.whiz.it@gmail.com')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')  # Should be set in .env
    MAIL_USE_TLS = bool(os.getenv('MAIL_USE_TLS', True))
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'mail.whiz.it@gmail.com')
    MAIL_TIMEOUT = int(os.getenv('MAIL_TIMEOUT', 30))  # timeout sec
    MAIL_USE_SSL = bool(os.getenv('MAIL_USE_SSL', False))
