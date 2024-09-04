"use client"
import { useEffect, useState } from "react";
import CreateForm from "@/components/CreateForm";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import axios from "axios";

interface IForm {
  _id: string;
  title: string;
}

const ProfilePage = () => {
  const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedForm, setSelectedForm] = useState<IForm | null>(null);

  // fetch forms from the API
  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/forms");
      const data = await response.json();
      if (response.ok) {
        setForms(data.data); // set forms to state
      } else {
        console.error("Failed to fetch forms:", data.error);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch forms on component mount
  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = async (newFormData: IForm) => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      if (response.ok) {
        // refetch forms after adding new form
        fetchForms();
      } else {
        const errorData = await response.json();
        console.error("Failed to add form:", errorData.error);
      }
    } catch (error) {
      console.error("Error adding form:", error);
    }
  };

  // showing delete confirmation popup
  const handleShowDeletePopup = (form: IForm) => {
    setSelectedForm(form);
    setShowPopup(true);
  };

  // hide the popup without deleting
  const handleCancelDelete = () => {
    setSelectedForm(null);
    setShowPopup(false);
  };

  // confirm and delete the form
  const handleConfirmDelete = async () => {
    if (selectedForm) {
      try {
        const response = await axios.delete(`/api/forms?id=${selectedForm._id}`); // if form is deleted from backend
        if (response.status === 200) { // then delete form from frontend
          setForms((prevForms) =>
            prevForms.filter((form) => form._id !== selectedForm._id)
          );
          handleCancelDelete();
        }
      } catch (error) {
        console.error("Failed to delete form:", error);
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="text-center py-16">
        <h1 className="text-3xl sm:text-5xl text-blue-300">
          Welcome to your profile!
        </h1>
      </header>
      <main className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <CreateForm onSubmit={handleCreateForm} />
          </div>
          <div className="lg:w-1/2 bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl text-blue-300 mb-6">Your Forms:</h2>
            {loading ? (
              <p className="text-center text-lg text-gray-400">
                Loading forms...
              </p>
            ) : forms.length > 0 ? (
              <ul className="space-y-4">
                {forms.map((form) => (
                  <li
                    key={form._id}
                    className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                  >
                    <Link href={`/form/${form._id}`}>
                      <h3 className="text-lg text-blue-300">
                        {form.title}
                      </h3>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleShowDeletePopup(form)} // set the form which is to be deleted
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-xl text-gray-400">
                No forms available
              </p>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showPopup && selectedForm && (
          <ConfirmModal
            title="Are you sure you want to delete this form?"
            subTitle="This action cannot be undone."
            actionName="Confirm"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </main>
    </div>
  );
};

export default ProfilePage;