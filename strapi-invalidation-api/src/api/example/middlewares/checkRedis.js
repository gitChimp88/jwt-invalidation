"use strict";
const redis = require("../../../../config/redis");

/**
 * `checkRedis` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Extract token from request headers
    const token = ctx.headers.authorization?.split(" ")[1];

    if (!token) {
      ctx.status = 401;
      ctx.body = { message: "No token provided" };
      return;
    }

    try {
      const tokenExists = await redis.get(token);

      console.log("does the token exist? - ", tokenExists);

      if (!tokenExists) {
        ctx.status = 401;
        ctx.body = { message: "Invalid or expired token" };
        return;
      }

      await next();
    } catch (error) {
      strapi.log.error("Error checking token in Redis:", error);
      ctx.status = 500;
      ctx.body = { message: "Internal server error" };
    }
  };
};
