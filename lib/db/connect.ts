import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

// Reuse connection across hot reloads in dev
const globalWithMongoose = global as typeof globalThis & {
  _mongooseConn: mongoose.Connection | null;
  _mongoosePromise: Promise<mongoose.Connection> | null;
};

if (!globalWithMongoose._mongooseConn) globalWithMongoose._mongooseConn = null;
if (!globalWithMongoose._mongoosePromise) globalWithMongoose._mongoosePromise = null;

export async function dbConnect(): Promise<mongoose.Connection> {
  if (globalWithMongoose._mongooseConn) {
    return globalWithMongoose._mongooseConn;
  }

  if (!globalWithMongoose._mongoosePromise) {
    globalWithMongoose._mongoosePromise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m.connection);
  }

  globalWithMongoose._mongooseConn = await globalWithMongoose._mongoosePromise;
  return globalWithMongoose._mongooseConn;
}
