//! 1) before installing any third party modules/packages -> we must have a "package.json" file in our project folder
//? this file should be unique

//~ this contains meta data about the project (name, auth, description etc...) and along with that it also stores the dependencies (these are packages which are required to run the project)

//? the command to create package.json file is --> "npm init -y" (this creates a json file with default values)
//? the command to create package.json file is --> "npm init"

//! 2) install the required modules or packages
//~ npm i/install moduleName
//~ npm i/install moduleName1 mN2 mN3 ........
//? npm i mongodb

//& when a module is installed, there will be three changes
// a) inside package.json file (add);
// b) a new folder will be created -> node_modules: this will store the source code of all the installed third party packages
// c) a new file will be created -> package-lock.json: it contains the details of dependent modules

//! =========== connecting mongodb with node ============
// import mongodb from "mongodb";
// console.log("mongodb: ", mongodb.MongoClient);

//! steps
//? 1) create a connection
//? 2) create a database
//? 3) create a collection
//? 4) insert/delete/update/fetch data

import { MongoClient } from "mongodb";

//! use connect() which is present in MongoClient class to connect with database

async function connectDB() {
  //! step-1
  let client = await MongoClient.connect("mongodb://localhost:27017");
  //   console.log("client: ", client);
  console.log("database connected");

  //! step-2
  let database = client.db("nodeDB");
  //   console.log("database: ", database.createCollection);
  console.log("database created");

  //! step-3a)
  //   let collection = await database.createCollection("nodeUsers");
  //   console.log("collection created");
  //! step-3b)
  let collection = database.collection("col2");
  console.log("collection created");

  //& createCollection() returns a promise whereas collection() returns the reference of the collection

  //! =============== insertOne =======================
  //   let res = await collection.insertOne({ name: "abc", age: 34 });
  //   console.log("res: ", res);
  //   console.log("doc added");
  //! =============== insertMany =======================
  //   let results = await collection.insertMany([
  //     { productName: "laptop", qty: 3 },
  //     { name: "phone", qty: 2 },
  //   ]);
  //   console.log("results: ", results);
  //! =============== findOne =======================
  //   let op = await collection.findOne();
  //   let op = await collection.findOne({ name: "abc" });
  //   console.log("op: ", op);
  //! =============== find =======================
  //   let op = await collection.find().toArray();
  //   let op = await collection
  //     .find(
  //       { qty: { $gt: 2 } }, // filter
  //     )
  //     .toArray();
  //& this will return a cursor, to get the data one of the way is to use toArray() (iterators / async-iterator)
  //   console.log("op: ", op);
  //! =============== update one/many =======================
  //! =============== delete one/many =======================
}

connectDB();
