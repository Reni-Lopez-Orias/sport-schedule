import { Competitor, ESPNGame, Team } from "../types/interfaces";

export function AnalysisTab({
  gameDetails,
  awayTeam,
  homeTeam,
}: {
  gameDetails: ESPNGame;
  awayTeam?: Team;
  homeTeam?: Team;
}) {
  const awayCompetitor = gameDetails.competitions?.[0]?.competitors?.find(
    (c: Competitor) => c.homeAway === "away"
  );
  const homeCompetitor = gameDetails.competitions?.[0]?.competitors?.find(
    (c: Competitor) => c.homeAway === "home"
  );

  const awayRecord =
    awayCompetitor?.records?.find((r) => r.type === "total")?.summary || "0-0";
  const homeRecord =
    homeCompetitor?.records?.find((r) => r.type === "total")?.summary || "0-0";

  const [awayWins, awayLosses] = awayRecord.split("-").map(Number);
  const [homeWins, homeLosses] = homeRecord.split("-").map(Number);

  const awayWinPercentage = awayWins / (awayWins + awayLosses) || 0;
  const homeWinPercentage = homeWins / (homeWins + homeLosses) || 0;

  return (
    <div className="space-y-6">
      {/* Team analysis */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Team Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: awayTeam?.color
                ? `#${awayTeam.color}20`
                : "#eef2ff",
              borderLeft: awayTeam?.color
                ? `4px solid #${awayTeam.color}`
                : "4px solid #3b82f6",
            }}
          >
            <h4
              className="font-semibold mb-2"
              style={{
                color: awayTeam?.color ? `#${awayTeam.color}` : "#1e40af",
              }}
            >
              {awayTeam?.name}
            </h4>
            <div className="space-y-1 text-sm flex flex-col">
              <span className="font-semibold">
                Record: <span className="ps-1 font-bold">{awayRecord}</span>
              </span>
              <span className="font-semibold">
                Win percentage:
                <span className="ps-1 font-bold">
                  {(awayWinPercentage * 100).toFixed(1)}%
                </span>
              </span>
              <span className="font-semibold">
                Location:
                <span className="ps-1 font-bold">{awayTeam?.location}</span>
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: homeTeam?.color
                ? `#${homeTeam.color}20`
                : "#fef2f2",
              borderLeft: homeTeam?.color
                ? `4px solid #${homeTeam.color}`
                : "4px solid #dc2626",
            }}
          >
            <h4
              className="font-semibold mb-2"
              style={{
                color: homeTeam?.color ? `#${homeTeam.color}` : "#dc2626",
              }}
            >
              {homeTeam?.name}
            </h4>
            <div className="space-y-1 text-sm flex flex-col">
              <span className="font-semibold">
                Record: <span className="ps-1 font-bold">{homeRecord}</span>
              </span>
              <span className="font-semibold">
                Win percentage:
                <span className="ps-1 font-bold">
                  {(homeWinPercentage * 100).toFixed(1)}%
                </span>
              </span>
              <span className="font-semibold">
                Location:
                <span className="ps-1 font-bold">{homeTeam?.location}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Home advantage */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Home Advantage</h3>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Home court advantage:</span>
            <span className="font-bold text-lg">
              {homeWinPercentage > awayWinPercentage
                ? "Significant"
                : "Limited"}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${homeWinPercentage * 100}%`,
                backgroundColor: homeTeam?.color
                  ? `#${homeTeam.color}`
                  : "#3b82f6",
              }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500 text-right">
            {((homeWinPercentage - awayWinPercentage) * 100).toFixed(1)}%
            advantage
          </div>
        </div>
      </div>

      {/* Prediction based on records */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">
          Prediction Based on Records
        </h3>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor:
              homeWinPercentage > awayWinPercentage
                ? homeTeam?.color
                  ? `#${homeTeam.color}20`
                  : "#dcfce7"
                : awayTeam?.color
                ? `#${awayTeam.color}20`
                : "#dbeafe",
            borderLeft:
              homeWinPercentage > awayWinPercentage
                ? homeTeam?.color
                  ? `4px solid #${homeTeam.color}`
                  : "4px solid #16a34a"
                : awayTeam?.color
                ? `4px solid #${awayTeam.color}`
                : "4px solid #3b82f6",
          }}
        >
          <div
            className="font-bold text-lg mb-2"
            style={{
              color:
                homeWinPercentage > awayWinPercentage
                  ? homeTeam?.color
                    ? `#${homeTeam.color}`
                    : "#166534"
                  : awayTeam?.color
                  ? `#${awayTeam.color}`
                  : "#1e40af",
            }}
          >
            {homeWinPercentage > awayWinPercentage
              ? homeTeam?.name
              : awayTeam?.name}
          </div>
          <p>
            has a higher probability of winning based on current season records.
          </p>
        </div>
      </div>
    </div>
  );
}