import json
from app import app, db
from models import User, Artwork, ToView, Collection, CollectionArtworks
from werkzeug.security import generate_password_hash

def load_users():
    users_info = [
        {"username": "Mike", "password": generate_password_hash("mike123"), "first_name": "Mike", "last_name": "Hussey", "email_address": "mike@example.com"},
        {"username": "Ben", "password": generate_password_hash("ben123"), "first_name": "Ben", "last_name": "Ten", "email_address": "ben@example.com"}
    ]
    for user_info in users_info:
        user = User(**user_info)
        db.session.add(user)
    db.session.commit()

def load_artworks(json_path='artworks.json'):
    with open(json_path, 'r') as file:
        artworks_data = json.load(file)
        for artwork_data in artworks_data:
            artwork = Artwork(
                objectID=artwork_data['objectID'],
                isHighlight=artwork_data.get('isHighlight', False),
                artistDisplayName=artwork_data.get('artistDisplayName', 'Unknown'),
                artistDisplayBio=artwork_data.get('artistDisplayBio', ''),
                medium=artwork_data.get('medium', ''),
                objectDate=artwork_data.get('objectDate', ''),
                classification=artwork_data.get('classification', ''),
                accessionNumber=artwork_data.get('accessionNumber', ''),
                accessionYear=artwork_data.get('accessionYear', ''),
                isPublicDomain=artwork_data.get('isPublicDomain', False),
                primaryImage=artwork_data.get('primaryImage', ''),
                primaryImageSmall=artwork_data.get('primaryImageSmall', ''),
                department=artwork_data.get('department', ''),
                objectName=artwork_data.get('objectName', ''),
                title=artwork_data.get('title', ''),
                artistName=artwork_data.get('artistName', 'Unknown'),
                artistBeginDate=artwork_data.get('artistBeginDate', ''),
                artistEndDate=artwork_data.get('artistEndDate', ''),
                dimensions=artwork_data.get('dimensions', ''),
                galleryNumber=artwork_data.get('galleryNumber', ''),
                objectURL=artwork_data.get('objectURL', '')
            )
            db.session.add(artwork)
        db.session.commit()

def create_to_views():
    users = User.query.all()
    artworks = Artwork.query.all()
    for user in users:
        for artwork in artworks[:2]:  # Just adding views for the first two artworks for simplicity
            new_to_view = ToView(user_id=user.id, artwork_objectID=artwork.objectID, is_active=True)
            db.session.add(new_to_view)
    db.session.commit()

def create_collections():
    users = User.query.all()
    artworks = list(Artwork.query.all())
    for user in users:
        collection = Collection(name=f"{user.username}'s Favorites", user_id=user.id)
        db.session.add(collection)
        db.session.flush()  # Flush to use the collection id below
        for artwork in artworks[:3]:  # Add first three artworks to each user's collection
            collection_artwork = CollectionArtworks(collection_id=collection.id, artwork_objectID=artwork.objectID, is_active=True)
            db.session.add(collection_artwork)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()  # Caution: this will drop all data
        db.create_all()  # Recreate tables
        load_users()
        load_artworks()
        create_to_views()
        create_collections()
