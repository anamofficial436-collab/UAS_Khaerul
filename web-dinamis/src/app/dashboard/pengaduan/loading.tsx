export default function PengaduanLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-gray-200 rounded-lg" />
          <div className="h-4 w-36 bg-gray-100 rounded" />
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-7 w-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="card overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 flex gap-6">
          {["w-8", "w-20", "w-40", "w-20", "w-16", "w-28", "w-16"].map(
            (w, i) => (
              <div key={i} className={`h-3 ${w} bg-gray-200 rounded`} />
            )
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-5">
              <div className="h-4 w-8 bg-gray-100 rounded font-mono" />
              <div className="space-y-1.5 flex-none w-28">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-4 flex-1 bg-gray-100 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded-full" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="flex gap-1">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="w-7 h-7 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
