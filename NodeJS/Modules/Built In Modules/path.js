import fs from "fs";
import path from "node:path";
// console.log("path: ", path);

// console.log(fs.readFileSync("./demo.txt", "utf-8"));

console.log(path.join("f1", "f2", "f3"));

//! relative -> file or folder relative (.)
// ! absolute -> complete path of the file from root

//? commonJS --> __dirname
//? ESM -< import.meta.dirname

console.log(import.meta.dirname);
//? C:\Users\ASUS\Desktop\Classes\node_0900\NodeJS\Modules\Built In Modules\app.js

console.log(path.join(import.meta.dirname, "os.js"));

console.log(path.join(import.meta.dirname, "..", "modules.js"));
//? C:\Users\ASUS\Desktop\Classes\node_0900\NodeJS\Modules\

let filePth = path.join(import.meta.dirname, "..", "modules.js");

console.log(fs.readFileSync(filePth, "utf-8"));

// extname("path"), base()

console.log(path);
