"use client"

import { useState } from "react"
import { updateProduct } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item } from "./columns"

export function UpdateProductModal({ item }: { item: Item }) {

  const [open, setOpen] = useState(false)

  const id = item.id
  const name = item.name
  const brand = item.brand
  const current_stock = item.current_stock
  const price_buy = item.price_buy
  const price_sell = item.price_sell

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="ghost" className="font-normal p-2">
        Update Product
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-4">
              Update Product
            </h2>

            <form
              action={async (formData) => {
                await updateProduct(formData)
                setOpen(false)
              }}
              className="space-y-3"
            >
                <input type="hidden" name="id" value={id} />
                <Input name="name" defaultValue={name} required />
                <Input name="brand" defaultValue={brand} />
                <Input name="current_stock" type="number" defaultValue={current_stock} required />
                <Input name="price_buy" type="number" defaultValue={price_buy} required />
                <Input name="price_sell" type="number" defaultValue={price_sell} required />

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        Save
                    </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  )
}
