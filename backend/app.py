import os
import requests
from flask import Flask, request, json, Response
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import func
from sqlalchemy.sql.expression import func
from models import db, Artwork, ToView, User, CollectionArtworks, Collection

app = Flask(__name__, static_folder=os.path.join(os.getcwd(), 'assets'))
app.secret_key = os.environ.get('SECRET_KEY', 'default_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///artworks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
Migrate(app, db)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})


# GET All Artworks by galleyNumber
@app.route('/api/artworks/<gallery_number>')
def get_artworks_by_gallery(gallery_number):
    try:
        artworks = Artwork.query.filter_by(galleryNumber=gallery_number.strip()).all()
        return [artwork.to_dict() for artwork in artworks], 200
    except Exception as e:
        return {"error": str(e)}, 500


# GET Artwork by objectID
@app.route('/api/artworks/by-id/<int:object_id>', methods=['GET'])
def get_artwork_by_id(object_id):
    artwork = Artwork.query.filter_by(objectID=object_id).first()
    if artwork:
        return artwork.to_dict(), 200
    else:
        return {'error': 'Artwork not found'}, 404

# GET all saved/to_view artworks for a user
@app.route('/api/saved-artworks/<int:user_id>', methods=['GET'])
def get_saved_artworks(user_id):
    user = User.query.get(user_id)
    if not user:
        return {'error': 'User not found'}, 404
    
    to_views = ToView.query.filter_by(user_id=user.id, is_active=True).all()
    saved_artworks = [view.artwork.to_dict() for view in to_views if view.artwork]
    return saved_artworks, 200

# POST a new artwork to a user's saved/to_view list
@app.route('/api/saved-artworks', methods=['POST'])
def save_artwork():
    json_data = request.get_json()
    user_id = json_data.get('user_id')
    object_id = json_data.get('object_id')


    user = User.query.get(user_id)
    if not user:
        return {'error': 'User not found'}, 404
    
    artwork = Artwork.query.filter_by(objectID=object_id).first()
    if not artwork:
        return {'error': 'Artwork not found'}, 404

    existing_view = ToView.query.filter_by(user_id=user_id, artwork_objectID=object_id, is_active=True).first()
    if existing_view:
        return {'message': 'Artwork already saved'}, 200

    # Save new view
    new_view = ToView(user_id=user_id, artwork_objectID=object_id, is_active=True)
    db.session.add(new_view)
    db.session.commit()

    return {'message': 'Artwork saved'}, 201


# PATCH to update (mark as inactive) a saved artwork 
#using endpoint from to_view table ID of save artwork
@app.route('/api/saved-artworks/<int:view_id>', methods=['PATCH'])
def update_saved_artwork(view_id):
    to_view = ToView.query.get(view_id)
    if not to_view:
        return {'error': 'Saved artwork not found'}, 404
    
    to_view.is_active = False  # Mark the artwork view as inactive
    db.session.commit()
    
    return {'message': 'Artwork marked as inactive'}, 200


# Collections / GET POST DELETE / Collection{id}
#GET all collections for a user
@app.route('/api/collections')
def get_collections():
    collections = Collection.query.all()
    return {'collections': [collection.to_dict() for collection in collections]}, 200

#Create collection and Add artwork to collection
@app.route('/api/collections', methods=['POST'])
def create_collection():
    json_data = request.get_json()
    user_id = json_data.get('user_id')
    name = json_data.get('name')
    artwork_objectID = json_data.get('artwork_objectID', None)

    user = User.query.get(user_id)
    if not user:
        return {'error': 'User not found'}, 404

    new_collection = Collection(name=name, user_id=user_id)
    db.session.add(new_collection)
    db.session.flush()  # Flush to assign an ID to new_collection without committing transaction

    if artwork_objectID:
        artwork = Artwork.query.filter_by(objectID=artwork_objectID).first()
        if not artwork:
            db.session.rollback()  # Roll back if the artwork doesn't exist
            return {'error': 'Artwork not found'}, 404
        new_artwork_in_collection = CollectionArtworks(
            collection_id=new_collection.id, 
            artwork_objectID=artwork.objectID, 
            is_active=True
        )
        db.session.add(new_artwork_in_collection)

    db.session.commit()

    return {'message': 'Collection created', 'collection': new_collection.to_dict()}, 201


##Scavenger Hunt - Request = random artworks / Post = user verify objectID
# @app.route('/api/scavenger-hunt', methods=['GET', 'POST'])
# def scavenger_hunt():
#     if request.method == 'GET':
#         try:
#             # Select 6 unique artworks ensuring each has a visible primary image and unique gallery number
#             artworks = Artwork.query \
#                 .filter(Artwork.primaryImageSmall != None, Artwork.primaryImageSmall != '') \
#                 .distinct(Artwork.galleryNumber) \
#                 .order_by(func.random()) \
#                 .limit(6) \
#                 .all()

#             results = [artwork.to_dict(rules=('-collections', '-to_views')) for artwork in artworks]
#             return {'artworks': results}, 200
#         except Exception as e:
#             return {'error': str(e)}, 500

#     elif request.method == 'POST':
#         # verify if the user has found the correct artwork by entering the ObjectID
#         json_data = request.get_json()
#         object_id = json_data.get('objectID')
#         user_input = json_data.get('userInput')

#         try:
#             artwork = Artwork.query.filter_by(objectID=object_id).first()
#             if not artwork:
#                 return {'error': 'Artwork not found'}, 404

#             # Check ObjectID of the artwork
#             if str(artwork.objectID) == user_input:
#                 return {'message': 'Correct! You have found the artwork.'}, 200
#             else:
#                 return {'message': 'Incorrect! Please try again.'}, 400
#         except Exception as e:
#             return {'error': str(e)}, 500












# @app.route('/api/user-artworks/<int:user_id>', methods=['GET'])
# def get_user_artworks(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return Response(json.dumps({'error': 'User not found'}), mimetype='application/json'), 404

#     to_views = ToView.query.filter_by(user_id=user.id, is_active=True).all()
#     print(f"Found {len(to_views)} active views for user ID {user_id}")

#     artworks = []
#     for view in to_views:
#         artwork = Artwork.query.get(view.artwork_objectID)
#         if artwork:
#             artworks.append({
#                 'objectID': artwork.objectID,
#                 'title': artwork.title,
#                 'galleryNumber': artwork.galleryNumber,
#                 'artistName': artwork.artistName,
#                 'primaryImageSmall': artwork.primaryImageSmall
#             })
#         else:
#             print(f"Artwork with objectID {view.artwork_objectID} not found")

#     if artworks:
#         return Response(json.dumps({'artworks': artworks}), mimetype='application/json'), 200
#     else:
#         return Response(json.dumps({'artworks': [], 'message': 'No artworks found'}), mimetype='application/json'), 200



# # Modified to include setting is_active flag
# @app.route('/api/user-to-view', methods=['POST'])
# def user_to_view():
#     json_data = request.get_json()
#     print("Received JSON:", json_data)  # Debugging output

#     user_id = json_data.get('user_id')
#     objectID = json_data.get('objectID')

#     if not user_id or not objectID:
#         return Response(json.dumps({'error': 'Missing user_id or objectID'}), mimetype='application/json'), 400

#     user = User.query.get(user_id)
#     if not user:
#         return Response(json.dumps({'error': 'User not found'}), mimetype='application/json'), 404

#     artwork = Artwork.query.get(objectID)
#     if not artwork:
#         return Response(json.dumps({'error': 'Artwork not found'}), mimetype='application/json'), 404

#     existing_view = ToView.query.filter_by(user_id=user.id, artwork_objectID=artwork.objectID, is_active=True).first()
#     if existing_view:
#         return Response(json.dumps({'message': 'Artwork already saved'}), mimetype='application/json'), 200

#     new_to_view = ToView(user_id=user.id, artwork_objectID=artwork.objectID, is_active=True)
#     db.session.add(new_to_view)
#     db.session.commit()

#     print("New view added:", new_to_view)  # Debugging output
#     return Response(json.dumps({'message': 'Artwork saved successfully'}), mimetype='application/json'), 201


# # Add endpoint to deactivate a saved view
# @app.route('/api/user-to-view/<int:objectID>', methods=['DELETE'])
# def delete_user_artwork(objectID):
#     user_id = request.headers.get('User-ID')
#     to_view = ToView.query.filter_by(artwork_objectID=objectID, user_id=user_id).first()
#     if not to_view:
#         return {'error': 'Artwork not found or not associated with user'}, 404

#     to_view.is_active = False  # Mark as inactive instead of deleting
#     db.session.commit()
#     return {'message': 'Artwork moved to history'}, 200

# # Existing collections management adjusted for error handling and cleanup
# @app.route('/api/collections/<username>', methods=['GET'])
# def get_user_collections(username):
#     user = User.query.filter_by(username=username).first()
#     if not user:
#         return {'error': 'User not found'}, 404

#     collections = [collection.to_dict() for collection in user.collections]
#     return {'collections': collections}, 200

# @app.route('/api/collections', methods=['POST'])
# def create_collection():
#     json_data = request.get_json()
#     user = User.query.filter_by(username=json_data.get('username')).first()
#     if not user:
#         return {'error': 'User not found'}, 404

#     collection = Collection(name=json_data['name'], user_id=user.id)
#     db.session.add(collection)
#     db.session.commit()

#     # Optionally add artwork to new collection if provided
#     if json_data.get('objectID'):
#         artwork = Artwork.query.filter_by(objectID=json_data.get('objectID')).first()
#         if artwork:
#             new_artwork_in_collection = CollectionArtworks(collection_id=collection.id, artwork_objectID=artwork.objectID, is_active=True)
#             db.session.add(new_artwork_in_collection)
#             db.session.commit()

#     return {'id': collection.id, 'name': collection.name, 'user_id': user.id}, 201

# # Detailed management of artworks in collections
# @app.route('/api/collections/<int:collection_id>/artworks', methods=['POST', 'DELETE'])
# def collection_artworks(collection_id):
#     collection = Collection.query.get(collection_id)
#     if not collection:
#         return {'error': 'Collection not found'}, 404

#     json_data = request.get_json()
#     artwork = Artwork.query.get(json_data['artwork_id'])
#     if not artwork:
#         return {'error': 'Artwork not found'}, 404

#     if request.method == 'POST':
#         # Logic to add artwork to collection, check if already added
#         return {'message': 'Updated collection with artwork'}, 200
#     elif request.method == 'DELETE':
#         # Logic to remove artwork from collection
#         return {'message': 'Artwork removed from collection'}, 200

# # Simplify error handling and manage collections with DELETE and PATCH
# @app.route('/api/collections/<int:collection_id>', methods=['DELETE', 'PATCH'])
# def manage_collection(collection_id):
#     collection = Collection.query.get(collection_id)
#     if not collection:
#         return {'error': 'Collection not found'}, 404

#     if request.method == 'DELETE':
#         db.session.delete(collection)
#         db.session.commit()
#         return {}, 204
#     elif request.method == 'PATCH':
#         json_data = request.get_json()
#         for key, value in json_data.items():
#             setattr(collection, key, value)
#         db.session.commit()
#         return collection.to_dict(), 200

