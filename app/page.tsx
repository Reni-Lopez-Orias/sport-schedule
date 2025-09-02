// app/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";

import NoGames from "./components/NoGames";
import GamesGrid from "./components/GamesGrid";
import LeagueTabs from "./components/LeagueTabs";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { GamesData, LeagueLoading } from "./types/interfaces";
import ImageWithLoading from "./components/ImageWithLoading";

const leaguesOrder = [
  "NFL",
  "NBA",
  "MLB",
  "NHL",
  "COLLEGEFOOTBALL",
  "COLLEGEBASKETBALL",
];

export default function Home() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeLeague, setActiveLeague] = useState("NFL");
  const [games, setGames] = useState<GamesData>({});
  const [leagueLoading, setLeagueLoading] = useState<LeagueLoading>({});

  const loadLeagueGames = useCallback(
    async (league: string) => {
      setLeagueLoading((prev) => ({ ...prev, [league]: true }));
      try {
        const res = await fetch(`/api/league/${league}/game/schedule/${date}`);
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
    leaguesOrder.forEach(loadLeagueGames);
  }, [date, loadLeagueGames]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto p-3">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 h-[44px] rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none appearance-none"
            />

            <LeagueTabs
              games={games}
              leagues={leaguesOrder}
              activeLeague={activeLeague}
              leagueLoading={leagueLoading}
              onLeagueChange={setActiveLeague}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-6xl mx-auto p-4">
          {leagueLoading[activeLeague] && <LoadingSkeleton />}

          {!leagueLoading[activeLeague] &&
            games[activeLeague]?.length === 0 && <NoGames />}

          {!leagueLoading[activeLeague] && games[activeLeague]?.length > 0 && (
            <GamesGrid
              activeLeague={activeLeague}
              games={games[activeLeague]}
            />
          )}
        </div>
      </main>

      {/* Referencia a ESPN */}
      <footer className="flex items-center justify-center gap-2 text-center text-xs text-gray-500 py-2 border-t">
        <span className="text-sm font-semibold">Data provided by</span>
        <ImageWithLoading
          width={45}
          height={45}
          alt="logo"
          src="https://a.espncdn.com/redesign/assets/img/logos/espn-404@2x.png"
        />
      </footer>
    </div>
  );
}
