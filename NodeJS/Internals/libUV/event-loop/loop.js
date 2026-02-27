//! nexTick() this is a higher order function (HOF):
// nextTick(()=>{
// code.....
//})

// setTimeout(() => {
//   console.log(process);
// }, 5000);

// console.log(process.nextTick);

// process.nextTick(() => {
//   console.log("this is next tick function");
// });

// console.log("1");

// console.log("2");

// console.log("3");

// function hello() {
//   console.log("hello");
// }

// hello();

//! ================ example-1 (nextTick) ================================

// console.log("1");

// console.log("2");

// console.log("3");

// process.nextTick(() => {
//   console.log("nt");
// });

//? first all the synchronous statements will get executed
//~ then event-loop will come into picture and it will see if there are any pending callbacks, if yes then the particular callback will be pushed to call stack for execution

//! ================ example-2 (nextTick) ================================

// console.log(1);

// process.nextTick(() => {
//   console.log(4);
// });

// console.log(2);

// process.nextTick(() => {
//   console.log(3);
// });

//? among async code -> nextTick is given highest priority

//! ================ example-3 (nextTick) ================================

// console.log(1);

// process.nextTick(() => {
//   console.log(4);
// });

// console.log(2);

// process.nextTick(() => {
//   console.log(3);

//   process.nextTick(() => {
//     console.log(5);
//   });

//   console.log(6);
// });

//! ================ example-4 (nextTick) ================================
// console.log(0);

// process.nextTick(() => {
//   console.log(1);
// });

// process.nextTick(() => {
//   console.log(2);

//   process.nextTick(() => {
//     console.log(3);
//   });

//   console.log(4);
// });

// process.nextTick(() => {
//   console.log(5);
// });

// console.log(6);

//! ================ example-5 (nextTick and promise) ================================

// console.log("1");

// process.nextTick(() => {
//   console.log(2);
// });

// process.nextTick(() => {
//   console.log(3);
// });

// Promise.resolve().then(() => {
//   console.log(4);
// });

// process.nextTick(() => {
//   console.log(5);
// });

// console.log(6);

//? first event loop wil go to nexTick queue, and it will empty the whole queue, until the queue is emptied it will not move to promise queue

//! ================ example-6 (nextTick and promise) ================================

// console.log("1");

// process.nextTick(() => {
//   console.log(2);
// });

// process.nextTick(() => {
//   console.log(3);

//   process.nextTick(() => {
//     console.log("3 nested");
//   });
// });

// Promise.resolve().then(() => {
//   console.log(4);
// });

// process.nextTick(() => {
//   console.log(5);
// });

// console.log(6);

// Promise.resolve().then(() => {
//   console.log(7);

//   Promise.resolve().then(() => {
//     console.log(8);
//   });
// });

//! ================ example-7 (nextTick and promise) ================================

// console.log("1");

// process.nextTick(() => {
//   console.log(2);

//   Promise.resolve().then(() => {
//     console.log("nested promise inside nextTick");
//   });
// });

// process.nextTick(() => {
//   console.log(3);
// });

// Promise.resolve().then(() => {
//   console.log(4);

//   process.nextTick(() => {
//     console.log("nested nextTick inside promise");
//   });
// });

// Promise.resolve().then(() => {
//   console.log(5);
// });

// console.log(6);

//! event loop will execute all the microtask queues callbacks in batches (batches means that event loop will empty the current queue then move on to the next queue)
//~ if any callback in promise queue generates a callback in nextTick queue and still there are 2 more promise callbacks pending in promise queue
//~ then event loop will first execute all the callbacks in promise (it will empty the promise queue) then move on to nextTick queue

//! ================ example-8 (nextTick and promise) ================================

// console.log("1");

// process.nextTick(() => {
//   console.log(2);

//   Promise.resolve().then(() => {
//     console.log(3);

//     Promise.resolve().then(() => {
//       console.log(4);
//     });
//   });
// });

// process.nextTick(() => {
//   console.log(5);
// });

// Promise.resolve().then(() => {
//   console.log(6);

//   process.nextTick(() => {
//     console.log(7);

//     process.nextTick(() => {
//       console.log(8);
//     });
//   });
// });

// Promise.resolve().then(() => {
//   console.log(9);
// });

// console.log(10);

//! =========================== final example of promise and nextTick ===========

process.nextTick(() => {
  console.log("this is process.nextTick 1");
});

process.nextTick(() => {
  console.log("this is process.nextTick 2");

  process.nextTick(() =>
    console.log("this is the inner next tick inside next tick"),
  );
});

process.nextTick(() => {
  console.log("this is process.nextTick 3");
});

Promise.resolve().then(() => {
  console.log("this is Promise.resolve 1");
});

Promise.resolve().then(() => {
  console.log("this is Promise.resolve 2");

  process.nextTick(() =>
    console.log("this is the inner next tick inside Promise then block"),
  );
});

Promise.resolve().then(() => {
  console.log("this is Promise.resolve 3");
});

// [priority order] sync code >> async (nextTick > promise)
