"use client"

import { Download } from "lucide-react"

type OrderItem = {
  id: number
  order_id: number
  quantity: number
  price_at_time: number
  items: { name: string; unit: string }
}

type Order = {
  id: number
  customer_name?: string | null
  status: string
  total_price: number
  date_completed?: string | null
}

function escapeCSV(value: string | number | null | undefined): string {
  const str = String(value ?? "")
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function ExportCSVButton({ orders, orderItems }: { orders: Order[]; orderItems: OrderItem[] }) {
  const handleExport = () => {
    const headers = ["Order ID", "Customer", "Status", "Date", "Item", "Qty", "Unit", "Price at Time", "Line Total", "Order Total"]

    const rows: string[][] = []

    for (const order of orders) {
      const items = orderItems.filter(i => i.order_id === order.id)
      const date = order.date_completed
        ? new Date(order.date_completed).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : ""

      if (items.length === 0) {
        rows.push([
          String(order.id),
          order.customer_name ?? "",
          order.status,
          date,
          "", "", "", "", "",
          order.total_price.toFixed(2),
        ])
      } else {
        items.forEach((item, idx) => {
          rows.push([
            idx === 0 ? String(order.id) : "",
            idx === 0 ? (order.customer_name ?? "") : "",
            idx === 0 ? order.status : "",
            idx === 0 ? date : "",
            item.items.name,
            String(item.quantity),
            item.items.unit,
            item.price_at_time.toFixed(2),
            (item.quantity * item.price_at_time).toFixed(2),
            idx === 0 ? order.total_price.toFixed(2) : "",
          ])
        })
      }
    }

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `order_history_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleExport} className="btn-clear-all" style={{ background: "rgba(42,91,215,0.1)", color: "#6b9fff", borderColor: "rgba(42,91,215,0.25)" }}>
      <Download size={13} /> Export CSV
    </button>
  )
}
