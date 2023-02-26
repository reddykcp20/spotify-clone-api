const { Router } = require("express");
const express = require("express")
const app = express()
const router = express.Router()
app.use(express.json())

const token = 'BQAiUUWbJyaARhBQCuH9dVlfs-XfVVTgl_C-rFdpmtlD3XlEFgVNdWZZrktMtDobfge8R-0yJNDmCFf9YmRMAMy-2Dh_cY_B-f11dy7plJfKKqeMf87qN-fTsM1NnLg_fAYEGuD2R5Lnw1GjjBICm6sQ27itUIvr8PtnfQH1_xbZjhw3UIR975AqQvYhMR2MV3aIDxksTOgWeGpK51wcLoI'

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: '0db1d7bfe2f94a9c9aa3533d326cafec',
    clientSecret: '37506398e50d4a0a9d47b0934d1a67ce',
    redirectUri: 'http://localhost:3000/callback'
  });

app.get('/', (req, res, next) => {
    res.redirect(spotifyApi.createAuthorizeURL([
        'ugc-image-upload',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'app-remote-control',
        'streaming',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-private',
        'playlist-modify-public',
        'user-follow-modify',
        'user-follow-read',
        'user-read-playback-position',
        'user-top-read',
        'user-read-recently-played',
        'user-library-modify',
        'user-library-read',
        'user-read-email',
        'user-read-private',
    ]))
})

app.get('/callback', (req, res, next) => {
    console.log('request query', req.query)
    spotifyApi.authorizationCodeGrant(req.query.code).then(
        (response) => {
            res.send(JSON.stringify(response.body.access_token))
            console.log("acc",response.body.access_token)
        }
    )
})

spotifyApi.setAccessToken(token)

app.get('/api/profile', (req, res) => {
    spotifyApi.getMe()
        .then(function (data) {
            res.send(data.body)
            // console.log("profile", data.body)
        }, function (err) {
            res.send({ error: 'Error while fetching data' })
        });
})

app.get('/api/recentlyplayedtracks', (req, res) => {
    spotifyApi.getMyRecentlyPlayedTracks({
        limit : 20
      }).then(function(data) {
          // Output items
          console.log("Your 20 most recently played tracks are:");
          data.body.items.forEach(item => console.log(item.track));
        }, function(err) {
          console.log('Something went wrong!', err);
        });
})

app.get('/api/userplaylist', (req, res) => {
    spotifyApi.getUserPlaylists(spotifyApi.clientId)
  .then(function(data) {
    res.send(data.body.items)
    // console.log('Retrieved playlists', data.body.items);
  },function(err) {
    console.log('Something went wrong!', err);
  });
})

app.get('/api/playlist/:playlistid', (req, res) => {
    spotifyApi.getPlaylist(req.params.playlistid, {limit: 4})
  .then(function(data) {
    res.send(data.body)
    // console.log('Some information about this playlist', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

app.get('/api/searchartists/:artistname', async (req, res) => {
  await spotifyApi.searchArtists(req.params.artistname, {limit:5}).then(
      function (data) {
          res.send(data.body.artists.items)
          // console.log(data.body.artists.items)
      },
      function () {
          res.send({ error: 'Error while fetching data' })
      })
})

app.get('/api/searchtracks/:trackname', async (req, res) => {
  await spotifyApi.searchTracks(req.params.trackname, {limit:4}).then(
      function (data) {
          res.send(data.body.tracks.items)
          // console.log(data.body.tracks.items)
      },
      function () {
          res.send({ error: 'Error while fetching data' })
      })
})

app.get('/api/searchplaylists/:playlistname', async (req, res) => {
  await spotifyApi.searchPlaylists(req.params.playlistname, {limit:6}).then(
      function (data) {
          res.send(data.body.playlists.items)
          // console.log(data.body.playlists.items)
      },
      function () {
          res.send({ error: 'Error while fetching data' })
      })
})

app.listen(3000, (req, res) => {
    console.log("3000")
})