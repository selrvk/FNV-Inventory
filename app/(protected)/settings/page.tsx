// /app/settings/page.tsx
import { AdminUserList } from "./admin-user-list"
import { AddUserForm } from "./add-user-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"


export default async function Settings() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.getUser()
  const user = data.user

  if (!user) return <p>Please log in</p>

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.is_admin ?? false

  return (
    <div className="p-6">
      <h1 className="text-blue-900 text-3xl font-bold">SETTINGS</h1>

      {isAdmin ? (
        <>
          <div className="flex flex-col mt-6 bg-blue-50 rounded-2xl p-10">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="flex flex-row justify-between">
              <AddUserForm />      {/* Admin-only form */}
              <AdminUserList />    {/* Admin-only list */}
            </div>
          </div>
        </>
      ) : (
        <p className="mt-6 text-gray-600">
          Welcome User!
        </p>
      )}

      <div className="flex flex-col mt-6 bg-blue-50 rounded-2xl p-10">
            <h2 className="text-2xl font-semibold mb-4">Profile Management</h2>
            <div className="flex flex-row justify-between">
            </div>
          </div>
    </div>
  )
}
