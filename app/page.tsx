"use client";

import { useEffect, useState, useCallback } from "react";
import LeagueTabs from "./components/LeagueTabs";
import LoadingSkeleton from "./components/LoadingSkeleton";
import NoGames from "./components/NoGames";
import GamesGrid from "./components/GamesGrid";
import { GamesData, LeagueLoading } from "./types/interfaces";

const leaguesOrder = ["NFL", "NBA", "MLB"];

export default function Home({ theme }: { theme: "light" | "dark" }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeLeague, setActiveLeague] = useState("NFL");
  const [games, setGames] = useState<GamesData>({});
  const [leagueLoading, setLeagueLoading] = useState<LeagueLoading>({});

  const loadLeagueGames = useCallback(
    async (league: string) => {
      setLeagueLoading((prev) => ({ ...prev, [league]: true }));
      try {
        const res = await fetch(`/api/games/${league}/${date}`);
        const data = await res.json();
        if (!data.error) {
          setGames((prev) => ({ ...prev, [league]: data.data.games }));
        } else {
          setGames((prev) => ({ ...prev, [league]: [] }));
        }
      } catch (err) {
        console.error(err);
        setGames((prev) => ({ ...prev, [league]: [] }));
      } finally {
        setLeagueLoading((prev) => ({ ...prev, [league]: false }));
      }
    },
    [date]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    leaguesOrder.forEach(loadLeagueGames);
  }, [date, theme, loadLeagueGames]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 h-[44px] rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none appearance-none"
            />

            <LeagueTabs
              leagues={leaguesOrder}
              activeLeague={activeLeague}
              games={games}
              leagueLoading={leagueLoading}
              onLeagueChange={setActiveLeague}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        {" "}
        {/* ← Añadí pb-20 para espacio al final */}
        <div className="max-w-6xl mx-auto p-4">
          {leagueLoading[activeLeague] && <LoadingSkeleton />}

          {!leagueLoading[activeLeague] &&
            games[activeLeague]?.length === 0 && <NoGames />}

          {!leagueLoading[activeLeague] && games[activeLeague]?.length > 0 && (
            <GamesGrid games={games[activeLeague]} />
          )}
        </div>
      </main>
    </div>
  );
}
