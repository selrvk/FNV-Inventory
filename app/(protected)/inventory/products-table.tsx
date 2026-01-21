// app/inventory/products-table.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData extends {
  current_stock: number
  unit: string
  price_buy: number
  price_sell: number
}, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)")
    setIsMobile(media.matches)

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    media.addEventListener("change", listener)

    return () => media.removeEventListener("change", listener)
  }, [])

  return isMobile
}

export function DataTable<TData extends {
  current_stock: number
  unit: string
  price_buy: number
  price_sell: number
}, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobile()
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: isMobile
        ? {
            name: true,
            brand: true,
            current_stock: false,
            unit: false,
            price_buy: false,
            price_sell: false,
            id: false,
          }
        : {},
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="rounded-md border">
      <div className="overflow-hidden border-b sm:max-w-full max-w-[360px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* MAIN ROW */}
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <div className="flex flex-col">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}

                          {/* Expand toggle ONLY on name column */}
                          {isMobile && cell.column.id === "name" && (
                            <button
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === row.id ? null : row.id
                                )
                              }
                              className="text-xs text-muted-foreground mt-1 text-start"
                            >
                              {expandedRow === row.id
                                ? "Hide details"
                                : "View details"}
                            </button>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* EXPANDED DETAILS (MOBILE ONLY) */}
                  {isMobile && expandedRow === row.id && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="grid grid-cols-2 gap-3 text-sm bg-zinc-50 p-3 rounded-md">
                          <div>
                            <span className="text-muted-foreground">Stock</span>
                            <div>{row.original.current_stock}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Unit</span>
                            <div>{row.original.unit}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Buy</span>
                            <div>₱{row.original.price_buy}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sell</span>
                            <div>₱{row.original.price_sell}</div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-2 px-4 bg-zinc-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
