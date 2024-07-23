'use strict';

/**
 * example controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::example.example');
