import Link from "next/link"
import React from "react"

const Hero = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-hero-height lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-6xl">
            Respondly.com
            <span className="sm:block">
              {" "}
              Listen your audience effectively.{" "}
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            Gather all responses at one place!!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 px-12 py-3 text-sm font-medium text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              href="/profile"
            >
              Get Started
            </Link>

            <Link
              className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              href="#about"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
