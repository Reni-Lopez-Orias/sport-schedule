"use client";

import { useState, useEffect } from "react";
import { BettingOdd, Game, GameDetail, Team } from "../types/interfaces";
import { safeGet } from "../api/helper/helper";
import ImageWithLoading from "./ImageWithLoading";
import StatusBadge from "./StatusBadge";

interface GameDetailModalProps {
  game: Game;
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
  activeLeague: string;
}

export default function GameDetailModal({
  game,
  gameId,
  isOpen,
  onClose,
  activeLeague,
}: GameDetailModalProps) {
  const [gameDetails, setGameDetails] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !gameId) return;

    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/league/${activeLeague}/game/detail/${gameId}`
        );
        const data = await response.json();
        if (data.success) setGameDetails(data.data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [isOpen, gameId, activeLeague]);

  if (!isOpen) return null;
  console.log(game);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-xl max-w-4xl w-full h-[85vh] ios-height-fix overflow-hidden shadow-2xl border border-white/20 flex flex-col">
        {/* Fixed header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ImageWithLoading
              alt="logo"
              height={60}
              width={60}
              src={"/leagues/" + game.league.toLowerCase() + ".png"}
            />
            <h2 className="text-lg font-bold text-white">
              {loading ? "Loading..." : gameDetails?.shortName || "Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-white">
          {loading ? (
            <div className="p-8 text-center flex flex-col justify-center items-center h-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading game details...</p>
            </div>
          ) : gameDetails ? (
            <>
              <SummaryTab
                awayTeam={game.away}
                homeTeam={game.home}
                gameDetails={gameDetails}
                activeLeague={activeLeague}
              />
              <OddsTab gameDetails={gameDetails} />
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <p className="text-red-600 font-medium">
                Error loading game details
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Please try again in a moment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Components for each tab
function SummaryTab({
  homeTeam,
  awayTeam,
  gameDetails,
  activeLeague,
}: {
  gameDetails: GameDetail;
  activeLeague: string;
  homeTeam: Team;
  awayTeam: Team;
}) {
  const competition = gameDetails.competitions?.[0];

  if (!gameDetails || !competition) {
    return (
      <div className="p-4 text-center text-gray-500">
        No competition data available.
      </div>
    );
  }

  const homeScore = homeTeam?.score || "0";
  const awayScore = awayTeam?.score || "0";

  const formatGameTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "To be confirmed";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Scoreboard */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="text-xs text-end text-gray-600 uppercase font-semibold">
          <StatusBadge status={gameDetails.status.type.name} />
        </div>
        <div className="grid grid-cols-3 items-center gap-1">
          {/* Away Team */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
              <ImageWithLoading
                alt="logo"
                height={70}
                width={70}
                src={awayTeam.logo}
              />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">{awayTeam.name}</h3>
          </div>

          {/* Game Status */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-2">
              {gameDetails.status.clock > 0 ? (
                <div className="text-xl font-bold text-gray-900">
                  Q{gameDetails.status.period} -{" "}
                  {gameDetails.status.displayClock}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  {gameDetails.date
                    ? new Date(gameDetails.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Time TBD"}
                </div>
              )}
              {(gameDetails.status.type.name === "STATUS_IN_PROGRESS" ||
                gameDetails.status.type.name === "STATUS_HALFTIME" ||
                gameDetails.status.type.name === "STATUS_END_PERIOD" ||
                gameDetails.status.type.name === "STATUS_FINAL") && (
                <div className="text-xl font-bold text-gray-700">
                  {awayScore} - {homeScore}
                </div>
              )}
            </div>
          </div>

          {/* Home Team */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
              <ImageWithLoading
                alt="logo"
                width={70}
                height={70}
                src={homeTeam.logo}
              />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">{homeTeam.name}</h3>
          </div>
        </div>
      </div>

      {/* Game Information */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <div className="text-gray-600">Venue</div>
            <div className="font-medium text-gray-900">
              {competition.venue?.fullName || "To be confirmed"}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-gray-600">Location</div>
            <div className="font-medium text-gray-900">
              {competition.venue?.address?.city || "City"},{" "}
              {competition.venue?.address?.state || "State"}
            </div>
          </div>

          {competition.broadcasts?.[0]?.names?.[0] !== "Unknown" && (
            <div className="flex flex-col">
              <div className="text-gray-600">Broadcast</div>
              <div className="font-medium text-gray-900">
                {competition.broadcasts?.[0]?.names?.[0] || "To be confirmed"}
              </div>
            </div>
          )}

          {Number(competition.attendance) > 0 && (
            <div className="flex flex-col">
              <div className="text-gray-600">Attendance</div>
              <div className="font-medium text-gray-900">
                {competition?.attendance?.toLocaleString()}
              </div>
            </div>
          )}

          {gameDetails.date && (
            <div className="flex flex-col">
              <div className="text-gray-600">Date & Time</div>
              <div className="font-medium text-gray-900">
                {formatGameTime(gameDetails.date)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Probable Pitchers - MLB Only */}
      {activeLeague === "MLB" && gameDetails.probables && (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-center text-gray-900">
            Probable Pitchers
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="font-semibold text-sm text-blue-600 mb-2">
                {awayTeam.name}
              </div>
              <div className="text-md font-bold text-gray-900">
                {gameDetails.probables.away.displayName || "TBD"}
              </div>
              <div className="text-xs mt-3 space-y-1 text-gray-600">
                <div>ERA: {gameDetails.probables.away.era || "N/A"}</div>
                <div>
                  Record: {gameDetails.probables.away.wins || "0"}-
                  {gameDetails.probables.away.losses || "0"}
                </div>
                <div>
                  Strikeouts: {gameDetails.probables.away.strikeouts || "0"}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm text-red-600 mb-2">
                {homeTeam.name}
              </div>
              <div className="text-md font-bold text-gray-900">
                {gameDetails.probables.home.displayName || "TBD"}
              </div>
              <div className="text-xs mt-3 space-y-1 text-gray-600">
                <div>ERA: {gameDetails.probables.home.era || "N/A"}</div>
                <div>
                  Record: {gameDetails.probables.home.wins || "0"}-
                  {gameDetails.probables.home.losses || "0"}
                </div>
                <div>
                  Strikeouts: {gameDetails.probables.home.strikeouts || "0"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Series Situation */}
      {gameDetails.series && (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-3 text-gray-900">
            Series Situation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Current Series</div>
              <div className="font-medium text-gray-900">
                {gameDetails.series.current?.summary || "No data"}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Season Series</div>
              <div className="font-medium text-gray-900">
                {gameDetails.series.season?.summary || "No data"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Odds */}
      {gameDetails.odds && gameDetails.odds.length > 0 && (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-3 text-gray-900">Betting Odds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameDetails.odds.slice(0, 2).map((odd, index) => (
              <div
                key={index}
                className="text-center p-3 bg-gray-100 rounded-lg"
              >
                <div className="text-sm font-semibold text-gray-700">
                  {odd.provider?.name || "Provider"}
                </div>
                <div className="text-lg font-bold text-blue-600 mt-1">
                  {odd.details || "No details"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  O/U: {odd.overUnder || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OddsTab({ gameDetails }: { gameDetails: GameDetail }) {
  if (!gameDetails.odds || gameDetails.odds.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No betting data available for this game.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* All available odds */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Betting Lines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameDetails.odds.map((odd: BettingOdd, index: number) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">
                  {odd.provider?.name || "Provider"}
                </span>
                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {odd.details || "No details"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">Over/Under</div>
                  <div className="font-bold text-gray-900">
                    {odd.overUnder || "N/A"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Moneyline</div>
                  <div className="font-bold text-gray-900">
                    {odd.moneyLineAway > 0 ? "+" : ""}
                    {odd.moneyLineAway || "N/A"} /{" "}
                    {odd.moneyLineHome > 0 ? "+" : ""}
                    {odd.moneyLineHome || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Win probabilities */}
      {gameDetails.probabilities && (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-900">
            Win Probabilities
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {safeGet(gameDetails, "probabilities.awayWinPercentage", 0)}%
              </div>
              <div className="text-sm font-medium text-gray-700 mt-1">
                Away Team
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {safeGet(gameDetails, "probabilities.homeWinPercentage", 0)}%
              </div>
              <div className="text-sm font-medium text-gray-700 mt-1">
                Home Team
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
