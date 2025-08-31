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
  onLeagueChange 
}: LeagueTabsProps) {
  return (
    <div className="w-full sm:w-auto flex gap-2">
      {leagues.map((lg) => (
        <div key={lg} className="relative flex-1 flex flex-col items-center min-w-0">
          <button
            onClick={() => onLeagueChange(lg)}
            className={`flex flex-col items-center justify-center w-full sm:w-24 py-3 rounded-lg border-2 transition-all duration-200 transform
              ${
                activeLeague === lg
                  ? "bg-gray-200 dark:bg-gray-600 text-white border-gray-600 dark:border-gray-700 font-bold shadow-lg scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 opacity-80 hover:opacity-100 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-[1.02]"
              }`}
          >
            {lg}
            {leagueLoading[lg] && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </span>
            )}
          </button>

          <span className={`absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm transition-colors
            ${activeLeague === lg 
              ? "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-500" 
              : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}>
            {games[lg]?.length || 0}
          </span>
        </div>
      ))}
    </div>
  );
}