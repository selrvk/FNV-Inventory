"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    throw new Error("Forbidden")
  }

  return supabase
}

export async function clearAllOrderHistory() {
  const supabase = await requireAdmin()

  await supabase
    .from("orders")
    .delete()
    .in("status", ["COMPLETED", "CANCELLED"])

  revalidatePath("/order-history")
}

export async function clearSingleOrder(orderId: number) {
  const supabase = await requireAdmin()

  await supabase
    .from("orders")
    .delete()
    .eq("id", orderId)

  revalidatePath("/order-history")
}
