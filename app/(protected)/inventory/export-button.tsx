"use client"

import { Download } from "lucide-react"
import * as XLSX from "xlsx"
import { Item } from "./columns"

export function ExportInventoryButton({ data }: { data: Item[] }) {
  const handleExport = () => {
    const rows = data.map(item => ({
      ID: item.id,
      Barcode: item.barcode ?? "",
      Name: item.name,
      Brand: item.brand ?? "",
      Stock: item.current_stock,
      Unit: item.unit,
      "Unit Price (Buy)": item.price_buy,
      "SRP (Sell)": item.price_sell,
      "Total Value (Sell)": +(item.current_stock * item.price_sell).toFixed(2),
    }))

    const ws = XLSX.utils.json_to_sheet(rows)

    ws["!cols"] = [
      { wch: 6 },
      { wch: 16 },
      { wch: 32 },
      { wch: 18 },
      { wch: 8 },
      { wch: 8 },
      { wch: 16 },
      { wch: 12 },
      { wch: 18 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Inventory")

    const filename = `inventory_${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, filename)
  }

  return (
    <button onClick={handleExport} className="inv-btn-secondary">
      <Download size={13} />
      Export to Excel
    </button>
  )
}
