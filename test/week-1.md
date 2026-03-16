# Node.js Interview Questions — Complete Guide

### REPL, Modules, fs, Buffers, Streams, libuv & Async

---

## 📁 Table of Contents

1. [REPL & Running Files](#1-repl--running-files)
2. [Modules — Core Concepts](#2-modules--core-concepts)
3. [CommonJS vs ES Modules](#3-commonjs-vs-es-modules)
4. [CommonJS — Practical Questions](#4-commonjs--practical-questions)
5. [ES Modules — Practical Questions](#5-es-modules--practical-questions)
6. [Named vs Default Exports](#6-named-vs-default-exports)
7. [fs Module — Theory](#7-fs-module--theory)
8. [fs Module — Sync Methods (Practical)](#8-fs-module--sync-methods-practical)
9. [fs Module — Async Methods (Practical)](#9-fs-module--async-methods-practical)
10. [Buffers — Theory & Practical](#10-buffers--theory--practical)
11. [Sync vs Async — Theory](#11-sync-vs-async--theory)
12. [Callbacks, Promises & async/await](#12-callbacks-promises--asyncawait)
13. [Callback Hell](#13-callback-hell)
14. [libuv & Node.js Internals](#14-libuv--nodejs-internals)
15. [Event Loop & Queues](#15-event-loop--queues)
16. [Streams — Theory](#16-streams--theory)
17. [Streams — Practical](#17-streams--practical)
18. [Output Prediction Questions](#18-output-prediction-questions)
19. [Scenario / Problem-Solving Questions](#19-scenario--problem-solving-questions)
20. [Parameters vs Arguments](#20-parameters-vs-arguments)

---

## 1. REPL & Running Files

**Theory**

1. What does REPL stand for? Explain each letter.
2. What is the Node.js REPL used for?
3. How do you enter and exit the Node REPL?
4. What is the difference between running code in the REPL vs running a `.js` file?
5. What command do you use to run a JavaScript file with Node.js?
6. Is the file extension required when running a file with `node`?
7. What error does Node throw if you try to run a file from the wrong directory?
8. Name 3 use cases where using the REPL would be appropriate.

**Practical**

9. How would you quickly test if `[1, 2, 3].map(x => x * 2)` works without creating a file?
10. If your file is at `/projects/app/index.js`, what steps do you take to run it from a fresh terminal?

---

## 2. Modules — Core Concepts

**Theory**

1. What is a module in Node.js?
2. Why do we use modules? Name at least 4 benefits.
3. What does DRY stand for and how do modules help with it?
4. What is encapsulation in the context of modules?
5. What are the 3 types of modules in Node.js? Explain each.
6. Name 5 built-in Node.js modules and what each one does.
7. How do you use a built-in module vs a third-party module vs a local module?
8. What is `npm` and what role does it play with modules?
9. What is the `node:` prefix (e.g., `node:fs`) and why is it recommended?
10. Can two modules have variables with the same name? Will they conflict?

**Practical**

11. You have a utility function `formatDate()` used in 10 files. How do modules help here?
12. You installed `express` via npm. How do you import and use it?
13. How do you check if a module is a built-in module vs a third-party module?

---

## 3. CommonJS vs ES Modules

**Theory**

1. What are the two module systems in Node.js?
2. Which module system is the default in Node.js?
3. What is the syntax difference between CJS and ESM for exporting and importing?
4. Is the file extension required in `require()` calls? What about `import` statements?
5. What is `__dirname` and `__filename` in CommonJS? What are their ESM equivalents?
6. Does CommonJS support top-level `await`? Does ESM?
7. How do you enable ES Modules in a Node.js project?
8. What file extension can you use instead of `"type": "module"` in package.json?
9. Is CommonJS synchronous or asynchronous? What about ESM?
10. Can you use `require()` in an ES Module file?

**Comparison**

11. What are 5 key differences between CommonJS and ES Modules?
12. When would you prefer CommonJS over ESM and vice versa?

---

## 4. CommonJS — Practical Questions

1. How do you export a single function in CommonJS?
2. How do you export multiple values in CommonJS?
3. What is the difference between `module.exports = greet` and `module.exports = greet()`? Which is correct and why?
4. How do you import a specific function from a CJS module?
5. What does `require('./file1')` return if `module.exports = { a, b, c }`?

**Write the code:**

6. Write a `math.js` file that exports `add` and `subtract` functions using CommonJS.
7. Write an `index.js` that imports and uses both functions from `math.js`.
8. What happens if you `require()` a file that doesn't export anything?

**Spot the bug:**

9. What is wrong with the following code?
   ```js
   module.exports = greet();
   ```
10. What is wrong here?
    ```js
    const greet = require("./greet");
    greet.name(); // Error
    ```

---

## 5. ES Modules — Practical Questions

1. How do you export a named variable in ESM?
2. How do you write a default export in ESM?
3. How do you import a default export along with named exports in one statement?
4. What happens if you forget the file extension in an ESM import?
5. How do you get the current file's directory in an ESM file?

**Write the code:**

6. Write a file `utils.js` that exports a default function `greet` and two named exports `sum` and `arr`.
7. Write the correct import statement in `main.js` to use all three.
8. Convert this CommonJS code to ESM:
   ```js
   const { add } = require("./math.js");
   ```

---

## 6. Named vs Default Exports

**Theory**

1. What is the difference between a named export and a default export?
2. How many default exports can a file have?
3. How many named exports can a file have?
4. Do named exports need to be imported with `{}` curly braces? Does the name need to match?
5. Can you rename a named export when importing it? How?
6. Can you import a default export with any name you want?

**Spot the bug:**

7. What is wrong with this import?
   ```js
   import { greet } from "./file.js"; // greet was exported as default
   ```
8. What is wrong with this import?
   ```js
   import total from "./math.js"; // math.js exports: export let sum = ...
   ```

---

## 7. fs Module — Theory

1. What does `fs` stand for? What is it used for?
2. Why can't browsers access the file system but Node.js can?
3. How do you import the `fs` module in CommonJS? In ESM?
4. What is the difference between `fs` and `fs/promises`?
5. Name 5 operations you can perform with the `fs` module.
6. What does `writeFileSync` do if the file already exists?
7. What is the difference between `writeFileSync` and `appendFileSync`?
8. How do you rename AND move a file using `fs`?
9. What method do you use to permanently delete a file?
10. How do you create nested directories with `mkdirSync`?

---

## 8. fs Module — Sync Methods (Practical)

**Write the code:**

1. Write code to create a file `demo.txt` with content `"Hello World"` synchronously.
2. Write code to read `demo.txt` and log its content as a string (not a Buffer).
3. Write code to append `" - Updated"` to `demo.txt` without overwriting it.
4. Write code to copy `source.txt` to `backup.txt`.
5. Write code to delete `old.txt`.
6. Write code to create a folder called `images`.
7. Write code to rename `old.js` to `new.js`.
8. Write code to move `file.txt` from the current directory to `../archive/file.txt`.

**Spot the bug:**

9. What is the issue?
   ```js
   let content = fs.readFileSync("./demo.txt");
   console.log(content.toUpperCase()); // Error?
   ```
10. Will this throw an error? Why?
    ```js
    fs.unlinkSync("./nonexistent.txt");
    ```

---

## 9. fs Module — Async Methods (Practical)

1. Rewrite this sync code as async:
   ```js
   let data = fs.readFileSync("./data.txt", "utf-8");
   console.log(data);
   ```
2. Write async code to create a file and log "done" only after the file is created.
3. What are the parameters of the callback in `fs.readFile()`?
4. What is the error-first callback pattern? Why is it used?
5. Write a `readFile` call with proper error handling.

**Output prediction:**

6. What is the output order?
   ```js
   console.log(1);
   fs.readFile("./file.txt", "utf-8", (err, data) => {
     console.log("file read");
   });
   console.log(2);
   console.log(3);
   ```

---

## 10. Buffers — Theory & Practical

**Theory**

1. What is a Buffer in Node.js?
2. Where is a Buffer stored — RAM or disk?
3. What format is data stored in a Buffer?
4. How is Buffer data displayed when logged?
5. Can a Buffer be resized after creation?
6. What is encoding? Why is UTF-8 the most common encoding?
7. What is the difference between `Buffer.alloc()` and `Buffer.allocUnsafe()`?
8. Why is `Buffer.allocUnsafe()` considered dangerous?
9. What is the relationship between Buffers and Streams?
10. What is the default stream buffer size for files? For videos?

**Practical**

11. Create a Buffer from the string `"ab"` and log it.
12. What does `.toJSON()` return on a Buffer created from `"ab"`?
13. Why does `Buffer.from("ab").write("hello")` only write `"he"`?
14. How do you convert a Buffer to a human-readable string?
15. What is the output?
    ```js
    let b = Buffer.from("hello");
    console.log(b.length);
    ```
16. What is the output?
    ```js
    let b = Buffer.alloc(3);
    console.log(b);
    ```

---

## 11. Sync vs Async — Theory

1. What does "blocking" mean in the context of Node.js?
2. What does "non-blocking" mean?
3. Why should you always use async methods in a production server?
4. When is it acceptable to use synchronous `fs` methods?
5. What happens if you use `readFileSync` in a server handling 1000 concurrent requests?
6. What does "offloading I/O" mean in Node.js?
7. How does async code allow Node.js to be fast despite being single-threaded?

---

## 12. Callbacks, Promises & async/await

**Theory**

1. What are the 3 ways to handle async operations in Node.js?
2. What is a callback function?
3. What is a Promise? What states can it be in?
4. What is `async/await` and how does it relate to Promises?
5. What are the advantages of `async/await` over callbacks?
6. How do you import `fs/promises` using ESM? Using CommonJS?
7. Does `fs/promises.readFile()` return a Buffer or a string by default?
8. What does `await` do to a Promise?

**Practical**

9. Write the same file-read operation using all 3 patterns (callback, promise, async/await).
10. How do you handle errors in async/await code?
11. Convert this callback code to async/await:
    ```js
    fs.readFile("./data.txt", "utf-8", (err, data) => {
      if (err) return console.log(err);
      console.log(data);
    });
    ```
12. Can you use `await` outside of an `async` function?

---

## 13. Callback Hell

**Theory**

1. What is callback hell? Why does it happen?
2. Why is callback hell a problem? Name at least 3 issues.
3. What are 2 ways to avoid callback hell?
4. Does using Promises eliminate all nesting? What is Promise Hell?

**Practical**

5. What is wrong with this code structurally?
   ```js
   fs.writeFile("./a.txt", "data", (err) => {
     fs.appendFile("./a.txt", " more", (err) => {
       fs.appendFile("./a.txt", " even more", (err) => {
         console.log("done");
       });
     });
   });
   ```
6. Rewrite the above using async/await.

---

## 14. libuv & Node.js Internals

**Theory**

1. What is libuv? Why is it needed?
2. What language is libuv written in?
3. How many threads does a Node.js process have in total? What does each do?
4. What is the libuv thread pool? What is its default size?
5. How do you change the thread pool size?
6. What types of operations does libuv handle?
7. What happens when you call `fs.readFile()`? Trace the full journey step by step.
8. What is the difference between concurrency and parallelism in the context of Node.js?
9. What is the main thread responsible for?
10. When does Node delegate work to the system kernel vs the libuv thread pool?
11. What are the garbage collection threads responsible for?
12. Can the libuv thread pool handle truly parallel operations?

---

## 15. Event Loop & Queues

**Theory**

1. What is the Event Loop in Node.js?
2. Name all 6 queues in Node.js and their priority order (highest to lowest).
3. What is the difference between the microtask queue and the timer queue?
4. What does `process.nextTick()` do? What queue does its callback go into?
5. What is `setImmediate()`? What queue does it use?
6. What is the poll phase? Is it a queue?
7. What queue do `fs.readFile()` callbacks go into?

**Output Prediction**

8. What is the output?
   ```js
   console.log("1");
   setTimeout(() => console.log("setTimeout"), 0);
   setImmediate(() => console.log("setImmediate"));
   Promise.resolve().then(() => console.log("Promise"));
   process.nextTick(() => console.log("nextTick"));
   console.log("2");
   ```
9. Why does `nextTick` run before the Promise callback?
10. Is it guaranteed that `setTimeout(fn, 0)` runs before `setImmediate(fn)`? Why or why not?

---

## 16. Streams — Theory

1. What is a stream in Node.js?
2. What problem do streams solve compared to reading entire files at once?
3. Name the 4 types of streams and give a use case for each.
4. What is a Readable stream? Give an example.
5. What is a Writable stream? Give an example.
6. What is a Duplex stream? Give an example.
7. What is a Transform stream? How is it different from Duplex?
8. What is the default buffer size for file streams? For video streams?
9. What is `highWaterMark`? How do you use it?
10. What events does a Readable stream emit?
11. What is backpressure in streams?
12. How do streams enable processing files larger than your available RAM?
13. Why are streams faster than reading the full file synchronously for large files?
14. What is the `pipe()` method? What does it do automatically?

---

## 17. Streams — Practical

1. Write code to create a readable stream from `./file.txt` with a 100-byte buffer.
2. Write the event listeners needed to fully process a readable stream.
3. Write code to create a writable stream and write two chunks to `./output.txt`.
4. How do you close a writable stream? What event fires after it's closed?
5. Write a file copy operation using readable + writable streams manually.
6. Rewrite the above file copy using `pipe()`.
7. Write code to compress a file using streams and `zlib.createGzip()`.
8. Write code to show upload progress (percentage) while reading a file.
9. How do you create a custom transform stream that converts text to uppercase?
10. What happens if you don't call `writeStream.end()`?

---

## 18. Output Prediction Questions

Predict the output of each:

**Q1**

```js
console.log(1);
fs.writeFile("./demo.txt", "data", (err) => {
  console.log("file created");
});
console.log(2);
console.log(3);
```

**Q2**

```js
console.log(1);
fs.writeFileSync("./demo.txt", "data");
console.log("file created");
console.log(2);
```

**Q3**

```js
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("end");
```

**Q4**

```js
async function run() {
  await fsP.writeFile("./a.txt", "hello");
  console.log("1");
  await fsP.appendFile("./a.txt", " world");
  console.log("2");
}
run();
console.log("outside");
```

**Q5**

```js
let b = Buffer.from("hello");
b.write("XY");
console.log(b.toString());
```

**Q6**

```js
let readStream = fs.createReadStream("./small.txt", {
  highWaterMark: 5,
});
readStream.on("data", (chunk) => console.log(chunk.length));
```

_(Assume file is 13 bytes)_

**Q7**

```js
console.log("A");
process.nextTick(() => console.log("B"));
setImmediate(() => console.log("C"));
Promise.resolve().then(() => console.log("D"));
console.log("E");
```

---

## 19. Scenario / Problem-Solving Questions

1. **Your server handles 10,000 requests/second. Each request reads a small config file. Using `readFileSync`, the server becomes slow. Why? What's the fix?**

2. **A user uploads a 4GB video file. How do you handle this without crashing the server due to memory?**

3. **You need to copy a 500MB log file and compress it in one pipeline. Write the code using streams.**

4. **You need to do 3 file operations in sequence: create, append, then read. Write this using async/await. What happens if you don't use `await`?**

5. **Your Node.js app is running slow under load. You suspect it's the file I/O. What would you change — sync to async, or callbacks to streams? Explain your reasoning.**

6. **A colleague exported a function like this: `module.exports = getData()`. What is the bug and what actually gets exported?**

7. **You have a 100MB JSON file. Your teammate suggests using `readFileSync` to parse it. What do you recommend instead and why?**

8. **Explain why two users can simultaneously stream large files from a Node.js server without the server running out of memory.**

9. **You need to track how many bytes have been read from a stream. How would you implement this?**

10. **Your ESM import fails with "Cannot find module". What are 3 possible reasons?**

11. **A junior dev has this code in a production Express server:**

    ```js
    app.get("/data", (req, res) => {
      let data = fs.readFileSync("./huge-file.json", "utf-8");
      res.send(data);
    });
    ```

    What's wrong? How do you fix it?

12. **You need to increase the libuv thread pool because your app does heavy file I/O. How do you do it?**

---

## 20. Parameters vs Arguments

**Theory**

1. What is the difference between a parameter and an argument?
2. When are parameters defined? When are arguments passed?

**Practical**

3. In the following, identify the parameters and the arguments:

   ```js
   function multiply(x, y) {
     return x * y;
   }
   multiply(4, 5);
   ```

4. Can a function have parameters but be called with no arguments in JavaScript?

5. What is the `arguments` object in a regular function?

---

## ⭐ Top 10 Must-Know Interview Answers

### 1. How does Node.js handle async operations?

> Node.js uses libuv (a C library) to handle async I/O. When you call `fs.readFile()`, the main thread delegates the work to the system kernel or libuv's thread pool (4 threads by default). The main thread never waits — it continues executing. When the operation completes, the callback goes into the I/O queue, and the event loop picks it up when the call stack is empty.

### 2. What is the difference between CommonJS and ES Modules?

> CommonJS uses `module.exports` and `require()`, is the Node default, doesn't require file extensions, and is synchronous. ESM uses `export` and `import`, requires `"type":"module"` or `.mjs`, needs file extensions, supports top-level `await`, and uses `import.meta.dirname` instead of `__dirname`.

### 3. Why use async instead of sync for file operations?

> Sync methods block the entire event loop. If reading a file takes 2 seconds, no other request can be processed in that time. Async methods offload I/O to libuv, keeping the event loop free. This is why Node.js can handle thousands of concurrent requests despite being single-threaded.

### 4. What are streams and why are they important?

> Streams process data chunk-by-chunk (default: 64KB) instead of loading everything into memory at once. A 1GB file read with `readFileSync` occupies 1GB of RAM; with streams, only 64KB is ever in RAM. This makes streams essential for large files, real-time data, and scalable applications.

### 5. What is a Buffer?

> A Buffer is a fixed-size, temporary storage area in RAM that holds raw binary data. It cannot grow or shrink after creation. Streams use buffers internally to hold each chunk before processing. Buffers display data in hexadecimal when logged.

### 6. Explain the Event Loop and its 6 queues.

> The event loop manages async callbacks using 6 queues in priority order: (1) nextTick microtask, (2) Promise microtask, (3) Timer queue (`setTimeout`/`setInterval`), (4) I/O queue (file, network), (5) Check queue (`setImmediate`), (6) Close callbacks.

### 7. What is callback hell and how do you avoid it?

> Callback hell is deeply nested callbacks from sequential async operations, making code hard to read and maintain. It's avoided using Promises (`.then()/.catch()`) or preferably `async/await` with `try/catch`, which gives flat, readable, synchronous-looking code.

### 8. What is `pipe()` and why use it?

> `pipe()` connects a readable stream directly to a writable stream. It automatically handles reading chunks, writing them, managing backpressure, and closing streams. It's cleaner than manually handling all stream events.

### 9. Is Node.js single-threaded?

> JavaScript execution in Node.js is single-threaded (the main thread). But Node.js itself uses 7 threads total: 1 main thread, 4 libuv worker threads for I/O, and 2 garbage collection threads. This is why Node can handle concurrent I/O despite JS being single-threaded.

### 10. What is the difference between named and default exports?

> A file can have unlimited named exports (imported with `{}` and must use exact names) but only one default export (imported without `{}` and can use any name). Example: `import greet, { sum, arr } from './file.js'` — `greet` is the default, `sum` and `arr` are named.

---

_Good luck with your interviews! 🚀_
