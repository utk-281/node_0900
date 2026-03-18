import mongoose from "mongoose";

const connectDB = async () => {
  let client = await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected to:", client.connection.host);
};

export default connectDB;
