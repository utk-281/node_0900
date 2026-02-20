//~ buffer : it is an array like structure which holds the data in binary format
//? we cannot change the size of buffer once defined (but we can define the size at start)
//? buffer will be destroyed once the operation in completed
//? buffer is a space inside memory(RAM) used by nodeJS to perform some operation
//? in case of streams, buffer size is fixed that is 16KB

import { Buffer } from "node:buffer";

let buff1 = Buffer.from("ab"); //! each letter takes 1 byte
console.log("buff1: ", buff1);
console.log(buff1.toJSON());

buff1.write("hello");
console.log(buff1.toString());

console.log(buff1.toJSON());

let buff2 = Buffer.alloc(10);
console.log("buff2: ", buff2);

let buff3 = Buffer.alloc(10, "a");
console.log("buff2: ", buff3);

let buff4 = Buffer.alloc(1000000, "a");
console.log("buff2: ", buff3);

setInterval(() => {
  console.log("hi");
}, 2000);

let buff5 = Buffer.allocUnsafe(10); //? nodejs, (here it may allocate a buffer where some other data mey be present)
