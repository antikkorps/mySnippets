import type { Prisma } from "@prisma/client"

export type PrismaSnippet = Prisma.SnippetGetPayload<{
  include: {
    tags: {
      select: {
        name: true
        color: true
      }
    }
  }
}>
export interface Tag {
  name: string
  color?: string | null
}

export interface Snippet extends Omit<PrismaSnippet, "tags"> {
  tags: Tag[]
}
export type SnippetWithTags = {
  id: string
  title: string
  content: string
  language: string
  description: string | null
  tags: {
    name: string
    color: string | null
  }[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  user: string
  userId: string
  folder: string
  folderId: string | null
  stars: number
  version: number
}

export interface SnippetListProps {
  snippets: SnippetWithTags[]
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
