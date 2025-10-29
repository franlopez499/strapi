'use strict';

/**
 * Comprehensive logging middleware for admin login debugging
 * Logs all request details, authentication attempts, and responses
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only process admin login endpoint
    if (ctx.path === '/admin/login' && ctx.method === 'POST') {
      const timestamp = new Date().toISOString();
      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Log incoming request details
      strapi.log.info('='.repeat(80));
      strapi.log.info(`[${requestId}] 🔐 ADMIN LOGIN ATTEMPT - ${timestamp}`);
      strapi.log.info('='.repeat(80));
      
      // Log request headers (excluding sensitive data)
      strapi.log.info(`[${requestId}] Request Headers:`);
      Object.keys(ctx.headers).forEach(key => {
        const value = ctx.headers[key];
        // Mask Authorization tokens
        if (key.toLowerCase() === 'authorization' && value && value.length > 20) {
          strapi.log.info(`[${requestId}]   ${key}: Bearer ${value.substring(0, 20)}...`);
        } else {
          strapi.log.info(`[${requestId}]   ${key}: ${value}`);
        }
      });
      
      // Log request body (email only, mask password)
      if (ctx.request.body) {
        strapi.log.info(`[${requestId}] Request Body:`);
        strapi.log.info(`[${requestId}]   email: ${ctx.request.body.email || 'MISSING'}`);
        strapi.log.info(`[${requestId}]   password: ${ctx.request.body.password ? '***PROVIDED*** (length: ' + ctx.request.body.password.length + ')' : 'MISSING'}`);
        
        // Log IP address
        const clientIP = ctx.request.ip || ctx.request.connection?.remoteAddress || 'unknown';
        strapi.log.info(`[${requestId}] Client IP: ${clientIP}`);
        
        // Log request origin
        strapi.log.info(`[${requestId}] Origin: ${ctx.headers.origin || 'none'}`);
        strapi.log.info(`[${requestId}] Referer: ${ctx.headers.referer || 'none'}`);
      } else {
        strapi.log.warn(`[${requestId}] ⚠️  Request body is empty or not parsed!`);
      }
      
      // Try to find user before authentication
      if (ctx.request.body?.email) {
        try {
          const user = await strapi.admin.services.user.findOne({ 
            email: ctx.request.body.email 
          });
          
          if (user) {
            strapi.log.info(`[${requestId}] ✅ User found in database:`);
            strapi.log.info(`[${requestId}]   - ID: ${user.id}`);
            strapi.log.info(`[${requestId}]   - Email: ${user.email}`);
            strapi.log.info(`[${requestId}]   - Active: ${user.isActive}`);
            strapi.log.info(`[${requestId}]   - Blocked: ${user.blocked}`);
            strapi.log.info(`[${requestId}]   - Firstname: ${user.firstname || 'N/A'}`);
            strapi.log.info(`[${requestId}]   - Lastname: ${user.lastname || 'N/A'}`);
            strapi.log.info(`[${requestId}]   - Created: ${user.createdAt}`);
            strapi.log.info(`[${requestId}]   - Password hash exists: ${user.password ? 'YES' : 'NO'}`);
            
            // Check if user is blocked or inactive
            if (user.blocked) {
              strapi.log.error(`[${requestId}] ❌ USER IS BLOCKED - Login will fail!`);
            }
            if (!user.isActive) {
              strapi.log.error(`[${requestId}] ❌ USER IS INACTIVE - Login will fail!`);
            }
          } else {
            strapi.log.error(`[${requestId}] ❌ USER NOT FOUND in database for email: ${ctx.request.body.email}`);
            strapi.log.info(`[${requestId}] Attempting to list all admin users...`);
            try {
              const allUsers = await strapi.admin.services.user.findAll();
              strapi.log.info(`[${requestId}] Found ${allUsers.length} admin user(s) in database:`);
              allUsers.forEach((u, idx) => {
                strapi.log.info(`[${requestId}]   ${idx + 1}. ${u.email} (Active: ${u.isActive}, Blocked: ${u.blocked})`);
              });
            } catch (err) {
              strapi.log.error(`[${requestId}] Error listing users: ${err.message}`);
            }
          }
        } catch (err) {
          strapi.log.error(`[${requestId}] ❌ Error looking up user: ${err.message}`);
          strapi.log.error(`[${requestId}] Stack: ${err.stack}`);
        }
      }
      
      // Continue to next middleware/handler
      await next();
      
      // Log response details
      strapi.log.info(`[${requestId}] Response Status: ${ctx.status}`);
      strapi.log.info(`[${requestId}] Response Headers:`);
      Object.keys(ctx.response.headers || {}).forEach(key => {
        if (key.toLowerCase() === 'set-cookie') {
          const cookies = ctx.response.headers[key];
          if (Array.isArray(cookies)) {
            cookies.forEach(cookie => {
              strapi.log.info(`[${requestId}]   ${key}: ${cookie.substring(0, 50)}...`);
            });
          } else {
            strapi.log.info(`[${requestId}]   ${key}: ${cookies.substring(0, 50)}...`);
          }
        } else {
          strapi.log.info(`[${requestId}]   ${key}: ${ctx.response.headers[key]}`);
        }
      });
      
      // Log response body (truncated if token present)
      if (ctx.body) {
        try {
          const bodyStr = typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body);
          if (bodyStr.includes('token')) {
            // Mask token in response
            const masked = bodyStr.replace(/"token":"[^"]+"/g, '"token":"***MASKED***"');
            strapi.log.info(`[${requestId}] Response Body: ${masked.substring(0, 500)}`);
          } else {
            strapi.log.info(`[${requestId}] Response Body: ${bodyStr.substring(0, 500)}`);
          }
        } catch (err) {
          strapi.log.warn(`[${requestId}] Could not log response body: ${err.message}`);
        }
      }
      
      // Log authentication result
      if (ctx.status === 200) {
        strapi.log.info(`[${requestId}] ✅ LOGIN SUCCESS`);
      } else if (ctx.status === 400 || ctx.status === 401) {
        strapi.log.error(`[${requestId}] ❌ LOGIN FAILED - Status: ${ctx.status}`);
        if (ctx.body?.error) {
          strapi.log.error(`[${requestId}] Error: ${JSON.stringify(ctx.body.error)}`);
        }
      }
      
      strapi.log.info('='.repeat(80));
      strapi.log.info(`[${requestId}] End of login attempt log`);
      strapi.log.info('='.repeat(80));
      
    } else {
      // Not login endpoint, continue normally
      await next();
    }
  };
};

