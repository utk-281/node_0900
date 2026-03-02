//! ╔══════════════════════════════════════════════════════════════════════════╗
//! ║          NODE.JS EVENT LOOP — COMPLETE MASTER GUIDE                      ║
//! ╚══════════════════════════════════════════════════════════════════════════╝

//? WHAT IS THE EVENT LOOP?
//? Node.js is single-threaded — it can only do one thing at a time.
//? But it can handle thousands of async operations (file reads, timers, network).
//? The EVENT LOOP is the mechanism that manages all of this.

//! ========================= EVENT LOOP PHASES (Big Picture) =========================

//? Node.js Event Loop processes tasks in this STRICT PRIORITY ORDER:

//  ┌────────────────────────────────────────────────────────────────┐
//  │                     CALL STACK (sync code)                     │  ← runs first, always
//  └──────────────────────────────┬─────────────────────────────────┘
//                                 │ empty?
//                                 ▼
//  ┌────────────────────────────────────────────────────────────────┐
//  │              MICROTASK QUEUES (run between every phase)        │
//  │   1. process.nextTick queue  (highest priority among async)    │
//  │   2. Promise / queueMicrotask queue                            │
//  └──────────────────────────────┬─────────────────────────────────┘
//                                 │ empty?
//                                 ▼
//  ┌────────────────────────────────────────────────────────────────┐
//  │              MACROTASK QUEUES (event loop phases)              │
//  │   3. Timer Queue      — setTimeout / setInterval callbacks     │
//  │   4. I/O Queue        — fs, network, etc. callbacks            │
//  │   5. Check Queue      — setImmediate callbacks                 │
//  │   6. Close Queue      — close event callbacks                  │
//  └────────────────────────────────────────────────────────────────┘

//~ PRIORITY ORDER (memorize this for interviews):
//~ sync > process.nextTick > Promise/queueMicrotask > setTimeout/setInterval > I/O > setImmediate > close

//? KEY RULE — MICROTASK QUEUES ARE CHECKED AFTER EVERY SINGLE MACROTASK CALLBACK
//? Not after ALL timers — after EACH individual timer callback.
//? This is the #1 interview trap!

//! ========================= process.nextTick =========================

//? WHAT IS IT?
//? process.nextTick() schedules a callback to run AFTER the current operation
//? completes but BEFORE the event loop moves to any other queue.
//? It is NOT part of the event loop phases — it's a special microtask.

//~ Real-world analogy:
//~ You're in a meeting (sync code). Someone passes you a sticky note (nextTick).
//~ You finish your sentence, THEN read the note — before the next agenda item.

//? HOW nextTick WORKS:
//
//  [Sync code runs] → [Call stack empties] → [nextTick queue drains completely]
//       → [Promise queue drains] → [Event loop phase begins]
//
//? "Drains completely" = ALL nextTick callbacks run, including ones added DURING execution

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 1 — Basic nextTick ============
// ─────────────────────────────────────────────────────────

console.log("1");
console.log("2");
console.log("3");

process.nextTick(() => {
  console.log("nt");
});

//? EXPECTED OUTPUT:
//  1
//  2
//  3
//  nt

//? STEP-BY-STEP:
//  1. console.log("1")  → sync → runs immediately → prints 1
//  2. console.log("2")  → sync → runs immediately → prints 2
//  3. console.log("3")  → sync → runs immediately → prints 3
//  4. process.nextTick  → registers callback in nextTick queue (NOT run yet)
//  5. Call stack is now EMPTY
//  6. Event loop checks: any nextTick callbacks? YES → runs → prints "nt"

//~ INTERVIEW NOTE: nextTick callbacks always run AFTER all sync code, no matter
//~ where in the file the nextTick() call appears.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 2 — Multiple nextTicks =========
// ─────────────────────────────────────────────────────────

console.log(1);

process.nextTick(() => {
  console.log(4);
});

console.log(2);

process.nextTick(() => {
  console.log(3);
});

//? EXPECTED OUTPUT:
//  1
//  2
//  4
//  3

//? STEP-BY-STEP:
//  1. Sync: prints 1
//  2. Registers nextTick → prints 4 (queued, not run yet)
//  3. Sync: prints 2
//  4. Registers nextTick → prints 3 (queued, not run yet)
//  5. Call stack empty → nextTick queue runs in order: prints 4, then 3

//~ KEY INSIGHT: nextTick queue is FIFO (first in, first out).
//~ Callbacks run in the ORDER they were registered.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 3 — Nested nextTick ============
// ─────────────────────────────────────────────────────────

console.log(1);

process.nextTick(() => {
  console.log(4);
});

console.log(2);

process.nextTick(() => {
  console.log(3); // runs second in nextTick queue

  process.nextTick(() => {
    console.log(5); // added to nextTick queue WHILE processing nextTick queue
  });

  console.log(6); // sync inside callback, runs before the nested nextTick
});

//? EXPECTED OUTPUT:
//  1
//  2
//  4
//  3
//  6
//  5

//? STEP-BY-STEP:
//  1. Sync: 1, 2
//  2. nextTick queue at call stack empty: [cb→4, cb→3,6,nested]
//  3. Run cb→4: prints 4
//  4. Run cb→(3,6,nested): prints 3, registers new nextTick(5), prints 6
//  5. nextTick queue still has [cb→5] — it was added during queue processing
//  6. Run cb→5: prints 5

//~ KEY INSIGHT: A nextTick added INSIDE a nextTick callback runs BEFORE the event
//~ loop moves on. The queue keeps getting processed until it's completely empty.

//~ INTERVIEW TRAP: Many assume 5 prints before 6. It doesn't — 6 is SYNCHRONOUS
//~ code inside the callback. Sync always runs before any queued callbacks.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 4 — Nested nextTick (Advanced) =
// ─────────────────────────────────────────────────────────

console.log(0);

process.nextTick(() => {
  console.log(1);
});

process.nextTick(() => {
  console.log(2);

  process.nextTick(() => {
    console.log(3);
  });

  console.log(4);
});

process.nextTick(() => {
  console.log(5);
});

console.log(6);

//? EXPECTED OUTPUT:
//  0
//  6
//  1
//  2
//  4
//  5
//  3

//? STEP-BY-STEP:
//  Sync: 0, 6
//  nextTick queue: [cb1→1, cb2→(2,nested3,4), cb3→5]
//
//  Process cb1: prints 1
//  Process cb2: prints 2, registers nested(3), prints 4
//  nextTick queue now: [cb3→5, nested→3]
//  Process cb3: prints 5
//  Process nested: prints 3

//~ WHY does 3 come AFTER 5?
//~ Because 3 was added to the END of the queue when cb2 ran.
//~ cb3 was already waiting, so it runs before the newly added nested callback.

//! ========================= nextTick + Promises =========================

//? PROMISE MICROTASK QUEUE
//? Promise.resolve().then() callbacks go into the PROMISE MICROTASK QUEUE.
//? This queue has LOWER priority than the nextTick queue.

//? Priority among async:  nextTick queue > Promise queue > timers

//  ┌──────────────────────────────────────────┐
//  │  MICROTASK QUEUES (processed after sync) │
//  │  ┌───────────────────────────────────┐   │
//  │  │ 1. nextTick Queue (drains first)  │   │
//  │  └───────────────────────────────────┘   │
//  │  ┌───────────────────────────────────┐   │
//  │  │ 2. Promise Queue (drains second)  │   │
//  │  └───────────────────────────────────┘   │
//  └──────────────────────────────────────────┘

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 5 — nextTick vs Promise ========
// ─────────────────────────────────────────────────────────

console.log("1");

process.nextTick(() => {
  console.log(2);
});
process.nextTick(() => {
  console.log(3);
});

Promise.resolve().then(() => {
  console.log(4);
});

process.nextTick(() => {
  console.log(5);
});

console.log(6);

//? EXPECTED OUTPUT:
//  1
//  6
//  2
//  3
//  5
//  4

//? STEP-BY-STEP:
//  Sync: 1, 6
//  nextTick queue: [2, 3, 5] → all drain → prints 2, 3, 5
//  Promise queue: [4] → drains → prints 4

//~ KEY RULE: The event loop drains the ENTIRE nextTick queue before
//~ touching the Promise queue, even if Promises were registered earlier.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 6 — Nested nextTick + Promise ==
// ─────────────────────────────────────────────────────────

console.log("1");

process.nextTick(() => {
  console.log(2);
});

process.nextTick(() => {
  console.log(3);
  process.nextTick(() => {
    console.log("3 nested");
  });
});

Promise.resolve().then(() => {
  console.log(4);
});

process.nextTick(() => {
  console.log(5);
});

console.log(6);

Promise.resolve().then(() => {
  console.log(7);
  Promise.resolve().then(() => {
    console.log(8);
  });
});

//? EXPECTED OUTPUT:
//  1
//  6
//  2
//  3
//  5
//  3 nested
//  4
//  7
//  8

//? STEP-BY-STEP:
//  Sync: 1, 6
//  nextTick queue: [2, 3+nested, 5]
//    → prints 2
//    → prints 3, adds "3 nested" to nextTick queue
//    → prints 5
//    → prints "3 nested" (newly added, still in nextTick queue)
//  nextTick queue EMPTY now
//  Promise queue: [4, 7+nested8]
//    → prints 4
//    → prints 7, adds nested promise
//    → prints 8

//~ KEY RULE about Promises: Promise queue is also processed until EMPTY
//~ (including promises added during processing) before moving to next phase.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 7 — Cross-queue nesting ========
// ─────────────────────────────────────────────────────────

console.log("1");

process.nextTick(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log("nested promise inside nextTick");
  });
});

process.nextTick(() => {
  console.log(3);
});

Promise.resolve().then(() => {
  console.log(4);
  process.nextTick(() => {
    console.log("nested nextTick inside promise");
  });
});

Promise.resolve().then(() => {
  console.log(5);
});

console.log(6);

//? EXPECTED OUTPUT:
//  1
//  6
//  2
//  3
//  nested promise inside nextTick  ← NOT here (see below)
//  4
//  nested nextTick inside promise   ← NOT here (see below)
//  5

//? WAIT — let's be precise. Here's what ACTUALLY happens:

//? STEP-BY-STEP:
//  Sync: 1, 6
//
//  nextTick queue: [cb(2,promise), cb(3)]
//    → run cb(2, promise): prints 2, adds promise-callback to PROMISE queue
//    → run cb(3): prints 3
//  nextTick queue EMPTY
//
//  Promise queue: [cb(4, nextTick), cb(5), cb("nested promise")]
//  ── process cb(4, nextTick): prints 4, adds nextTick to nextTick queue
//  ── BEFORE continuing promise queue → check nextTick queue!
//     → prints "nested nextTick inside promise"
//  ── process cb(5): prints 5
//  ── process cb("nested promise"): prints "nested promise inside nextTick"

//? CORRECTED EXPECTED OUTPUT:
//  1
//  6
//  2
//  3
//  4
//  nested nextTick inside promise
//  5
//  nested promise inside nextTick

//~ CRITICAL INTERVIEW INSIGHT:
//~ nextTick queue is checked after EACH promise callback, not just once.
//~ A nextTick added inside a promise callback jumps the queue — it runs
//~ BEFORE the remaining promise callbacks.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 8 — Deep Cross-Queue Nesting ===
// ─────────────────────────────────────────────────────────

console.log("1");

process.nextTick(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
    Promise.resolve().then(() => {
      console.log(4);
    });
  });
});

process.nextTick(() => {
  console.log(5);
});

Promise.resolve().then(() => {
  console.log(6);
  process.nextTick(() => {
    console.log(7);
    process.nextTick(() => {
      console.log(8);
    });
  });
});

Promise.resolve().then(() => {
  console.log(9);
});

console.log(10);

//? EXPECTED OUTPUT:
//  1
//  10
//  2
//  5
//  6
//  7
//  8
//  9
//  3
//  4

//? STEP-BY-STEP:
//  Sync: 1, 10
//
//  nextTick queue: [cb(2,promise), cb(5)]
//    → cb(2): prints 2, registers promise(3, promise(4))
//    → cb(5): prints 5
//  nextTick EMPTY
//
//  Promise queue: [cb(6, nt(7,nt(8))), cb(9), cb(3, promise(4))]
//    → cb(6): prints 6, registers nextTick(7,nt(8))
//    → nextTick check: run nextTick(7,nt(8))
//       → prints 7, registers nextTick(8)
//       → nextTick check: run nextTick(8) → prints 8
//    → cb(9): prints 9
//    → cb(3): prints 3, registers promise(4)
//    → cb(4): prints 4

//~ MENTAL MODEL: After every SINGLE promise callback execution,
//~ check and drain the nextTick queue. Then continue promise queue.

//! ========================= queueMicrotask =========================

//? queueMicrotask is equivalent to Promise.resolve().then()
//? Both go into the SAME promise microtask queue.
//? Use queueMicrotask when you don't need a Promise object — it's slightly cleaner.

// Example:
queueMicrotask(() => {
  console.log("qm");
});
Promise.resolve().then(() => {
  console.log("promise");
});

//? EXPECTED OUTPUT:
//  qm
//  promise

//~ They share the same queue → FIFO order. queueMicrotask ran first because
//~ it was registered first.

//! ========================= TIMER QUEUE (setTimeout / setInterval) =========================

//? setTimeout(fn, 0) doesn't mean "run immediately" — it means "run ASAP after 0ms"
//? Minimum timer resolution in Node.js is ~1ms. So setTimeout(fn, 0) becomes setTimeout(fn, 1).

//~ Real-world analogy:
//~ Timers are like alarm clocks. Even if you set them for "now", you still have to
//~ finish your current thought (sync code), check your sticky notes (nextTick),
//~ read your messages (promises), THEN check the alarms.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 1 — setTimeout vs nextTick =====
// ─────────────────────────────────────────────────────────

setTimeout(() => {
  console.log(1);
});
process.nextTick(() => {
  console.log(2);
});

//? EXPECTED OUTPUT:
//  2
//  1

//? WHY: nextTick is a microtask. It ALWAYS runs before timer callbacks.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 2 — Timer + Nested nextTick ====
// ─────────────────────────────────────────────────────────

setTimeout(() => {
  console.log(1);
});

process.nextTick(() => {
  console.log(2);
  process.nextTick(() => {
    console.log(3);
  });
});

//? EXPECTED OUTPUT:
//  2
//  3
//  1

//? WHY: nextTick queue (including nested) drains completely before timer runs.

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 3 — Multiple Timers + nextTick =
// ─────────────────────────────────────────────────────────

setTimeout(() => {
  console.log(1);
  process.nextTick(() => {
    console.log(5);
  }); // ← nextTick INSIDE timer
});

process.nextTick(() => {
  console.log(2);
  process.nextTick(() => {
    console.log(3);
  });
});

setTimeout(() => {
  console.log(4);
});

//? EXPECTED OUTPUT:
//  2
//  3
//  1
//  5
//  4

//? STEP-BY-STEP:
//  Sync: registers timer1, nextTick(2,nt3), timer2
//  nextTick queue: → prints 2, registers nt3 → prints 3
//  Timer phase: run timer1 → prints 1, registers nextTick(5)
//    → microtask check after EACH timer callback → prints 5
//  Timer phase: run timer2 → prints 4

//~ CRITICAL: The event loop checks microtask queues BETWEEN individual timer callbacks.
//~ This is why 5 prints before 4, even though both are "timers".

// ─────────────────────────────────────────────────────────
//! ================ EXAMPLE 4 — All Queues Together =========
// ─────────────────────────────────────────────────────────

setTimeout(() => {
  console.log(1);
  process.nextTick(() => {
    console.log(5);
    Promise.resolve().then(() => {
      console.log(9);
    });
  });
});

process.nextTick(() => {
  console.log(2);
  process.nextTick(() => {
    console.log(3);
  });
  setTimeout(() => {
    console.log(7);
  }); // ← timer added inside nextTick!
});

setTimeout(() => {
  console.log(4);
  Promise.resolve().then(() => {
    console.log(6);
    process.nextTick(() => {
      console.log(8);
    });
  });
});

process.nextTick(() => {
  console.log(10);
  setTimeout(() => {
    console.log(11);
  }); // ← another timer added inside nextTick!
});

process.nextTick(() => {
  console.log("nt");
});
Promise.resolve().then(() => {
  console.log("p");
});

//? EXPECTED OUTPUT:
//  2
//  3
//  10
//  nt
//  p
//  1
//  5
//  9
//  4
//  6
//  8
//  7
//  11

//? STEP-BY-STEP:
//  Sync: registers timer1, nt(2,3,timer7), timer2, nt(10,timer11), nt("nt"), promise("p")
//
//  nextTick queue drains:
//    → cb(2,3,timer7): prints 2, adds nt(3), adds timer7 to timer queue
//    → cb(10,timer11): prints 10, adds timer11 to timer queue
//    → cb("nt"): prints "nt"
//    → cb(3): prints 3  (added during queue processing)
//  nextTick EMPTY
//
//  Promise queue: [cb("p")] → prints "p"
//
//  Timer queue: [timer1, timer2, timer7, timer11]
//    → timer1: prints 1, adds nt(5,promise9)
//      → microtask check: nextTick(5) → prints 5, adds promise(9)
//      → microtask check: promise(9) → prints 9
//    → timer2: prints 4, adds promise(6,nt8)
//      → microtask check: nextTick queue empty
//      → promise(6,nt8): prints 6, adds nt(8)
//      → microtask check: nextTick(8) → prints 8
//    → timer7: prints 7
//    → timer11: prints 11

//! ========================= I/O QUEUE =========================

//? I/O callbacks (fs.readFile, network, etc.) are processed in the I/O phase.
//? This phase runs AFTER timers and microtask queues.

//~ Real-world analogy:
//~ I/O is like waiting for a delivery. You submit the order (register callback),
//~ do other work, and when the package arrives (OS signals completion),
//~ the event loop handles it in the I/O phase.

//? THE UNPREDICTABILITY OF setTimeout(0) vs I/O:

const fs = require("fs");

setTimeout(() => {
  console.log("this is setTimeout 1");
}, 0);

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

//? OUTPUT ORDER IS NOT GUARANTEED. It depends on:
//  - How fast the event loop starts
//  - How fast the OS reads the file
//  - setTimeout(0) is actually min 1ms

//  If event loop starts in < 1ms → timer hasn't fired → I/O runs first
//  If event loop starts in > 1ms → timer already fired → timer runs first

//~ INTERVIEW TRAP: Never assume a fixed order between setTimeout(0) and I/O callbacks.
//~ This is one of the most common Node.js gotchas.

//! ========================= CHECK QUEUE (setImmediate) =========================

//? setImmediate() runs callbacks in the "check" phase of the event loop.
//? This phase runs AFTER the I/O phase.

//? setImmediate vs setTimeout(0):
//  - In top-level code → order is UNPREDICTABLE (same as I/O vs timer)
//  - Inside an I/O callback → setImmediate ALWAYS runs before setTimeout(0)

//~ Real-world analogy:
//~ setImmediate is like saying "do this immediately AFTER handling the current I/O"
//~ setTimeout is like saying "do this after at least 1ms"

// ─────────────────────────────────────────────────────────
//! ===== EXAMPLE — setImmediate inside I/O (predictable) ===
// ─────────────────────────────────────────────────────────

fs.readFile(__filename, () => {
  setImmediate(() => {
    console.log("this is readFile 1");
  });
}); // callback added to check queue after I/O phase

setImmediate(() => {
  console.log("1");
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

setImmediate(() => {
  console.log("immediate");
});

for (let i = 0; i < 2000000000; i++) {} // simulate delay > 1ms

//? EXPECTED OUTPUT:
//  this is process.nextTick 1
//  this is Promise.resolve 1
//  this is setTimeout 1      ← timer fires because loop takes > 1ms
//  1
//  immediate
//  this is readFile 1        ← setImmediate INSIDE I/O runs after outer setImmediate

//~ WHY does setImmediate inside I/O run AFTER outer setImmediate?
//~ The outer setImmediate callbacks were registered in the check queue BEFORE
//~ the I/O callback ran. The one registered inside I/O gets added to the queue
//~ DURING the check phase — so it runs in the NEXT check phase iteration.

//! ========================= CLOSE QUEUE =========================

//? The close queue handles callbacks for "close" events.
//? Examples: stream.on('close', ...), socket.on('close', ...)
//? This is the LAST phase of the event loop.

//? Priority: sync > nextTick > promise > timer > I/O > setImmediate > CLOSE

// ─────────────────────────────────────────────────────────
//! ========== FINAL EXAMPLE — All Queues Combined ==========
// ─────────────────────────────────────────────────────────

const readableStream = fs.createReadStream(__filename);
readableStream.close();

readableStream.on("close", () => {
  console.log("this is from readableStream close event callback");
});

setImmediate(() => console.log("this is setImmediate 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
process.nextTick(() => console.log("this is process.nextTick 1"));

//? EXPECTED OUTPUT:
//  this is process.nextTick 1
//  this is Promise.resolve 1
//  this is setTimeout 1
//  this is setImmediate 1
//  this is from readableStream close event callback

//? STEP-BY-STEP:
//  1. Sync: stream created and closed, all callbacks registered
//  2. nextTick queue: → "this is process.nextTick 1"
//  3. Promise queue:  → "this is Promise.resolve 1"
//  4. Timer queue:    → "this is setTimeout 1"
//  5. I/O queue:      → nothing (no pending I/O)
//  6. Check queue:    → "this is setImmediate 1"
//  7. Close queue:    → "this is from readableStream close event callback"

//~ WHY is setTimeout before setImmediate here?
//~ The for-loop (or enough sync work) delays the event loop start past 1ms,
//~ meaning the timer has already expired. In a clean environment with no delay,
//~ the order of setTimeout(0) vs setImmediate is unpredictable at the top level.

//! ========================= COMPLETE PRIORITY CHEAT SHEET =========================

//  ┌─────────────────────────────────────────────────────────────────────┐
//  │                    NODE.JS EXECUTION ORDER                          │
//  ├──────┬──────────────────────────────────┬───────────────────────────┤
//  │  #   │  What                            │  API                      │
//  ├──────┼──────────────────────────────────┼───────────────────────────┤
//  │  1   │  Synchronous code                │  console.log, etc.        │
//  │  2   │  nextTick queue (full drain)      │  process.nextTick()       │
//  │  3   │  Promise/microtask queue (drain)  │  Promise.resolve().then() │
//  │      │                                  │  queueMicrotask()         │
//  │  4   │  Timer callbacks (per callback)  │  setTimeout/setInterval   │
//  │  ←   │  [microtask queues checked here] │                           │
//  │  5   │  I/O callbacks                   │  fs.readFile, network     │
//  │  ←   │  [microtask queues checked here] │                           │
//  │  6   │  setImmediate (check phase)      │  setImmediate()           │
//  │  ←   │  [microtask queues checked here] │                           │
//  │  7   │  Close callbacks                 │  stream.on('close')       │
//  └──────┴──────────────────────────────────┴───────────────────────────┘

//! ========================= COMMON INTERVIEW TRAPS =========================

//? TRAP 1: "nextTick added inside a Promise runs before remaining Promises"
//~   TRUE — after each promise callback, nextTick queue is fully drained.

//? TRAP 2: "setTimeout(0) always runs before I/O"
//~   FALSE — order is non-deterministic at top level.

//? TRAP 3: "setImmediate always runs before setTimeout(0)"
//~   FALSE — only predictable INSIDE an I/O callback (setImmediate wins there).

//? TRAP 4: "All timers run, then microtasks run"
//~   FALSE — microtasks run BETWEEN each individual timer callback.

//? TRAP 5: "queueMicrotask has higher priority than Promise.resolve()"
//~   FALSE — they share the same queue.

//? TRAP 6: "Nested nextTick inside nextTick delays to next event loop tick"
//~   FALSE — it's added to the current nextTick queue and drains before anything else.

//! ========================= QUICK INTERVIEW ANSWERS =========================

//? Q: What is process.nextTick?
//~ A: A microtask that runs after the current synchronous code completes but before
//~    the event loop moves to any queue. It has the highest priority among all async.

//? Q: Difference between process.nextTick and setImmediate?
//~ A: nextTick runs in microtask queue (highest priority), setImmediate runs in
//~    check phase (after I/O). nextTick always runs before setImmediate.

//? Q: When does setImmediate run before setTimeout(0)?
//~ A: When called inside an I/O callback. At top level, order is non-deterministic.

//? Q: What is the order of execution for mixed async operations?
//~ A: sync → nextTick → Promise/queueMicrotask → setTimeout → I/O → setImmediate → close
//~    With microtask queues draining after EACH macrotask callback.

//~ sync > process.nextTick > Promise/queueMicrotask > timer > I/O > setImmediate > close
//! ═══════════════════ END OF NODE.JS EVENT LOOP ═══════════════════
