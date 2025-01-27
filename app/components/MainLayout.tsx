import { Form } from "@remix-run/react"
import type { ReactNode } from "react"
import { useState } from "react"

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200"
          ></button>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold dark:text-gray-200">
              SnippetManager
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un snippet..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200"></button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200"></button>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-600"
            ></button>
          </Form>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 border-r dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <nav className="space-y-1">
              <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer dark:text-gray-200">
                Mes Snippets
              </div>
              <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer dark:text-gray-200">
                Dossiers
              </div>
              <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer dark:text-gray-200">
                Tags
              </div>
            </nav>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
