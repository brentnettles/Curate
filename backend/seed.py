import json
from app import app, db  # Ensure app is correctly imported from your main Flask application file
from models import User, Artwork, ToView

def load_artworks(json_path='artworks.json'):
    with open(json_path, 'r') as file:
        artworks_data = json.load(file)
        for artwork_data in artworks_data:
            # Safely get constituents and handle None case
            constituents = artwork_data.get('constituents') or [{}]  # Ensures a list with at least one empty dict
            constituent = constituents[0]  # Safe to access first item now

            additional_images = json.dumps(artwork_data.get('additionalImages', []))
            artwork = Artwork(
                objectID=artwork_data['objectID'],
                isHighlight=artwork_data['isHighlight'],
                accessionNumber=artwork_data['accessionNumber'],
                accessionYear=artwork_data['accessionYear'],
                isPublicDomain=artwork_data['isPublicDomain'],
                primaryImage=artwork_data['primaryImage'],
                primaryImageSmall=artwork_data['primaryImageSmall'],
                additionalImages=additional_images,
                department=artwork_data['department'],
                objectName=artwork_data['objectName'],
                title=artwork_data['title'],
                artistName=constituent.get('name', 'Unknown Artist'),
                artistNationality=artwork_data.get('artistNationality', 'Unknown'),
                artistBeginDate=artwork_data.get('artistBeginDate', ''),
                artistEndDate=artwork_data.get('artistEndDate', ''),
                artistWikidataURL=constituent.get('constituentWikidata_URL', ''),
                artistUlanURL=constituent.get('constituentULAN_URL', ''),
                medium=artwork_data['medium'],
                dimensions=artwork_data['dimensions'],
                galleryNumber=artwork_data.get('GalleryNumber', ''),
                classification=artwork_data['classification'],
                repository=artwork_data['repository'],
                objectURL=artwork_data['objectURL']
            )
            db.session.add(artwork)
        db.session.commit()

def create_users():
    users_data = [
        {'username': 'Mike', 'first_name': 'Mike', 'last_name': 'Dresser', 'email_address': 'Mike@smile.com'},
        {'username': 'Ben', 'first_name': 'Benjamin', 'last_name': 'Franklin', 'email_address': 'Ben@smile.com'}
    ]
    existing_users = User.query.with_entities(User.username).all()
    existing_usernames = {user.username for user in existing_users}
    
    new_users = [User(**user) for user in users_data if user['username'] not in existing_usernames]
    db.session.bulk_save_objects(new_users)
    db.session.commit()

def create_to_views():
    users = User.query.all()
    artwork_ids = [3584, 12822]
    artworks = Artwork.query.filter(Artwork.objectID.in_(artwork_ids)).all()
    artwork_map = {artwork.objectID: artwork for artwork in artworks}

    for user in users:
        for artwork_id in artwork_ids:
            if artwork_id in artwork_map:
                existing_to_view = ToView.query.filter_by(user_id=user.id, artwork_id=artwork_map[artwork_id].id).first()
                if not existing_to_view:
                    to_view = ToView(user_id=user.id, artwork_id=artwork_map[artwork_id].id)
                    db.session.add(to_view)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()  # Drop all tables
        db.create_all()  # Recreate all tables
        load_artworks()  # Load artwork data
        create_users()
        create_to_views()
