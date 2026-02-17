function greet() {
  console.log("hello world");
}

let user = {
  name: "varun",
  age: "34",
  id: 123,
};

function printSomething() {
  console.log("something");
}

//! commonJS --> export: module.exports
//! commonJS --> import: require()

//! syntax to export in commonJS
//? module.exports = variableName (this will work only when we are exporting one function or variable)

//? module.exports = greet()  X this is wrong

// module.exports = greet;
// module.exports = user;
// module.exports = printSomething;

//! syntax to export in commonJS
//? module.exports = {
// variableName1,
// variableName2,
// variableName3,
// .....
//? }

module.exports = {
  greet,
  user,
  printSomething,
};

// let age = 34;
// let name = "varun";

// let emp = {
//   name,
//   age,
// };
// console.log("emp: ", emp);
// let emp2 = {
//   name: name,
//   age: age,
// };
// console.log("emp2: ", emp2);
