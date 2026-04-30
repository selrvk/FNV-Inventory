"use client"

import { useState } from "react"
import { updateProduct } from "./actions"
import { Item } from "./columns"
import { Pencil, X } from "lucide-react"

export function UpdateProductModal({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 50;
          backdrop-filter: blur(2px);
        }
        .modal-panel {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 1.75rem;
          width: 100%;
          max-width: 420px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.75rem;
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .modal-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.35rem;
        }
        .modal-input {
          width: 100%;
          background: #080e1f;
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          padding: 0.55rem 0.75rem;
          font-size: 0.82rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .modal-input::placeholder { color: rgba(255,255,255,0.2); }
        .modal-input:focus {
          border-color: #e8001d;
          box-shadow: 0 0 0 2px rgba(232,0,29,0.15);
        }
        .modal-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          padding-right: 2rem;
          cursor: pointer;
        }
        .modal-select option { background: #0d1730; color: rgba(255,255,255,0.8); }
        .modal-field { margin-bottom: 0.9rem; }
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .modal-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1rem 0; }
        .modal-btn-primary {
          display: inline-flex; align-items: center; gap: 0.35rem;
          background: #e8001d; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem; font-weight: 700;
          padding: 0.6rem 1.25rem; border-radius: 7px;
          border: none; cursor: pointer;
          transition: background 0.15s ease;
        }
        .modal-btn-primary:hover { background: #c8001a; }
        .modal-btn-ghost {
          display: inline-flex; align-items: center; gap: 0.35rem;
          background: transparent; color: rgba(255,255,255,0.4);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          padding: 0.6rem 1rem; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
          transition: all 0.15s ease;
        }
        .modal-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
        .update-trigger {
          display: flex; align-items: center; gap: 0.4rem;
          width: 100%; padding: 0.4rem 0.5rem;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.55);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem; font-weight: 500;
          border-radius: 5px;
          transition: color 0.12s ease, background 0.12s ease;
        }
        .update-trigger:hover { color: #fff; background: rgba(255,255,255,0.06); }
      `}</style>

      <button onClick={() => setOpen(true)} className="update-trigger">
        <Pencil size={12} /> Update Product
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 className="modal-title">Update Product</h2>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: "0.25rem" }}>
                <X size={18} />
              </button>
            </div>

            <form
              action={async (formData) => {
                await updateProduct(formData)
                setOpen(false)
              }}
            >
              <input type="hidden" name="id" value={item.id} />

              <div className="modal-field">
                <label className="modal-label">Product Name *</label>
                <input className="modal-input" name="name" defaultValue={item.name} required />
              </div>

              <div className="modal-grid">
                <div className="modal-field">
                  <label className="modal-label">Brand</label>
                  <input className="modal-input" name="brand" defaultValue={item.brand ?? ""} />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Barcode</label>
                  <input className="modal-input" name="barcode" defaultValue={item.barcode ?? ""} placeholder="Optional" />
                </div>
              </div>

              <div className="modal-grid">
                <div className="modal-field">
                  <label className="modal-label">Stock *</label>
                  <input className="modal-input" name="current_stock" type="number" min="0" defaultValue={item.current_stock} required />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Unit *</label>
                  <select className="modal-input modal-select" name="unit" defaultValue={item.unit ?? "pieces"}>
                    <option value="pieces">Pieces</option>
                    <option value="boxes">Boxes</option>
                    <option value="rolls">Rolls</option>
                    <option value="packs">Packs</option>
                    <option value="sets">Sets</option>
                  </select>
                </div>
              </div>

              <div className="modal-divider" />

              <div className="modal-grid">
                <div className="modal-field">
                  <label className="modal-label">Unit Price (Buy) *</label>
                  <input className="modal-input" name="price_buy" type="number" step="0.01" min="0" defaultValue={item.price_buy} required />
                </div>
                <div className="modal-field">
                  <label className="modal-label">SRP (Sell) *</label>
                  <input className="modal-input" name="price_sell" type="number" step="0.01" min="0" defaultValue={item.price_sell} required />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" className="modal-btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
