import express from "express";

//! import and use it in middleware
import routesFile from "./routes/routes.js";

let app = express();

// global level middleware -> this will run for every req
app.use(express.urlencoded({ extended: true })); // this will parse urlencoded data
app.use(express.json()); // json data

app.use("/api/v1", routesFile); // api versioning

app.listen(9000, (err) => {
  if (err) console.log(err);
  console.log("server running at port 9000");
});

// http://localhsot:9000/api/v1/auth/login
// http://localhsot:9000/api/v2/auth/login
// http://localhsot:9000/api/v1/carts/get
// http://localhsot:9000/api/v1/orders/get

// http://localhost:PORT_NUMBER/API_VERSIONING/ENDPOINT
