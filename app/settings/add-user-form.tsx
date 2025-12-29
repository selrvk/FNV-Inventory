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
    
    <form onSubmit={handleSubmit} className="p-5 mb-6 space-y-3 w-[50%]">
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="flex flex-col">
        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-[50%] px-2 py-1 border rounded bg-white"
        />
      </div>

      <div className="flex flex-col">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="w-[50%] px-2 py-1 border rounded bg-white"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        <label>Admin User?</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Creating..." : "Add User"}
      </button>
    </form>
  )
}
