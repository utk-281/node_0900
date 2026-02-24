// import fs from "node:fs";
import fs from "node:fs";
import { createServer } from "node:http";

// let {createServer}  = require("node:http")
// let fs = require("node:fs")

//~ commonJS blocks the code while importing whereas ESM does not block the code

createServer((req, res) => {
  //! ============== sending html contents =================
  //   res.writeHead(200, { "content-type": "text/html" });
  //   let htmlData = fs.readFileSync("./index.html", "utf-8");
  //   res.end(htmlData);
  //   fs.readFile("./index.txt", "utf-8", (err, data) => {
  //     if (err) return res.end("No file found");
  //     res.end(data);
  //   });
  //! ============== sending css contents =================
  //   res.writeHead(200, { "content-type": "text/css" });
  //   let cssData = fs.readFileSync("./style.css", "utf-8");
  //   res.end(cssData);
  //~ ssr -> server side rendering: whenever we req something, server picks up the html, css and js files and it will render all those files and then it will pass the rendered data to the client (legacy)
  //~ csr -> client side rendering: whenever we req something, server picks up the html, css and js files and sends to the browser, now the browser is responsible for rendering the files
  //TODO:
  //! ISR and CSR (nextJS and nestJS/angular)
  //! ============== sending json response ================= ()
  res.writeHead(200, { "content-type": "application/json" });
  //? db calls, login?
  let jsonResponse = fs.readFileSync("./data.json", "utf-8");
  res.end(jsonResponse);
}).listen(3000, (err) => {
  if (err) console.log(err);
  console.log("running");
});
