import connectToDatabase from "./db";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
      credentials({
        name: "Credentials",
        id: "credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            await connectToDatabase()
            const user = await User.findOne({
              email: credentials?.email,
            }).select("+password")
  
            if (!user) {
              throw new Error("Email or password is incorrect.")
            }
  
            const passwordMatch = await bcrypt.compare(
              credentials!.password,
              user.password
            )
  
            if (!passwordMatch) {
              throw new Error("Email or password is incorrect.")
            }
            
            // Return user if everything is fine
            return user
          } catch (error: any) {
            console.error("Authorization error:", error.message)
            throw new Error(error.message || "An error occurred during authentication.")
          }
        },
      }),
    ],
    session: {
      strategy: "jwt",
      maxAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
      signIn: "/login",
      error: "/auth/error", // Custom error page
    },
  }