import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: {},
    states: {
      twitterStream: false,
      autoplay: false,
      gong: false,
      music: false
    },
    soundcloud: {
      url: '',
      apiKey: '',
      data: [],
      type: ''
    },
    events: [],
    speakerOrder: [0, 1, 2],
    soundcloudUrl: '',
    soundcloudApiKey: '',
    soundcloudData: []
  },
  mutations: {
    SET_CONFIG (state, config) {
      state.config = config
    },
    SET_STATE (state, {key, val}) {
      Object.assign(state.states, {
        [key]: val
      })
    },
    SET_SC (state, {key, val}) {
      Object.assign(state.soundcloud, {
        [key]: val
      })
    },
    SET_EVENTS_ARRAY (state, eventsArr) {
      state.events = eventsArr
    },
    SET_SPEAKER_ORDER (state, order) {
      state.speakerOrder = order
    },
    SET_SOUNDCLOUD_URL (state, url) {
      state.soundcloudUrl = url
    },
    SET_SOUNDCLOUD_APIKEY (state, apiKey) {
      state.soundcloudApiKey = apiKey
    },
    SET_SOUNDCLOUD_TRACKINFO (state, data) {
      state.soundcloudData = data
    }
  },
  actions: {
    setConfig ({commit}, config) {
      commit('SET_CONFIG', config)
      commit('SET_SC', {key: 'url', val: config.soundcloud.url})
      commit('SET_SC', {key: 'apiKey', val: config.soundcloud.apiKey})
    },
    setState ({commit}, {key, val}) {
      commit('SET_STATE', {key, val})
    },
    setSoundcloud ({commit}, {key, val}) {
      commit('SET_SC', {key, val})
    },
    setEvents ({commit}, eventsArr) {
      commit('SET_EVENTS_ARRAY', eventsArr)
    },
    setSpeakerOrder ({commit}, order) {
      commit('SET_SPEAKER_ORDER', order)
    }
    // setSoundCloudUrl ({commit}, url) {
    //   commit('SET_SOUNDCLOUD_URL', url)
    // },
    // setSoundCloudTrackInfo ({commit}, data) {
    //   commit('SET_SOUNDCLOUD_TRACKINFO', data)
    // }
  },
  getters: {
    config: state => state.config,
    states: state => state.states,
    soundcloud: state => state.soundcloud,
    events: state => state.events,
    speakers: state => state.events[0].talks,
    speakerOrder: state => state.speakerOrder,
    speakerById: (state, getters) => (id) => {
      return state.events[0].talks[id]
    },
    nextEvent: (state, getters) => () => {
      return (state.events.length > 1) ? state.events[1] : null
    }
    // soundcloudUrl: state => state.config.soundcloud.url,
    // soundcloudData: state => state.soundcloudData
  }
})
