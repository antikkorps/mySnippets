import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import SnippetEditorLayout from "~/components/SnippetEditorLayout"
import SnippetList from "~/components/SnippetsList"
import { getUser } from "~/services/auth.server"
import { prisma } from "~/services/prisma.server"
import type { SnippetWithTags } from "~/types/snippet"

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const folderId = url.searchParams.get("folderId")

  if (!folderId) {
    return { snippets: [], folderName: "" }
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

  return { snippets: folder.snippets, folderName: folder.name }
}

export default function SnippetsPage() {
  const { snippets, folderName } = useLoaderData<typeof loader>()
  const [currentSnippet, setCurrentSnippet] = useState<SnippetWithTags | undefined>(
    undefined
  )

  // Mettre à jour le snippet courant quand les snippets changent
  useEffect(() => {
    if (snippets.length > 0 && !currentSnippet) {
      setCurrentSnippet({
        ...snippets[0],
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "",
        folderId: "",
        folder: "",
        user: "",
        stars: 0,
        version: 1,
      })
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

      setCurrentSnippet({
        ...currentSnippet,
        content,
      })
    } catch (error) {
      console.error("Failed to save snippet:", error)
    }
  }

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
        snippets={snippets.map((snippet) => ({
          ...snippet,
          isPublic: false,
          userId: "",
          folderId: null,
          stars: 0,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))}
        selectedSnippetId={currentSnippet?.id}
        onSnippetSelect={(id) => {
          const snippet = snippets.find((s) => s.id === id)
          if (snippet) {
            setCurrentSnippet({
              ...snippet,
              isPublic: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              userId: "",
              folderId: "",
              folder: "",
              user: "",
              stars: 0,
              version: 1,
            })
          }
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
