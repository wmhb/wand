<template>
  <div class="page-wrapper page-wrapper--centered">
    <div class="np-container" v-if="trackinfo">
      <img :src="trackinfo.img" :alt="trackinfo.title">
      <div class="np-item">
        <div class="playing"><span>&#9658;</span>NOW PLAYING</div>
        <div class="title">{{ trackinfo.title }}</div>
        <div class="artist">by {{ trackinfo.username }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import anime from 'animejs'
  import audio from '../../lib/audio'

  export default {
    name: 'nowPlaying',
    mounted: function () {
      anime({
        targets: '.playing > span',
        opacity: [0, 1, 0],
        easing: 'linear',
        loop: true,
        duration: 1500
      })
    },
    created: function () {
      if (!this.trackinfo.title) {
        let url = this.$store.getters.config.soundcloud.url
        audio.music.setTrack(url)
        audio.music.getTrackInfo(url)
      }
    },
    sockets: {
      gotoSlide: function (slide) {
        this.$router.push({ path: slide })
      }
    },
    data () {
      return {}
    },
    computed: {
      trackurl () {
        return this.$store.getters.soundcloud.url
      },
      trackinfo () {
        let data = this.$store.getters.soundcloud.data
        let user = data.user || {}
        data.img = ((data.artwork_url) ? data.artwork_url : (user.avatar_url) || '').replace('large.jpg', 't500x500.jpg')
        data.username = user.username
        return data
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~scss/_vars.scss";

  .np-container {
    font-size: 3vh;
    line-height:1.125;
    display: flex;
    align-items: center;
    transform: translateY(15vh);
  }

  .np-item {
    padding-left: 5vw;
  }

  .playing {
    font-size: 3vw;
    text-align: left;

    span {
      opacity: 0;
    }
  }

  .title,
  .artist,
  .playing {
    text-transform: uppercase;
  }

  .title,
  .artist {
    font-weight: 700;
  }

  .title {
    font-size: 5vw;
    color: transparent;
    -webkit-text-stroke-width: .2rem;
    -webkit-text-stroke-color: #2c3e50;
  }

  .artist {
    font-size: 3vw;
  }

  img {
    width: 30vw;
    height: auto;
    flex: 1;
    object-fit: cover;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }



</style>
