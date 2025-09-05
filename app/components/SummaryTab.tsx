import StatusBadge from "./StatusBadge";
import ImageWithLoading from "./ImageWithLoading";
import { Competition, Competitor, ESPNGame, Team } from "../types/interfaces";

export function SummaryTab({
  gameDetails,
  competition,
  activeLeague,
  awayTeam,
  homeTeam,
}: {
  gameDetails: ESPNGame;
  competition: Competition;
  activeLeague: string;
  awayTeam?: Team;
  homeTeam?: Team;
}) {
  const awayCompetitor = competition.competitors?.find(
    (c: Competitor) => c.homeAway === "away"
  );
  const homeCompetitor = competition.competitors?.find(
    (c: Competitor) => c.homeAway === "home"
  );

  const homeScore = homeCompetitor?.score || "0";
  const awayScore = awayCompetitor?.score || "0";

  const formatGameTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "To be confirmed";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Scoreboard */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="text-xs text-end text-gray-600 uppercase font-semibold mb-3">
          <StatusBadge status={gameDetails.status.type.name} />
        </div>
        <div className="grid grid-cols-3 items-center gap-2">
          {/* Away Team */}
          <div
            className="text-center p-3 rounded-lg"
            style={{
              backgroundColor: awayTeam?.color
                ? `#${awayTeam.color}10`
                : "transparent",
              border: awayTeam?.color
                ? `2px solid #${awayTeam.color}`
                : "2px solid #e5e7eb",
            }}
          >
            <div className="mx-auto mb-3 flex items-center justify-center">
              <ImageWithLoading
                alt="logo"
                height={70}
                width={70}
                src={awayTeam?.logo || ""}
              />
            </div>
            <h3 className="font-bold text-gray-900 text-sm break-words truncate sm:whitespace-normal">
              {awayTeam?.name || "Away Team"}
            </h3>
            <p className="text-xs text-gray-600">{awayTeam?.abbreviation}</p>
          </div>

          <div className="text-center bg-gray-100 rounded-lg p-2">
            {gameDetails.status.clock > 0 ? (
              <div className="text-center text-xl font-bold text-gray-900">
                {activeLeague === "NBA" || activeLeague === "COLLEGEBASKETBALL"
                  ? "Q"
                  : ""}
                {gameDetails.status.period} - {gameDetails.status.displayClock}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-600">
                {gameDetails.date
                  ? new Date(gameDetails.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Time TBD"}
              </div>
            )}
            {gameDetails.status.type.state === "in" ||
            gameDetails.status.type.completed ? (
              <div className="text-center text-xl font-bold text-gray-700">
                {awayScore} - {homeScore}
              </div>
            ) : (
              <span className="text-center text-xl font-bold text-gray-800">
                @
              </span>
            )}
          </div>

          {/* <div className="text-center">
          
          </div> */}

          {/* Home Team */}
          <div
            className="text-center p-3 rounded-lg"
            style={{
              backgroundColor: homeTeam?.color
                ? `#${homeTeam.color}10`
                : "transparent",
              border: homeTeam?.color
                ? `2px solid #${homeTeam.color}`
                : "2px solid #e5e7eb",
            }}
          >
            <div className="mx-auto mb-3 flex items-center justify-center">
              <ImageWithLoading
                alt="logo"
                width={70}
                height={70}
                src={homeTeam?.logo || ""}
              />
            </div>
            <h3 className="font-bold text-gray-900 text-sm break-words truncate sm:whitespace-normal">
              {homeTeam?.name || "Home Team"}
            </h3>
            <p className="text-xs text-gray-600">{homeTeam?.abbreviation}</p>
          </div>
        </div>
      </div>

      {/* Basic game information */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">
          Game Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <div className="text-gray-600">Venue</div>
            <div className="font-medium text-gray-900">
              {competition.venue?.fullName || "To be confirmed"}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-gray-600">Location</div>
            <div className="font-medium text-gray-900">
              {competition.venue?.address?.city || "City"},{" "}
              {competition.venue?.address?.state || "State"}
            </div>
          </div>

          {competition.broadcasts && competition.broadcasts.length > 0 && (
            <div className="flex flex-col">
              <div className="text-gray-600">Broadcast</div>
              <div className="font-medium text-gray-900">
                {competition.broadcasts[0]?.names?.join(", ") ||
                  "To be confirmed"}
              </div>
            </div>
          )}

          {gameDetails.date && (
            <div className="flex flex-col">
              <div className="text-gray-600">Date & Time</div>
              <div className="font-medium text-gray-900">
                {formatGameTime(gameDetails.date)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
