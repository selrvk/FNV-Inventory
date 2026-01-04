"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username")
    const password = formData.get("password") as string
    const email = `${username}@fnv.local`

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError("Invalid email or password")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-indigo-950">
      <main className="w-full max-w-md bg-white dark:bg-black p-10 rounded-lg">

        <h1 className="text-4xl font-bold text-center">
          FNV Inventory
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <h2 className="text-center text-3xl font-medium">
            Login
          </h2>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Username
            </label>
            <input
              name="username"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </main>
    </div>
  )
}
