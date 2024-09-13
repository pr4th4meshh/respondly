import React, { useEffect } from "react"

interface IPopup {
  type: "success" | "error" | "warning"
  message: string
  show: boolean
  onClose: () => void
}

const Popup = ({ type, message, show, onClose }: IPopup) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 py-2 px-4 text-white text-md rounded transition-transform ${
        show ? "block" : "hidden"
      } ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-yellow-500"
      }`}
    >
      {message}
    </div>
  )
}

export default Popup
