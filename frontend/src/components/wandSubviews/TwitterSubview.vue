<template>
  <div class="page-wrapper TwitterSubview">
    <transition-group name="tweet" tag="div" class="tweet__container" v-if="tweets.length">
      <div v-for="(tweet, index) in tweets" :key="tweet.id" v-bind:class="tweet.class" class="tweet">
        <img v-if="tweet.type === 'photo'" class="tweet__photo" v-bind:src="tweet.image.url" v-bind:alt="tweet.name">
        <video v-if="tweet.type === 'animated_gif'" class="tweet__photo" v-bind:src="tweet.image.url" autoplay muted loop buffered></video>
        <div class="tweet__content">
          <div class="tweet__head">
            <img class="tweet__avatar" v-bind:src="tweet.avatarUrl" v-bind:alt="tweet.name" width="100" height="100">
            <div class="tweet__meta">
              <div class="tweet__user--name">{{tweet.name}}</div>
              <div class="tweet__user--screen">@{{tweet.screen_name}}</div>
            </div>
          </div>
          <div class="tweet__text" v-html="tweet.text"></div>
          <timeago :since="tweet.created_at" :auto-update="10"></timeago>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import VueTimeago from 'vue-timeago'
  import deDE from 'vue-timeago/locales/de-DE.json'

  Vue.use(VueTimeago, {
    name: 'timeago',
    locale: 'de-DE',
    locales: {
      'de-DE': deDE
    }
  })

  export default {
    name: 'TwitterSubview',
    mounted: function () {
      this.getInitialTweets()
    },
    data () {
      return {
        tweets: []
      }
    },
    sockets: {
      gotoSlide: function (slide) {
        this.$router.push({path: slide})
      },
      tweet: function (tweet) {
        this.add(tweet)
      }
    },
    methods: {
      getInitialTweets: function () {
        axios.get(this.$store.getters.config.APIHost + '/tweets')
          .then(
            ({data}) => {
              this.tweets = data
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      add: function (tweet) {
        if (this.tweets.length > 5) {
          this.tweets.pop() // Last one out
          this.tweets.unshift(tweet) // New one on top
        } else {
          this.tweets.unshift(tweet) // New one on top
        }
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "~scss/_vars.scss";

  .tweet {
    box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .3), 0 10px 10px 0 rgba(0, 0, 0, .19);
    position: relative;
    width: 100%;
    overflow: hidden;
    margin-bottom: 3rem;

    @media screen and (min-width: $screen-sm-min) {
      margin-bottom: 0;
      height: calc(50vh - 6rem);
    }

    &__container {
      @media screen and (min-width: $screen-sm-min) {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-gap: 3rem;
        width: calc(100vw - 10rem);
        height: calc(100vh - 8.5rem);
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
      }

      @media screen and (min-width: 1215px) {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    &__content {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      height: 100%;
      overflow: hidden;
      padding: 3rem;

      font-weight: 700;

      background-color: $bg-color;

      z-index: 2;

      .tweet--photo & {
        color: $bg-color;
        background-color: transparent;
        text-shadow: 0px 1px 0px rgba(0, 0, 0, 1);
      }
    }

    &__photo {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__avatar,
    &__meta,
    &__text {
      position: relative;
      z-index: 2;
    }

    &__avatar,
    &__meta {
      display: inline-block;
      vertical-align: middle;
    }

    &__avatar {
      max-width: calc(15% - 1.5rem);
      min-width: 5rem;
      margin-right: 1.5rem;
    }

    &__meta {
      width: 70%;
      font-size: 2.8rem;
      line-height: 1.2;

      & > * {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &__user--screen {
      color: #c7d8e6;
      font-size: 2.1rem;
      line-height: 2.1rem;
    }

    &__text {
      font-size: 3vh;
      line-height: 1.25;
      padding: 1.5rem 0;

      @media screen and (min-width: $screen-sm-min) {
        font-size: 2.7vmin;
      }
    }

    &--photo:before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      z-index: 1;
      top: 0;
      background: transparent linear-gradient(180deg, rgba(0, 0, 0, .25) 0%, rgba(0, 0, 0, .75) 100%);
    }
  }

  .tweet-move {
    transition: all cubic-bezier(.4, 0, .2, 1) 400ms;
  }

  .tweet-enter,
  .tweet-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  .tweet-enter-to,
  .tweet-leave {
    opacity: 1;
    transform: scale(1);
  }

  .tweet-leave-active,
  .tweet-enter-active {
    transition: all 400ms cubic-bezier(.4, 0, .2, 1);
  }

  time {
    font-size: 1.6rem;
    text-align: right;
    text-transform: uppercase;
  }
</style>
