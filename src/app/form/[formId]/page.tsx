"use client"

import Loading from "@/components/loading"
import { useState, useEffect, FormEvent } from "react"

interface IField {
  label: string
  type: string
  options?: string[]
  requiredField: boolean
}

interface IForm {
  title: string
  fields: IField[]
}

interface IFormResponse {
  data: IForm
}

const FormPage = ({ params }: { params: { formId: string } }) => {
  const [form, setForm] = useState<IForm | null>(null)
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {}
  )
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.formId) {
      fetch(`/api/forms/${params.formId}`)
        .then((response) => response.json())
        .then((data: IFormResponse) => {
          console.log("Fetched form data:", data)
          setForm(data.data)

          // Initialize formData with empty strings for each field
          const initialFormData: Record<string, string> = {}
          data.data.fields.forEach((field) => {
            initialFormData[field.label] = ""
          })
          setFormData(initialFormData)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching form:", error)
          setErrorMessage("Failed to load form. Please try again later.")
        })
    }
  }, [params.formId])

  const handleInputChange = (label: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [label]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    const formattedResponses = Object.entries(formData)
      .filter(([_, value]) => value !== "" && value.length !== 0) // Filter out empty responses
      .map(([label, value]) => ({
        label,
        value: Array.isArray(value) ? value.join(", ") : value,
      }))

    try {
      const response = await fetch(`/api/response/${params.formId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses: formattedResponses }),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Formatted Responses:", formattedResponses)
        setSuccessMessage("Response submitted successfully!")
        // Reset form data
        const resetFormData: Record<string, string> = {}
        form?.fields.forEach((field) => {
          resetFormData[field.label] = ""
        })
        setFormData(resetFormData)
      } else {
        console.error("Error submitting response:", result.error)
        setErrorMessage("Failed to submit response. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting response:", error)
      setErrorMessage("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!form) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{errorMessage}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-blue-300 text-3xl font-bold text-center mb-6">
              {form.title}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="flex text-sm font-medium text-gray-300">
                    {field.requiredField ? (
                      <span className="text-red-500 pr-1">*</span>
                    ) : (
                      ""
                    )}
                    {field.label.charAt(0).toUpperCase() + field.label.slice(1)}
                  </label>

                  {["text", "email", "number"].includes(field.type) && (
                    <input
                      type={field.type}
                      value={formData[field.label] || ""}
                      onChange={(e) =>
                        handleInputChange(field.label, e.target.value)
                      }
                      className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={"Your response.."}
                      required={field.requiredField}
                    />
                  )}

                  {field.type === "mcq" && (
                    <div>
                      {field.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center">
                          <input
                            type="radio"
                            id={`${field.label}-${optionIndex}`}
                            name={field.label}
                            value={option}
                            checked={formData[field.label] === option}
                            onChange={(e) =>
                              handleInputChange(field.label, e.target.value)
                            }
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                            required={field.requiredField}
                          />
                          <label
                            htmlFor={`${field.label}-${optionIndex}`}
                            className="text-sm text-gray-300"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div>
                      {field.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${field.label}-${optionIndex}`}
                            value={option}
                            checked={(formData[field.label] || []).includes(
                              option
                            )}
                            onChange={(e) => {
                              const currentValues =
                                (formData[field.label] as string[]) || []
                              const newValues = e.target.checked
                                ? [...currentValues, option]
                                : currentValues.filter((v) => v !== option)
                              handleInputChange(field.label, newValues)
                            }}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                            required={field.requiredField}
                          />
                          <label
                            htmlFor={`${field.label}-${optionIndex}`}
                            className="text-sm text-gray-300"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {field.type === "dropdown" && (
                    <select
                      value={formData[field.label] || ""}
                      onChange={(e) =>
                        handleInputChange(field.label, e.target.value)
                      }
                      className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required={field.requiredField}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </button>
            </form>
            {successMessage && (
              <p className="mt-4 text-center text-green-400">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="mt-4 text-center text-red-400">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPage
