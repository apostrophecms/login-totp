module.exports = {
  improve: '@apostrophecms/user',
  fields: {
    add: {
      resetTotp: {
        label: 'Reset TOTP',
        type: 'boolean',
        help: 'Select this option and save to reset the user\'s TOTP (Google Authenticator) configuration once, so they can set it up again.'
      }
    }
  },
  tasks(self) {
    return {
      resetTotp: {
        usage: 'Invoke this task with a username or email address to reset TOTP (Google Authenticator) so they can set it up again.',
        async task(argv) {
          const username = argv._[1];
          const result = await self.safe.updateOne({
            $or: [
              {
                username
              },
              {
                email: username
              }
            ]
          }, {
            $unset: {
              totp: 1
            }
          });
          if (!result.modifiedCount) {
            throw 'User not found.';
          }
        }
      }
    };
  },
  handlers(self) {
    return {
      beforeSave: {
        async resetTotp(req, doc) {
          if (doc.resetTotp) {
            doc.resetTotp = false;
            await self.apos.user.safe.updateOne({
              _id: doc._id
            }, {
              $unset: {
                totp: 1
              }
            });
          }
        }  
      }
    }
  }
};
