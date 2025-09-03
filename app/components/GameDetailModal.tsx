"use client";

import { useState, useEffect } from "react";
import {
  ESPNGame,
  Competition,
  Competitor,
  Odds,
  Team,
} from "../types/interfaces";
import ImageWithLoading from "./ImageWithLoading";
import StatusBadge from "./StatusBadge";

interface GameDetailModalProps {
  game: ESPNGame;
  isOpen: boolean;
  onClose: () => void;
  activeLeague: string;
}

// Define tab types
type TabType = "summary" | "odds" | "analysis";

export default function GameDetailModal({
  game,
  isOpen,
  onClose,
  activeLeague,
}: GameDetailModalProps) {
  const [gameDetails, setGameDetails] = useState<ESPNGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("odds");

  useEffect(() => {
    setLoading(true);
    if (isOpen && game) {
      setGameDetails(game as ESPNGame);
      setLoading(false);
    }
  }, [isOpen, game]);

  if (!isOpen) return null;

  const competition = gameDetails?.competitions?.[0];
  const awayTeam = competition?.competitors?.find(
    (c: Competitor) => c.homeAway === "away"
  )?.team;
  const homeTeam = competition?.competitors?.find(
    (c: Competitor) => c.homeAway === "home"
  )?.team;
  const odds = competition?.odds || [];

  // Function to determine if a color is light or dark
  const isLightColor = (color: string) => {
    if (!color) return false;
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-xl max-w-4xl w-full h-[85vh] ios-height-fix overflow-hidden shadow-2xl border border-white/20 flex flex-col">
        {/* Fixed header */}
        <div
          className="sticky top-0 z-10 px-6 py-2 rounded-t-xl flex items-center justify-between"
          style={{
            background: awayTeam?.color
              ? `linear-gradient(to right, #${awayTeam.color}, #${
                  homeTeam?.color || "333"
                })`
              : "linear-gradient(to right, #1e40af, #1e3a8a)",
          }}
        >
          <div className="flex items-center space-x-3">
            <ImageWithLoading
              alt="logo"
              height={40}
              width={40}
              src={"/leagues/" + activeLeague.toLowerCase() + ".png"}
            />
            <h2 className="text-lg font-bold text-white">
              {loading
                ? "Loading..."
                : gameDetails?.shortName || "Game Details"}
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

        {/* Tabs Navigation - Centered and equal width */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex justify-center px-6">
            <button
              onClick={() => setActiveTab("odds")}
              className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm text-center ${
                activeTab === "odds"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Betting
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm text-center ${
                activeTab === "summary"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm text-center ${
                activeTab === "analysis"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Analysis
            </button>
          </nav>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-white">
          {loading ? (
            <div className="p-8 text-center flex flex-col justify-center items-center h-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading game details...</p>
            </div>
          ) : gameDetails && competition ? (
            <>
              {activeTab === "summary" && (
                <SummaryTab
                  gameDetails={gameDetails}
                  competition={competition}
                  activeLeague={activeLeague}
                  awayTeam={awayTeam}
                  homeTeam={homeTeam}
                />
              )}
              {activeTab === "odds" && (
                <OddsTab odds={odds} awayTeam={awayTeam} homeTeam={homeTeam} />
              )}
              {activeTab === "analysis" && (
                <AnalysisTab
                  gameDetails={gameDetails}
                  awayTeam={awayTeam}
                  homeTeam={homeTeam}
                  isLightColor={isLightColor}
                />
              )}
            </>
          ) : (
            <div className="p-8 text-center">
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

// Component for the betting tab
function OddsTab({
  odds,
  awayTeam,
  homeTeam,
}: {
  odds: Odds[];
  awayTeam?: Team;
  homeTeam?: Team;
}) {
  if (odds.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 font-medium">No betting data available</p>
        <p className="text-gray-400 text-sm mt-1">
          Betting data will appear when available
        </p>
      </div>
    );
  }

  // Take odds from the first provider (usually ESPN BET)
  const primaryOdds = odds[0];

  return (
    <div className="space-y-6">
      {/* Quick betting summary */}
      <h3 className="font-bold text-lg mb-4 text-gray-900">Betting Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Moneyline */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: awayTeam?.color
              ? `#${awayTeam.color}20`
              : "#eef2ff",
            borderLeft: awayTeam?.color
              ? `4px solid #${awayTeam.color}`
              : "4px solid #3b82f6",
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{
              color: awayTeam?.color ? `#${awayTeam.color}` : "#1e40af",
            }}
          >
            Moneyline
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{awayTeam?.abbreviation}</span>
              <span className="font-bold">
                {primaryOdds.awayTeamOdds.moneyLine > 0 ? "+" : ""}
                {primaryOdds.awayTeamOdds.moneyLine}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{homeTeam?.abbreviation}</span>
              <span className="font-bold">
                {primaryOdds.homeTeamOdds.moneyLine > 0 ? "+" : ""}
                {primaryOdds.homeTeamOdds.moneyLine}
              </span>
            </div>
          </div>
        </div>

        {/* Spread */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: homeTeam?.color
              ? `#${homeTeam.color}20`
              : "#f0fdf4",
            borderLeft: homeTeam?.color
              ? `4px solid #${homeTeam.color}`
              : "4px solid #16a34a",
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{
              color: homeTeam?.color ? `#${homeTeam.color}` : "#166534",
            }}
          >
            Spread
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{awayTeam?.abbreviation}</span>
              <span className="font-bold">
                {primaryOdds.pointSpread.away.close.line} (
                {primaryOdds.pointSpread.away.close.odds})
              </span>
            </div>
            <div className="flex justify-between">
              <span>{homeTeam?.abbreviation}</span>
              <span className="font-bold">
                {primaryOdds.pointSpread.home.close.line} (
                {primaryOdds.pointSpread.home.close.odds})
              </span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
          <h4 className="font-semibold text-gray-800 mb-2">Total</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Over</span>
              <span className="font-bold">
                {primaryOdds.total.over.close.line} (
                {primaryOdds.total.over.close.odds})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Under</span>
              <span className="font-bold">
                {primaryOdds.total.under.close.line} (
                {primaryOdds.total.under.close.odds})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured bets */}
      {primaryOdds.featuredBets && primaryOdds.featuredBets.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-900">
            Featured Bets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryOdds.featuredBets.slice(0, 4).map((bet, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50"
              >
                <h4 className="font-semibold text-yellow-800 mb-2">
                  {bet.displayName}
                </h4>
                <p className="text-lg font-bold text-yellow-600">{bet.odds}</p>
                <p className="text-sm text-yellow-700 mt-1">{bet.payoutText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Betting providers */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">
          Betting Providers
        </h3>

        <div className="space-y-4">
          {odds.map((odd, index) => (
            <div
              key={index}
              className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <h4 className="font-medium text-gray-800 mb-2">
                {odd.provider.name}
              </h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Moneyline:</span>
                  <div>{odd.details}</div>
                </div>
                <div>
                  <span className="text-gray-600">Spread:</span>
                  <div>{odd.spread}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <div>{odd.overUnder}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Component for the analysis tab
function AnalysisTab({
  gameDetails,
  awayTeam,
  homeTeam,
}: {
  gameDetails: ESPNGame;
  awayTeam?: Team;
  homeTeam?: Team;
}) {
  // Calculate some simple statistics for analysis
  const awayCompetitor = gameDetails.competitions?.[0]?.competitors?.find(
    (c: Competitor) => c.homeAway === "away"
  );
  const homeCompetitor = gameDetails.competitions?.[0]?.competitors?.find(
    (c: Competitor) => c.homeAway === "home"
  );

  const awayRecord =
    awayCompetitor?.records?.find((r) => r.type === "total")?.summary || "0-0";
  const homeRecord =
    homeCompetitor?.records?.find((r) => r.type === "total")?.summary || "0-0";

  const [awayWins, awayLosses] = awayRecord.split("-").map(Number);
  const [homeWins, homeLosses] = homeRecord.split("-").map(Number);

  const awayWinPercentage = awayWins / (awayWins + awayLosses) || 0;
  const homeWinPercentage = homeWins / (homeWins + homeLosses) || 0;

  return (
    <div className="space-y-6">
      {/* Team analysis */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Team Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: awayTeam?.color
                ? `#${awayTeam.color}20`
                : "#eef2ff",
              borderLeft: awayTeam?.color
                ? `4px solid #${awayTeam.color}`
                : "4px solid #3b82f6",
            }}
          >
            <h4
              className="font-semibold mb-2"
              style={{
                color: awayTeam?.color ? `#${awayTeam.color}` : "#1e40af",
              }}
            >
              {awayTeam?.name}
            </h4>
            <div className="space-y-1 text-sm">
              <div>Record: {awayRecord}</div>
              <div>Win percentage: {(awayWinPercentage * 100).toFixed(1)}%</div>
              <div>Location: {awayTeam?.location}</div>
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: homeTeam?.color
                ? `#${homeTeam.color}20`
                : "#fef2f2",
              borderLeft: homeTeam?.color
                ? `4px solid #${homeTeam.color}`
                : "4px solid #dc2626",
            }}
          >
            <h4
              className="font-semibold mb-2"
              style={{
                color: homeTeam?.color ? `#${homeTeam.color}` : "#dc2626",
              }}
            >
              {homeTeam?.name}
            </h4>
            <div className="space-y-1 text-sm">
              <div>Record: {homeRecord}</div>
              <div>Win percentage: {(homeWinPercentage * 100).toFixed(1)}%</div>
              <div>Location: {homeTeam?.location}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Home advantage */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Home Advantage</h3>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Home court advantage:</span>
            <span className="font-bold text-lg">
              {homeWinPercentage > awayWinPercentage
                ? "Significant"
                : "Limited"}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${homeWinPercentage * 100}%`,
                backgroundColor: homeTeam?.color
                  ? `#${homeTeam.color}`
                  : "#3b82f6",
              }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500 text-right">
            {((homeWinPercentage - awayWinPercentage) * 100).toFixed(1)}%
            advantage
          </div>
        </div>
      </div>

      {/* Prediction based on records */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">
          Prediction Based on Records
        </h3>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor:
              homeWinPercentage > awayWinPercentage
                ? homeTeam?.color
                  ? `#${homeTeam.color}20`
                  : "#dcfce7"
                : awayTeam?.color
                ? `#${awayTeam.color}20`
                : "#dbeafe",
            borderLeft:
              homeWinPercentage > awayWinPercentage
                ? homeTeam?.color
                  ? `4px solid #${homeTeam.color}`
                  : "4px solid #16a34a"
                : awayTeam?.color
                ? `4px solid #${awayTeam.color}`
                : "4px solid #3b82f6",
          }}
        >
          <div
            className="font-bold text-lg mb-2"
            style={{
              color:
                homeWinPercentage > awayWinPercentage
                  ? homeTeam?.color
                    ? `#${homeTeam.color}`
                    : "#166534"
                  : awayTeam?.color
                  ? `#${awayTeam.color}`
                  : "#1e40af",
            }}
          >
            {homeWinPercentage > awayWinPercentage
              ? homeTeam?.name
              : awayTeam?.name}
          </div>
          <p>
            has a higher probability of winning based on current season records.
          </p>
        </div>
      </div>
    </div>
  );
}

// Component for the summary tab
function SummaryTab({
  gameDetails,
  competition,
  activeLeague,
  awayTeam,
  homeTeam,
}: {
  gameDetails: ESPNGame;
  competition: Competition;
  activeLeague: string;
  awayTeam?: Team;
  homeTeam?: Team;
}) {
  const awayCompetitor = competition.competitors?.find(
    (c: Competitor) => c.homeAway === "away"
  );
  const homeCompetitor = competition.competitors?.find(
    (c: Competitor) => c.homeAway === "home"
  );

  const homeScore = homeCompetitor?.score || "0";
  const awayScore = awayCompetitor?.score || "0";

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
        <div className="text-xs text-end text-gray-600 uppercase font-semibold mb-3">
          <StatusBadge status={gameDetails.status.type.name} />
        </div>
        <div className="grid grid-cols-3 items-center gap-2">
          {/* Away Team */}
          <div
            className="text-center p-4 rounded-lg"
            style={{
              backgroundColor: awayTeam?.color
                ? `#${awayTeam.color}10`
                : "transparent",
              border: awayTeam?.color
                ? `2px solid #${awayTeam.color}`
                : "2px solid #e5e7eb",
            }}
          >
            <div className="mx-auto mb-3 flex items-center justify-center">
              <ImageWithLoading
                alt="logo"
                height={70}
                width={70}
                src={awayTeam?.logo || ""}
              />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">
              {awayTeam?.name || "Away Team"}
            </h3>
            <p className="text-xs text-gray-600">{awayTeam?.abbreviation}</p>
          </div>

          {/* Game Status */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-2">
              {gameDetails.status.clock > 0 ? (
                <div className="text-xl font-bold text-gray-900">
                  {activeLeague === "NBA" ||
                  activeLeague === "COLLEGEBASKETBALL"
                    ? "Q"
                    : ""}
                  {gameDetails.status.period} -{" "}
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
              {(gameDetails.status.type.state === "in" ||
                gameDetails.status.type.completed) && (
                <div className="text-xl font-bold text-gray-700">
                  {awayScore} - {homeScore}
                </div>
              )}
            </div>
          </div>

          {/* Home Team */}
          <div
            className="text-center p-4 rounded-lg"
            style={{
              backgroundColor: homeTeam?.color
                ? `#${homeTeam.color}10`
                : "transparent",
              border: homeTeam?.color
                ? `2px solid #${homeTeam.color}`
                : "2px solid #e5e7eb",
            }}
          >
            <div className="mx-auto mb-3 flex items-center justify-center">
              <ImageWithLoading
                alt="logo"
                width={70}
                height={70}
                src={homeTeam?.logo || ""}
              />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">
              {homeTeam?.name || "Home Team"}
            </h3>
            <p className="text-xs text-gray-600">{homeTeam?.abbreviation}</p>
          </div>
        </div>
      </div>

      {/* Basic game information */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">
          Game Information
        </h3>
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

          {competition.broadcasts && competition.broadcasts.length > 0 && (
            <div className="flex flex-col">
              <div className="text-gray-600">Broadcast</div>
              <div className="font-medium text-gray-900">
                {competition.broadcasts[0]?.names?.join(", ") ||
                  "To be confirmed"}
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
    </div>
  );
}
