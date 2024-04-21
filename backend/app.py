import os
from flask import Flask, request, sessions
from flask_migrate import Migrate
from flask_cors import CORS

from models import db, Artwork

app = Flask(__name__, static_folder=os.path.join(os.getcwd(), 'assets'))
app.secret_key = os.environ.get('SECRET_KEY', 'default_secret_key')  # Provides a fallback secret key

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///artworks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
Migrate(app, db)

# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})


@app.route('/api/artworks/<gallery_number>', methods=['GET'])
def get_artworks_by_gallery(gallery_number):
    if request.method == 'GET':
        print(f"Received gallery number: {gallery_number}")
        try:
            # Trim any whitespace and query the database for artworks by gallery number
            artworks = Artwork.query.filter_by(galleryNumber=gallery_number.strip()).all()
            print(f"Artworks found: {artworks}")
            # Convert each artwork object into dictionary format and return as JSON
            return [artwork.to_dict() for artwork in artworks], 200
        except Exception as e:
            print(f"Error: {str(e)}")
            return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
