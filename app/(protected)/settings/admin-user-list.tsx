// /components/admin-user-list.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function AdminUserList() {
  const supabase = await createSupabaseServerClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, is_admin, created_at")
    .order("created_at", { ascending: false })

  return (
    <div
      className="
        w-full
        max-w-md
        mx-auto
        mt-6
        p-4
        sm:p-6
        bg-white
        rounded-lg
        shadow
        sm:mx-0
        lg:w-[30%]
        lg:text-right
      "
    >
      <h3 className="font-semibold mb-4 text-gray-800 text-left lg:text-right">
        Current Users
      </h3>

      <ul className="space-y-3 max-h-75 autooverflow-y-">
        {users?.map((u) => (
          <li
            key={u.id}
            className="
              flex
              items-center
              justify-between
              text-sm
              border
              rounded
              px-3
              py-2
              lg:flex-row-reverse
            "
          >
            <span className="font-medium">{u.username}</span>

            <span
              className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${u.is_admin
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"}
              `}
            >
              {u.is_admin ? "Admin" : "Employee"}
            </span>
          </li>
        ))}

        {users?.length === 0 && (
          <li className="text-sm text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  )
}
