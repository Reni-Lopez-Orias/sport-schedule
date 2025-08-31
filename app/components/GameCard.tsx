// app/components/GameCard.tsx
"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { Game } from "../types/interfaces";
import ImageWithLoading from "./ImageWithLoading";
import GameDetailModal from "./GameDetailModal";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-2 text-xs mb-2">
          <span className="font-bold text-gray-900">
            {new Date(game.startTimeISO).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="opacity-70 font-semibold text-gray-700">
            {game.venue}
          </span>
          <span className="ml-auto">
            <StatusBadge status={game.status} />
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col items-center">
            <ImageWithLoading
              alt="logo"
              width={50}
              height={50}
              src={game.away.logo}
            />
            <span className="text-sm font-bold text-center text-gray-900">
              {game.away.name}
            </span>
            <span className="text-xs opacity-70 font-semibold text-gray-600">
              Away
            </span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {game.away.score} - {game.home.score}
          </div>
          <div className="flex flex-col items-center">
            <ImageWithLoading
              alt="logo"
              width={50}
              height={50}
              src={game.home.logo}
            />
            <span className="text-sm font-bold text-center text-gray-900">
              {game.home.name}
            </span>
            <span className="text-xs opacity-70 font-semibold text-gray-600">
              Home
            </span>
          </div>
        </div>
      </div>

      <GameDetailModal
        game={game}
        gameId={game.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
