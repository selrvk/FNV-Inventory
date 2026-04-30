"use client"

import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export default function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (mobile) {
    return (
      <button onClick={handleLogout} className="mobile-nav-item" style={{ flex: 1, background: "none", border: "none", cursor: "pointer" }}>
        <LogOut size={20} strokeWidth={1.8} />
      </button>
    )
  }

  return (
    <button onClick={handleLogout} className="nav-item nav-item-logout" style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
      <LogOut size={15} strokeWidth={2} />
      Logout
    </button>
  )
}
