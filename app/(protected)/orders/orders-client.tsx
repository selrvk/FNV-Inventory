"use client";

import { useState } from "react";
import { CheckCheck, X, Clock, User, Receipt } from "lucide-react";

type Order = {
  id: number;
  customer_name?: string;
  status: string;
  total_price: number;
  date_created: string;
};

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [localOrders, setLocalOrders] = useState(
    orders.filter(order => order.status === "PENDING")
  );
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const confirmOrder = async (order_id: number) => {
    setLoadingId(order_id);
    const confirmed = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id }),
    }).then(res => res.json());

    setLoadingId(null);
    if (confirmed.success) {
      setLocalOrders(prev => prev.filter(o => o.id !== order_id));
    } else {
      alert("Error confirming order: " + confirmed.error);
    }
  };

  const cancelOrder = async (order_id: number) => {
    setLoadingId(order_id);
    const cancelled = await fetch("/api/cancel-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id }),
    }).then(res => res.json());

    setLoadingId(null);
    if (cancelled.success) {
      setLocalOrders(prev => prev.filter(o => o.id !== order_id));
    } else {
      alert("Error cancelling order: " + cancelled.error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .fn-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .oc-wrap    { font-family: 'Plus Jakarta Sans', sans-serif; }

        .order-card {
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid rgba(245,166,35,0.6);
          border-radius: 10px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: border-left-color 0.15s ease, background 0.15s ease;
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .order-card:hover {
          background: rgba(245,166,35,0.03);
          border-left-color: #f5a623;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .order-id {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #fff;
          letter-spacing: 0.05em;
          line-height: 1;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          background: rgba(245,166,35,0.12);
          color: #f5a623;
          border: 1px solid rgba(245,166,35,0.25);
        }

        .btn-confirm {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(52,211,153,0.1);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.25);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .btn-confirm:hover:not(:disabled) {
          background: rgba(52,211,153,0.2);
          border-color: rgba(52,211,153,0.5);
        }

        .btn-cancel {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(232,0,29,0.08);
          color: #ff3d50;
          border: 1px solid rgba(232,0,29,0.2);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .btn-cancel:hover:not(:disabled) {
          background: rgba(232,0,29,0.15);
          border-color: rgba(232,0,29,0.4);
        }

        .btn-confirm:disabled,
        .btn-cancel:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: rgba(255,255,255,0.2);
          text-align: center;
          background: #0d1730;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }
      `}</style>

      <div className="oc-wrap" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {localOrders.length === 0 ? (
          <div className="empty-state">
            <CheckCheck size={32} style={{ marginBottom: "0.75rem", color: "#34d399", opacity: 0.5 }} />
            <p className="fn-display" style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.25rem" }}>
              All Clear
            </p>
            <p style={{ fontSize: "0.78rem" }}>No pending orders right now.</p>
          </div>
        ) : (
          localOrders.map((order, i) => (
            <div
              key={order.id}
              className="order-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Order # */}
              <div style={{ minWidth: "3.5rem" }}>
                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.15rem" }}>
                  Order
                </p>
                <p className="order-id">#{order.id}</p>
              </div>

              {/* Divider */}
              <div style={{ width: "1px", height: "2.5rem", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                    <User size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
                    {order.customer_name || "No name"}
                  </span>
                  <span className="status-pill">
                    <Clock size={9} /> {order.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                    <Receipt size={10} />
                    {new Date(order.date_created).toLocaleString("en-PH", {
                      month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", marginBottom: "0.15rem" }}>
                  Total
                </p>
                <p className="fn-display" style={{ fontSize: "1.3rem", color: "#fff", lineHeight: 1 }}>
                  ₱{order.total_price.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                <button
                  className="btn-confirm"
                  onClick={() => confirmOrder(order.id)}
                  disabled={loadingId === order.id}
                >
                  <CheckCheck size={12} />
                  Confirm
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => cancelOrder(order.id)}
                  disabled={loadingId === order.id}
                >
                  <X size={12} />
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}