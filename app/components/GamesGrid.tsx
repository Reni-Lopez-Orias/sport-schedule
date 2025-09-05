import { useEffect } from "react";
import GameCard from "./GameCard";
import { BaseLeague, ESPNGame } from "../types/interfaces";

interface GamesGridProps {
  leagues: Record<string, BaseLeague>;
  games: ESPNGame[];
  activeLeague: string;
}

export default function GamesGrid({
  games,
  activeLeague,
}: GamesGridProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeLeague]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.id} game={game} activeLeague={activeLeague} />
      ))}
    </div>
  );
}
