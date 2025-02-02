import { Editor } from "@monaco-editor/react"
import { useState } from "react"
import { FiCopy, FiShare2 } from "react-icons/fi"

type SnippetType = {
  id: string
  title: string
  content: string
  language: string
}

interface SnippetEditorLayoutProps {
  currentSnippet?: SnippetType
  onSnippetChange: (content: string) => void
}

export default function SnippetEditorLayout({
  currentSnippet,
  onSnippetChange,
}: SnippetEditorLayoutProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    if (currentSnippet) {
      await navigator.clipboard.writeText(currentSnippet.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {currentSnippet ? (
        <>
          {/* Editor toolbar */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold dark:text-white">
                {currentSnippet.title}
              </h2>
              <span className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {currentSnippet.language}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 relative"
                title="Copier le code"
              >
                <FiCopy className="h-5 w-5" />
                {isCopied && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded">
                    Copié !
                  </span>
                )}
              </button>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                title="Partager"
              >
                <FiShare2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={currentSnippet.language}
              defaultValue={currentSnippet.content}
              theme="vs-dark"
              onChange={(value) => onSnippetChange(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20 },
              }}
            />
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          Sélectionnez un snippet pour commencer l&apos;édition
        </div>
      )}
    </div>
  )
}
