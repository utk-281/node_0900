setTimeout(() => {
  console.log("st1");
}, 1000);

setTimeout(() => {
  console.log("st2");
}, 0);

let p = new Promise((res, rej) => {
  res("done");
});
p.then((data) => {
  console.log(data);
  console.log("resolved");
});

process.nextTick(() => {
  console.log("tis is next tick");
});

console.log("hi");

// fs.readFile("./app.js", "utf-8", (err, data) => {
//   console.log("file read");
// });
