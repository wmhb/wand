import SoundCloudAudio from 'soundcloud-audio'
let player
let playlist

let audio = {
  gong: {
    play: () => {
      const gong = new Audio('/static/gong.mp3')
      gong.play()
    }
  },
  music: {
    init: () => {
      player = new SoundCloudAudio('e2a6681bccff23130855618e14c481af')
    },
    play: () => {
      player.resolve('http://soundcloud.com/mindcrash/sets/podcasts', function (data) {
        playlist = data
        console.log(playlist)
        player.play()
      })
    },
    pause: () => {
      player.pause()
    },
    toggle: () => {
      if (playlist) {
        if (player.playing) {
          player.pause()
        } else {
          player.play()
        }
      } else {
        audio.music.play()
      }
    }
  }
}

export default {
  gong: audio.gong,
  music: audio.music
}
