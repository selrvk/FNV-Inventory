// app/inventory/products-table.tsx
"use client"

import * as React from "react"
import {
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
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
  barcode: string | null
  current_stock: number
  unit: string
  price_buy: number
  price_sell: number
}, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) { 

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  })
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [mounted, setMounted] = React.useState(false)
  const isMobile = useIsMobile()
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "brand", desc: false },
    { id: "id", desc: false },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination,
      columnVisibility: isMobile
        ? {
            barcode: false,
            name: true,
            brand: true,
            current_stock: false,
            unit: false,
            price_buy: false,
            price_sell: false,
            total_value: false,
            id: false,
          }
        : {},
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiSort: true,
    autoResetAll: false,
  })

  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1

  return (
    <>
      {!mounted ? null : (
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200">

          {/* FILTER BAR */}
          <div className="bg-slate-800 px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search products..."
                className="bg-slate-700 text-slate-100 placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              <select
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(e) => {
                  table.getColumn("name")?.setFilterValue(e.target.value || undefined)
                  table.setPageIndex(0)
                }}
                className="bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              >
                <option value="">All Product Names</option>
                {Array.from(new Set(data.map((row: any) => row.name).filter(Boolean))).map(
                  (name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  )
                )}
              </select>
              <select
                value={(table.getColumn("brand")?.getFilterValue() as string) ?? ""}
                onChange={(e) => {
                  table.getColumn("brand")?.setFilterValue(e.target.value || undefined)
                  table.setPageIndex(0)
                }}
                className="bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              >
                <option value="">All Brands</option>
                {Array.from(new Set(data.map((row: any) => row.brand).filter(Boolean))).map(
                  (brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-xs font-semibold uppercase tracking-widest text-slate-400 py-3"
                      >
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
                      <TableRow className="border-b border-slate-100 hover:bg-emerald-50 hover:border-l-2 hover:border-l-emerald-400 transition-all duration-150">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3">
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
                                  className="text-xs text-emerald-600 font-medium mt-1 text-start"
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
                        <TableRow className="bg-slate-50">
                          <TableCell colSpan={row.getVisibleCells().length}>
                            <div className="grid grid-cols-2 gap-3 text-sm p-2">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Barcode</p>
                                <p className="text-slate-700">{row.original.barcode ?? "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Stock</p>
                                <p className="text-slate-700">{row.original.current_stock}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Unit</p>
                                <p className="text-slate-700">{row.original.unit}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Unit Price</p>
                                <p className="text-slate-700">₱{row.original.price_buy.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5">SRP</p>
                                <p className="text-slate-700">₱{row.original.price_sell.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Total Value</p>
                                <p className="text-emerald-600 font-semibold">₱{(row.original.current_stock * row.original.price_sell).toFixed(2)}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-slate-400 text-sm">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800">
            <span className="text-xs text-slate-400">
              Page <span className="text-slate-200 font-medium">{currentPage}</span> of{" "}
              <span className="text-slate-200 font-medium">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>

        </div>
      )}
    </>
  )
}