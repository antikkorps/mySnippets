import type { LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react"
import MainLayout from "~/components/MainLayout"
import { getUser } from "~/services/auth.server"

interface Snippet {
  id: string
  title: string
}

interface Folder {
  id: string
  name: string
  snippets: Snippet[]
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getUser(request)
    console.log("Auth loader - User:", user)

    if (!user) {
      return redirect("/login")
    }

    const folders: Folder[] = user.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      snippets: Array.isArray(folder.snippets) ? folder.snippets : [],
    }))

    console.log("Auth loader - Processed folders:", folders)
    return json({ folders })
  } catch (error) {
    console.error("Auth loader error:", error)
    throw error
  }
}

export default function AuthLayout() {
  const { folders } = useLoaderData<typeof loader>()
  console.log("AuthLayout - Folders to pass to MainLayout:", folders)

  return (
    <MainLayout folders={folders}>
      <Outlet />
    </MainLayout>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.error("Auth error boundary:", error)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error instanceof Error ? error.message : "Erreur inattendue"}
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  )
}
