<template>
  <div class="apos-totp">
    <div
      v-if="token"
      class="apos-totp__setup"
    >
      <h3>Activate Totp auth</h3>
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
      <h3>Log in with you Totp app</h3>
      <label for="code">Code:</label>
      <input
        v-model="code"
        type="text"
        name="code"
      >
      <button @click="sendCode">
        Ok
      </button>
    </div>
    <a href="/">Back</a>
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
    userId: {
      type: String,
      default: null
    },
    username: {
      type: String,
      default: null
    }
  },
  emits: [ 'done', 'block' ],
  data() {
    return {
      code: '',
      setupTotpRoute: '/api/v1/@apostrophecms/login/setup-totp',
      setupMode: this.setupTotpMode
    };
  },
  mounted () {
    if (this.token) {
      const otpUrl = `otpauth://totp/${this.username}?secret=${this.token}&period=30`;

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
