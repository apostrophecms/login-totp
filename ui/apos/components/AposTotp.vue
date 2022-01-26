<template>
  <h3>My Totp Modal</h3>
</template>

<script>

export default {
  props: {
    sitekey: String
  },
  emits: [ 'done', 'block' ],
  data() {
    return {
      token: null
    };
  }
};
</script>
<style lang='scss'></style>
