import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { createUserSession, getUserSession, verifyLogin } from "~/services/auth.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserSession(request)
  if (userId) return redirect("/")
  return new Response(JSON.stringify({}))
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")
  const redirectTo = formData.get("redirectTo") || "/"

  if (!email || !password) {
    return new Response(
      JSON.stringify({
        errors: { email: "Email requis", password: "Mot de passe requis" },
      }),
      { status: 400 }
    )
  }

  const user = await verifyLogin(email.toString(), password.toString())
  if (!user) {
    return new Response(
      JSON.stringify({ errors: { email: "Email ou mot de passe invalide" } }),
      { status: 400 }
    )
  }

  return createUserSession(user.id, redirectTo.toString())
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-xl"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account
            </p>
          </div>
        </div>

        <Form method="post" className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 
                    text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                  placeholder="you@example.com"
                />
                {actionData?.errors?.email && (
                  <div className="absolute right-0 pr-3 flex items-center pointer-events-none h-full top-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {actionData?.errors?.email && (
                <p
                  className="mt-2 text-sm text-red-600 dark:text-red-500"
                  id="email-error"
                >
                  {actionData.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 
                    text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                  placeholder="••••••••"
                />
                {actionData?.errors?.password && (
                  <div className="absolute right-0 pr-3 flex items-center pointer-events-none h-full top-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {actionData?.errors?.password && (
                <p
                  className="mt-2 text-sm text-red-600 dark:text-red-500"
                  id="password-error"
                >
                  {actionData.errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium 
              text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              transition-colors duration-200 ease-in-out transform hover:scale-[1.02]"
          >
            Sign in
          </button>
        </Form>
      </div>
    </div>
  )
}
