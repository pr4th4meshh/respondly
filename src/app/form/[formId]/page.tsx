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
        .then((data) => {
          console.log("Fetched form data:", data) // Log fetched data
          setForm(data.data)
        })
        .catch((error) => console.error("Error fetching form:", error))
    }
  }, [params.formId])

  const handleInputChange = (label, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [label]: value,
    }))
  }

  const handleCheckboxChange = (label, checked) => {
    setResponses((prevResponses) => {
      const currentValues = prevResponses[label] || []
      if (checked) {
        return { ...prevResponses, [label]: [...currentValues, label] } // Add to array if checked
      } else {
        return {
          ...prevResponses,
          [label]: currentValues.filter((v) => v !== label),
        } // Remove from array if unchecked
      }
    })
  }

  const handleDropdownChange = (label, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [label]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formattedResponses = Object.entries(responses).map(
      ([label, value]) => ({
        label,
        value,
      })
    )

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
        console.log("FR:", formattedResponses, "RESES:", responses)
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
                <label>
                  {field.label}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>

                {field.type === "text" ||
                field.type === "email" ||
                field.type === "number" ? (
                  <input
                    type={field.type}
                    value={responses[field.label] || ""}
                    className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                    onChange={(e) =>
                      handleInputChange(field.label, e.target.value)
                    }
                    placeholder="Your response..."
                    required
                  />
                ) : field.type === "mcq" ? (
                  field.options?.length > 0 && // Check if options exist
                  field.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="radio"
                        id={`${field.label}-${optionIndex}`}
                        name={field.label}
                        value={option}
                        checked={responses[field.label] === option}
                        onChange={() => handleInputChange(field.label, option)}
                        className="mr-2"
                      />
                      <label htmlFor={`${field.label}-${optionIndex}`}>
                        {option}
                      </label>
                    </div>
                  ))
                ) : field.type === "checkbox" ? (
                  field.options?.length > 0 && // Check if options exist
                  field.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="checkbox"
                        id={`${field.label}-${optionIndex}`}
                        name={field.label}
                        value={option}
                        checked={(responses[field.label] || []).includes(
                          option
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(option, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`${field.label}-${optionIndex}`}>
                        {option}
                      </label>
                    </div>
                  ))
                ) : field.type === "dropdown" ? (
                  <select
                    value={responses[field.label] || ""}
                    onChange={(e) =>
                      handleDropdownChange(field.label, e.target.value)
                    }
                    className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                    required
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {field.options?.length > 0 && // Check if options exist
                      field.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                ) : null}
              </div>
            ))}
            <button
              type="submit"
              className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
            >
              Submit Response
            </button>
          </form>
          {successMessage && (
            <p className="text-lg text-center text-green-300">
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormPage
