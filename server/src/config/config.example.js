var apiConfig = {
  users: {
    id: 1,
    username: 'admin',
    password: 'admin',
    role: 'admin'
  },
  twitter: {
    'consumer_key': 'YOUR_CONSUMER_KEY',
    'consumer_secret': 'YOUR_CONSUMER_SECRET',
    'access_token': 'YOUR_ACCESS_TOKEN',
    'access_token_secret': 'YOUR_ACCESS_TOKEN_SECRET',
    'timeout_ms': 60 * 1000,
    'default_hashtag': '#twitter'
  },
  soundcloud: {
    apiKey: 'SOUNDCLOUD_API_KEY',
    url: 'https://SOUNDCLOUD_DEFAULT_TRACK_OR_PLAYLIST_URL'
  },
  slides: {
    duration: 5000
  },
  secret: 'MY_SUPER_PRIVATE_SECRET',
  APIHost: '/server',
  APIUrl: '/api',
  APIEventsUrl: '/events/all',
  APIAuthUrl: '/auth/check/',
  APILoginUrl: '/auth/login/',
  eventsAPIHost: 'http://wmhb.co',
  eventsAPIPath: '/api/events',
  ports: {
    node: 61000,
    sockets: 61001
  }
}

module.exports = apiConfig
