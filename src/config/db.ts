import mongoose from "mongoose";

export async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Mongo connection is successfully");
  } catch (error) {
    console.error("Mongo db connection Error!", error);
    process.exit(1);
  }
}
