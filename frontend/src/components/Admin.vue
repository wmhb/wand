<template>
  <div>
    <h1>Admin</h1>
    <h3>Twitter Config</h3>
    <div>
      <label for="setHashtag">Hashtag</label>
      <input type="text"
             id="setHashtag"
             placeholder="Enter your username"
             v-model="hashtag">
      <button class="btn" @click.prevent="setHashtag()">SET</button>
    </div>
    <button class="btn" @click.prevent="stopStream()">STOP STREAM</button>
    <button class="btn" @click.prevent="restartStream()">RESTART STREAM</button>
    <hr>
    <h3>Sounds</h3>
    <button class="btn" @click="playGong()">GONG</button>
    <button class="btn" @click="playMusic()">MUSIC! (is what i'm living for)</button>
  </div>
</template>
<script>
  const API_URL = 'http://localhost:8080/api'

  import auth from '../auth'
  import axios from 'axios'

  export default {
    name: 'Admin',
    created: function () {
      this.getHashtag()
    },
    data () {
      return {
        hashtag: null
      }
    },
    methods: {
      getHashtag: function () {
        axios.get(API_URL + '/twitter/hashtag/get', {headers: auth.getAuthHeader()})
          .then(
            res => {
              this.hashtag = res.data.hashtag
            }
          )
          .catch(
            err => {
              console.log(err.response.status)
            }
          )
      },
      setHashtag: function () {
        console.log('post', this.hashtag)
        axios.post(API_URL + '/twitter/hashtag/set', {hashtag: this.hashtag}, {headers: auth.getAuthHeader()})
          .then(
            res => {
              console.log(res.data)
            }
          )
          .catch(
            err => {
              console.log(err.response.status)
            }
          )
      },
      stopStream: function () {
        axios.get(API_URL + '/twitter/stream/stop', {headers: auth.getAuthHeader()})
          .then(
            res => {
              console.log(res.data)
            }
          )
          .catch(
            err => {
              console.log(err.response.status)
            }
          )
      },
      restartStream: function () {
        axios.get(API_URL + '/twitter/stream/restart', {headers: auth.getAuthHeader()})
          .then(
            res => {
              console.log(res.data)
            }
          )
          .catch(
            err => {
              console.log(err.response.status)
            }
          )
      },
      playGong: function () {
        axios.get(API_URL + '/sounds/gong', {headers: auth.getAuthHeader()})
          .then(
            res => {
              console.log(res.data)
            }
          )
          .catch(
            err => {
              console.log(err.response.status)
            }
          )
      },
      playMusic: function () {
        axios.get(API_URL + '/sounds/music', {headers: auth.getAuthHeader()})
          .then(
            res => {
              console.log(res.data)
            }
          )
          .catch(
            err => {
              console.log(err.response.status)
            }
          )
      }
    }
  }
</script>
