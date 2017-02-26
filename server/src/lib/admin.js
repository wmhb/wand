let express = require('express')
let jwt = require('express-jwt')
let config = require('./../config/config')
let twitter = require('./twitter')
let eventBus = twitter.events

let router = module.exports = express.Router()

let jwtCheck = jwt({
  secret: config.secret
})

router.use('/api', jwtCheck)

router.get('/api/twitter/tweets',
  function (req, res) {
    let tweets = twitter.getTweets()
    res.status(200).send({
      tweets: tweets
    })
  })

router.get('/api/twitter/hashtag/get',
  function (req, res) {
    let hashtag = twitter.getHashtag()
    res.status(200).send({
      hashtag: hashtag
    })
  })

router.post('/api/twitter/hashtag/set',
  function (req, res) {
    let hashtag = twitter.getHashtag()
    if (req.body.hashtag !== hashtag) {
      twitter.setHashtag(req.body.hashtag)
      res.status(200).send()
    }
  })

router.get('/api/twitter/stream/stop',
  function (req, res) {
    twitter.stopStream()
    res.status(200).send()
  })

router.get('/api/twitter/stream/restart',
  function (req, res) {
    twitter.restartStream()
    res.status(200).send()
  })

router.get('/api/sounds/gong',
  function (req, res) {
    eventBus.emit('gong')
    res.sendStatus(200)
  })

router.get('/api/sounds/music',
  function (req, res) {
    eventBus.emit('music')
    res.sendStatus(200)
  })
