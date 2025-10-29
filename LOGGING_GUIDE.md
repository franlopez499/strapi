# Enhanced Logging for Admin Login Debugging

## Changes Made

### 1. Created `src/middlewares/admin-login-logger.js`
A **comprehensive logging middleware** that logs:

#### 🌐 Domain & URL Configuration
- Strapi URL configuration from environment
- Request URL, protocol, host, path
- **URL mismatch detection** (compares config URL vs request host)
- Proxy settings (proxy enabled, forceProxySecure)

#### 📋 Comprehensive Header Analysis
- **All request headers** with special focus on:
  - `host`, `origin`, `referer`
  - `authorization` (masked)
  - `cookie` (parsed and listed)
  - `x-forwarded-*` headers (proxy headers)
  - `cf-*` headers (Cloudflare headers)
  - `x-requested-with`, `accept`, etc.

#### 🔄 Proxy Header Analysis
- Original client IP (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`)
- Protocol (`x-forwarded-proto`, `cf-visitor`)
- Forwarded host
- Cloudflare-specific headers (`cf-ray`, `cf-ipcountry`)

#### 🔒 CORS & Security Headers
- Request origin vs configured CORS origins
- **CORS mismatch detection**
- CORS configuration (enabled, credentials, allowed origins)

#### ⚙️ Admin Configuration
- Admin JWT secret presence
- Cookie configuration (secure, sameSite, httpOnly)

#### 🍪 Session & Cookie Analysis
- Cookies present in request
- Session existence and keys
- Cookie parsing and analysis

#### 👤 User Lookup (Before Authentication)
- Database user lookup
- User status (active, blocked)
- Password hash presence
- Lists all admin users if lookup fails

#### 📤 Response Analysis
- Response status and headers
- **Cookie parsing** from Set-Cookie headers:
  - Secure flag
  - HttpOnly flag
  - SameSite setting
  - Path and Domain settings
- CORS headers in response
- Response body (with tokens masked)

#### 🔑 Authentication Result
- Success/failure indication
- Error details breakdown
- **Possible causes** suggestions on failure

### 2. Enhanced Logger Configuration
Updated `config/middlewares.js` to:
- Enable debug level logging ✓ (already set)
- Expose logger in context for other middlewares
- Enable request logging

## How to Use

### Step 1: Deploy the Changes

```bash
git add src/middlewares/admin-login-logger.js config/middlewares.js
git commit -m "feat: add comprehensive admin login logging"
git push
```

Then redeploy in Coolify.

### Step 2: Check Logs During Login Attempt

After deployment, when you attempt to login, check the Strapi logs in Coolify. You'll see detailed output like:

```
================================================================================
[req-1234567890-abc123] 🔐 ADMIN LOGIN ATTEMPT - 2025-10-29T19:30:00.000Z
================================================================================
[req-1234567890-abc123] Request Headers:
[req-1234567890-abc123]   content-type: application/json
[req-1234567890-abc123]   origin: https://strapi.inpublic.es
...
[req-1234567890-abc123] Request Body:
[req-1234567890-abc123]   email: itzdrugz@gmail.com
[req-1234567890-abc123]   password: ***PROVIDED*** (length: 18)
[req-1234567890-abc123] Client IP: 192.168.1.1
[req-1234567890-abc123] ✅ User found in database:
[req-1234567890-abc123]   - ID: 1
[req-1234567890-abc123]   - Email: itzdrugz@gmail.com
[req-1234567890-abc123]   - Active: true
[req-1234567890-abc123]   - Blocked: false
...
[req-1234567890-abc123] Response Status: 400
[req-1234567890-abc123] ❌ LOGIN FAILED - Status: 400
[req-1234567890-abc123] Error: {"status":400,"name":"ApplicationError","message":"Invalid credentials"}
```

### Step 3: Analyze the Logs

Look for these key indicators:

1. **User Not Found**
   - If you see "❌ USER NOT FOUND", the email doesn't exist
   - The log will show all available users

2. **User Blocked/Inactive**
   - If you see "❌ USER IS BLOCKED" or "❌ USER IS INACTIVE", that's the issue
   - Fix in database or via console

3. **Password Issues**
   - Check if password is provided (length shown)
   - Check if password field is empty or missing

4. **Request Body Issues**
   - If you see "⚠️ Request body is empty or not parsed!", the JSON isn't being parsed correctly

5. **Database Connection Issues**
   - Check for database errors in the logs

## What to Look For

### Normal Successful Login:
```
[req-xxx] ✅ User found in database
[req-xxx]   - Active: true
[req-xxx]   - Blocked: false
[req-xxx] Response Status: 200
[req-xxx] ✅ LOGIN SUCCESS
```

### User Not Found:
```
[req-xxx] ❌ USER NOT FOUND in database for email: itzdrugz@gmail.com
[req-xxx] Found X admin user(s) in database:
[req-xxx]   1. other@email.com (Active: true, Blocked: false)
```

### User Blocked:
```
[req-xxx] ✅ User found in database
[req-xxx]   - Blocked: true
[req-xxx] ❌ USER IS BLOCKED - Login will fail!
```

### Password Verification Failure:
```
[req-xxx] ✅ User found in database
[req-xxx]   - Active: true
[req-xxx]   - Blocked: false
[req-xxx] Response Status: 400
[req-xxx] ❌ LOGIN FAILED
[req-xxx] Error: {"message":"Invalid credentials"}
```
(This means password hash doesn't match - need to reset password)

## Additional Debugging

### Enable Even More Verbose Logging

If you need even more details, you can temporarily modify the logger level in `config/middlewares.js`:

```javascript
{
  name: 'strapi::logger',
  config: {
    level: 'silly', // Most verbose level
    exposeInContext: true,
    requests: true,
  },
},
```

### Check Strapi Internal Logs

Strapi might also log authentication attempts internally. Look for:
- `Authentication` related logs
- `JWT` related logs  
- `Password` related logs
- `Session` related logs

### Test with curl and Watch Logs

1. Open Coolify logs viewer in one terminal/tab
2. Run curl command in another:
```bash
curl.exe -v -H "Content-Type: application/json" -d '{"email":"itzdrugz@gmail.com","password":"StrongPassword123!"}' https://strapi.inpublic.es/admin/login
```
3. Watch the logs in real-time to see exactly what happens

## Security Note

The logging middleware:
- ✅ Masks passwords in logs (only shows length)
- ✅ Masks tokens in response bodies
- ✅ Only logs admin login endpoints (not other auth endpoints)
- ⚠️ Logs email addresses (necessary for debugging)

For production, consider disabling or reducing logging after debugging is complete.

