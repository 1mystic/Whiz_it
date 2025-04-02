from datetime import datetime, timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///quizmdb.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = '1mystic2'
    JWT_EXPIRATION_DELTA = False
    JWT_ACCESS_TOKEN_EXPIRES = False # minutes
    
    
    # Redis and Celery 
    REDIS_URL = 'redis://localhost:6379/0'
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    
    #Caching 
    CACHE_TYPE = 'redis'
    CACHE_REDIS_URL = 'redis://localhost:6379/0'
    CACHE_DEFAULT_TIMEOUT = 300  # 5 minutes default cache timeout
    
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USERNAME = 'mail.whiz.it@gmail.com'
    MAIL_PASSWORD = 'ergptxeyzovqclsh'
    MAIL_USE_TLS = True    
    MAIL_DEFAULT_SENDER = 'mail.whiz.it@gmail.com'
    MAIL_TIMEOUT = 30  # timeout sec
    MAIL_USE_SSL = False
    
    
    '''
     # SMTP Configuration
    SMTP_SERVER = 'localhost'
    SMTP_PORT = 1025 
    SMTP_USERNAME = 'mail.whiz.it@gmail.com'
    SMTP_PASSWORD = ''
    SMTP_SENDER = 'mail.whiz.it@gmail.com'
    '''
    
    
    