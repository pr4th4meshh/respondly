"use client"

import { useState } from "react"

const CreateForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("")
  const [fields, setFields] = useState([{ label: "", type: "text" }])

  const handleAddField = () => {
    setFields([...fields, { label: "", type: "text" }])
  }

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields]
    updatedFields[index][key] = value
    setFields(updatedFields)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title, fields })
  }

  return (
    <>
      {/* <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8"> */}
      <div className="mx-auto max-w-lg border border-gray-800 mt-12 p-8 rounded-lg">
        <h1 className="text-center text-3xl font-bold text-blue-300 sm:text-3xl">
          Create Form
        </h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Start by creating your first Respondly form by filling the above
          fields according to your needs
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8 text-gray-300"
        >
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                type="text"
                className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mb-2"
                placeholder="Form Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {fields.map((field, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Field Label"
                    className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mb-2"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(index, "label", e.target.value)
                    }
                    required
                  />
                  <select
                    value={field.type}
                    className="bg-gray-800 p-1 rounded-md text-sm"
                    onChange={(e) =>
                      handleFieldChange(index, "type", e.target.value)
                    }
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddField}
            className="block rounded-lg border border-blue-600 px-3 py-1 text-sm font-medium text-white"
          >
            Add Field
          </button>

          <button
            type="submit"
            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
          >
            Create Form
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateForm
