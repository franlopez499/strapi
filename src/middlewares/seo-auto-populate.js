'use strict';

/**
 * Middleware para auto-poblar campos SEO
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // Solo procesar respuestas exitosas de la API
    if (ctx.status !== 200 || !ctx.body || !ctx.body.data) {
      return;
    }

    const { data } = ctx.body;
    
    // Función para procesar un elemento individual
    const processSEO = (item) => {
      if (!item || !item.attributes) return item;

      const { attributes } = item;
      
      // Auto-poblar SEO si no existe
      if (!attributes.seo || !attributes.seo.metaTitle) {
        // Obtener título: title, nombre, name (para case-industry y case-service)
        const title = attributes.title || attributes.nombre || attributes.name || 'Sin título';
        
        // Obtener descripción: excerpt, summary, descripcion, description
        const description = attributes.excerpt || attributes.summary || attributes.descripcion || attributes.description || 'Sin descripción';
        
        const autoSEO = {
          metaTitle: title,
          metaDescription: description,
          keywords: '',
          noIndex: false
        };

        // Si hay tags, usarlos como keywords
        if (attributes.tags && attributes.tags.data) {
          autoSEO.keywords = attributes.tags.data.map(tag => tag.attributes.name).join(', ');
        }

        // Si hay imagen, usarla como shareImage
        // Prioridad: coverImage (case-study), image (blog-post), imagenPrincipal (producto), clientLogo (case-study)
        if (attributes.coverImage && attributes.coverImage.data) {
          autoSEO.shareImage = {
            media: attributes.coverImage,
            alt: title
          };
        } else if (attributes.image && attributes.image.data) {
          autoSEO.shareImage = {
            media: attributes.image,
            alt: title
          };
        } else if (attributes.imagenPrincipal && attributes.imagenPrincipal.data) {
          autoSEO.shareImage = {
            media: attributes.imagenPrincipal,
            alt: title
          };
        } else if (attributes.clientLogo && attributes.clientLogo.data) {
          autoSEO.shareImage = {
            media: attributes.clientLogo,
            alt: `${title} - Logo del cliente`
          };
        }

        // Merge con SEO existente si lo hay
        attributes.seo = {
          ...autoSEO,
          ...(attributes.seo || {})
        };
      }

      return item;
    };

    // Procesar datos según si es array o objeto individual
    if (Array.isArray(data)) {
      ctx.body.data = data.map(processSEO);
    } else {
      ctx.body.data = processSEO(data);
    }
  };
}; 