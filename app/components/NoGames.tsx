export default function NoGames() {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500 dark:text-gray-400">
      <p className="text-lg font-semibold">
        No games scheduled for this day.
      </p>
      <p className="text-sm opacity-70">
        Try another date or league.
      </p>
    </div>
  );
}