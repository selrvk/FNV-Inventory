"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, LogIn } from "lucide-react"

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

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError("Invalid username or password.")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #080e1f;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 1.5rem;
        }

        /* Red glow behind the card */
        .login-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(232,0,29,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Red top accent bar */
        .login-card::before {
          content: '';
          display: block;
          height: 3px;
          background: #e8001d;
        }

        .login-header {
          padding: 2rem 2rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .fn-display {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.05em;
        }

        .login-body {
          padding: 1.75rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .fn-label {
          display: block;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.3);
          margin-bottom: 0.4rem;
        }

        .fn-input {
          background: #080e1f;
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          padding: 0.6rem 0.85rem;
          font-size: 0.85rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
          box-sizing: border-box;
        }
        .fn-input::placeholder { color: rgba(255,255,255,0.18); }
        .fn-input:focus {
          border-color: #e8001d;
          box-shadow: 0 0 0 2px rgba(232,0,29,0.12);
        }

        .btn-login {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: #e8001d;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.05rem;
          letter-spacing: 0.1em;
          padding: 0.7rem;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .btn-login:hover:not(:disabled) {
          background: #c8001a;
          transform: translateY(-1px);
        }
        .btn-login:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .msg-error {
          font-size: 0.75rem;
          color: #ff3d50;
          padding: 0.5rem 0.75rem;
          background: rgba(232,0,29,0.08);
          border: 1px solid rgba(232,0,29,0.2);
          border-radius: 6px;
          text-align: center;
        }
      `}</style>

      <div className="login-page">
        <div className="login-glow" />

        <div className="login-card">

          {/* Header */}
          <div className="login-header">
            <img
              src="/fnv.png"
              alt="FN logo"
              style={{ height: "52px", objectFit: "contain", margin: "0 auto 0.875rem" }}
            />
            <p className="fn-display" style={{ fontSize: "1.6rem", color: "#fff", lineHeight: 1 }}>
              Inventory System
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", marginTop: "0.35rem", letterSpacing: "0.05em" }}>
              Sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-body">

            {error && <p className="msg-error">{error}</p>}

            <div>
              <label className="fn-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                className="fn-input"
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="fn-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="fn-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Signing in...</>
                : <><LogIn size={15} /> Sign In</>
              }
            </button>
          </form>
        </div>
      </div>
    </>
  )
}