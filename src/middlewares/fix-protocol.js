'use strict';

/**
 * Middleware to fix protocol detection behind reverse proxy
 * Ensures ctx.protocol is set correctly based on x-forwarded-proto header
 * This is critical for secure cookies to work properly
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Check if we're behind a proxy and protocol is wrong
    const forwardedProto = ctx.headers['x-forwarded-proto'] || 
                          (ctx.headers['cf-visitor'] ? JSON.parse(ctx.headers['cf-visitor']).scheme : null);
    
    if (forwardedProto && forwardedProto === 'https' && ctx.protocol === 'http') {
      // Fix protocol for Koa context
      ctx.request.protocol = 'https';
      ctx.protocol = 'https';
      
      // Also fix secure flag
      ctx.request.secure = true;
      
      strapi.log.debug(`Fixed protocol from http to https based on x-forwarded-proto header`);
    }
    
    await next();
  };
};

