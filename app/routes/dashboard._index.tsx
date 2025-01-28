import type { LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { getUser } from "~/services/auth.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (!user) return redirect("/login")
  return json({ user })
}

export default function DashboardIndex() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to your Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Start managing your code snippets here.
      </p>
    </div>
  )
}
