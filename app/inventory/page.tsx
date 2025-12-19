// /app/inventory/page.tsx
import { Button } from "@/components/ui/button";
import { columns, Item } from "./columns"
import { DataTable } from "./products-table"
import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AddProductModal } from "./add-product-modal"


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

      <div className="justify-between flex items-center">

        <h1>
          Products
        </h1>

        <div className="flex container mt-10 mx-auto justify-end">
          <div className="my-4">
            <AddProductModal />
          </div>

          <Button className="my-4 ml-2">
            Create Order
          </Button>
        </div>
      
      </div>

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data as Item[]} />
      </div>

    </div>

  );
}
