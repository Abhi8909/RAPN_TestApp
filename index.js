/**
 * Master class for NODEJS
 * by pirple
 */

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const { StringDecoder } = require("string_decoder");

// helpers
const config = require("./config");
const handlers = require("./lib/handlers");
const payment = require("./lib/stripe");


const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

httpServer.listen(config.http_PORT, function () {
  console.log("Server is listening on port " + config.http_PORT);
});

const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

httpsServer.listen(config.https_PORT, function () {
  console.log("Server is listening on port " + config.https_PORT);
});

let unifiedServer = function (req, res) {
  // parsed the url
  let parsedUrl = url.parse(req.url, true);

  // get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // GET the method
  let method = req.method.toLowerCase();

  // Get the headers
  let headers = req.headers;

  // Get the query
  let queryObject = parsedUrl.query;

  // Get the payload
  let decoder = new StringDecoder("utf8");

  let payload = "";

  req.on("data", function (data) {
    payload += decoder.write(data);
  });

  req.on("end", function () {
    payload += decoder.end();

    let data = {
      trimmedPath: trimmedPath,
      queryObject: queryObject,
      headers: headers,
      payload: payload,
      method: method,
    };

    let handlerToCall = router[trimmedPath]
      ? router[trimmedPath]
      : handlers.notFound;

    handlerToCall(data, function (statusCode, _payload) {
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      _payload = typeof _payload === "object" ? _payload : {};

      // send the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(JSON.stringify(_payload));
    });
  });
};

let router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  getMenu: handlers.getMenu,
  cart: handlers.cart,
};
