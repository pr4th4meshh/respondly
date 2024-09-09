import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const {
    email, // Current email to identify the user
    newEmail,
    newName: name,
    newPassword: password,
    profilePhoto,
  } = await request.json();

  // Validate that email is provided
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  // Connect to the database
  await connectToDatabase();

  try {
    // Find the user by the current email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prepare update object
    const updateData: any = { name, profilePhoto };

    // Update email only if a new email is provided
    if (newEmail) {
      updateData.email = newEmail;
    }

    // Update password only if a new password is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true } // Return the updated document
    );

    return NextResponse.json(
      { message: "User Updated", data: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}