// /app/inventory/page.tsx

import { Button } from "@/components/ui/button";
import { columns, Item } from "./columns"
import { DataTable } from "./products-table"
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AddProductModal } from "./add-product-modal"
import Link from "next/link";


export default async function Inventory() {

  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("items")
    .select("*")

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (

    <div className="mx-auto">

      <h1 className="text-blue-900 text-3xl font-bold">
        INVENTORY
      </h1>

      <div className="flex flex-col mx-auto py-10">

        <div className="flex flex-row mt-10 justify-between">
          <h1 className="text-2xl">
            Products
          </h1>

          <div className="flex justify-end gap-10">
            <div className="">
              <AddProductModal />
            </div>

            <Link href="/create-order">
              <Button className="">
                Create Order
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <DataTable columns={columns} data={data as Item[]} />
        </div>
      </div>

    </div>

  );
}
