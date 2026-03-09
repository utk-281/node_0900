//! a) import
import express from "express";
// console.log("express: ", express);

//! b) calling/invoking top level function
let app = express();

// http methods -> get, post, put, patch and delete
// app.methods("endpoint", callback)
//! d) routing
app.get("/", (req, res) => {
  //   res.end("hello world from express");
  res.send("data from send()"); // alternative to end()
});

app.get("/about", (req, res) => {
  res.end("about page");
});

app.get("/json", (req, res) => {
  //   res.writeHead(200, { "content-type": "application/json" });
  //   res.end(JSON.stringify({ name: "varun" }));

  res.status(202).json({ success: true, message: "", data: {}, error: {} });
});

//! c) assign a port number
app.listen(3000, (err) => {
  if (err) throw err;
  console.log("server running....");
});

//? nodemon app.js

//! npm i nodemon -g (globally) only once
