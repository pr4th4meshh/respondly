import React from "react"

const About = () => {
  return (
    <div id="about" className="bg-gray-900">
      <div className="container mx-auto flex flex-col justify-center items-center px-4 py-16">
        <h1 className="text-blue-300 font-bold text-3xl sm:text-5xl text-center">
          Empowering Feedback Collection
        </h1>

        <span className=" sm:text-lg text-gray-300 mt-8 text-center">
          At Respondly, we believe that feedback is the cornerstone of growth.
          Whether you’re a business looking to understand your customers better
          or a creator eager to connect with your audience, our platform makes
          it simple to gather the insights you need. Our intuitive form builder
          allows you to create customized forms effortlessly, while our unique
          dedicated email system ensures that every response reaches you
          directly. With Respondly, you can focus on what matters most:
          improving your offerings based on real feedback.
        </span>
      </div>
    </div>
  )
}

export default About
