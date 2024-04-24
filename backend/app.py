import os
from flask import Flask, request, sessions
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import func

from models import db, Artwork, ToView, User

app = Flask(__name__, static_folder=os.path.join(os.getcwd(), 'assets'))
app.secret_key = os.environ.get('SECRET_KEY', 'default_secret_key')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///artworks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
Migrate(app, db)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})

@app.route('/api/artworks/<gallery_number>', methods=['GET'])
def get_artworks_by_gallery(gallery_number):
    if request.method == 'GET':
        print(f"Received gallery number: {gallery_number}")
        try:

            artworks = Artwork.query.filter_by(galleryNumber=gallery_number.strip()).all()
            print(f"Artworks found: {artworks}")            # Convert each artwork object into dictionary format and return as JSON
            return [artwork.to_dict() for artwork in artworks], 200
        except Exception as e:
            print(f"Error: {str(e)}")
            return {"error": str(e)}, 500

@app.route('/api/user-to-view', methods=['POST'])
def user_to_view():
    json_data = request.get_json()
    username = json_data.get('username')
    objectID = json_data.get('objectID')
    galleryNumber = json_data.get('galleryNumber')  # Ensure you're extracting galleryNumber

    if not username or not objectID or not galleryNumber:
        return {'error': 'Missing data (username, objectID, or galleryNumber required)'}, 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return {'error': 'User not found'}, 404

    artwork = Artwork.query.filter_by(objectID=objectID).first()
    if not artwork:
        return {'error': 'Artwork not found'}, 404

    existing_view = ToView.query.filter_by(user_id=user.id, artwork_id=artwork.id).first()
    if existing_view:
        return {'message': 'Artwork already saved'}, 200

    try:
        new_to_view = ToView(user_id=user.id, artwork_id=artwork.id, username=username, galleryNumber=galleryNumber)
        db.session.add(new_to_view)
        db.session.commit()
        return {'message': 'Artwork saved successfully'}, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return {'users': [user.to_dict() for user in users]}, 200
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
