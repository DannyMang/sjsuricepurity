import mongoose from 'mongoose';

// Define the proper type for connection cache
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the NodeJS global type
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      mongoose?: MongooseConnection;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Use a proper typed reference to the global object
const globalWithMongoose = global as NodeJS.Global & {
  mongoose?: MongooseConnection;
};

// Initialize the connection cache
const cached: MongooseConnection = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

// Initialize global mongoose if not already defined
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
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

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Define schemas
export const TestResultSchema = new mongoose.Schema({
  score: Number,
  answers: [Boolean],
  timestamp: { type: Date, default: Date.now }
});

export const TestResult = mongoose.models.TestResult || mongoose.model('TestResult', TestResultSchema);

export default connectDB;