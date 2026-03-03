// /app/settings/add-user-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Loader2 } from "lucide-react"

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

      setSuccess("User created successfully.")
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .auf-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }

        .fn-input {
          background: #080e1f;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          padding: 0.55rem 0.75rem;
          font-size: 0.82rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .fn-input::placeholder { color: rgba(255,255,255,0.2); }
        .fn-input:focus {
          border-color: #e8001d;
          box-shadow: 0 0 0 2px rgba(232,0,29,0.12);
        }

        .fn-label {
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.3);
          margin-bottom: 0.35rem;
          display: block;
        }

        .auf-checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.75rem;
          background: #080e1f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          cursor: pointer;
          transition: border-color 0.12s ease;
        }
        .auf-checkbox-row:hover { border-color: rgba(255,255,255,0.15); }
        .auf-checkbox-row input[type="checkbox"] {
          width: 15px; height: 15px;
          accent-color: #e8001d;
          cursor: pointer;
        }

        .btn-add-user {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: #e8001d;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.6rem;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-add-user:hover:not(:disabled) { background: #c8001a; }
        .btn-add-user:disabled { opacity: 0.4; cursor: not-allowed; }

        .msg-error   { font-size: 0.75rem; color: #ff3d50; padding: 0.5rem 0.75rem; background: rgba(232,0,29,0.08); border: 1px solid rgba(232,0,29,0.2); border-radius: 6px; }
        .msg-success { font-size: 0.75rem; color: #34d399; padding: 0.5rem 0.75rem; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); border-radius: 6px; }
      `}</style>

      <form onSubmit={handleSubmit} className="auf-wrap" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", fontWeight: 700 }}>
          Add New User
        </p>

        {error   && <p className="msg-error">{error}</p>}
        {success && <p className="msg-success">{success}</p>}

        <div>
          <label className="fn-label">Username</label>
          <input className="fn-input" value={username} onChange={e => setUsername(e.target.value)} required placeholder="e.g. jdelacruz" />
        </div>

        <div>
          <label className="fn-label">Password</label>
          <input className="fn-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>

        <label className="auf-checkbox-row">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={e => setIsAdmin(e.target.checked)}
          />
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Admin privileges</p>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.1rem" }}>Can manage users and clear history</p>
          </div>
        </label>

        <button type="submit" className="btn-add-user" disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
          {loading ? "Creating..." : "Add User"}
        </button>
      </form>
    </>
  )
}