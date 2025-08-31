import GameCard from "./GameCard";

interface GamesGridProps {
  games: any[];
}

export default function GamesGrid({ games }: GamesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game: any) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}