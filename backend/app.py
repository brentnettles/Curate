import os
import requests
from flask import Flask, request, json, Response
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
    try:
        artworks = Artwork.query.filter_by(galleryNumber=gallery_number.strip()).all()
        return Response(json.dumps([artwork.to_dict() for artwork in artworks]), mimetype='application/json'), 200
    except Exception as e:
        return Response(json.dumps({"error": str(e)}), mimetype='application/json'), 500



#MET API SEARCHES -------
@app.route('/api/search', methods=['GET'])
def search_artworks():
    query = request.args.get('q', '')
    isHighlight = request.args.get('isHighlight', '')
    isOnView = request.args.get('isOnView', '')
    departmentId = request.args.get('departmentId', '')

    search_url = f"https://collectionapi.metmuseum.org/public/collection/v1/search?q={query}&isHighlight={isHighlight}&isOnView={isOnView}&departmentId={departmentId}"
    try:
        response = requests.get(search_url)
        if response.status_code == 200:
            return Response(response.text, mimetype='application/json'), 200
        else:
            return Response(json.dumps({"error": "Failed to fetch data from The Met API"}), mimetype='application/json'), response.status_code
    except Exception as e:
        return Response(json.dumps({"error": str(e)}), mimetype='application/json'), 500
    
@app.route('/api/search/complete', methods=['GET'])
def search_artworks_complete():
    query = request.args.get('q', '')
    isHighlight = request.args.get('isHighlight', '')
    isOnView = request.args.get('isOnView', '')
    departmentId = request.args.get('departmentId', '')
    limit = int(request.args.get('limit', 100))

    search_url = f"https://collectionapi.metmuseum.org/public/collection/v1/search?q={query}&isHighlight={isHighlight}&isOnView={isOnView}&departmentId={departmentId}"
    search_response = requests.get(search_url)

    if search_response.status_code == 200:
        search_results = search_response.json()
        object_details = []
        fetched_ids = set()

        for object_id in search_results.get('objectIDs', [])[:limit]:
            if object_id not in fetched_ids:
                detail_url = f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}"
                detail_response = requests.get(detail_url)
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    object_details.append({
                        'objectID': detail_data['objectID'],
                        'title': detail_data.get('title', ''),
                        'artistDisplayName': detail_data.get('artistDisplayName', ''),
                        'primaryImageSmall': detail_data.get('primaryImageSmall', ''),
                    })
                    fetched_ids.add(object_id)

        return Response(json.dumps(object_details), mimetype='application/json'), 200
    else:
        return Response(json.dumps({"error": "Failed to fetch data from The Met API"}), mimetype='application/json'), search_response.status_code


@app.route('/api/user-to-view', methods=['POST'])
def user_to_view():
    json_data = request.get_json()
    username = json_data.get('username')
    objectID = json_data.get('objectID')
    galleryNumber = json_data.get('galleryNumber')

    if not username or not objectID or not galleryNumber:
        return Response(json.dumps({'error': 'Missing data'}), mimetype='application/json'), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return Response(json.dumps({'error': 'User not found'}), mimetype='application/json'), 404

    artwork = Artwork.query.filter_by(objectID=objectID).first()
    if not artwork:
        return Response(json.dumps({'error': 'Artwork not found'}), mimetype='application/json'), 404

    existing_view = ToView.query.filter_by(user_id=user.id, artwork_id=artwork.id).first()
    if existing_view:
        return Response(json.dumps({'message': 'Artwork already saved'}), mimetype='application/json'), 200

    try:
        new_to_view = ToView(user_id=user.id, artwork_id=artwork.id, username=username, galleryNumber=galleryNumber)
        db.session.add(new_to_view)
        db.session.commit()
        return Response(json.dumps({'message': 'Artwork saved successfully'}), mimetype='application/json'), 201
    except Exception as e:
        db.session.rollback()
        return Response(json.dumps({"error": str(e)}), mimetype='application/json'), 500

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return Response(json.dumps({'users': [user.to_dict() for user in users]}), mimetype='application/json'), 200
    except Exception as e:
        return Response(json.dumps({"error": str(e)}), mimetype='application/json'), 500

if __name__ == '__main__':
    app.run(debug=True)
