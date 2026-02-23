import { createServer } from "node:http";

createServer((req, res) => {
  //? this is used to set the header -> 1st way
  //   res.statusCode = 201;
  //   res.setHeader("content-type", "text/plain");
  //   res.setHeader("My-Name", "abc");

  //? this is used to set the header -> 2nd way

  res.end("this is string");
}).listen(9000, (err) => {
  if (err) console.log(err);
  console.log("running");
});
