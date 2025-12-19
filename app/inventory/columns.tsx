// app/inventory/columns.tsx

"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type Item = {
    id: number
    name: string
    current_stock: number
    brand: string
    price_buy: number
    price_sell: number
}

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "current_stock",
    header: "Current Stock",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "price_buy",
    header: "Buy Price",
  },
  {
    accessorKey: "price_sell",
    header: "Sell Price",
  },
]