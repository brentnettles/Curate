import json
from app import app, db
from models import Artwork
from sqlalchemy import text

#this is a helper function populate the db with artworks from artworks.json
#29,502 artworks store locally in the json file

def load_artworks(json_path='artworks.json'):
    with app.app_context():
        # Clear existing data in the artwork table
        db.session.execute(text('DELETE FROM artwork'))
        db.session.commit()

        with open(json_path, 'r') as file:
            artworks_data = json.load(file)
            for artwork_data in artworks_data:
                # Create a new Artwork instance, ensuring all fields are correctly assigned
                artwork = Artwork(
                    objectID=artwork_data['objectID'],
                    isHighlight=artwork_data['isHighlight'],
                    artistDisplayName=artwork_data.get('artistDisplayName', 'Unknown Artist'),
                    artistDisplayBio=artwork_data.get('artistDisplayBio', ''),
                    medium=artwork_data['medium'],
                    objectDate=artwork_data['objectDate'],
                    classification=artwork_data['classification'],
                    accessionNumber=artwork_data['accessionNumber'],
                    accessionYear=artwork_data['accessionYear'],
                    isPublicDomain=artwork_data['isPublicDomain'],
                    primaryImage=artwork_data['primaryImage'],
                    primaryImageSmall=artwork_data['primaryImageSmall'],
                    department=artwork_data['department'],
                    objectName=artwork_data['objectName'],
                    title=artwork_data['title'],
                    artistName=artwork_data.get('artistDisplayName', 'Unknown Artist'),
                    artistBeginDate=artwork_data.get('artistBeginDate', ''),
                    artistEndDate=artwork_data.get('artistEndDate', ''),
                    dimensions=artwork_data['dimensions'],
                    galleryNumber=artwork_data.get('GalleryNumber', ''),  # Ensure this line is correct
                    objectURL=artwork_data['objectURL']
                )
                db.session.add(artwork)
            db.session.commit()
            print('Artworks successfully loaded and database updated.')

if __name__ == '__main__':
    load_artworks() 
