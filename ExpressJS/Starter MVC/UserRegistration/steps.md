# Express + MongoDB Project Setup Flow

### Step-by-Step Guide

---

## Step 1: Create Project Folder

Create a new folder for your project:

```bash
mkdir project-name
cd project-name
```

---

## Step 2: Create package.json

Initialize the project:

```bash
npm init -y    # Quick initialization
# OR
npm init       # Interactive initialization
```

**Result:** Creates `package.json` file

**Important:** Add `"type": "module"` to enable ES6 imports

---

## Step 3: Install Required Modules

Install dependencies:

```bash
npm install express mongodb dotenv
npm install nodemon --save-dev  # Optional, for development
```

---

## Step 4: Create .env File

Create `.env` file in project root and define sensitive information:

```
PORT=9000
MONGO_URI=mongodb://localhost:27017
DB_NAME=userReg
```

**Note:** Don't commit this file to version control

---

## Step 5: Create Config Folder

**5a) config/index.js** (mandatory filename)

- Import and configure dotenv module
- This file runs when config folder is imported

**5b) config/database.js**

- Define database connection
- Export connection function

---

## Step 6: Create Main File

Create `server.js` (or `app.js` or `index.js`):

- Import express
- Create app instance
- Add middleware (express.urlencoded, express.json)
- Will import router later (step 11)

---

## Step 7: Start Server

Start the server with configurations:

```bash
node server.js
# OR
npm run dev  # If using nodemon
```

**At this point:**

- Server runs successfully
- Database connection ready
- No routes defined yet

---

## Step 8: Create Models Folder

- Define schema (if using Mongoose)
- Export schema/model
- This project uses native MongoDB driver, so schemas are optional

---

## Step 9: Create Controllers Folder

**controllers/controller.js:**

- Import required schema/database connection
- Define CRUD operations:
  - Create (insert data)
  - Read (fetch data)
  - Update (modify data)
  - Delete (remove data)
- Export all controller functions

---

## Step 10: Create Router Folder

**routes/routes.js:**

**a) Import Router:**

```javascript
import { Router } from "express";
```

**b) Import controllers:**

```javascript
import { controller1, controller2 } from "../controllers/controller.js";
```

**c) Create router instance:**

```javascript
const router = Router();
```

**d) Define all endpoints:**

```javascript
router.get("/endpoint", controller1);
router.post("/endpoint", controller2);
```

**e) Export router:**

```javascript
export default router;
```

---

## Step 11: Import Router in Main File

**server.js:**

Import the router file manually:

```javascript
import routesFile from "./routes/routes.js";
```

Use it in middleware with API versioning:

```javascript
app.use("/api/v1", routesFile);
```

**URL structure:**

```
http://localhost:PORT/api/v1/endpoint
```

---

## Step 12: Repeat for Different Models

For each new resource (users, products, orders, etc.):

- Repeat Step 8: Create model
- Repeat Step 9: Create controller
- Repeat Step 10: Create router
- Repeat Step 11: Import and use router in server.js

---

## Complete Project Structure

```
project/
├── config/
│   ├── index.js           # dotenv config (mandatory filename)
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── controller.js      # User controllers
│   ├── productController.js
│   └── orderController.js
├── routes/
│   ├── routes.js          # User routes
│   ├── productRoutes.js
│   └── orderRoutes.js
├── models/                # Optional with native MongoDB
│   ├── User.js
│   └── Product.js
├── pages/
│   └── form.html
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js              # Main application file
```

---

## API Versioning Pattern

```
http://localhost:9000/api/v1/users
http://localhost:9000/api/v1/products
http://localhost:9000/api/v2/users      # Future version
```

**In server.js:**

```javascript
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
```

---

## Request Flow

```
1. User makes request
   ↓
2. Express receives request
   ↓
3. Middleware processes (urlencoded, json)
   ↓
4. Router matches endpoint
   ↓
5. Controller function executes
   ↓
6. Database operation (if needed)
   ↓
7. Response sent to user
```

## Your Actual Code Examples

### config/database.js

```javascript
import { MongoClient } from "mongodb";

async function connectDB() {
  let client = await MongoClient.connect("mongodb://localhost:27017");
  let database = client.db("userReg");
  let collection = await database.createCollection("users");
  return collection;
}

export default connectDB;
```

---

### controllers/controller.js

```javascript
import fs from "node:fs";
import path from "node:path";
import connectDB from "../config/database-config.js";

export const displayHomePage = (req, res, next) => {
  res.send("<h1>this is home page!!!!</h1>");
};

export const displayFormPage = (req, res, next) => {
  fs.createReadStream(
    path.join(import.meta.dirname, "..", "pages", "form.html"),
    "utf-8",
  ).pipe(res);
};

export const submitForm = async (req, res, next) => {
  console.log("req.body: ", req.body);
  let { userEmail, userPassword } = req.body;

  let myColl = await connectDB();
  let op = await myColl.insertOne({ userEmail, userPassword });

  res.status(201).json({
    success: true,
    message: "User registered Successfully",
    data: { userEmail, userPassword },
    op,
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    let myColl = await connectDB();
    let users = await myColl.find().toArray();

    if (users.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "no users found" });

    res.status(200).json({
      success: true,
      message: "all users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("error occurred while fetching all users");
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

### routes/routes.js

```javascript
import { Router } from "express";

import {
  displayFormPage,
  displayHomePage,
  getAllUsers,
  submitForm,
} from "../controllers/controller.js";

const router = Router();

router.get("/", displayHomePage);
router.get("/get-form", displayFormPage);
router.post("/register", submitForm);
router.get("/all", getAllUsers);

export default router;
```

---

### server.js

```javascript
import express from "express";
import routesFile from "./routes/routes.js";

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", routesFile);

app.listen(9000, (err) => {
  if (err) console.log(err);
  console.log("server running at port 9000");
});
```

---

### pages/form.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Registration</title>
  </head>
  <body>
    <h1>fill this form</h1>
    <form action="/api/v1/register" method="post">
      email: <input type="text" name="userEmail" />
      <br />
      password: <input type="text" name="userPassword" />
      <br />
      <button>submit</button>
    </form>
  </body>
</html>
```

---

## API Endpoints

```
GET  http://localhost:9000/api/v1/              → Home page
GET  http://localhost:9000/api/v1/get-form      → Registration form
POST http://localhost:9000/api/v1/register      → Submit form
GET  http://localhost:9000/api/v1/all           → Get all users
```
