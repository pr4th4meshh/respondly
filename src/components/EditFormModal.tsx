import React, { useState } from "react"
import Popup from "./Popup"
import { MdDeleteOutline, MdAdd } from "react-icons/md"

interface IConfirmModal {
  title: string
  subTitle?: string
  actionName: string
  onConfirm: () => void
  onCancel: () => void
  form: any
}

const EditFormModal = ({
  form,
  actionName,
  onConfirm,
  onCancel,
}: IConfirmModal) => {
  const [formTitle, setFormTitle] = useState(form.title || "")
  const [fields, setFields] = useState(
    form.fields || [{ label: "", type: "text", options: [] }]
  )

  const [messagePopupType, setMessagePopupType] = useState<
    "success" | "error" | "warning"
  >("success")
  const [popupMessage, setPopupMessage] = useState("")
  const [showMessagePopup, setShowMessagePopup] = useState(false)

  const closePopup = () => {
    setShowMessagePopup(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value)
  }

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields]
    updatedFields[index][key] = value
    setFields(updatedFields)
  }

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_: any, i: number) => i !== index)
    setFields(updatedFields)
  }

  const handleAddOption = (fieldIndex: number) => {
    const updatedFields = [...fields]
    updatedFields[fieldIndex].options.push("")
    setFields(updatedFields)
  }

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedFields = [...fields]
    updatedFields[fieldIndex].options[optionIndex] = value
    setFields(updatedFields)
  }

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const updatedFields = [...fields]
    updatedFields[fieldIndex].options.splice(optionIndex, 1)
    setFields(updatedFields)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("Submitting form with title:", formTitle)
    console.log("Submitting form fields:", fields)

    try {
      const response = await fetch(`/api/forms/${form._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: formTitle, fields }),
      })

      if (response.ok) {
        const result = await response.json()
        setShowMessagePopup(true)
        setPopupMessage("Form updated successfully!")
        setMessagePopupType("success")
        onConfirm()
      } else {
        const errorData = await response.json()
        console.error("Failed to update form:", errorData.error)
        setShowMessagePopup(true)
        setPopupMessage("Failed to update form.")
        setMessagePopupType("error")
      }
    } catch (error) {
      console.error("Error updating form:", error)
      setShowMessagePopup(true)
      setPopupMessage("Error updating form.")
      setMessagePopupType("error")
    }
  }

  return (
    <>
      <Popup
        type={messagePopupType}
        message={popupMessage}
        show={showMessagePopup}
        onClose={closePopup}
      />
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onCancel}
      >
        <div
          className="rounded-lg bg-gray-900 p-8 shadow-2xl w-[400px] sm:w-[600px] max-h-[80vh] overflow-y-auto editModalClass"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl text-center text-blue-300">Edit Form:</h2>
          <form
            onSubmit={handleSubmit}
            className="mb-0 mt-1 space-y-4 rounded-lg p-1 sm:p-6 lg:p-8 text-gray-300"
          >
            <div>
              <label htmlFor="title">Form Title:</label>
              <input
                type="text"
                id="title"
                className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 text-sm shadow-sm mt-1 mb-2"
                placeholder="Form Title"
                value={formTitle}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div>
              <span>Form Fields:</span>
              <div className="flex flex-col">
                {fields.map((field: any, index: number) => (
                  <div className="flex flex-col mb-4" key={index}>
                    <div className="flex items-center">
                      <span className="p-4 mr-2 bg-blue-300 text-blue-900 text-sm mt-1 mb-2 rounded-lg">
                        {index + 1}
                      </span>
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          value={field.label}
                          className="rounded-lg bg-gray-800 border-gray-200 p-3 text-sm shadow-sm mt-1 mb-2"
                          onChange={(e) =>
                            handleFieldChange(index, "label", e.target.value)
                          }
                          required
                        />
                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleFieldChange(index, "type", e.target.value)
                          }
                          className="rounded-lg bg-gray-800 border-gray-200 p-3 text-sm shadow-sm mt-1 mb-2"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="mcq">Multiple Choice</option>
                          <option value="dropdown">Dropdown</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        className="ml-2 text-white bg-red-500 p-3 rounded-lg mt-1 mb-2"
                        onClick={() => handleRemoveField(index)}
                      >
                        <MdDeleteOutline className="text-xl" />
                      </button>
                    </div>
                    {(field.type === "mcq" || field.type === "dropdown") && (
                      <div className="ml-8 mt-2">
                        <span className="text-sm font-semibold">Options:</span>
                        {field.options.map(
                          (option: string, optionIndex: number) => (
                            <div
                              className="flex items-center mt-1"
                              key={optionIndex}
                            >
                              <input
                                type="text"
                                value={option}
                                className="w-full rounded-lg bg-gray-800 border-gray-200 p-2 text-sm shadow-sm"
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                                required
                              />
                              <button
                                type="button"
                                className="ml-2 text-white bg-red-500 p-2 rounded-lg"
                                onClick={() =>
                                  handleRemoveOption(index, optionIndex)
                                }
                              >
                                <MdDeleteOutline className="text-lg" />
                              </button>
                            </div>
                          )
                        )}
                        <button
                          type="button"
                          className="mt-2 bg-green-600 text-white py-1 px-2 rounded-lg text-sm flex items-center"
                          onClick={() => handleAddOption(index)}
                        >
                          <MdAdd className="mr-1" /> Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
            >
              {actionName}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditFormModal
