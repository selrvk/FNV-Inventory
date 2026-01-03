import { createSupabaseServerClient } from "@/lib/supabase/server"
import { clearAllOrderHistory, clearSingleOrder } from "./actions"

export default async function OrderHistory() {
  const supabase = await createSupabaseServerClient()

  // 🔐 Get current user
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) return <p className="p-6">Please log in</p>

  // 🔐 Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.is_admin ?? false

  // Fetch completed / cancelled orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .in("status", ["COMPLETED", "CANCELLED"])
    .order("date_completed", { ascending: false })

  if (ordersError) {
    return <pre>{JSON.stringify(ordersError, null, 2)}</pre>
  }

  const orderIds = orders?.map(o => o.id) ?? []

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_item")
    .select("*, items(name, unit)")
    .in("order_id", orderIds)

  if (itemsError) {
    return <pre>{JSON.stringify(itemsError, null, 2)}</pre>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-blue-900 text-3xl font-bold">
          ORDER HISTORY
        </h1>

        {/* 🔐 ADMIN ONLY */}
        {isAdmin && orders && orders.length > 0 && (
          <form action={clearAllOrderHistory}>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Clear Order History
            </button>
          </form>
        )}
      </div>

      {!orders || orders.length === 0 ? (
        <p>No orders in history.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const itemsForOrder = orderItems?.filter(
              item => item.order_id === order.id
            )

            return (
              <div
                key={order.id}
                className="border p-4 rounded shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      Order #{order.id} •{" "}
                      {order.customer_name || "No name"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {order.status} • Total: ₱
                      {order.total_price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Completed:{" "}
                      {order.date_completed
                        ? new Date(order.date_completed).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  {/* 🔐 ADMIN ONLY */}
                  {isAdmin && (
                    <form
                      action={async () => {
                        "use server"
                        await clearSingleOrder(order.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:underline"
                      >
                        Clear Record
                      </button>
                    </form>
                  )}
                </div>

                {/* Ordered items */}
                {itemsForOrder && itemsForOrder.length > 0 && (
                  <div className="mt-2 border-t pt-2">
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Items:
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {itemsForOrder.map(item => (
                        <li key={item.id}>
                          {item.items.name} — {item.quantity}{" "}
                          {item.items.unit} @ ₱
                          {item.price_at_time.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
