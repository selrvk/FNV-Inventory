"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item } from "../inventory/columns"

type OrderItem = Item & {
  quantity: number
}

export default function OrderBuilder({ items }: { items: Item[] }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  function addItem(item: Item) {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function updateQuantity(id: number, qty: number) {
    setOrderItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: qty } : i
      )
    )
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
              <p className="text-sm text-gray-500">₱{item.price_sell}</p>
            </div>
            <Button onClick={() => addItem(item)}>
              Add
            </Button>
          </div>
        ))}
      </div>

      {/* RIGHT: order summary */}
      <div className="border rounded p-4 space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>

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

            <Input
              type="number"
              min={1}
              value={item.quantity}
              onChange={e =>
                updateQuantity(item.id, Number(e.target.value))
              }
            />
          </div>
        ))}

        <div className="border-t pt-4 font-bold">
          Total: ₱{total.toFixed(2)}
        </div>

        <Button className="w-full">
          Submit Order
        </Button>
      </div>
    </div>
  )
}
