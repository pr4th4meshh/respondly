import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import Form from "@/models/Form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import User from "@/models/User"
import { Session } from "next-auth"

async function getUserFromSession(session: Session) {
  const userEmail = session.user?.email
  if (!userEmail) return null
  return await User.findOne({ email: userEmail })
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session)
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )

    await connectToDatabase()
    const user = await getUserFromSession(session)
    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )

    const data = await req.json()
    console.log("Incoming data:", data)

    if (
      !data.title ||
      !Array.isArray(data.fields) ||
      data.fields.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid form data" },
        { status: 400 }
      )
    }

    const validatedFields = data.fields.map(
      (field: {
        label: string
        type: string
        options: string[]
        requiredField: boolean
      }) => {
        console.log("Processing field:", field) // Log each field being processed
        return {
          label: field.label,
          type: field.type,
          options: field.options || [],
          requiredField:
            field.requiredField === undefined ? false : field.requiredField,
        }
      }
    )

    const form = new Form({
      title: data.title,
      creator: user._id,
      fields: validatedFields,
    })

    console.log(" form before saving:", form)

    await form.save()

    console.log("saved form", form)

    return NextResponse.json(
      { success: true, data: form, link: `/forms/${form._id}` },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error saving form:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// GET - Fetch forms created by the logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    if (!session)
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    // getting server session

    const user = await getUserFromSession(session)
    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    // getting user from session

    const forms = await Form.find({ creator: user._id })
    // finding user's form to user

    return NextResponse.json({ success: true, data: forms }, { status: 200 })
    // return data to user frontend
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// DELETE - Delete a form by ID
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session)
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )

    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id)
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      )

    const user = await getUserFromSession(session)
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    // dont delete form until its of the owner

    const form = await Form.findOneAndDelete({ _id: id, creator: user._id })
    // find form to delete
    if (!form)
      return NextResponse.json(
        { error: "Form not found or unauthorized" },
        { status: 404 }
      )

    return NextResponse.json(
      { success: true, message: "Form deleted successfully" },
      { status: 200 }
    )
    // return 200 for success deletion
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
