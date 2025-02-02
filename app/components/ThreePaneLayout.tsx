import { Link } from "@remix-run/react"
import React, { useEffect, useState } from "react"
import { FiMenu, FiSearch } from "react-icons/fi"

interface ThreePaneLayoutProps {
  navigationContent: React.ReactNode
  listContent: React.ReactNode
  editorContent: React.ReactNode
  title?: string
  selectedFolderId?: string
}

const ThreePaneLayout = ({
  navigationContent,
  listContent,
  editorContent,
  title = "SnippetManager",
  selectedFolderId,
}: ThreePaneLayoutProps) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(true)

  // Gestion responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsNavigationOpen(true)
      } else if (window.innerWidth < 768) {
        setIsNavigationOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header - visible sur tous les écrans */}
      <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsNavigationOpen(!isNavigationOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200"
            aria-label="Toggle navigation"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold dark:text-gray-200">{title}</h1>
        </div>
      </header>

      {/* Container principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation avec overlay sur mobile */}
        <div
          className={`${
            isNavigationOpen
              ? "translate-x-0 md:relative md:translate-x-0"
              : "-translate-x-full"
          } fixed md:relative z-30 w-64 h-[calc(100vh-4rem)] transition-transform duration-300 bg-white dark:bg-gray-800 border-r dark:border-gray-700`}
        >
          {navigationContent}
        </div>

        {/* Overlay sombre sur mobile quand la navigation est ouverte */}
        {isNavigationOpen && (
          <button
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsNavigationOpen(false)}
          />
        )}

        {/* Liste - visible si un dossier est sélectionné */}
        <div
          className={`${
            selectedFolderId ? "w-80" : "w-0"
          } flex-shrink-0 transition-all duration-300 bg-white dark:bg-gray-800 border-r dark:border-gray-700`}
        >
          {selectedFolderId && listContent}
        </div>

        {/* Éditeur */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {editorContent}
        </div>
      </div>
    </div>
  )
}

export default ThreePaneLayout

// Composants complémentaires
export const NavigationItem = ({
  to,
  icon: Icon,
  children,
  isActive = false,
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  isActive?: boolean
}) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
      ${
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
      }`}
  >
    <Icon className="h-5 w-5" />
    <span>{children}</span>
  </Link>
)

export const SearchBar = () => (
  <div className="p-4 border-b dark:border-gray-700">
    <div className="relative">
      <input
        type="text"
        placeholder="Rechercher..."
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 
                 border border-gray-300 dark:border-gray-600 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  </div>
)
