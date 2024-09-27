"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface FormField {
  label: string
  type: string
}

interface FormResponse {
  _id: string
  label: string
  value: string | number
}

interface FormData {
  _id: string
  title: string
  fields: FormField[]
  responses: FormResponse[]
}

const ResponsePage: React.FC = ({ params }) => {
  const router = useRouter()
  const formId = params.formId
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFormData = async () => {
      if (formId) {
        try {
          const response = await axios.get(`/api/response/${formId}`)
          setFormData(response.data)
        } catch (err) {
          setError("Failed to fetch form data")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchFormData()
  }, [formId])

  if (loading)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center text-3xl">
        Loading...
      </div>
    )
  if (error)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center text-3xl">
        {error}
      </div>
    )
  if (formData?.data.length === 0)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center text-3xl">
        No responses available to display
      </div>
    )

  // Group responses by label
  const groupedResponses = formData?.data.reduce((acc, response) => {
    const { label, value } = response
    if (!acc[label]) {
      acc[label] = []
    }
    acc[label].push(value)
    return acc
  }, {} as Record<string, (string | number)[]>)

  return (
    <div className="h-auto min-h-screen overflow-hidden bg-gray-900">
      <div className="container mx-auto text-white py-10 px-2 sm:px-0">
        <h1 className="text-5xl font-bold mb-6 text-blue-300 text-center">
          TODO:TITLE Responses 
          {/* //TODO: ADD FORM TITLE  */}
        </h1>

        {/* Display grouped responses by label */}
        {groupedResponses &&
          Object.entries(groupedResponses).map(([label, values], index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold text-blue-200">{index + 1}) {label.charAt(0).toUpperCase() + label.slice(1)}</h2>
              <ul className="ml-4">
                {values.map((value, i) => (
                  <li key={i} className="text-lg">
                    - {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ResponsePage