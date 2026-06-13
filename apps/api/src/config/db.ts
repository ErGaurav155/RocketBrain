import mongoose from "mongoose";
import { env } from "./env.js";

let connection: Promise<typeof mongoose> | null = null;

export function connectDb() {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  connection ??= mongoose.connect(env.MONGODB_URI, {
    autoIndex: true
  });

  return connection;
}
