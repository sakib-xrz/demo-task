export function ProjectsDashboardSkeleton() {
  return (
    <div
      className="bg-white rounded-[20px] p-3 w-full max-w-200 animate-pulse"
      aria-hidden
    >
      <div className="px-4 pt-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-28 bg-gray-200 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-10.5 w-40 bg-gray-200 rounded-full" />
            <div className="h-10.5 w-10.5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 ml-5 mb-0">
        <div className="h-10 w-36 bg-gray-200 rounded-t-[20px]" />
        <div className="h-10 w-24 bg-gray-100 rounded-t-[20px]" />
      </div>

      <div className="border border-[#d9dfe9] rounded-[20px] rounded-tl-[10px] p-4">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#d9dfe9]">
          <div className="h-5 w-28 bg-gray-200 rounded" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 mb-6">
          <div className="flex-1 flex flex-col gap-3 pb-4 sm:pb-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-[#d9dfe9]">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-27.5 bg-gray-100 rounded-lg" />
          </div>

          <div className="flex-1 flex flex-col gap-3 py-4 sm:py-0 sm:px-4 border-b sm:border-b-0 sm:border-r border-[#d9dfe9]">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-35 bg-gray-100 rounded-lg" />
          </div>

          <div className="flex-1 flex flex-col gap-4 pt-4 sm:pt-0 sm:pl-4">
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
            <div className="border-t border-[#d9dfe9]" />
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#d9dfe9]">
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2 px-3 first:pl-0">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-7 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
