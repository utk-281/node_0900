console.log("hi");

//! module wrapper --> commonJS >> nodeJs
//? module wrapper is an IIFE (immediately invoked function expression)
((exports, require, module, __filename, __dirname) => {
  console.log("hi");
})();

//? parameters(passed during declaration) and arguments(invoking)

// console.log(module);
// console.log(require);

console.log(__filename);
console.log(__dirname);

//! global variables or functions -> these are used without any import statement
