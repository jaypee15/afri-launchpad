import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, password } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Verify OTP
    const user = await usersCollection.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(password, 12);

    // Update password and remove reset OTP
    await usersCollection.updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { resetOtp: "", resetOtpExpires: "" },
      }
    );

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 