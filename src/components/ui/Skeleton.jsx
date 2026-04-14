export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-6 skeleton w-20" />
          <div className="h-8 skeleton w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container-app py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square skeleton rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 skeleton w-3/4" />
          <div className="h-4 skeleton w-1/2" />
          <div className="h-10 skeleton w-32 mt-4" />
          <div className="space-y-2 mt-6">
            <div className="h-3 skeleton w-full" />
            <div className="h-3 skeleton w-full" />
            <div className="h-3 skeleton w-3/4" />
          </div>
          <div className="flex gap-4 mt-6">
            <div className="h-12 skeleton w-40 rounded-xl" />
            <div className="h-12 skeleton w-40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="h-4 skeleton w-24 mb-3" />
            <div className="h-8 skeleton w-16" />
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <div className="h-6 skeleton w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 skeleton rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
