"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  History,
  Settings,
  LogOut,
} from "lucide-react"

export default function NavPanel() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <>
      <aside className="hidden md:flex bg-blue-900/50 w-44 flex-col justify-between py-6">
        <div className="space-y-20">
          <div>
            <img
              src="/fnv.png"
              alt="Product image"
              className="w-30 object-cover justify-self-center"
            />
            <h1 className="text-white font-semibold text-center text-sm">
              Inventory Management System
            </h1>
          </div>
          <NavItem href="/dashboard" label="Dashboard" icon={LayoutDashboard} active={isActive("/dashboard")}/>
          <NavItem href="/inventory" label="Inventory" icon={Package} active={isActive("/inventory")} />
          <NavItem href="/create-order" label="Create Order" icon={ShoppingCart} active={isActive("/create-order")} />
          <NavItem href="/orders" label="Orders" icon={ClipboardList} active={isActive("/orders")} />
          <NavItem href="/order-history" label="History" icon={History} active={isActive("/order-history")}/>
        </div>

        <div className="space-y-2">
          <NavItem href="/settings" label="Settings" icon={Settings} active={isActive("/settings")} />
          <NavItem href="/" label="Logout" icon={LogOut} />
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-blue-900 border-t border-indigo-800">
        <div className="flex justify-around">
          <NavIcon href="/dashboard" icon={LayoutDashboard} active={isActive("/dashboard")} />
          <NavIcon href="/inventory" icon={Package} active={isActive("/inventory")} />
          <NavIcon href="/create-order" icon={ShoppingCart} active={isActive("/create-order")} />
          <NavIcon href="/orders" icon={ClipboardList} active={isActive("/orders")} />
          <NavIcon href="/order-history" icon={History} active={isActive("/order-history")} />
          <NavIcon href="/settings" icon={Settings} active={isActive("/settings")}/>
          <NavIcon href="/" icon={LogOut} />
        </div>
      </nav>
    </>
  )
}

/* ---------------- DESKTOP ITEM ---------------- */

function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
}: {
  href: string
  label: string
  icon: any
  active?: boolean
}) {
  return (
    <Link href={href}>
      <Button
        variant={active ? "default" : "outline"}
        className="w-full justify-start gap-3 rounded-none"
      >
        <Icon size={18} />
        {label}
      </Button>
    </Link>
  )
}

/* ---------------- MOBILE ICON ---------------- */

function NavIcon({
  href,
  icon: Icon,
  active = false,
}: {
  href: string
  icon: any
  active?: boolean
}) {
  return (
    <Link href={href} className="flex-1">
      <Button
        variant="ghost"
        className={`w-full py-4 ${
          active ? "text-white" : "text-indigo-300"
        }`}
      >
        <Icon size={22} />
      </Button>
    </Link>
  )
}
