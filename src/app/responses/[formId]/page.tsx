"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import ResponseChart from "../_components/ResponseChart"

interface FormField {
  label: string
  type: string
  options?: string[]
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
  const formId = params.formId
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (formId) {
      fetch(`/api/forms/${formId}`)
        .then((response) => response.json())
        .then((data) => setForm(data.data))
        .catch((error) => console.error("Error fetching form:", error))
    }
  }, [formId])

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
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center">
        <AiOutlineLoading3Quarters
          aria-label="Loading.."
          className="animate-spin text-4xl"
        />
        <span className="ml-4 text-2xl">Loading, please wait...</span>
      </div>
    )

  if (error)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center">
        <div>
          <p className="text-3xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )

  // show message if there are no responses
  if (formData?.data.length === 0)
    return (
      <div className="h-[90vh] bg-gray-900 text-white flex justify-center items-center text-center">
        <p className="text-3xl">This form hasn&apos;t got any responses yet.</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-5xl font-bold mb-8 text-blue-300 text-center">
          {form?.title} Responses
        </h1>

        {/* display responses for each field */}
        {form?.fields.map((field, index) => {
          console.log(form, "FORMFIELDS")
          const responseCounts: Record<string, number> = {} // COUNT RESPONSES (CHARTS)
          const textResponses: string[] = [] // TEXT RESPONSES

          // count responses based on field type
          formData.data.forEach((response) => {
            const value = response.value as string // transform to string
            if (response.label === field.label) {
              if (
                field.type === "text" ||
                field.type === "number" ||
                field.type === "email"
              ) {
                textResponses.push(String(value)) // count text response
                console.log(textResponses)
              } else if (field.options?.includes(value)) {
                responseCounts[value] = (responseCounts[value] || 0) + 1 // count multiple-choice responses

                // responseCounts[value] = (responseCounts[value] || 0)
                // means if there is response count or the count of response value is 0
              }
            }
          })

          return (
            <div
              key={index}
              className="mb-8 p-4 bg-gray-800 rounded-md shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-blue-200">
                {index + 1}.{" "}
                {field.label.charAt(0).toUpperCase() + field.label.slice(1)}
              </h2>

              {/* displaying text responses */}
              {field.type === "text" ||
              field.type === "email" ||
              field.type === "number" ? (
                <ul className="ml-4 mt-2 list-disc list-inside">
                  {textResponses.map((response, i) => (
                    <li key={i} className="text-lg">
                      {response}
                    </li>
                  ))}
                </ul>
              ) : (
                // displaying count responses in chart
                <ResponseChart responseCounts={responseCounts} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ResponsePage
