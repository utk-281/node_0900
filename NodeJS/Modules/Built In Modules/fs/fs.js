//! to import any built in module
//? import variableName from "node:name of the module"
//? let variableName = require("node:name of the module")

// import fs from "node:fs";

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

// try {
//   fs.appendFileSync("./index.py", "\nnew data");
//   console.log("done");
// } catch (error) {
//   console.log(error);
// }

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
//& format --> fs.writeFile("path/name.ext", "data", (err)=>{})

// console.log(1);
// fs.writeFile("./demo.py", "some data", (err) => {
//   if (err) console.log(err);
//   console.log("file created");
// });

// console.log(2);
// console.log(3);

//~ 2) reading a file asynchronously
//? method name --> readFile()
//& format --> fs.readFile("path/name.ext", "encoding", (err, payload)=>{})

// console.log(1);

// fs.readFile("./fs.html", "utf-8", (err, payload) => {
//   if (err) console.log(err);
//   console.log("payload: ", payload);
// });

// console.log(2);
// console.log(3);

//~ 3) appending a file asynchronously
//? method name --> appendFile()
//& format --> fs.appendFile("path/name.ext", "new data", (err)=>{})

// console.log(1);

// console.log(2);
// console.log(3);

//! ==================

// fs.appendFile("./fs.html", "this is added data", (err) => {
//   if (err) console.log(err);
//   console.log("file appended");
// });

// fs.appendFile("./fs.html", "this is added data", (err) => {
//   if (err) console.log(err);
// });

// console.log("file appended");

//! ==========================

// fs.writeFile("./demo.txt", "new data", () => {
//   console.log("file created\n");
// });
// fs.appendFile("./demo.txt", "this is added data 1", () => {
//   console.log("file updated 1\n");
// });
// fs.appendFile("./demo.txt", "this is added data 2", () => {
//   console.log("file updated 2\n");
// });

//! ===============================

// fs.writeFile("./demo.txt", "new data", (err) => {
//   if (err) {
//     console.log("error while creating a file");
//     return;
//   }
//   console.log("file created\n");

//   fs.appendFile("./demo.txt", "this is added data 1", (err) => {
//     if (err) {
//       console.log("error while updating 1 a file");
//       return;
//     }
//     console.log("file updated 1\n");

//     fs.appendFile("./demo.txt", "this is added data 2", (err) => {
//       if (err) {
//         console.log("error while updating 2 a file");
//         return;
//       }
//       console.log("file updated 2\n");
//     });
//   });
// });

//TODO:
//~ 4) deleting, renaming, create a folder, removing a folder, copying a file

//! ================== using fs asynchronously (promise: then/catch) ========================================

import fsP from "node:fs/promises";

//? const fsP = require("node:fs/promises")
//? const fsP = require("node:fs").promises

//~ 1) creating a file asynchronously
//? method name --> writeFile()
//& format --> fs.writeFile("path/name.ext", "new data").then().catch()

// let writePromise = fsP.writeFile("./example.py", "this is data");
// writePromise
//   .then((data) => {
// console.log('data: ', data);
//     console.log("file created");
//     // next logic ...
//   })
//   .catch((err) => {
//     console.log("error while creating a file");
//     console.log(err);
//   })
//   .finally(() => {
//     console.log("finally");
//   });

//~ 2) reading a file asynchronously
//? method name --> readFile()
//& format --> fs.readFile("path/name.ext", "encoding").then().catch()

// let data = fsP.readFile("./fs.js", "utf-8");
// // console.log("data: ", data);
// data
//   .then((payload) => {
//     console.log("payload: ", payload);
//     console.log("file read");
//   })
//   .catch((err) => {
//     console.log("error while reading");
//   });

//TODO:
//~ 3) updating, deleting files; creating, deleting, reaming folders

//! =======================================
// let write = fsP.writeFile("./app.js", "this is writeFile");
// write.then(() => {
//   console.log("file created");
// });

// let update = fsP.appendFile("./app.js", "this is appendFile");
// update.then(() => {
//   console.log("file appended");
// });

// let update2 = fsP.appendFile("./app.js", "this is appendFile 2");
// update2.then(() => {
//   console.log("file appended 2");
// });

//! ==================================================

// let write = fsP.writeFile("./app.js", "this is writeFile");
// write
//   .then(() => {
//     console.log("file created");

//     let update = fsP.appendFile("./app.js", "this is appendFile");
//     update
//       .then(() => {
//         console.log("file appended");

//         let update2 = fsP.appendFile("./app.js", "this is appendFile 2");
//         update2
//           .then(() => {
//             console.log("file appended 2");
//           })
//           .catch();
//       })
//       .catch();
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//! ================== using fs asynchronously (promise: async/await) ========================================
async function fsOP() {
  await fsP.writeFile("./server.js", "this is server");
  console.log("1");
  await fsP.appendFile("./server.js", "app1");
  console.log("2");
  await fsP.appendFile("./server.js", "app2");
  console.log("3");
}

fsOP();
//? fs --> sync >> callbacks >> then/catch >> async-await

//! libUV -> to handle all the async I/O operation(file read, database call, nw call)
//? it is written in c language
//! js single threaded lang (main thread/ call stack)

//! 7 (1 main thread, 4 libUV, 2 garbage collection)

//! call stack - async op (delegate)
//! system kernel (hardware - software)
//? libUV (4 threads)

//? concurrency and parallelism
//! main, 4 --> os level threads --> 20 threads
