<template>
  <div class="page-wrapper page-wrapper--vcentered">
    <transition appear>

      <div class="container" v-if="speaker && speaker.img">

        <svg width="0" height="0">
          <defs>
            <clipPath id="clipPath" clipPathUnits="objectBoundingBox"><path d="M50,60L325,75L340,275L100,350L50,60"/></clipPath>
          </defs>
        </svg>

        <div class="speaker__text">
          <div class="speaker__text-content speaker__name">
            <span>{{speaker.speaker}}</span>
          </div>
          <div class="speaker__text-content speaker__title">
            <span>{{speaker.title}}</span>
          </div>
        </div>

        <div class="speaker__images" v-images-loaded="animateSpeakerSlide" v-if="speaker.img">
          <div class="speaker__image speaker__one" v-if="speaker.img"><img :src="speaker.imgUrl+speaker.img"></div>
          <div class="speaker__image speaker__two" v-if="speaker.img2"><img :src="speaker.imgUrl+speaker.img2"></div>
          <div class="speaker__image speaker__three" v-if="speaker.img3"><img :src="speaker.imgUrl+speaker.img3"></div>
        </div>

        <!--<div class="speaker-footer">-->
        <!--<div v-if="speaker.twitter">@{{speaker.twitter}}</div>-->
        <!--<div v-if="speaker.homepage">{{speaker.homepage}}</div>-->
        <!--</div>-->
      </div>
    </transition>
  </div>
</template>
<script>
  import axios from 'axios'
  import anime from 'animejs'
  import imagesLoaded from 'vue-images-loaded'

  export default {
    name: 'speakers',
    created: function () {
      this.getEvents()
    },
    data () {
      return {}
    },
    directives: {
      imagesLoaded
    },
    sockets: {
      gotoSlide: function (slide) {
        this.$router.push({ path: slide })
      }
    },
    methods: {
      animateSpeakerSlide: function (instance) {
        anime({
          targets: '.speaker__text-content span',
          translateY: ['100%', '0%'],
          easing: [0.4, 0.0, 0.2, 1],
          duration: 500,
          delay: function (el, i, l) {
            return i * 250
          }
        })

        let speakerImages = anime.timeline()

        speakerImages.add({
          targets: '.speaker__one',
          translateY: ['100%', 0],
          rotateZ: ['25deg', '0'],
          scale: [0.75, 1],
          easing: [0.4, 0.0, 0.2, 1],
          duration: 250,
          delay: 50
        }).add({
          targets: '.speaker__two',
          translateX: ['50px', '50px'],
          translateY: ['100%', 0],
          rotateZ: ['25deg', '0'],
          scale: [0.75, 1],
          easing: [0.4, 0.0, 0.2, 1],
          duration: 250
        }).add({
          targets: '.speaker__three',
          translateX: ['100px', '100px'],
          translateY: ['100%', 0],
          rotateZ: ['25deg', '0'],
          scale: [0.75, 1],
          easing: [0.4, 0.0, 0.2, 1],
          duration: 250
        })
      },
      getEvents: function () {
        let events = this.$store.getters.events
        if (!events.length) {
          axios.get(this.$store.getters.config.APIEvents)
            .then(
              res => {
                this.$store.dispatch('setEvents', res.data.events)
              }
            )
            .catch(
              err => {
                return err.response.status
              }
            )
        }
      }
    },
    computed: {
      events () {
        return this.$store.getters.events
      },
      speaker () {
        if (this.events.length) {
          const regex = /[^\\/]+$/g
          let speaker = this.$store.getters.speakerById(this.$route.params.id)
          let del = regex.exec(speaker.imgUrl)
          if (del) {
            speaker.imgUrl = speaker.imgUrl.replace(del[0], '')
          }
          return speaker
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "~scss/_vars.scss";

  .speaker__text {
    font-family: 'brandon', Helvetica, Arial, sans-serif;
    font-size: 62px;
    font-weight: 700;
    position: relative;
    z-index: 10;

    max-width: 60vw;

    &-content {
      overflow: hidden;

      span {
          display: inline-block;
          position: relative;
          transform: translateY(100%);
      }
    }
  }

.speaker__name {
  color: $prim2;
}

.speaker__title {
  color: $prim1;
}

.speaker__one {
  background: $prim2;
}

.speaker__two {
  background: $prim1;
}

.speaker__three {
  background: $prim3;
}

.speaker__images {
  position: fixed;
  right: 0;
  bottom: 0;
  transform: translateZ(0);
  direction: rtl;
  text-align: right;
}

.speaker__image {
  display: inline-block;
  width: 24vw;
  height: 24vw;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  perspective: 360px;
  transform: translateY(100%) rotateZ(25deg) scale(.5);
  mix-blend-mode: multiply;
  clip-path: polygon(0 5%,100% 0,98% 85%,10% 100%);

  img {
    width: 100%;
    height: 100%;
    mix-blend-mode: multiply;
    filter: grayscale(100%) brightness(110%);
    object-fit: cover;
  }
}
</style>
