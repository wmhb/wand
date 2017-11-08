<template>
  <div id="app" :class="{'app--adminview': hideHeader()}">
    <div class="image-container image-container--top">
      <img class="image-container__item logo-web" src="../static/logo-wm-web-full.svg" alt="Web">
      <img class="image-container__item logo-montag" src="../static/logo-wm-montag-full.svg" alt="Montag">
    </div>
    <router-view></router-view>
    <div class="image-container image-container--bottom">
      <img class="image-container__item logo-wm" src="../static/wm-logo.svg" alt="Webmontag Logo">
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'app',
  mounted: function () {
    anime({
      targets: '.image-container--top .image-container__item',
      duration: 12000,
      translateX: ['-5vw', '-2.5vw'],
      direction: 'alternate',
      loop: true,
      easing: [0.4, 0.0, 0.2, 1],
      delay: function (el, i, l) {
        return i * 3000
      }
    })
  },
  data () {
    return {
      hideHeader: () =>
        window.location.href.indexOf('admin') >= 0 ||
        window.location.href.indexOf('login') >= 0
    }
  }
}
</script>

<style lang="scss">
@import "~scss/_vars.scss";

@font-face {
  font-family: "brandon";
  src: url("../static/fonts/brandon_bld.woff2") format("woff2"),
    url("../static/fonts/brandon_bld.woff") format("woff");
  font-weight: 300;
}

@font-face {
  font-family: "brandon";
  src: url("../static/fonts/brandon_blk.woff2") format("woff2"),
    url("../static/fonts/brandon_blk.woff") format("woff");
  font-weight: 700;
}

* {
  box-sizing: border-box;
}

html {
  font-size: $font-size;
  height: 100vh;
}

body {
  margin: 0;
  padding: 0;
  background-color: $white;
  width: 100vw;
  overflow-x: hidden;

  font-family: "brandon", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: $font-size-body;
}

img {
  max-width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: top;
}

h1,
h2,
h3 {
  margin: 0;
  padding: 0;
}

.page-wrapper {
  height: 100vh;

  padding: 1.5rem;
  text-align: left;

  will-change: transform, opacity;


  @media screen and (min-width: $screen-sm-min) {
    height: 100vh;
    overflow: hidden;
    padding: 5rem;
    padding-top: 3.5rem;
  }

  @media screen and (min-width: $screen-md-min) {
    height: 100vh;
  }

  &--centered,
  &--vcentered {
    display: flex;
    align-items: center;
  }

  &--centered {
    justify-content: center;
  }

  &--scroll {
    height: auto;
    overflow-scrolling: auto;
  }
}

.container--centered {
  flex: none;
  z-index: 10;

  @media screen and (min-width: $screen-sm) {
    transform: translateY(15vh);
  }

  * {
    text-align: center;
  }
}

.image-container {
  position: absolute;

  &__item {
    max-width: none;
  }

  &--top {
    top: 0;
    left: 0;
  }

  &--bottom {
    right: 0;
    bottom: 0;
    overflow: hidden;
    opacity: 0.05;
    z-index: -1;

    .image-container__item {
      width: 50vw;
      transform: translate(2.5vw, 2.5vw);
    }
  }
}

.image-container--top {
  width: 100vw;
  overflow: hidden;
}

.image-container {
  .logo-web,
  .logo-montag {
    position: absolute;
    width: 105vw;
    top: -2.5vw;
  }

  .logo-montag {
    position: relative;
  }

  .logo-montag {
    mix-blend-mode: multiply;
  }
}

.app--adminview {
  .image-container {
    display: none;
  }
}

/*Animations*/
.page-slide-enter-active,
.page-slide-leave-active {
  transition: transform 150ms cubic-bezier(1, 0.5, 0.8, 1),
              opacity 150ms linear;
}

.page-slide-enter,
.page-slide-leave-to {
  transform: translateX(5vw);
  opacity: 0;
}
</style>
