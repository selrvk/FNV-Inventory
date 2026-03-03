// /app/dashboard/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();

  const { data: items, error } = await supabase
    .from("items")
    .select("name, price_sell, price_buy, current_stock");

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const pesoFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  const totalProducts = items?.length ?? 0;

  const totalStock =
    items?.reduce((sum, item) => sum + (item.current_stock ?? 0), 0) ?? 0;

  const totalSellValue =
    items?.reduce((total, item) => {
      return total + (item.price_sell ?? 0) * (item.current_stock ?? 0);
    }, 0) ?? 0;

  const totalBuyValue =
    items?.reduce((total, item) => {
      return total + (item.price_buy ?? 0) * (item.current_stock ?? 0);
    }, 0) ?? 0;

  const projectedProfit = totalSellValue - totalBuyValue;

  const lowestStockItems =
    items
      ?.filter(item => (item.current_stock ?? 0) > 0)
      .sort((a, b) => (a.current_stock ?? 0) - (b.current_stock ?? 0))
      .slice(0, 5) ?? [];

  const avgProfitPerItem = totalProducts > 0 ? projectedProfit / totalProducts : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .fn-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #080e1f;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          min-height: 100vh;
          color: #e8ecf5;
        }

        .fn-display {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
        }

        .stat-card {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 3px solid transparent;
          transition: border-top-color 0.2s ease, transform 0.2s ease;
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        .stat-card.red   { border-top-color: #e8001d; }
        .stat-card.navy  { border-top-color: #2a5bd7; }
        .stat-card.gold  { border-top-color: #f5a623; }
        .stat-card.slate { border-top-color: #64748b; }

        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.10s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.20s; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .panel {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both;
        }

        .stock-row {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s ease;
        }
        .stock-row:hover {
          background: rgba(232,0,29,0.06);
        }
        .stock-row:last-child {
          border-bottom: none;
        }

        .badge-critical {
          background: rgba(232,0,29,0.15);
          color: #ff3d50;
          border: 1px solid rgba(232,0,29,0.3);
        }
        .badge-low {
          background: rgba(245,166,35,0.12);
          color: #f5a623;
          border: 1px solid rgba(245,166,35,0.25);
        }
        .badge-ok {
          background: rgba(52,211,153,0.1);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.2);
        }

        .divider-line {
          width: 40px;
          height: 3px;
          background: #e8001d;
          margin-bottom: 1rem;
        }

        .quick-stat-row {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 0.75rem 0;
        }
        .quick-stat-row:last-child {
          border-bottom: none;
        }
      `}</style>

      <div className="fn-page p-6 md:p-10 space-y-8">

        {/* ── HEADER ── */}
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-500 mb-1 font-semibold">
              Inventory System
            </p>
            <h1 className="fn-display text-6xl md:text-7xl text-white leading-none">
              Dashboard
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-white/30 uppercase tracking-widest">Overview</p>
            <p className="text-sm text-white/50 mt-0.5">
              {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card red rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Sell Value</p>
            <p className="fn-display text-3xl text-white leading-none">
              {pesoFormatter.format(totalSellValue)}
            </p>
            <p className="text-xs text-white/30 mt-2">Total inventory at sell price</p>
          </div>

          <div className="stat-card navy rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Cost Value</p>
            <p className="fn-display text-3xl text-white leading-none">
              {pesoFormatter.format(totalBuyValue)}
            </p>
            <p className="text-xs text-white/30 mt-2">Total inventory at cost</p>
          </div>

          <div className="stat-card gold rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Proj. Profit</p>
            <p className="fn-display text-3xl text-white leading-none">
              {pesoFormatter.format(projectedProfit)}
            </p>
            <p className="text-xs text-white/30 mt-2">If all stock is sold</p>
          </div>

          <div className="stat-card slate rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Stock Units</p>
            <p className="fn-display text-3xl text-white leading-none">
              {totalStock.toLocaleString()}
            </p>
            <p className="text-xs text-white/30 mt-2">Across all products</p>
          </div>
        </div>

        {/* ── LOWER SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Low Stock Table */}
          <div className="panel rounded-xl p-6 lg:col-span-2">
            <div className="divider-line" />
            <h2 className="fn-display text-2xl text-white mb-5 leading-none">
              Lowest Stock Items
            </h2>

            {lowestStockItems.length === 0 ? (
              <p className="text-white/30 text-sm">No items found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-3 text-xs uppercase tracking-widest text-white/30 font-semibold">
                      Product
                    </th>
                    <th className="text-right pb-3 text-xs uppercase tracking-widest text-white/30 font-semibold">
                      Stock
                    </th>
                    <th className="text-right pb-3 text-xs uppercase tracking-widest text-white/30 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lowestStockItems.map(item => {
                    const stock = item.current_stock ?? 0;
                    const isCritical = stock <= 3;
                    const isLow = stock <= 9 && !isCritical;
                    return (
                      <tr key={item.name} className="stock-row">
                        <td className="py-3 text-white/80 font-medium">{item.name}</td>
                        <td className="py-3 text-right font-bold tabular-nums text-white">
                          {stock}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            isCritical ? "badge-critical" : isLow ? "badge-low" : "badge-ok"
                          }`}>
                            {isCritical ? "!" : isLow ? "Low" : "OK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Quick Stats */}
          <div className="panel rounded-xl p-6">
            <div className="divider-line" />
            <h2 className="fn-display text-2xl text-white mb-5 leading-none">
              Quick Stats
            </h2>

            <div>
              <div className="quick-stat-row flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/40">Total Products</span>
                <span className="fn-display text-xl text-white">{totalProducts.toLocaleString()}</span>
              </div>
              <div className="quick-stat-row flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/40">Total Units</span>
                <span className="fn-display text-xl text-white">{totalStock.toLocaleString()}</span>
              </div>
              <div className="quick-stat-row flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/40">Avg Profit / Item</span>
                <span className="fn-display text-xl text-white">
                  {pesoFormatter.format(avgProfitPerItem)}
                </span>
              </div>
              <div className="quick-stat-row flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/40">Margin</span>
                <span className="fn-display text-xl text-white">
                  {totalSellValue > 0
                    ? ((projectedProfit / totalSellValue) * 100).toFixed(1) + "%"
                    : "—"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}