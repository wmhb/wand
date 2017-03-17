<template>
  <div id="app">
    <nav class="wand__nav">
      <router-link to="/">Wand</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/sponsors">sponsors</router-link>
      <router-link to="/speakers">speakers</router-link>
      <a @click.prevent="logout">Logout</a>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import auth from './auth'
export default {
  name: 'app',
  methods: {
    logout: function () {
      auth.logout()
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .wand__nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
</style>
