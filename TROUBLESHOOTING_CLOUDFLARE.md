# Troubleshooting: Invalid Credentials After Cloudflare Setup

## Root Cause Analysis

The "Invalid credentials" error after adding Cloudflare DNS + proxy is typically caused by one or more of these issues:

### 1. **Cookie/Session Issues (Most Likely)**
- Cloudflare proxy can interfere with cookie setting/reading
- `sameSite: 'none'` requires `secure: true` (you have this ✓)
- Cookies might not be set/read correctly due to header modifications

### 2. **Password Mismatch**
- Password stored in database might be incorrect
- Password hash might have been corrupted during migration
- User account might be blocked or inactive

### 3. **Environment Variable Issues**
- `APP_KEYS` might have changed between deploys (causes session encryption issues)
- `ADMIN_JWT_SECRET` might have changed (invalidates existing tokens)
- `URL` environment variable might not match Cloudflare domain

### 4. **Cloudflare Configuration Issues**
- Cloudflare might be caching/stripping authentication headers
- Cloudflare might be modifying request/response headers
- WAF rules might be blocking authentication requests

### 5. **Rate Limiting**
- Default rate limit is 5 requests (you're seeing `x-ratelimit-remaining: 3`)
- Could be hitting rate limits, but unlikely to cause "Invalid credentials"

## Fixes Applied

### 1. Updated `config/admin.js`
- Added `httpOnly: true` to cookie config for security
- Kept `sameSite: 'none'` for Cloudflare compatibility

### 2. Updated `config/middlewares.js`
- Enhanced CORS headers to include `X-Requested-With`
- Added explicit security middleware configuration
- Added `HEAD` method to CORS methods

## Step-by-Step Resolution

### Step 1: Verify Environment Variables

In Coolify, ensure these are set correctly:

```bash
URL=https://strapi.inpublic.es
APP_KEYS=<comma-separated-keys-must-not-change>
ADMIN_JWT_SECRET=<must-not-change>
API_TOKEN_SALT=<can-change>
TRANSFER_TOKEN_SALT=<can-change>
JWT_SECRET=<can-change>
DATABASE_URL=<postgres-connection-string>
NODE_ENV=production
```

**Critical**: `APP_KEYS` and `ADMIN_JWT_SECRET` must NOT change between deploys. If they changed, all sessions become invalid.

### Step 2: Reset Admin Password

Connect to your Strapi container console in Coolify and run:

```bash
node node_modules/@strapi/strapi/bin/strapi.js admin:reset-user-password --email francisco.lopez.toledo@gmail.com --password YourNewSecurePassword123!
```

**Note**: In PowerShell, use:
```powershell
node node_modules/@strapi/strapi/bin/strapi.js admin:reset-user-password --email francisco.lopez.toledo@gmail.com --password "YourNewSecurePassword123!"
```

### Step 3: Configure Cloudflare Settings

#### A. Disable Caching for Admin Routes

1. Go to Cloudflare Dashboard → Rules → Page Rules
2. Create a new rule:
   - **URL**: `strapi.inpublic.es/admin*`
   - **Settings**:
     - Cache Level: Bypass
     - Browser Cache TTL: Respect Existing Headers
     - Edge Cache TTL: Bypass

#### B. Disable Cloudflare WAF for Admin Routes (Optional)

1. Go to Cloudflare Dashboard → Security → WAF
2. Create a custom rule:
   - **Name**: Bypass WAF for Strapi Admin
   - **When**: `(http.request.uri.path contains "/admin")`
   - **Then**: Skip
   - **Action**: Skip all remaining custom rules

#### C. Configure Cloudflare SSL/TLS

1. Go to SSL/TLS → Overview
2. Set to **Full (strict)** ✓ (you mentioned you have this)

#### D. Disable Email Obfuscation & Rocket Loader

1. Go to Speed → Optimization
2. Disable:
   - Email Address Obfuscation
   - Rocket Loader

### Step 4: Test Login

#### Test 1: Direct curl (Bypass Browser Issues)

**Linux/macOS:**
```bash
curl -v -H 'Content-Type: application/json' \
  -d '{"email":"francisco.lopez.toledo@gmail.com","password":"YourNewSecurePassword123!"}' \
  https://strapi.inpublic.es/admin/login
```

**Windows PowerShell:**
```powershell
curl.exe -v -H "Content-Type: application/json" -d "{\"email\":\"francisco.lopez.toledo@gmail.com\",\"password\":\"YourNewSecurePassword123!\"}" https://strapi.inpublic.es/admin/login
```

**Expected Success Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "francisco.lopez.toledo@gmail.com",
      ...
    }
  }
}
```

#### Test 2: Check Cookies are Set

After successful curl login, check if `Set-Cookie` headers are present:

```bash
curl -v -H 'Content-Type: application/json' \
  -d '{"email":"francisco.lopez.toledo@gmail.com","password":"YourNewSecurePassword123!"}' \
  -c cookies.txt \
  https://strapi.inpublic.es/admin/login
```

Then check `cookies.txt` for authentication cookies.

#### Test 3: Browser Login

1. Open browser in **Incognito/Private mode**
2. Navigate to `https://strapi.inpublic.es/admin`
3. Open Developer Tools → Network tab
4. Attempt login
5. Check:
   - Request headers (especially `Origin`, `Content-Type`)
   - Response headers (especially `Set-Cookie`, `Access-Control-Allow-Origin`)
   - Response body for error details

### Step 5: Verify Database User Status

If login still fails, check user status in database:

Connect to your PostgreSQL database and run:

```sql
SELECT id, email, blocked, is_active, firstname, lastname 
FROM admin_users 
WHERE email = 'francisco.lopez.toledo@gmail.com';
```

**Critical checks:**
- `blocked` should be `false`
- `is_active` should be `true`
- User must exist (no NULL results)

If user is blocked or inactive:
```sql
UPDATE admin_users 
SET blocked = false, is_active = true 
WHERE email = 'francisco.lopez.toledo@gmail.com';
```

### Step 6: Check Strapi Logs

In Coolify, check application logs for detailed error messages:

Look for:
- Authentication errors
- Session errors
- Cookie errors
- Database connection errors

### Step 7: Test Without Cloudflare Proxy (Isolation Test)

To isolate if Cloudflare is the issue:

1. In Cloudflare DNS, temporarily disable proxy (gray cloud)
2. Wait 5 minutes for DNS propagation
3. Test login again via direct IP or non-proxied DNS
4. If login works without proxy, the issue is Cloudflare configuration

### Step 8: Verify APP_KEYS Consistency

If sessions are being rejected, check if `APP_KEYS` are consistent:

**In Coolify environment variables:**
- `APP_KEYS` should be comma-separated (e.g., `key1,key2,key3,key4`)
- All 4 keys should be present
- Keys should NOT have changed since last successful login

## Common Error Messages & Solutions

### "Invalid credentials"
- **Cause**: Wrong password or user doesn't exist
- **Fix**: Reset password (Step 2) or check database (Step 5)

### "Expected property name or '}' in JSON"
- **Cause**: JSON syntax error in request
- **Fix**: Use correct curl syntax (see Step 4)

### "Unauthorized" or 401
- **Cause**: Session cookie issues or JWT secret mismatch
- **Fix**: Check `ADMIN_JWT_SECRET` hasn't changed, clear browser cookies

### Rate limit errors
- **Cause**: Too many login attempts
- **Fix**: Wait for rate limit reset (check `x-ratelimit-reset` header) or increase limit

## Prevention for Future Deploys

1. **Never change `APP_KEYS` or `ADMIN_JWT_SECRET`** after initial setup
2. **Always test login after domain/proxy changes**
3. **Keep Cloudflare caching disabled for `/admin*` routes**
4. **Monitor Strapi logs after configuration changes**
5. **Use password reset command instead of manual password changes**

## Additional Resources

- [Strapi Deployment Documentation](https://docs.strapi.io/dev-docs/deployment)
- [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)
- [Strapi Admin Authentication](https://docs.strapi.io/dev-docs/plugins/users-permissions)

