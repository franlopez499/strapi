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
        const autoSEO = {
          metaTitle: attributes.title || attributes.nombre || 'Sin título',
          metaDescription: attributes.excerpt || attributes.descripcion || 'Sin descripción',
          keywords: '',
          noIndex: false
        };

        // Si hay tags, usarlos como keywords
        if (attributes.tags && attributes.tags.data) {
          autoSEO.keywords = attributes.tags.data.map(tag => tag.attributes.name).join(', ');
        }

        // Si hay imagen, usarla como shareImage
        if (attributes.image && attributes.image.data) {
          autoSEO.shareImage = {
            media: attributes.image,
            alt: attributes.title || attributes.nombre || 'Imagen'
          };
        } else if (attributes.imagenPrincipal && attributes.imagenPrincipal.data) {
          autoSEO.shareImage = {
            media: attributes.imagenPrincipal,
            alt: attributes.nombre || 'Imagen del producto'
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