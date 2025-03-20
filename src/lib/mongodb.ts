/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Mongoose } from 'mongoose';

const url = process.env.MONGODB_URI;

if (!url) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Add connection cache to the global object
let cached: Cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn; // Return existing connection

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(url as string) // No need to pass options like `useNewUrlParser`
      .then((mongoose) => {
        console.log('MongoDB connected.');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise; // Wait for connection
  return cached.conn;
}
