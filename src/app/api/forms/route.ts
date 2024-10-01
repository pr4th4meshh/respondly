import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Form from "@/models/Form";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

// Common function to get user by session
async function getUserFromSession(session) {
  const userEmail = session.user?.email;
  if (!userEmail) return null;
  return await User.findOne({ email: userEmail });
}

// POST - Create a new form
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    // get server session

    await connectToDatabase();
    const user = await getUserFromSession(session);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    // get user using session

    const data = await req.json(); // get data to send to backend

    const form = new Form({ title: data.title, creator: user._id, fields: data.fields });
    await form.save(); // save data on backend

    return NextResponse.json({ success: true, data: form, link: `/forms/${form._id}` }, { status: 201 });
    // return success req to user
  } catch (error) {
    console.error("Error saving form:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// GET - Fetch forms created by the logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    // getting server session

    const user = await getUserFromSession(session);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    // getting user from session

    const forms = await Form.find({ creator: user._id });
    // finding user's form to user

    return NextResponse.json({ success: true, data: forms }, { status: 200 });
    // return data to user frontend
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE - Delete a form by ID
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Form ID is required" }, { status: 400 });

    const user = await getUserFromSession(session);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    // dont delete form until its of the owner

    const form = await Form.findOneAndDelete({ _id: id, creator: user._id });
    // find form to delete
    if (!form) return NextResponse.json({ error: "Form not found or unauthorized" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Form deleted successfully" }, { status: 200 });
    // return 200 for success deletion
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
