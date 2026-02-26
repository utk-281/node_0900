//? operating system -> it provide utilities to get the information regarding the system (os platform, total memory, uptime, name, arch, etc....)

import fs from "fs";
import os from "node:os";

console.log(os);

console.log(os.totalmem() / (1024 * 1024 * 1024));
console.log(os.freemem() / (1024 * 1024 * 1024));

console.log(os.hostname());
console.log(os.arch());

//! cpus(), availableParallelism() -> number of cores in the system

console.log("cores: ", os.cpus().length);
console.log(os.availableParallelism());

console.log(fs.readFileSync("./demo.txt", "utf-8"));
