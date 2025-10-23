# Deploy to Coolify - Simple Guide

This guide will help you deploy your Strapi application to a VPS using Coolify.

## Prerequisites

- Coolify installed on your VPS ([Install Coolify](https://coolify.io/docs/installation))
- GitHub repository connected to Coolify
- Domain name (optional, but recommended)

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
3. Select the branch: `claude/investigate-coolify-deployment-011CUPEc8tHwNHfodPdNgo4U` (or your main branch)
4. Build Pack: **Dockerfile** (Coolify will auto-detect the Dockerfile)
5. Port: `1337`

### 3. Configure Environment Variables

Add these environment variables in Coolify:

**Required:**
```bash
NODE_ENV=production
DATABASE_URL=<your-postgres-connection-url-from-step-1>
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generate-random-key-1>,<generate-random-key-2>,<generate-random-key-3>,<generate-random-key-4>
API_TOKEN_SALT=<generate-random-salt>
ADMIN_JWT_SECRET=<generate-random-secret>
TRANSFER_TOKEN_SALT=<generate-random-salt>
JWT_SECRET=<generate-random-secret>
```

**Generate Random Secrets:**
You can generate random secrets using this command on your local machine:
```bash
openssl rand -base64 32
```

Run it 4 times for APP_KEYS (comma-separated) and once each for the other secrets.

**Optional:**
```bash
URL=https://your-domain.com  # Your public URL
WEBHOOKS_POPULATE_RELATIONS=false
```

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

## Common Issues

### Build fails with "npm ci" error
- Make sure your `package-lock.json` is committed to the repository

### Database connection error
- Verify the `DATABASE_URL` is correct
- Check that the PostgreSQL database is running in Coolify

### Port not accessible
- Ensure port `1337` is open in your VPS firewall
- Check Coolify's proxy settings

## Using Docker Compose (Alternative Method)

If you prefer using Docker Compose:

1. Select **Docker Compose** when creating the application
2. Coolify will use the `docker-compose.yml` file from the repository
3. Set the same environment variables as above

## Next Steps

- **Setup Domain**: Configure a domain name in Coolify for HTTPS
- **Enable HTTPS**: Coolify can auto-provision SSL certificates via Let's Encrypt
- **Configure Backups**: Set up database backups in Coolify
- **Monitor Logs**: Use Coolify's log viewer to monitor your application

## Migration from Railway

Your existing data from Railway:

1. **Export Database**: Use `pg_dump` to export your Railway PostgreSQL database
2. **Import to Coolify**: Use `pg_restore` to import into your Coolify PostgreSQL database
3. **Upload Files**: Copy the `public/uploads` folder from Railway to Coolify's volume

```bash
# Example database migration
pg_dump $RAILWAY_DATABASE_URL > strapi_backup.sql
psql $COOLIFY_DATABASE_URL < strapi_backup.sql
```

---

**Need help?** Check the [Coolify Documentation](https://coolify.io/docs) or open an issue in the repository.
