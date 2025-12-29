// /app/api/admin/add-user/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password, isAdmin } = body

  try {
    // Create the Supabase Auth user
    const { data , error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: `${username}@fnv.local`,
      password,
      email_confirm: true,
    })

    if (userError) throw userError
    if (!data.user) throw new Error("User creation failed")
    
    const userId = data.user.id

    // Insert profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{ id: userId, username, is_admin: isAdmin }])

    if (profileError) throw profileError

    return NextResponse.json({ message: "User created successfully" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
