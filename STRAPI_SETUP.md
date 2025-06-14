# Strapi CMS - Estructura de Contenido para Blog y Productos

## 📋 Resumen de la Estructura Creada

He creado una estructura completa en Strapi que hace match con tu código de Next.js, incluyendo funcionalidad SEO avanzada.

## 🏗️ Componentes Creados

### 1. Componentes Reutilizables (`src/components/shared/`)

#### SEO Component (`seo.json`)
- **metaTitle**: Título meta (máx. 60 caracteres)
- **metaDescription**: Descripción meta (máx. 160 caracteres)
- **keywords**: Palabras clave separadas por comas
- **shareImage**: Componente de imagen para Open Graph
- **noIndex**: Boolean para robots noindex
- **canonicalUrl**: URL canónica

#### Share Image Component (`share-image.json`)
- **media**: Imagen para redes sociales
- **alt**: Texto alternativo

## 📚 Collection Types Creados

### 1. Blog Post (`src/api/blog-post/`)
- **title**: Título del artículo
- **slug**: URL amigable (auto-generado)
- **excerpt**: Resumen/extracto
- **content**: Contenido enriquecido (Rich Text)
- **image**: Imagen destacada
- **category**: Relación con categoría
- **author**: Relación con autor
- **tags**: Relación many-to-many con etiquetas
- **readTime**: Tiempo de lectura estimado
- **views**: Número de visualizaciones
- **likes**: Número de likes
- **featured**: Boolean para destacar
- **seo**: Componente SEO

### 2. Blog Category (`src/api/blog-category/`)
- **name**: Nombre de la categoría
- **slug**: URL amigable
- **description**: Descripción
- **color**: Clases CSS para colores (ej: "bg-blue-100 text-blue-800")
- **seo**: Componente SEO

### 3. Author (`src/api/author/`)
- **name**: Nombre del autor
- **slug**: URL amigable
- **email**: Email
- **bio**: Biografía
- **title**: Título profesional
- **avatar**: Imagen de perfil
- **socialLinks**: Enlaces sociales (JSON)

### 4. Tag (`src/api/tag/`)
- **name**: Nombre de la etiqueta
- **slug**: URL amigable
- **description**: Descripción
- **color**: Clases CSS para colores

### 5. Producto (`src/api/producto/`)
- **nombre**: Nombre del producto
- **slug**: URL amigable
- **descripcion**: Descripción enriquecida
- **categoria**: Relación con categoría de producto
- **imagenPrincipal**: Imagen principal
- **galeria**: Múltiples imágenes
- **precio**: Precio base
- **precioDescuento**: Precio con descuento
- **stock**: Cantidad en stock
- **sku**: Código de producto
- **peso**: Peso del producto
- **dimensiones**: Dimensiones (JSON)
- **colores**: Colores disponibles (JSON)
- **tallas**: Tallas disponibles (JSON)
- **tecnicasPersonalizacion**: Relación many-to-many
- **destacado**: Boolean
- **nuevo**: Boolean
- **enOferta**: Boolean
- **seo**: Componente SEO

### 6. Categoría Producto (`src/api/categoria-producto/`)
- **nombre**: Nombre de la categoría
- **slug**: URL amigable
- **descripcion**: Descripción
- **imagen**: Imagen de la categoría
- **icono**: Icono CSS/SVG
- **color**: Color de la categoría
- **orden**: Orden de visualización
- **activa**: Boolean para activar/desactivar
- **seo**: Componente SEO

### 7. Técnica Personalización (`src/api/tecnica-personalizacion/`)
- **nombre**: Nombre de la técnica (ej: "Serigrafía")
- **slug**: URL amigable
- **descripcion**: Descripción detallada
- **ventajas**: Lista de ventajas (JSON)
- **desventajas**: Lista de desventajas (JSON)
- **precioBase**: Precio base
- **tiempoProduccion**: Tiempo estimado
- **cantidadMinima**: Cantidad mínima
- **cantidadOptima**: Cantidad óptima
- **imagen**: Imagen principal
- **galeria**: Galería de imágenes
- **activa**: Boolean
- **orden**: Orden de visualización
- **seo**: Componente SEO

## 🔧 Funcionalidades Especiales

### Controlador Blog Post Personalizado
- **findBySlug**: Obtener post por slug e incrementar vistas
- **findRelated**: Obtener posts relacionados por categoría/tags
- **incrementLikes**: Incrementar likes de un post

### Rutas Personalizadas
- `GET /api/blog-posts/slug/:slug` - Obtener por slug
- `GET /api/blog-posts/:id/related` - Posts relacionados
- `POST /api/blog-posts/:id/like` - Incrementar likes

### Middleware SEO Auto-populate
- Auto-completa campos SEO faltantes
- Usa título/nombre como metaTitle
- Usa excerpt/descripción como metaDescription
- Convierte tags en keywords
- Usa imagen principal como shareImage

## 🚀 Cómo Usar

### 1. Iniciar Strapi
```bash
npm run develop
```

### 2. Acceder al Admin Panel
- URL: `http://localhost:1337/admin`
- Crear usuario administrador

### 3. Poblar con Datos de Ejemplo
```bash
railway run npm run console   
# En la consola de Strapi
const seedDataSafe = require('./database/seeders/blog-data-safe.js');
await seedDataSafe.seed(strapi);
"
```

### 4. APIs Disponibles

#### Blog Posts
- `GET /api/blog-posts` - Listar todos
- `GET /api/blog-posts/:id` - Obtener por ID
- `GET /api/blog-posts/slug/:slug` - Obtener por slug
- `GET /api/blog-posts/:id/related` - Posts relacionados
- `POST /api/blog-posts/:id/like` - Incrementar likes

#### Productos
- `GET /api/productos` - Listar todos
- `GET /api/productos/:id` - Obtener por ID
- `GET /api/productos?filters[categoria][slug][$eq]=camisetas` - Filtrar por categoría

#### Categorías
- `GET /api/blog-categories` - Categorías de blog
- `GET /api/categoria-productos` - Categorías de productos

## 🎯 Integración con Next.js

### Ejemplo de Fetch para Blog Post
```javascript
// Reemplazar el mock data en tu código de Next.js
async function getBlogPost(slug) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/blog-posts/slug/${slug}`);
  const data = await response.json();
  return data.data;
}

// En tu página de Next.js
export async function generateMetadata({ params }) {
  const blogPost = await getBlogPost(params.slug);
  
  if (!blogPost) {
    return { title: "Artículo no encontrado" };
  }

  const seo = blogPost.attributes.seo;
  
  return {
    title: seo?.metaTitle || blogPost.attributes.title,
    description: seo?.metaDescription || blogPost.attributes.excerpt,
    keywords: seo?.keywords,
    robots: seo?.noIndex ? 'noindex' : 'index,follow',
    openGraph: {
      title: seo?.metaTitle || blogPost.attributes.title,
      description: seo?.metaDescription || blogPost.attributes.excerpt,
      images: seo?.shareImage?.media?.data ? [seo.shareImage.media.data.attributes.url] : [],
      type: "article",
      publishedTime: blogPost.attributes.publishedAt,
      authors: [blogPost.attributes.author?.data?.attributes?.name],
    },
  };
}
```

### Variables de Entorno
```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=tu_token_aqui
```

## 🔒 Configuración de Permisos

En el Admin Panel de Strapi:
1. Ir a **Settings > Users & Permissions > Roles**
2. Editar el rol **Public**
3. Habilitar permisos de **find** y **findOne** para:
   - Blog-post
   - Blog-category
   - Author
   - Tag
   - Producto
   - Categoria-producto
   - Tecnica-personalizacion

## 📊 Datos de Ejemplo Incluidos

El seeder incluye:
- 3 categorías de blog (Tutoriales, Consejos, Tendencias)
- 1 autor (Carlos Martínez)
- 5 tags (serigrafía, vinilo textil, bordado, sublimación, técnicas)
- 3 blog posts con contenido completo
- Datos SEO completos para todos los elementos

## 🎨 Personalización

### Colores de Categorías
Los colores usan clases de Tailwind CSS:
- `bg-blue-100 text-blue-800` (Azul)
- `bg-green-100 text-green-800` (Verde)
- `bg-purple-100 text-purple-800` (Morado)
- `bg-orange-100 text-orange-800` (Naranja)

### Campos JSON Personalizados
- **dimensiones**: `{"largo": 30, "ancho": 20, "alto": 5}`
- **colores**: `["Rojo", "Azul", "Verde", "Negro"]`
- **tallas**: `["XS", "S", "M", "L", "XL", "XXL"]`
- **ventajas**: `["Ventaja 1", "Ventaja 2", "Ventaja 3"]`

¡Tu estructura de Strapi está lista para funcionar con tu código de Next.js! 🎉 