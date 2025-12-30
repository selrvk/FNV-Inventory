import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { order_id } = await req.json();

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: "CANCELLED", date_cancelled: new Date().toISOString() })
      .eq("id", order_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
