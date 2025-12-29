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

    <div className="">

      <h1 className="text-blue-900 text-3xl font-bold">
        INVENTORY
      </h1>

      <div className="flex items-center">

        <div className="flex container mt-10 mx-auto justify-end">
          <div className="my-4">
            <AddProductModal />
          </div>

          <Link href="/create-order">
            <Button className="my-4 ml-2">
              Create Order
            </Button>
          </Link>

        </div>
      
      </div>

      <div className="container mx-auto py-10">
        <h1 className="text-2xl">
          Products
        </h1>

        <div className="mt-10">
          <DataTable columns={columns} data={data as Item[]} />
        </div>
      </div>

    </div>

  );
}
