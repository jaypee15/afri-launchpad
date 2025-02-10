import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // For MVP, we'll use a simple data URL approach
    // In production, you should use a proper file storage service like S3
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${image.type};base64,${base64Image}`;

    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          "profile.avatar": dataUrl,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ 
      message: "Avatar updated successfully",
      avatar: dataUrl
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 