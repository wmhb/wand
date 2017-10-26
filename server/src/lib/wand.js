const config = require('../config/config')
const logger = require('./logger')
const socketio = require('socket.io')(config.ports.sockets)

let twitter = require('./twitter')
let eventBus = twitter.events

module.exports.listen = function (app) {
  let io = socketio.listen(app)
  let wand = io.of('/wand')

  wand.on('connection', function (socket) {
    logger.info('[wand.connection]'.green, '- Connection to "/wand"'.white)

    socket.on('getTweets', function () {
      socket.emit('tweets', twitter.getTweets())
    })

    // GET TWEETS IN AXIOS CALL PER REST AUSLAGERN KEINE SOCKETS!!!!
  })

  /*
   SLIDE CONTROLS
   */
  eventBus.on('gotoSlide', data => {
    let slide = (data === 'wand') ? '/' : '/' + data
    wand.emit('gotoSlide', slide)
  })

  /*
   TWITTER
   */
  eventBus.on('tweet', data => {
    wand.emit('tweet', data)
  })

  /*
   SOUNDS
   */
  eventBus.on('gong', () => {
    logger.info('[wand.sound]'.green, '- Gong played'.white)
    wand.emit('gong')
  })

  eventBus.on('music', (track) => {
    logger.info('[wand.sound]'.green, '- Music played'.white)
    wand.emit('music', track)
  })

  eventBus.on('nextTrack', () => {
    logger.info('[wand.sound]'.green, '- Next Track played'.white)
    wand.emit('nextTrack')
  })

  eventBus.on('prevTrack', () => {
    logger.info('[wand.sound]'.green, '- Previous Track played'.white)
    wand.emit('prevTrack')
  })

  return io
}
