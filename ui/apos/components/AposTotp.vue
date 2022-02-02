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
          :key="i"
          ref="inputs"
          v-model="code[i]"
          type="number"
          maxlength="1"
          pattern="([12345])\w{0}"
          class="apos-totp__login-input"
          placeholder="."
          @keyup="handleKeyDown($event, i)"
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
  </div>
</template>

<script>
import qrcode from 'qrcode';
// const codeLength = 6;
// const code = [ ...Array(codeLength).keys() ].reduce((acc, i) => ({
//   ...acc,
//   [`code${i}`]: ''
// }), {});

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
      // ...code,
      // codeLength,
      // code: Array(6).fill(''),
      code: [ '', '', '', '', '', '' ],
      tooltip: 'Copied!',
      copying: false,
      verifyDisabled: true,
      busy: false
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
      const otpUrl = `otpauth://totp/${this.projectName}?secret=${this.token}&period=30`;

      qrcode.toCanvas(this.$refs.canvas, otpUrl);
    }

    this.$refs.inputs[0].focus();
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
    },
    handleKeyDown (e, i) {
      const allowedKeys = [ 'Backspace', 'Enter' ];
      e.preventDefault();

      const number = parseInt(e.key, 10);

      // if (!number && number !== 0 && !allowedKeys.includes(e.key)) {
      // e.preventDefault();
      // }

      if (this.code[i].length === 1) {
        e.preventDefault();

        this.focusInput(i);
      }

      if (this.code[i].length > 1) {
        e.preventDefault();
        this.code.splice(i, 1, e.key);

        this.focusInput(i);
      }

      if (e.key === 'ArrowLeft') {
        this.focusInput(i, true);
      }

      if (e.key === 'ArrowRight') {
        this.focusInput(i);
      }

      // this.code.splice(i, 1, e.key);
    },

    focusInput (i, before = false) {
      const inputs = this.$refs.inputs;

      if (before) {
        if (inputs[i - 1]) {
          inputs[i - 1].focus();
        } else {
          inputs[inputs.length - 1].focus();
        }

        return;
      }

      if (inputs[i + 1]) {
        inputs[i + 1].focus();
      } else {
        inputs[0].focus();
      }
    }
    // handleKeyDown(event, index) {
    //   const key = event.key;
    //   if (!key) {
    //     return;
    //   }
    //   if (key === 'Backspace') {
    //     if (this.code[index]) {
    //       return (this.code[index] = '');
    //     }

    //     if (index > 0) {
    //       event.target.previousElementSibling.focus();
    //     }
    //   } else if (
    //     !event.shiftKey &&
    //             (key === 'ArrowRight' || key === 'Right')
    //   ) {
    //     if (index < this.code.length - 1) {
    //       event.target.nextElementSibling.focus();
    //     }
    //   } else if (
    //     !event.shiftKey &&
    //             (key === 'ArrowLeft' || key === 'Left')
    //   ) {
    //     if (index > 0) {
    //       event.target.previousElementSibling.focus();
    //     }
    //   } else if (key.length === 1 && this.code[index]) {
    //     this.code[index] = key;
    //     this.$forceUpdate();
    //     if (index < this.code.length - 1) {
    //       event.target.nextElementSibling.focus();
    //     }
    //   }
    // }
  }
};
</script>
<style lang='scss' src="./AposTotp.scss" scoped></style>
