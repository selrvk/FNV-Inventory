export default function LoadingInventory() {
  return (
    <div className="p-6 animate-pulse">
      <h1 className="text-3xl font-bold mb-6 bg-gray-200 h-8 w-48 rounded" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}
