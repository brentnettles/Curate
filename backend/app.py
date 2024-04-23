import os
from flask import Flask, request, sessions
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import func

from models import db, Artwork, ToView, User

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

            artworks = Artwork.query.filter_by(galleryNumber=gallery_number.strip()).all()
            print(f"Artworks found: {artworks}")            # Convert each artwork object into dictionary format and return as JSON
            return [artwork.to_dict() for artwork in artworks], 200
        except Exception as e:
            print(f"Error: {str(e)}")
            return {"error": str(e)}, 500
        
@app.route('/api/user-to-view/<username>', methods=['GET'])
def get_user_to_view(username):
    print("Requested username:", username)  # Debug print to check what username is received
    # Fetch user by username, using case-insensitive match
    user = User.query.filter(func.lower(User.username) == func.lower(username.strip())).first()
    if not user:
        print(f"User not found for username: {username}")  # More detailed debug information
        return {'error': 'User not found'}, 404

    try:
        # Fetch the artworks linked through the to_view association
        to_views = ToView.query.filter_by(user_id=user.id).all()
        artworks_data = [tv.artwork.to_dict() for tv in to_views]
        return {'artworks': artworks_data}, 200
    except Exception as e:
        print(f"Exception during fetching artworks for user {username}: {str(e)}")
        return {'error': str(e)}, 500



@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_data = [user.to_dict() for user in users]
    return {'users': users_data}, 200


if __name__ == '__main__':
    app.run(debug=True)
