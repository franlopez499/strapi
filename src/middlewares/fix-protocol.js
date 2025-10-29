'use strict';

/**
 * Middleware to detect protocol behind reverse proxy
 * Logs mismatches but does not mutate Koa ctx (protocol is a getter)
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Check if we're behind a proxy and protocol is wrong
    let forwardedProto = ctx.headers['x-forwarded-proto'];
    if (!forwardedProto && ctx.headers['cf-visitor']) {
      try {
        const cfVisitor = JSON.parse(ctx.headers['cf-visitor']);
        forwardedProto = cfVisitor.scheme;
      } catch (_) {}
    }

    if (forwardedProto && forwardedProto === 'https' && ctx.protocol === 'http') {
      strapi.log.warn('Proxy indicates HTTPS but Koa detected HTTP. Ensure app.proxy=true and proxy forwards X-Forwarded-Proto.');
    }
    
    await next();
  };
};

