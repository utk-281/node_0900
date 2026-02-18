//! to import any built in module
//? import variableName from "node:name of the module"
//? let variableName = require("node:name of the module")

import fs from "node:fs";

//? different name of modules (lowercase, separated by hyphen) -> fs, http, crypto, os, path, cluster, events etc..

//TODO: (module resolution algorithm)

//~ fs stands for file system. this module provides utilities to operate on files and folders present in the OS

// console.log(fs);

//! in javascript we can execute any code in two ways
//? synchronous
//? asynchronous (callbacks, then/catch, async-await)

//! ================== using fs synchronously (blocking) ========================================
//? CRUD ()

//~ 1) creating a file synchronously
//? method name --> writeFileSync()
//& format --> fs.writeFileSync("path/name.ext", "data")

// console.log(1);
// fs.writeFileSync("./demo.txt", "");
// console.log("file created");
// console.log(2);
// console.log(3);

//? if the file is present at the specified path, then previous data will be over-written by new one

//~ 2) reading a file synchronously
//? method name --> readFileSync()
//& format --> fs.readFileSync("path", "encoding")

//! encoding -> specifying the type of conversions (i.e. how maun bits will each letter or number will take.)

// console.log(1);
// let content = fs.readFileSync("./demo.txt", "utf-8");
// console.log("content: ", content);
//! this will give us buffer value which is an array like structure which holds the data in binary format (and displays in hexadecimal format)

// console.log(content.toString("utf-8"));
// console.log(2);
// console.log(3);

//~ 3) updating a file synchronously (we can only append: adding data at last)
//? method name --> appendFileSync()
//& format --> fs.appendFileSync("path", "new data")

try {
  fs.appendFileSync("./index.py", "\nnew data");
  console.log("done");
} catch (error) {
  console.log(error);
}

//! if the file is not present at the specified path, then a new file will be created

//~ copy the contends of "fs.js" into a new file "fs.txt" using fs module.
function copyPaste() {
  let contents = fs.readFileSync("./fs.js", "utf-8");
  fs.writeFileSync("./fs.txt", contents);
  console.log("done");
}
// copyPaste();

//~ 4) copying a file synchronously
//? method name --> copyFileSync()
//& format --> fs.copyFileSync("src", "dest")

// fs.copyFileSync("./fs.js", "../../Starter/fs.txt");
// console.log("done");

//~ 5) deleting a file synchronously
//? method name --> unlinkSync()
//& format --> fs.unlinkSync("path")

// fs.unlinkSync("./demo.txt");

//~ 6) creating a folder (directory)
//? method name --> mkdirSync()
//& format --> fs.mkdirSync("path/name")
// fs.mkdirSync("../Third Party");
// console.log("Created");

//~ 7) deleting a folder (directory)
//? method name --> rmdirSync()
//& format --> fs.rmdirSync("path")
// fs.rmdirSync("../Third Party");
// console.log("deleted");

//~ 8) renaming a file/folder (we can move the file also)
//? method name --> renameSync()
//& format --> fs.renameSync("old path", "new path")
// fs.renameSync("./new.java", "../Local Modules/old.html");

//~ open()
//TODO:

//! ================== using fs asynchronously (callbacks) ========================================

//? error first callbacks (node. express) : first parameter is always reserved for an error

//~ 1) creating a file asynchronously
//? method name --> writeFile()
//& format --> fs.writeFile("path/name.ext", "data", ()=>{})

// console.log(1);
// fs.writeFile("./demo.py", "some data", (err) => {
//   if (err) console.log(err);
//   console.log("file created");
// });

// console.log(2);
// console.log(3);

//~ 2) reading a file asynchronously
//? method name --> readFile()
//& format --> fs.readFile("path/name.ext", "encoding", ()=>{})

console.log(1);

fs.readFile("./fs.html", "utf-8", (err, payload) => {
  if (err) console.log(err);
  console.log("payload: ", payload);
});

console.log(2);
console.log(3);
