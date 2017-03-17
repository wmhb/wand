<template>
  <h1>speakers</h1>
</template>
<script>
  export default {
    name: 'speakers',
    created: function () {
    },
    sockets: {
      gotoSlide: function (slide) {
        this.$router.push({ path: slide })
      }
    }
  }
</script>
