import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | null = null;

export async function connectDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  connection ??= mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true
  });

  return connection;
}
