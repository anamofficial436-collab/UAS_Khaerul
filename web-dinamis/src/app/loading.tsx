export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary-200" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-700 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-gray-500">Memuat halaman...</p>
      </div>
    </div>
  );
}
