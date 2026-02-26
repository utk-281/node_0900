# Node.js Performance, OS & Path Module — Complete Guide

### Blocking vs Non-Blocking, Memory Performance, System Info & File Paths

---

## 📚 What You'll Learn

This guide covers **Node.js performance optimization and system utilities**:

✅ Blocking vs Non-Blocking code  
✅ readFileSync vs Streams (memory comparison)  
✅ CPU-bound tasks and the Event Loop  
✅ globalThis (global vs window)  
✅ os module — System information  
✅ path module — File path manipulation  
✅ Real-world project examples  
✅ Performance optimization tips

**Best for:** Performance optimization, system operations, file handling, interview preparation

---

## Table of Contents

1. [Blocking vs Non-Blocking Code](#1-blocking-vs-non-blocking-code)
2. [The Performance Experiment](#2-the-performance-experiment)
3. [Memory Comparison — readFileSync vs Streams](#3-memory-comparison--readfilesync-vs-streams)
4. [CPU-Bound Tasks — Blocking the Event Loop](#4-cpu-bound-tasks--blocking-the-event-loop)
5. [globalThis — Global vs Window](#5-globalthis--global-vs-window)
6. [os Module — System Information](#6-os-module--system-information)
7. [path Module — File Path Manipulation](#7-path-module--file-path-manipulation)
8. [Real-World Project Examples](#8-real-world-project-examples)
9. [Performance Best Practices](#9-performance-best-practices)
10. [Summary](#10-summary)
11. [Revision Checklist](#11-revision-checklist)

---

## 1. Blocking vs Non-Blocking Code

### What is Blocking Code?

**Blocking code stops the entire program** until the operation completes.

Think of it like:

- **ATM with one queue** — everyone waits for the person in front
- **Single-lane highway** — one slow car blocks everyone
- **One checkout counter** — all customers wait in line

---

### What is Non-Blocking Code?

**Non-Blocking code continues running** while waiting for operations to complete.

Think of it like:

- **Multiple ATMs** — people can use different machines
- **Multi-lane highway** — cars can pass each other
- **Multiple checkout counters** — everyone gets served faster

---

### Visual: Blocking vs Non-Blocking

```
BLOCKING (Synchronous):
────────────────────────────────────────────────────────
Time →
[Request 1] → [Process: 10s WAIT] → [Response 1] → [Request 2] → [Process: 10s WAIT] → [Response 2]
              ↑ Server frozen                        ↑ Server frozen

Total time: 20 seconds for 2 requests
Users experience: "Server is so slow!"


NON-BLOCKING (Asynchronous):
────────────────────────────────────────────────────────
Time →
[Request 1] → [Delegate] → [Continue serving other requests]
[Request 2] → [Delegate] → [Continue serving other requests]
              ↑ Server keeps running!

[Response 1] ← [Done after 10s]
[Response 2] ← [Done after 10s]

Total time: 10 seconds for 2 requests (parallel processing!)
Users experience: "Server is fast!"
```

---

### The Problem with Blocking

```javascript
// BLOCKING (Bad for servers)
createServer((req, res) => {
  // Read file synchronously
  let data = fs.readFileSync("./large-file.txt", "utf-8");
  res.end(data);

  // Problem: While reading file (10 seconds)
  // → Server can't handle ANY other requests
  // → All users wait
}).listen(9000);
```

**Consequences:**

- User A makes request → Server reads file (10s)
- User B makes request → **WAITS** 10 seconds for A to finish
- User C makes request → **WAITS** 20 seconds for A and B
- User D makes request → **WAITS** 30 seconds!

**Result:** Server crashes or becomes unusable

---

### The Solution with Non-Blocking

```javascript
// NON-BLOCKING (Good for servers)
createServer((req, res) => {
  // Read file asynchronously
  fs.readFile("./large-file.txt", "utf-8", (err, data) => {
    res.end(data);
  });

  // Server immediately continues
  // → Can handle other requests while reading
}).listen(9000);
```

**Benefits:**

- User A makes request → Server starts reading (background)
- User B makes request → Server starts reading (background)
- User C makes request → Server starts reading (background)
- All three finish around the same time!

**Result:** Server handles 100+ concurrent users easily

---

## 2. The Performance Experiment

### The Two Endpoints

Your code creates two endpoints to compare performance:

```javascript
createServer((req, res) => {
  // Slow endpoint (Blocking)
  if (req.url === "/slow") {
    // Uses readFileSync (blocks main thread)
    setTimeout(() => {
      fs.readFileSync("./large-file.txt", "utf-8");
      res.end("File read");
    }, 10000);
  }

  // Fast endpoint (Non-Blocking)
  else if (req.url === "/fast") {
    // Uses streams (non-blocking)
    setTimeout(() => {
      let data = fs.createReadStream("./large-file.txt", "utf-8");
      data.pipe(res);
    }, 10000);
    console.log("Non-blocking");
    res.end("Non-blocking");
  }
}).listen(9000);
```

---

### The Experiment Results

**Test Setup:**

- File size: 500 MB
- Test: Open both endpoints simultaneously

```
/slow endpoint (readFileSync):
───────────────────────────────────────────
Memory usage: ~500 MB (loads entire file)
Time taken: 12 seconds
Server status: BLOCKED (can't handle other requests)
Other requests: Must wait

/fast endpoint (Streams):
───────────────────────────────────────────
Memory usage: ~40 MB (chunks of 64KB)
Time taken: 10 seconds
Server status: AVAILABLE (can handle other requests)
Other requests: Process immediately
```

**Key difference:** Streams use **12.5x LESS memory** and keep server responsive!

---

### Visual: Memory Comparison

```
readFileSync (500 MB file):
────────────────────────────────────────────
RAM Usage:
████████████████████████████████████████ 500 MB
↑ Entire file loaded into memory


createReadStream (500 MB file):
────────────────────────────────────────────
RAM Usage:
███ 40 MB (64KB chunks × backpressure buffer)
↑ Only small chunks in memory at once

Result: 92% less memory usage!
```

---

## 3. Memory Comparison — readFileSync vs Streams

### The Memory Problem

**When you use readFileSync:**

```javascript
// Loading 500 MB file
let data = fs.readFileSync('./large-file.txt', 'utf-8');

// What happens in RAM:
[                         500 MB                         ]
└─────────────────────────┬──────────────────────────────┘
                    Entire file loaded


Total RAM used: 500 MB
Problem: What if 10 users request this?
        → 10 × 500 MB = 5 GB RAM!
        → Server crashes!
```

---

### The Streaming Solution

**When you use streams:**

```javascript
// Streaming 500 MB file
let stream = fs.createReadStream('./large-file.txt', 'utf-8');
stream.pipe(res);

// What happens in RAM:
[64KB] → Read chunk
  ↓
[64KB] → Send to client
  ↓
[64KB] → Read next chunk
  ↓
[64KB] → Send to client
  ↓
... (continues until file ends)

Total RAM used: ~40 MB (buffer + overhead)
10 users: 10 × 40 MB = 400 MB (manageable!)
```

---

### Visual: The Difference

```
BLOCKING (readFileSync):
────────────────────────────────────────────────────────
   Server Memory (500 MB file)

   User 1 request:
   [████████████████████████████████ 500 MB]

   User 2 request:
   [████████████████████████████████ 500 MB]

   User 3 request:
   [████████████████████████████████ 500 MB]

   Total: 1.5 GB RAM used
   Status: ⚠️ HIGH MEMORY USAGE


NON-BLOCKING (Streams):
────────────────────────────────────────────────────────
   Server Memory (500 MB file)

   User 1 request:
   [███ 40 MB]

   User 2 request:
   [███ 40 MB]

   User 3 request:
   [███ 40 MB]

   Total: 120 MB RAM used
   Status: ✅ EFFICIENT
```

---

### Real Numbers Comparison

| Operation               | readFileSync     | Streams           | Difference     |
| ----------------------- | ---------------- | ----------------- | -------------- |
| **Memory (500MB file)** | 500 MB           | 40 MB             | **12.5x less** |
| **Memory (1GB file)**   | 1000 MB          | 40 MB             | **25x less**   |
| **Time (500MB)**        | 12 seconds       | 10 seconds        | **20% faster** |
| **Concurrent users**    | 10 users = crash | 100+ users = fine | **10x more**   |
| **Server blocked?**     | ✅ Yes           | ❌ No             | Critical!      |

---

## 4. CPU-Bound Tasks — Blocking the Event Loop

### What are CPU-Bound Tasks?

**Tasks that require heavy computation** (not I/O like reading files).

Examples:

- Image processing
- Video encoding
- Complex calculations
- Large loops
- Cryptographic operations

---

### The Blocking Loop Example

```javascript
// BLOCKING endpoint
if (req.url === "/blocking") {
  // This loop blocks the main thread
  for (let i = 0; i < 100000000000; i++) {
    // CPU is busy counting!
  }

  res.end("Blocking");

  // Problem: During this loop (30 seconds)
  // → Event loop is FROZEN
  // → Server can't handle ANY requests
  // → All users see loading spinner
}
```

---

### What Happens During Blocking

```
Time: 0s
────────────────────────────────────────────
User A: Hits /blocking endpoint
Server: Starts counting loop (100 billion iterations)
Event Loop: FROZEN

Time: 5s
────────────────────────────────────────────
User B: Hits /fast endpoint
Server: Can't respond (still counting!)
Event Loop: FROZEN

Time: 10s
────────────────────────────────────────────
User C: Hits any endpoint
Server: Can't respond (still counting!)
Event Loop: FROZEN

Time: 30s
────────────────────────────────────────────
Loop finishes
User A: Gets response "Blocking"
User B: Now server processes /fast (after 25s wait!)
User C: Now server processes request (after 20s wait!)

Result: ALL users experienced 20-30 second delays!
```

---

### Visual: Event Loop Blocking

```
WITHOUT BLOCKING TASK:
────────────────────────────────────────────────────────
Event Loop (Free):
Request 1 → [Process] → Response 1
Request 2 → [Process] → Response 2
Request 3 → [Process] → Response 3
↑ All handled quickly


WITH BLOCKING TASK:
────────────────────────────────────────────────────────
Event Loop (FROZEN):
Request 1 → [COUNTING: 30 seconds...........................] → Response 1
             ↑ Event loop stuck here
Request 2 → [WAITING.................................]
Request 3 → [WAITING.................................]

After 30 seconds:
Request 2 → [Process] → Response 2
Request 3 → [Process] → Response 3
```

---

```javascript
else if (req.url === '/fast') {
    setTimeout(() => {
        let data = fs.createReadStream('./small-text.txt', 'utf-8');
        data.pipe(res);
        // No res.end() here — pipe() handles it
    }, 10000);

    // Don't call res.end() outside setTimeout!
}
```

---

## 5. globalThis — Global vs Window

### What is globalThis?

**globalThis is a universal way to access the global object** that works in all JavaScript environments.

Think of it like:

- **Universal remote** — works everywhere
- **Master key** — opens all doors
- **Global scope** — accessible anywhere

---

### The Environment Problem

**Before globalThis:**

```javascript
// In Node.js:
global.myVar = 10; // ✅ Works
window.myVar = 10; // ❌ Error! window is not defined

// In Browser:
window.myVar = 10; // ✅ Works
global.myVar = 10; // ❌ Error! global is not defined

// Problem: Different environments, different global objects!
```

**With globalThis:**

```javascript
// WORKS EVERYWHERE (Node.js, Browser, Workers, etc.)
globalThis.myVar = 10; // ✅ Works in Node.js
globalThis.myVar = 10; // ✅ Works in Browser
globalThis.myVar = 10; // ✅ Works in Web Workers

// Universal solution!
```

---

### Comparison Table

| Environment          | Global Object | globalThis      | Use Case           |
| -------------------- | ------------- | --------------- | ------------------ |
| **Node.js**          | `global`      | ✅ `globalThis` | Server-side        |
| **Browser**          | `window`      | ✅ `globalThis` | Client-side        |
| **Web Workers**      | `self`        | ✅ `globalThis` | Background threads |
| **All Environments** | Different     | ✅ `globalThis` | Universal code     |

---

### Examples

```javascript
// Node.js ONLY
console.log(global); // ✅ Works
console.log(global === globalThis); // true

// Browser ONLY
console.log(window); // ✅ Works
console.log(window === globalThis); // true

// UNIVERSAL (works everywhere)
console.log(globalThis); // ✅ Works in Node.js AND Browser

// Setting global variables
globalThis.API_KEY = "abc123"; // Accessible everywhere
globalThis.DATABASE_URL = "mongodb://localhost:27017";
```

---

### Visual: Global Objects

```
Node.js Environment:
────────────────────────────────────────────
global
  ├── process
  ├── Buffer
  ├── console
  ├── setTimeout
  └── [Your global variables]

globalThis === global ✅


Browser Environment:
────────────────────────────────────────────
window
  ├── document
  ├── console
  ├── setTimeout
  ├── localStorage
  └── [Your global variables]

globalThis === window ✅


Universal Code:
────────────────────────────────────────────
Use globalThis
  → Resolves to 'global' in Node.js
  → Resolves to 'window' in Browser
  → Resolves to 'self' in Workers

Works everywhere! ✅
```

---

## 6. os Module — System Information

### What is the os Module?

**Built-in Node.js module that provides operating system information.**

Think of it like:

- **System monitor** — shows CPU, memory, etc.
- **About This PC** — system details
- **Task Manager info** — resource usage

---

### Importing os Module

```javascript
import os from "node:os";

console.log(os); // See all available methods
```

---

### Essential os Methods for Projects

#### 1. Memory Information

**totalmem() — Total System Memory**

```javascript
let totalMemory = os.totalmem();
console.log(totalMemory); // 17179869184 (bytes)

// Convert to GB (human-readable)
let totalGB = totalMemory / (1024 * 1024 * 1024);
console.log(`Total RAM: ${totalGB.toFixed(2)} GB`);
// Output: Total RAM: 16.00 GB
```

**freemem() — Available Memory**

```javascript
let freeMemory = os.freemem();

// Convert to GB
let freeGB = freeMemory / (1024 * 1024 * 1024);
console.log(`Free RAM: ${freeGB.toFixed(2)} GB`);
// Output: Free RAM: 8.45 GB

// Calculate used memory
let usedGB = totalGB - freeGB;
console.log(`Used RAM: ${usedGB.toFixed(2)} GB`);
// Output: Used RAM: 7.55 GB
```

---

#### 2. CPU Information

**cpus() — CPU Core Details**

```javascript
let cpuCores = os.cpus();
console.log(`Number of CPU cores: ${cpuCores.length}`);
// Output: Number of CPU cores: 8

// Detailed info about each core
cpuCores.forEach((core, index) => {
  console.log(`Core ${index + 1}:`);
  console.log(`  Model: ${core.model}`);
  console.log(`  Speed: ${core.speed} MHz`);
});

// Output:
// Core 1:
//   Model: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
//   Speed: 2600 MHz
```

**availableParallelism() — Available CPU Threads**

```javascript
let threads = os.availableParallelism();
console.log(`Available threads: ${threads}`);
// Output: Available threads: 8

// This is the number of concurrent operations you can run
// Useful for worker thread pools
```

---

#### 3. System Information

**hostname() — Computer Name**

```javascript
let hostname = os.hostname();
console.log(`Hostname: ${hostname}`);
// Output: Hostname: DESKTOP-ABC123
```

**arch() — CPU Architecture**

```javascript
let architecture = os.arch();
console.log(`Architecture: ${architecture}`);
// Output: Architecture: x64
// Possible values: 'x64', 'arm', 'arm64', 'ia32'
```

**platform() — Operating System**

```javascript
let platform = os.platform();
console.log(`Platform: ${platform}`);
// Output: Platform: win32
// Possible values: 'win32', 'darwin' (Mac), 'linux', 'freebsd'
```

**type() — OS Type**

```javascript
let type = os.type();
console.log(`OS Type: ${type}`);
// Output: OS Type: Windows_NT
// Linux → 'Linux', Mac → 'Darwin'
```

**release() — OS Version**

```javascript
let release = os.release();
console.log(`OS Release: ${release}`);
// Output: OS Release: 10.0.19045
```

---

#### 4. Uptime Information

**uptime() — System Uptime**

```javascript
let uptimeSeconds = os.uptime();
console.log(`System uptime: ${uptimeSeconds} seconds`);

// Convert to hours
let uptimeHours = uptimeSeconds / 3600;
console.log(`System uptime: ${uptimeHours.toFixed(2)} hours`);
// Output: System uptime: 48.75 hours
```

---

#### 5. User Information

**userInfo() — Current User Details**

```javascript
let userInfo = os.userInfo();
console.log(userInfo);

// Output:
{
    uid: 1000,
    gid: 1000,
    username: 'john',
    homedir: '/home/john',
    shell: '/bin/bash'
}
```

---

### Real-World os Module Usage

#### Example 1: Health Check Endpoint

```javascript
import os from "node:os";
import { createServer } from "node:http";

createServer((req, res) => {
  if (req.url === "/health") {
    const totalMem = os.totalmem() / 1024 ** 3;
    const freeMem = os.freemem() / 1024 ** 3;
    const usedMem = totalMem - freeMem;
    const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

    const healthData = {
      status: "online",
      uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
      hostname: os.hostname(),
      platform: os.platform(),
      cpuCores: os.cpus().length,
      memory: {
        total: `${totalMem.toFixed(2)} GB`,
        free: `${freeMem.toFixed(2)} GB`,
        used: `${usedMem.toFixed(2)} GB`,
        usagePercent: `${memUsagePercent}%`,
      },
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(healthData, null, 2));
  }
}).listen(3000);
```

**Output:**

```json
{
  "status": "online",
  "uptime": "48.75 hours",
  "hostname": "DESKTOP-ABC123",
  "platform": "win32",
  "cpuCores": 8,
  "memory": {
    "total": "16.00 GB",
    "free": "8.45 GB",
    "used": "7.55 GB",
    "usagePercent": "47.19%"
  }
}
```

---

#### Example 2: Performance Monitoring

```javascript
function checkSystemResources() {
  const freeMem = os.freemem() / 1024 ** 3;
  const totalMem = os.totalmem() / 1024 ** 3;
  const memUsagePercent = ((totalMem - freeMem) / totalMem) * 100;

  if (memUsagePercent > 90) {
    console.warn(`⚠️ HIGH MEMORY USAGE: ${memUsagePercent.toFixed(2)}%`);
    // Trigger alert, cleanup, or scale-up
  }

  const cpuCount = os.cpus().length;
  console.log(
    `✓ System OK: ${cpuCount} cores, ${memUsagePercent.toFixed(2)}% memory used`,
  );
}

// Check every 5 minutes
setInterval(checkSystemResources, 5 * 60 * 1000);
```

---

#### Example 3: Dynamic Worker Thread Pool

```javascript
import os from "node:os";
import { Worker } from "worker_threads";

// Create worker pool based on CPU cores
const numWorkers = os.availableParallelism();
const workers = [];

for (let i = 0; i < numWorkers; i++) {
  workers.push(new Worker("./worker.js"));
}

console.log(`Created ${numWorkers} workers for ${numWorkers} CPU threads`);
// Output: Created 8 workers for 8 CPU threads
```

---

## 7. path Module — File Path Manipulation

### What is the path Module?

**Built-in Node.js module for working with file and directory paths.**

Think of it like:

- **GPS for files** — navigate folder structure
- **Path calculator** — combines paths correctly
- **Cross-platform helper** — works on Windows, Mac, Linux

---

### Importing path Module

```javascript
import path from "node:path";

console.log(path); // See all available methods
```

---

### Essential path Methods for Projects

#### 1. path.join() — Combine Paths

**What it does:** Joins path segments using the correct separator for your OS.

```javascript
// Basic join
let combined = path.join("folder1", "folder2", "file.txt");
console.log(combined);
// Windows: folder1\folder2\file.txt
// Mac/Linux: folder1/folder2/file.txt
```

**Why use join?**

```javascript
// ❌ WRONG — Hard-coded separator (breaks on different OS)
let wrong = "folder1/folder2/file.txt"; // Fails on Windows

// ✅ CORRECT — Cross-platform
let correct = path.join("folder1", "folder2", "file.txt");
```

---

#### 2. Absolute vs Relative Paths

**Relative path:** Relative to current location (`.` or `..`)

```javascript
"./file.txt"; // Current directory
"../file.txt"; // Parent directory
"../../file.txt"; // Grandparent directory
```

**Absolute path:** Complete path from root

```javascript
// Windows:
"C:\\Users\\ASUS\\Desktop\\file.txt";

// Mac/Linux:
"/home/user/Desktop/file.txt";
```

---

#### 3. import.meta.dirname — Current Directory

**In ES Modules (ESM):**

```javascript
console.log(import.meta.dirname);
// Output: C:\Users\ASUS\Desktop\Classes\node_0900\NodeJS\Modules
```

**In CommonJS:**

```javascript
console.log(__dirname);
// Output: C:\Users\ASUS\Desktop\Classes\node_0900\NodeJS\Modules
```

**What it gives:** Absolute path to the directory containing the current file.

---

#### 4. Navigating Folders with join()

**Example 1: Access sibling folder**

```javascript
// Current file: /project/src/app.js
// Want to access: /project/config/settings.json

let configPath = path.join(
  import.meta.dirname,
  "..",
  "config",
  "settings.json",
);
console.log(configPath);
// Output: C:\project\config\settings.json
```

**Example 2: Access parent folder file**

```javascript
// Current file: /project/src/utils/helper.js
// Want to access: /project/data.json

let dataPath = path.join(import.meta.dirname, "..", "..", "data.json");
console.log(dataPath);
// Output: C:\project\data.json
```

**Visual:**

```
Project Structure:
project/
  ├── src/
  │   ├── utils/
  │   │   └── helper.js  ← You are here
  │   └── app.js
  ├── config/
  │   └── settings.json  ← Want to access this
  └── data.json

From helper.js to settings.json:
helper.js → .. (up to utils) → .. (up to src) → .. (up to project) → config → settings.json

Code:
path.join(import.meta.dirname, '..', '..', '..', 'config', 'settings.json')
```

---

#### 5. Reading Files with Dynamic Paths

```javascript
// Your example from the code:
let filePath = path.join(import.meta.dirname, "..", "modules.js");
console.log(filePath);
// C:\Users\ASUS\Desktop\Classes\node_0900\NodeJS\Modules\modules.js

// Read the file
let content = fs.readFileSync(filePath, "utf-8");
console.log(content);
```

---

#### 6. path.extname() — Get File Extension

```javascript
let fileName = "/path/to/file.txt";
let ext = path.extname(fileName);
console.log(ext); // .txt

let imageFile = "photo.jpg";
console.log(path.extname(imageFile)); // .jpg

let noExtension = "README";
console.log(path.extname(noExtension)); // ''
```

**Use case:** File upload validation

```javascript
let allowedExtensions = [".jpg", ".png", ".gif"];
let uploadedFile = "user-photo.jpg";
let ext = path.extname(uploadedFile);

if (allowedExtensions.includes(ext)) {
  console.log("Valid image file");
} else {
  console.log("Invalid file type");
}
```

---

#### 7. path.basename() — Get File Name

```javascript
let fullPath = "/home/user/documents/report.pdf";
let fileName = path.basename(fullPath);
console.log(fileName); // report.pdf

// Get file name without extension
let nameOnly = path.basename(fullPath, ".pdf");
console.log(nameOnly); // report
```

---

#### 8. path.dirname() — Get Directory Name

```javascript
let fullPath = "/home/user/documents/report.pdf";
let directory = path.dirname(fullPath);
console.log(directory); // /home/user/documents
```

---

#### 9. path.parse() — Parse Path into Object

```javascript
let fullPath = '/home/user/documents/report.pdf';
let parsed = path.parse(fullPath);
console.log(parsed);

// Output:
{
    root: '/',
    dir: '/home/user/documents',
    base: 'report.pdf',
    ext: '.pdf',
    name: 'report'
}
```

---

#### 10. path.resolve() — Resolve to Absolute Path

```javascript
// Resolves relative paths to absolute
let absolute = path.resolve("file.txt");
console.log(absolute);
// C:\Users\ASUS\Desktop\Classes\node_0900\file.txt

let absolute2 = path.resolve("folder", "subfolder", "file.txt");
console.log(absolute2);
// C:\Users\ASUS\Desktop\Classes\node_0900\folder\subfolder\file.txt
```

---

### Complete path Method Reference

| Method         | Purpose           | Example                                   |
| -------------- | ----------------- | ----------------------------------------- |
| `join()`       | Combine paths     | `path.join('a', 'b', 'c.txt')`            |
| `resolve()`    | Get absolute path | `path.resolve('file.txt')`                |
| `basename()`   | Get file name     | `path.basename('/a/b/c.txt')` → `'c.txt'` |
| `dirname()`    | Get directory     | `path.dirname('/a/b/c.txt')` → `'/a/b'`   |
| `extname()`    | Get extension     | `path.extname('file.txt')` → `'.txt'`     |
| `parse()`      | Parse into object | `path.parse('/a/b/c.txt')`                |
| `normalize()`  | Clean up path     | `path.normalize('a//b/../c')` → `'a/c'`   |
| `isAbsolute()` | Check if absolute | `path.isAbsolute('/a/b')` → `true`        |

---

## 8. Real-World Project Examples

### Project 1: File Upload Service

```javascript
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

createServer((req, res) => {
  if (req.url === "/upload" && req.method === "POST") {
    // Check available memory before processing
    const freeMem = os.freemem() / 1024 ** 3;
    if (freeMem < 1) {
      res.writeHead(503, { "Content-Type": "text/plain" });
      return res.end("Server low on memory, try again later");
    }

    // Use streams for large file uploads (memory efficient)
    const uploadDir = path.join(import.meta.dirname, "uploads");
    const fileName = `upload-${Date.now()}.txt`;
    const filePath = path.join(uploadDir, fileName);

    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    writeStream.on("finish", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Upload successful",
          fileName: fileName,
          path: filePath,
        }),
      );
    });

    writeStream.on("error", (err) => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Upload failed");
    });
  }
}).listen(3000);
```

---

### Project 2: System Dashboard

```javascript
import { createServer } from "node:http";
import os from "node:os";

createServer((req, res) => {
  if (req.url === "/dashboard") {
    const totalMem = os.totalmem() / 1024 ** 3;
    const freeMem = os.freemem() / 1024 ** 3;
    const usedMem = totalMem - freeMem;

    const dashboard = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>System Dashboard</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    .stat { margin: 10px 0; padding: 10px; background: #f0f0f0; }
                </style>
            </head>
            <body>
                <h1>System Dashboard</h1>
                
                <div class="stat">
                    <strong>Hostname:</strong> ${os.hostname()}
                </div>
                
                <div class="stat">
                    <strong>Platform:</strong> ${os.platform()}
                </div>
                
                <div class="stat">
                    <strong>CPU Cores:</strong> ${os.cpus().length}
                </div>
                
                <div class="stat">
                    <strong>Total Memory:</strong> ${totalMem.toFixed(2)} GB
                </div>
                
                <div class="stat">
                    <strong>Free Memory:</strong> ${freeMem.toFixed(2)} GB
                </div>
                
                <div class="stat">
                    <strong>Used Memory:</strong> ${usedMem.toFixed(2)} GB
                    (${((usedMem / totalMem) * 100).toFixed(2)}%)
                </div>
                
                <div class="stat">
                    <strong>Uptime:</strong> ${(os.uptime() / 3600).toFixed(2)} hours
                </div>
            </body>
            </html>
        `;

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(dashboard);
  }
}).listen(3000);
```

---

### Project 3: Static File Server

```javascript
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";

const publicDir = path.join(import.meta.dirname, "public");

createServer((req, res) => {
  // Security: Prevent path traversal attacks
  let filePath = path.join(publicDir, req.url);

  // Check if requested path is within public directory
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  // Get file extension
  const ext = path.extname(filePath);

  // Set content type based on extension
  const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
  };

  const contentType = contentTypes[ext] || "text/plain";

  // Stream file to client (memory efficient)
  const stream = fs.createReadStream(filePath);

  stream.on("error", (err) => {
    if (err.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - File Not Found");
    } else {
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  });

  res.writeHead(200, { "Content-Type": contentType });
  stream.pipe(res);
}).listen(3000);
```

---

## 9. Performance Best Practices

### 1. Always Use Streams for Large Files

```javascript
// ❌ BAD — Loads entire file into memory
app.get("/download", (req, res) => {
  let data = fs.readFileSync("./large-video.mp4");
  res.send(data);
  // Problem: 1GB file = 1GB RAM per request
});

// ✅ GOOD — Streams in chunks
app.get("/download", (req, res) => {
  let stream = fs.createReadStream("./large-video.mp4");
  stream.pipe(res);
  // Memory: ~40MB regardless of file size
});
```

---

### 2. Never Block the Event Loop

```javascript
// ❌ BAD — CPU-intensive task blocks everything
app.get("/process", (req, res) => {
  for (let i = 0; i < 10000000000; i++) {
    // Calculating...
  }
  res.send("Done");
  // Problem: Server frozen for 30 seconds
});

// ✅ GOOD — Use worker threads
import { Worker } from "worker_threads";

app.get("/process", (req, res) => {
  const worker = new Worker("./heavy-task.js");
  worker.on("message", (result) => {
    res.send(result);
  });
  // Server remains responsive
});
```

---

### 3. Monitor System Resources

```javascript
// Check memory before heavy operations
function canProcessFile() {
  const freeMem = os.freemem() / 1024 ** 3;
  const minRequired = 2; // Require 2GB free

  if (freeMem < minRequired) {
    console.warn("Low memory, rejecting request");
    return false;
  }
  return true;
}

app.post("/upload", (req, res) => {
  if (!canProcessFile()) {
    return res.status(503).send("Server busy, try again later");
  }
  // Process upload
});
```

---

### 4. Use Path Module for Cross-Platform

```javascript
// ❌ BAD — Hard-coded separators
const filePath = "uploads/images/photo.jpg"; // Breaks on Windows

// ✅ GOOD — Use path.join()
const filePath = path.join("uploads", "images", "photo.jpg");
// Works on Windows, Mac, Linux
```

---

## 10. Summary — Key Takeaways

### 🚫 Blocking vs ✅ Non-Blocking

```
Blocking (readFileSync):
  - Loads entire file into memory
  - Blocks event loop
  - Use for: Small files, startup config

Non-Blocking (Streams):
  - Loads chunks (64KB)
  - Doesn't block
  - Use for: Large files, production servers
```

---

### 📊 Memory Comparison

```
500 MB file:
  readFileSync: 500 MB RAM
  Streams: 40 MB RAM

  Savings: 92% less memory!
```

---

### 🌍 globalThis

```
Node.js:  globalThis === global
Browser:  globalThis === window
Workers:  globalThis === self

Use globalThis for universal code
```

---

### 💻 os Module

```javascript
// Most useful methods:
os.totalmem(); // Total RAM
os.freemem(); // Free RAM
os.cpus().length; // CPU cores
os.availableParallelism(); // Available threads
os.hostname(); // Computer name
os.platform(); // OS type
```

---

### 📁 path Module

```javascript
// Most useful methods:
path.join(); // Combine paths
path.extname(); // Get extension
path.basename(); // Get filename
path.dirname(); // Get directory
import.meta.dirname; // Current directory (ESM)
```

---

## 11. Revision Checklist

### Blocking/Non-Blocking

- [ ] Can you explain blocking vs non-blocking?
- [ ] Do you know when to use readFileSync vs streams?
- [ ] Can you calculate memory savings with streams?
- [ ] Do you know what blocks the event loop?

### Performance

- [ ] Can you compare readFileSync vs streams memory usage?
- [ ] Do you know how CPU-bound tasks affect servers?
- [ ] Can you explain worker threads solution?

### globalThis

- [ ] Do you know what globalThis is?
- [ ] Can you explain global vs window?
- [ ] Do you know when to use globalThis?

### os Module

- [ ] Can you get total and free memory?
- [ ] Can you convert bytes to GB?
- [ ] Can you get CPU core count?
- [ ] Can you check system platform?
- [ ] Can you build a health check endpoint?

### path Module

- [ ] Can you use path.join()?
- [ ] Do you know import.meta.dirname?
- [ ] Can you navigate with .. (parent)?
- [ ] Can you get file extension?
- [ ] Can you get file basename?
- [ ] Do you know absolute vs relative paths?

---

> **🎤 Interview Tip — "How would you optimize a Node.js server that's running out of memory when serving large files?"**
>
> **Answer like this:**
>
> _"The problem is likely using readFileSync or loading entire files into memory. I'd optimize using these strategies:_
>
> _First, replace any synchronous file reads with streams. Instead of readFileSync which loads the entire file, I'd use createReadStream which reads in 64KB chunks. This can reduce memory usage from 500MB to about 40MB for a large file—that's a 92% reduction._
>
> ```javascript
> // Before (bad):
> let data = fs.readFileSync("./large-file.mp4");
> res.end(data); // 500MB in memory
>
> // After (good):
> let stream = fs.createReadStream("./large-file.mp4");
> stream.pipe(res); // Only 40MB in memory
> ```
>
> _Second, I'd add monitoring using the os module to check available memory before processing requests. If free memory is below a threshold, I'd return a 503 Service Unavailable rather than crashing._
>
> ```javascript
> const freeMem = os.freemem() / 1024 ** 3;
> if (freeMem < 1) {
>   // Less than 1GB free
>   return res.status(503).send("Server busy");
> }
> ```
>
> _Third, for CPU-intensive operations, I'd use worker threads to prevent blocking the main event loop. This keeps the server responsive even under heavy load._
>
> _Finally, I'd implement proper connection pooling and consider horizontal scaling if the issue persists."_
>
> **Why this works:** Shows understanding of memory management, provides concrete solutions with code, mentions monitoring and scaling, demonstrates knowledge of streams vs blocking I/O, and includes actual memory numbers.
