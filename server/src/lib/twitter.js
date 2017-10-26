const config = require('../config/config')
const logger = require('./logger')
const moment = require('moment')
const sanitize = require('sanitize-html')
const Twit = require('twit')

let events = require('events')
let twitterEvents = new events.EventEmitter()

const T = new Twit(config.twitter)
let stream = null
let isStreaming = false
let tweets = []
let tweetsLastId = ''

// ----
// PRIVATE FUNCTIONS
// ----

let isNoRetweet = (tweet) => tweet.retweeted === false && (tweet.text || '').substring(0, 2) !== 'RT'

let hasKey = (object, ...keys) => {
  return keys.reduce((a, b) => (a || { })[ b ], object) !== undefined
}

let isExtended = tweet => 'extended_tweet' in tweet

let getTweetMedia = tweet => {
  let media = {}
  if (!isExtended(tweet) && hasKey(tweet, 'extended_entities', 'media')) {
    media = tweet.extended_entities.media[0]
  } else if (isExtended(tweet) && hasKey(tweet, 'extended_tweet', 'extended_entities', 'media')) {
    media = tweet.extended_tweet.extended_entities.media[0]
  }

  return media
}

let processTweetObject = (tweet) => {
  let text = (isExtended(tweet)) ? tweet.extended_tweet.full_text : tweet.full_text || tweet.text
  let media = getTweetMedia(tweet)
  let entry = {
    id: tweet.id_str,
    created_at: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY'),
    name: sanitize(tweet.user.name),
    screen_name: sanitize(tweet.user.screen_name),
    avatarUrl: tweet.user.profile_image_url,
    text: sanitize(text.replace(/(?:https):\/\/[\n\S]+/g, '')),
    type: (media.type !== 'photo' && media.type !== 'animated_gif') ? 'text' : media.type,
    class: (media.type !== 'photo' && media.type !== 'animated_gif') ? 'tweet--text ' + tweet.id : 'tweet--photo ' + tweet.id
  }

  if (media.type === 'photo') { // Tweet contains image
    entry.image = {
      url: media.media_url,
      width: media.sizes.large.w,
      height: media.sizes.large.h
    }
  }

  if (media.type === 'animated_gif') { // Tweet contains animated-gif (MP4)
    entry.image = {
      url: media.video_info.variants[0].url,
      width: media.video_info.aspect_ratio[0],
      height: media.video_info.aspect_ratio[1]
    }
  }

  return entry
}

let twitter = {
  hashtag: config.twitter.default_hashtag,
  getInitialTweets: () => {
    logger.info('[twitter.getInitialTweets]'.green, '- Get initial tweets'.white)
    T.get('search/tweets', { q: twitter.hashtag, count: 6, tweet_mode: 'extended' })
      .then(({data}) => {
        for (let i = 0, len = data.statuses.length; i < len; i++) {
          let tweet = data.statuses[i]
          if (isNoRetweet(tweet)) {
            tweets.push(processTweetObject(tweet))
          }
        }
        twitter.getStream()
      })
  },
  getStream: () => {
    logger.info('[twitter.getStream]'.green, '- Start streaming'.white)
    isStreaming = true

    let hashtags = [twitter.hashtag]
    stream = T.stream('statuses/filter', { track: hashtags })

    stream.on('tweet', function (tweet) {
      if (isNoRetweet(tweet) && tweet.id_str !== tweetsLastId) {
        let processedTweetObject = processTweetObject(tweet)

        logger.info('[twitter.getStream.tweet]'.green, '- '.white + tweet.id_str + ' '.white)
        twitterEvents.emit('tweet', processedTweetObject)
        if (tweets.length > 5) {
          tweets.pop() // Last one out
          tweets.unshift(processedTweetObject) // New one on top
        } else {
          tweets.unshift(processedTweetObject) // New one on top
        }
      }

      tweetsLastId = tweet.id_str
    })

    stream.on('error', (err) => {
      logger.warn('[twitter.getStream.error] - ', err)
      logger.warn('[twitter.getStream.error]'.red, '- ' + err + ''.red.bold)
    })
  },
  getTweets: () => {
    return tweets
  },
  getHashtag: () => twitter.hashtag,
  setHashtag: (newTag) => {
    twitter.hashtag = newTag
    isStreaming = true
    logger.info('[twitter.setHashtag.hashtag]'.green, '- Restarted Stream with', twitter.hashtag + ''.white)
    twitter.restartStream()
  },
  startStopStream: () => {
    logger.warn('[twitter.stopStream]'.yellow, '- Twitter Stream STOPPED'.yellow)
    if (isStreaming) {
      isStreaming = false
      stream.stop()
    } else {
      isStreaming = true
      twitter.getStream()
    }
  },
  restartStream: () => {
    logger.info('[twitter.restartStream]'.green, '- Twitter Stream RESTARTED'.green)
    stream.stop()
    twitter.getStream()
  },
  getStreamStatus: () => isStreaming
}

twitter.getInitialTweets()

// ----
// PUBLIC FUNCTIONS
// ----

module.exports = {
  getTweets: twitter.getTweets,
  getStream: twitter.getStream,
  getHashtag: twitter.getHashtag,
  setHashtag: twitter.setHashtag,
  getStreamStatus: twitter.getStreamStatus,
  startStopStream: twitter.startStopStream,
  restartStream: twitter.restartStream,
  events: twitterEvents
}
