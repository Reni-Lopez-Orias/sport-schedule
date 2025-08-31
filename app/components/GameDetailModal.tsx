// app/components/GameDetailModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "../types/interfaces";

interface GameDetail {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status: {
    type: {
      name: string;
      state: string;
    };
    period: number;
    clock: number;
    displayClock: string;
  };
  competitions: Array<{
    competitors: Array<{
      id: string;
      homeAway: string;
      score: string;
      team: {
        logo: string;
        name: string;
        abbreviation: string;
      };
      records: Array<{
        summary: string;
      }>;
    }>;
    venue: {
      fullName: string;
      address: {
        city: string;
        state: string;
      };
    };
    broadcasts: Array<{
      names: string[];
    }>;
  }>;
  boxscore: {
    players: Array<{
      team: {
        id: string;
      };
      statistics: Array<{
        name: string;
        athletes: Array<{
          athlete: {
            displayName: string;
          };
          stats: string[];
        }>;
      }>;
    }>;
  };
  leaders?: Array<{
    name: string;
    leaders: Array<{
      displayValue: string;
      athlete: {
        displayName: string;
      };
      team: {
        abbreviation: string;
      };
    }>;
  }>;
  news?: Array<{
    headline: string;
    description: string;
    images: Array<{
      url: string;
    }>;
  }>;
}

interface GameDetailModalProps {
  game: Game;
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameDetailModal({
  gameId,
  isOpen,
  onClose,
}: GameDetailModalProps) {
  const [gameDetails, setGameDetails] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    if (isOpen && gameId) {
      fetchGameDetails();
    }
  }, [isOpen, gameId]);

  // En GameDetailModal.tsx - actualiza la URL del fetch
  const fetchGameDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/games/detail/${gameId}`); // ← URL actualizada
      console.log(response);
      
      const data = await response.json();

      if (data.success) {
        setGameDetails(data.data);
      }
    } catch (error) {
      console.error("Error fetching game details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {loading ? "Cargando..." : gameDetails?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">Cargando detalles del juego...</div>
        ) : gameDetails ? (
          <div className="p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              {["summary", "stats", "news", "odds"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab === "summary" && "Resumen"}
                  {tab === "stats" && "Estadísticas"}
                  {tab === "news" && "Noticias"}
                  {tab === "odds" && "Apuestas"}
                </button>
              ))}
            </div>

            {/* Content based on active tab */}
            {activeTab === "summary" && (
              <SummaryTab gameDetails={gameDetails} />
            )}

            {activeTab === "stats" && <StatsTab gameDetails={gameDetails} />}

            {activeTab === "news" && <NewsTab gameDetails={gameDetails} />}

            {activeTab === "odds" && <OddsTab gameDetails={gameDetails} />}
          </div>
        ) : (
          <div className="p-8 text-center text-red-500">
            Error al cargar los detalles del juego
          </div>
        )}
      </div>
    </div>
  );
}

// Componentes para cada pestaña
function SummaryTab({ gameDetails }: { gameDetails: GameDetail }) {
  const competition = gameDetails.competitions[0];

  return (
    <div className="space-y-6">
      {/* Score and Teams */}
      <div className="grid grid-cols-3 items-center gap-6">
        {competition.competitors.map((team) => (
          <div key={team.id} className="text-center">
            <Image
              src={team.team.logo}
              alt={team.team.name}
              width={80}
              height={80}
              className="mx-auto"
            />
            <h3 className="font-bold text-lg mt-2">{team.team.name}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {team.score || "0"}
            </p>
            {team.records?.[0] && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {team.records[0].summary}
              </p>
            )}
          </div>
        ))}

        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {gameDetails.status.type.name}
          </div>
          {gameDetails.status.clock > 0 && (
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Q{gameDetails.status.period} - {gameDetails.status.displayClock}
            </div>
          )}
        </div>
      </div>

      {/* Game Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Estadio:</strong> {competition.venue.fullName}
        </div>
        <div>
          <strong>Ubicación:</strong> {competition.venue.address.city},{" "}
          {competition.venue.address.state}
        </div>
        <div>
          <strong>TV:</strong>{" "}
          {competition.broadcasts?.[0]?.names.join(", ") || "Por confirmar"}
        </div>
        <div>
          <strong>Hora:</strong> {new Date(gameDetails.date).toLocaleString()}
        </div>
      </div>

      {/* Game Leaders */}
      {gameDetails.leaders && (
        <div>
          <h4 className="font-bold mb-3">Líderes del Juego</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gameDetails.leaders.slice(0, 3).map((leader) => (
              <div
                key={leader.name}
                className="bg-gray-50 dark:bg-gray-700 p-3 rounded"
              >
                <strong className="text-sm">{leader.name}:</strong>
                {leader.leaders.slice(0, 3).map((player, index) => (
                  <div key={index} className="text-xs mt-1">
                    {player.athlete.displayName} ({player.team.abbreviation}) -{" "}
                    {player.displayValue}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsTab({ gameDetails }: { gameDetails: GameDetail }) {
  // Implementar estadísticas detalladas
  return <div>Estadísticas detalladas...</div>;
}

function NewsTab({ gameDetails }: { gameDetails: GameDetail }) {
  // Implementar noticias
  return <div>Noticias del juego...</div>;
}

function OddsTab({ gameDetails }: { gameDetails: GameDetail }) {
  // Implementar odds de apuestas
  return <div>Líneas de apuestas...</div>;
}
