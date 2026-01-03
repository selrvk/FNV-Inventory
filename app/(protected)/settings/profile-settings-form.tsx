"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function ProfileSettingsForm() {
  const supabase = createSupabaseBrowserClient()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)


  const updatePassword = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) setError(error.message)
    else setMessage("Password updated successfully.")

    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-md">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      {/* Change Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">New Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={updatePassword}
          disabled={loading || password.length < 6}
          className="w-full py-2 bg-gray-800 text-white rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  )
}
