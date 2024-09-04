import React from "react"

interface IConfirmModal {
  title: string
  subTitle?: string
  actionName: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = ({
  title,
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
        className="rounded-lg bg-gray-800 p-8 shadow-2xl w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-md text-blue-300">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{subTitle}</p>
        <div className="mt-4 flex gap-2 float-right">
          <button
            type="button"
            className="rounded bg-red-500 text-white px-4 py-2 text-sm font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            onClick={onConfirm}
          >
            {actionName}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
