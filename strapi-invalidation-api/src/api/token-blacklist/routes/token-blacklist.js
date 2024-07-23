'use strict';

/**
 * token-blacklist router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::token-blacklist.token-blacklist');
