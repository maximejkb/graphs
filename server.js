const http = require("http");
const fs = require('fs');
const hostname = "127.0.0.1";
const port = 3000;

//@source https://github.com/dotnetcurry/node.js-html-static-content/blob/master/server.js
var server = http.createServer((request, response) => {
  //If the request is for the main page, parse HTML and send.
  if (request.url == "/") {
    sendFileContent(response, "index.html", "text/html");
  //If the request matches the RegEx expression below, for a Javascript file, parse and send.
  } else if (/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())) {
    sendFileContent(response, request.url.toString().substring(1), "text/javascript");
  //As above, but for CSS files.
  } else if (/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())) {
    sendFileContent(response, request.url.toString().substring(1), "text/css");
  //Catch-all: log unrecognized requests to the console.
  } else {
    console.log("Requested url: " + request.url);
    response.end();
  }
});

//Initialize the server.
server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}/`);
});

function sendFileContent(response, fileName, contentType) {
  //FileSystem read the file. Second argument is the callback function.
  fs.readFile(fileName, (err, data) => {
    if (err) {
      response.writeHead(404);
      response.write("Unable to find requested resource.");
      console.log(err);
    } else {
      response.writeHead(200, {"Content-Type" : contentType});
      response.write(data);
    }
    response.end();
  });
}
