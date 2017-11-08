<template>
  <keep-alive>
    <transition name="page-slide" mode="out-in">
      <router-view :key="$route.fullPath"></router-view>
    </transition>
  </keep-alive>
</template>

<script>
  import audio from '../lib/audio'

  export default {
    name: 'WandView',
    created: function () {
      audio.music.init()
    },
    sockets: {
      gong: function () {
        audio.gong.play()
      },
      music: function (track) {
        audio.music.setTrack(track)
        audio.music.getTrackInfo(track)
        audio.music.toggle()
      },
      nextTrack: function () {
        audio.music.nextTrack()
      },
      prevTrack: function () {
        audio.music.prevTrack()
      }
    }
  }
</script>