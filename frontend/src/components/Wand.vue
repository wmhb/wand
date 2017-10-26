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
    name: 'wand',
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  /*Animations*/
  .page-slide-enter-active {
    transition: all 100ms ease;
  }

  .page-slide-leave-active {
    transition: all 125ms cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .page-slide-enter,
  .page-slide-leave-to {
    transform: translateX(2rem);
    opacity: 0
  }
</style>
