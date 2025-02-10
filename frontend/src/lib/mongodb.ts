import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Set up indexes when the client connects
clientPromise.then(async (client) => {
  try {
    const db = client.db();
    const usersCollection = db.collection("users");

    // Create indexes
    await usersCollection.createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
      { key: { otp: 1 }, sparse: true },
      { key: { resetOtp: 1 }, sparse: true },
      { key: { otpExpires: 1 }, sparse: true, expireAfterSeconds: 600 }, // 10 minutes
      { key: { resetOtpExpires: 1 }, sparse: true, expireAfterSeconds: 600 }, // 10 minutes
    ]);

    console.log("MongoDB indexes created successfully");
  } catch (error) {
    // Ignore duplicate index errors
    if (!(error as any).code === 85) {
      console.error("Error creating MongoDB indexes:", error);
    }
  }
});

export default clientPromise; 