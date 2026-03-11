import { MongoClient } from "mongodb";

async function connectDB() {
  let client = await MongoClient.connect("mongodb://localhost:27017");
  let database = client.db("userReg");
  let collection = await database.createCollection("users");
  return collection;
}

export default connectDB;
