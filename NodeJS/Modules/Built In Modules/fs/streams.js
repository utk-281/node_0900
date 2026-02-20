const fs = require("node:fs");

//! streams --> it is a process of sending data in continuous chunks from source to destination
//? streams uses buffer internally

//~ buffer : it is an array like structure which holds the data in binary format
//? we cannot change the size of buffer once defined (but we can define the size at start)
//? buffer will be destroyed once the operation in completed
//? buffer is a space inside memory(RAM) used by nodeJS to perform some operation
//? in case of streams, buffer size is fixed that is 16KB

//! types of streams (4)
//? 1) readable stream -> it is used to read the data in continuous chunks
//~ fs.createReadStream()

//? 2) writable stream -> it is used to write the data in continuous chunks
//~ fs.createWriteStream()

//? 3) duplex stream -> used to perform both operations simultaneously(http server)

//? 4) transform stream -> same as duplex but data can be modified (encryption, file compression, etc..)

//! =========================== reading a file using streams ======================
//?  createReadStream()
//? format -> fs.createReadStream("path of the file", options )

// createReadStream("./index.html", "utf-8");
// createReadStream("./index.html", {
//   encoding: "utf-8",
// });

// let readStream = createReadStream("./index.html", {
//   encoding: "utf-8",
//   highWaterMark: 100, //? size of buffer (by default 64 KB)
// });

//? this method is creating an event named "data"
//! createReadStream() will fire an event
//! event.emit("data", "file contents")
// console.log("readStream: ", readStream); //? readStream objet (readable stream)

// readStream.on("data", (chunk) => {
//   console.log(`${chunk.length}`);
//   console.log(`${chunk}`);
// });

//TODO: for events module
//!  -> emit("eventName", data) : we can create an event
//!  -> on("eventName", ()=>{}) : we can listen to an event

console.log(65536 / 1024);
//! in case of files default size is 64 KB
//! in case of videos default size is 16 KB

//! =================== reading a large file using readFileSync, async =================

// setTimeout(() => {
//   console.time("syncRead");
//   let data = fs.readFileSync("./large-file.json", "utf-8");
//   console.timeEnd("syncRead");
// }, 5000);
// //! not an efficient way

//! =================== reading a large file using streams =================
// setTimeout(() => {
//   console.time("streamRead");
//   let readStream = fs.createReadStream("./large-file.json", "utf-8");

//   readStream.on("data", (chunk) => {
//     console.log("received");
//   });

//   readStream.on("end", () => {
//     console.timeEnd("streamRead");
//   });

//   readStream.on("error", () => {
//     console.log("error occurred");
//   });
// }, 5000);
//? efficient way

//! =========================== writing a file using streams ======================
//? createWriteStream()
//? fs.createWriteStream("path/name.ext")

// let writeStream = fs.createWriteStream("./demo.txt");
// console.log("writeStream: ", writeStream); //? write stream object, writable stream

// writeStream.write("hi this is write stream", () => {
//   console.log("written");
// });

// writeStream.write("hi this is write stream 2", () => {
//   console.log("written");
// });
//? previous data will over-written by the new ones

//! =========================== duplex streams ======================
// let readObject = fs.createReadStream("./index.html", {
//   encoding: "utf-8",
//   highWaterMark: 5,
// });
// let writeObject = fs.createWriteStream("./demo.txt");

// readObject.on("data", (chunk) => {
//   console.log("chunk read");
//   writeObject.write(chunk, () => {
//     console.log("chunk written");
//   });
// });

// readObject.on("end", () => {
//   console.log("done");
// });

//~ pipe() --> this method connects source to destination (readable Stream to writeable stream)

//? readableStream/src.pipe(writeableStream/dest)
// readObject.pipe(writeObject);

//! =========================== transform streams ======================
let readObject = fs.createReadStream("./index.html", {
  encoding: "utf-8",
  highWaterMark: 5,
});
let writeObject = fs.createWriteStream("./demo.txt");

readObject.on("data", (chunk) => {
  console.log("chunk read");
  let upperCaseChunk = chunk.toUpperCase();
  writeObject.write(upperCaseChunk, () => {
    console.log("chunk written");
  });
});

readObject.on("end", () => {
  console.log("done");
});
