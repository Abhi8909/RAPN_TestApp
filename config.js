/**
 * Configuration file
 * holds tokens and keys
 *
 */

const config = {};

const collections = {
  users: "users",
  orders: "orders",
  cart: "cart",
  logs: "logs",
  tokens: "tokens",
};

// configuration for staging mode
config.staging = {
  http_PORT: 3000,
  https_PORT: 3001,
  envName: "Staging",
  hashingSecret: "iAmCreatingAHasingSecret",
  acceptedHttpMethods: ["get", "post", "put", "delete"],
  collections: collections,
  currency: "inr",
};

// configuration for production mode
config.production = {
  http_PORT: 80,
  https_PORT: 443,
  envName: "Production",
  hashingSecret: "iAmCreatingAHasingSecretForProd",
  acceptedHttpMethods: ["get", "post", "put", "delete"],
  collections: collections,
  currency: "inr",
};

// get the enviroment
let env = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";

let configToExport = config[env];
let secretKeys =
  env === "staging" ? require("./keys") : require("./sample_keys");
// export the module
module.exports = { ...configToExport, ...secretKeys };
