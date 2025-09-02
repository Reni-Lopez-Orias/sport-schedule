import Image from "next/image";
import { GamesData, LeagueLoading } from "../types/interfaces";

interface LeagueTabsProps {
  leagues: string[];
  activeLeague: string;
  games: GamesData;
  leagueLoading: LeagueLoading;
  onLeagueChange: (league: string) => void;
}

const LEAGUE_LOGOS: { [key: string]: string } = {
  NFL: "/leagues/nfl.png",
  NBA: "/leagues/nba.png",
  MLB: "/leagues/mlb.png",
  NHL: "/leagues/nhl.png",
  COLLEGEFOOTBALL: "/leagues/college-football.png",
  COLLEGEBASKETBALL: "/leagues/college-basketball.png",
};

export default function LeagueTabs({
  leagues,
  activeLeague,
  games,
  leagueLoading,
  onLeagueChange,
}: LeagueTabsProps) {
  return (
    <div
      className="
    w-full
    flex flex-row gap-3 items-end
    overflow-x-auto sm:overflow-x-visible
    sm:justify-end
    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
    p-2
  "
    >
      {leagues.map((lg) => (
        <div
          key={lg}
          className="relative flex flex-col items-center flex-shrink-0"
        >
          <button
            onClick={() => onLeagueChange(lg)}
            className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-200 overflow-hidden
              ${
                activeLeague === lg
                  ? "bg-gray-200 border-gray-400 ring-2 ring-gray-300 shadow-lg"
                  : "bg-white border-gray-300 hover:border-gray-400 opacity-90 hover:opacity-100"
              }`}
          >
            <Image
              src={LEAGUE_LOGOS[lg]}
              alt={`${lg} logo`}
              width={40}
              height={40}
              className="object-contain"
            />

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

            {/* contador de juegos arriba a la derecha */}
            <span
              className={`absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs transition-colors
                ${
                  activeLeague === lg
                    ? "bg-gray-800 text-white border-2 border-gray-700 shadow-md"
                    : "bg-gray-300 text-gray-800"
                }`}
            >
              {games[lg]?.length || 0}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
