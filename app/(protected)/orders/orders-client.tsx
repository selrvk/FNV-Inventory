"use client";

import { useState } from "react";

type Order = {
  id: number;
  customer_name?: string;
  status: string;
  total_price: number;
  date_created: string;
};

export default function OrdersClient({ orders }: { orders: Order[] }) {
  // Only keep PENDING orders initially
  const [localOrders, setLocalOrders] = useState(
    orders.filter(order => order.status === "PENDING")
  );

  const confirmOrder = async (order_id: number) => {
    const confirmed = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id }),
    }).then(res => res.json());

    if (confirmed.success) {
      alert("Order confirmed!");
      setLocalOrders(prev =>
        prev.filter(o => o.id !== order_id) // remove confirmed order from pending list
      );
    } else {
      alert("Error confirming order: " + confirmed.error);
    }
  };

  const cancelOrder = async (order_id: number) => {
    const cancelled = await fetch("/api/cancel-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id }),
    }).then(res => res.json());

    if (cancelled.success) {
      alert("Order cancelled!");
      setLocalOrders(prev =>
        prev.filter(o => o.id !== order_id) // remove cancelled order from pending list
      );
    } else {
      alert("Error cancelling order: " + cancelled.error);
    }
  };

  if (localOrders.length === 0) return <p>No pending orders.</p>;

  return (
    <div className="space-y-4">
      {localOrders.map(order => (
        <div
          key={order.id}
          className="border p-4 rounded shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-medium">
              Order #{order.id} • {order.customer_name || "No name"}
            </p>
            <p className="text-sm text-gray-500">
              Status: {order.status} • Total: ₱{order.total_price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              Created: {new Date(order.date_created).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => confirmOrder(order.id)}
            >
              Confirm
            </button>

            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => cancelOrder(order.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
