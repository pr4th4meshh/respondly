"use client"

import { useSession } from "next-auth/react"
import Image, { ImageProps } from "next/image"
import { useState, useEffect, FormEvent } from "react"

interface IProfileForm {
  user: {
    name: string
    email: string
    profilePhoto: string
  }
  onSubmit: (value: {
    username: string
    email: string
    password: string
    profilePhoto: string
  }) => void
}

const ProfileForm = ({ user, onSubmit }: IProfileForm) => {
  const [username, setUsername] = useState(user?.name || "")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState(user?.email || "")
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "")
  const { update } = useSession()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Call onSubmit prop with updated user data
    onSubmit({ username, email, password, profilePhoto })
    try {
      // Refresh session to get the latest user data
      await update()
      console.log("Session updated successfully.")
    } catch (error) {
      console.error("Failed to update session:", error)
    }
  }

  return (
    <div className="mr-10 border border-gray-800 p-2 sm:p-8 rounded-lg">
      <h1 className="text-center text-3xl font-bold text-blue-300 sm:text-3xl">
        Edit Profile:
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-0 mt-0 space-y-4 rounded-lg p-1 sm:p-6 lg:p-8 text-gray-300"
      >
        <div className="flex justify-center">
          <Image
            alt="Profile Photo"
            src={
              profilePhoto ||
              "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRlZmF1bHQlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
            }
            height={120}
            width={120}
            className="rounded-full"
          />
        </div>
        <div>
          <label htmlFor="username" className="">
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mb-2 mt-1"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mb-2 mt-1"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mb-2 mt-1"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
        >
          Confirm Edit
        </button>
      </form>
    </div>
  )
}

export default ProfileForm
