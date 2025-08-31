import GameCard from "./GameCard";
import { Game } from "../types/interfaces";

interface GamesGridProps {
  games: Game[];
}

export default function GamesGrid({ games }: GamesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
