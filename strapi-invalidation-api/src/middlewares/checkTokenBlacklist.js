module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const authHeader = ctx.request.header.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      const isBlacklisted = await strapi.db
        .query("api::token-blacklist.token-blacklist")
        .findOne({
          where: { token: token },
        });

      if (isBlacklisted) {
        ctx.throw(401, "Token is blacklisted");
      } else {
        await next();
      }
    } else {
      await next();
    }
  };
};
