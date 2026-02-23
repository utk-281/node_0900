import crypto from "node:crypto";
// console.log("crypto: ", crypto);

// console.time("hash");

// let password1 = crypto.pbkdf2Sync(
//   "qwerty123",
//   "random-string",
//   10000000,
//   64,
//   "sha512",
// );

// let password2 = crypto.pbkdf2Sync(
//   "qwerty123",
//   "random-string",
//   10000000,
//   64,
//   "sha512",
// );

// let password3 = crypto.pbkdf2Sync(
//   "qwerty123",
//   "random-string",
//   10000000,
//   64,
//   "sha512",
// );
// console.timeEnd("hash");

//! this is blocking code, we should avoid this -> 1) pbkdf2()
//? 2) we can create our own threads -> for(1-100000000000)

function hp1() {
  console.time("hashAsync1");
  crypto.pbkdf2(
    "qwerty123", //? input string
    "random-string", //? random string,
    10000000, //? number of times, string will be modified (for loop)
    64, //? length of op string
    "sha512", //? hashing algo
    (err, data) => {
      //TODO:
      //   console.log("data: ", data.toString());
      console.timeEnd("hashAsync1");
    },
  );
}

function hp3() {
  console.time("hashAsync3");
  crypto.pbkdf2(
    "qwerty123",
    "random-string",
    10000000,
    64,
    "sha512",
    (err, data) => {
      console.timeEnd("hashAsync3");
    },
  );
}

// for (let i = 0; i < 10; i++) {
//   console.log(i);
// }

function hp2() {
  console.time("hashAsync2");
  crypto.pbkdf2(
    "qwerty123",
    "random-string",
    10000000,
    64,
    "sha512",
    (err, data) => {
      console.timeEnd("hashAsync2");
    },
  );
}

// console.log("hi");

function hp5() {
  console.time("hashAsync5");
  crypto.pbkdf2(
    "qwerty123",
    "random-string",
    10000000,
    64,
    "sha512",
    (err, data) => {
      console.timeEnd("hashAsync5");
    },
  );
}

function hp6() {
  console.time("hashAsync6");
  crypto.pbkdf2(
    "qwerty123",
    "random-string",
    10000000,
    64,
    "sha512",
    (err, data) => {
      console.timeEnd("hashAsync6");
    },
  );
}

function hp4() {
  let startTime = Date.now();
  console.time("hashAsync4");
  crypto.pbkdf2(
    "qwerty123",
    "random-string",
    10000000,
    64,
    "sha512",
    (err, data) => {
      console.timeEnd("hashAsync4");
      console.log(((Date.now() - startTime) / 60) * 60);
    },
  );
}

hp1();
hp2();
hp3();
hp4();
hp5();
hp6();

//? $ UV_THREADPOOL_SIZE=6 node filename.js -> to increase/decrease the thread-pool size

//? by default total threads used -> 7 (depends upon thread-pool)
