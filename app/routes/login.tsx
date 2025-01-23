// app/routes/login.tsx
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
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
          <p className="text-gray-600 mt-2">Bienvenue sur Snippets</p>
        </div>

        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                required
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-600 text-sm" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-600 text-sm" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Se connecter
          </button>
        </Form>
      </div>
    </div>
  )
}
