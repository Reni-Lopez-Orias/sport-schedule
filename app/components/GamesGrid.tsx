import { Game } from "../types/interfaces";
import GameCard from "./GameCard";

interface GamesGridProps {
  games: Game[];
}

export default function GamesGrid({ games }: GamesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game: Game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}