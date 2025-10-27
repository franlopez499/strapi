# API Schema Documentation

This document provides a complete reference for querying the Strapi CMS API. It includes all available content types, their fields, relationships, and query patterns.

## Base URL

```
Development: http://localhost:1337/api
Production: {YOUR_DOMAIN}/api
```

## Authentication

Most read operations are public (if permissions are configured). For write operations, include an API token:

```
Authorization: Bearer YOUR_API_TOKEN
```

---

## Content Types Overview

### Blog System
- **blog-posts** - Blog articles with rich content
- **blog-categories** - Blog category organization
- **authors** - Article authors
- **tags** - Tag system for articles

### Product System
- **productos** - Product catalog
- **categoria-productos** - Product categories
- **tecnica-personalizaciones** - Customization techniques

---

## 1. Blog Posts

### Endpoint
`/api/blog-posts`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title (1-255 chars) |
| `slug` | uid | Yes | URL-friendly identifier (auto-generated from title) |
| `excerpt` | text | Yes | Short summary (1-500 chars) |
| `content` | richtext | Yes | Main article content (HTML/Markdown) |
| `image` | media | Yes | Featured image |
| `readTime` | integer | No | Estimated reading time in minutes (min: 1, default: 5) |
| `views` | integer | No | View count (min: 0, default: 0) |
| `likes` | integer | No | Like count (min: 0, default: 0) |
| `featured` | boolean | No | Featured flag (default: false) |
| `publishedAt` | datetime | Auto | Publication timestamp (from draft/publish) |
| `createdAt` | datetime | Auto | Creation timestamp |
| `updatedAt` | datetime | Auto | Last update timestamp |

### Relations

| Field | Type | Target |
|-------|------|--------|
| `category` | many-to-one | blog-category |
| `author` | many-to-one | author |
| `tags` | many-to-many | tag |

### Components

| Field | Type | Description |
|-------|------|-------------|
| `seo` | shared.seo | SEO metadata (metaTitle, metaDescription, keywords, shareImage, canonicalUrl, noIndex) |

### Custom Endpoints

```
GET  /api/blog-posts/slug/:slug        # Get post by slug (auto-increments views)
GET  /api/blog-posts/:id/related       # Get related posts by category/tags
POST /api/blog-posts/:id/like          # Increment like count
```

### Example Queries

**Get all published posts with relations:**
```
GET /api/blog-posts?populate=*
```

**Get post by slug with full details:**
```
GET /api/blog-posts/slug/introduction-to-screen-printing?populate[category]=*&populate[author][populate][avatar]=*&populate[tags]=*&populate[image]=*&populate[seo][populate][shareImage][populate][media]=*
```

**Filter by category:**
```
GET /api/blog-posts?filters[category][slug][$eq]=tutoriales&populate=*
```

**Filter by tag:**
```
GET /api/blog-posts?filters[tags][slug][$eq]=serigrafia&populate=*
```

**Get featured posts:**
```
GET /api/blog-posts?filters[featured][$eq]=true&populate=*
```

**Sort by views (most popular):**
```
GET /api/blog-posts?sort=views:desc&populate=*
```

**Pagination:**
```
GET /api/blog-posts?pagination[page]=1&pagination[pageSize]=10&populate=*
```

---

## 2. Blog Categories

### Endpoint
`/api/blog-categories`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Category name (max: 100 chars, unique) |
| `slug` | uid | Yes | URL-friendly identifier |
| `description` | text | No | Category description (max: 500 chars) |
| `color` | string | No | Tailwind CSS classes (default: "bg-blue-100 text-blue-800") |

### Relations

| Field | Type | Target |
|-------|------|--------|
| `blog_posts` | one-to-many | blog-post |

### Components

| Field | Type |
|-------|------|
| `seo` | shared.seo |

### Example Queries

**Get all categories with post count:**
```
GET /api/blog-categories?populate[blog_posts][count]=true
```

**Get category by slug:**
```
GET /api/blog-categories?filters[slug][$eq]=tutoriales
```

---

## 3. Authors

### Endpoint
`/api/authors`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Author name (max: 100 chars) |
| `slug` | uid | Yes | URL-friendly identifier |
| `email` | email | No | Author email |
| `bio` | text | No | Author biography (max: 500 chars) |
| `title` | string | No | Professional title (max: 100 chars, default: "Experto en Personalización") |
| `avatar` | media | No | Profile image |
| `socialLinks` | json | No | Social media links object |

### Relations

| Field | Type | Target |
|-------|------|--------|
| `blog_posts` | one-to-many | blog-post |

### Social Links Format (JSON)

```json
{
  "twitter": "https://twitter.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "github": "https://github.com/username",
  "website": "https://example.com"
}
```

### Example Queries

**Get author with avatar:**
```
GET /api/authors?filters[slug][$eq]=carlos-martinez&populate[avatar]=*
```

**Get all authors with post count:**
```
GET /api/authors?populate[blog_posts][count]=true
```

---

## 4. Tags

### Endpoint
`/api/tags`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Tag name (max: 50 chars, unique) |
| `slug` | uid | Yes | URL-friendly identifier |
| `description` | text | No | Tag description (max: 200 chars) |
| `color` | string | No | Tailwind CSS classes (default: "bg-gray-100 text-gray-800") |

### Relations

| Field | Type | Target |
|-------|------|--------|
| `blog_posts` | many-to-many | blog-post |

### Example Queries

**Get all tags with usage count:**
```
GET /api/tags?populate[blog_posts][count]=true
```

---

## 5. Products (Productos)

### Endpoint
`/api/productos`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nombre` | string | Yes | Product name (1-255 chars) |
| `slug` | uid | Yes | URL-friendly identifier |
| `descripcion` | richtext | Yes | Product description (HTML/Markdown) |
| `imagenPrincipal` | media | Yes | Main product image |
| `galeria` | media[] | No | Image gallery (multiple images) |
| `precio` | decimal | No | Base price (min: 0) |
| `precioDescuento` | decimal | No | Discounted price (min: 0) |
| `stock` | integer | No | Stock quantity (min: 0, default: 0) |
| `sku` | string | No | Product SKU (unique) |
| `peso` | decimal | No | Weight in kg (min: 0) |
| `dimensiones` | json | No | Dimensions object |
| `colores` | json | No | Available colors array |
| `tallas` | json | No | Available sizes array |
| `destacado` | boolean | No | Featured product (default: false) |
| `nuevo` | boolean | No | New product flag (default: false) |
| `enOferta` | boolean | No | On sale flag (default: false) |
| `publishedAt` | datetime | Auto | Publication timestamp |
| `createdAt` | datetime | Auto | Creation timestamp |
| `updatedAt` | datetime | Auto | Last update timestamp |

### Relations

| Field | Type | Target |
|-------|------|--------|
| `categoria` | many-to-one | categoria-producto |
| `tecnicasPersonalizacion` | many-to-many | tecnica-personalizacion |

### Components

| Field | Type |
|-------|------|
| `seo` | shared.seo |

### JSON Field Formats

**Dimensiones:**
```json
{
  "largo": 30,
  "ancho": 20,
  "alto": 5,
  "unidad": "cm"
}
```

**Colores:**
```json
["Rojo", "Azul", "Verde", "Negro", "Blanco"]
```

**Tallas:**
```json
["XS", "S", "M", "L", "XL", "XXL"]
```

### Example Queries

**Get all products with full details:**
```
GET /api/productos?populate=*
```

**Get product by slug:**
```
GET /api/productos?filters[slug][$eq]=camiseta-basica&populate[categoria]=*&populate[imagenPrincipal]=*&populate[galeria]=*&populate[tecnicasPersonalizacion]=*&populate[seo][populate][shareImage][populate][media]=*
```

**Filter by category:**
```
GET /api/productos?filters[categoria][slug][$eq]=camisetas&populate=*
```

**Get featured products:**
```
GET /api/productos?filters[destacado][$eq]=true&populate=*
```

**Get products on sale:**
```
GET /api/productos?filters[enOferta][$eq]=true&populate=*
```

**Filter by price range:**
```
GET /api/productos?filters[precio][$gte]=10&filters[precio][$lte]=50
```

**Get products with specific customization technique:**
```
GET /api/productos?filters[tecnicasPersonalizacion][slug][$eq]=serigrafia&populate=*
```

---

## 6. Product Categories (Categoria Productos)

### Endpoint
`/api/categoria-productos`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nombre` | string | Yes | Category name (max: 100 chars, unique) |
| `slug` | uid | Yes | URL-friendly identifier |
| `descripcion` | text | No | Category description (max: 500 chars) |
| `imagen` | media | No | Category image |
| `icono` | string | No | Icon class or SVG |
| `color` | string | No | Color hex code (default: "#3B82F6") |
| `orden` | integer | No | Display order (default: 0) |
| `activa` | boolean | No | Active status (default: true) |

### Relations

| Field | Type | Target |
|-------|------|--------|
| `productos` | one-to-many | producto |

### Components

| Field | Type |
|-------|------|
| `seo` | shared.seo |

### Example Queries

**Get all active categories sorted by order:**
```
GET /api/categoria-productos?filters[activa][$eq]=true&sort=orden:asc&populate=*
```

**Get category with product count:**
```
GET /api/categoria-productos?filters[slug][$eq]=camisetas&populate[productos][count]=true
```

---

## 7. Customization Techniques (Tecnica Personalizaciones)

### Endpoint
`/api/tecnica-personalizaciones`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nombre` | string | Yes | Technique name (max: 100 chars, unique) |
| `slug` | uid | Yes | URL-friendly identifier |
| `descripcion` | richtext | Yes | Detailed description |
| `ventajas` | json | No | Advantages array |
| `desventajas` | json | No | Disadvantages array |
| `precioBase` | decimal | No | Base pricing (min: 0) |
| `tiempoProduccion` | string | No | Production time estimate |
| `cantidadMinima` | integer | No | Minimum order quantity (min: 1, default: 1) |
| `cantidadOptima` | integer | No | Optimal order quantity (min: 1) |
| `imagen` | media | No | Main image |
| `galeria` | media[] | No | Image gallery |
| `activa` | boolean | No | Active status (default: true) |
| `orden` | integer | No | Display order (default: 0) |

### Relations

| Field | Type | Target |
|-------|------|--------|
| `productos` | many-to-many | producto |

### Components

| Field | Type |
|-------|------|
| `seo` | shared.seo |

### JSON Field Formats

**Ventajas:**
```json
[
  "Alta durabilidad en lavados",
  "Colores vibrantes y nítidos",
  "Ideal para grandes cantidades"
]
```

**Desventajas:**
```json
[
  "Requiere cantidad mínima elevada",
  "Costo inicial alto por pantallas"
]
```

### Example Queries

**Get all active techniques:**
```
GET /api/tecnica-personalizaciones?filters[activa][$eq]=true&sort=orden:asc&populate=*
```

**Get technique with compatible products:**
```
GET /api/tecnica-personalizaciones?filters[slug][$eq]=serigrafia&populate[productos]=*&populate[imagen]=*&populate[galeria]=*
```

---

## Shared Components

### SEO Component (shared.seo)

Used by: blog-post, blog-category, producto, categoria-producto, tecnica-personalizacion

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metaTitle` | string | Yes | SEO title (1-60 chars) |
| `metaDescription` | text | Yes | SEO description (1-160 chars) |
| `keywords` | string | No | Comma-separated keywords |
| `shareImage` | component | No | Social sharing image (shared.share-image) |
| `noIndex` | boolean | No | Prevent search indexing (default: false) |
| `canonicalUrl` | string | No | Canonical URL |

**Note:** The SEO middleware auto-populates missing fields:
- If `metaTitle` is empty, uses `title` or `nombre`
- If `metaDescription` is empty, uses `excerpt` or `descripcion`
- If `keywords` is empty, uses tag names (for blog posts)
- If `shareImage` is empty, uses main image

### Share Image Component (shared.share-image)

Used within SEO component for Open Graph images.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `media` | media | Yes | Image file |
| `alt` | string | Yes | Alternative text (max: 100 chars) |

---

## Common Query Parameters

### Populate (Relations & Components)

**Populate all relations:**
```
?populate=*
```

**Populate specific fields:**
```
?populate[category]=*&populate[author]=*&populate[tags]=*
```

**Deep population:**
```
?populate[author][populate][avatar]=*
?populate[seo][populate][shareImage][populate][media]=*
```

**Count relations:**
```
?populate[blog_posts][count]=true
```

### Filters

**Exact match:**
```
?filters[slug][$eq]=my-post
```

**Contains (case-insensitive):**
```
?filters[title][$containsi]=screen printing
```

**Greater than / Less than:**
```
?filters[precio][$gte]=10&filters[precio][$lte]=50
```

**Boolean:**
```
?filters[featured][$eq]=true
```

**Null / Not null:**
```
?filters[precioDescuento][$null]=false
```

**Multiple conditions (AND):**
```
?filters[destacado][$eq]=true&filters[enOferta][$eq]=true
```

**OR conditions:**
```
?filters[$or][0][destacado][$eq]=true&filters[$or][1][nuevo][$eq]=true
```

### Sorting

**Single field:**
```
?sort=createdAt:desc
```

**Multiple fields:**
```
?sort[0]=featured:desc&sort[1]=createdAt:desc
```

### Pagination

**Page-based:**
```
?pagination[page]=1&pagination[pageSize]=10
```

**Offset-based:**
```
?pagination[start]=0&pagination[limit]=10
```

**Disable pagination (get all):**
```
?pagination[pageSize]=100000
```

### Fields Selection

**Select specific fields:**
```
?fields[0]=title&fields[1]=slug&fields[2]=excerpt
```

**Exclude fields:**
```
?fields[0]=title&fields[1]=slug&populate=author&fields[author][0]=name
```

### Publication State

**Only published (default):**
```
?publicationState=live
```

**Include drafts (requires authentication):**
```
?publicationState=preview
```

---

## Response Format

All responses follow Strapi's standard format:

### Single Entry
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Example Post",
      "slug": "example-post",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "publishedAt": "2025-01-01T00:00:00.000Z",
      "category": {
        "data": {
          "id": 1,
          "attributes": { ... }
        }
      },
      "seo": {
        "id": 1,
        "metaTitle": "Example Post",
        "metaDescription": "...",
        "shareImage": {
          "id": 1,
          "media": {
            "data": {
              "id": 1,
              "attributes": {
                "url": "/uploads/image.jpg",
                "width": 1200,
                "height": 630,
                "formats": { ... }
              }
            }
          }
        }
      }
    }
  },
  "meta": {}
}
```

### Collection (Multiple Entries)
```json
{
  "data": [
    {
      "id": 1,
      "attributes": { ... }
    },
    {
      "id": 2,
      "attributes": { ... }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

### Media Fields
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "image.jpg",
      "alternativeText": "Description",
      "caption": null,
      "width": 1920,
      "height": 1080,
      "formats": {
        "thumbnail": {
          "url": "/uploads/thumbnail_image.jpg",
          "width": 245,
          "height": 138
        },
        "medium": {
          "url": "/uploads/medium_image.jpg",
          "width": 750,
          "height": 422
        },
        "large": {
          "url": "/uploads/large_image.jpg",
          "width": 1000,
          "height": 563
        }
      },
      "url": "/uploads/image.jpg",
      "mime": "image/jpeg",
      "size": 123.45
    }
  }
}
```

---

## Full Query Examples

### Blog Post List Page

```
GET /api/blog-posts?
  populate[category][fields][0]=name&
  populate[category][fields][1]=slug&
  populate[category][fields][2]=color&
  populate[author][fields][0]=name&
  populate[author][fields][1]=slug&
  populate[author][populate][avatar][fields][0]=url&
  populate[tags][fields][0]=name&
  populate[tags][fields][1]=slug&
  populate[image][fields][0]=url&
  populate[image][fields][1]=formats&
  sort[0]=featured:desc&
  sort[1]=publishedAt:desc&
  pagination[page]=1&
  pagination[pageSize]=12
```

### Product Detail Page

```
GET /api/productos?
  filters[slug][$eq]=camiseta-premium&
  populate[categoria][fields][0]=nombre&
  populate[categoria][fields][1]=slug&
  populate[imagenPrincipal][fields][0]=url&
  populate[imagenPrincipal][fields][1]=formats&
  populate[galeria][fields][0]=url&
  populate[galeria][fields][1]=formats&
  populate[tecnicasPersonalizacion]=*&
  populate[seo][populate][shareImage][populate][media]=*
```

### Category Page with Products

```
GET /api/categoria-productos?
  filters[slug][$eq]=camisetas&
  populate[productos][populate][imagenPrincipal][fields][0]=url&
  populate[productos][populate][imagenPrincipal][fields][1]=formats&
  populate[productos][filters][publishedAt][$notNull]=true&
  populate[productos][sort][0]=destacado:desc&
  populate[productos][sort][1]=createdAt:desc&
  populate[productos][pagination][pageSize]=20&
  populate[seo]=*
```

---

## Rate Limiting

Default Strapi rate limiting applies. Check your instance configuration for specific limits.

## CORS

CORS is enabled by default for all origins in development. Configure for production in `config/middlewares.js`.

## Error Responses

**400 Bad Request:**
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Invalid query parameters",
    "details": {}
  }
}
```

**404 Not Found:**
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Not Found"
  }
}
```

**500 Server Error:**
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "An error occurred"
  }
}
```

---

## Additional Notes

- All timestamps are in ISO 8601 format (UTC)
- Media URLs are relative paths - prepend your Strapi base URL
- The `publishedAt` field is `null` for draft content
- Draft/publish is enabled for: blog-posts, productos
- Draft/publish is disabled for: categories, authors, tags, customization techniques
- Use `?publicationState=preview` to include drafts (requires authentication)
