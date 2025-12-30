import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { order_id } = await req.json();

  try {
    // 1. Get all items for this order
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_item")
      .select("*")
      .eq("order_id", order_id);

    if (itemsError) throw itemsError;
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ success: false, error: "No items found for this order" }, { status: 400 });
    }

    // 2. Update current_stock for each item
    for (const item of orderItems) {
      // Get current stock
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("current_stock")
        .eq("id", item.item_id)
        .single();

      if (itemError) throw itemError;

      const newStock = Math.max(0, (itemData?.current_stock || 0) - item.quantity);

      // Update stock
      const { error: updateError } = await supabase
        .from("items")
        .update({ current_stock: newStock })
        .eq("id", item.item_id);

      if (updateError) throw updateError;
    }

    // 3. Update order status to CONFIRMED
    const { error: orderError } = await supabase
      .from("orders")
      .update({ status: "COMPLETED", date_completed: new Date().toISOString() })
      .eq("id", order_id);

    if (orderError) throw orderError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
