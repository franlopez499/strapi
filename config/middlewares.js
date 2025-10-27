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
        // Get the origin from the request
        const origin = ctx.request.header.origin;
        // Accept requests from inpublic.es domain or same domain
        if (origin && (origin.endsWith('.inpublic.es') || origin === 'https://strapi.inpublic.es')) {
          return origin;
        }
        // Default to the configured URL for same-origin requests
        return 'https://strapi.inpublic.es';
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
