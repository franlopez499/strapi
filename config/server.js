module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),

  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  url: env('URL'),
  proxy: {
    koa: true, // Trust proxy headers
    trustProxy: true
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    url: '/admin',
    cookie: {
      secure: false,
      sameSite: 'none',
      httpOnly: true,
    },
  },
});
