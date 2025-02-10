import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { generateOTP, sendVerificationEmail } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedPassword = await hash(password, 12);

    // Create user
    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`, // Keep full name for display purposes
      emailVerified: false,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        bio: "",
        location: "",
        interests: [],
        avatar: ""
      }
    });

    // Send verification email
    await sendVerificationEmail(email, otp);

    return NextResponse.json({ 
      message: "OTP sent to email"
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { email, otp } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await usersCollection.updateOne(
      { email },
      {
        $set: { 
          emailVerified: true,
          updatedAt: new Date()
        },
        $unset: { otp: "", otpExpires: "" },
      }
    );

    return NextResponse.json({ 
      message: "Email verified successfully",
      username: user.username
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 