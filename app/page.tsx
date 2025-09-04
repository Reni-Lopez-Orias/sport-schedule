"use client";

import { useState, useCallback, useEffect } from "react";
import NoGames from "./components/NoGames";
import GamesGrid from "./components/GamesGrid";
import LeagueTabs from "./components/LeagueTabs";
import {
  LeagueTabsSkeleton,
  LoadingSkeleton,
} from "./components/LoadingSkeleton";
import {
  BaseLeague,
  LeagueLoading,
  BaseResponseSportSchedule,
} from "./types/interfaces";
import { createEmptyLeague } from "./api/helper/helper";
import ImageWithLoading from "./components/ImageWithLoading";

const leaguesOrder = [
  "MLB",
  "NBA",
  "NHL",
  "COLLEGEFOOTBALL",
  "COLLEGEBASKETBALL",
  "CHAMPIONSLEAGUE",
  "PREMIERLEAGUE",
  "LALIGA",
  "SERIEA",
  "BUNDESLIGA",
  "LIGUE1",
];

export default function Home() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeLeague, setActiveLeague] = useState("");
  const [leagueLoading, setLeagueLoading] = useState<LeagueLoading>({});
  const [leagues, setLeagues] = useState<Record<string, BaseLeague>>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadedLeaguesCount, setLoadedLeaguesCount] = useState(0);

  const loadLeagueGames = useCallback(
    async (leagueAbbr: string) => {
      setLeagueLoading((prev) => ({ ...prev, [leagueAbbr]: true }));
      try {
        const res = await fetch(
          `/api/league/${leagueAbbr}/game/schedule/${date}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data: BaseResponseSportSchedule<BaseLeague> = await res.json();

        if (!data.error) {
          setLeagues((prev) => ({
            ...prev,
            [leagueAbbr]: data.data,
          }));
        } else {
          setLeagues((prev) => ({
            ...prev,
            [leagueAbbr]: createEmptyLeague(leagueAbbr, date),
          }));
        }
      } catch (err) {
        console.error(`Error loading ${leagueAbbr}:`, err);
        setLeagues((prev) => ({
          ...prev,
          [leagueAbbr]: createEmptyLeague(leagueAbbr, date),
        }));
      } finally {
        setLeagueLoading((prev) => ({ ...prev, [leagueAbbr]: false }));
        setLoadedLeaguesCount((prev) => prev + 1);
      }
    },
    [date]
  );

  // Efecto para cargar las ligas cuando cambia la fecha
  useEffect(() => {
    setIsInitialLoading(true);
    setLoadedLeaguesCount(0);
    setLeagues({});
    leaguesOrder.forEach(loadLeagueGames);
  }, [date, loadLeagueGames]);

  // Efecto para establecer la liga activa inicial
  useEffect(() => {
    if (loadedLeaguesCount === leaguesOrder.length && isInitialLoading) {
      setIsInitialLoading(false);

      // Encontrar la primera liga con juegos
      const leagueWithGames = leaguesOrder.find(
        (abbr) => leagues[abbr]?.games?.length > 0
      );

      if (leagueWithGames) {
        setActiveLeague(leagueWithGames);
      } else if (leaguesOrder.length > 0) {
        // Si no hay juegos, seleccionar la primera liga
        setActiveLeague(leaguesOrder[0]);
      }
    }
  }, [loadedLeaguesCount, leagues, isInitialLoading]);

  const activeLeagueData = leagues[activeLeague];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto p-3 pb-0">
          <div className="flex items-center flex-col sm:flex-row justify-between gap-1">
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 h-[44px] rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none appearance-none"
            />

            {isInitialLoading ? (
              <LeagueTabsSkeleton />
            ) : (
              <LeagueTabs
                leagues={leagues}
                activeLeague={activeLeague}
                leagueLoading={leagueLoading}
                onLeagueChange={setActiveLeague}
              />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          {leagueLoading[activeLeague] && <LoadingSkeleton />}

          {!leagueLoading[activeLeague] &&
            activeLeagueData &&
            activeLeagueData.games?.length === 0 && (
              <NoGames leagueName={activeLeague} />
            )}

          {!leagueLoading[activeLeague] &&
            activeLeagueData &&
            activeLeagueData.games?.length > 0 && (
              <GamesGrid
                leagues={leagues}
                activeLeague={activeLeague}
                games={activeLeagueData.games}
              />
            )}
        </div>
      </main>

      <footer className="flex items-center justify-center gap-2 text-center text-xs text-gray-500 py-3 border-t bg-gray-50">
        <span className="text-sm font-semibold">Data provided by</span>
        <ImageWithLoading
          width={45}
          height={45}
          alt="ESPN logo"
          className="object-contain"
          src="https://a.espncdn.com/redesign/assets/img/logos/espn-404@2x.png"
        />
      </footer>
    </div>
  );
}