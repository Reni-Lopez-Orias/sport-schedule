interface NoGamesProps {
  leagueName: string;
}
export default function NoGames({ leagueName }: NoGamesProps) {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500max-w-6xl mx-auto p-3">
      <span className="text-lg font-semibold">
        No games scheduled for <span className="font-bold">{leagueName}</span>
      </span>
      <p className="text-sm opacity-70">Try another date or league.</p>
    </div>
  );
}
