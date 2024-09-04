import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db" // Utility to connect to MongoDB
import Form from "@/models/Form" // Your form model
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth" // NextAuth options
import User from "@/models/User"

// POST - Create a new form
export async function POST(req: NextRequest) {
  try {
    // Fetch the session to verify user authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to the MongoDB database
    await connectToDatabase();

    // Get the user's email from the session
    const userEmail = session.user.email;

    // Find the user by email to get the ObjectId
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Parse the incoming request data
    const data = await req.json();

    // Create the form with the creator's ObjectId
    const form = new Form({
      ...data,
      creator: user._id, // Set the creator as the user's ObjectId
    });

    // Save the form to the database
    await form.save();

    // Respond with the created form data
    return NextResponse.json(
      { success: true, data: form, link: `/forms/${form._id}` },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle any errors during form creation
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// GET - Fetch forms created by the logged-in user
export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the session to access the authenticated user's email
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Extract the user's email from the session
    const userEmail = session.user.email;

    // Find the user in the database by email to get their ObjectId
    const user = await User.findOne({ email: userEmail });

    // If user not found, return an error
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Use the user's ObjectId to find forms created by this user
    const forms = await Form.find({ creator: user._id });

    // Return the forms in the response
    return NextResponse.json(
      { success: true, data: forms },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors and return a detailed message
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Delete a form by ID
export async function DELETE(req: NextRequest) {
  try {
    // Verify the session to check user authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to the MongoDB database
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    // Log ID and session user ID for debugging
    console.log("1)Deleting form with ID:", id);
    console.log("2)Session user ID:", session.user?.email);

        // Find user by email to get ObjectId
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
    

    // Find and delete the form
    const form = await Form.findOneAndDelete({
      _id: id,
      creator: user._id,
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Form deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}