<div align="center">
  <img src="https://raw.githubusercontent.com/apostrophecms/apostrophe/main/logo.svg" alt="ApostropheCMS logo" width="80" height="80">

  <h1>Apostrophe TOTP Login Verification</h1>
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
    <a aria-label="License" href="https://github.com/apostrophecms/login-totp/blob/main/LICENSE.md">
      <img alt="" src="https://img.shields.io/static/v1?style=for-the-badge&labelColor=000000&label=License&message=MIT&color=3DA639">
    </a>
  </p>
</div>

This login verification module adds a [TOTP (Time-based One-Time Password)](https://en.wikipedia.org/wiki/Time-based_one-time_password) check when any user logs into the site, compatible with Google Authenticator or any TOTP app.
When activated, it will ask unregistered users to add a token to their app through a QR code. Once done, it will ak users to enter the code provided by their app after the initial login step.

## Installation

To install the module, use the command line to run this command in an Apostrophe project's root directory:

```
npm install @apostrophecms/login-totp
```

## Usage

Instantiate the TOTP login module in the `app.js` file:

```javascript
require('apostrophe')({
  shortName: 'my-project',
  modules: {
    '@apostrophecms/login-totp': {}
  }
});
```

We highly recommend you to set a specific secret for your TOTP authentication system.
This secret must be added to the `@apostrophecms/login` module (*not* this module). This module adds functionality to that module (it "improves" it, in Apostrophe speak), so most configuration should be directly on the core login module.

:warning: this secret must be at least 10 characters long (we will remove extra ones), otherwise we won't use it. We need a fixed amount of characters to generate the right length token.

```javascript
// modules/@apostrophecms/login/index.js
module.exports = {
  options: {
    totp: {
      secret: 'totpsecret'
    }
  }
};
```