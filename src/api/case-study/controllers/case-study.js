'use strict';

/**
 * case-study controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::case-study.case-study', ({ strapi }) => ({
  // Método personalizado para obtener un caso por slug
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::case-study.case-study', {
        filters: { slug },
        populate: {
          coverImage: true,
          gallery: true,
          clientLogo: true,
          industry: true,
          services: true,
          tags: true,
          metrics: true,
          seo: {
            populate: ['shareImage']
          }
        }
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Case study not found');
      }

      const caseStudy = entity[0];
      const sanitizedEntity = await this.sanitizeOutput(caseStudy, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Método para obtener casos relacionados
  async findRelated(ctx) {
    const { id } = ctx.params;
    const { limit = 3 } = ctx.query;

    try {
      const currentCase = await strapi.entityService.findOne('api::case-study.case-study', id, {
        populate: ['industry', 'services', 'tags']
      });

      if (!currentCase) {
        return ctx.notFound('Case study not found');
      }

      // Buscar casos relacionados por industria, servicios o tags
      const relatedCases = await strapi.entityService.findMany('api::case-study.case-study', {
        filters: {
          $and: [
            { id: { $ne: id } },
            {
              $or: [
                { industry: currentCase.industry?.id },
                { services: { id: { $in: currentCase.services?.map(service => service.id) || [] } } },
                { tags: { id: { $in: currentCase.tags?.map(tag => tag.id) || [] } } }
              ]
            }
          ]
        },
        populate: {
          coverImage: true,
          industry: true,
          services: true
        },
        sort: { createdAt: 'desc' },
        limit: parseInt(limit)
      });

      const sanitizedEntities = await this.sanitizeOutput(relatedCases, ctx);
      return this.transformResponse(sanitizedEntities);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Método para obtener casos destacados
  async findFeatured(ctx) {
    const { limit = 6 } = ctx.query;

    try {
      const featuredCases = await strapi.entityService.findMany('api::case-study.case-study', {
        filters: {
          featured: true,
          publishedAt: { $notNull: true }
        },
        populate: {
          coverImage: true,
          industry: true,
          services: true,
          metrics: true
        },
        sort: { createdAt: 'desc' },
        limit: parseInt(limit)
      });

      const sanitizedEntities = await this.sanitizeOutput(featuredCases, ctx);
      return this.transformResponse(sanitizedEntities);
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));

