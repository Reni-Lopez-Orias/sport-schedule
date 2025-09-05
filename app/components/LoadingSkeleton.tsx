export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 h-40 rounded-md border border-gray-300"
        />
      ))}
    </div>
  );
}

export function LeagueTabsSkeleton() {
  return (
    <div className="w-full flex flex-row gap-3 items-center overflow-x-auto overflow-y-hidden p-0 h-18 no-vertical-scroll">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center flex-shrink-0"
          style={{ minWidth: "56px" }}
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 animate-pulse overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
          </div>
          <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 animate-pulse" />
        </div>
      ))}
    </div>
  );
}