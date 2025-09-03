import GameCard from "./GameCard";
import { ESPNGame } from "../types/interfaces";

interface GamesGridProps {
  games: ESPNGame[];
  activeLeague: string;
}

export default function GamesGrid({ games, activeLeague }: GamesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} activeLeague={activeLeague} />
      ))}
    </div>
  );
}