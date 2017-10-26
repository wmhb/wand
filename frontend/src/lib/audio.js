import SoundCloudAudio from 'soundcloud-audio'
import Store from './../store'

let player
let url = {}
let playlist
let gong = new Audio('/static/gong.mp3')

let audio = {
  gong: {
    play: () => {
      if (gong.currentTime === 0) {
        gong.play()
      } else {
        gong.pause()
        gong.currentTime = 0
      }
    }
  },
  music: {
    init: () => {
      player = player || new SoundCloudAudio(Store.getters.config.soundcloud.apiKey)
    },
    getTrackInfo: (scUrl) => {
      audio.music.init()
      player.resolve(scUrl, function (data) {
        playlist = data

        if (playlist.kind === 'playlist') {
          player.on('ended', () => {
            player.next()
          })
        } else {
          player.off('ended', () => {
            player.next()
          })
        }

        audio.music.setTrack(scUrl)
        Store.dispatch('setSoundcloud', {key: 'data', val: data})
        Store.dispatch('setSoundcloud', {key: 'type', val: data.kind})
      })
    },
    setTrack: (scUrl) => {
      url.next = scUrl
    },
    play: () => {
      player.resolve(url.next, function (data) {
        playlist = data
        url.current = url.next
        url.next = null
        player.play()
      })
    },
    nextTrack: () => {
      player.next()
    },
    prevTrack: () => {
      player.previous()
    },
    pause: () => {
      player.pause()
    },
    stop: () => {
      player.off('ended', () => {
        player.next()
      })
      player.stop()
    },
    toggle: () => {
      if (playlist && url.next === url.current) {
        if (player.playing) {
          audio.music.pause()
        } else {
          player.play()
        }
      } else {
        if (player.playing) {
          audio.music.stop()
        } else {
          audio.music.play()
        }
      }
    }
  }
}

export default {
  gong: audio.gong,
  music: audio.music
}
