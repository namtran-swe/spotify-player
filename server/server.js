require('dotenv').config();

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")
const LyricsAI = require('ai-lyrics');

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        }).catch(() => {
            res.sendStatus(400);
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    }).catch(() => {
        res.sendStatus(400);
    });
});

app.get("/lyrics", async (req, res) => {
    LyricsAI
        .findLyricsBySongTitleAndArtist(req.query.track, req.query.artist)
        .then((data) => {
            res.json({
                lyrics: data || "No Lyrics Found"
            })
        }).catch((err) => {
            console.log("Error getting lyrics " + err)
        })
    
})

//Implement getting the top tracks without using client side spotifyApi
/*app.get('/artists/%7Bid%7D/top-tracks', (req, res) => {
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    spotifyApi
        .clientCredentialsGrant()
        .then(data => {
            spotifyApi.setAccessToken(data.body['access_token']);

            return spotifyApi.getArtistTopTracks(req.query.artistId, 'US')

        })
        .then(data => {
           res.json({ tracks: data.body.tracks })
        })
        .catch(err => {
            console.log("Error getting top tracks " + err)
        })
})*/

app.listen(3001)