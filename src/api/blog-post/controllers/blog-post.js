'use strict';

/**
 * blog-post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
  // Método personalizado para obtener un post por slug
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::blog-post.blog-post', {
        filters: { slug },
        populate: {
          image: true,
          category: true,
          author: {
            populate: ['avatar']
          },
          tags: true,
          seo: {
            populate: ['shareImage']
          }
        }
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Blog post not found');
      }

      const blogPost = entity[0];

      // Incrementar vistas
      await strapi.entityService.update('api::blog-post.blog-post', blogPost.id, {
        data: {
          views: (blogPost.views || 0) + 1
        }
      });

      // Actualizar el objeto con las nuevas vistas
      blogPost.views = (blogPost.views || 0) + 1;

      const sanitizedEntity = await this.sanitizeOutput(blogPost, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Método para obtener posts relacionados
  async findRelated(ctx) {
    const { id } = ctx.params;
    const { limit = 3 } = ctx.query;

    try {
      const currentPost = await strapi.entityService.findOne('api::blog-post.blog-post', id, {
        populate: ['category', 'tags']
      });

      if (!currentPost) {
        return ctx.notFound('Blog post not found');
      }

      // Buscar posts relacionados por categoría o tags
      const relatedPosts = await strapi.entityService.findMany('api::blog-post.blog-post', {
        filters: {
          $and: [
            { id: { $ne: id } },
            {
              $or: [
                { category: currentPost.category?.id },
                { tags: { id: { $in: currentPost.tags?.map(tag => tag.id) || [] } } }
              ]
            }
          ]
        },
        populate: {
          image: true,
          category: true
        },
        sort: { createdAt: 'desc' },
        limit: parseInt(limit)
      });

      const sanitizedEntities = await this.sanitizeOutput(relatedPosts, ctx);
      return this.transformResponse(sanitizedEntities);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Método para incrementar likes
  async incrementLikes(ctx) {
    const { id } = ctx.params;

    try {
      const blogPost = await strapi.entityService.findOne('api::blog-post.blog-post', id);
      
      if (!blogPost) {
        return ctx.notFound('Blog post not found');
      }

      const updatedPost = await strapi.entityService.update('api::blog-post.blog-post', id, {
        data: {
          likes: (blogPost.likes || 0) + 1
        }
      });

      const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, error);
    }
  }
})); 