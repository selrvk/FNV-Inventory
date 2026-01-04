// /app/settings/page.tsx
import { AdminUserList } from "./admin-user-list"
import { AddUserForm } from "./add-user-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ProfileSettingsForm } from "./profile-settings-form"


export default async function Settings() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) return <p className="p-6">Please log in</p>

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.is_admin ?? false

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-blue-900 text-2xl sm:text-3xl font-bold">
        SETTINGS
      </h1>

      {isAdmin ? (
        <section className="bg-blue-50 rounded-2xl p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            User Management
          </h2>

          {/* MOBILE: column | DESKTOP: row */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left */}
            <div className="w-full lg:w-[50%]">
              <AddUserForm />
            </div>

            {/* Right */}
            <div className="w-full lg:w-[50%]">
              <AdminUserList />
            </div>
          </div>
        </section>
      ) : (
        <p className="text-gray-600">Welcome User!</p>
      )}

      <section className="bg-blue-50 rounded-2xl p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Profile Management
        </h2>

        <ProfileSettingsForm />
      </section>

    </div>
  )
}
