"use client"

// /app/create-order/order-builder.tsx

import { useState, useEffect } from "react"
import { Item } from "../inventory/columns"
import { Search, X, Plus, Minus, ChevronDown, ChevronUp, ShoppingCart, Trash2 } from "lucide-react"

type OrderItem = Item & {
  quantity: number
}

export default function OrderBuilder({ items }: { items: Item[] }) {

  const [page, setPage] = useState(0)
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null)
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null)
  const [searchBarcode, setSearchBarcode] = useState("")
  const [searchName, setSearchName] = useState("")
  const [searchBrand, setSearchBrand] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState("")

  const PAGE_SIZE = 5

  const uniqueBrands = Array.from(
    new Set(items.map(item => item.brand).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  const filteredItems = items.filter(item => {
    const matchesBarcode = !searchBarcode ||
      (item.barcode && item.barcode.toLowerCase().includes(searchBarcode.toLowerCase()))
    const matchesName = !searchName ||
      item.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesBrand = !searchBrand ||
      (item.brand && item.brand.toLowerCase() === searchBrand.toLowerCase())
    return matchesBarcode && matchesName && matchesBrand
  })

  const pageCount = Math.ceil(filteredItems.length / PAGE_SIZE)
  const paginatedItems = filteredItems.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  useEffect(() => { setPage(0) }, [searchBarcode, searchName, searchBrand])

  function addItem(item: Item) {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + 1, item.current_stock) }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function updateQuantity(id: number, qty: number) {
    setOrderItems(prev =>
      prev.map(i => {
        if (i.id !== id) return i
        const clamped = Math.max(0, Math.min(qty, i.current_stock))
        return { ...i, quantity: clamped }
      })
    )
  }

  function removeItem(id: number) {
    setOrderItems(prev => prev.filter(i => i.id !== id))
  }

  async function submitOrder() {
    if (orderItems.length === 0) return
    const totalPrice = orderItems.reduce((sum, i) => sum + i.price_sell * i.quantity, 0)

    try {
      const { data: orderData, error: orderError } = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_price: totalPrice,
          customer_name: customerName,
          items: orderItems.map(i => ({
            item_id: i.id,
            quantity: i.quantity,
            price_at_time: i.price_sell,
          })),
        }),
      }).then(res => res.json())

      if (orderData?.error || orderError) { console.error(orderData?.error || orderError); return }

      setOrderItems([])
      setCustomerName("")
      alert("Order created successfully!")
    } catch (err) {
      console.error(err)
    }
  }

  const total = orderItems.reduce((sum, i) => sum + i.price_sell * i.quantity, 0)
  const hasFilters = searchBarcode || searchName || searchBrand

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .ob-wrap  { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fn-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }

        /* ── INPUTS ── */
        .fn-input {
          background: #0d1730;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .fn-input::placeholder { color: rgba(255,255,255,0.25); }
        .fn-input:focus {
          border-color: #e8001d;
          box-shadow: 0 0 0 2px rgba(232,0,29,0.15);
        }
        .fn-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.65rem center;
          padding-right: 2rem;
          cursor: pointer;
        }
        .fn-select option { background: #0d1730; color: rgba(255,255,255,0.8); }

        /* ── PRODUCT CARD ── */
        .prod-card {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 0.875rem 1rem;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
          border-left: 2px solid transparent;
        }
        .prod-card:hover {
          background: rgba(232,0,29,0.04);
          border-left-color: rgba(232,0,29,0.4);
        }
        .prod-card.expanded {
          border-left-color: #e8001d;
          background: rgba(232,0,29,0.06);
        }

        /* ── ADD BUTTON ── */
        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #e8001d;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-add:hover  { background: #c8001a; }
        .btn-add:disabled {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.2);
          cursor: not-allowed;
        }

        /* ── GHOST / OUTLINE BUTTONS ── */
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.2);
        }
        .btn-ghost:disabled { opacity: 0.25; cursor: not-allowed; }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          width: 26px; height: 26px;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.12s ease;
          flex-shrink: 0;
        }
        .btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .btn-icon.danger:hover { background: rgba(232,0,29,0.15); color: #ff3d50; border-color: rgba(232,0,29,0.3); }

        /* ── ORDER SUMMARY PANEL ── */
        .summary-panel {
          background: #0a1020;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .order-line {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 0.65rem 0.75rem;
          transition: border-color 0.12s ease;
        }
        .order-line:hover { border-color: rgba(255,255,255,0.14); }

        /* ── QTY STEPPER ── */
        .qty-stepper {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #080e1f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 0.15rem 0.3rem;
        }
        .qty-step-btn {
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          border-radius: 3px;
          border: none;
          background: transparent;
          transition: color 0.12s ease, background 0.12s ease;
        }
        .qty-step-btn:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .qty-step-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .qty-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem;
          color: #fff;
          min-width: 1.5rem;
          text-align: center;
          letter-spacing: 0.05em;
        }

        /* ── SUBMIT ── */
        .btn-submit {
          width: 100%;
          padding: 0.75rem;
          background: #e8001d;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .btn-submit:hover:not(:disabled) { background: #c8001a; transform: translateY(-1px); }
        .btn-submit:disabled { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.2); cursor: not-allowed; }

        /* ── CLEAR FILTERS TAG ── */
        .clear-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 0.25rem 0.65rem;
          cursor: pointer;
          transition: all 0.12s ease;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .clear-tag:hover { color: #ff3d50; border-color: rgba(232,0,29,0.3); background: rgba(232,0,29,0.06); }

        .section-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 0.6rem;
        }
      `}</style>

      <div className="ob-wrap" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
          className="lg:grid-cols-[1fr_320px]">

          {/* ══ LEFT: PRODUCTS ══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
              <div style={{ width: "3px", height: "18px", background: "#e8001d", borderRadius: "2px", flexShrink: 0 }} />
              <h2 className="fn-display" style={{ fontSize: "1.5rem", color: "#fff", lineHeight: 1 }}>Products</h2>
              <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {filteredItems.length} results
              </span>
            </div>

            {/* Filters */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}
              className="grid-cols-1 sm:grid-cols-3">
              <select
                className="fn-input fn-select"
                value={searchBrand}
                onChange={e => setSearchBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <input
                className="fn-input"
                placeholder="Search by name..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
              <input
                className="fn-input"
                placeholder="Barcode..."
                value={searchBarcode}
                onChange={e => setSearchBarcode(e.target.value)}
              />
            </div>

            {hasFilters && (
              <div>
                <button className="clear-tag" onClick={() => { setSearchBarcode(""); setSearchName(""); setSearchBrand("") }}>
                  <X size={10} /> Clear filters
                </button>
              </div>
            )}

            {/* Product list */}
            {paginatedItems.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", padding: "1rem 0" }}>No products found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {paginatedItems.map(item => {
                  const isOpen = expandedProductId === item.id
                  const inOrder = orderItems.find(i => i.id === item.id)

                  return (
                    <div
                      key={item.id}
                      className={`prod-card ${isOpen ? "expanded" : ""}`}
                      onClick={() => setExpandedProductId(isOpen ? null : item.id)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {item.barcode && (
                            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", marginBottom: "0.15rem" }}>
                              {item.barcode}
                            </p>
                          )}
                          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.3 }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem" }}>
                            {item.brand && <span style={{ marginRight: "0.5rem" }}>{item.brand}</span>}
                            <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>₱{item.price_sell}</span>
                            <span style={{ margin: "0 0.25rem" }}>·</span>
                            <span>{item.unit}</span>
                            {item.current_stock < 10 && item.current_stock > 0 && (
                              <span style={{ marginLeft: "0.5rem", color: "#ff3d50", fontWeight: 700 }}>
                                ⚠ {item.current_stock} left
                              </span>
                            )}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                          {inOrder && (
                            <span style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 700, letterSpacing: "0.05em" }}>
                              ×{inOrder.quantity}
                            </span>
                          )}
                          <button
                            className="btn-add"
                            onClick={e => { e.stopPropagation(); addItem(item) }}
                            disabled={item.current_stock === 0}
                          >
                            <Plus size={11} /> Add
                          </button>
                          {isOpen
                            ? <ChevronUp size={14} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                            : <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                          }
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{
                          marginTop: "0.75rem",
                          paddingTop: "0.75rem",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "0.5rem"
                        }}>
                          {[
                            ["Stock", item.current_stock],
                            ["Unit", item.unit],
                            ["Price", `₱${item.price_sell}`],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.2rem" }}>{label}</p>
                              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{val}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem" }}>
                <button className="btn-ghost" onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>
                  Previous
                </button>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.05em" }}>
                  {page + 1} / {pageCount}
                </span>
                <button className="btn-ghost" onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))} disabled={page === pageCount - 1}>
                  Next
                </button>
              </div>
            )}
          </div>

          {/* ══ RIGHT: ORDER SUMMARY ══ */}
          <div className="summary-panel" style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <ShoppingCart size={14} style={{ color: "#e8001d" }} />
              <h2 className="fn-display" style={{ fontSize: "1.4rem", color: "#fff", lineHeight: 1 }}>Order Summary</h2>
              {orderItems.length > 0 && (
                <span style={{
                  marginLeft: "auto", background: "#e8001d", color: "#fff",
                  fontSize: "0.65rem", fontWeight: 700, borderRadius: "20px",
                  padding: "0.15rem 0.5rem", letterSpacing: "0.05em"
                }}>
                  {orderItems.length}
                </span>
              )}
            </div>

            {/* Customer */}
            <div style={{ marginBottom: "1rem" }}>
              <p className="section-label">Customer Name</p>
              <input
                className="fn-input"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Optional"
              />
            </div>

            {/* Items */}
            {orderItems.length === 0 ? (
              <div style={{
                padding: "1.5rem 0",
                textAlign: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.8rem",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "1rem"
              }}>
                No items added yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" }}>
                {orderItems.map(item => {
                  const isOpen = expandedItemId === item.id
                  return (
                    <div key={item.id} className="order-line">
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                        onClick={() => setExpandedItemId(isOpen ? null : item.id)}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.1rem" }}>
                            ₱{(item.price_sell * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Qty stepper */}
                        <div className="qty-stepper" onClick={e => e.stopPropagation()}>
                          <button
                            className="qty-step-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={10} />
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            className="qty-step-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.current_stock}
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <button className="btn-icon danger" onClick={e => { e.stopPropagation(); removeItem(item.id) }}>
                          <Trash2 size={11} />
                        </button>
                      </div>

                      {isOpen && (
                        <div style={{
                          marginTop: "0.6rem",
                          paddingTop: "0.6rem",
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.4)"
                        }}>
                          ₱{item.price_sell} × {item.quantity} = <span style={{ color: "#34d399", fontWeight: 700 }}>₱{(item.price_sell * item.quantity).toFixed(2)}</span>
                          <span style={{ marginLeft: "0.5rem", color: "rgba(255,255,255,0.2)" }}>
                            (max {item.current_stock})
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Total */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "0.875rem", marginBottom: "1rem"
            }}>
              <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>
                Total
              </span>
              <span className="fn-display" style={{ fontSize: "1.75rem", color: "#fff", lineHeight: 1 }}>
                ₱{total.toFixed(2)}
              </span>
            </div>

            <button className="btn-submit" onClick={submitOrder} disabled={orderItems.length === 0}>
              Submit Order
            </button>
          </div>

        </div>
      </div>
    </>
  )
}