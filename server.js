require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI;
let FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

if (process.env.NODE_ENV !== "production") {
  REDIRECT_URI = "http://localhost:8888/callback";
  FRONTEND_URI = "http://localhost:3000";
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

const app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // Application requests authorization
  const scope =
    "user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify user-read-currently-playing user-read-playback-state playlist-read-private playlist-read-collaborative playlist-modify-public";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({ error: "state_mismatch" })}`);
  } else {
    res.clearCookie(stateKey);

    axios
      .post(
        "https://accounts.spotify.com/api/token",
        {
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        },
        {
          headers: {
            Authorization:
              "Basic " +
              new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString(
                "base64"
              ),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const { access_token, refresh_token } = response.data;

          // we can also pass the token to the browser to make requests from there
          res.redirect(
            `${FRONTEND_URI}/#${querystring.stringify({
              access_token,
              refresh_token,
            })}`
          );
        } else {
          res.redirect(
            `/#${querystring.stringify({ error: "invalid_token" })}`
          );
        }
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(400);
      });
  }
});

app.get("/refresh_token", function (req, res) {
  const refresh_token = req.query.refresh_token;

  axios
    .post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "refresh_token",
        refresh_token,
      },
      {
        headers: {
          Authorization:
            "Basic " +
            new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        const access_token = response.data.access_token;
        res.send({ access_token });
      }
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });
});

// All remaining requests return the React app, so it can handle routing.
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../ClIENT/public", "index.html"));
});

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
