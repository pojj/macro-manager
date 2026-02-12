import mongoose from "mongoose";
import "@models/ingredient";
import "@models/meal";
import "@models/recipe";
import "@models/user";

let isConnected = false;

export default async function connectToDB() {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DBNAME,
    });

    isConnected = true;
  } catch (error) {
    console.log(error);
  }
}
