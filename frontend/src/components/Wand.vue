<template>
  <keep-alive>
    <transition name="page-slide" mode="out-in">
      <router-view></router-view>
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
      connect: function () {
        console.log('socket connected')
      },
      disconnect: function () {
        console.log('disconnected')
      },
      gong: function () {
        audio.gong.play()
      },
      music: function () {
        audio.music.toggle()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  // descriptive variables, add as needed:
  // greyscale
  $black          : rgb(0,0,0);
  $darkgrey       : lighten($black, 25%);
  $grey           : lighten($black, 50%);
  $lightgrey      : #bec0c2;
  $lightergrey    : lighten($black, 90%);
  $white          : rgb(255,255,255);

  // primarycolors:
  $prim1:  rgb(39, 174, 96);
  // $prim1:  #4e2e28;
  $prim2:  rgb(0,0,0);
  $prim3:  rgb(231, 76, 60);
  $prim4:  rgb(52, 73, 94);

  $success-color: green;
  $alert-color:   red;


  // Layout Defaults
  $maxWidth:      1440px;
  $bgHeader:      $prim3;
  $text-color:    $black;
  $head-color:    $black;
  $link-color:    $prim1;
  $bg-color:      white;
  $border-color:  $prim2;
  $code-bg-color: $grey;

  $btn-text:      white;
  $btn-bg:        $prim3;
  $btn-text-hov:  $black;
  $btn-primary:   transparent;
  $btn-prim-hov:  $white;
  $btn-border:    $prim3;

  $btn-border-bright:     white;
  $btn-text-bright:       white;
  $btn-text-bright-hov:   $prim3;
  $btn-prim-bright-hov:   white;

  $btn-second:    transparent;
  $btn-success:   $success-color;
  $btn-alert:     $alert-color;
  $highlight-bg:  $prim3;

  $nav-text: $lightgrey;
  $nav-text-active: black;
  $mg-bottom: 22px;
  $mg-bottom-small: 12px;

  $nav-height: 5rem;

  // Typography
  $font-size:         62.5%;
  $font-size-body:    18px;
  $line-height:       $font-size-body*.6;
  $font-main:         "PT Sans", Helvetica, Arial, sans-serif;
  $font-main-bold:    "PT Sans", Helvetica, Arial, sans-serif;
  $font-heading:      "brandon-grotesque", "Helvetica-Neue", Helvetica, Arial, sans-serif;
  $font-heading-light:"brandon-grotesque", "Helvetica-Neue", Helvetica, Arial, sans-serif;
  $font-button:       $font-heading;
  $font-mono:         monospace, sans-serif;
  $font-size-h1:      34px;
  $font-size-h2:      25px;
  $font-size-h3:      22px;
  $font-size-h4:      20px;
  $font-size-h5:      20px;
  $font-size-h6:      20px;
  $font-size-small:   9px;

  // Extra small screen / phone
  // Note: Deprecated $screen-xs and $screen-phone as of v3.0.1
  $screen-xs:                  480px;
  $screen-xs-min:              $screen-xs;
  $screen-phone:               $screen-xs-min;

  // Small screen / tablet
  // Note: Deprecated $screen-sm and $screen-tablet as of v3.0.1
  $screen-sm:                  768px;
  $screen-sm-min:              $screen-sm;
  $screen-tablet:              $screen-sm-min;

  // Medium screen / desktop
  // Note: Deprecated $screen-md and $screen-desktop as of v3.0.1
  $screen-md:                  992px;
  $screen-md-min:              $screen-md;
  $screen-desktop:             $screen-md-min;

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: $prim1;
  }

  .twitterwall {
    height: 100vh;
    overflow: hidden;

    padding: 1.5rem;
    padding-top: 0;
    text-align: left;

    @media screen and (min-width: $screen-sm-min) {
      padding: 5.0rem;
      padding-top: 3.5rem;
    }

    @media screen and (min-width: $screen-md-min) {
      /*height: calc(100vh - 8.0rem);*/
      height: 100vh;
    }
  }

  .tweet {
    opacity: 1;
    display: flex;
    flex: 0 0 100%;
    justify-content: space-around;
    align-items: center;
    padding-top: 1.5rem;
    transform: scale(1);

    @media screen and (min-width: $screen-sm-min) {
      flex: 0 0 50%;
      padding: 1.5rem 0 0 1.5rem;
    }

    @media screen and (min-width: 1215px) {
      height: 50%;
      width: 33.333%;
      flex: 0 0 33.333%;
    }

    &__container {
      display: flex;
      flex-wrap: wrap;
      height: 100%;

      @media screen and (min-width: $screen-sm-min) {
        margin: 0 0 -1.5rem -1.5rem;
      }
    }

    &__content {
      background-color: $white;
      height: 100%;
      max-width: 100%;
      position: relative;
      padding: 1.5rem;
      display: flex;
      flex: 1;
      flex-direction: column;

      box-shadow: 0 13px 25px 0 rgba(0, 0, 0, 0.3), 0 7px 7px 0 rgba(0, 0, 0, 0.19);

      .tweet--image & {
        overflow: hidden;
        color: $white;

        &:before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          z-index: 1;
          top: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.9) 100%);
        }
      }
    }

    &__image {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 200%;
      transform: translate(-50%,-50%);
      max-width: none;
    }

    &__avatar {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      height: 5.0rem;
      width: 5.0rem;
      z-index: 1;
    }

    &__user,
    &__text,
    &__timeago {
      display: flex;
      z-index: 1;
    }

    &__user,
    &__timeago {
      font-family: $font-heading;
      text-transform: uppercase;
    }

    &__user {
      line-height: 5.0rem;
      padding-left: 6.5rem;
      margin-bottom: 1.5rem;
      flex: 0 1 5.0rem;

      @media screen and (min-width: $screen-sm-min) {
        margin-bottom: 3.5rem;
      }
    }

    &__text {
      align-self: stretch;
      flex: 1;
      font-size: 16px;
      line-height: 1.2;
      overflow: hidden;

      @media screen and (min-width: 1215px) {
        font-size: $font-size-h2
      }
    }

    &__timeago {
      align-self: flex-end;
      margin-top: 1.5rem;
    }
  }

  /*Animatoins*/
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


  .tweet-move {
    transition: all cubic-bezier(.4,0,.2,1) 400ms;
  }

  .tweet-enter,
  .tweet-leave-to {
    opacity: 0;
    transform: scale(0.2);
  }
  .tweet-enter-to,
  .tweet-leave{
    opacity: 1;
    transform: scale(1);
  }

  .tweet-leave-active,
  .tweet-enter-active
  {
    transition: all 400ms cubic-bezier(.4,0,.2,1);
  }
</style>
