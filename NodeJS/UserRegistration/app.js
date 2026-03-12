import { createServer } from "http";
import { createReadStream } from "node:fs";
import { parse } from "node:querystring";

createServer((req, res) => {
  //? this will give us the method
  //   console.log(req.method);
  //? this will give us the endpoint or path
  //   console.log(req.url);

  //~ for GET
  if (req.method === "GET") {
    //! defined an endpoint for "/"
    if (req.url === "/") {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("this is home page");
    }
    //! defined an endpoint for "/form" -> display form
    else if (req.url === "/form") {
      res.writeHead(200, { "content-type": "text/html" });
      createReadStream("./form.html", "utf-8").pipe(res);
    }
    // else
    else {
      res.writeHead(400, { "content-type": "text/plain" });
      res.end("page not found");
    }
  }
  //~ for POST -> similarly define all the methods in if-else block
  else if (req.method === "POST") {
    console.log(req.headers["content-type"]);
    if (req.url == "/register") {
      // & checking the headers -> req, and res both will have headers which will store the meta data of the object (req and res)
      console.log(req.headers["content-type"]);
      if (req.headers["content-type"] == "application/x-www-form-urlencoded") {
        //? when form is submitted an event is fired named "data"
        // data received in chunks
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString(); //%&
          console.log(chunk.toString());
          // userEmail=we&userPassword=qwe   -> urlencoded
        });

        //? when the last chunk is received another event is fired named "end"
        req.on("end", () => {
          // write the code to save the data because we have received all the chunks
          console.log(body);
          let parsedData = parse(body);
          console.log("parsedData: ", parsedData);

          res.write(JSON.stringify(parsedData.userEmail));
          res.end();
        });

        req.on("error", () => {
          res.end("some error occurred.");
        });
      }
    }
  }
  //& for any other methods
  else {
    res.writeHead(405, { "content-type": "text/plain" });
    res.end("Method Not Allowed");
  }
}).listen(9000, (err) => {
  if (err) throw err;
  console.log("server running....");
});
