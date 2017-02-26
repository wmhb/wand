let config = require('../config/config')
let moment = require('moment')
let sanitize = require('sanitize-html')
let Twit = require('twit')
let events = require('events')
let twitterEvents = new events.EventEmitter()
let colors = require('colors') // eslint-disable-line

const T = new Twit(config.twitter)
let stream = null
let tweets = []
let tweetsLastId = ''

// ----
// PRIVATE FUNCTIONS
// ----

let processTweetObject = (tweet) => {
  let entry = {}

  entry = {
    id: tweet.id_str,
    created_at: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY'),
    name: sanitize(tweet.user.screen_name),
    avatarUrl: tweet.user.profile_image_url,
    text: sanitize(tweet.text),
    type: 'text'
  }

  if (tweet.entities.media) { // Tweet contains image
    entry.type = 'image'
    entry.image = {
      url: tweet.entities.media[0].media_url,
      width: tweet.entities.media[0].sizes.large.w,
      height: tweet.entities.media[0].sizes.large.h
    }
  }
  return entry
}

let twitter = {
  hashtag: '#trump',
  getInitialTweets: () => {
    console.log('[INFO]'.blue.bold, '[twitter.getInitialTweets]'.green, '-', 'Get initial tweets')
    T.get('search/tweets', { q: twitter.hashtag, count: 6 })
      .then(function (result) {
        for (let i = 0, len = result.data.statuses.length; i < len; i++) {
          if (result.data.statuses[i].retweeted === false) {
            tweets.push(processTweetObject(result.data.statuses[i]))
          }
        }
        twitter.getStream()
      })
  },
  getStream: () => {
    console.log('[INFO]'.blue.bold, '[twitter.getStream]'.green, '-', 'Start streaming')

    let hashtags = [twitter.hashtag]
    stream = T.stream('statuses/filter', { track: hashtags })

    stream.on('tweet', function (tweet) {
      let processedTweetObject = processTweetObject(tweet)

      if (tweet.retweeted === false && // Exclude Retweets
        tweet.text.substring(0, 2) !== 'RT' && // Exclude Retweets
        tweet.id_str !== tweetsLastId) { // Exclude Duplicates
        console.log('[INFO]'.blue.bold, '[twitter.getStream.tweet]'.green, '-', tweet.id_str)
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
      console.log('[ERROR] [twitter.getStream.error] - ', err)
      console.log('[INFO]'.red.bold.underline, '[twitter.getStream.error]'.red, '-', err + ''.red.bold)
    })
  },
  getTweets: () => {
    return tweets
  },
  getHashtag: () => {
    return twitter.hashtag
  },
  setHashtag: (newTag) => {
    twitter.hashtag = newTag
    console.log('[INFO]'.blue.bold, '[twitter.setHashtag.hashtag]'.green, '- Restarted Stream with #', twitter.hashtag)
    twitter.restartStream()
  },
  stopStream: () => {
    console.log('[INFO]'.yellow.bold, '[twitter.stopStream]'.yellow, '- Twitter Stream STOPPED'.yellow)
    stream.stop()
  },
  restartStream: () => {
    console.log('[INFO]'.green.bold, '[twitter.restartStream]'.green, '- Twitter Stream RESTARTED'.green)
    twitter.stopStream()
    twitter.getStream()
  }
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
  stopStream: twitter.stopStream,
  restartStream: twitter.restartStream,
  events: twitterEvents
}
