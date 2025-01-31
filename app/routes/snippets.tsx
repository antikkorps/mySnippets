import { loader as monacoLoader } from "@monaco-editor/react"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import SnippetEditorLayout from "~/components/SnippetEditorLayout"
import { getUser } from "~/services/auth.server"
import { prisma } from "~/services/prisma.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (!user) throw new Error("User not found")

  const url = new URL(request.url)
  const folderId = url.searchParams.get("folderId")

  // Si pas de folderId, on cherche le premier dossier disponible
  if (!folderId) {
    const firstFolder = await prisma.folder.findFirst({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    })

    if (firstFolder) {
      // Rediriger vers le même URL mais avec le folderId
      return redirect(`/snippets?folderId=${firstFolder.id}`)
    } else {
      // Si aucun dossier n'existe, rediriger vers la page de création de dossier
      return redirect("/folders/new")
    }
  }

  // Charger le dossier demandé
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
        },
      },
    },
  })

  if (!folder) {
    // Si le dossier n'existe pas, rediriger vers le premier dossier disponible
    const firstFolder = await prisma.folder.findFirst({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    })

    if (firstFolder) {
      return redirect(`/snippets?folderId=${firstFolder.id}`)
    } else {
      return redirect("/folders/new")
    }
  }

  return json({ folder })
}

export default function SnippetsPage() {
  const { folder } = useLoaderData<typeof loader>()
  const [currentSnippet, setCurrentSnippet] = useState(folder.snippets[0])
  const [isSaving, setIsSaving] = useState(false)

  // Configure Monaco Editor on client-side only
  useEffect(() => {
    monacoLoader.init().then((monaco) => {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        typeRoots: ["node_modules/@types"],
      })
    })
  }, [])

  const handleSnippetChange = async (content: string) => {
    if (!currentSnippet) return

    try {
      setIsSaving(true)
      // Optimistic update
      setCurrentSnippet({ ...currentSnippet, content })

      // Save to server
      await fetch(`/api/snippets/${currentSnippet.id}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Failed to save snippet:", error)
      // TODO: Add error notification
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full">
      <SnippetEditorLayout
        snippets={folder.snippets}
        currentSnippet={currentSnippet}
        onSnippetSelect={setCurrentSnippet}
        onSnippetChange={handleSnippetChange}
        folderName={folder.name}
        folderId={folder.id}
      />
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}
    </div>
  )
}
