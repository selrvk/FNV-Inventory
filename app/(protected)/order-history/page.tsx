import { createSupabaseServerClient } from "@/lib/supabase/server"
import { clearAllOrderHistory, clearSingleOrder } from "./actions"
import { CheckCircle, XCircle, Trash2, Package } from "lucide-react"
import { ExportCSVButton } from "./export-csv-button"

export default async function OrderHistory() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) return <p className="p-6" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Please log in.</p>

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.is_admin ?? false

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .in("status", ["COMPLETED", "CANCELLED"])
    .order("date_completed", { ascending: false })

  if (ordersError) return <pre>{JSON.stringify(ordersError, null, 2)}</pre>

  const orderIds = orders?.map(o => o.id) ?? []

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_item")
    .select("*, items(name, unit)")
    .in("order_id", orderIds)

  if (itemsError) return <pre>{JSON.stringify(itemsError, null, 2)}</pre>

  const completedCount = orders?.filter(o => o.status === "COMPLETED").length ?? 0
  const cancelledCount = orders?.filter(o => o.status === "CANCELLED").length ?? 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .fn-display  { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .oh-page     { font-family: 'Plus Jakarta Sans', sans-serif; color: #e8ecf5; }

        .oh-stat {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 0.875rem 1.25rem;
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .oh-stat:nth-child(1) { animation-delay: 0.05s; border-top: 2px solid #34d399; }
        .oh-stat:nth-child(2) { animation-delay: 0.10s; border-top: 2px solid rgba(232,0,29,0.5); }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .order-card {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          overflow: hidden;
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        .order-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          border-left: 3px solid transparent;
        }
        .order-card.completed .order-card-header { border-left-color: #34d399; }
        .order-card.cancelled .order-card-header { border-left-color: rgba(232,0,29,0.5); }

        .status-pill-completed {
          display: inline-flex; align-items: center; gap: 0.25rem;
          font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.12em; padding: 0.2rem 0.6rem; border-radius: 20px;
          background: rgba(52,211,153,0.1); color: #34d399;
          border: 1px solid rgba(52,211,153,0.25);
        }
        .status-pill-cancelled {
          display: inline-flex; align-items: center; gap: 0.25rem;
          font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.12em; padding: 0.2rem 0.6rem; border-radius: 20px;
          background: rgba(232,0,29,0.08); color: #ff3d50;
          border: 1px solid rgba(232,0,29,0.2);
        }

        .items-section {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 0.75rem 1.25rem;
          background: rgba(0,0,0,0.15);
        }

        .item-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 0.78rem;
        }
        .item-line:last-child { border-bottom: none; }

        .btn-clear-all {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(232,0,29,0.08);
          color: #ff3d50;
          border: 1px solid rgba(232,0,29,0.2);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem; font-weight: 700;
          padding: 0.5rem 1rem; border-radius: 6px;
          cursor: pointer; transition: all 0.15s ease;
        }
        .btn-clear-all:hover {
          background: rgba(232,0,29,0.15);
          border-color: rgba(232,0,29,0.4);
        }

        .btn-clear-single {
          display: inline-flex; align-items: center; gap: 0.25rem;
          background: transparent; color: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.07);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.68rem; font-weight: 600;
          padding: 0.3rem 0.6rem; border-radius: 5px;
          cursor: pointer; transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .btn-clear-single:hover {
          color: #ff3d50; border-color: rgba(232,0,29,0.3);
          background: rgba(232,0,29,0.06);
        }

        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 4rem 2rem; text-align: center;
          background: #0d1730; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="oh-page">

        {/* Header */}
        <div className="flex items-end justify-between border-b pb-6 mb-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1 font-semibold" style={{ color: "#e8001d" }}>
              Sales
            </p>
            <h1 className="fn-display text-6xl md:text-7xl text-white leading-none">
              Order History
            </h1>
          </div>

          {orders && orders.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ExportCSVButton orders={orders} orderItems={orderItems ?? []} />
              {isAdmin && (
                <form action={clearAllOrderHistory}>
                  <button type="submit" className="btn-clear-all">
                    <Trash2 size={13} /> Clear All History
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {orders && orders.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-8" style={{ maxWidth: "400px" }}>
            <div className="oh-stat">
              <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.25rem" }}>Completed</p>
              <p className="fn-display" style={{ fontSize: "2rem", color: "#34d399", lineHeight: 1 }}>{completedCount}</p>
            </div>
            <div className="oh-stat">
              <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.25rem" }}>Cancelled</p>
              <p className="fn-display" style={{ fontSize: "2rem", color: "#ff3d50", lineHeight: 1 }}>{cancelledCount}</p>
            </div>
          </div>
        )}

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <div style={{ width: "3px", height: "18px", background: "#e8001d", borderRadius: "2px" }} />
          <h2 className="fn-display" style={{ fontSize: "1.25rem", color: "#fff", lineHeight: 1 }}>Records</h2>
        </div>

        {/* Orders */}
        {!orders || orders.length === 0 ? (
          <div className="empty-state">
            <Package size={32} style={{ marginBottom: "0.75rem", opacity: 0.3 }} />
            <p className="fn-display" style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.25rem" }}>No History Yet</p>
            <p style={{ fontSize: "0.78rem" }}>Completed and cancelled orders will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {orders.map((order, i) => {
              const isCompleted = order.status === "COMPLETED"
              const itemsForOrder = orderItems?.filter(item => item.order_id === order.id)

              return (
                <div
                  key={order.id}
                  className={`order-card ${isCompleted ? "completed" : "cancelled"}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="order-card-header">
                    {/* Left: order info */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                      {/* Order # */}
                      <div style={{ flexShrink: 0 }}>
                        <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.1rem" }}>Order</p>
                        <p className="fn-display" style={{ fontSize: "1.5rem", color: "#fff", lineHeight: 1 }}>#{order.id}</p>
                      </div>

                      <div style={{ width: "1px", height: "2.5rem", background: "rgba(255,255,255,0.07)", flexShrink: 0, marginTop: "0.25rem" }} />

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                            {order.customer_name || "No name"}
                          </span>
                          <span className={isCompleted ? "status-pill-completed" : "status-pill-cancelled"}>
                            {isCompleted
                              ? <><CheckCircle size={9} /> Completed</>
                              : <><XCircle size={9} /> Cancelled</>
                            }
                          </span>
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                          {order.date_completed
                            ? new Date(order.date_completed).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
                            : "Date N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Right: total + admin clear */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.1rem" }}>Total</p>
                        <p className="fn-display" style={{ fontSize: "1.3rem", color: "#fff", lineHeight: 1 }}>
                          ₱{order.total_price.toFixed(2)}
                        </p>
                      </div>

                      {isAdmin && (
                        <form action={async () => { "use server"; await clearSingleOrder(order.id) }}>
                          <button type="submit" className="btn-clear-single">
                            <Trash2 size={10} /> Clear
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Items breakdown */}
                  {itemsForOrder && itemsForOrder.length > 0 && (
                    <div className="items-section">
                      <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem", fontWeight: 700 }}>
                        Items
                      </p>
                      {itemsForOrder.map(item => (
                        <div key={item.id} className="item-line">
                          <span style={{ color: "rgba(255,255,255,0.65)" }}>
                            {item.items.name}
                          </span>
                          <span style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0, marginLeft: "1rem" }}>
                            {item.quantity} {item.items.unit}
                            <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, marginLeft: "0.5rem" }}>
                              @ ₱{item.price_at_time.toFixed(2)}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}