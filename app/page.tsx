"use client";

import { useEffect, useState } from "react";
import LeagueTabs from "./components/LeagueTabs";
import LoadingSkeleton from "./components/LoadingSkeleton";
import NoGames from "./components/NoGames";
import GamesGrid from "./components/GamesGrid";

const leaguesOrder = ["NFL", "NBA", "MLB"];

export default function Home({ theme }: { theme: "light" | "dark" }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeLeague, setActiveLeague] = useState("NFL");
  const [games, setGames] = useState<Record<string, any[]>>({});
  const [leagueLoading, setLeagueLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    leaguesOrder.forEach(loadLeagueGames);
  }, [date, theme]);

  async function loadLeagueGames(league: string) {
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
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 h-[40px] rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
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

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4">
          {leagueLoading[activeLeague] && <LoadingSkeleton />}
          
          {!leagueLoading[activeLeague] && games[activeLeague]?.length === 0 && (
            <NoGames />
          )}

          {!leagueLoading[activeLeague] && games[activeLeague]?.length > 0 && (
            <GamesGrid games={games[activeLeague]} />
          )}
        </div>
      </main>
    </div>
  );
}