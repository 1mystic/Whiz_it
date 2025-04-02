from flask import Flask, render_template, send_from_directory
from flask_jwt_extended import JWTManager
from flask_caching import Cache
from config import Config
from models import init_db
from flask_mailman import Mail

jwt = JWTManager()
cache = Cache()
mail = Mail()


def create_app():
    app = Flask(__name__, 
                static_folder='../Client_CDN/vuefronttest/',
                static_url_path='',
                template_folder='../Client_CDN/vuefronttest/')
    
    app.config.from_object(Config)
    
    # app extention init
    init_db(app)
    jwt.init_app(app)
    
    mail.init_app(app)
    cache.init_app(app)
    
   
    
    
    # normal routes :  
    
    @app.route('/')
   
    def index():
        return render_template('index.html')

    @app.route('/src/<path:path>')
    def send_src(path):
        return send_from_directory('../Client_CDN/vuefronttest/', path)

    # all route for frontvue
    @app.route('/<path:path>')
    def catch_all(path):
        return render_template('index.html')
        
    return app
