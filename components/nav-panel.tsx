"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function NavPanel() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="bg-indigo-950 w-40 flex flex-col justify-between px-2 py-15">
      <div>
        <div id="general-access">
          <Link href="/dashboard">
            <Button
              className="mt-4 w-full rounded-0"
              variant={isActive("/dashboard") ? "default" : "outline"}
            >
              Dashboard
            </Button>
          </Link>

          <Link href="/inventory">
            <Button
              className="mt-4 w-full "
              variant={isActive("/inventory") ? "default" : "outline"}
            >
              Inventory
            </Button>
          </Link>

          <Link href="/create-order">
            <Button
              className="mt-4 w-full"
              variant={isActive("/create-order") ? "default" : "outline"}
            >
              Create Order
            </Button>
          </Link>

          <Link href="/orders">
            <Button
              className="mt-4 w-full"
              variant={isActive("/orders") ? "default" : "outline"}
            >
              Orders
            </Button>
          </Link>

          <Link href="/order-history">
            <Button
              className="mt-4 w-full"
              variant={isActive("/order-history") ? "default" : "outline"}
            >
              Order History
            </Button>
          </Link>
        </div>

        <div id="admin-only" className="mt-20">
          <Link href="/settings">
            <Button
              className="mt-10 w-full"
              variant={isActive("/settings") ? "default" : "outline"}
            >
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <Link href="/">
        <Button className="w-full" variant="outline">
          Logout
        </Button>
      </Link>
    </aside>
  );
}
