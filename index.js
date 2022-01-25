module.exports = {
  improve: '@apostrophecms/login',
  requirements(self) {

    return {
      add: {
        AposTotp: {
          phase: 'afterPasswordVerified',
          async props(req, user) {

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
