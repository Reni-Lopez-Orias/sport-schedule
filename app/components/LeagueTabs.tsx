import ImageWithLoading from "./ImageWithLoading";
import { BaseLeague, LeagueLoading } from "../types/interfaces";

interface LeagueTabsProps {
  activeLeague: string;
  leagueLoading: LeagueLoading;
  leagues: Record<string, BaseLeague>;
  onLeagueChange: (league: string) => void;
}

export default function LeagueTabs({
  leagues,
  activeLeague,
  leagueLoading,
  onLeagueChange,
}: LeagueTabsProps) {
  const orderedLeagues = Object.keys(leagues)
    .filter((abbr) => (leagues[abbr]?.games?.length || 0) > 0) // ✅ mostrar solo si tiene juegos
    .sort((a, b) => {
      const gamesA = leagues[a]?.games?.length || 0;
      const gamesB = leagues[b]?.games?.length || 0;
      return gamesB - gamesA;
    });

  // Si no hay ligas con juegos, no renderizar nada
  if (orderedLeagues.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-row gap-3 items-center overflow-x-auto overflow-y-hidden p-0 h-18 no-vertical-scroll">
      {orderedLeagues.map((leagueAbbr) => {
        const league = leagues[leagueAbbr];
        const gameCount = league?.games?.length || 0;

        return (
          <div
            key={leagueAbbr}
            className="relative flex flex-col items-center flex-shrink-0 group"
            style={{ minWidth: "56px" }}
          >
            <button
              onClick={() => onLeagueChange(leagueAbbr)}
              className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-200 overflow-hidden
                ${
                  activeLeague === leagueAbbr
                    ? "bg-gray-200 border-gray-400 ring-2 ring-gray-300 shadow-lg"
                    : "bg-white border-gray-300 hover:border-gray-400 opacity-90 hover:opacity-100"
                }`}
            >
              <ImageWithLoading
                width={40}
                height={40}
                alt={`${leagueAbbr} logo`}
                className="object-contain"
                src={league.logos[0]?.href || ""}
              />

              {leagueLoading[leagueAbbr] && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4">
                  <div
                    className={`w-3 h-3 border-2 rounded-full animate-spin ${
                      activeLeague === leagueAbbr
                        ? "border-gray-400 border-t-gray-600"
                        : "border-gray-400 border-t-transparent"
                    }`}
                  />
                </span>
              )}

              <span
                className={`absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs transition-colors
                  ${
                    activeLeague === leagueAbbr
                      ? "bg-gray-800 text-white border-2 border-gray-700 shadow-md"
                      : "bg-gray-300 text-gray-800"
                  }`}
              >
                {gameCount}
              </span>
            </button>

            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2 py-1 rounded mt-1 whitespace-nowrap pointer-events-none">
              {league?.name || leagueAbbr}
            </div>
          </div>
        );
      })}
    </div>
  );
}
