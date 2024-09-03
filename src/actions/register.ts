"use server"
import connectToDatabase from "../lib/db"
import User from "../models/User"
import bcrypt from "bcryptjs"

export const register = async (values: any) => {
  const { email, password, name } = values

  try {
    await connectToDatabase()
    const userFound = await User.findOne({ email })
    if (userFound) {
      return {
        error: "Email already exists!",
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })
    const savedUser = await user.save()

    // Return the saved user or other information as needed
    return { success: true, user: savedUser }
  } catch (e) {
    console.log(e)
    return { error: "Registration failed" }
  }
}