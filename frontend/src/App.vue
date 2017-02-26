<template>
  <div id="app">
    <router-link to="/">Wand</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/sponsors">sponsors</router-link>
    <a @click.prevent="logout">Logout</a>
    <div>
      <img src="./assets/images/logo.svg">
    </div>

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
  margin-top: 60px;
}
</style>
