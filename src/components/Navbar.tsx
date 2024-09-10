"use client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Navbar = () => {
  const { data: session } = useSession()
  return (
    <>
      <header className="bg-white dark:bg-gray-900">
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
                    href="#"
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    How To
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    FAQs
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Team
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {session && session.user?.name ? (
                <Link href="/profile" className="flex items-center">
                  <Image
                    priority
                    height={50}
                    width={50}
                    src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRlZmF1bHQlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D"
                    alt="Avatar_Image"
                    className="h-[40px] w-[40px] mr-2 rounded-full"
                  />
                  <h1 className="text-gray-300">Hello, {session.user?.name}</h1>
                </Link>
              ) : (
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

              <button className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
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
      <div className="bg-blue-600 px-4 py-3 text-white">
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
        </p>
      </div>
    </>
  )
}

export default Navbar
