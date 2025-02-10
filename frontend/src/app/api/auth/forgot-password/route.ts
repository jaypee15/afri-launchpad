import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateOTP, sendPasswordResetEmail } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    const otp = generateOTP();

    // Store reset OTP
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          resetOtp: otp,
          resetOtpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      }
    );

    // Send reset email
    await sendPasswordResetEmail(email, otp);

    return NextResponse.json({ message: "Reset code sent to email" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 