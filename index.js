/**
 * Master class for NODEJS
 * by pirple
 */

const http = require("http");
const url = require("url");

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

  res.end("Hello World\n");
});

server.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
