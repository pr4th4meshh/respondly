import React, { useState } from "react";
import Popup from "./Popup";
import { MdDeleteOutline } from "react-icons/md";

interface IConfirmModal {
  title: string;
  subTitle?: string;
  actionName: string;
  onConfirm: () => void;
  onCancel: () => void;
  form: any;
}

const EditFormModal = ({
  form,
  actionName,
  onConfirm,
  onCancel,
}: IConfirmModal) => {
  const [formTitle, setFormTitle] = useState(form.title || "");
  const [fields, setFields] = useState(
    form.fields || [{ label: "" }] // Ensure at least one field exists
  );

  // Toast Message States
  const [messagePopupType, setMessagePopupType] = useState<
    "success" | "error" | "warning"
  >("success");
  const [popupMessage, setPopupMessage] = useState("");
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  const closePopup = () => {
    setShowMessagePopup(false);
  };

  // Handle form title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
  };

  // Handle field label change
  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index].label = value;
    setFields(updatedFields);
  };

  //TODO: Add new field
  // const handleAddField = () => {
  //   setFields([...fields, { label: "" }]); // Add a new empty field
  // };

  // Remove a field
  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  // Handle form submit
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(`/api/forms/${form._id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ title: formTitle, fields }),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       setShowMessagePopup(true);
  //       setPopupMessage("Form updated successfully!");
  //       setMessagePopupType("success");
  //       onConfirm(); // Close the modal or refresh data
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Failed to update form:", errorData.error);
  //       alert("Failed to update form.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating form:", error);
  //     alert("Error updating form.");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Log the form data before sending
    console.log('Submitting form with title:', formTitle);
    console.log('Submitting form fields:', fields);
  
    try {
      const response = await fetch(`/api/forms/${form._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: formTitle, fields }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setShowMessagePopup(true);
        setPopupMessage("Form updated successfully!");
        setMessagePopupType("success");
        onConfirm(); // Close the modal or refresh data
      } else {
        const errorData = await response.json();
        console.error("Failed to update form:", errorData.error);
        alert("Failed to update form.");
      }
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Error updating form.");
    }
  };

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
          className="rounded-lg bg-gray-900 p-8 shadow-2xl w-[400px]"
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
                  <div className="flex items-center" key={index}>
                    <span className="p-4 bg-blue-300 text-blue-900 text-sm mt-1 mb-2 rounded-lg mr-1">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={field.label}
                      className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 text-sm shadow-sm mt-1 mb-2"
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="ml-2 text-white bg-red-500 p-3 rounded-lg mt-1 mb-2"
                      onClick={() => handleRemoveField(index)}
                    >
                      <MdDeleteOutline className="text-xl" />
                    </button>
                  </div>
                ))}
                {/* <button
                  type="button"
                  className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg"
                  onClick={handleAddField}
                >
                  Add Field
                </button> */}
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
  );
};

export default EditFormModal;