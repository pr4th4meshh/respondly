"use client"
import { IForm } from "@/models/Form"
import { FormEvent, useState } from "react"

interface Field {
  label: string
  type: string
  options: string[]
  requiredField: boolean
}

interface FormProps {
  onSuccess?: string
  onSubmit: (formData: IForm) => void
}

const CreateForm: React.FC<FormProps> = ({ onSuccess, onSubmit }: any) => {
  const [title, setTitle] = useState("Untitled Form")
  const [fields, setFields] = useState<Field[]>([
    { label: "", type: "text", options: [], requiredField: false },
  ])

  const handleAddField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { label: "", type: "text", options: [], requiredField: false },
    ])
  }

  const handleFieldChange = <K extends keyof Field>(
    index: number,
    key: K,
    value: Field[K]
  ) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields]
      updatedFields[index][key] = value

      if (key === "type") {
        updatedFields[index].options =
          value === "mcq" || value === "dropdown" ? [""] : []
      }

      return updatedFields
    })
  }

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields]
      updatedFields[fieldIndex].options[optionIndex] = value
      return updatedFields
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const formattedFormData = {
      title,
      fields: fields.map(({ label, type, options, requiredField }) => ({
        label,
        type,
        options,
        requiredField,
      })),
    }

    onSubmit(formattedFormData)
  }

  return (
    <div className="sm:mx-auto mx-4 max-w-screen-xl border border-gray-800 p-2 sm:p-6 rounded-lg sm:py-4 py-16">
      <h1 className="text-center text-3xl font-bold text-blue-300">
        Create Form
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
        Start by creating a form by filling the fields according to your needs.
      </p>

      <form
        onSubmit={handleSubmit}
        className="h-auto overflow-hidden mb-0 mt-6 space-y-4 rounded-lg p-1 sm:p-6 lg:p-8 text-gray-300"
      >
        <input
          type="text"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 text-sm shadow-sm mb-2"
        />

        {fields.map((field, index) => (
          <div
            key={index}
            className="mb-4 p-4 border border-gray-700 rounded-lg"
          >
            <div className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) =>
                  handleFieldChange(index, "label", e.target.value)
                }
                required
                className="flex-grow rounded-lg bg-gray-800 border-gray-200 p-4 text-sm shadow-sm mr-2"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
                className="bg-gray-800 p-2 rounded-md text-sm"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="mcq">Multiple Choice</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id={`required-${index}`}
                checked={field.requiredField}
                onChange={(e) =>
                  handleFieldChange(index, "requiredField", e.target.checked)
                }
                className="mr-2"
              />
              <label htmlFor={`required-${index}`} className="text-sm">
                Required field
              </label>
            </div>
            {(field.type === "mcq" || field.type === "dropdown") && (
              <div className="ml-4 mt-2">
                {field.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optionIndex, e.target.value)
                    }
                    className="w-full rounded-lg bg-gray-800 border-gray-200 p-2 text-sm shadow-sm mb-2"
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleOptionChange(index, field.options.length, "")
                  }
                  className="text-white rounded-lg border border-blue-600 px-2 py-1 mt-2"
                >
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddField}
          className="block rounded-lg border border-blue-600 px-3 py-1 text-sm font-medium text-white"
        >
          Add Field
        </button>

        <button
          type="submit"
          className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white mt-4"
        >
          Create Form
        </button>
      </form>

      {onSuccess && (
        <div className="mb-4 p-3 text-xl text-green-500 text-center">
          {onSuccess}
        </div>
      )}
    </div>
  )
}

export default CreateForm
