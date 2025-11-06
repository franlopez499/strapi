'use strict';

/**
 * case-service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::case-service.case-service');
