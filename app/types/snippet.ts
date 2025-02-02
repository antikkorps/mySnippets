// types/snippet.ts
export interface Tag {
  name: string
  color?: string
}

export interface Snippet {
  id: string
  title: string
  description?: string
  content: string
  language: string
  tags?: Tag[]
}

export interface SnippetListProps {
  snippets: Snippet[]
  selectedSnippetId?: string
  onSnippetSelect: (id: string) => void
  folderName: string
}

export interface SnippetEditorLayoutProps {
  currentSnippet?: Snippet
  onSnippetChange: (content: string) => void
}

export interface LoaderData {
  snippets: Snippet[]
  folderName: string
}
