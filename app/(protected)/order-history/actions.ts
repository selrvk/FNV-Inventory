// /app/order-history/actions.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function clearAllOrderHistory() {
  const supabase = await createSupabaseServerClient();

  // 1️⃣ Get order IDs
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id")
    .in("status", ["COMPLETED", "CANCELLED"]);

  if (error || !orders || orders.length === 0) {
    return;
  }

  const orderIds = orders.map(o => o.id);

  // 2️⃣ Delete order items
  await supabase
    .from("order_item")
    .delete()
    .in("order_id", orderIds);

  // 3️⃣ Delete orders
  await supabase
    .from("orders")
    .delete()
    .in("id", orderIds);

  revalidatePath("/order-history");
}

export async function clearSingleOrder(orderId: number) {
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("order_item")
    .delete()
    .eq("order_id", orderId);

  await supabase
    .from("orders")
    .delete()
    .eq("id", orderId);

  revalidatePath("/order-history");
}
