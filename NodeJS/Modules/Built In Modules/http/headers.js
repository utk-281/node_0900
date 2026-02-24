import { createServer } from "node:http";

createServer((req, res) => {
  //? this is used to set the header -> 1st way
  //   res.statusCode = 201;
  //   res.setHeader("content-type", "text/plain");
  //   res.setHeader("My-Name", "abc");

  //? this is used to set the header -> 2nd way
  res.writeHead(200, { "content-type": "text/plain" });
  res.end("this is string!!");

  //! whenever we are sending a response, make sure to set the headers as it it used by browser and it contains the meta-data of the res object (like content-type, cookies, etc...)
}).listen(9000, (err) => {
  if (err) console.log(err);
  console.log("running");
});

//! different content-type ->
//? for plain text -> text/plain
//? for html data -> text/html
//? for css data -> text/css
//? for json data -> application/json
//? for videos -> application/video

//~ node --watch filename.js : this will automatically execute the filename when that file is saved
