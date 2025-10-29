'use strict';

/**
 * Middleware to fix empty Authorization headers that interfere with admin login
 * Cloudflare or browsers sometimes send empty "Authorization: Bearer" headers
 * which cause Strapi to attempt token authentication before checking credentials
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only process admin login endpoint
    if (ctx.path === '/admin/login' && ctx.method === 'POST') {
      const authHeader = ctx.headers.authorization;
      
      // Remove empty or whitespace-only Authorization headers
      if (authHeader && (!authHeader.trim() || authHeader.trim() === 'Bearer')) {
        delete ctx.headers.authorization;
        strapi.log.debug('Removed empty Authorization header from login request');
      }
    }
    
    await next();
  };
};

