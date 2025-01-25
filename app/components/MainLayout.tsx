import { Code2, LogOut, Menu, Search, Settings, User } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <Code2 size={24} className="text-blue-600" />
            <span className="text-xl font-semibold">SnippetManager</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher un snippet..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <User size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 border-r bg-white transition-all duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <nav className="space-y-1">
              <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                Mes Snippets
              </div>
              <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                Dossiers
              </div>
              <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">Tags</div>
            </nav>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
