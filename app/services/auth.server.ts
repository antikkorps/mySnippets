import { PrismaClient } from "@prisma/client"
import { createCookieSessionStorage, redirect } from "@remix-run/node"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET] as string[],
    secure: process.env.NODE_ENV === "production",
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession()
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  })
}

export async function getUserSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"))
  return session.get("userId")
}

export async function getUser(request: Request) {
  const userId = await getUserSession(request)
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  return user
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserSession(request)
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export async function logout(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"))
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  })
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  })
}

export async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.hashedPassword)
  if (!isValid) return null

  return user
}
