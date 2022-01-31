<template>
  <div class="apos-totp">
    <div
      v-if="token"
      class="apos-totp__setup"
    >
      <h3 class="apos-totp__title">
        $('aposTotp:loginTitle')
      </h3>
      <p class="apos-totp__text">
        Install Google Authenticator or similar TOTP app, then
      </p>
      <p class="apos-totp__scan-title">
        Scan this QR code
      </p>
      <canvas
        ref="canvas"
        class="apos-totp__qrcode"
      />
      <p class="apos-totp__text-grey">
        Or manually enter this key
      </p>
      <div class="apos-totp__token-container">
        <p class="apos-totp__token">
          {{ token }}
        </p>
        <button
          class="apos-totp__text-grey apos-totp__copy-token-btn"
          @click="copyToken(token)"
        >
          <AposIndicator
            icon="content-copy-icon"
            class="apos-button__icon"
          />
          <span class="apos-totp__copy-token-text">Copy key</span>
        </button>
        <AposIndicator
          v-if="copying"
          icon="check-bold-icon"
          class="apos-button__icon apos-totp__token-copied"
          icon-color="#00bf9a"
        />
        <AposIndicator
          v-if="copying === 'error'"
          icon="alert-circle-icon"
          class="apos-button__icon apos-totp__token-copied"
          icon-color="#ea433a"
        />
      </div>
    </div>
    <div class="apos-topt__login">
      <p
        v-if="token"
        class="apos-totp__text apos-totp__login-text"
      >
        Then enter the verification code from your authenticator app
      </p>
      <h3
        v-else
        class="apos-totp__title"
      >
        Log in with you TOTP app
      </h3>
      <form
        class="apos-totp__login-form"
        @submit.prevent="sendCode"
      >
        <input
          v-for="(_, i) in code"
          :key="code[i]"
          v-model="code[i]"
          class="apos-totp__login-input"
          type="number"
          min="0"
          max="9"
          placeholder="0"
        >
        <AposButton
          :busy="busy"
          :disabled="verifyDisabled"
          type="primary"
          label="aposTotp:verify"
          button-type="submit"
          class="apos-totp__login-submit"
          :modifiers="['gradient-on-hover', 'block']"
          @click="sendCode"
        />
      </form>
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
    username: {
      type: String,
      default: null
    }
  },
  emits: [ 'done', 'block' ],
  data() {
    return {
      code: Array(6),
      tooltip: 'Copied!',
      copying: false,
      verifyDisabled: true
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
    },
    async copyToken (token) {
      const time = 1200;

      try {
        await navigator.clipboard.writeText(token);

        this.copying = true;

        setTimeout(() => {
          this.copying = false;
        }, time);
      } catch (err) {
        this.copying = 'error';

        setTimeout(() => {
          this.copying = false;
        }, time);
      }
    }
  }
};
</script>
<style lang='scss' src="./AposTotp.scss"></style>
