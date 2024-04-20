

from flask import Flask, jsonify
from models import db, Artwork
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///artworks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

CORS(app, resources={r"*": {"origins": "http://localhost:5173"}})

# @app.route('/api/artworks/<gallery_number>')
# def get_artworks_by_gallery(gallery_number):
#     try:
#         artworks = Artwork.query.filter_by(galleryNumber=gallery_number.strip()).all()
#         return jsonify([artwork.to_dict() for artwork in artworks])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


@app.route('/api/artworks/<gallery_number>')
def get_artworks_by_gallery(gallery_number):
    print(f"Received gallery number: {gallery_number}")
    try:
        artworks = Artwork.query.filter_by(galleryNumber=gallery_number.strip()).all()
        print(f"Artworks found: {artworks}")
        return jsonify([artwork.to_dict() for artwork in artworks])
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
