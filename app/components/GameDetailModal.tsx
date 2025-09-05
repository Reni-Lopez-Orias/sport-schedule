"use client";

import { useState, useEffect } from "react";
import { OddsTab } from "./OddsTab";
import { SummaryTab } from "./SummaryTab";
import { AnalysisTab } from "./AnalysisTab";
import { ESPNGame, Competitor } from "../types/interfaces";

interface GameDetailModalProps {
  game: ESPNGame;
  isOpen: boolean;
  onClose: () => void;
  activeLeague: string;
}

type TabType = "summary" | "odds" | "analysis";

export default function GameDetailModal({
  game,
  isOpen,
  onClose,
  activeLeague,
}: GameDetailModalProps) {
  const [gameDetails, setGameDetails] = useState<ESPNGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  console.log(game);

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
                  awayTeam={awayTeam}
                  homeTeam={homeTeam}
                  gameDetails={gameDetails}
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
