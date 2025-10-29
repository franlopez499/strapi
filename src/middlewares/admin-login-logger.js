'use strict';

/**
 * Comprehensive logging middleware for admin login debugging
 * Logs all request details, authentication attempts, domain checks, and Strapi internals
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
      
      // ========== DOMAIN & URL CONFIGURATION ==========
      strapi.log.info(`[${requestId}] 🌐 DOMAIN & URL CONFIGURATION:`);
      const serverConfig = strapi.config.get('server');
      strapi.log.info(`[${requestId}]   Strapi URL Config: ${serverConfig.url || 'NOT SET'}`);
      strapi.log.info(`[${requestId}]   Strapi Host: ${serverConfig.host}`);
      strapi.log.info(`[${requestId}]   Strapi Port: ${serverConfig.port}`);
      strapi.log.info(`[${requestId}]   Proxy Enabled: ${serverConfig.proxy}`);
      strapi.log.info(`[${requestId}]   Force Proxy Secure: ${serverConfig.forceProxySecure}`);
      
      // Check actual request URL
      const requestURL = `${ctx.protocol}://${ctx.host}${ctx.url}`;
      strapi.log.info(`[${requestId}]   Request URL: ${requestURL}`);
      strapi.log.info(`[${requestId}]   Request Protocol: ${ctx.protocol}`);
      strapi.log.info(`[${requestId}]   Request Host: ${ctx.host}`);
      strapi.log.info(`[${requestId}]   Request Path: ${ctx.path}`);
      
      // Check for protocol mismatch (HTTP vs HTTPS)
      let forwardedProtoCheck = ctx.headers['x-forwarded-proto'];
      if (!forwardedProtoCheck && ctx.headers['cf-visitor']) {
        try {
          const cfVisitor = JSON.parse(ctx.headers['cf-visitor']);
          forwardedProtoCheck = cfVisitor.scheme;
        } catch (err) {
          // Ignore parsing errors
        }
      }
      if (forwardedProtoCheck && forwardedProtoCheck === 'https' && ctx.protocol === 'http') {
        strapi.log.error(`[${requestId}] ⚠️  PROTOCOL MISMATCH!`);
        strapi.log.error(`[${requestId}]   Request Protocol: ${ctx.protocol} (should be ${forwardedProtoCheck})`);
        strapi.log.error(`[${requestId}]   This can cause cookie/session issues!`);
        strapi.log.error(`[${requestId}]   Fix: Ensure proxy: true and trust proxy settings are correct`);
      }
      
      // Check for URL mismatch
      if (serverConfig.url && ctx.host && !ctx.host.includes(new URL(serverConfig.url).hostname)) {
        strapi.log.warn(`[${requestId}] ⚠️  URL MISMATCH: Config URL host doesn't match request host!`);
        strapi.log.warn(`[${requestId}]   Config URL: ${serverConfig.url}`);
        strapi.log.warn(`[${requestId}]   Request Host: ${ctx.host}`);
      }
      
      // ========== COMPREHENSIVE HEADER ANALYSIS ==========
      strapi.log.info(`[${requestId}] 📋 REQUEST HEADERS (Complete):`);
      
      // Critical headers
      const criticalHeaders = [
        'host', 'origin', 'referer', 'user-agent', 'content-type',
        'authorization', 'cookie', 'x-forwarded-for', 'x-real-ip',
        'x-forwarded-proto', 'x-forwarded-host', 'x-forwarded-port',
        'cf-ray', 'cf-connecting-ip', 'cf-visitor', 'cf-ipcountry',
        'x-requested-with', 'accept', 'accept-language'
      ];
      
      criticalHeaders.forEach(headerKey => {
        const value = ctx.headers[headerKey] || ctx.headers[headerKey.toLowerCase()];
        if (value) {
          if (headerKey === 'authorization' && value && value.length > 20) {
            strapi.log.info(`[${requestId}]   ${headerKey}: Bearer ${value.substring(0, 20)}...`);
          } else if (headerKey === 'cookie' && value) {
            const cookies = value.split(';').map(c => c.trim());
            strapi.log.info(`[${requestId}]   ${headerKey}: ${cookies.length} cookie(s) present`);
            cookies.forEach(cookie => {
              const [name] = cookie.split('=');
              strapi.log.info(`[${requestId}]     - ${name || 'unnamed'}`);
            });
          } else {
            strapi.log.info(`[${requestId}]   ${headerKey}: ${value}`);
          }
        } else {
          strapi.log.debug(`[${requestId}]   ${headerKey}: (not present)`);
        }
      });
      
      // Log all other headers
      strapi.log.info(`[${requestId}]   All Headers:`);
      Object.keys(ctx.headers).forEach(key => {
        const value = ctx.headers[key];
        if (!criticalHeaders.includes(key.toLowerCase())) {
          if (key.toLowerCase() === 'authorization' && value && value.length > 20) {
            strapi.log.info(`[${requestId}]     ${key}: Bearer ${value.substring(0, 20)}...`);
          } else {
            strapi.log.info(`[${requestId}]     ${key}: ${value}`);
          }
        }
      });
      
      // ========== PROXY HEADER ANALYSIS ==========
      strapi.log.info(`[${requestId}] 🔄 PROXY HEADER ANALYSIS:`);
      const forwardedFor = ctx.headers['x-forwarded-for'] || ctx.headers['x-real-ip'] || ctx.headers['cf-connecting-ip'];
      let forwardedProto = ctx.headers['x-forwarded-proto'];
      if (!forwardedProto && ctx.headers['cf-visitor']) {
        try {
          const cfVisitor = JSON.parse(ctx.headers['cf-visitor']);
          forwardedProto = cfVisitor.scheme;
        } catch (err) {
          // Ignore parsing errors
        }
      }
      const forwardedHost = ctx.headers['x-forwarded-host'];
      
      strapi.log.info(`[${requestId}]   Original IP: ${forwardedFor || ctx.request.ip || 'unknown'}`);
      strapi.log.info(`[${requestId}]   Protocol: ${forwardedProto || ctx.protocol}`);
      strapi.log.info(`[${requestId}]   Forwarded Host: ${forwardedHost || 'none'}`);
      
      if (ctx.headers['cf-ray']) {
        strapi.log.info(`[${requestId}]   Cloudflare Ray: ${ctx.headers['cf-ray']}`);
        strapi.log.info(`[${requestId}]   Cloudflare Country: ${ctx.headers['cf-ipcountry'] || 'unknown'}`);
      }
      
      // ========== CORS & SECURITY HEADERS ==========
      strapi.log.info(`[${requestId}] 🔒 CORS & SECURITY:`);
      const origin = ctx.headers.origin;
      
      // Try to get CORS config safely
      let corsConfig = null;
      try {
        // Try different ways to access middleware config
        corsConfig = strapi.config.get('middleware.cors') || 
                     strapi.config.get('middlewares')?.find(m => m.name === 'strapi::cors')?.config ||
                     null;
      } catch (err) {
        strapi.log.warn(`[${requestId}]   Could not access CORS config: ${err.message}`);
      }
      
      strapi.log.info(`[${requestId}]   Request Origin: ${origin || 'none'}`);
      
      if (corsConfig) {
        strapi.log.info(`[${requestId}]   CORS Enabled: ${corsConfig.enabled || 'unknown'}`);
        strapi.log.info(`[${requestId}]   CORS Origins: ${JSON.stringify(corsConfig.origin || [])}`);
        strapi.log.info(`[${requestId}]   CORS Credentials: ${corsConfig.credentials || 'unknown'}`);
        
        if (origin && corsConfig.origin && Array.isArray(corsConfig.origin) && !corsConfig.origin.includes(origin)) {
          strapi.log.warn(`[${requestId}] ⚠️  CORS ORIGIN MISMATCH!`);
          strapi.log.warn(`[${requestId}]   Request Origin: ${origin}`);
          strapi.log.warn(`[${requestId}]   Allowed Origins: ${JSON.stringify(corsConfig.origin)}`);
        }
      } else {
        strapi.log.warn(`[${requestId}]   CORS Config: Could not retrieve (may be using defaults)`);
        // Check response headers for CORS info instead
        if (ctx.response.get?.('access-control-allow-origin')) {
          strapi.log.info(`[${requestId}]   CORS Allow Origin (from response): ${ctx.response.get('access-control-allow-origin')}`);
        }
      }
      
      // ========== ADMIN CONFIGURATION ==========
      strapi.log.info(`[${requestId}] ⚙️  ADMIN CONFIGURATION:`);
      const adminConfig = strapi.config.get('admin');
      if (adminConfig) {
        strapi.log.info(`[${requestId}]   Admin JWT Secret Set: ${adminConfig.auth?.secret ? 'YES' : 'NO'}`);
        strapi.log.info(`[${requestId}]   Cookie Secure: ${adminConfig.cookie?.secure || 'unknown'}`);
        strapi.log.info(`[${requestId}]   Cookie SameSite: ${adminConfig.cookie?.sameSite || 'unknown'}`);
        strapi.log.info(`[${requestId}]   Cookie HttpOnly: ${adminConfig.cookie?.httpOnly || 'unknown'}`);
      } else {
        strapi.log.warn(`[${requestId}]   Admin Config: Could not retrieve`);
      }
      
      // ========== SESSION & COOKIE ANALYSIS ==========
      strapi.log.info(`[${requestId}] 🍪 SESSION & COOKIE ANALYSIS:`);
      const cookies = ctx.cookies || {};
      const cookieKeys = Object.keys(cookies);
      strapi.log.info(`[${requestId}]   Cookies in Request: ${cookieKeys.length}`);
      cookieKeys.forEach(key => {
        const value = cookies[key];
        strapi.log.info(`[${requestId}]     ${key}: ${value ? value.substring(0, 30) + '...' : 'empty'}`);
      });
      
      if (ctx.session) {
        strapi.log.info(`[${requestId}]   Session exists: YES`);
        strapi.log.info(`[${requestId}]   Session keys: ${Object.keys(ctx.session).join(', ')}`);
      } else {
        strapi.log.info(`[${requestId}]   Session exists: NO`);
      }
      
      // ========== REQUEST BODY ==========
      if (ctx.request.body) {
        strapi.log.info(`[${requestId}] 📦 REQUEST BODY:`);
        strapi.log.info(`[${requestId}]   email: ${ctx.request.body.email || 'MISSING'}`);
        strapi.log.info(`[${requestId}]   password: ${ctx.request.body.password ? '***PROVIDED*** (length: ' + ctx.request.body.password.length + ')' : 'MISSING'}`);
        
        if (!ctx.request.body.email || !ctx.request.body.password) {
          strapi.log.error(`[${requestId}] ❌ INCOMPLETE REQUEST BODY!`);
        }
      } else {
        strapi.log.warn(`[${requestId}] ⚠️  Request body is empty or not parsed!`);
        strapi.log.warn(`[${requestId}]   Content-Type: ${ctx.headers['content-type']}`);
        strapi.log.warn(`[${requestId}]   Content-Length: ${ctx.headers['content-length']}`);
      }
      
      // ========== USER LOOKUP (Before Authentication) ==========
      if (ctx.request.body?.email) {
        strapi.log.info(`[${requestId}] 👤 USER LOOKUP:`);
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
            strapi.log.info(`[${requestId}]   - Password hash exists: ${user.password ? 'YES (length: ' + user.password.length + ')' : 'NO'}`);
            
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
      
      // ========== AUTHENTICATION ATTEMPT ==========
      strapi.log.info(`[${requestId}] 🔑 Processing authentication...`);
      
      // Continue to next middleware/handler (this will trigger authentication)
      await next();
      
      // ========== RESPONSE ANALYSIS ==========
      strapi.log.info(`[${requestId}] 📤 RESPONSE ANALYSIS:`);
      strapi.log.info(`[${requestId}]   Status: ${ctx.status}`);
      strapi.log.info(`[${requestId}]   Status Text: ${ctx.message || 'none'}`);
      
      // Response headers
      strapi.log.info(`[${requestId}]   Response Headers:`);
      Object.keys(ctx.response.headers || {}).forEach(key => {
        if (key.toLowerCase() === 'set-cookie') {
          const cookies = ctx.response.headers[key];
          if (Array.isArray(cookies)) {
            cookies.forEach((cookie, idx) => {
              strapi.log.info(`[${requestId}]     ${key}[${idx}]: ${cookie.substring(0, 100)}...`);
              // Parse cookie details
              const cookieParts = cookie.split(';').map(p => p.trim());
              cookieParts.forEach(part => {
                if (part.toLowerCase().includes('secure')) strapi.log.info(`[${requestId}]       - Secure: true`);
                if (part.toLowerCase().includes('httponly')) strapi.log.info(`[${requestId}]       - HttpOnly: true`);
                if (part.toLowerCase().includes('samesite')) strapi.log.info(`[${requestId}]       - ${part}`);
                if (part.toLowerCase().includes('path=')) strapi.log.info(`[${requestId}]       - ${part}`);
                if (part.toLowerCase().includes('domain=')) strapi.log.info(`[${requestId}]       - ${part}`);
              });
            });
          } else {
            strapi.log.info(`[${requestId}]     ${key}: ${cookies.substring(0, 100)}...`);
          }
        } else {
          strapi.log.info(`[${requestId}]     ${key}: ${ctx.response.headers[key]}`);
        }
      });
      
      // Check CORS headers in response
      if (ctx.response.headers['access-control-allow-origin']) {
        strapi.log.info(`[${requestId}]   CORS Allow Origin: ${ctx.response.headers['access-control-allow-origin']}`);
      } else {
        strapi.log.warn(`[${requestId}] ⚠️  No Access-Control-Allow-Origin header in response!`);
      }
      
      // Response body
      if (ctx.body) {
        try {
          const bodyStr = typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body);
          if (bodyStr.includes('token')) {
            // Mask token in response
            const masked = bodyStr.replace(/"token":"[^"]+"/g, '"token":"***MASKED***"');
            strapi.log.info(`[${requestId}]   Response Body: ${masked.substring(0, 500)}`);
          } else {
            strapi.log.info(`[${requestId}]   Response Body: ${bodyStr.substring(0, 500)}`);
          }
        } catch (err) {
          strapi.log.warn(`[${requestId}] Could not log response body: ${err.message}`);
        }
      }
      
      // ========== AUTHENTICATION RESULT ==========
      if (ctx.status === 200) {
        strapi.log.info(`[${requestId}] ✅ LOGIN SUCCESS`);
      } else if (ctx.status === 400 || ctx.status === 401) {
        strapi.log.error(`[${requestId}] ❌ LOGIN FAILED - Status: ${ctx.status}`);
        if (ctx.body?.error) {
          strapi.log.error(`[${requestId}]   Error Name: ${ctx.body.error.name}`);
          strapi.log.error(`[${requestId}]   Error Message: ${ctx.body.error.message}`);
          strapi.log.error(`[${requestId}]   Error Details: ${JSON.stringify(ctx.body.error.details)}`);
        }
        
        // If user was found but login failed, it's likely password mismatch
        if (ctx.request.body?.email) {
          strapi.log.warn(`[${requestId}] 💡 POSSIBLE CAUSES:`);
          strapi.log.warn(`[${requestId}]   1. Password mismatch (password hash doesn't match)`);
          strapi.log.warn(`[${requestId}]   2. User is blocked or inactive (check above)`);
          strapi.log.warn(`[${requestId}]   3. APP_KEYS or ADMIN_JWT_SECRET changed`);
          strapi.log.warn(`[${requestId}]   4. Cookie/session configuration issue`);
        }
      }
      
      strapi.log.info('='.repeat(80));
      strapi.log.info(`[${requestId}] 📝 End of login attempt log`);
      strapi.log.info('='.repeat(80));
      
    } else {
      // Not login endpoint, continue normally
      await next();
    }
  };
};

