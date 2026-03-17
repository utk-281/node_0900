# Environment Variables, ORM, ODM & MongoDB

### dotenv, process.env, MongoDB, Mongoose

---

## Table of Contents

1. [Environment Variables](#1-environment-variables)
2. [.env File](#2-env-file)
3. [dotenv Module](#3-dotenv-module)
4. [process.env](#4-processenv)
5. [config()](#5-config)
6. [ORM vs ODM](#6-orm-vs-odm)
7. [MongoDB](#7-mongodb)
8. [Mongoose](#8-mongoose)
9. [MongoDB vs Mongoose](#9-mongodb-vs-mongoose)

---

## 1. Environment Variables

### What are Environment Variables?

**Environment variables are dynamic values that affect the way running processes behave on a computer.**

In Node.js, they store:

- API keys
- Database credentials
- Port numbers
- Secret tokens
- Configuration settings

---

### Why Use Environment Variables?

```
✅ Security: Keep sensitive data out of source code
✅ Flexibility: Different values for dev/staging/production
✅ Convenience: Change settings without modifying code
✅ Best Practice: Never hardcode credentials
```

---

### Example Problem

**Without Environment Variables (❌ Bad):**

```javascript
// Hardcoded in code - DANGEROUS!
const PORT = 3000;
const DB_URL = "mongodb://localhost:27017/mydb";
const API_KEY = "sk_test_123456789"; // EXPOSED IN CODE!
```

**Problems:**

- API key visible in code
- Can't change port without editing code
- Different environments need different values
- Security risk if code is shared/committed

---

**With Environment Variables (✅ Good):**

```javascript
// Read from environment
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const API_KEY = process.env.API_KEY;
```

**Benefits:**

- Credentials hidden
- Easy to change per environment
- Secure and flexible

---

## 2. .env File

### What is a .env File?

**A plain text file that stores environment variables as key-value pairs.**

---

### File Location

```
project/
├── .env          ← Root of project
├── server.js
├── package.json
└── node_modules/
```

---

### .env File Format

```
# Database configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=myDatabase
DB_USER=admin
DB_PASSWORD=secret123

# Server configuration
PORT=9000
NODE_ENV=development

# API Keys
STRIPE_API_KEY=sk_test_123456
JWT_SECRET=mysecretkey123

# MongoDB URI
MONGO_URI=mongodb://localhost:27017/userDB
```

---

### Rules for .env File

```
1. One variable per line
2. Format: KEY=value (no spaces around =)
3. No quotes needed for strings
4. Comments start with #
5. No trailing spaces
6. UPPERCASE_WITH_UNDERSCORES convention
```

---

### Example .env

```
# ✅ Correct
PORT=3000
DB_NAME=mydb
API_KEY=abc123

# ❌ Wrong
PORT = 3000              # Spaces around =
DB_NAME="mydb"           # Unnecessary quotes
API_KEY = "abc123"       # Both mistakes
```

---

### Important: .gitignore

**Always add .env to .gitignore:**

```
# .gitignore
node_modules/
.env              ← Never commit this!
.env.local
.env.production
```

**Why?**

- Prevents secrets from being pushed to GitHub
- Each developer has their own .env file
- Production server has different .env

---

### .env.example

**Create .env.example for team members:**

```
# .env.example (commit this)
PORT=
DB_HOST=
DB_NAME=
API_KEY=
```

Team members copy this and fill in their values:

```bash
cp .env.example .env
```

---

## 3. dotenv Module

### What is dotenv?

**A Node.js module that loads environment variables from a .env file into `process.env`.**

---

### Installation

```bash
npm install dotenv
```

---

### Basic Usage

```javascript
// Import dotenv
import dotenv from "dotenv";

// Load .env file
dotenv.config();

// Now you can use environment variables
console.log(process.env.PORT); // 9000
console.log(process.env.DB_NAME); // myDatabase
console.log(process.env.API_KEY); // abc123
```

---

### How dotenv Works

```
1. dotenv.config() reads .env file
   ↓
2. Parses key=value pairs
   ↓
3. Loads them into process.env
   ↓
4. Variables available throughout app
```

---

### Visual Flow

```
.env file:
────────────────────────
PORT=9000
DB_NAME=userDB
API_KEY=secret123

↓ dotenv.config()

process.env object:
────────────────────────
{
  PORT: "9000",
  DB_NAME: "userDB",
  API_KEY: "secret123"
}
```

---

### dotenv.config() Options

```javascript
// Default: loads .env from root
dotenv.config();

// Custom path
dotenv.config({ path: "./config/.env" });

// Specify encoding
dotenv.config({ encoding: "utf8" });

// Override existing variables
dotenv.config({ override: true });
```

---

### Example: config/index.js

```javascript
// config/index.js
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Optional: Validate required variables
if (!process.env.PORT) {
  throw new Error("PORT is not defined in .env");
}

if (!process.env.DB_NAME) {
  throw new Error("DB_NAME is not defined in .env");
}

console.log("Environment variables loaded successfully");
```

---

### When to Call config()

**Call dotenv.config() ONCE at the start of your application:**

```javascript
// ✅ Good: At the top of main file
import dotenv from "dotenv";
dotenv.config();

import express from "express";
// Rest of your code

// ❌ Bad: Calling multiple times
dotenv.config();
dotenv.config(); // Unnecessary
```

---

## 4. process.env

### What is process.env?

**A global object in Node.js that contains all environment variables.**

---

### Accessing Environment Variables

```javascript
// After dotenv.config()
const port = process.env.PORT;
const dbName = process.env.DB_NAME;
const apiKey = process.env.API_KEY;

console.log(port); // "9000"
console.log(dbName); // "userDB"
console.log(apiKey); // "secret123"
```

---

### Data Type

**All values in process.env are STRINGS:**

```javascript
// .env
PORT = 9000;
IS_PRODUCTION = true;
MAX_USERS = 100;

// JavaScript
console.log(typeof process.env.PORT); // "string"
console.log(typeof process.env.IS_PRODUCTION); // "string"
console.log(typeof process.env.MAX_USERS); // "string"

// Need to convert
const port = Number(process.env.PORT); // 9000 (number)
const isProd = process.env.IS_PRODUCTION === "true"; // true (boolean)
```

---

### Default Values

```javascript
// Provide default if not set
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";

// Using nullish coalescing
const port = process.env.PORT ?? 3000;
```

---

### Common Usage

```javascript
// Server configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// Database configuration
const DB_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// API Keys
const STRIPE_KEY = process.env.STRIPE_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// Environment
const NODE_ENV = process.env.NODE_ENV;
const isDevelopment = NODE_ENV === "development";
const isProduction = NODE_ENV === "production";
```

---

### Example: Database Connection

```javascript
import { MongoClient } from "mongodb";

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "defaultDB";

  const client = await MongoClient.connect(uri);
  const database = client.db(dbName);

  return database;
}
```

---

## 5. config()

### What is config()?

**The function from dotenv module that loads .env file into process.env.**

---

### Syntax

```javascript
dotenv.config([options]);
```

---

### Return Value

```javascript
const result = dotenv.config();

// Success
console.log(result);
// { parsed: { PORT: "9000", DB_NAME: "mydb" } }

// Error
console.log(result);
// { error: Error('ENOENT: .env file not found') }
```

---

### Options

**1. path:**

```javascript
// Custom .env file location
dotenv.config({ path: "./config/.env" });
dotenv.config({ path: "/absolute/path/.env" });
```

**2. encoding:**

```javascript
// File encoding (default: utf8)
dotenv.config({ encoding: "latin1" });
```

**3. override:**

```javascript
// Override existing environment variables
dotenv.config({ override: true });
```

**4. debug:**

```javascript
// Enable debug output
dotenv.config({ debug: true });
```

---

### Multiple .env Files

```javascript
// Load different files for different environments
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env.development" });
}
```

---

### Error Handling

```javascript
const result = dotenv.config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
  throw result.error;
}

console.log("Environment variables loaded:", result.parsed);
```

---

## 6. ORM vs ODM

### ORM (Object-Relational Mapping)

**Maps objects to relational database tables (SQL databases).**

---

### What is ORM?

**ORM allows you to interact with SQL databases using objects instead of SQL queries.**

```
Object (JavaScript) ←→ ORM ←→ Table (SQL Database)
```

---

### ORM Examples

```
Sequelize  → PostgreSQL, MySQL, SQLite
TypeORM    → PostgreSQL, MySQL, SQLite
Prisma     → PostgreSQL, MySQL, SQLite
Objection  → PostgreSQL, MySQL, SQLite
```

---

### ORM Example (Sequelize)

**Without ORM (Raw SQL):**

```javascript
const users = await db.query("SELECT * FROM users WHERE age > 18");
```

**With ORM:**

```javascript
const users = await User.findAll({
  where: { age: { [Op.gt]: 18 } },
});
```

---

### ODM (Object-Document Mapping)

**Maps objects to documents in NoSQL databases (MongoDB).**

---

### What is ODM?

**ODM allows you to interact with MongoDB using objects and schemas.**

```
Object (JavaScript) ←→ ODM ←→ Document (MongoDB)
```

---

### ODM Example

```
Mongoose   → MongoDB
Prisma     → MongoDB (also supports)
```

---

### ORM vs ODM Comparison

| Feature   | ORM                     | ODM                    |
| --------- | ----------------------- | ---------------------- |
| Database  | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB)        |
| Structure | Tables, Rows, Columns   | Collections, Documents |
| Schema    | Fixed schema            | Flexible schema        |
| Relations | Foreign keys            | Embedded/Referenced    |
| Query     | SQL-like                | JavaScript objects     |
| Example   | Sequelize, TypeORM      | Mongoose               |

---

### Visual Comparison

**ORM (SQL Database):**

```
User Table:
┌────┬───────┬─────┬────────┐
│ id │ name  │ age │ email  │
├────┼───────┼─────┼────────┤
│ 1  │ Alice │ 25  │ a@.com │
│ 2  │ Bob   │ 30  │ b@.com │
└────┴───────┴─────┴────────┘

JavaScript Object:
{
    id: 1,
    name: "Alice",
    age: 25,
    email: "a@.com"
}
```

**ODM (MongoDB):**

```
Users Collection:
{
    _id: ObjectId("..."),
    name: "Alice",
    age: 25,
    email: "a@.com"
}

JavaScript Object:
{
    _id: ObjectId("..."),
    name: "Alice",
    age: 25,
    email: "a@.com"
}
```

---

## 7. MongoDB

### What is MongoDB?

**MongoDB is a NoSQL document database that stores data in JSON-like documents.**

---

### Key Features

```
✅ Document-based (not tables)
✅ Flexible schema (no fixed structure)
✅ Scalable and fast
✅ JSON-like documents (BSON)
✅ No joins needed (embedded documents)
```

---

### MongoDB Structure

```
Database
  ↓
Collection (like SQL table)
  ↓
Document (like SQL row)
  ↓
Field (like SQL column)
```

---

### Example Document

```javascript
{
    _id: ObjectId("507f1f77bcf86cd799439011"),
    name: "Alice",
    age: 25,
    email: "alice@example.com",
    address: {                    // Embedded document
        city: "New York",
        zip: "10001"
    },
    hobbies: ["reading", "gaming"]  // Array
}
```

---

### MongoDB Native Driver

**Using MongoDB without Mongoose (native driver):**

```javascript
import { MongoClient } from "mongodb";

// Connect
const client = await MongoClient.connect("mongodb://localhost:27017");
const db = client.db("myDatabase");
const collection = db.collection("users");

// Insert
await collection.insertOne({ name: "Alice", age: 25 });

// Find
const users = await collection.find({ age: { $gt: 18 } }).toArray();

// Update
await collection.updateOne({ name: "Alice" }, { $set: { age: 26 } });

// Delete
await collection.deleteOne({ name: "Alice" });
```

---

### Advantages of MongoDB

```
✅ Flexible schema (add fields anytime)
✅ Fast for read/write operations
✅ Horizontal scaling (sharding)
✅ Native JSON support
✅ Embedded documents (no joins needed)
✅ Rich query language
```

---

### Disadvantages of MongoDB

```
❌ No ACID transactions (older versions)
❌ No foreign key constraints
❌ Duplicate data (denormalization)
❌ Learning curve for complex queries
❌ Memory intensive
```

---

## 8. Mongoose

### What is Mongoose?

**Mongoose is an ODM (Object-Document Mapping) library for MongoDB and Node.js.**

**Purpose:**

- Provides structure to MongoDB (schemas)
- Validates data before saving
- Simplifies MongoDB operations
- Adds useful features (middleware, virtuals)

---

### Why Use Mongoose?

**Without Mongoose (MongoDB Native Driver):**

```javascript
// No validation, no structure
await collection.insertOne({
  name: "Alice",
  age: "twenty-five", // Wrong type!
  random: "field", // Unexpected field!
});
```

**With Mongoose:**

```javascript
// Schema enforces structure and validation
const user = new User({
  name: "Alice",
  age: "twenty-five", // ❌ Validation error!
});
await user.save(); // Throws error
```

---

### Installation

```bash
npm install mongoose
```

---

### Basic Usage

**1. Connect to Database:**

```javascript
import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/myDatabase");
console.log("Connected to MongoDB");
```

---

**2. Define Schema:**

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
```

---

**3. Create Model:**

```javascript
const User = mongoose.model("User", userSchema);
```

---

**4. CRUD Operations:**

**Create:**

```javascript
const user = new User({
  name: "Alice",
  age: 25,
  email: "alice@example.com",
});

await user.save();

// OR
await User.create({
  name: "Bob",
  age: 30,
  email: "bob@example.com",
});
```

**Read:**

```javascript
// Find all
const users = await User.find();

// Find one
const user = await User.findOne({ email: "alice@example.com" });

// Find by ID
const user = await User.findById("507f1f77bcf86cd799439011");

// Find with conditions
const adults = await User.find({ age: { $gte: 18 } });
```

**Update:**

```javascript
// Update one
await User.updateOne({ email: "alice@example.com" }, { age: 26 });

// Find and update
const user = await User.findOneAndUpdate(
  { email: "alice@example.com" },
  { age: 26 },
  { new: true }, // Return updated document
);

// Find by ID and update
await User.findByIdAndUpdate("507f1f77bcf86cd799439011", { age: 26 });
```

**Delete:**

```javascript
// Delete one
await User.deleteOne({ email: "alice@example.com" });

// Find and delete
await User.findOneAndDelete({ email: "alice@example.com" });

// Find by ID and delete
await User.findByIdAndDelete("507f1f77bcf86cd799439011");
```

---

### Schema Validation

```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    enum: ["Electronics", "Clothing", "Food"],
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);
```

---

### Mongoose Features

**1. Middleware (Hooks):**

```javascript
userSchema.pre("save", function (next) {
  console.log("About to save user:", this.name);
  next();
});

userSchema.post("save", function (doc) {
  console.log("User saved:", doc.name);
});
```

**2. Virtual Properties:**

```javascript
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
```

**3. Custom Methods:**

```javascript
userSchema.methods.greet = function () {
  return `Hello, I'm ${this.name}`;
};

const user = await User.findOne({ name: "Alice" });
console.log(user.greet()); // "Hello, I'm Alice"
```

**4. Static Methods:**

```javascript
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const user = await User.findByEmail("alice@example.com");
```

---

## 9. MongoDB vs Mongoose

### Comparison Table

| Feature        | MongoDB Native Driver | Mongoose        |
| -------------- | --------------------- | --------------- |
| Type           | Database driver       | ODM library     |
| Schema         | No schema             | Schema required |
| Validation     | Manual                | Built-in        |
| Complexity     | Simple, direct        | Feature-rich    |
| Performance    | Faster                | Slightly slower |
| Learning Curve | Easier                | Moderate        |
| Use Case       | Simple projects       | Complex apps    |

---

### Code Comparison

**MongoDB Native Driver:**

```javascript
import { MongoClient } from "mongodb";

const client = await MongoClient.connect("mongodb://localhost:27017");
const db = client.db("myDB");
const users = db.collection("users");

// Insert (no validation)
await users.insertOne({ name: "Alice", age: 25 });

// Find
const allUsers = await users.find().toArray();
```

**Mongoose:**

```javascript
import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/myDB");

// Schema with validation
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
});

const User = mongoose.model("User", userSchema);

// Insert (with validation)
await User.create({ name: "Alice", age: 25 });

// Find
const allUsers = await User.find();
```

---

### When to Use MongoDB Native Driver

```
✅ Simple CRUD operations
✅ Prototyping/learning
✅ Maximum performance needed
✅ Flexible schema preferred
✅ Small projects
```

---

### When to Use Mongoose

```
✅ Large applications
✅ Need data validation
✅ Complex relationships
✅ Team collaboration (schema documentation)
✅ Need middleware/hooks
✅ Want built-in features
```

---

## Summary

### Environment Variables

```
.env file          → Stores key=value pairs
dotenv module      → Loads .env into process.env
process.env        → Global object with env vars
config()           → Function to load .env file
```

---

### Database Tools

```
ORM    → For SQL databases (Sequelize, TypeORM)
ODM    → For NoSQL databases (Mongoose)
MongoDB → NoSQL document database
Mongoose → ODM for MongoDB with schemas
```

---

### Quick Reference

**dotenv Setup:**

```javascript
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
```

**MongoDB Native:**

```javascript
import { MongoClient } from "mongodb";
const client = await MongoClient.connect(uri);
const db = client.db("myDB");
```

**Mongoose:**

```javascript
import mongoose from "mongoose";
await mongoose.connect(uri);

const schema = new mongoose.Schema({ name: String });
const Model = mongoose.model("Model", schema);
```
