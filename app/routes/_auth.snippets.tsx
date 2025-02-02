import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import SnippetEditorLayout from "~/components/SnippetEditorLayout"
import SnippetList from "~/components/SnippetsList"
import { getUser } from "~/services/auth.server"
import { prisma } from "~/services/prisma.server"
import type { LoaderData, Snippet } from "~/types/snippet"

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const folderId = url.searchParams.get("folderId")

  if (!folderId) {
    return json<LoaderData>({ snippets: [], folderName: "" })
  }

  const user = await getUser(request)
  if (!user) throw new Error("User not found")

  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      userId: user.id,
    },
    include: {
      snippets: {
        select: {
          id: true,
          title: true,
          content: true,
          language: true,
          description: true,
          tags: {
            select: {
              name: true,
              color: true,
            },
          },
        },
      },
    },
  })

  if (!folder) {
    throw new Error("Folder not found")
  }

  return json<LoaderData>({
    snippets: folder.snippets,
    folderName: folder.name,
  })
}

export default function SnippetsPage() {
  const { snippets, folderName } = useLoaderData<typeof loader>()
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | undefined>(undefined)

  // Mettre à jour le snippet courant quand les snippets changent
  useEffect(() => {
    if (snippets.length > 0 && !currentSnippet) {
      setCurrentSnippet(snippets[0])
    }
  }, [snippets, currentSnippet])

  const handleSnippetChange = async (content: string) => {
    if (!currentSnippet) return

    try {
      await fetch(`/api/snippets/${currentSnippet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      // Mettre à jour le snippet localement
      setCurrentSnippet({
        ...currentSnippet,
        content,
      })
    } catch (error) {
      console.error("Failed to save snippet:", error)
    }
  }

  // Si aucun snippet n'est sélectionné, afficher un message
  if (snippets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Sélectionnez un dossier contenant des snippets
      </div>
    )
  }

  return (
    <>
      <SnippetList
        snippets={snippets}
        selectedSnippetId={currentSnippet?.id}
        onSnippetSelect={(id) => {
          const snippet = snippets.find((s) => s.id === id)
          setCurrentSnippet(snippet)
        }}
        folderName={folderName}
      />

      {currentSnippet ? (
        <SnippetEditorLayout
          currentSnippet={currentSnippet}
          onSnippetChange={handleSnippetChange}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Sélectionnez un snippet pour commencer l&apos;édition
        </div>
      )}
    </>
  )
}
