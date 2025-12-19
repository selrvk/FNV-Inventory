// app/inventory/columns.tsx

"use client"

import { deleteProduct } from "./actions"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { it } from "node:test"
import { UpdateProductModal } from "./update-product-modal"

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
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UpdateProductModal item={item} />
            <DropdownMenuItem onClick={() => deleteProduct(item)}>Delete Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]