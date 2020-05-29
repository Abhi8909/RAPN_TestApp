/**
 * Email integration using mailgun
 *
 */

const https = require("https");
const config = require("../config.js");
const queryString = require("querystring");

let mailgun = {};

mailgun.send = function (email, message, callback) {
  let payload = {
    subject: config.mailgun.subject,
    from: config.mailgun.from,
    to: email,
    text: message,
  };

  let payloadString = queryString.stringify(payload);

  let requestDetails = {
    protocol: "https:",
    method: "POST",
    hostname: config.mailgun.hostname,
    path: config.mailgun.path,
    auth: config.mailgun.secretKey,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(payloadString),
    },
  };

  let request = https.request(requestDetails, (res) => {
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
module.exports = mailgun;
