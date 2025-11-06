'use strict';

/**
 * case-service router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::case-service.case-service');
