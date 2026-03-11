import fs from "node:fs";
import path from "node:path";
import connectDB from "../config/database-config.js";

export const displayHomePage = (req, res, next) => {
  res.send("<h1>this is home page!!!!</h1>");
  //   next() -> error middleware
};

export const displayFormPage = (req, res, next) => {
  //   let filePath = path.join(import.meta.dirname, "..", "pages", "form.html");
  //   let fileData = fs.createReadStream(filePath, "utf-8");
  //   fileData.pipe(res);

  fs.createReadStream(
    path.join(import.meta.dirname, "..", "pages", "form.html"),
    "utf-8",
  ).pipe(res);
};

export const submitForm = async (req, res, next) => {
  let { userEmail, userPassword } = req.body;

  let myColl = await connectDB();
  let op = await myColl.insertOne({ userEmail, userPassword });

  res.status(201).json({
    //? 201 is for created
    success: true,
    message: "User registered Successfully",
    data: { userEmail, userPassword },
    op,
  });
};

/* 
const displayHomePage = (req, res) => {
  res.send("<h1>this is home page</h1>");
};

const displayFormPage = (req, res) => {
  //   let filePath = path.join(import.meta.dirname, "..", "pages", "form.html");
  //   let fileData = fs.createReadStream(filePath, "utf-8");
  //   fileData.pipe(res);

  fs.createReadStream(
    path.join(import.meta.dirname, "..", "pages", "form.html"),
    "utf-8",
  ).pipe(res);
};
module.exports = {
  displayHomePage,
  displayFormPage
}; */

// http://localhost:9000/api/v1/register
