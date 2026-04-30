"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  History,
  Settings,
} from "lucide-react"
import LogoutButton from "./logout-button"

export default function NavPanel() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .nav-aside {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #0a1020;
          border-right: 1px solid rgba(255,255,255,0.06);
          width: 200px;
          flex-shrink: 0;
        }

        .nav-logo-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.4;
          padding: 0 1rem;
        }

        .nav-section-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 0 1.25rem;
          margin-bottom: 0.25rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 1.25rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.15s ease, background 0.15s ease;
          border-left: 2px solid transparent;
          position: relative;
        }

        .nav-item:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.04);
          border-left-color: rgba(232,0,29,0.4);
        }

        .nav-item.active {
          color: #ffffff;
          background: rgba(232,0,29,0.08);
          border-left-color: #e8001d;
        }

        .nav-item.active svg {
          color: #e8001d;
        }

        .nav-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 0.75rem 1.25rem;
        }

        .nav-item-logout:hover {
          color: #ff3d50;
          background: rgba(232,0,29,0.06);
          border-left-color: rgba(232,0,29,0.3);
        }

        /* ── MOBILE NAV ── */
        .mobile-nav {
          background: #0a1020;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .mobile-nav-item {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 0;
          color: rgba(255,255,255,0.3);
          transition: color 0.15s ease;
        }

        .mobile-nav-item.active {
          color: #e8001d;
        }

        .mobile-nav-item:hover {
          color: rgba(255,255,255,0.7);
        }
      `}</style>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="nav-aside hidden md:flex flex-col justify-between py-6 max-h-screen sticky top-0">

        {/* Top: logo + main nav */}
        <div>
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 px-4 mb-8">
            <img
              src="/fnv.png"
              alt="FNV logo"
              className="w-24 object-contain"
            />
            <p className="nav-logo-label text-amber-50">Inventory Management System</p>
          </div>

          {/* Red rule */}
          <div style={{ height: "2px", background: "#e8001d", margin: "0 1.25rem 1.25rem" }} />

          {/* Main links */}
          <p className="nav-section-label">Main</p>
          <nav className="flex flex-col">
            <NavItem href="/dashboard"    label="Dashboard"    icon={LayoutDashboard} active={isActive("/dashboard")} />
            <NavItem href="/inventory"    label="Inventory"    icon={Package}         active={isActive("/inventory")} />
            <NavItem href="/create-order" label="Create Order" icon={ShoppingCart}    active={isActive("/create-order")} />
            <NavItem href="/orders"       label="Orders"       icon={ClipboardList}   active={isActive("/orders")} />
            <NavItem href="/order-history"label="History"      icon={History}         active={isActive("/order-history")} />
          </nav>
        </div>

        {/* Bottom: settings + logout */}
        <div>
          <div className="nav-divider" />
          <nav className="flex flex-col">
            <NavItem href="/settings" label="Settings" icon={Settings} active={isActive("/settings")} />
            <LogoutButton />
          </nav>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM BAR ── */}
      <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 md:hidden flex">
        <MobileItem href="/dashboard"     icon={LayoutDashboard} active={isActive("/dashboard")} />
        <MobileItem href="/inventory"     icon={Package}         active={isActive("/inventory")} />
        <MobileItem href="/create-order"  icon={ShoppingCart}    active={isActive("/create-order")} />
        <MobileItem href="/orders"        icon={ClipboardList}   active={isActive("/orders")} />
        <MobileItem href="/order-history" icon={History}         active={isActive("/order-history")} />
        <MobileItem href="/settings"      icon={Settings}        active={isActive("/settings")} />
        <LogoutButton mobile />
      </nav>
    </>
  )
}

/* ── DESKTOP NAV ITEM ── */
function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
  logout = false,
}: {
  href: string
  label: string
  icon: any
  active?: boolean
  logout?: boolean
}) {
  return (
    <Link href={href} className={`nav-item ${active ? "active" : ""} ${logout ? "nav-item-logout" : ""}`}>
      <Icon size={15} strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  )
}

/* ── MOBILE NAV ICON ── */
function MobileItem({
  href,
  icon: Icon,
  active = false,
}: {
  href: string
  icon: any
  active?: boolean
}) {
  return (
    <Link href={href} className={`mobile-nav-item ${active ? "active" : ""}`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
    </Link>
  )
}

