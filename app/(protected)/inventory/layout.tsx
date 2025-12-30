import NavPanel from "@/components/nav-panel";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <NavPanel />

      <main className="flex-1 p-2">
        {children}
      </main>
    </div>
  );
}
