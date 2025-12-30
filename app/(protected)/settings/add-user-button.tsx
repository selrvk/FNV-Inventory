// /components/add-user-button.tsx
"use client"
import { useRouter } from "next/navigation"

export function AddUserButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push("/settings/add-user")}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
    >
      Add New User
    </button>
  )
}
