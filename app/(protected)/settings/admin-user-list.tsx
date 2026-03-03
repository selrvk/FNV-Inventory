// /app/settings/admin-user-list.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function AdminUserList() {
  const supabase = await createSupabaseServerClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, is_admin, created_at")
    .order("created_at", { ascending: false })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .aul-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fn-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }

        .user-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.12s ease;
        }
        .user-row:last-child { border-bottom: none; }

        .pill-admin {
          font-size: 0.62rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0.15rem 0.55rem; border-radius: 20px;
          background: rgba(42,91,215,0.15); color: #6b9fff;
          border: 1px solid rgba(42,91,215,0.25);
        }
        .pill-employee {
          font-size: 0.62rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0.15rem 0.55rem; border-radius: 20px;
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>

      <div className="aul-wrap">
        <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", fontWeight: 700, marginBottom: "0.75rem" }}>
          Current Users
        </p>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {!users || users.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>No users found.</p>
          ) : (
            users.map(u => (
              <div key={u.id} className="user-row">
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                  {u.username}
                </span>
                <span className={u.is_admin ? "pill-admin" : "pill-employee"}>
                  {u.is_admin ? "Admin" : "Employee"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}