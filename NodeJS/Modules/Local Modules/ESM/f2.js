//! exporting using ESM syntax

export let sum = (a, b) => {
  return a + b;
};

export let arr = [1.2, 3, 4];

let arr2 = [1, 2];

//? export let something  = ......
//? these are called as named export

//! default export only one default export per file
function greet() {
  console.log("hello");
}
export default greet;
