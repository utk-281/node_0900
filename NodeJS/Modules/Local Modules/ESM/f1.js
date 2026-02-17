import greet, { arr, sum } from "./f2.js";

console.log(sum(1, 2));
console.log(arr);
//? named export are always destructured while importing

greet();

//? default exports are imported normally

//~ in ESM, while importing using extension is required

console.log(import.meta.filename);
console.log(import.meta.dirname);
