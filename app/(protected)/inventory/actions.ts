"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Item } from "./columns"

export async function addProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const rawBarcode = formData.get("barcode") as string
  const barcode = rawBarcode?.trim() || null
  const name = formData.get("name") as string
  const brand = formData.get("brand") as string
  const current_stock = Number(formData.get("current_stock"))
  const unit = formData.get("unit") as string
  const price_buy = Number(formData.get("price_buy"))
  const price_sell = Number(formData.get("price_sell"))

  const { error } = await supabase
    .from("items")
    .insert({
      barcode,
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

    const rawBarcode = formData.get("barcode") as string
    const barcode = rawBarcode?.trim() || null
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

    const { data: existing, error: checkError } = await supabase
    .from("items")
    .select("id")
    .eq("barcode", barcode)
    .neq("id", id)
    .maybeSingle()

  if (checkError) {
    throw new Error(checkError.message)
  }

  if (existing) {
    throw new Error("This barcode is already used by another product.")
  }

  const { error } = await supabase
    .from("items")
    .update({
      barcode,
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