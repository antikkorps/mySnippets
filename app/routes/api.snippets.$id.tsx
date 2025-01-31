import type { ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { getUser } from "~/services/auth.server"
import { handlePrismaOperation, prisma } from "~/services/prisma.server"

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await getUser(request)
  if (!user) throw new Error("Unauthorized")

  const snippetId = params.id
  if (!snippetId) throw new Error("Snippet ID is required")

  // Verify snippet ownership
  const snippet = await handlePrismaOperation(() =>
    prisma.snippet.findFirst({
      where: { id: snippetId, userId: user.id },
    })
  )
  if (!snippet) throw new Error("Snippet not found")

  if (request.method === "PUT") {
    const { content } = await request.json()

    // Save current version to history
    await handlePrismaOperation(() =>
      prisma.history.create({
        data: {
          content: snippet.content,
          version: snippet.version,
          snippetId: snippet.id,
        },
      })
    )

    // Update snippet
    const updatedSnippet = await handlePrismaOperation(() =>
      prisma.snippet.update({
        where: { id: snippetId },
        data: {
          content,
          version: { increment: 1 },
        },
      })
    )

    return json(updatedSnippet)
  }

  throw new Error(`Method ${request.method} not allowed`)
}
