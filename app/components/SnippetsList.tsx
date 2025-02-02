interface PrismaSnippet {
  id: string
  title: string
  description: string | null
  content: string
  language: string
  tags: {
    name: string
    color: string | null
  }[]
}

interface SnippetListProps {
  snippets: PrismaSnippet[]
  selectedSnippetId?: string
  onSnippetSelect: (snippetId: string) => void
  folderName: string
}

export default function SnippetList({
  snippets,
  selectedSnippetId,
  onSnippetSelect,
  folderName,
}: SnippetListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* En-tête de la liste */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">{folderName}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {snippets.length} snippets
          </span>
        </div>
      </div>

      {/* Liste des snippets */}
      <div className="flex-1 overflow-y-auto">
        {snippets.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Aucun snippet dans ce dossier
          </div>
        ) : (
          snippets.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => onSnippetSelect(snippet.id)}
              className={`w-full text-left p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                ${
                  selectedSnippetId === snippet.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {snippet.title}
                  </h3>
                  {snippet.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {snippet.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {snippet.language}
                    </span>
                    {snippet.tags?.map((tag) => (
                      <span
                        key={tag.name}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                        style={{
                          backgroundColor: tag.color ? `${tag.color}20` : "#e5e7eb",
                          color: tag.color || "#374151",
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prévisualisation du code */}
              <div className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded-lg p-2 overflow-hidden">
                <pre className="line-clamp-3 text-gray-600 dark:text-gray-300">
                  {snippet.content}
                </pre>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
