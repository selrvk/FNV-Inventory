"use client"

// /app/create-order/order-builder.tsx

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item } from "../inventory/columns"

type OrderItem = Item & {
  quantity: number
}

export default function OrderBuilder({ items }: { items: Item[] }) {

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  
  function addItem(item: Item) {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        const newQty = Math.min(existing.quantity + 1, item.current_stock)
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: newQty }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function updateQuantity(id: number, qty: number) {
  setOrderItems(prev =>
      prev.map(i => {
        if (i.id !== id) return i;

        // Clamp between 1 and current_stock
        const clamped = Math.max(0, Math.min(qty, i.current_stock));
        return { ...i, quantity: clamped };
      })
    );
  }

  async function submitOrder() {
    if (orderItems.length === 0) return;

    // Prepare the order total
    const totalPrice = orderItems.reduce(
      (sum, i) => sum + i.price_sell * i.quantity,
      0
    );

    try {
      // 1. Insert order
      const { data: orderData, error: orderError } = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_price: totalPrice,
          customer_name: customerName,
          items: orderItems.map(i => ({
            item_id: i.id,
            quantity: i.quantity,
            price_at_time: i.price_sell,
          })),
        }),
      }).then(res => res.json());

      if (orderData?.error || orderError) {
        console.error(orderData?.error || orderError);
        return;
      }

      // Optionally reset order builder
      setOrderItems([]);
      setCustomerName("");
      alert("Order created successfully!");
    } catch (err) {
      console.error(err);
    }
  }


  function removeItem(id: number) {
    setOrderItems(prev => prev.filter(i => i.id !== id))
  }

  const total = orderItems.reduce(
    (sum, i) => sum + i.price_sell * i.quantity,
    0
  )

  return (
    <div className="grid grid-cols-3 gap-6">
      
      {/* LEFT: product selector */}
      <div className="col-span-2 space-y-2">
        <h2 className="text-xl font-semibold">Products</h2>

        {items.map(item => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                ₱{item.price_sell} / {item.unit} • Stock: {item.current_stock}
              </p>
            </div>
            <Button onClick={() => addItem(item)} disabled={item.current_stock === 0}>
              Add
            </Button>
          </div>
        ))}
      </div>

      {/* RIGHT: order summary */}
      <div className="border rounded p-4 space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <Input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>

        {orderItems.map(item => (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between">
              <span>{item.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
              >
                ✕
              </Button>
            </div>

            <div className="relative w-40">
              <Input
                type="number"
                min={1}
                max={item.current_stock}
                value={item.quantity}
                onChange={e => {
                  const val = e.target.value;
                  // Allow empty string temporarily for backspacing
                  const newQty = val === "" ? 0 : Number(val);
                  updateQuantity(item.id, newQty);
                }}
                onBlur={() => {
                  // Clamp and default to 1 if empty
                  updateQuantity(item.id, Math.max(1, Math.min(item.quantity, item.current_stock)));
                }}
                className="pr-12"
              />

              <p className="text-xs text-gray-500">
                Stock available: {item.current_stock}
              </p>
            </div>
          </div>
        ))}


        <div className="border-t pt-4 font-bold">
          Total: ₱{total.toFixed(2)}
        </div>

        <Button className="w-full" onClick={submitOrder}>
          Submit Order
        </Button>
      </div>

    </div>
  )
}
