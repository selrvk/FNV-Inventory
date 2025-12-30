import { createSupabaseServerClient } from "@/lib/supabase/server";
import OrdersClient from "./orders-client";

export default async function Orders() {
  const supabase = await createSupabaseServerClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("date_created", { ascending: false });

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-blue-900 text-3xl font-bold mb-6">ORDERS</h1>
      <OrdersClient orders={orders || []} />
    </div>
  );
}
