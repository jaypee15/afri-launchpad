import clientPromise from './mongodb';

export async function setupDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Drop existing indexes to avoid conflicts
    await usersCollection.dropIndexes();

    // Create indexes
    await usersCollection.createIndexes([
      { 
        key: { email: 1 }, 
        unique: true,
        name: 'email_unique' 
      },
      { 
        key: { otp: 1 }, 
        sparse: true,
        name: 'otp_index'
      },
      { 
        key: { resetOtp: 1 }, 
        sparse: true,
        name: 'reset_otp_index'
      },
      { 
        key: { otpExpires: 1 }, 
        sparse: true, 
        expireAfterSeconds: 600,
        name: 'otp_ttl'
      },
      { 
        key: { resetOtpExpires: 1 }, 
        sparse: true, 
        expireAfterSeconds: 600,
        name: 'reset_otp_ttl'
      },
      {
        key: { "profile.location": 1 },
        sparse: true,
        name: 'location_index'
      },
      {
        key: { "profile.interests": 1 },
        sparse: true,
        name: 'interests_index'
      }
    ]);

    console.log("MongoDB indexes created successfully");
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}

// Initialize database
setupDatabase().catch(console.error); 