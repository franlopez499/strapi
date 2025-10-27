module.exports = [
  {
    name: 'strapi::logger',
    config: {
      level: 'debug', // default is info
    },
  },
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: (ctx) => {
        // Accept requests from your real frontend or Cloudflare
        return ['https://strapi.inpublic.es', 'https://*.inpublic.es'];
      },
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'global::seo-auto-populate',
    config: {},
  },
];
