<template>
  <div class="apos-totp">
    <div
      v-if="token"
      class="apos-totp__setup"
    >
      <h3>Activate TOTP auth</h3>
      <p>Scan this QR Code in Google Authenticator or a similar app:</p>
      <canvas
        ref="canvas"
        class="apos-totp__qrcode"
      />
      <p>Or enter this key manually:</p>
      <p>{{ token }}</p>
      <p>When you are finished setting up totp, simply enter the code given by your app below.</p>
    </div>
    <div class="apos-topt__login">
      <h3>Log in with you TOTP app</h3>
      <form @submit.prevent="sendCode">
        <label for="code">Code:</label>
        <input
          v-model="code"
          type="text"
          name="code"
        >
        <input
          type="submit"
          value="Ok"
        >
      </form>
    </div>
  </div>
</template>

<script>
import qrcode from 'qrcode';

export default {
  props: {
    token: {
      type: String,
      default: null
    },
    projectName: {
      type: String,
      default: null
    },
    success: {
      type: Boolean,
      default: false
    },
    error: {
      type: Error,
      default: null
    }
  },
  emits: [ 'done', 'block', 'confirm' ],
  data() {
    return {
      code: ''
    };
  },
  watch: {
    success (newVal) {
      if (newVal) {
        this.$emit('confirm');
      }
    }
  },
  mounted () {
    if (this.token) {
      const otpUrl = `otpauth://totp/${this.identity}?secret=${this.token}&period=30`;

      qrcode.toCanvas(this.$refs.canvas, otpUrl);
    }
  },
  methods: {
    sendCode () {
      this.$emit('done', this.code);
    }
  }
};
</script>
<style lang='scss'>
.apos-totp {
  color: #fff;

  &__qrcode {
    width: 100%;
  }
}
</style>
