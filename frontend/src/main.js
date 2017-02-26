// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import axios from 'axios'

import App from './App'
import Router from './router'
import Store from './store'
// import auth from './auth'

Vue.prototype.$http = axios
Vue.use(VueSocketio, 'http://localhost:65510/wand')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  Router,
  Store,
  router: Router,
  store: Store,
  template: '<App/>',
  components: { App }
})
