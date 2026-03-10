//? 1) import
import express from "express";

//? 2) invoke
let app = express();

// app.use(express.urlencoded({ extended: true })); //TODO:middleware

app.use((req, res, next) => {
  console.log("m1 ");
  req.myProperty = "abc";
  next();
});

app.use((req, res, next) => {
  console.log("m2 ");
  next();
});

app.use((req, res, next) => {
  console.log("m3 ");
  next();
});

//? 4)

app.get("/", (req, res) => {
  console.log(req.myProperty);
  res.send("home");
});
app.get("/about", (req, res) => {
  res.send("about");
});

//? 3) assigning a port number
app.listen(9000, (err) => {
  if (err) console.log(err);
  console.log("server running at port 9000");
});

//! middleware -> it is a function. which comes in between req and res. and it has access to req and res object. along with that, it has a next(), which calls the next middleware present if not then the req goes to controller

// to use middleware -> use()

//! there are few types of middlewares
//? 1) app level middleware
//? 2) router level middleware
//? 3) built-in middleware
//? 4) third party middleware
//? 5) error middleware
