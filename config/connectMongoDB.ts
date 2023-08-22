import mongoose from "mongoose";

// Checks for mongoDB uri
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

// Variables
const MONGODB_URI: string = process.env.MONGODB_URI;
let globalWithMongoose = global as typeof globalThis & {
  mongoose: any;
};
let cached = globalWithMongoose.mongoose;

// Checks for cached conn
if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

// Connect to mongoDB
async function dbConnect() {
  // If cached, return conn
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
