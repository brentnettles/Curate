# Curate

**Curate** is a full-stack application developed as part of a three-week sprint for the Flatiron School's Full Stack Software Engineering program.

### Site Demo Video: https://www.dropbox.com/scl/fi/vlclqlv793y8m8s672xnm/Curate_v1-Stite-Demo.mp4?rlkey=mqkn0cw5x4j6tpx6efkwy6pj2&dl=0

## To Run
Navigate to the project directory and set up the environment:

cd Map-p5
pipenv install
pipenv shell
cd backend
export FLASK_RUN_PORT=5555
flask run


Open a second terminal for the frontend:

cd Map-p5/frontend
npm install
npm run dev


## Goals
- **Visualize the data** available from the Metropolitan Museum of Art's API as an interactive map.
- **See the artworks** currently on exhibition by gallery number.
- **Develop user capabilities** to curate collections and create custom maps to plan their visit to the museum.
- **Generate a scavenger hunt** of artworks to promote exploration in the museum.

## Features

- **Search Artworks**: Utilize the Met's API to search for artworks based on various criteria.
- **Save and Manage Artworks**: Users can save artworks, view them, and add them to personal collections.
- **Interactive Map Display**: View artworks by gallery through an interactive map.
- **Display Highlighted Galleries**: By user-curated collection.
- **Scavenger Hunt**: A list of random artworks from unique galleries is provided to the user.

## Notes
The artwork information requests are sent to two different databases:
1. The SQLite database developed for this project, consisting of 29,502 objects.
2. Direct request to the Met's API used in the Search component of the project.

### Scavenger Hunt Hack
If you'd like to see the Scavenger Hunt in action (without going to the Met), use the Dev Tools - I've console logged the fetched artworks that will include the required information.

## Tech Stack
### Frontend
- **React JS**
- **D3.js** for interactive SVG map manipulation
- **CSS / HTML**

### Backend
- **Flask**, **SQLAlchemy** for ORM, **SQLite** for the database.
- **APIs**: Metropolitan Museum of Art API for fetching artwork data.

## Example API Endpoints
- `GET /api/artworks/{gallery_number}`: Fetch artworks by gallery number.
- `POST /api/saved-artworks`: Save an artwork to a user's list.
- `GET /api/collections/{user_id}`: Retrieve all collections created by a user.

## Database Schema
- **User**: Stores user credentials and profile data.
- **Artwork**: Central repository of artwork data.
- **ToView**: Manages the artworks each user has saved or viewed.
- **Collection**: Allows users to create named groups of artworks.
- **CollectionArtworks**: Manages the many-to-many relationships between artworks and collections.

More information on the open API from the Met can be found [here](https://metmuseum.github.io/).
