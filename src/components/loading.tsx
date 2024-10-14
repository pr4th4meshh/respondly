import React from "react"
import { ThreeDots } from "react-loader-spinner"

const Loading = () => {
  return (
    <div className=" h-hero-height bg-gray-900 text-white flex flex-col justify-center items-center text-center">
      <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl">
        Respondly.com
      </h1>
      <ThreeDots
        visible={true}
        height="70"
        width="70"
        color="#3b82f6"
        radius="1"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}

export default Loading
