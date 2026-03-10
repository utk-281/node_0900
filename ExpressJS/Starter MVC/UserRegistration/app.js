//! create a form -> email and password
//! when clicked on submit -> clg -> save in a data.json file -> database
//? resp => user registered

//? 1) import
import express from "express";
import fs from "node:fs";
import path from "node:path";

//? 2) invoke
let app = express();

app.use(express.urlencoded({ extended: true })); //TODO:middleware

//? 4) routing
//~ home/landing page
/* 
url -> http://localhost:9000/
method -> get
*/
app.get("/", (req, res) => {
  res.send("<h1> this is home page </h1>");
});

//~ form page
/* 
url -> http://localhost:9000/form
method -> get
*/
app.get("/form", (req, res) => {
  let readStream = fs.createReadStream(
    path.join(import.meta.dirname, "pages", "form.html"),
    "utf-8",
  );

  //! src.pipe(dest)
  //! readStream.pipe(writableStream)
  readStream.pipe(res);
});

//~ to submit form
/* 
url -> http://localhost:9000/register
method -> post
*/
app.post("/register", (req, res) => {
  //   let { userEmail, userPassword } = req.body;

  let readFile = fs.readFileSync("./db/data.json", "utf-8");

  fs.appendFileSync(
    "./db/data.json",
    JSON.stringify({ userEmail, userPassword }),
  );
  res.send("done");
});

//! req.body -> content
//! req.params ->
//! req.query -> key=value&key2=value2 -> anything after ? is query

// http:localhost:9000/varun?age=30&area=noida

//~ https://www.amazon.in/Daikin-Inverter-Display-Technology-MTKL50U/dp/B0BK1KS6ZD/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.58c90a12-100b-4a2f-8e15-7c06f1abe2be&dib=eyJ2IjoiMSJ9.LpujZ4uISPUK8sa_6yNGVTLp2_seTR9samDUOPD7O26IT2maA49Qq_TUDQHEmHNAzg1ZhKPwLyo3STUtsn9XvyFgu1JlI9W2nuhVMSK3nlU8ymvbBYmU0sTNp6Y3z6PXKQmQl6uqE-XdXvWSPr2jGJNtdXV9snDJ1L66YT7yF3O4adBV645JXWyt32e6Pgz5LSQowQwhJS9xPZwxn-arN4pN1Rf6qygHC-iXCMpIsw5-56zlr1bBdha5tvZT9x1fHgqvx8BMp_lT6mNXx6gSAx8wVeXzpEwE9_QCM_vSKDI.6jQMS_hNpfd2CWADV4pZEbrT9hHQO-f4xvHeg5MoERA&dib_tag=se&pd_rd_r=d08131a4-1e8b-4f48-8797-b645cf0bd09c&pd_rd_w=VBJAW&pd_rd_wg=KBe1C&qid=1773116976&refinements=p_85%3A10440599031&rps=1&s=kitchen&sr=1-1

console.log(import.meta.dirname); //& this will give the absolute path of the current folder in which the file is present in ES module scope (in commonJS use __dirname)

//? 3) assigning a port number
app.listen(9000, (err) => {
  if (err) console.log(err);
  console.log("server running at port 9000");
});
