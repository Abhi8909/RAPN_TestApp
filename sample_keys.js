module.exports = {
  stripe: {
    secretKey: "thisIsASecretKey",
    hostname: "api.stripe.com",
    paths: {
      createPaymentIntent: "/v1/payment_intents/",
      createCharge: "/v1/charges",
    },
  },
  mailgun: {
    secretKey: "thisIsASecretKey",
    hostname: "api.mailgun.net",
    path: "/v3/thisIsASecretKey/messages",
    from: "Pizza Services <mailgun@thisIsASecretKey>",
    subject: "Order Receipt",
  },
};
