import { PrismaClient } from "@prisma/client"
// Singleton pattern
const singleton = <T>(key: string, creator: () => T) => {
  const globalSymbols = Object.getOwnPropertySymbols(global)
  const existing = (global as unknown as Record<string, T | undefined>)[key]
  if (existing) {
    return existing
  } else {
    const value = creator()
    ;(globalSymbols as unknown as Record<string, T | undefined>)[key] = value
    return value
  }
}

const prisma = singleton("prisma", () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

  client.$connect()

  return client
})

export { prisma }

// Error handling wrapper
export async function handlePrismaOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error("Database operation failed:", error)
    throw new Error("An error occurred while performing the database operation.")
  }
}
