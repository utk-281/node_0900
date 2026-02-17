//! syntax to import modules in commonJS
//? let greet = require("path of the file")

// const value = require("./file1");

// console.log(value);
// value.greet();
// value.printSomething();
// console.log(value.user);

//! syntax to import modules in commonJS
//? let {key1, key2,....} = require("path of the file"). in commonJS writing extension in path is not required
let { greet, user, printSomething } = require("./file1.js");

greet();
printSomething();
console.log(user);
