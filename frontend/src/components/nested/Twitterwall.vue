<template>
  <div class="twitterwall">
    <transition-group name="tweet" tag="div" class="tweet__container" v-if="tweets.length">
        <div v-for="(tweet, index) in tweets" :key="tweet.id" v-bind:class="'tweet tweet--' + tweet.type + ' ' + tweet.id">
          <div class="tweet__content">
            <img v-if="tweet.type === 'image'" class="tweet__image" v-bind:src="tweet.image.url" v-bind:alt="tweet.name">
            <img class="tweet__avatar" v-bind:src="tweet.avatarUrl" v-bind:alt="tweet.name" width="100" height="100">
            <div class="tweet__user">@{{tweet.name}}</div>
            <div class="tweet__text" v-html="tweet.text"></div>
            <div class="tweet__timeago">{{tweet.timeago}}</div>
          </div>
        </div>
    </transition-group>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'twitterwall',
    mounted: function () {
      this.$socket.emit('getTweets')
    },
    data () {
      return {
        tweets: []
      }
    },
    sockets: {
      gotoSlide: function (slide) {
        this.$router.push({ path: slide })
      },
      tweets: function (tweets) {
        this.tweets = tweets
        this.updateTimeStamps()
      },
      tweet: function (tweet) {
        this.add(tweet)
      }
    },
    methods: {
      add: function (tweet) {
        this.updateTimeStamps()

        tweet.timeago = moment(tweet.created_at, 'YYYY-MM-DDTHH:mm:ss.SSSSZ').fromNow()

        if (this.tweets.length > 5) {
          this.tweets.pop() // Last one out
          this.tweets.unshift(tweet) // New one on top
        } else {
          this.tweets.unshift(tweet) // New one on top
        }
      },
      updateTimeStamps: function () {
        for (let i = 0, len = this.tweets.length; i < len; i++) {
          let el = this.tweets[i]
          el.timeago = moment(el.created_at, 'YYYY-MM-DDTHH:mm:ss.SSSSZ').fromNow()
        }
      }
    }
  }
</script>
