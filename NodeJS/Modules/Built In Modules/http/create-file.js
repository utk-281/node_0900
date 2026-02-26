import fs from "fs";

let buffer = Buffer.alloc(500000000, 0);

fs.appendFileSync("./small-text.txt", buffer);

console.log("done");
