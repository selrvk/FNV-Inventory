// /app/create-order/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server"
import OrderBuilder from "./order-builder"
import { Item } from "../inventory/columns"

export default async function CreateOrder() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("name")

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-blue-900 text-3xl font-bold mb-6">
        CREATE ORDER
      </h1>

      <OrderBuilder items={data as Item[]} />
    </div>
  )
}
