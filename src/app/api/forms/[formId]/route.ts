import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Form from "@/models/Form";

export async function GET(req: NextRequest, { params }: { params: { formId: string } }) {
  try {
    await connectToDatabase();
    const { formId } = params;

    // Validate formId
    if (!formId || !/^[0-9a-fA-F]{24}$/.test(formId)) {
      return NextResponse.json(
        { success: false, error: "Invalid form ID" },
        { status: 400 }
      );
    }

    const form = await Form.findById(formId);

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: form },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
};
export async function PUT(request: NextRequest, { params }: { params: { formId: string } }) {
  try {
    await connectToDatabase();
    const { formId } = params;

    // Validate formId
    if (!formId || !/^[0-9a-fA-F]{24}$/.test(formId)) {
      return NextResponse.json(
        { success: false, error: "Invalid form ID" },
        { status: 400 }
      );
    }

    // Get the data from the request body
    const { title, fields } = await request.json();

    // Validate the data
    if (!title || !Array.isArray(fields)) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Update the form
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { title, fields },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedForm });
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update form" },
      { status: 500 }
    );
  }
}