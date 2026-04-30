// /app/inventory/page.tsx

import { columns, Item } from "./columns"
import { DataTable } from "./products-table"
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AddProductModal } from "./add-product-modal"
import { ExportInventoryButton } from "./export-button"
import Link from "next/link";
import { Package, Plus, ShoppingCart } from "lucide-react";

export default async function Inventory() {

  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("items")
    .select("*")

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  const totalProducts = data?.length ?? 0
  const totalStock = data?.reduce((sum, item) => sum + (item.current_stock ?? 0), 0) ?? 0
  const lowStockCount = data?.filter(item => (item.current_stock ?? 0) < 10 && (item.current_stock ?? 0) > 0).length ?? 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .inv-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #e8ecf5;
        }

        .fn-display {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
        }

        .inv-stat {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 2px solid rgba(255,255,255,0.08);
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .inv-stat:nth-child(1) { animation-delay: 0.05s; border-top-color: rgba(255,255,255,0.15); }
        .inv-stat:nth-child(2) { animation-delay: 0.10s; border-top-color: rgba(255,255,255,0.15); }
        .inv-stat:nth-child(3) { animation-delay: 0.15s; border-top-color: #e8001d; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .inv-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #e8001d;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
          text-decoration: none;
        }
        .inv-btn-primary:hover {
          background: #c8001a;
          transform: translateY(-1px);
        }

        .inv-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          text-decoration: none;
        }
        .inv-btn-secondary:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border-color: rgba(255,255,255,0.25);
        }

        /* ── TABLE OVERRIDES ── */
        .fn-table-wrap {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both;
        }

        .fn-table-wrap [data-slot="table"] {
          background: #0d1730;
        }

        .fn-table-wrap thead tr {
          background: #0a1020 !important;
          border-bottom: 1px solid rgba(255,255,255,0.07) !important;
        }
        .fn-table-wrap thead tr:hover {
          background: #0a1020 !important;
        }

        .fn-table-wrap th {
          color: rgba(255,255,255,0.3) !important;
        }

        .fn-table-wrap th button {
          color: rgba(255,255,255,0.3) !important;
        }
        .fn-table-wrap th button:hover {
          color: rgba(255,255,255,0.7) !important;
          background: transparent !important;
        }

        .fn-table-wrap tbody tr {
          background: #0d1730 !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          transition: background 0.12s ease !important;
        }
        .fn-table-wrap tbody tr:hover {
          background: rgba(232,0,29,0.05) !important;
          border-left: 2px solid #e8001d !important;
        }

        .fn-table-wrap td {
          color: rgba(255,255,255,0.75) !important;
        }

        /* Name column */
        .fn-table-wrap td div.whitespace-normal {
          color: rgba(255,255,255,0.9) !important;
          font-weight: 500;
        }

        /* Low stock badge */
        .fn-table-wrap .badge-low-stock {
          background: rgba(232,0,29,0.15) !important;
          color: #ff3d50 !important;
          border: 1px solid rgba(232,0,29,0.3) !important;
        }

        /* Unit chip */
        .fn-table-wrap .bg-slate-100 {
          background: rgba(255,255,255,0.08) !important;
          color: rgba(255,255,255,0.5) !important;
        }

        /* Total value */
        .fn-table-wrap .text-emerald-600 {
          color: #34d399 !important;
        }

        /* Filter bar */
        .fn-filter-bar {
          background: #0a1020;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 0.75rem 1rem;
        }

        .fn-filter-bar input,
        .fn-filter-bar select {
          background: #0d1730 !important;
          color: rgba(255,255,255,0.8) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 6px !important;
          font-size: 0.8rem !important;
          transition: border-color 0.15s ease !important;
        }
        .fn-filter-bar input::placeholder {
          color: rgba(255,255,255,0.25) !important;
        }
        .fn-filter-bar input:focus,
        .fn-filter-bar select:focus {
          outline: none !important;
          border-color: #e8001d !important;
          box-shadow: 0 0 0 2px rgba(232,0,29,0.15) !important;
        }
        .fn-filter-bar select option {
          background: #0d1730;
          color: rgba(255,255,255,0.8);
        }

        /* Pagination */
        .fn-pagination {
          background: #0a1020 !important;
          border-top: 1px solid rgba(255,255,255,0.07) !important;
        }
        .fn-pagination button {
          background: #0d1730 !important;
          color: rgba(255,255,255,0.6) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          font-size: 0.75rem !important;
        }
        .fn-pagination button:hover:not(:disabled) {
          background: rgba(232,0,29,0.1) !important;
          color: #fff !important;
          border-color: rgba(232,0,29,0.3) !important;
        }
        .fn-pagination button:disabled {
          opacity: 0.25 !important;
        }

        /* Mobile expand */
        .fn-table-wrap .text-emerald-600.font-medium {
          color: #e8001d !important;
        }

        /* Mobile expanded row */
        .fn-table-wrap .bg-slate-50 {
          background: #080e1f !important;
        }
        .fn-table-wrap .text-slate-400 {
          color: rgba(255,255,255,0.3) !important;
        }
        .fn-table-wrap .text-slate-700 {
          color: rgba(255,255,255,0.7) !important;
        }

        /* Actions button */
        .fn-table-wrap button.h-8 {
          color: rgba(255,255,255,0.3) !important;
        }
        .fn-table-wrap button.h-8:hover {
          color: rgba(255,255,255,0.8) !important;
          background: rgba(255,255,255,0.05) !important;
        }
      `}</style>

      <div className="inv-page">

        {/* ── HEADER ── */}
        <div className="flex items-end justify-between border-b pb-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1 font-semibold" style={{ color: "#e8001d" }}>
              Stock Management
            </p>
            <h1 className="fn-display text-6xl md:text-7xl text-white leading-none">
              Inventory
            </h1>
          </div>
        </div>

        {/* ── MINI STATS ── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="inv-stat rounded-xl px-5 py-4">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Products</p>
            <p className="fn-display text-3xl text-white">{totalProducts.toLocaleString()}</p>
          </div>
          <div className="inv-stat rounded-xl px-5 py-4">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Total Units</p>
            <p className="fn-display text-3xl text-white">{totalStock.toLocaleString()}</p>
          </div>
          <div className="inv-stat rounded-xl px-5 py-4">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Low Stock</p>
            <p className="fn-display text-3xl" style={{ color: lowStockCount > 0 ? "#ff3d50" : "#34d399" }}>
              {lowStockCount}
            </p>
          </div>
        </div>

        {/* ── TABLE SECTION ── */}
        <div>
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div style={{ width: "3px", height: "20px", background: "#e8001d", borderRadius: "2px" }} />
              <h2 className="fn-display text-2xl text-white leading-none">Products</h2>
            </div>
            <div className="flex items-center gap-2">
              <ExportInventoryButton data={data as Item[]} />
              <AddProductModal />
              <Link href="/create-order" className="inv-btn-secondary">
                <ShoppingCart size={13} />
                Create Order
              </Link>
            </div>
          </div>

          {/* Table with style overrides */}
          <div className="fn-table-wrap">
            <DataTable columns={columns} data={data as Item[]} />
          </div>
        </div>

      </div>
    </>
  );
}