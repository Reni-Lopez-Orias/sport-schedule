"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { ESPNGame } from "../types/interfaces";
import GameDetailModal from "./GameDetailModal";
import ImageWithLoading from "./ImageWithLoading";

interface GameCardProps {
  game: ESPNGame;
  activeLeague: string;
}

export default function GameCard({ game, activeLeague }: GameCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const competition = game.competitions?.[0];
  const awayTeam = competition?.competitors?.find((c) => c.homeAway === "away");
  const homeTeam = competition?.competitors?.find((c) => c.homeAway === "home");

  const venue = competition?.venue?.fullName || "Unknown Venue";

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-2 text-xs mb-2">
          <span className="font-bold text-gray-900">
            {new Date(game.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="opacity-70 font-semibold text-gray-700">
            {venue}
          </span>
          <span className="ml-auto">
            <StatusBadge status={game.status.type.name} />
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col items-center">
            <ImageWithLoading
              width={50}
              height={50}
              className="object-contain"
              src={awayTeam?.team.logo || ""}
              alt={awayTeam?.team.name || "Away team"}
            />
            <span className="text-sm font-bold text-center text-gray-900 w-24">
              {awayTeam?.team.name || "Away Team"}
            </span>
            <span className="text-xs opacity-70 font-semibold text-gray-600">
              Away
            </span>
          </div>

          {game.status.type.state === "in" || game.status.type.completed ? (
            <div className="text-xl font-bold text-gray-900">
              {awayTeam?.score} - {homeTeam?.score}
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-800">@</span>
          )}

          <div className="flex flex-col items-center">
            <ImageWithLoading
              width={50}
              height={50}
              src={homeTeam?.team.logo || ""}
              className="object-contain"
              alt={homeTeam?.team.name || "Home team"}
            />
            <span className="text-sm font-bold text-center text-gray-900 w-24">
              {homeTeam?.team.name || "Home Team"}
            </span>
            <span className="text-xs opacity-70 font-semibold text-gray-600">
              Home
            </span>
          </div>
        </div>
      </div>

      <GameDetailModal
        game={game}
        isOpen={isModalOpen}
        activeLeague={activeLeague}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
