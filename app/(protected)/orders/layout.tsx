import NavPanel from "@/components/nav-panel";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "#080e1f",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    >
      <NavPanel />
      <main className="flex-1 p-8 pb-24 md:pb-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}