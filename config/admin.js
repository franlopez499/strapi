module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
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
  },
  url: env('ADMIN_URL', '/admin'),
  cookie: {
    secure: true,
    sameSite: 'lax', // Changed from 'none' to 'lax' for same-domain admin
    httpOnly: true,
    domain: env('COOKIE_DOMAIN', undefined), // Let browser set domain automatically
  },
});
