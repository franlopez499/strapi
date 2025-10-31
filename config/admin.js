module.exports = ({ env }) => ({
  auth: {
    events: {
      onConnectionSuccess(e) {
        console.log(e.user, e.provider);
      },
      onConnectionError(e) {
        console.error(e.error, e.provider);
      },
    },
    secret: env('ADMIN_JWT_SECRET'),
    cookie: {
      path: '/admin',
      domain: 'strapi.inpublic.es',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    },
  },
  
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  }
});
