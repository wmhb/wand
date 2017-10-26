<template>
  <div class="page-wrapper page-wrapper--centered">
    <div class="container--centered">
      <div>
        <img src="../../../static/bremendigitalmedia.svg" alt="">
        <div>(DANKE FÜR DIE <span>UNTERSTÜTZTUNG</span>)</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sponsors',
    created: function () {
    },
    sockets: {
      gotoSlide: function (slide) {
        this.$router.push({ path: slide })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~scss/_vars.scss";
  img {
    width: 65vw;
  }
  div {
    font-size: 4vmin;
    text-align: right;
    font-weight: 700;

    @media screen and (min-width: $screen-sm) {
      span {
        color: transparent;
        -webkit-text-stroke-width: .2rem;
        -webkit-text-stroke-color: #2c3e50;
      }
    }
  }
</style>
