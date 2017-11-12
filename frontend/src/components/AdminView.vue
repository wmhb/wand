<template>
  <div class="page-wrapper page-wrapper--scroll AdminView">
    <div class="admin__header">
      <img class="logo-wm" src="../../static/wm-logo.svg" alt="Webmontag Logo">
      <h1>Admin</h1>
      <span class="logout" @click.prevent="logout"><img src="../../static/logout.svg" alt="Logout"></span>
    </div>

    <div class="action-container">
      <h3>Slide</h3>
      <div class="slide__actions">
        <div class="slide__action" v-for="slide in slides" :key="slide">
          <button class="btn btn--big" @click.prevent="gotoSlide(slide)">{{slide}}</button>
        </div>
        <div>
          <button class="btn btn--big" v-bind:class="{ 'btn-c2a btn--loading': states.autoplay }" @click.prevent="toggleSlideAutoplay()">
            Autoplay
            <span v-if="states.autoplay">AUS</span>
            <span v-else>EIN</span>
          </button>
        </div>
      </div>
    </div>

    <div class="action-container">
      <h3>Talks</h3>
      <ul class="events-list">
        <li v-for="(speaker, index) in speakers" :key="speaker.name" @click.prevent="gotoSlide('speakers/'+index)" class="events-list__item">
          <span class="events-list__image" v-if="speaker.img"><img :src="speaker.imgUrl" :alt="speaker.speaker"></span>
          <strong>{{speaker.speaker}}</strong>
          {{speaker.title}}
        </li>
      </ul>
    </div>

    <div class="action-container">
      <h3>Twitter</h3>
      <div class="input__split">
        <input type="text"
               id="hashtag"
               placeholder="Enter your username"
               v-model="hashtag">
        <button class="btn" @click.prevent="setHashtag()">SET</button>
      </div>
      <button class="btn" v-bind:class="{ 'btn-c2a': states.twitterStream }" @click.prevent="startStopStream()">
        <span v-if="states.twitterStream">STOP STREAM</span>
        <span v-else>START STREAM</span>
      </button>
    </div>

    <div class="action-container">
      <h3>Pausenmusik & SFX</h3>
      <button class="btn btn--big" @click="playGong()">Gong</button>
      <div class="music" v-if="trackinfo" v-bind:class="{'music--playing': states.music}">
        <img class="music__cover" :src="trackinfo.img" :alt="trackinfo.title" v-if="trackinfo.img">
        <button class="music__skiprw" @click="musicRW()" v-if="soundcloud.type==='playlist'"></button>
        <button class="music__playpause" @click="musicPlay()"></button>
        <button class="music__skipff" @click="musicFF()" v-if="soundcloud.type==='playlist'"></button>
        <div class="music__meta">
          <span class="music__meta-title">{{trackinfo.title}}</span>
          <span class="music__meta-artist">{{trackinfo.username}}</span>
        </div>
      </div>
      <hr>
      <label for="soundcloudUrl">Soundcloud Track/Playlist URL</label>
      <div class="input__split">
        <input type="text"
               class="input--light"
               id="soundcloudUrl"
               placeholder="Enter soundcloud track or playlist url"
               v-model="soundcloudUrlInput"
               v-on:blur="setSoundcloudUrl">
        <button class="btn" @click.prevent="setSoundcloudUrl()">SET URL</button>
      </div>

    </div>
  </div>
</template>
<script>
  import auth from '../auth'
  import axios from 'axios'
  import audio from '../lib/audio'

  export default {
    name: 'AdminPanel',
    created: function () {
      this.getHashtag()
      this.getEvents()
    },
    mounted: function () {
      this.getSlideAutoplay()
      this.soundcloudUrlInput = this.soundcloud.url
      audio.music.getTrackInfo(this.soundcloud.url)
    },
    data () {
      return {
        hashtag: null,
        soundcloudUrlInput: '',
        slides: ['twitter', 'speakers', 'supporter', 'next', 'playing']
      }
    },
    methods: {
      logout: function () {
        auth.logout()
      },
      gotoSlide: function (slideName) {
        axios.post(this.$store.getters.config.APIUrl + '/slide/set', {name: slideName}, {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', 'autoplay', res.data)
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      toggleSlideAutoplay: function () {
        let slidesArr = this.slides.filter(item => item !== 'speakers')
        axios.post(this.$store.getters.config.APIUrl + '/slide/autoplay', {slides: slidesArr}, {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'autoplay', val: res.data.state})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      getSlideAutoplay: function () {
        axios.get(this.$store.getters.config.APIUrl + '/slide/autoplay', {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'autoplay', val: res.data.state})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      getEvents: function () {
        let events = this.$store.getters.events
        if (!events.length) {
          axios.get(this.$store.getters.config.APIEvents)
            .then(
              res => {
                this.$store.dispatch('setEvents', res.data.events)
              }
            )
            .catch(
              err => {
                return err.response.status
              }
            )
        }
      },
      getHashtag: function () {
        axios.get(this.$store.getters.config.APIUrl + '/twitter/hashtag', {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.hashtag = res.data.hashtag
              this.$store.dispatch('setState', {key: 'twitterStream', val: res.data.status})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      setHashtag: function () {
        axios.post(this.$store.getters.config.APIUrl + '/twitter/hashtag', {hashtag: this.hashtag}, {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'twitterStream', val: res.data.status})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      startStopStream: function () {
        axios.get(this.$store.getters.config.APIUrl + '/twitter/stream/startStop', {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'twitterStream', val: res.data.status})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      restartStream: function () {
        axios.get(this.$store.getters.config.APIUrl + '/twitter/stream/restart', {headers: auth.getAuthHeader()})
          .then(
            res => {
              return res.data
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      playGong: function () {
        axios.get(this.$store.getters.config.APIUrl + '/sounds/gong', {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'gong', val: res.data.state})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      musicPlay: function () {
        axios.get(this.$store.getters.config.APIUrl + '/sounds/music', {
          params: {soundcloudUrl: this.soundcloud.url},
          headers: auth.getAuthHeader()
        })
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'music', val: res.data.state})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      musicFF: function () {
        axios.get(this.$store.getters.config.APIUrl + '/sounds/music/next', {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'music', val: res.data.state})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      musicRW: function () {
        axios.get(this.$store.getters.config.APIUrl + '/sounds/music/prev', {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.$store.dispatch('setState', {key: 'music', val: res.data.state})
            }
          )
          .catch(
            err => {
              return err.response.status
            }
          )
      },
      setSoundcloudUrl: function () {
        this.$store.dispatch('setSoundcloud', {key: 'url', val: this.soundcloudUrlInput})
        audio.music.getTrackInfo(this.soundcloud.url)
      }
    },
    computed: {
      states () {
        return this.$store.getters.states
      },
      soundcloud () {
        return this.$store.getters.soundcloud
      },
      events () {
        return this.$store.getters.events
      },
      speakers () {
        if (this.events.length) {
          return this.$store.getters.speakers
        }
      },
      trackinfo () {
        let data = this.$store.getters.soundcloud.data
        let user = data.user || {}
        data.img = ((data.artwork_url) ? data.artwork_url : (user.avatar_url) || '').replace('large.jpg', 't500x500.jpg')
        data.username = user.username
        return data
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~scss/_vars.scss";
  .AdminView {
    padding: 1.5rem 0;
  }

  %clearfix {
    &:after {
      content: "";
      display: table;
      clear: both;
    }
  }

  .admin__header {
    display: flex;
    flex-direction: row;
    height: 15vw;
    max-height: 4rem;
    padding: 0 1.5rem;
    margin-bottom: 1.5rem;
    align-items: center;
    justify-content: space-between;
  }

  .logo-wm {
    height: 100%;
  }

  .logout {
    background: $prim2;
    width: 15vw;
    max-width: 4.5rem;
    padding: 1rem;
    margin-left: 3vw;
    display: inline-block;
    vertical-align: top;
  }

  input {
    font-size: $font-size-body;
    border: 0;
    border-radius: 0;
  }

  button {
    font-size: $font-size-body;
    width: 100%;
    background: $prim1;
    color: $white;
    border: 0;
    cursor: pointer;
  }

  .btn--big {
    height: 25vw;
    max-height: 14rem;
  }

  .action-container {
    padding: 1.5rem;

    background: $lightergrey;

    &:nth-child(odd) {
      background: $white;
    }

    h3 {
      margin-top: 0;
    }
  }

  .slide__actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
  }

  .slide__action .btn {
    text-transform: capitalize;
  }

  .events-list {
    list-style: none;
    padding: 0;
  }

  .events-list__item {
    @extend %clearfix;
    position: relative;
    min-height: 12rem;
    margin-bottom: 1rem;
    padding: .5rem .5rem .5rem calc(20vw + 1.5rem);

    display: flex;
    flex-direction: column;
    justify-content: center;

    line-height: 1.3;

    background: $lightestgrey;
  }

  .events-list__image {
    position: absolute;
    top: 0;
    left: 0;

    width: 20vw;
    height: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;

      object-fit: cover;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .input__split .btn,
  .input__split + .btn {
    padding: 1rem;
  }

  .input__split {
    display: flex;
    align-items: stretch;
    margin-bottom: 1rem;

    label {
      align-self: center;
    }

    input {
      flex: 1;
      margin-right: .5rem;
      padding: 0 0.5rem;
    }

    .btn {
      width: auto;
    }
  }

  .btn {
    opacity: 1;
    transition: opacity 100ms ease;
    transition: background 125ms linear;

    &:hover {
      opacity: 0.7;
    }

    &--loading {
      animation: pulse 500ms ease infinite alternate;
    }
  }

  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.7;
    }
  }

  .btn-c2a {
    background: $prim2;
  }

  .form__input {
    width: 100%;
    padding: .5rem;
    margin-top: .5rem;
  }

  .input--light {
    border: .2rem solid $lightestgrey;
  }

  .app--admin {
    .page-wrapper {
      padding: 1.5rem 0;
      max-width: 32em;
      margin: 0 auto;
    }

    h1 {
      flex: 1;
      padding-left: .5rem;
      margin-bottom: 0;
      font-size: $font-size-h1--admin;

      span {
        display: inline-block;
        vertical-align: middle;
      }
    }

    .logo-wm {
      width: 25vw;
      max-width: 6rem;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .music {
    position: relative;
    text-align: center;
    overflow: hidden;

    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 32rem;

    &:after {
      content: ' ';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      z-index: 2;
      top: 0;
      background: linear-gradient(180deg,rgba(0,0,0,.2) 5%,rgba(0,0,0,.8) 95%);
    }

    &:hover {
      .music__playpause,
      .music__skipff,
      .music__skiprw {
        opacity: 1;
      }
    }

    &__cover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%) scale(1.2);
      z-index: 1;
    }

    &__playpause,
    &__meta {
      position: relative;
      color: #fff;
      z-index: 3;
    }

    &__playpause,
    &__skipff,
    &__skiprw {
      position: absolute;
      top: 50%;
      left: 50%;

      width: 33%;
      height: 33%;

      padding: 0;
      margin: 0;

      transform: translate(-50%,-50%);

      background: transparent;
      border: 0;
      border-radius: 50%;

      font-size: 64px;

      opacity: 0.7;
      outline: 0;
      transition: opacity 120ms linear;

      cursor: pointer;

      z-index: 10;

      &:after {
        pointer-events: none;
      }
    }

    &__playpause:after {
      content: '▶';
      display: inline-block;
      vertical-align: middle;

      .music--playing & {
        content: '❙❙';
      }
    }

    &__skipff:after,
    &__skiprw:after {
      content: '▶❙';
      display: inline-block;
      vertical-align: middle;
    }

    &__skipff {
      left: auto;
      right: 0;
      transform: translate(0,-50%);
    }

    &__skiprw {
      left: 0;
      transform: translate(0,-50%);

      &:after {
        transform: rotate(180deg);
      }
    }

    &__meta {
      padding: 1rem;
      font-size: 18px;
    }

    &__meta-artist {
      display: block;
      font-size: 0.75em;
      line-height: 2;
    }
  }

</style>
