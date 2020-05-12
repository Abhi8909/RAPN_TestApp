/**
 * Configuration file
 * holds tokens and keys
 *
 */

let config = {};

// configuration for staging mode
config.staging = {
  http_PORT: 3000,
  https_PORT: 3001,
  envName: "Staging",
  hashingSecret: "iAmCreatingAHasingSecret",
  acceptedHttpMethods: ["get", "post", "put", "delete"],
  collections: {
    users: "users",
    orders: "orders",
    cart: "cart",
    logs: "logs",
    tokens: "tokens",
  },
};

// configuration for production mode
config.production = {
  http_PORT: 80,
  https_PORT: 443,
  envName: "Production",
  hashingSecret: "iAmCreatingAHasingSecretForProd",
  acceptedHttpMethods: ["get", "post", "put", "delete"],
  collections: {
    users: "users",
    orders: "orders",
    cart: "cart",
    logs: "logs",
    tokens: "tokens",
  },
};

// get the enviroment
let env = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";

// export the module
module.exports = config[env];
