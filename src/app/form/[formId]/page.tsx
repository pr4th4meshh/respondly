"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const FormPage = ({ params }: { params: { formId: string } }) => {
  const [form, setForm] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (params.formId) {
      fetch(`/api/forms/${params.formId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched form data:", data)
          setForm(data.data)
        })
        .catch((error) => console.error("Error fetching form:", error))
    }
  }, [params.formId])

  const generateZodSchema = (fields) => {
    const schemaObject = {}
    fields.forEach((field) => {
      switch (field.type) {
        case "text":
          schemaObject[field.label] = z.string().min(1, { message: "This field is required" })
          break
        case "email":
          schemaObject[field.label] = z.string().email({ message: "Invalid email address" })
          break
        case "number":
          schemaObject[field.label] = z.number({ invalid_type_error: "Must be a number" }).int({ message: "Must be an integer" })
          break
        case "mcq":
        case "dropdown":
          schemaObject[field.label] = z.enum(field.options, {
            errorMap: () => ({ message: "Please select an option" }),
          })
          break
        case "checkbox":
          schemaObject[field.label] = z.array(z.string()).min(1, { message: "Please select at least one option" })
          break
      }
    })
    return z.object(schemaObject)
  }

  const schema = form ? generateZodSchema(form.fields) : z.object({})

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    const formattedResponses = Object.entries(data).map(([label, value]) => ({
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
        reset()
      } else {
        console.error("Error submitting response:", result.error)
      }
    } catch (error) {
      console.error("Error submitting response:", error)
    }
  }

  const handleNumberInput = (onChange) => (e) => {
    const value = e.target.value
    if (value === "" || /^[0-9]+$/.test(value)) {
      onChange(value === "" ? "" : parseInt(value, 10))
    }
  }

  if (!form) return <div className="h-screen bg-gray-900">Loading form...</div>

  return (
    <div className="h-screen bg-gray-900">
      <div className="container mx-auto py-16 px-2 sm:px-0">
        <div className="mx-auto max-w-lg border border-gray-800 p-8 rounded-lg">
          <h1 className="text-blue-300 text-3xl text-center">{form.title}</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8 text-gray-300"
          >
            {form.fields.map((field, index) => (
              <div key={index}>
                <label>
                  {field.label.charAt(0).toUpperCase() + field.label.slice(1)}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>

                <Controller
                  name={field.label}
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <>
                      {["text", "email"].includes(field.type) && (
                        <input
                          type={field.type}
                          value={value}
                          onChange={onChange}
                          className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                          placeholder="Your response..."
                        />
                      )}
                      {field.type === "number" && (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={value}
                          onChange={handleNumberInput(onChange)}
                          className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                          placeholder="Enter a number..."
                        />
                      )}
                      {field.type === "mcq" &&
                        field.options?.length > 0 &&
                        field.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input
                              type="radio"
                              id={`${field.label}-${optionIndex}`}
                              value={option}
                              checked={value === option}
                              onChange={() => onChange(option)}
                              className="mr-2"
                            />
                            <label htmlFor={`${field.label}-${optionIndex}`}>{option}</label>
                          </div>
                        ))}
                      {field.type === "checkbox" &&
                        field.options?.length > 0 &&
                        field.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input
                              type="checkbox"
                              id={`${field.label}-${optionIndex}`}
                              value={option}
                              checked={(value || []).includes(option)}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...(value || []), option]
                                  : (value || []).filter((v) => v !== option)
                                onChange(newValue)
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={`${field.label}-${optionIndex}`}>{option}</label>
                          </div>
                        ))}
                      {field.type === "dropdown" && (
                        <select
                          value={value}
                          onChange={onChange}
                          className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {field.options?.length > 0 &&
                            field.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                        </select>
                      )}
                    </>
                  )}
                />
                {errors[field.label] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.label].message}</p>
                )}
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

export default FormPage;