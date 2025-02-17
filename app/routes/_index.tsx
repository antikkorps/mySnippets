import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { getUser } from "~/services/auth.server"

export const meta: MetaFunction = () => {
  return [
    { title: "SnippetManager - Manage Your Code Snippets" },
    {
      name: "description",
      content:
        "A professional tool to organize and manage your code snippets efficiently.",
    },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  console.log("depuis loader", user)

  return { user }
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              SnippetManager
            </div>
            <div className="flex gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Dashboard
                  </Link>
                  <Form action="/logout" method="post">
                    <button
                      type="submit"
                      className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </Form>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="py-8 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              <span className="block">Manage Your Code Snippets</span>
              <span className="block text-blue-600">Like a Pro</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 sm:mt-5">
              Store, organize, and share your code snippets efficiently. Access them from
              anywhere, anytime.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  View Your Snippets
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Features</h2>
            <div className="grid grid-cols-1 gap-y-8 sm:gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    name: "Easy Organization",
    description: "Organize your snippets with tags, folders, and custom categories.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    name: "Syntax Highlighting",
    description: "Beautiful syntax highlighting for all major programming languages.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    name: "Cloud Sync",
    description: "Access your snippets from anywhere with secure cloud synchronization.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
  },
]
