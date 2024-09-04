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
}
