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
  currency:'inr',
  stripe: {
    secretKey: "sk_test_ZWYyjD8XfOq0uW4tjwa53lMw00FbsSxQbI",
    hostname: "api.stripe.com",
    paths: {
      createPaymentIntent: "/v1/payment_intents/",
      createCharge: "/v1/charges",
    },
  },
  mailgun:{
    secretKey:"df32af74be4aad600b334ad05a5ec6d4-7fba8a4e-edc64d7e",
    hostname:"api.mailgun.net",
    path:"/v3/sandbox83d7bbd6b3e74dbdb85196968b5e07eb.mailgun.org/messages",
    from:"Pizza Services <mailgun@sandbox83d7bbd6b3e74dbdb85196968b5e07eb.mailgun.org>",
    subject:"Order Receipt"
  }
};

// configuration for production mode
config.production = {
  http_PORT: 80,
  https_PORT: 443,
  envName: "Production",
  hashingSecret: "iAmCreatingAHasingSecretForProd",
  acceptedHttpMethods: ["get", "post", "put", "delete"],
  collections: collections,
  currency:'inr',
  stripe: {
    secretKey: "sk_test_ZWYyjD8XfOq0uW4tjwa53lMw00FbsSxQbI:",
    baseUrl: "api.stripe.com/v1/",
    paths: {
      createPaymentIntent: "payment_intents",
      createCharge: "charges",
    },
  },
  mailgun:{
    secretKey:"df32af74be4aad600b334ad05a5ec6d4-7fba8a4e-edc64d7e",
    hostname:"api.mailgun.net",
    path:"/v3/sandbox83d7bbd6b3e74dbdb85196968b5e07eb.mailgun.org/messages",
    from:"Pizza Services <mailgun@sandbox83d7bbd6b3e74dbdb85196968b5e07eb.mailgun.org>",
    subject:"Order Receipt"
  }
};

// get the enviroment
let env = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";

// export the module
module.exports = config[env];
