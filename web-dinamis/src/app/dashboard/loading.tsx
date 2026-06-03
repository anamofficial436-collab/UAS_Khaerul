export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-gray-200 rounded-lg" />
          <div className="h-4 w-52 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="card p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-52 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
        <div className="h-3 bg-gray-200 rounded-full" />
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 w-24 bg-gray-100 rounded" />
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="h-5 w-44 bg-gray-200 rounded" />
        </div>
        <div className="divide-y divide-gray-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="h-4 w-8 bg-gray-100 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-4 flex-1 bg-gray-100 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
