import { Editor } from "@monaco-editor/react"
import { Link } from "@remix-run/react"
import { useState } from "react"
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiCode } from "react-icons/fi"

type SnippetType = {
  id: string
  title: string
  content: string
  language: string
}

interface SnippetEditorLayoutProps {
  snippets: SnippetType[]
  currentSnippet?: SnippetType
  onSnippetSelect: (snippet: SnippetType) => void
  onSnippetChange: (content: string) => void
  folderName?: string
  folderId: string
}

export default function SnippetEditorLayout({
  snippets,
  currentSnippet,
  onSnippetSelect,
  onSnippetChange,
  folderName,
  folderId,
}: SnippetEditorLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <div className="relative flex h-full">
      {/* Mobile Header - Shown only on mobile when editor is open */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex items-center p-2">
          <Link
            to={`/?folderId=${folderId}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Retour à la liste des dossiers"
          >
            <FiArrowLeft className="h-5 w-5 dark:text-gray-400" />
          </Link>
          <span className="ml-2 font-medium dark:text-white truncate">
            {currentSnippet?.title || "Sélectionnez un snippet"}
          </span>
        </div>
      </div>

      {/* Desktop Drawer Toggle - Hidden on mobile */}
      {!drawerOpen && (
        <div className="hidden md:block absolute top-0 left-0 z-40 p-2 bg-white dark:bg-gray-800 border-r border-b dark:border-gray-700 rounded-br-lg">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Ouvrir la liste des snippets"
          >
            <FiChevronRight className="h-5 w-5 dark:text-gray-400" />
          </button>
        </div>
      )}

      {/* Drawer - Hidden on mobile */}
      <div
        className={`hidden md:block absolute md:relative h-full transition-transform duration-300 z-30
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
          ${!drawerOpen ? "w-0" : "w-64"}
        `}
      >
        <div className="h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700">
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                {folderName || "Snippets"}
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FiChevronLeft className="h-5 w-5 dark:text-gray-400" />
              </button>
            </div>

            {/* Snippet List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {snippets.map((snippet) => (
                  <button
                    key={snippet.id}
                    onClick={() => onSnippetSelect(snippet)}
                    className={`w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer
                      ${
                        currentSnippet?.id === snippet.id
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }`}
                  >
                    <FiCode className="mr-2 dark:text-gray-400 shrink-0" />
                    <span className="dark:text-gray-300 text-left truncate">
                      {snippet.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 mt-[52px] md:mt-0">
        {" "}
        {/* Add top margin for mobile header */}
        <div className="h-full">
          {currentSnippet ? (
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
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              Sélectionnez un snippet pour commencer l&apos;édition
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
