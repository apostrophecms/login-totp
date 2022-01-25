<template>
  <h3>My Totp Modal</h3>
</template>

<script>

export default {
  emits: [ 'done', 'block' ],
  props: {
    sitekey: String
  },
  data() {
    return {
      token: null
    };
  },
}
</script>
<style lang='scss'></style>