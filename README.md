# Strapi CMS - Coolify Deployment Guide

This guide will walk you through deploying a Strapi CMS application to Coolify with PostgreSQL database.

## Prerequisites

- A Coolify instance running and accessible
- Git repository access
- PostgreSQL database access (Coolify managed or external)

## Deployment Steps

### 1. Create PostgreSQL Database in Coolify

1. Go to your Coolify dashboard
2. Click **Databases** → **+ New Database**
3. Select **PostgreSQL**
4. Configure:
   - Name: `strapi-db` (or your preferred name)
   - PostgreSQL Version: `15` or later
   - Username: `strapi`
   - Password: (auto-generated or custom)
   - Database Name: `strapi`
5. Click **Create**
6. **Copy the connection URL** (you'll need this for environment variables)

### 2. Create New Application

1. Go to **Applications** → **+ New Application**
2. Select your Git repository
3. Select the branch: `main` (or your deployment branch)
4. Build Pack: **Nixpacks** (recommended for Node.js applications)
5. Port: `1337`

### 3. Configure Environment Variables

Add these environment variables in Coolify:

**Required Variables:**
```bash
NODE_ENV=production
DATABASE_URL=<your-postgres-connection-url-from-step-1>
DATABASE_PUBLIC_URL=<postgres-public-url>
HOST=::
#PORT=1337
APP_KEYS=<generate-random-key-1>,<generate-random-key-2>,<generate-random-key-3>,<generate-random-key-4>
API_TOKEN_SALT=<generate-random-salt>
ADMIN_JWT_SECRET=<generate-random-secret>
TRANSFER_TOKEN_SALT=<generate-random-salt>
JWT_SECRET=<generate-random-secret>
```

**Additional Recommended Variables:**
```bash
BROWSER=false
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
STRAPI_TELEMETRY_DISABLED=true
URL=https://your-domain.com  # Your public URL
WEBHOOKS_POPULATE_RELATIONS=false
```

**Generate Random Secrets:**

You can generate random secrets using this command on your local machine:
```bash
openssl rand -base64 32
```

Run it 4 times for APP_KEYS (comma-separated) and once each for the other secrets.

> **Note:** Keep these secrets secure and never commit them to version control.

### 4. Configure Persistent Storage (for uploads)

1. In your application settings, go to **Storages**
2. Add a new volume:
   - **Name**: `uploads`
   - **Mount Path**: `/app/public/uploads`
   - **Host Path**: Leave empty (Coolify will manage it)
3. Save

### 5. Deploy

1. Click **Deploy** button
2. Wait for the build to complete (first build may take 3-5 minutes)
3. Check logs if there are any errors

### 6. Access Your Strapi Admin

1. Once deployed, visit: `http://your-server-ip:1337/admin`
2. Create your first admin user
3. Start creating content!

## Database Seeding

To seed the database with initial content:

1. Open the Strapi application terminal in Coolify
2. Run the following commands:

```bash
PORT=1338 npx strapi console
```

3. In the Strapi console, execute:

```javascript
const seedDataSafe = require('./database/seeders/blog-data-safe.js');
await seedDataSafe.seed(strapi);
```

4. Exit the console when done

> **Note:** Database seeding should only be done once after initial deployment.

## Next Steps

- **Setup Domain**: Configure a domain name in Coolify for HTTPS
- **Enable HTTPS**: Coolify can auto-provision SSL certificates via Let's Encrypt
- **Configure Backups**: Set up database backups in Coolify
- **Monitor Logs**: Use Coolify's log viewer to monitor your application
- **Security**: Review and update API permissions in Strapi settings
- **Performance**: Consider enabling caching and CDN for production use

## Troubleshooting

### Common Issues

**Database Connection Errors:**
- Verify the `DATABASE_URL` is correct
- Ensure the database is accessible from your application
- Check if the database credentials are valid

**Build Failures:**
- Check the build logs in Coolify
- Verify all environment variables are set correctly
- Ensure the correct branch is selected

**Upload Issues:**
- Verify persistent storage is configured correctly
- Check file permissions on the uploads directory
- Ensure sufficient disk space is available

**Login Issues with Cloudflare Proxy (Invalid Credentials):**

If you added a custom domain with Cloudflare proxy enabled (orange cloud) and suddenly cannot login:

1. **Update Environment Variables in Coolify:**
   ```bash
   URL=https://your-domain.com
   ADMIN_URL=https://your-domain.com/admin
   ```

2. **Configuration is already set:**
   - `config/server.js` has `proxy: true` enabled (required for Cloudflare)
   - `config/admin.js` has `url: env('ADMIN_URL', '/admin')` configured
   - `config/middlewares.js` has proper security settings for proxy

3. **Restart your application** in Coolify after adding these environment variables

4. **Clear browser cache and cookies** for the domain

5. **Cloudflare Settings Check:**
   - SSL/TLS mode should be set to "Full" or "Full (strict)" in Cloudflare dashboard
   - Ensure "Always Use HTTPS" is enabled
   - Under "Network", verify HTTP/2 is enabled

**Why this happens:**
When you add a domain through Cloudflare proxy, Strapi needs to know the correct public URL for cookie settings and authentication. Without `URL` and `ADMIN_URL` environment variables, Strapi may use the internal container URL, causing authentication cookies to fail.

## Support

For more information, refer to:
- [Strapi Documentation](https://docs.strapi.io)
- [Coolify Documentation](https://coolify.io/docs)