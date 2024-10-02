import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import Form from "@/models/Form"
import Response from "@/models/Response"

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await connectToDatabase()
    const { formId } = params

    // Validate formId
    if (!formId || !/^[0-9a-fA-F]{24}$/.test(formId)) {
      return NextResponse.json(
        { success: false, error: "Invalid form ID" },
        { status: 400 }
      )
    }

    const form = await Form.findById(formId)

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: form }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { formId: string } }) {
  try {
    await connectToDatabase();
    console.log("Connected to the database");

    const { formId } = params;
    console.log("Form ID:", formId);

    if (!formId || !/^[0-9a-fA-F]{24}$/.test(formId)) {
      return NextResponse.json({ success: false, error: "Invalid form ID" }, { status: 400 });
    }

    const { title, fields } = await request.json();
    console.log("Received data:", { title, fields });

    if (!title || !Array.isArray(fields)) {
      return NextResponse.json({ success: false, error: "Invalid input data" }, { status: 400 });
    }

    console.log("Updating form with ID:", formId);
    const form = await Form.findById(formId);

    if (!form) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    // Create a map of old labels to new labels
    const labelMap = {};
    fields.forEach(newField => {
      const oldField = form.fields.find(f => f._id.toString() === newField._id.toString());
      if (oldField && oldField.label !== newField.label) {
        labelMap[oldField.label] = newField.label;
      }
    });

    console.log("Label map:", labelMap);

    // Update form fields
    form.title = title;
    form.fields = fields;

    // Update response labels
    if (form.responses && form.responses.length > 0) {
      form.responses = form.responses.map(response => {
        if (labelMap[response.label]) {
          console.log(`Updating response label from "${response.label}" to "${labelMap[response.label]}"`);
          response.label = labelMap[response.label];
        }
        return response;
      });
    }

    // Save the updated form
    const updatedForm = await form.save();
    console.log("Updated form:", JSON.stringify(updatedForm, null, 2));

    return NextResponse.json({ success: true, data: updatedForm });
  } catch (error) {
    console.error("Error updating form and responses:", error.message, error.stack);
    return NextResponse.json({ success: false, error: "Failed to update form and responses" }, { status: 500 });
  }
}