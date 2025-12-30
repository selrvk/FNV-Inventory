// /components/admin-user-list.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function AdminUserList() {
  const supabase = await createSupabaseServerClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, is_admin, created_at")

  return (
    <div className="mt-4  w-[30%] text-end">
      <h3 className="font-semibold mb-5">Current Users</h3>
      <ul className="space-y-2">
        {users?.map((u) => (
          <li key={u.id}>
            {u.username} — {u.is_admin ? "Admin" : "Employee"}
          </li>
        ))}
      </ul>
    </div>
  )
}
