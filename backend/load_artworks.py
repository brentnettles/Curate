# import json
# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///artworks.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

class Artist(db.Model):
    artistID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    nationality = db.Column(db.String(255))
    beginDate = db.Column(db.String(120))
    endDate = db.Column(db.String(120))
    wikidataURL = db.Column(db.String(255))
    ulanURL = db.Column(db.String(255))
    artworks = db.relationship('Artwork', backref='artist', lazy=True)

class Artwork(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    objectID = db.Column(db.Integer, unique=True, nullable=False)
    isHighlight = db.Column(db.Boolean)
    accessionNumber = db.Column(db.String(120))
    accessionYear = db.Column(db.String(120))
    isPublicDomain = db.Column(db.Boolean)
    primaryImage = db.Column(db.String(255))
    primaryImageSmall = db.Column(db.String(255))
    additionalImages = db.Column(db.Text)  # Store as JSON string
    department = db.Column(db.String(255))
    objectName = db.Column(db.String(255))
    title = db.Column(db.String(255))
    artistID = db.Column(db.Integer, db.ForeignKey('artist.artistID'))
    medium = db.Column(db.String(255))
    dimensions = db.Column(db.Text)
    galleryNumber = db.Column(db.String(120), index=True)
    classification = db.Column(db.String(255))
    repository = db.Column(db.String(255))
    objectURL = db.Column(db.String(255))

def load_artworks(json_path='artworks.json'):
    with open(json_path, 'r') as file:
        artworks_data = json.load(file)
        for artwork_data in artworks_data:
            constituents = artwork_data.get('constituents')
            artist_id = None

            if constituents:
                artist_data = constituents[0]
                artist = Artist.query.filter_by(name=artist_data.get('name')).first()
                if not artist:
                    artist = Artist(
                        name=artist_data.get('name', 'Unknown Artist'),
                        nationality=artwork_data.get('artistNationality', 'Unknown'),
                        beginDate=artwork_data.get('artistBeginDate', ''),
                        endDate=artwork_data.get('artistEndDate', ''),
                        wikidataURL=artist_data.get('constituentWikidata_URL', ''),
                        ulanURL=artist_data.get('constituentULAN_URL', '')
                    )
                    db.session.add(artist)
                    db.session.flush()
                artist_id = artist.artistID

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
                artistID=artist_id,
                medium=artwork_data['medium'],
                dimensions=artwork_data['dimensions'],
                galleryNumber=artwork_data.get('GalleryNumber', ''),
                classification=artwork_data['classification'],
                repository=artwork_data['repository'],
                objectURL=artwork_data['objectURL']
            )
            db.session.add(artwork)
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()  # Drop all tables
        db.create_all()  # Recreate all tables
        load_artworks()  # Load artwork data



# import json
# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy


# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///artworks.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

# class Artwork(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     objectID = db.Column(db.Integer, unique=True, nullable=False)
#     galleryNumber = db.Column(db.String(120), index=True, nullable=True)
#     primaryImage = db.Column(db.String(255))
#     primaryImageSmall = db.Column(db.String(255))
#     objectName = db.Column(db.String(255))
#     title = db.Column(db.String(255))
#     artistDisplayName = db.Column(db.String(255))

# def load_artworks(json_path='artworks.json', gallery_numbers=None):
#     with open(json_path, 'r') as file:
#         artworks_data = json.load(file)
#         for artwork_data in artworks_data:
#             if gallery_numbers and artwork_data.get('GalleryNumber') not in gallery_numbers:
#                 continue  # Skip artworks not in the specified gallery numbers
#             artwork = Artwork(
#                 objectID=artwork_data['objectID'],
#                 galleryNumber=artwork_data.get('GalleryNumber', ''),
#                 primaryImage=artwork_data.get('primaryImage', ''),
#                 primaryImageSmall=artwork_data.get('primaryImageSmall', ''),
#                 objectName=artwork_data.get('objectName', ''),
#                 title=artwork_data.get('title', ''),
#                 artistDisplayName=artwork_data.get('artistDisplayName', '')
#             )
#             db.session.add(artwork)
#         db.session.commit()

# if __name__ == '__main__':
#     with app.app_context():
#         db.drop_all()  # Drop all tables
#         db.create_all()  # Create all tables based on the models defined
#         load_artworks(gallery_numbers=['512', '516'])