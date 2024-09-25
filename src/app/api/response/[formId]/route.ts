import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Form from "@/models/Form";

// POST - Save responses for a specific form
export async function POST(req: NextRequest, { params }: { params: { formId: string } }) {
  try {
    await connectToDatabase();
    const { formId } = params;

    // Find the form by ID
    const form = await Form.findById(formId);
    if (!form) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    // Parse the incoming request body
    const { responses } = await req.json();

    // Validate the responses format
    if (!Array.isArray(responses) || responses.some(r => typeof r.label !== 'string' || typeof r.value !== 'string')) {
      return NextResponse.json({ success: false, error: "Invalid responses format" }, { status: 400 });
    }

    // Add the new responses to the form's existing responses
    form.responses.push(...responses);
    await form.save();

    return NextResponse.json({ success: true, data: form.responses }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// GET - Fetch all responses for a specific form
export async function GET(req: NextRequest, { params }: { params: { formId: string } }) {
  try {
    await connectToDatabase();
    const { formId } = params;

    // Validate form existence
    const form = await Form.findById(formId).select("responses");
    if (!form) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: form.responses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}