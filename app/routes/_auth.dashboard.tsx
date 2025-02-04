import type { LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { getUser } from "~/services/auth.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (!user) return redirect("/login")
  return { user }
}

export default function DashboardIndex() {
  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
          Welcome to your Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Start managing your code snippets here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Recent Snippets
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No snippets yet. Create your first one!
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Popular Tags
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start tagging your snippets to organize them better.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              Create New Snippet
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              Create New Folder
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              Manage Tags
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
