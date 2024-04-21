from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

db = SQLAlchemy()

class Artist(db.Model, SerializerMixin):
    __tablename__ = 'artist'

    artistID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    nationality = db.Column(db.String(255))
    beginDate = db.Column(db.String(120))
    endDate = db.Column(db.String(120))
    wikidataURL = db.Column(db.String(255))
    ulanURL = db.Column(db.String(255))
    artworks = db.relationship('Artwork', backref='artist', lazy=True)

class Artwork(db.Model, SerializerMixin):
    __tablename__ = 'artwork'

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

    def to_dict(self):
        # This method will serialize the Artwork data for JSON response
        return {
            "id": self.id,
            "objectID": self.objectID,
            "isHighlight": self.isHighlight,
            "accessionNumber": self.accessionNumber,
            "accessionYear": self.accessionYear,
            "isPublicDomain": self.isPublicDomain,
            "primaryImage": self.primaryImage,
            "primaryImageSmall": self.primaryImageSmall,
            "additionalImages": self.additionalImages,
            "department": self.department,
            "objectName": self.objectName,
            "title": self.title,
            "artistID": self.artistID,
            "medium": self.medium,
            "dimensions": self.dimensions,
            "galleryNumber": self.galleryNumber,
            "classification": self.classification,
            "repository": self.repository,
            "objectURL": self.objectURL
        }