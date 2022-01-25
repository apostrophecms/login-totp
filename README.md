<div align="center">
  <img src="https://raw.githubusercontent.com/apostrophecms/apostrophe/main/logo.svg" alt="ApostropheCMS logo" width="80" height="80">

  <h1>Apostrophe reCAPTCHA Login Verification</h1>
  <p>
    <a aria-label="Apostrophe logo" href="https://v3.docs.apostrophecms.org">
      <img src="https://img.shields.io/badge/MADE%20FOR%20Apostrophe%203-000000.svg?style=for-the-badge&logo=Apostrophe&labelColor=6516dd">
    </a>
    <a aria-label="Test status" href="https://github.com/apostrophecms/login-totp/actions">
      <img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/workflow/status/apostrophecms/login-totp/Tests/main?label=Tests&labelColor=000000&style=for-the-badge">
    </a>
    <a aria-label="Join the community on Discord" href="http://chat.apostrophecms.org">
      <img alt="" src="https://img.shields.io/discord/517772094482677790?color=5865f2&label=Join%20the%20Discord&logo=discord&logoColor=fff&labelColor=000&style=for-the-badge&logoWidth=20">
    </a>
    <a aria-label="License" href="https://github.com/apostrophecms/login-recaptcha/blob/main/LICENSE.md">
      <img alt="" src="https://img.shields.io/static/v1?style=for-the-badge&labelColor=000000&label=License&message=MIT&color=3DA639">
    </a>
  </p>
</div>

This login verification module adds a [Totp (time-based one-time password)](https://en.wikipedia.org/wiki/Time-based_one-time_password) check when any user logs into the site. It uses [totp-generator](https://www.npmjs.com/package/totp-generator), [qrcode](https://www.npmjs.com/package/qrcode) and node [crypto](https://nodejs.org/api/crypto.html) to generate a secret, making it available to the user through a QR code, and validating user Totp code when trying to login.

## Installation

To install the module, use the command line to run this command in an Apostrophe project's root directory:

```
npm install @apostrophecms/login-totp
```

## Usage

Instantiate the Totp login module in the `app.js` file:

```javascript
require('apostrophe')({
  shortName: 'my-project',
  modules: {
    '@apostrophecms/login-totp': {}
  }
});
```
