"use client"

// /app/create-order/order-builder.tsx


import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item } from "../inventory/columns"

type OrderItem = Item & {
  quantity: number
}



export default function OrderBuilder({ items }: { items: Item[] }) {

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);


  const PAGE_SIZE = 5

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.brand?.toLowerCase().includes(search.toLowerCase())
  )

  const pageCount = Math.ceil(filteredItems.length / PAGE_SIZE)

  const paginatedItems = filteredItems.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  )

  
  useEffect(() => {
    setPage(0)
  }, [search])

  
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
  <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">

    {/* PRODUCTS */}
    <div className="lg:col-span-2 space-y-4">

      <h2 className="text-lg font-semibold">Products</h2>

      {/* Search */}
      <Input
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* List */}
      {paginatedItems.length === 0 && (
        <p className="text-sm text-gray-500">
          No products found
        </p>
      )}

      {paginatedItems.map(item => {
        const isOpen = expandedProductId === item.id;

        return (
          <div
            key={item.id}
            className="rounded-lg border p-3 space-y-2 cursor-pointer"
            onClick={() =>
              setExpandedProductId(isOpen ? null : item.id)
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium leading-tight">{item.name}</p>
                <p className="text-xs text-gray-500">
                  ₱{item.price_sell} / {item.unit}
                </p>
              </div>

              <Button
                className="h-9 px-6"
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(item);
                }}
                disabled={item.current_stock === 0}
              >
                Add
              </Button>
            </div>

            {/* Expanded Details */}
            {isOpen && (
              <div className="pt-2 space-y-1 text-xs text-gray-500">
                {item.brand && <p className="font-bold">Brand: {item.brand}</p>}
                <p>Stock: {item.current_stock}</p>
                <p>Unit: {item.unit}</p>
                <p className="font-medium text-gray-700">
                  Price: ₱{item.price_sell}
                </p>
              </div>
            )}
          </div>
        );
      })}


      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            Page {page + 1} of {pageCount}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))}
            disabled={page === pageCount - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>


    {/* ORDER SUMMARY */}
    <div className="rounded-lg border p-4 space-y-4 lg:sticky lg:top-20">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {/* Customer */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Customer Name
        </label>
        <Input
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          placeholder="Optional"
        />
      </div>

      {/* Items */}
      {orderItems.length === 0 && (
        <p className="text-sm text-gray-500">
          No items added yet
        </p>
      )}

      {orderItems.map(item => {
    const isOpen = expandedItemId === item.id;

    return (
      <div key={item.id} className="rounded-md border p-2 space-y-2">

        {/* Header row (click to expand) */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() =>
            setExpandedItemId(isOpen ? null : item.id)
          }
        >
          <p className="text-sm font-medium">
            {item.name}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              x{item.quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Expanded details */}
        {isOpen && (
          <div className="space-y-2 pt-2">

            <Input
              type="number"
              min={1}
              max={item.current_stock}
              value={item.quantity}
              onChange={e => {
                const val = e.target.value;
                updateQuantity(item.id, val === "" ? 0 : Number(val));
              }}
              onBlur={() =>
                updateQuantity(
                  item.id,
                  Math.max(1, Math.min(item.quantity, item.current_stock))
                )
              }
            />

            <p className="text-xs text-gray-500">
              ₱{item.price_sell} × {item.quantity} = ₱
              {(item.price_sell * item.quantity).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    );
  })}


      {/* Total */}
      <div className="border-t pt-3 font-semibold text-right">
        Total: ₱{total.toFixed(2)}
      </div>

      {/* Submit */}
      <Button
        className="w-full h-11"
        onClick={submitOrder}
        disabled={orderItems.length === 0}
      >
        Submit Order
      </Button>
    </div>
  </div>
)

}
