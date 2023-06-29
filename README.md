# Spotify-Dashboard-SERVER

Spotify-Dashboard-SERVER is the server-side code repository for the Spotify Dashboard application. It is built using Node.js and Express.js and serves as the backend for handling authentication, interacting with the Spotify API, and managing user-related data.

## Installation

1.  Clone the repository:

        git clone https://github.com/Siddharth-2382/Spotify-Dashboard-SERVER.git

2.  Navigate to the project directory:

        cd Spotify-Dashboard-SERVER

3.  Install the dependencies:

        npm install

## Configuration

The Spotify Dashboard Server requires configuration values to interact with the Spotify API and to set up the server environment. Create a `.env` file in the project root directory and add the following lines:

        CLIENT_ID=<your_spotify_client_id>
        CLIENT_SECRET=<your_spotify_client_secret>
        REDIRECT_URI=http://localhost:8888/callback
        FRONTEND_URI=http://localhost:3000
        NODE_ENV=development
        PORT=8888

Replace `<your_spotify_client_id>` and `<your_spotify_client_secret>` with your own Spotify application client ID and secret obtained from the Spotify Developer Dashboard.

- `REDIRECT_URI`: The URI where the Spotify API will redirect after authentication. For local development, it is set to `http://localhost:8888/callback`.
- `FRONTEND_URI`: The URI of the Spotify Dashboard CLIENT where the user will be redirected after successful authentication.
- `NODE_ENV`: The environment mode for the server, typically set to `development`.
- `PORT`: The port on which the server will run. It is set to `8888` by default.

## Running the Server

To start the server, use the following command:

        node server.js


This will start the server and make it available at the specified port.
