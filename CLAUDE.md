# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Strapi v5.11.0 CMS application for managing blog content and product catalog with textile customization. The application uses PostgreSQL as the database and is configured for deployment on Coolify. It includes custom SEO middleware, database seeders, and specialized content types for blogs and e-commerce products.

## Development Commands

### Essential Commands
```bash
npm run develop     # Start Strapi in development mode with auto-reload (port 1337)
npm run start       # Start Strapi in production mode
npm run build       # Build admin panel for production
npm run strapi      # Access Strapi CLI
npm run seed        # Seed database with initial blog/product data
npm run console     # Open Strapi console for direct database interactions
```

### Upgrading Strapi
```bash
npm run upgrade:dry # Check for available Strapi updates (dry run)
npm run upgrade     # Upgrade to latest Strapi version
```

## Architecture Overview

### Configuration Structure
- **config/**: All application configuration files
  - `database.js` - PostgreSQL connection using `DATABASE_URL` env var
  - `server.js` - Server configuration (host, port, app keys, webhooks, proxy)
  - `middlewares.js` - Middleware stack including custom SEO auto-populate middleware
  - `plugins.js` - Plugin configuration (users-permissions, local file upload)
  - `admin.js` - Admin panel configuration
  - `api.js` - API configuration
  - `env/development/` - Development-specific overrides

### Content Type Architecture

The application follows Strapi's standard API structure under `src/api/`:

**Blog Content Types:**
- `blog-post/` - Main blog articles with SEO, rich content, categories, authors, tags, and engagement metrics (views, likes)
- `blog-category/` - Blog categories with color coding
- `author/` - Author profiles with bio and social links
- `tag/` - Tags for blog posts (many-to-many relationship)

**Product Content Types:**
- `producto/` - Products with pricing, inventory, images, dimensions, colors, sizes, and customization techniques
- `categoria-producto/` - Product categories with icons and ordering
- `tecnica-personalizacion/` - Textile customization techniques (screen printing, vinyl, embroidery, etc.) with pricing and production details

**Shared Components** (`src/components/shared/`):
- `seo.json` - SEO metadata component (metaTitle, metaDescription, keywords, shareImage, canonicalUrl, noIndex)
- `share-image.json` - Open Graph image component

### Custom Functionality

**Custom Blog Post Controller** (`src/api/blog-post/controllers/blog-post.js`):
- `findBySlug()` - Retrieves post by slug and auto-increments view count
- `findRelated()` - Returns related posts based on category and tags
- `incrementLikes()` - Increments like count for a post

**Custom Routes** (`src/api/blog-post/routes/blog-post.js`):
- `GET /api/blog-posts/slug/:slug` - Fetch post by slug
- `GET /api/blog-posts/:id/related` - Get related posts
- `POST /api/blog-posts/:id/like` - Increment likes

**SEO Auto-Populate Middleware** (`src/middlewares/seo-auto-populate.js`):
- Automatically populates missing SEO fields in API responses
- Uses `title`/`nombre` as metaTitle fallback
- Uses `excerpt`/`descripcion` as metaDescription fallback
- Converts tags to comma-separated keywords
- Uses primary image as shareImage fallback
- Registered globally in `config/middlewares.js` as `global::seo-auto-populate`

### Database Seeding

**Seeder Script** (`scripts/seed.js`):
- Loads Strapi instance and runs safe seeder
- Run via `npm run seed`

**Safe Seeder** (`database/seeders/blog-data-safe.js`):
- Creates sample blog categories, authors, tags, and blog posts
- Includes complete SEO metadata for all content
- Safe to run multiple times (checks for existing data)

**Legacy Seeder** (`database/seeders/blog-data.js`):
- Older version, prefer `blog-data-safe.js`

## Environment Variables

Required for production deployment (see README.md for full details):

```bash
NODE_ENV=production
DATABASE_URL=<postgres-connection-string>
HOST=::
PORT=1337
APP_KEYS=<comma-separated-random-keys>
API_TOKEN_SALT=<random-salt>
ADMIN_JWT_SECRET=<random-secret>
TRANSFER_TOKEN_SALT=<random-salt>
JWT_SECRET=<random-secret>
URL=<public-url>
```

Generate secrets using: `openssl rand -base64 32`

## API Structure and Relations

### Blog Posts Relations
- `category` (many-to-one) → blog-category
- `author` (many-to-one) → author
- `tags` (many-to-many) → tag

### Product Relations
- `categoria` (many-to-one) → categoria-producto
- `tecnicasPersonalizacion` (many-to-many) → tecnica-personalizacion

### Key Fields
- All main content types use `slug` fields (auto-generated from title/nombre)
- Products use JSON fields for `colores`, `tallas`, and `dimensiones`
- Customization techniques use JSON arrays for `ventajas` and `desventajas`
- All content types support draft/publish workflow
- All content types include the `seo` component

## Working with Content Types

When creating or modifying content types:
- Schema definitions are in `src/api/{api-name}/content-types/{type-name}/schema.json`
- Controllers are in `src/api/{api-name}/controllers/{type-name}.js`
- Services are in `src/api/{api-name}/services/{type-name}.js`
- Routes are in `src/api/{api-name}/routes/{type-name}.js`

After schema changes, Strapi will auto-generate migrations on next start.

## Admin Panel Access

Access the admin panel at `http://localhost:1337/admin` after running `npm run develop`. First-time setup requires creating an admin user.

## Permissions Configuration

For public API access, configure in Admin Panel:
1. Settings > Users & Permissions > Roles > Public
2. Enable `find` and `findOne` for all content types that need public access
3. Custom routes (like `findBySlug`, `findRelated`) require explicit permission grants

## Deployment on Coolify

The application is configured for Coolify deployment with:
- PostgreSQL database (configured via `DATABASE_URL`)
- Persistent storage for uploads at `/app/public/uploads`
- Port 1337 (default Strapi port)
- Nixpacks build system
- Proxy support enabled (`proxy: true` in server config)

See README.md for complete Coolify deployment guide.

## File Upload

Uses local file upload provider (`@strapi/provider-upload-local`). Uploads are stored in `public/uploads/`. In production on Coolify, this directory should be mounted as a persistent volume.

## Important Notes

- The application uses PostgreSQL exclusively (no SQLite support)
- Connection pooling is configured with min: 0, max: 7
- Debug mode is enabled for database queries
- Webhooks are configured to not populate relations by default (`WEBHOOKS_POPULATE_RELATIONS=false`)
- The middleware stack includes a custom global SEO middleware that processes all API responses
