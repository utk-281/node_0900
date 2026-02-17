// console.log("3");

// for (let i = 0; i < 10000000000; i++) {}

// console.log("1");
// console.log("2");

//! top to bottom
//! one task at a time
//! synchronous execution --> blocking execution

// console.log("3");

// setTimeout(() => {
//   console.log("st1");
// }, 4000);

// setTimeout(() => {
//   console.log("st1 4secs");
// }, 4000);

// console.log("1");

// setTimeout(() => {
//   console.log("st2");
// }, 2000);

// console.log("2");

// for (let i = 0; i < 100000000; i++) {}

//? loupe.js

// console.log("3");

// setTimeout(() => {
//   for (let i = 0; i < 10000000000; i++) {}
//   console.log("end");
// }, 2000);

// console.log("1");

// console.log("2");

//? promise -> is an object, which represents eventual completion of an async task. to handle promises we have then and catch methods
//~ then is used when the promise is resolved
//~ catch is used when the promise is rejected or any error occurs

// let p1 = new Promise((resolve, reject) => {
//   // logic
//   let a = 20;
//   if (a == 21) {
//     resolve({ name: "abc", age: "20" });
//   } else {
//     reject("Not Found");
//   }
// });

// // console.log("p1: ", p1);

// p1.then((data) => {
//   console.log("data: ", data);
//   console.log("fulfilled");
// })
//   .catch((error) => {
//     console.log("error: ", error);
//     console.log("rejected");
//   })
//   .finally(() => {
//     console.log("finally");
//   });

let apiCall = fetch("https://fakestoreapi.com/products");
console.log("apiCall: ", apiCall);

apiCall
  .then((data) => {
    console.log(data); //? response object
    //? object --> json
    let jsonData = data.json();
    // console.log("jsonData: ", jsonData);
    jsonData
      .then((payload) => {
        console.log(payload);
      })
      .catch(() => {})
      .finally(() => {});
  })
  .catch(() => {})
  .finally(() => {});

// ? async and await are both used together (both are keywords)
// ? async is used in function declaration
// ? await is used inside function body
// ? async function will always returns a promise

// async function apiCall() {
//   let result = await fetch("https://fakestoreapi.com/products");
//   let jsonData = await result.json();
//   console.log("jsonData: ", jsonData);
// }

// apiCall();

// console.log("start");

// async function apiCall() {
//   console.log("calling api");
//   let result = await fetch("https://fakestoreapi.com/products");
//   console.log("api called");
// }

// function greet() {
//   console.log("hi");
// }

// apiCall();
// greet();

// console.log("end");

//! await stops/suspends the function execution un-till the promise is resolved
