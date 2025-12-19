"use client"

import { useState } from "react"
import { addProduct } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AddProductModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Add Product
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-4">
              Add Product
            </h2>

            <form
              action={async (formData) => {
                await addProduct(formData)
                setOpen(false)
              }}
              className="space-y-3"
            >
              <Input name="name" placeholder="Product name" required />
              <Input name="brand" placeholder="Brand" />
              <Input
                name="current_stock"
                type="number"
                placeholder="Initial stock"
                required
              />
              <Input
                name="price_buy"
                type="number"
                placeholder="Buy price"
                required
              />
              <Input
                name="price_sell"
                type="number"
                placeholder="Sell price"
                required
              />

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
