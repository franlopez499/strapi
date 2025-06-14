'use strict';

/**
 * blog-post router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::blog-post.blog-post');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'GET',
    path: '/blog-posts/slug/:slug',
    handler: 'blog-post.findBySlug',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/blog-posts/:id/related',
    handler: 'blog-post.findRelated',
    config: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/blog-posts/:id/like',
    handler: 'blog-post.incrementLikes',
    config: {
      auth: false,
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes); 