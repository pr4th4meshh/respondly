"use client"

import CreateForm from "@/components/CreateForm"
import Popup from "@/components/Popup"
import { IForm } from "@/models/Form"
import React, { useEffect, useState } from "react"

const CreateNewForm = () => {
  const [forms, setForms] = useState<IForm[]>([])
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedForm, setSelectedForm] = useState<IForm | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Toast Message States
  const [messagePopupType, setMessagePopupType] = useState<
    "success" | "error" | "warning"
  >("success")
  const [popupMessage, setPopupMessage] = useState("")
  const [showMessagePopup, setShowMessagePopup] = useState(false)

  const closePopup = () => {
    setShowMessagePopup(false)
  }

  // Fetch forms from the API
  const fetchForms = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/forms")
      const data = await response.json()
      if (response.ok) {
        setForms(data.data) // Set forms to state
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

  const handleCreateForm = async (newFormData: IForm) => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      })

      if (response.ok) {
        // Refetch forms after adding a new one
        fetchForms()

        // Show success message
        setSuccessMessage("Form created successfully!")
        setShowMessagePopup(true)
        setPopupMessage("Form created successfully!")
        setMessagePopupType("success")
      } else {
        const errorData = await response.json()
        console.error("Failed to add form:", errorData.error)
      }
    } catch (error) {
      console.error("Error adding form:", error)
    }
  }

  return (
    <div className="min-h-hero-height h-auto bg-gray-900 flex justify-center items-center">
      <Popup
        type={messagePopupType}
        message={popupMessage}
        show={showMessagePopup}
        onClose={closePopup}
      />
      <CreateForm onSuccess={successMessage} onSubmit={handleCreateForm} />
    </div>
  )
}

export default CreateNewForm
