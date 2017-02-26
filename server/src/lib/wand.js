let socketio = require('socket.io')
let twitter = require('./twitter')
let eventBus = twitter.events

module.exports.listen = function (app) {
  let io = socketio.listen(app)
  let wand = io.of('/wand')

  wand.on('connection', function (socket) {
    console.log('[INFO]'.blue.bold, '[wand.connection]'.green, '-', 'Connection to "/wand"')

    socket.on('getTweets', function () {
      socket.emit('tweets', twitter.getTweets())
    })
  })

  eventBus.on('tweet', data => {
    wand.emit('tweet', data)
  })

  eventBus.on('gong', () => {
    wand.emit('gong')
  })

  eventBus.on('music', () => {
    wand.emit('music')
  })

  return io
}
