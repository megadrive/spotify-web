
const spotify = new SpotifyWebApi()

const base = 'https://accounts.spotify.com/'
const clientId = '8e784d5d534848d1a51a79e87e9ede0d'
const redirectUri = 'http://localhost:5000'
const responseType = 'token'
const scopes = ['user-read-currently-playing', 'user-read-playback-state']

let hash = {}
let apiKey = null

function connectUrl () {
  return base + 'authorize/' +
    '?client_id=' + clientId +
    '&response_type=' + responseType +
    '&redirect_uri=' + redirectUri +
    '&scope=' + scopes.join(' ')
}

if (window.location.hash) {
  window.location.hash.substring(1).split('&')
    .map(function (val) {
      return val.split('=')
    })
    .forEach(function (val) {
      hash[val[0]] = val[1]
    })

  apiKey = hash.access_token
}

function getInfo () {
  // get current track info
  spotify.getMyCurrentPlayingTrack()
    .then(function (info) {
      console.dir(info)
      $('#container .artwork img')
        .prop('src', info.item.album.images[2].url)
      $('#container .trackInfo .artist')
        .text(info.item.artists[0].name)
      $('#container .trackInfo .track')
        .text(info.item.name)
    })
}

if (apiKey) {
  spotify.setAccessToken(apiKey)
  $('#login').hide()

  getInfo()
  setInterval(getInfo, 10 * 1000)
} else {
  $('#container').hide()
  $('#login > a').prop('href', connectUrl())
}
