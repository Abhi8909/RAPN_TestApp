/**
 *  Handles the payment integration from stripe
 */

const https = require("https");
const config = require("../config.js");
const queryString = require('querystring');

let payment = {};

payment.make = function (amount,source,callback) {
  let payload = {
    amount: amount,
    currency:config.currency,
    description:'Init payment for the order',
    source:source
  };

  let payloadString = queryString.stringify(payload);

  let requestDetails = {
    protocol: "https:",
    method: "POST",
    hostname: config.stripe.hostname,
    path: config.stripe.paths.createCharge,
    auth: config.stripe.secretKey,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(payloadString),
    },
  };

  let request = https.request(requestDetails, function (res) {
    
    if(res.statusCode === 200){
      callback(true);
    }else{
      callback(false);
    }
    
  });

  request.on("error", function (e) {
    console.log(e);
  });

  request.write(payloadString);

  request.end();
};

// Export the module
module.exports = payment;
