import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Response from "@/models/Response";
import Form from "@/models/Form";

// POST - Save a response for a specific form
export async function POST(req: NextRequest, { params }: { params: { formId: string } }) {
    try {
      await connectToDatabase();
      const { formId } = params;

      // Ensure the form exists
      const form = await Form.findById(formId);
      if (!form) {
        return NextResponse.json(
          { success: false, error: "Form not found" },
          { status: 404 }
        );
      }

      // Parse the incoming request data
      const { responses } = await req.json();
      console.log("Incoming Responses:", responses); // Add this line for debugging

      // Validate the responses format
      if (!Array.isArray(responses) || responses.some(r => typeof r.label !== 'string' || typeof r.answer !== 'string')) {
        return NextResponse.json(
          { success: false, error: "Invalid responses format" },
          { status: 400 }
        );
      }

      // Create a new response document
      const response = new Response({
        form: formId,
        responses,
      });

      // Save the response to the database
      await response.save();

      return NextResponse.json(
        { success: true, data: response },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
}

// GET - Fetch all responses for a specific form
export async function GET(req: NextRequest, { params }: { params: { formId: string } }) {
  try {
    await connectToDatabase();
    const { formId } = params;

    // Validate the form ID format
    if (!formId || !/^[0-9a-fA-F]{24}$/.test(formId)) {
      return NextResponse.json(
        { success: false, error: "Invalid form ID" },
        { status: 400 }
      );
    }

    // Fetch all responses associated with the form ID
    const responses = await Response.find({ form: formId });

    if (!responses.length) {
      return NextResponse.json(
        { success: false, error: "No responses found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: responses },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}