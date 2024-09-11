import React from "react"

interface IConfirmModal {
  title: string
  subTitle?: string
  actionName: string
  onConfirm: () => void
  onCancel: () => void
  form: any
}

const EditFormModal = ({
  title,
  form,
  subTitle,
  actionName,
  onConfirm,
  onCancel,
}: IConfirmModal) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="rounded-lg bg-gray-900 p-8 shadow-2xl w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-center text-blue-300">Edit Form:</h2>
        <div className="mt-2 flex gap-2 float-right">
          <form
            //   onSubmit={handleSubmit}
            className="mb-0 mt-1 space-y-4 rounded-lg p-1 sm:p-6 lg:p-8 text-gray-300"
          >
            <div>
              <label htmlFor="text">Form Title:</label>

              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                  placeholder="Form Title"
                  value={form.title || "title"}
                  // onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <span>Form Labels:</span>

                <div className="flex flex-col">
                  {form.fields.map((field: any, index: number) => (
                    <div className="flex" key={index}>
                      <span className="p-4 bg-blue-300 text-blue-900 text-sm mt-1 mb-2 rounded-lg mr-1">{index + 1}</span>
                      <input
                        type="text"
                        value={field.label}
                        className="w-full rounded-lg bg-gray-800 border-gray-200 p-4 pe-12 text-sm shadow-sm mt-1 mb-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
            >
              Edit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditFormModal
