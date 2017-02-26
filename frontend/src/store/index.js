import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false
  },
  mutations: {
    SET_AUTHENTICATED (state, bool) {
      state.isLoggedIn = bool
    }
  },
  actions: {
    setAuthenticated ({commit}, bool) {
      console.log('auth => ', bool)
      commit('SET_AUTHENTICATED', bool)
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn
  }
})
