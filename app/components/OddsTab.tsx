import { Odds, Team } from "../types/interfaces";

export function OddsTab({
  odds,
//   awayTeam,
//   homeTeam,
}: {
  odds: Odds[];
  awayTeam?: Team;
  homeTeam?: Team;
}) {
  if (odds.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 font-medium">No betting data available</p>
        <p className="text-gray-400 text-sm mt-1">
          Betting data will appear when available
        </p>
      </div>
    );
  }

  const normalizeOddsData = (odd: Odds) => {
    const hasMoneylineObject =
      odd.moneyline && typeof odd.moneyline === "object";
    const hasTeamOdds = odd.awayTeamOdds && odd.homeTeamOdds;
    const hasPointSpread = odd.pointSpread;
    const hasTotal = odd.total;
    const hasOverUnder = odd.overUnder !== undefined;

    if (hasMoneylineObject && hasPointSpread && hasTotal) {
      return {
        provider: odd.provider,
        moneyline: {
          away:
            odd.moneyline.away?.close?.odds || odd.moneyline.away?.open?.odds,
          home:
            odd.moneyline.home?.close?.odds || odd.moneyline.home?.open?.odds,
          draw:
            odd.moneyline.draw?.close?.odds || odd.moneyline.draw?.open?.odds,
        },
        spread: {
          away: odd.pointSpread.away?.close
            ? `${odd.pointSpread.away.close.line} (${odd.pointSpread.away.close.odds})`
            : odd.pointSpread.away?.open
            ? `${odd.pointSpread.away.open.line} (${odd.pointSpread.away.open.odds})`
            : null,
          home: odd.pointSpread.home?.close
            ? `${odd.pointSpread.home.close.line} (${odd.pointSpread.home.close.odds})`
            : odd.pointSpread.home?.open
            ? `${odd.pointSpread.home.open.line} (${odd.pointSpread.home.open.odds})`
            : null,
        },
        total: {
          over: odd.total.over?.close
            ? `${odd.total.over.close.line} (${odd.total.over.close.odds})`
            : odd.total.over?.open
            ? `${odd.total.over.open.line} (${odd.total.over.open.odds})`
            : null,
          under: odd.total.under?.close
            ? `${odd.total.under.close.line} (${odd.total.under.close.odds})`
            : odd.total.under?.open
            ? `${odd.total.under.open.line} (${odd.total.under.open.odds})`
            : null,
        },
        details: odd.details,
      };
    }

    if (hasTeamOdds) {
      return {
        provider: odd.provider,
        moneyline: {
          away:
            odd.awayTeamOdds.value ||
            odd.awayTeamOdds.summary ||
            odd.awayTeamOdds.moneyLine,
          home:
            odd.homeTeamOdds.value ||
            odd.homeTeamOdds.summary ||
            odd.homeTeamOdds.moneyLine,
          draw: odd.drawOdds?.value || odd.drawOdds?.summary,
        },
        spread: hasPointSpread
          ? {
              away: odd.pointSpread.away?.close
                ? `${odd.pointSpread.away.close.line} (${odd.pointSpread.away.close.odds})`
                : odd.pointSpread.away?.open
                ? `${odd.pointSpread.away.open.line} (${odd.pointSpread.away.open.odds})`
                : null,
              home: odd.pointSpread.home?.close
                ? `${odd.pointSpread.home.close.line} (${odd.pointSpread.home.close.odds})`
                : odd.pointSpread.home?.open
                ? `${odd.pointSpread.home.open.line} (${odd.pointSpread.home.open.odds})`
                : null,
            }
          : null,
        total: hasTotal
          ? {
              over: odd.total.over?.close
                ? `${odd.total.over.close.line} (${odd.total.over.close.odds})`
                : odd.total.over?.open
                ? `${odd.total.over.open.line} (${odd.total.over.open.odds})`
                : null,
              under: odd.total.under?.close
                ? `${odd.total.under.close.line} (${odd.total.under.close.odds})`
                : odd.total.under?.open
                ? `${odd.total.under.open.line} (${odd.total.under.open.odds})`
                : null,
            }
          : hasOverUnder
          ? {
              over: `O${odd.overUnder}`,
              under: `U${odd.overUnder}`,
            }
          : null,
        details: odd.details,
      };
    }

    if (hasMoneylineObject) {
      return {
        provider: odd.provider,
        moneyline: {
          away:
            odd.moneyline.away?.close?.odds || odd.moneyline.away?.open?.odds,
          home:
            odd.moneyline.home?.close?.odds || odd.moneyline.home?.open?.odds,
          draw:
            odd.moneyline.draw?.close?.odds || odd.moneyline.draw?.open?.odds,
        },
        spread: hasPointSpread
          ? {
              away: odd.pointSpread.away?.close
                ? `${odd.pointSpread.away.close.line} (${odd.pointSpread.away.close.odds})`
                : odd.pointSpread.away?.open
                ? `${odd.pointSpread.away.open.line} (${odd.pointSpread.away.open.odds})`
                : null,
              home: odd.pointSpread.home?.close
                ? `${odd.pointSpread.home.close.line} (${odd.pointSpread.home.close.odds})`
                : odd.pointSpread.home?.open
                ? `${odd.pointSpread.home.open.line} (${odd.pointSpread.home.open.odds})`
                : null,
            }
          : null,
        total: hasTotal
          ? {
              over: odd.total.over?.close
                ? `${odd.total.over.close.line} (${odd.total.over.close.odds})`
                : odd.total.over?.open
                ? `${odd.total.over.open.line} (${odd.total.over.open.odds})`
                : null,
              under: odd.total.under?.close
                ? `${odd.total.under.close.line} (${odd.total.under.close.odds})`
                : odd.total.under?.open
                ? `${odd.total.under.open.line} (${odd.total.under.open.odds})`
                : null,
            }
          : hasOverUnder
          ? {
              over: `O${odd.overUnder}`,
              under: `U${odd.overUnder}`,
            }
          : null,
        details: odd.details,
      };
    }

    return {
      provider: odd.provider,
      moneyline: null,
      spread: null,
      total: null,
      details: odd.details,
    };
  };

  const normalizedOdds = odds.map(normalizeOddsData);

  return (
    <div className="space-y-6">
      {/* Proveedores de apuestas */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">
          Betting Providers
        </h3>

        <div className="space-y-4">
          {normalizedOdds.map((odd, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center justify-center font-medium text-gray-800 mb-3">
                {odd.provider.name}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* Moneyline */}
                <div className="bg-white p-3 rounded-lg shadow-xs">
                  <h4 className="font-semibold text-gray-700 mb-2 text-center">
                    Moneyline
                  </h4>
                  <div className="space-y-2">
                    {odd.moneyline ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Away:</span>
                          <span className="font-bold text-gray-800">
                            {odd.moneyline.away || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Home:</span>
                          <span className="font-bold text-gray-800">
                            {odd.moneyline.home || "N/A"}
                          </span>
                        </div>
                        {odd.moneyline.draw && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Draw:</span>
                            <span className="font-bold text-gray-800">
                              {odd.moneyline.draw}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No moneyline data
                      </p>
                    )}
                  </div>
                </div>

                {/* Spread */}
                <div className="bg-white p-3 rounded-lg shadow-xs">
                  <h4 className="font-semibold text-gray-700 mb-2 text-center">
                    Spread
                  </h4>
                  <div className="space-y-2">
                    {odd.spread ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Away:</span>
                          <span className="font-bold text-gray-800">
                            {odd.spread.away || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Home:</span>
                          <span className="font-bold text-gray-800">
                            {odd.spread.home || "N/A"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No spread data
                      </p>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-white p-3 rounded-lg shadow-xs">
                  <h4 className="font-semibold text-gray-700 mb-2 text-center">
                    Total
                  </h4>
                  <div className="space-y-2">
                    {odd.total ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Over:</span>
                          <span className="font-bold text-gray-800">
                            {odd.total.over || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Under:</span>
                          <span className="font-bold text-gray-800">
                            {odd.total.under || "N/A"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center">No total data</p>
                    )}
                  </div>
                </div>
              </div>

              {odd.details && (
                <div className="mt-3 text-center text-xs text-gray-500">
                  {odd.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen comparativo */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-900">
          Odds Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Provider
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Away Win
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Home Win
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Draw
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {normalizedOdds.map((odd, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 font-medium">{odd.provider.name}</td>
                  <td className="px-4 py-2">
                    {odd.moneyline?.away ? (
                      <span className="font-bold">{odd.moneyline.away}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {odd.moneyline?.home ? (
                      <span className="font-bold">{odd.moneyline.home}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {odd.moneyline?.draw ? (
                      <span className="font-bold">{odd.moneyline.draw}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
