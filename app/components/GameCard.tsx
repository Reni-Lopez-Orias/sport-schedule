import Image from "next/image";
import StatusBadge from "./StatusBadge";

interface GameCardProps {
  game: any;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className="font-bold text-gray-900 dark:text-gray-100">
          {new Date(game.startTimeISO).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span className="opacity-70 font-semibold text-gray-700 dark:text-gray-300">
          {game.venue}
        </span>
        <span className="ml-auto">
          <StatusBadge status={game.status} />
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col items-center">
          <Image alt="logo" width={50} height={50} src={game.away.logo} />
          <span className="text-sm font-bold text-center text-gray-900 dark:text-gray-100">
            {game.away.name}
          </span>
          <span className="text-xs opacity-70 font-semibold text-gray-600 dark:text-gray-400">
            Away
          </span>
        </div>
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {game.away.score} - {game.home.score}
        </div>
        <div className="flex flex-col items-center">
          <Image alt="logo" width={50} height={50} src={game.home.logo} />
          <span className="text-sm font-bold text-center text-gray-900 dark:text-gray-100">
            {game.home.name}
          </span>
          <span className="text-xs opacity-70 font-semibold text-gray-600 dark:text-gray-400">
            Home
          </span>
        </div>
      </div>
    </div>
  );
}