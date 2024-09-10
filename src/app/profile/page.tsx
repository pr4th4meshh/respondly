"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import ProfileForm from "./_components/ProfileForm"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ButtonComponent from "@/components/ButtonComponent"
import ConfirmModal from "@/components/ConfirmModal"
import { IoAddCircleOutline } from "react-icons/io5"

interface IForm {
  _id: string
  title: string
}
interface IUpdatedUserData {
  username: string
  email: string
  password: string
  profilePhoto: string
}

const ProfilePage = () => {
  const [forms, setForms] = useState<IForm[]>([])
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedForm, setSelectedForm] = useState<IForm | null>(null)
  const { data: session, update } = useSession()

  if (!session?.user) {
    return (
      <div className="h-hero-height bg-gray-900 flex justify-center items-center flex-col">
        <h1 className="text-3xl text-blue-300 mb-2">
          You need to login to view your profile!
        </h1>
        <Link href="/login">
          <ButtonComponent
            buttonBg="bg-blue-300"
            buttonTitle="Login to continue"
          />
        </Link>
      </div>
    )
  }

  // Edit user info handler
  const handleEditUser = async (updatedUserData: IUpdatedUserData) => {
    try {
      const currentEmail = session?.user?.email // fetching the current email from the session
      if (!currentEmail) {
        console.error("Current email is required to update user")
        return
      }

      // prepare the data to send to the API
      const {
        username,
        email: newEmail,
        password,
        profilePhoto,
      } = updatedUserData

      // update user by email
      const response = await fetch(`/api/users`, {
        // Adjust endpoint if needed
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentEmail, // Use current email to identify the user
          newEmail, // New email to update
          newName: username,
          newPassword: password,
          profilePhoto,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert("Profile updated successfully!")
        console.log(result)
        await update()
      } else {
        const errorData = await response.json()
        console.error("Failed to update user:", errorData.message)
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  // fetching forms from the API
  const fetchForms = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/forms")
      const data = await response.json()
      if (response.ok) {
        setForms(data.data)
      } else {
        console.error("Failed to fetch forms:", data.error)
      }
    } catch (error) {
      console.error("Error fetching forms:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch forms on component mount
  useEffect(() => {
    fetchForms()
  }, [])

  // Handle showing delete confirmation popup
  const handleShowDeletePopup = (form: IForm) => {
    setSelectedForm(form)
    setShowPopup(true)
  }

  // Hide delete confirmation popup without deleting
  const handleCancelDelete = () => {
    setSelectedForm(null)
    setShowPopup(false)
  }

  // Confirm and delete the form
  const handleConfirmDelete = async () => {
    if (selectedForm) {
      try {
        const response = await axios.delete(`/api/forms?id=${selectedForm._id}`)
        if (response.status === 200) {
          setForms((prevForms) =>
            prevForms.filter((form) => form._id !== selectedForm._id)
          )
          handleCancelDelete()
        }
      } catch (error) {
        console.error("Failed to delete form:", error)
      }
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="text-center py-16">
        <h1 className="text-3xl sm:text-5xl text-blue-300">
          Welcome to your profile!
        </h1>
      </header>
      <main className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            {/* Pass the complete user object to ProfileForm */}
            {session?.user?.email && (
              <ProfileForm onSubmit={handleEditUser} user={session?.user} />
            )}
          </div>
          <div className="lg:w-1/2 bg-gray-800 p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-blue-300">Your Forms:</h2>
              <Link href="/form/create">
                <ButtonComponent
                  buttonTitle="Create form"
                  buttonBg="bg-blue-600"
                  icon={<IoAddCircleOutline className="mr-1 text-lg" />}
                />
              </Link>
            </div>
            {loading ? (
              <p className="text-center text-lg text-gray-400">
                Loading forms...
              </p>
            ) : forms.length > 0 ? (
              <ul className="space-y-4">
                {forms.map((form) => (
                  <li
                    key={form._id}
                    className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                  >
                    <Link href={`/form/${form._id}`}>
                      <h3 className="text-lg text-blue-300">{form.title}</h3>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleShowDeletePopup(form)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-xl text-gray-400">
                No forms available
              </p>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showPopup && selectedForm && (
          <ConfirmModal
            title="Are you sure you want to delete this form?"
            subTitle="This action cannot be undone."
            actionName="Confirm"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </main>
    </div>
  )
}

export default ProfilePage
