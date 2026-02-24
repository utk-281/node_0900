// https://nodejs.org/en/
// https://nodejs.org/en (default "/")
// https://nodejs.org/en/about -> "/about" -> endpoints
// https://nodejs.org/en/download -> "/download"
// https://nodejs.org/en/blog -> "/blog"

//? routing -> handling user's different requests

//? /login, "/register", "/get-all-users". "/update-user"

// import fs from "node:fs";
import { createReadStream } from "node:fs";
import { createServer } from "node:http";

// let {createServer}  = require("node:http")
// let fs = require("node:fs")

//~ commonJS blocks the code while importing whereas ESM does not block the code

createServer((req, res) => {
  //   return res.end(req.url);

  let endpoint = req.url;
  ///! /html -> html page
  if (endpoint == "/html") {
    res.writeHead(200, { "content-type": "text/html" });
    let data = createReadStream("./index.html", "utf-8");
    //? src.pipe(dest) -> readableStream.pipe(writeableStream)
    data.pipe(res);

    // let body = "";
    // data.on("data", (chunk) => {
    //   body += chunk.toString();
    // });

    // data.on("end", () => {
    //   res.writeHead(200, { "content-type": "text/html" });
    //   res.end(body);
    // });
  } else if (req.url == "/") {
    return res.end("landing page");
  }
  ///! /css -> css data
  else if (endpoint == "/css") {
    res.writeHead(200, { "content-type": "text/css" });
    let data = createReadStream("./style.css", "utf-8");
    data.pipe(res);
  }
  ///! /json -> json data
  else if (endpoint == "/json") {
    return res.end("json data");
  }
  ///! /else --> error not found
  else {
    return res.end("not found");
  }
}).listen(3000, (err) => {
  if (err) console.log(err);
  console.log("running");
});

// "default value of endpoint is " -> "/"
