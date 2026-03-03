"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { KeyRound, Loader2 } from "lucide-react"

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
    else { setMessage("Password updated."); setPassword("") }

    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .psf-wrap { font-family: 'Plus Jakarta Sans', sans-serif; max-width: 380px; display: flex; flex-direction: column; gap: 0.85rem; }

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

        .btn-update {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.6rem 1.25rem;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-update:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }
        .btn-update:disabled { opacity: 0.35; cursor: not-allowed; }

        .msg-error   { font-size: 0.75rem; color: #ff3d50; padding: 0.5rem 0.75rem; background: rgba(232,0,29,0.08); border: 1px solid rgba(232,0,29,0.2); border-radius: 6px; }
        .msg-success { font-size: 0.75rem; color: #34d399; padding: 0.5rem 0.75rem; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); border-radius: 6px; }
      `}</style>

      <div className="psf-wrap">
        {error   && <p className="msg-error">{error}</p>}
        {message && <p className="msg-success">{message}</p>}

        <div>
          <label className="fn-label">New Password</label>
          <input
            className="fn-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            className="btn-update"
            onClick={updatePassword}
            disabled={loading || password.length < 6}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </>
  )
}