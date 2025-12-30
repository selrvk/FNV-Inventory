import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();
  const { total_price, items, customer_name} = body;

  if (!items || !items.length) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ total_price, customer_name })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const order_id = order.id;

  // Insert order items
  const { error: itemsError } = await supabase.from("order_item").insert(
    items.map((i: any) => ({
      order_id,
      item_id: i.item_id,
      quantity: i.quantity,
      price_at_time: i.price_at_time,
    }))
  );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, order_id });
}
