'use strict';

/**
 * case-study router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::case-study.case-study');

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
    path: '/case-studies/slug/:slug',
    handler: 'case-study.findBySlug',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/case-studies/:id/related',
    handler: 'case-study.findRelated',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/case-studies/featured',
    handler: 'case-study.findFeatured',
    config: {
      auth: false,
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);

