"use client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { AiOutlineClose, AiOutlineCloseSquare } from "react-icons/ai"
import { CgClose } from "react-icons/cg"

const Navbar = () => {
  const { data: session } = useSession()
  const [isSubNavOpen, setIsSubNavOpen] = useState(true)
  const [isResponsiveNav, setIsResponsiveNav] = useState(false)

  const handleResponsiveNav = () => {
    setIsResponsiveNav((prev) => !prev)
  }

  const closeSubNav = () => {
    setIsSubNavOpen(false)
  }
  return (
    <>
      <header className="bg-gray-900 border-b border-b-gray-700">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link className="block text-blue-600 dark:text-blue-300" href="/">
            <span className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
              Respondly
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end md:justify-between">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#about"
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#howto"
                  >
                    How To
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#faqs"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {session && session.user?.name ? (
                <>
                  <Image
                    priority
                    height={50}
                    width={50}
                    src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRlZmF1bHQlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
                    alt="Avatar_Image"
                    className="h-[40px] w-[40px] rounded-full"
                  />
                  <h1 className="text-gray-300 hidden md:block ">
                    Hello, {session.user?.name}
                  </h1>

                  <Link
                    href="/profile"
                    className={`md:flex hidden items-center text-white bg-blue-600 px-4 py-2 rounded ${
                      window.location.pathname === "/" ? "block" : "hidden"
                    }`}
                  >
                    View Profile
                  </Link>
                </>
              ) : (
                // </Link>
                <div className="sm:flex sm:gap-4">
                  <Link
                    className="block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 dark:hover:bg-blue-500"
                    href="/login"
                  >
                    Login
                  </Link>

                  <Link
                    className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-blue-600/75 sm:block dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                    href="/register"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                onClick={handleResponsiveNav}
                className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
              >
                <span className="sr-only">Toggle menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav
        className={`fixed z-[999] inset-0 bg-gray-900 transition-transform transform ${
          isResponsiveNav ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col items-center py-4 px-4">
          <button
            onClick={handleResponsiveNav}
            className="flex self-start text-2xl text-white"
          >
            <AiOutlineClose />
          </button>
          <ul className="flex flex-col items-center gap-6 text-2xl">
            <Link href="/" onClick={handleResponsiveNav}>
              <span className="text-blue-300 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75">
                Home
              </span>
            </Link>
            <li>
              <a
                className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                href="#about"
                onClick={handleResponsiveNav}
              >
                About
              </a>
            </li>

            <li>
              <a
                className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                href="#howto"
                onClick={handleResponsiveNav}
              >
                How To
              </a>
            </li>

            <li>
              <a
                className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                href="#faqs"
                onClick={handleResponsiveNav}
              >
                FAQs
              </a>
            </li>
          </ul>

          <div className="flex flex-col items-center gap-4 pt-10">
            {session && session.user?.name ? (
              <>
                <Image
                  priority
                  height={50}
                  width={50}
                  src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRlZmF1bHQlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
                  alt="Avatar_Image"
                  className="h-[40px] w-[40px] rounded-full"
                />
                <h1 className="text-gray-300 text-xl">Hello, {session.user?.name}</h1>

                <Link
                  href="/profile"
                  className={`flex items-center text-white bg-blue-600 px-4 py-2 rounded ${
                    window.location.pathname === "/" ? "block" : "hidden"
                  }`}
                  onClick={handleResponsiveNav}
                >
                  View Profile
                </Link>
              </>
            ) : (
              // </Link>
              <div className="pt-10 flex flex-col w-[300px]">
                <Link
                  className=" flex justify-center w-full mb-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 dark:hover:bg-blue-500"
                  href="/login"
                  onClick={handleResponsiveNav}
                >
                  Login
                </Link>

                <Link
                  className="flex justify-center rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-blue-600/75 sm:block dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                  href="/register"
                  onClick={handleResponsiveNav}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`bg-blue-600 px-4 py-3 text-white ${
          isSubNavOpen ? "block" : "hidden"
        }`}
      >
        <p className="text-center text-sm font-medium">
          Love Respondly?{" "}
          <Link
            href="https://github.com/pr4th4meshh/respondly"
            rel="noopener"
            target="_blank"
            className="inline-block underline"
          >
            Give it a star on GitHub!
          </Link>
          <span className="float-end text-lg cursor-pointer">
            <CgClose onClick={closeSubNav} />
          </span>
        </p>
      </div>
    </>
  )
}

export default Navbar
