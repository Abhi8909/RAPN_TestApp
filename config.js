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
};

// configuration for production mode
config.production = {
  http_PORT: 80,
  https_PORT: 443,
  envName: "Production",
};

// get the enviroment
let env = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";

// export the module
module.exports = config[env];
