// /app/settings/page.tsx
import { AdminUserList } from "./admin-user-list"
import { AddUserForm } from "./add-user-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ProfileSettingsForm } from "./profile-settings-form"
import { Shield, User } from "lucide-react"

export default async function Settings() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) return <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Plus Jakarta Sans, sans-serif", padding: "1.5rem" }}>Please log in.</p>

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.is_admin ?? false

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .fn-display  { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .st-page     { font-family: 'Plus Jakarta Sans', sans-serif; color: #e8ecf5; }

        .st-panel {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
        }
        .st-panel-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(0,0,0,0.2);
        }
      `}</style>

      <div className="st-page">

        {/* Page header */}
        <div className="flex items-end border-b pb-6 mb-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1 font-semibold" style={{ color: "#e8001d" }}>
              System
            </p>
            <h1 className="fn-display text-6xl md:text-7xl text-white leading-none">
              Settings
            </h1>
          </div>
        </div>

        <div className="space-y-6">

          {/* Admin: User Management */}
          {isAdmin ? (
            <div className="st-panel">
              <div className="st-panel-header">
                <Shield size={14} style={{ color: "#e8001d" }} />
                <h2 className="fn-display" style={{ fontSize: "1.25rem", color: "#fff", lineHeight: 1 }}>
                  User Management
                </h2>
                <span style={{ marginLeft: "0.25rem", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", background: "rgba(232,0,29,0.12)", color: "#ff3d50", border: "1px solid rgba(232,0,29,0.2)", borderRadius: "20px", padding: "0.15rem 0.5rem" }}>
                  Admin
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x" style={{ "--tw-divide-opacity": 1, borderColor: "rgba(255,255,255,0.06)" } as any}>
                <div className="p-5 lg:p-6">
                  <AddUserForm />
                </div>
                <div className="p-5 lg:p-6">
                  <AdminUserList />
                </div>
              </div>
            </div>
          ) : (
            <div className="st-panel" style={{ padding: "1.25rem" }}>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)" }}>
                Welcome! Contact an admin to manage users.
              </p>
            </div>
          )}

          {/* Profile Management */}
          <div className="st-panel">
            <div className="st-panel-header">
              <User size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              <h2 className="fn-display" style={{ fontSize: "1.25rem", color: "#fff", lineHeight: 1 }}>
                Profile
              </h2>
            </div>
            <div className="p-5 lg:p-6">
              <ProfileSettingsForm />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}