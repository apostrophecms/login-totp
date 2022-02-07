const assert = require('assert');
const testUtil = require('apostrophe/test-lib/test');

describe('Forms module', function () {
  let apos;

  this.timeout(25000);

  after(async function () {
    testUtil.destroy(apos);
  });

  const totpSecret = 'totpsecret';
  const userInfos = {
    username: 'marygold',
    password: 'asdfjkl;'
  };

  // Improving
  it('should improve the login module', async function () {
    apos = await testUtil.create({
      shortname: 'loginTest',
      testModule: true,
      modules: {
        '@apostrophecms/login': {
          options: {
            totp: {
              secret: totpSecret
            }
          }
        },
        '@apostrophecms/login-totp': {}
      }
    });

    const login = apos.modules['@apostrophecms/login'];
    const loginTotp = apos.modules['@apostrophecms/login-totp'];

    assert(login.options.totp.secret === totpSecret);
    assert(loginTotp);
  });

  it('should be able to insert test user', async () => {
    assert(apos.user.newInstance);
    const user = apos.user.newInstance();
    assert(user);

    user.title = 'Mary Gold';
    user.username = userInfos.username;
    user.password = userInfos.password;
    user.email = 'mary@gold.rocks';
    user.role = 'editor';

    const doc = await apos.user.insert(apos.task.getReq(), user);
    assert(doc._id);
  });

  it('should ask the user to setup his totp account once logged', async () => {
    const jar = apos.http.jar();

    try {
      await apos.http.post('/api/v1/@apostrophecms/login/login', {
        body: {
          ...userInfos,
          session: true
        },
        jar
      });

      const context = await apos.http.post(
        '/api/v1/@apostrophecms/login/context',
        {
          method: 'POST',
          body: {},
          jar
        }
      );

      console.log('context ===> ', require('util').inspect(context, {
        colors: true,
        depth: 2
      }));

    } catch (err) {
      console.log('err ===> ', err);
    }

    console.log('jar ===> ', require('util').inspect(jar, {
      colors: true,
      depth: 2
    }));

  });

  // it('should not be able to login a user without meeting the beforeSubmit requirement', async function() {

  //   const jar = apos.http.jar();

  //   // establish session
  //   const page = await apos.http.get('/', { jar });

  //   assert(page.match(/logged out/));

  //   const context = await apos.http.post(
  //     '/api/v1/@apostrophecms/login/context',
  //     {
  //       method: 'POST',
  //       body: {},
  //       jar
  //     }
  //   );

  //   assert(context.requirementProps);
  //   assert(context.requirementProps.AposRecaptcha);
  //   // assert.strictEqual(context.requirementProps.AposRecaptcha.sitekey, siteConfig.site);

  //   try {
  //     await apos.http.post(
  //       '/api/v1/@apostrophecms/login/login',
  //       {
  //         method: 'POST',
  //         body: {
  //           username: mary.username,
  //           password: mary.pw,
  //           session: true
  //         },
  //         jar
  //       }
  //     );
  //     assert(false);
  //   } catch (e) {
  //     assert(e.status === 400);
  //     assert.strictEqual(e.body.message, 'The reCAPTCHA token was missing while verifying login.');
  //     assert.strictEqual(e.body.data.requirement, 'AposRecaptcha');
  //   }
  // });

  // it('should log in with a recaptcha token', async function() {

  //   const jar = apos.http.jar();

  //   // establish session
  //   let page = await apos.http.get('/', { jar });

  //   assert(page.match(/logged out/));

  //   await apos.http.post(
  //     '/api/v1/@apostrophecms/login/login',
  //     {
  //       method: 'POST',
  //       body: {
  //         username: mary.username,
  //         password: mary.pw,
  //         session: true,
  //         requirements: {
  //           // The reCAPTCHA test keys accept any token value.
  //           AposRecaptcha: 'valid-token'
  //         }
  //       },
  //       jar
  //     }
  //   );

  //   page = await apos.http.get('/', { jar });

  //   assert(page.match(/logged in/));
  // });
});
