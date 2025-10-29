# Debug Admin Login Issue - Quick Diagnosis

Since the issue persists even WITHOUT Cloudflare proxy, this is definitely a **password/user authentication issue**, not a proxy problem.

## Immediate Actions Required

### Step 1: Check Which Email Account Exists

You tested with `itzdrugz@gmail.com` but earlier we were working with `francisco.lopez.toledo@gmail.com`. 
**Need to verify which email actually exists in the database.**

### Step 2: Reset Password for the Correct Email

**Using Strapi 5 Console (Interactive Mode):**

**Option A: Use Strapi Console (Recommended for Strapi 5)**

In Coolify container console, start the interactive console:

```bash
npm run console
```

Then in the console, run:

```javascript
// List all admin users
const users = await strapi.admin.services.user.findAll();
console.log('Admin users:');
users.forEach(user => {
  console.log(`- ${user.email} (ID: ${user.id}, Active: ${user.isActive}, Blocked: ${user.blocked})`);
});

// Reset password for specific user
const email = 'itzdrugz@gmail.com'; // or 'francisco.lopez.toledo@gmail.com'
const user = await strapi.admin.services.user.findOne({ email });
if (user) {
  await strapi.admin.services.user.updateById(user.id, {
    password: 'StrongPassword123!'
  });
  console.log(`Password reset for ${email}`);
} else {
  console.log(`User ${email} not found!`);
}
```

**Option B: Use CLI Commands (Non-interactive)**

```bash
# Check if user exists first
node node_modules/@strapi/strapi/bin/strapi.js admin:list-users

# Then reset password for the correct email
node node_modules/@strapi/strapi/bin/strapi.js admin:reset-user-password --email itzdrugz@gmail.com --password StrongPassword123!
```

**OR if the other email is correct:**

```bash
node node_modules/@strapi/strapi/bin/strapi.js admin:reset-user-password --email francisco.lopez.toledo@gmail.com --password StrongPassword123!
```

### Step 3: Check Database Directly (If you have access)

Connect to PostgreSQL and verify:

```sql
-- List all admin users
SELECT id, email, blocked, is_active, firstname, lastname, created_at 
FROM admin_users 
ORDER BY created_at DESC;

-- Check specific user
SELECT id, email, blocked, is_active, firstname, lastname 
FROM admin_users 
WHERE email IN ('itzdrugz@gmail.com', 'francisco.lopez.toledo@gmail.com');

-- If user is blocked or inactive, fix it:
UPDATE admin_users 
SET blocked = false, is_active = true 
WHERE email = 'itzdrugz@gmail.com';
```

### Step 4: Check Strapi Logs for Detailed Errors

In Coolify, check the application logs right after attempting login. Look for:
- Which email is being checked
- Password validation errors
- User lookup errors
- Any authentication middleware errors

### Step 5: Test with Correct Credentials

After resetting password, test immediately:

```bash
curl.exe -v -H "Content-Type: application/json" -d '{"email":"itzdrugz@gmail.com","password":"StrongPassword123!"}' https://strapi.inpublic.es/admin/login
```

## Common Issues

### Issue 1: User Doesn't Exist
- **Solution**: Create admin user via Strapi Console:

**Using Strapi 5 Console:**
```bash
npm run console
```

Then in console:
```javascript
await strapi.admin.services.user.create({
  email: 'itzdrugz@gmail.com',
  password: 'StrongPassword123!',
  firstname: 'Admin',
  lastname: 'User',
  isActive: true
});
```

**OR using CLI:**
```bash
node node_modules/@strapi/strapi/bin/strapi.js admin:create-user
```

### Issue 2: User is Blocked
- **Solution**: Unblock in database (see SQL above)

### Issue 3: User is Inactive
- **Solution**: Activate in database (see SQL above)

### Issue 4: Password Hash Mismatch
- **Solution**: Reset password (Step 2)

### Issue 5: Wrong Email Address
- **Solution**: Verify exact email in database (Step 3)

## Next Steps

1. **First**: Open Strapi console (`npm run console`) and list users to see what users exist
2. **Second**: Reset password for the correct email (using console or CLI)
3. **Third**: Test login again with curl
4. **Fourth**: Check Strapi logs if still failing

The fact that it fails even without Cloudflare proxy means it's 100% a password/user issue, not a configuration problem.

## Strapi 5 Console Quick Reference

```bash
# Start interactive console
npm run console

# Then you can use JavaScript to interact with Strapi:
# - strapi.admin.services.user.findAll() - List all admin users
# - strapi.admin.services.user.findOne({ email }) - Find user by email
# - strapi.admin.services.user.updateById(id, { password }) - Update password
# - strapi.admin.services.user.create({...}) - Create new user
```

