// /app/orders/page.tsx

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

  const pendingCount = orders?.filter(o => o.status === "PENDING").length ?? 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .fn-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .orders-page { font-family: 'Plus Jakarta Sans', sans-serif; color: #e8ecf5; }
      `}</style>

      <div className="orders-page">

        {/* Header */}
        <div className="flex items-end justify-between border-b pb-6 mb-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1 font-semibold" style={{ color: "#e8001d" }}>
              Sales
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              <h1 className="fn-display text-6xl md:text-7xl text-white leading-none">
                Orders
              </h1>
              {pendingCount > 0 && (
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.5rem",
                  background: "#e8001d",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0 0.5rem",
                  lineHeight: "1.6",
                  letterSpacing: "0.05em"
                }}>
                  {pendingCount} PENDING
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <div style={{ width: "3px", height: "18px", background: "#f5a623", borderRadius: "2px" }} />
          <h2 className="fn-display" style={{ fontSize: "1.25rem", color: "#fff", lineHeight: 1 }}>
            Pending
          </h2>
        </div>

        <OrdersClient orders={orders || []} />
      </div>
    </>
  );
}