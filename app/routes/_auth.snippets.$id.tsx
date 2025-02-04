import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { getUser } from "~/services/auth.server"
import { prisma } from "~/services/prisma.server"

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (!user) return redirect("/login")

  const snippet = await prisma.snippet.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  })

  if (!snippet) {
    throw new Error("Snippet not found")
  }

  return { snippet }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await getUser(request)
  if (!user) {
    return redirect("/login")
  }
  const formData = await request.formData()
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const description = formData.get("description") as string
  const language = formData.get("language") as string

  await prisma.snippet.update({
    where: {
      id: params.id,
    },
    data: {
      title,
      content,
      description,
      language,
    },
  })
  return redirect(`/snippets/${params.id}`)
}

export default function EditSnippet() {
  const { snippet } = useLoaderData<typeof loader>()
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <Form method="post" className="space-y-6 p-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={snippet.title}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            defaultValue={snippet.description || ""}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Content
          </label>
          <textarea
            name="content"
            id="content"
            defaultValue={snippet.content}
            rows={10}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white font-mono"
            required
          />
        </div>

        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Language
          </label>
          <input
            type="text"
            name="language"
            id="language"
            defaultValue={snippet.language}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </Form>
    </div>
  )
}
