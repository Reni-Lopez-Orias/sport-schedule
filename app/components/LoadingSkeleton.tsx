export default function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 dark:bg-gray-700 h-40 rounded-md border border-gray-300 dark:border-gray-600"
        />
      ))}
    </div>
  );
}