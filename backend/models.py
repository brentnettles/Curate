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
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    email_address = db.Column(db.String(255), unique=True, nullable=False)
    
    to_views = db.relationship('ToView', back_populates='user')
    collections = db.relationship('Collection', back_populates='user')

    serialize_rules = ('-to_views.user', '-collections.user')

class Artwork(db.Model, SerializerMixin):
    __tablename__ = 'artwork'
    id = db.Column(db.Integer, primary_key=True)
    objectID = db.Column(db.Integer, unique=True, nullable=False)
    isHighlight = db.Column(db.Boolean)
    artistDisplayName = db.Column(db.String(255))
    artistDisplayBio = db.Column(db.String(255))
    medium = db.Column(db.String(255))
    objectDate = db.Column(db.String(255))
    classification = db.Column(db.String(255))
    accessionNumber = db.Column(db.String(255))
    accessionYear = db.Column(db.String(255))
    isPublicDomain = db.Column(db.Boolean)
    primaryImage = db.Column(db.String(255))
    primaryImageSmall = db.Column(db.String(255))
    department = db.Column(db.String(255))
    objectName = db.Column(db.String(255))
    title = db.Column(db.String(255))
    artistName = db.Column(db.String(255))
    artistBeginDate = db.Column(db.String(255))
    artistEndDate = db.Column(db.String(255))
    dimensions = db.Column(db.Text)
    galleryNumber = db.Column(db.String(255), index=True)
    objectURL = db.Column(db.String(255))

    to_views = db.relationship('ToView', back_populates='artwork')
    collections = db.relationship('CollectionArtworks', back_populates='artwork')

    serialize_rules = (
        '-to_views',  
        '-collections' 
    )

class ToView(db.Model, SerializerMixin):
    __tablename__ = 'to_view'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    artwork_objectID = db.Column(db.Integer, db.ForeignKey('artwork.objectID'))
    is_active = db.Column(db.Boolean, default=True)  # To track if the view is active or historical
    user = db.relationship('User', back_populates='to_views')
    artwork = db.relationship('Artwork', back_populates='to_views')

    serialize_rules = (
        '-user.to_views', 
        '-artwork.to_views'  
    )

class Collection(db.Model, SerializerMixin):
    __tablename__ = 'collection'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', back_populates='collections')
    artworks = db.relationship('CollectionArtworks', back_populates='collection')

    serialize_rules = (
        '-collection.artworks',  
        '-artwork.collections'  
    )
    

class CollectionArtworks(db.Model, SerializerMixin):
    __tablename__ = 'collection_artworks'
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.id'), primary_key=True)
    artwork_objectID = db.Column(db.Integer, db.ForeignKey('artwork.objectID'), primary_key=True)
    is_active = db.Column(db.Boolean, default=True)  # To manage active status within the collection
    collection = db.relationship('Collection', back_populates='artworks')
    artwork = db.relationship('Artwork', back_populates='collections')

    serialize_rules = (
        '-collection.artworks', 
        '-artwork.collections'
    )


#Goal --- 
# Relationships:
# User to ToView: One-to-many. A user can have many artworks they've saved or viewed.
# User to Collection: One-to-many. A user can create multiple collections.
# Artwork to ToView: One-to-many. An artwork can be saved/viewed by many users.
# Artwork to CollectionArtworks: Many-to-many with Collection via CollectionArtworks.
# Collection to CollectionArtworks: One-to-many. A collection can include many artworks.

# Use ~ 
# User: profile data
# Artwork: Central repository of all artwork data (local /saveable and works with Map)
# ToView: Manages the artworks each user / hoping to add "recently viewed" or a "history".
# Collection: Allows users to create named groups of artworks (like playlists), enhancing organization and personalization.
# CollectionArtworks: Enables artworks to be grouped into collections flexibly, supporting many-to-many relationships.