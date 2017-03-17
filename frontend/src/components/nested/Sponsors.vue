<template>
  <h1>sponsors</h1>
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
