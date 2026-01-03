// /components/add-user-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddUserForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, isAdmin }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create user")

      setSuccess("User created successfully!")
      setUsername("")
      setPassword("")
      setIsAdmin(false)

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-md
        mx-auto
        p-4
        sm:p-6
        space-y-4
        bg-white
        rounded-lg
        shadow
      "
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Add New User
      </h2>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="
            w-full
            px-3
            py-2
            border
            rounded
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="
            w-full
            px-3
            py-2
            border
            rounded
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>

      <label className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="h-4 w-4"
        />
        <span>Admin user</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          py-2
          bg-blue-600
          text-white
          rounded
          font-medium
          hover:bg-blue-700
          disabled:opacity-60
        "
      >
        {loading ? "Creating..." : "Add User"}
      </button>
    </form>
  )
}
