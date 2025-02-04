import { redirect, type ActionFunctionArgs } from "@remix-run/node"
import { logout } from "~/services/auth.server"

export async function action({ request }: ActionFunctionArgs) {
  return logout(request)
}

export default function LogoutRoute() {
  redirect("/")
  return null
}
