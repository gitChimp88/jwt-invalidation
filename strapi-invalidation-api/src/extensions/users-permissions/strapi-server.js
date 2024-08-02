const utils = require("@strapi/utils");
const { getService } = require("../users-permissions/utils");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");
  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const issueJWT = (payload, jwtOptions = {}) => {
  _.defaults(jwtOptions, strapi.config.get("plugin.users-permissions.jwt"));
  return jwt.sign(
    _.clone(payload.toJSON ? payload.toJSON() : payload),
    strapi.config.get("plugin.users-permissions.jwtSecret"),
    jwtOptions
  );
};

const verifyRefreshToken = (token) => {
  return new Promise(function (resolve, reject) {
    jwt.verify(
      token,
      process.env.REFRESH_SECRET,
      {},
      function (err, tokenPayload = {}) {
        if (err) {
          return reject(new Error("Invalid token."));
        }
        resolve(tokenPayload);
      }
    );
  });
};

const issueRefreshToken = (payload, jwtOptions = {}) => {
  _.defaults(jwtOptions, strapi.config.get("plugin.users-permissions.jwt"));
  return jwt.sign(
    _.clone(payload.toJSON ? payload.toJSON() : payload),
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

module.exports = (plugin) => {
  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;
    const store = strapi.store({ type: "plugin", name: "users-permissions" });
    const grantSettings = await store.get({ key: "grant" });
    const grantProvider = provider === "local" ? "email" : provider;
    if (!_.get(grantSettings, [grantProvider, "enabled"])) {
      throw new ApplicationError("This provider is disabled");
    }

    // Connect the user with a third-party provider.
    try {
      const user = await getService("providers").connect(provider, ctx.query);

      const refreshToken = issueRefreshToken({ id: user.id });

      ctx.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        signed: true,
        overwrite: true,
      });

      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  };

  plugin.controllers.auth["refreshToken"] = async (ctx) => {
    const store = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });
    const { refreshToken } = ctx.request.body;
    let refreshCookie = ctx.cookies.get("refreshToken");

    if (!refreshCookie || !refreshToken) {
      return ctx.badRequest("No Authorization");
    }

    try {
      const obj = await verifyRefreshToken(refreshCookie);
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { id: obj.id } });
      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }
      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        user.confirmed !== true
      ) {
        throw new ApplicationError("Your account email is not confirmed");
      }
      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }
      const refreshToken = issueRefreshToken({ id: user.id });

      ctx.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        signed: true,
        overwrite: true,
      });

      ctx.send({
        jwt: issueJWT({ id: obj.id }, { expiresIn: "5m" }),
      });
    } catch (err) {
      return ctx.badRequest(err.toString());
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/token/refresh",
    handler: "auth.refreshToken",
    config: {
      policies: [],
      prefix: "",
    },
  });
  return plugin;
};
