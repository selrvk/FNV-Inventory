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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .fn-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .co-page    { font-family: 'Plus Jakarta Sans', sans-serif; color: #e8ecf5; }
      `}</style>

      <div className="co-page">
        <div className="flex items-end justify-between border-b pb-6 mb-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1 font-semibold" style={{ color: "#e8001d" }}>
              Sales
            </p>
            <h1 className="fn-display text-6xl md:text-7xl text-white leading-none">
              Create Order
            </h1>
          </div>
        </div>

        <OrderBuilder items={data as Item[]} />
      </div>
    </>
  )
}