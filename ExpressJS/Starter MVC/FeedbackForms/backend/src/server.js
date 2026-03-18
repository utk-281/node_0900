import dotenv from "dotenv";
dotenv.config({ quiet: true }); //? this method will read/parse the contents of .env file and add it to process.env

import express from "express";
import connectDB from "./config/database-config.js";

import feedbackRoutes from "./routes/feedback-routes.js";

connectDB();

const app = express();

app.use(express.urlencoded({ extended: true })); //! this will parse urlencoded data
app.use(express.json()); //! this will parse json data

app.use("/api/feedback/v1", feedbackRoutes);

app.listen(process.env.PORT, (err) => {
  if (err) throw err;
  else console.log("Server started at port:", process.env.PORT);
});

//! node mainFile.js
//! nodemon mainFile.js

/* 
 "scripts": {
    "start": "node src/server.js", -> this is for production
    "dev": "nodemon src/server.js" -> this is for development
  },

  ? in order to use built-in scripts, 
  npm scriptName 

  ? in order to use custom defined scripts, 
  npm run scriptName 
*/
