<template>
  <div class="page-wrapper page-wrapper--centered">
    <div class="container--centered next-container" v-if="nextEvent">
      <span class="next">NEXT UP:</span>
      <span class="date">{{nextEvent.date}}</span>
      <span class="year">{{nextEvent.dateYear}}</span>
      <span class="time">{{nextEvent.beginn}} @ Karton</span>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'

  export default {
    name: 'next-wmhb',
    created: function () {
      this.getEvents()
    },
    methods: {
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
    sockets: {
      gotoSlide: function (slide) {
        this.$router.push({ path: slide })
      }
    },
    computed: {
      nextEvent () {
        return this.$store.getters.nextEvent()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~scss/_vars.scss";

  span {
    display: block;
    text-align: left;
    line-height: 0.8;
  }

  .next,
  .time {
    font-size: 10vmin;

    @media screen and (min-width: $screen-sm) {
      font-size: 8vh;
    }
  }

.time {
  font-size: 6vmin;
  text-align: right;
  line-height: 1;

  @media screen and (min-width: $screen-sm) {
    font-size: 5vh;
  }
}

.date,
.year {
  font-size: 34vmin;
  color: $prim2;

  @media screen and (min-width: $screen-sm) {
    font-size: 27vh;
  }
}

.year {
  font-size: 38vmin;
  color: transparent;
  -webkit-text-stroke-width: .2rem;
  -webkit-text-stroke-color: $prim1;

  @media screen and (min-width: $screen-md) {
    font-size: 30.5vh;
    -webkit-text-stroke-width: .4rem;
  }
}

</style>
