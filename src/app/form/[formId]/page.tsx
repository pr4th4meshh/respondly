"use client"
import { useState, useEffect } from "react"

const FormPage = ({ params }: { params: { formId: string } }) => {
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch the form data by formId
  useEffect(() => {
    if (params.formId) {
      fetch(`/api/forms/${params.formId}`)
        .then((response) => response.json())
        .then((data) => setForm(data.data))
        .catch((error) => console.error("Error fetching form:", error))
    }
  }, [params.formId])

  const handleInputChange = (index, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [index]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Ensure `responses` is an object with label-answer pairs
    const formattedResponses = Object.entries(responses).map(
      ([label, answer]) => ({
        label,
        answer,
      })
    )

    console.log("Formatted Responses:", formattedResponses) // Debugging line

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
        setSuccessMessage("Response submitted successfully!")
        setResponses({})
      } else {
        console.error("Error submitting response:", result.error)
      }
    } catch (error) {
      console.error("Error submitting response:", error)
    }
  }

  if (!form) return <div className="h-screen bg-gray-900">Loading form...</div>

  return (
    <div className="h-screen bg-gray-900">
      <div className="container mx-auto py-16 px-2 sm:px-0">
        <div className="mx-auto max-w-lg border border-gray-800 p-8 rounded-lg">
          <h1 className="text-blue-300 text-3xl text-center">{form.title}</h1>
          <form
            onSubmit={handleSubmit}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8 text-gray-300"
          >
            {form.fields.map((field, index) => (
              <div key={index}>
                <label>{field.label}<span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type={field.type}
                  value={responses[index] || ""}
                  className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Your response.."
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
            >
              Submit Response
            </button>
          </form>
          {successMessage && <p className="text-lg text-center text-green-300">{successMessage}</p>}
        </div>
      </div>
    </div>
  )
}

export default FormPage
