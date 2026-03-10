//! a) import
import express from "express";
// console.log("express: ", express);

//! b) calling/invoking top level function
let app = express();

//! ** import every route file **
import myRoutes from "./routes/route.js";

//! ** use this **
app.use(myRoutes); //TODO:middlewares

//! c) assign a port number
app.listen(3000, (err) => {
  if (err) throw err;
  console.log("server running....");
});

//? nodemon app.js

//! npm i nodemon -g (globally) only once
