"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Item } from "./columns"

export async function addProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const name = formData.get("name") as string
  const brand = formData.get("brand") as string
  const current_stock = Number(formData.get("current_stock"))
  const unit = formData.get("unit") as string
  const price_buy = Number(formData.get("price_buy"))
  const price_sell = Number(formData.get("price_sell"))

  const { error } = await supabase
    .from("items")
    .insert({
      name,
      brand,
      current_stock,
      unit,
      price_buy,
      price_sell,
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/inventory")
}

export async function deleteProduct(item: Item) {

    const id = Number(item.id)

    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/inventory")
}

export async function updateProduct(formData: FormData) {
    
    const supabase = await createSupabaseServerClient()
    const validUnits = ["pieces", "boxes", "rolls", "packs", "sets"]

    const id = Number(formData.get("id"))
    const name = formData.get("name") as string
    const brand = formData.get("brand") as string
    const current_stock = Number(formData.get("current_stock"))
    const unit = formData.get("unit") as string
    if (!validUnits.includes(unit)) {
      throw new Error("Invalid unit")
    }
    const price_buy = Number(formData.get("price_buy"))
    const price_sell = Number(formData.get("price_sell"))

    const { error } = await supabase
        .from("items")
        .update({
            name,
            brand,
            current_stock,
            unit,
            price_buy,
            price_sell,
        })
        .eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/inventory")
}