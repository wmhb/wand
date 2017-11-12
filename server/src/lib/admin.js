const config = require('./config')
const logger = require('./logger')
let express = require('express')
let jwt = require('express-jwt')
let twitter = require('./twitter')
let eventBus = twitter.events

let slide = {
  current: 'wand',
  slides: [],
  autoplay: null
}

let isPlaying = {
  slideAutoplay: false,
  gong: false,
  music: false
}

let router = module.exports = express.Router()

let setSlide = () => {
  let currentIdx = slide.slides.findIndex(i => i === slide.current)
  slide.current = (slide.slides[currentIdx + 1]) ? slide.slides[currentIdx + 1] : slide.slides[0]
  logger.info('[wand.slides]'.green, '- Goto Slide: ' + slide.current)
  eventBus.emit('gotoSlide', slide.current)
}

let toggleAutoplay = (slides) => {
  if (!isPlaying.slideAutoplay) {
    logger.info('[wand.slides]'.green, '- Autoplay Start'.white)
    slide.slides = slides
    slide.autoplay = setInterval(() => {
      setSlide()
    }, config.slides.duration)
  } else {
    logger.info('[wand.slides]'.green, '- Autoplay Stop'.white)
    clearInterval(slide.autoplay)
  }

  isPlaying.slideAutoplay = !isPlaying.slideAutoplay
}

let jwtCheck = jwt({
  secret: config.secret
})

/*
 JWT CHECK ALL THE THINGS
 */
router.use('/api', jwtCheck)

/*
 TWITTER
 */

router.get('/tweets',
  function (req, res) {
    let tweets = twitter.getTweets()
    res.status(200).send(tweets)
  })

router.get('/api/twitter/hashtag',
  function (req, res) {
    let hashtag = twitter.getHashtag()
    res.status(200).send({
      hashtag: hashtag,
      status: twitter.getStreamStatus()
    })
  })

router.post('/api/twitter/hashtag',
  function (req, res) {
    let hashtag = twitter.getHashtag()
    if (req.body.hashtag !== hashtag) {
      twitter.setHashtag(req.body.hashtag)
      res.status(200).send({
        status: twitter.getStreamStatus()
      })
    }
  })

router.get('/api/twitter/stream/startStop',
  function (req, res) {
    twitter.startStopStream()
    res.status(200).send({
      status: twitter.getStreamStatus()
    })
  })

router.get('/api/twitter/stream/restart',
  function (req, res) {
    twitter.restartStream()
    res.status(200).send()
  })

/*
SOUNDS
 */

router.get('/api/sounds/gong',
  function (req, res) {
    isPlaying.gong = !isPlaying.gong
    eventBus.emit('gong')
    res.status(200).send({
      state: isPlaying.gong
    })
  })

router.get('/api/sounds/music',
  function (req, res) {
    isPlaying.music = !isPlaying.music
    eventBus.emit('music', req.query.soundcloudUrl)
    res.status(200).send({
      state: isPlaying.music
    })
  })

router.get('/api/sounds/music/next',
  function (req, res) {
    eventBus.emit('nextTrack')
    res.status(200).send({
      state: isPlaying.music
    })
  })

router.get('/api/sounds/music/prev',
  function (req, res) {
    eventBus.emit('prevTrack')
    res.status(200).send({
      state: isPlaying.music
    })
  })

/*
SLIDE FUNCTIONS
 */

/**
 * Toggle Slide Autoplay (POST)
 */
router.post('/api/slide/autoplay',
  function (req, res) {
    toggleAutoplay(req.body.slides)
    res.status(200).send({
      state: isPlaying.slideAutoplay
    })
  })

/**
 * Get Slide Autoplay (GET)
 */
router.get('/api/slide/autoplay',
  function (req, res) {
    res.status(200).send({
      state: isPlaying.slideAutoplay
    })
  })

router.post('/api/slide/set',
  function (req, res) {
    let current = slide.current

    if (isPlaying.slideAutoplay && slide.autoplay) {
      isPlaying.slideAutoplay = false
      clearInterval(slide.autoplay)
      logger.info('[wand.slides]'.green, '- Autoplay Stop'.white)
    }

    if (req.body.name !== current) {
      eventBus.emit('gotoSlide', req.body.name)
      slide.current = req.body.name
      res.status(200).send({
        state: isPlaying.slideAutoplay
      })
    }
  })
