import { createServer } from "node:http";

createServer((req, res) => {
  //! create two endpoints -> /slow and /fast

  //? /slow -> large file > read using readFileSync, async -> memory consumption (~500MB), time taken?
  if (req.url === "/slow") {
    // read a large file
    setTimeout(() => {
      fs.readFileSync("./small-text.txt", "utf-8");
      res.end("file read");
    }, 10000);
  }

  //? /fast -> large file > read using streams > memory consumption (30-40 MB), time taken?
  else if (req.url === "/fast") {
    // read a large file
    setTimeout(() => {
      let data = fs.createReadStream("./small-text.txt", "utf-8");
      data.pipe(res);
      res.end("large file read using streams");
    }, 10000);
    console.log("non blocking");
    res.end("non-blocking");
  }
  //? blocking
  else if (req.url === "/blocking") {
    //! blocking of main thread
    for (let i = 0; i < 100000000000; i++) {} //? cpu bound tasks
    // console.log("blocking");
    res.end("blocking"); //? we will use worker_threads module
  }
  //? non-blocking
  else if (req.url === "/non-blocking") {
    res.end("blocking"); //? we will use worker_threads module
  }
  //? if any other requests made
  else {
    res.end(`Please enter a valid endpoint -> /slow or /fast`);
  }
}).listen(9000, (err) => {
  if (err) console.log(err);
  console.log("server running");
});

console.log(globalThis); //? "global" in case of nodeJS
console.log(globalThis); //? "window" in case of browser
