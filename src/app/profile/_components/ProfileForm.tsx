"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { useState, FormEvent } from "react"
import { IoLogOutOutline, IoPersonOutline, IoMailOutline, IoLockClosedOutline } from "react-icons/io5"
import ButtonComponent from "@/components/ButtonComponent"

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
    onSubmit({ username, email, password, profilePhoto })
    try {
      await update()
      console.log("Session updated successfully.")
    } catch (error) {
      console.error("Failed to update session:", error)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-300">Edit Profile:</h1>
            <ButtonComponent
              buttonBg="bg-red-500 hover:bg-red-600"
              buttonTitle="Log Out"
              className="text-sm px-4 py-2"
              onClick={handleLogout}
              icon={<IoLogOutOutline className="text-xl mr-1" />}
            />
          </div>

          <div className="flex justify-center mb-6">
            <Image
              alt="Profile Photo"
              src={profilePhoto || "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRlZmF1bHQlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"}
              height={120}
              width={120}
              className="rounded-full border-2 border-blue-300"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoPersonOutline className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  className="bg-gray-800 text-white block w-full pl-10 pr-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoMailOutline className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-800 text-white block w-full pl-10 pr-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoLockClosedOutline className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="bg-gray-800 text-white block w-full pl-10 pr-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Confirm Edit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileForm;