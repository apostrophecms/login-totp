const { randomBytes } = require('crypto');
const base32 = require('thirty-two');
const totp = require('totp-generator');

module.exports = {
  improve: '@apostrophecms/login',
  i18n: {
    aposTotp: {
      browser: true
    }
  },
  init (self, { totp }) {
    if (!totp.secret) {
      self.apos.util.warn('You should provide a secret of a length of 10 characters in the login module\'s config.');
    } else if (totp.secret.length < 10) {
      self.apos.util.warn('Your secret should be 10 characters length.');
    }
  },
  requirements(self) {
    return {
      add: {
        AposTotp: {
          phase: 'afterPasswordVerified',
          askForConfirmation: true,
          async props(req, user) {
            if (!user.totp || !user.totp.activated) {
              const validSecret = self.getSecret();
              const hash = randomBytes(validSecret ? 5 : 10).toString('hex');
              const token = self.generateToken(hash, validSecret);

              user.totp = {
                hash,
                activated: false
              };

              try {
                await self.apos.user
                  .update(req, user, { permissions: false });
              } catch (err) {
                throw self.apos.error('unprocessable', req.t('aposTotp:updateError'));
              }

              return {
                token,
                projectName: self.apos.shortName
              };
            }

            return {};
          },
          async verify(req, data, user) {

            const code = self.apos.launder.string(data);

            if (!code) {
              throw self.apos.error('invalid', req.t('aposTotp:invalidToken'));
            }

            const userToken = self.generateToken(user.totp.hash, self.getSecret());

            const totpToken = totp(userToken);

            if (totpToken !== code) {
              throw self.apos.error('invalid', req.t('aposTotp:invalidToken'));
            }

            if (!user.totp.activated) {
              user.totp.activated = true;

              try {
                await self.apos.user
                  .update(req, user, { permissions: false });
              } catch (err) {
                throw self.apos.error('unprocessable', req.t('aposTotp:updateError'));
              }
            }
          }
        }
      }
    };
  },
  methods(self) {
    return {
      generateToken (hash, secret) {
        const formattedSecret = secret
          ? secret.substring(0, 10)
          : '';

        return base32.encode(hash + formattedSecret).toString();
      },
      getSecret () {
        const { secret } = self.options.totp;

        return secret && secret.length >= 10 && secret;
      }
    };
  }
};
