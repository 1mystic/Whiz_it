from factory import create_app, cache
from api import init_routes


app = create_app()
cache.init_app(app)
init_routes(app)
