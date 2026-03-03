// app/inventory/columns.tsx

"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { DeleteConfirm } from "./delete-confirm"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UpdateProductModal } from "./update-product-modal"

export type Item = {
  barcode: string | null
  id: number
  name: string
  brand: string
  current_stock: number
  unit: string
  price_buy: number
  price_sell: number
}

function SortButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="px-0 font-semibold uppercase tracking-widest text-xs text-slate-400 hover:text-slate-700 hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-1.5 h-3 w-3" />
    </Button>
  )
}

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "barcode",
    size: 130,
    header: ({ column }) => (
      <SortButton onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Barcode
      </SortButton>
    ),
    cell: ({ getValue }) => (
      <span className="text-slate-400 text-xs font-mono">{(getValue() as string) ?? "—"}</span>
    ),
  },
  {
    accessorKey: "id",
    size: 60,
    header: ({ column }) => (
      <SortButton onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID
      </SortButton>
    ),
    cell: ({ getValue }) => (
      <span className="text-slate-400 text-xs tabular-nums">{getValue() as number}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "name",
    size: 220,
    header: ({ column }) => (
      <SortButton onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
      </SortButton>
    ),
    cell: ({ getValue }) => (
      <div className="whitespace-normal break-words max-w-[140px] sm:max-w-[220px] text-sm font-medium text-slate-800">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "brand",
    size: 120,
    header: ({ column }) => (
      <SortButton onClick={() => column.toggleSorting(column.getIsSorted() === "asc", true)}>
        Brand
      </SortButton>
    ),
    cell: ({ getValue }) => (
      <span className="text-sm text-slate-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "current_stock",
    size: 80,
    header: ({ column }) => (
      <div className="text-right">
        <SortButton onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Qty
        </SortButton>
      </div>
    ),
    cell: ({ getValue }) => {
      const stock = getValue<number>()
      const isLow = stock < 10

      return (
        <div className="text-right">
          {isLow ? (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              ⚠ {stock}
            </span>
          ) : (
            <span className="text-sm tabular-nums text-slate-700">{stock}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "unit",
    size: 70,
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Unit</span>
    ),
    cell: ({ getValue }) => (
      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "price_buy",
    size: 90,
    header: () => (
      <div className="text-right">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Unit Price</span>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums text-sm text-slate-600">
        ₱{(getValue<number>()).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "price_sell",
    size: 100,
    header: () => (
      <div className="text-right">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">SRP</span>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums text-sm text-slate-700 font-medium">
        ₱{(getValue<number>()).toFixed(2)}
      </div>
    ),
  },
  {
    id: "total_value",
    size: 110,
    header: () => (
      <div className="text-right">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Value</span>
      </div>
    ),
    cell: ({ row }) => {
      const qty = row.original.current_stock
      const price = row.original.price_sell
      const total = qty * price
      return (
        <div className="text-right tabular-nums text-sm font-semibold text-emerald-600">
          ₱{total.toFixed(2)}
        </div>
      )
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UpdateProductModal item={item} />
            <DeleteConfirm item={item} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]