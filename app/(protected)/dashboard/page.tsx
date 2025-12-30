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

  return (
    
    <div className="p-6 space-y-8 bg-gray-50  ">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          Dashboard
        </h1>
        <p className="font-bold mt-10 text-gray-500">
          Inventory overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <DashboardCard
          label="Inventory Sell Value"
          value={pesoFormatter.format(totalSellValue)}
          accent="text-green-600"
        />

        <DashboardCard
          label="Inventory Cost Value"
          value={pesoFormatter.format(totalBuyValue)}
          accent="text-orange-600"
        />

        <DashboardCard
          label="Projected Profit"
          value={pesoFormatter.format(projectedProfit)}
          accent="text-blue-700"
        />

        <DashboardCard
          label="Total Stock Units"
          value={totalStock.toLocaleString()}
          accent="text-purple-700"
        />
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Low Stock Table */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Lowest Stock Items
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowestStockItems.map(item => (
                  <tr key={item.name} className="border-b last:border-none">
                    <td className="py-2 text-gray-700">
                      {item.name}
                    </td>
                    <td className="py-2 text-right font-semibold text-red-600">
                      {item.current_stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lowestStockItems.length === 0 && (
              <p className="text-gray-400 text-sm mt-4">
                No low-stock items found.
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Stats
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Products</span>
              <span className="font-semibold">
                {totalProducts.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Total Stock Units</span>
              <span className="font-semibold">
                {totalStock.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Avg. Profit / Item</span>
              <span className="font-semibold">
                {pesoFormatter.format(
                  totalProducts > 0 ? projectedProfit / totalProducts : 0
                )}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------- Reusable Card ---------- */
function DashboardCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-2 ${accent}`}>
        {value}
      </p>
    </div>
  );
}
