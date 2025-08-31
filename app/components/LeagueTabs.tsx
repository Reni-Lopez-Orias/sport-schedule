import { GamesData, LeagueLoading } from "../types/interfaces";

interface LeagueTabsProps {
  leagues: string[];
  activeLeague: string;
  games: GamesData;
  leagueLoading: LeagueLoading;
  onLeagueChange: (league: string) => void;
}

export default function LeagueTabs({
  leagues,
  activeLeague,
  games,
  leagueLoading,
  onLeagueChange,
}: LeagueTabsProps) {
  return (
    <div className="w-full sm:w-auto flex gap-2">
      {leagues.map((lg) => (
        <div
          key={lg}
          className="relative flex-1 flex flex-col items-center min-w-0"
        >
          <button
            onClick={() => onLeagueChange(lg)}
            className={`h-[44px] flex flex-col items-center justify-center w-full sm:w-24 py-2 rounded-lg border-2 transition-all duration-200 transform
              ${
                activeLeague === lg
                  ? "bg-gray-200  text-gray-900  border-gray-400 font-bold shadow-lg ring-2 ring-gray-300"
                  : "bg-white  text-gray-700  border-gray-300 opacity-90 hover:opacity-100 hover:border-gray-400"
              }`}
          >
            {lg}
            {leagueLoading[lg] && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4">
                <div
                  className={`w-3 h-3 border-2 rounded-full animate-spin ${
                    activeLeague === lg
                      ? "border-gray-400 border-t-gray-600"
                      : "border-gray-400 border-t-transparent"
                  }`}
                />
              </span>
            )}
          </button>

          <span
            className={`absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm transition-colors z-10
            ${
              activeLeague === lg
                ? "bg-gray-800 text-white  border-2 border-gray-700 shadow-md"
                : "bg-gray-300 text-gray-800 "
            }`}
          >
            {games[lg]?.length || 0}
          </span>
        </div>
      ))}
    </div>
  );
}
