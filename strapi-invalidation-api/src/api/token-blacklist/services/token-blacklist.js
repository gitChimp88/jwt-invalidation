'use strict';

/**
 * token-blacklist service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::token-blacklist.token-blacklist');
