import express from "express";

//! import and use it in middleware
import routesFile from "./routes/routes.js";

let app = express();

// global level middleware -> this will run for every req
app.use(express.urlencoded({ extended: true })); //TODO: urlencoded values

app.use("/api/v1", routesFile); // api

app.listen(9000, (err) => {
  if (err) console.log(err);
  console.log("server running at port 9000");
});

// http://localhsot:9000/api/v1/auth/login
// http://localhsot:9000/api/v2/auth/login
// http://localhsot:9000/api/v1/carts/get
// http://localhsot:9000/api/v1/orders/get

// http://localhost:9000/api/v1
