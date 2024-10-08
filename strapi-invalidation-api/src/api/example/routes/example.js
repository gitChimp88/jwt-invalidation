"use strict";

/**
 * example router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::example.example", {
  config: {
    find: {
      middlewares: ["api::example.check-redis"],
    },
  },
});
