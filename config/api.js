module.exports = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  // Configuración por defecto para populate
  populate: {
    'api::blog-post.blog-post': {
      image: true,
      category: true,
      author: {
        populate: ['avatar']
      },
      tags: true,
      seo: {
        populate: ['shareImage']
      }
    },
    'api::producto.producto': {
      imagenPrincipal: true,
      galeria: true,
      categoria: true,
      tecnicasPersonalizacion: true,
      seo: {
        populate: ['shareImage']
      }
    },
    'api::blog-category.blog-category': {
      seo: {
        populate: ['shareImage']
      }
    },
    'api::categoria-producto.categoria-producto': {
      imagen: true,
      seo: {
        populate: ['shareImage']
      }
    },
    'api::tecnica-personalizacion.tecnica-personalizacion': {
      imagen: true,
      galeria: true,
      seo: {
        populate: ['shareImage']
      }
    }
  }
};
