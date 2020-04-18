/**
 * Master class for NODEJS
 * by pirple
 */

const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

const config = require("./config");

const server = http.createServer(function (req, res) {
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

      console.log(JSON.stringify(_payload));
    });
  });
});

server.listen(config.PORT, function () {
  console.log("Server is listening on port " + config.PORT);
});

let handlers = {};

handlers.sample = function (data, callback) {
  callback(402, { name: "Sample Handler" });
};

handlers.notFound = function (data, callback) {
  callback(404);
};

let router = {
  sample: handlers.sample,
};
