/**
 * Configuration file
 * holds tokens and keys
 *
 */

let config = {};

// configuration for staging mode
config.staging = {
  PORT: 3000,
  envName: "Staging",
};

// configuration for production mode
config.production = {
  PORT: 4000,
  envName: "Production",
};

// get the enviroment
let env = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";

// export the module
module.exports = config[env];
