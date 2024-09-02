import React from "react"
import {
  PiNumberCircleOneDuotone,
  PiNumberCircleThreeDuotone,
  PiNumberCircleTwoDuotone,
} from "react-icons/pi"

const HowTo = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-blue-300 font-bold text-3xl sm:text-5xl">
            Kickstart knowing your audience
          </h1>

          <p className="mt-4 text-gray-300">
            Here are some steps that will guide you to create your first
            Respondly form.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-blue-500/10 hover:shadow-blue-500/10">
            <PiNumberCircleOneDuotone className="size-14 text-blue-500" />

            <h2 className="mt-4 text-2xl font-bold text-white">
              Sign Up and Log In
            </h2>

            <p className="mt-1 text-sm text-gray-300">
              Go to the Respondly website, sign up, and log-in or sign-up with
              your email and password to access your dashboard.
            </p>
          </div>

          <div className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-blue-500/10 hover:shadow-blue-500/10">
            <PiNumberCircleTwoDuotone className="size-14 text-blue-500" />

            <h2 className="mt-4 text-2xl font-bold text-white">
              Create Your Form
            </h2>

            <p className="mt-1 text-sm text-gray-300">
              Click &quot;Create Form,&quot; add fields using the builder, and
              customize the design to fit your needs for best experience.
            </p>
          </div>

          <div className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-blue-500/10 hover:shadow-blue-500/10">
            <PiNumberCircleThreeDuotone className="size-14 text-blue-500" />

            <h2 className="mt-4 text-2xl font-bold text-white">
              Publish and Share
            </h2>

            <p className="mt-1 text-sm text-gray-300">
              Publish your form and share the link with your audience. Responses
              will go directly to your dedicated Respondly email.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowTo
