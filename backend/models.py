from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData

# Define naming conventions for constraints
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}


db = SQLAlchemy(metadata=MetaData(naming_convention=convention))

class User(db.Model, SerializerMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    email_address = db.Column(db.String(255), unique=True, nullable=False)
    to_views = db.relationship('ToView', back_populates='user')
    serialize_rules = ('-to_views.user',)

class Artwork(db.Model, SerializerMixin):
    __tablename__ = 'artwork'
    id = db.Column(db.Integer, primary_key=True)
    objectID = db.Column(db.Integer, unique=True, nullable=False)
    isHighlight = db.Column(db.Boolean)
    accessionNumber = db.Column(db.String(255))
    accessionYear = db.Column(db.String(255))
    isPublicDomain = db.Column(db.Boolean)
    primaryImage = db.Column(db.String(255))
    primaryImageSmall = db.Column(db.String(255))
    additionalImages = db.Column(db.Text)
    department = db.Column(db.String(255))
    objectName = db.Column(db.String(255))
    title = db.Column(db.String(255))
    artistName = db.Column(db.String(255))
    artistNationality = db.Column(db.String(255))
    artistBeginDate = db.Column(db.String(255))
    artistEndDate = db.Column(db.String(255))
    artistWikidataURL = db.Column(db.String(255))
    artistUlanURL = db.Column(db.String(255))
    medium = db.Column(db.String(255))
    dimensions = db.Column(db.Text)
    galleryNumber = db.Column(db.String(255), index=True)
    classification = db.Column(db.String(255))
    repository = db.Column(db.String(255))
    objectURL = db.Column(db.String(255))
    to_views = db.relationship('ToView', back_populates='artwork')
    serialize_rules = ('-to_views.artwork',)

class ToView(db.Model, SerializerMixin):
    __tablename__ = 'to_view'
    objectId = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    artwork_id = db.Column(db.Integer, db.ForeignKey('artwork.id'))
    user = db.relationship('User', back_populates='to_views')
    artwork = db.relationship('Artwork', back_populates='to_views')
    serialize_rules = ('-user.to_views', '-artwork.to_views')

    def __repr__(self):
        return '<User %r>' % self.username
