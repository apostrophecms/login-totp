const { createHash } = require('crypto');
const base32 = require('base32');

module.exports = {
  improve: '@apostrophecms/login',
  requirements(self) {

    return {
      add: {
        AposTotp: {
          phase: 'afterPasswordVerified',
          async props(req, user) {
            if (!user.totp) {
              const hash = createHash('sha512').update(user._id).digest('hex');

              const token = base32.encode(hash);

            }

            return {};
          },
          async verify(req, user) {
            throw self.apos.error('invalid', req.t('AposTotp:missingConfig'));
            // if (!req.body.requirements.AposRecaptcha) {
            // }

          }
        }
      }
    };
  },
  methods(self) {
    return {
      async checkTotp (req, token) {

      }
    };
  }
};
