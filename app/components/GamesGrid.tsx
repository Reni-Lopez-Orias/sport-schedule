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
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.id} game={game} activeLeague={activeLeague} />
      ))}
    </div>
  );
}