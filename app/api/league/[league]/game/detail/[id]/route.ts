import { NextRequest, NextResponse } from "next/server";

// Mapeo de ligas
const LEAGUE_MAP: { [key: string]: string } = {
  MLB: "baseball/leagues/mlb",
  NFL: "football/leagues/nfl",
  NBA: "basketball/leagues/nba",
  NHL: "hockey/leagues/nhl",
  COLLEGEFOOTBALL: "football/college-football",
  CollegeBasketball: "basketball/mens-college-basketball",
};

// Interfaces para los tipos de datos
interface ESPNRef {
  $ref: string;
}

interface ESPNCompetitor {
  id: string;
  homeAway: string;
  score?: string | { displayValue: string };
  team?: ESPNRef | { logo: string; displayName: string; abbreviation: string };
  records?: Array<{ summary: string | { displayValue: string } }>;
  probables?: Array<{ athlete?: ESPNRef; playerId?: string }>;
}

interface ESPNCompetition {
  competitors?: ESPNCompetitor[];
  broadcasts?: ESPNRef | Array<{ names: string[]; shortName?: string }>;
  venue?:
    | ESPNRef
    | { fullName: string; address?: { city: string; state: string } };
  status?:
    | ESPNRef
    | {
        type: { name: string; state: string };
        period: number;
        clock: number;
        displayClock: string;
      };
  odds?: ESPNRef;
  probabilities?: ESPNRef;
  series?:
    | ESPNRef
    | Array<{
        type: string;
        summary: string;
        competitors?: Array<{ id: string; wins: number }>;
      }>;
  attendance?: number;
}

interface ESPNData {
  competitions?: ESPNCompetitor[];
  [key: string]: unknown;
}

interface ESPNTeamInfo {
  logo: string;
  displayName: string;
  abbreviation: string;
}

interface ESPNStatus {
  type: { name: string; state: string };
  period: number;
  clock: number;
  displayClock: string;
}

interface ESPNVenue {
  fullName: string;
  address?: { city: string; state: string };
}

interface ESPNBroadcast {
  names: string[];
}

interface ESPNOddsItem {
  provider?: { id: string; name: string };
  details: string;
  overUnder: number;
  awayMoneyLine: number;
  homeMoneyLine: number;
}

interface ESPNProbabilities {
  homeWinPercentage: number;
  awayWinPercentage: number;
}

interface ESPNPitcherData {
  fullName?: string;
  statistics?: {
    eras?: string | number;
    wins?: number;
    losses?: number;
    strikeouts?: number;
  };
}

interface ESPNSeriesItem {
  type: string;
  summary: string;
  competitors?: Array<{ id: string; wins: number }>;
}

// Función auxiliar para hacer fetch con manejo de errores
async function fetchWithErrorHandling(url: string, errorMessage: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`${errorMessage}: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return null;
  }
}

// Función para extraer valores de objetos anidados de ESPN
const extractValue = (obj: unknown, defaultValue: unknown = null): unknown => {
  if (!obj) return defaultValue;
  if (typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    if (record.displayValue !== undefined) return record.displayValue;
    if (record.value !== undefined) return record.value;
    if (record.name !== undefined) return record.name;
    if (record.$ref !== undefined) return defaultValue;
  }
  return obj !== undefined ? obj : defaultValue;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; league: string }> }
) {
  try {
    const { id, league } = await params;

    if (!league) {
      return NextResponse.json(
        { success: false, error: "Missing league parameter" },
        { status: 400 }
      );
    }

    const leagueUpper = league.toUpperCase();
    const espnLeague = LEAGUE_MAP[league];

    if (!espnLeague) {
      return NextResponse.json(
        { success: false, error: "League not found. Use NFL, NBA, or MLB" },
        { status: 400 }
      );
    }

    // URL dinámica para cualquier liga
    const response = await fetch(
      `https://sports.core.api.espn.com/v2/sports/${espnLeague}/events/${id}?lang=en&region=us`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch game details. Status: ${response.status}`
      );
    }

    const data: ESPNData = await response.json();

    // Si no hay competitions, devolver solo los datos básicos
    if (!data.competitions || data.competitions.length === 0) {
      return NextResponse.json({
        success: true,
        data: data,
        league: leagueUpper,
      });
    }

    // Necesitamos hacer fetch a la URL de competitions para obtener los datos completos
    const competitionResponse = await fetchWithErrorHandling(
      (data.competitions[0] as unknown as ESPNRef).$ref,
      "Error fetching competition details"
    );

    if (!competitionResponse) {
      return NextResponse.json({
        success: true,
        data: data,
        league: leagueUpper,
      });
    }

    const competition: ESPNCompetition = competitionResponse;
    const homeTeam = competition.competitors?.find(
      (c: ESPNCompetitor) => c.homeAway === "home"
    );
    const awayTeam = competition.competitors?.find(
      (c: ESPNCompetitor) => c.homeAway === "away"
    );

    // Procesar datos básicos para extraer valores correctamente
    const processCompetitor = async (competitor: ESPNCompetitor) => {
      let teamData = {
        logo: "",
        name: "Team",
        abbreviation: "TMD",
      };

      // Si el equipo tiene $ref, hacer fetch para obtener datos reales
      if ((competitor.team as ESPNRef)?.$ref) {
        try {
          const teamResponse = await fetch((competitor.team as ESPNRef).$ref);
          if (teamResponse.ok) {
            const teamInfo: ESPNTeamInfo = await teamResponse.json();
            teamData = {
              logo: teamInfo.logo || "",
              name: teamInfo.displayName || "Team",
              abbreviation: teamInfo.abbreviation || "TMD",
            };
          }
        } catch (error) {
          console.error("Error fetching team data:", error);
        }
      } else if (
        competitor.team &&
        typeof competitor.team === "object" &&
        !("$ref" in competitor.team)
      ) {
        // Si ya tenemos los datos del equipo
        const teamInfo = competitor.team as ESPNTeamInfo;
        teamData = {
          logo: teamInfo.logo || "",
          name: teamInfo.displayName || "Team",
          abbreviation: teamInfo.abbreviation || "TMD",
        };
      }

      const records: Array<{ summary: string }> =
        competitor.records && competitor.records.length > 0
          ? competitor.records.map((record) => ({
              summary: extractValue(record.summary, "0-0") as string,
            }))
          : [{ summary: "0-0" }];

      return {
        id: competitor.id,
        homeAway: competitor.homeAway,
        score: extractValue(competitor.score, "0") as string,
        team: teamData,
        records: records,
      };
    };

    // Procesar todos los competidores en paralelo
    const processedCompetitors = competition.competitors
      ? await Promise.all(competition.competitors.map(processCompetitor))
      : [];

    // Procesar broadcasts
    let processedBroadcasts: ESPNBroadcast[] = [
      { names: ["No broadcast info"] },
    ];
    if ((competition.broadcasts as ESPNRef)?.$ref) {
      const broadcastsData = await fetchWithErrorHandling(
        (competition.broadcasts as ESPNRef).$ref,
        "Error fetching broadcasts"
      );
      if (broadcastsData && broadcastsData.items) {
        processedBroadcasts = broadcastsData.items.map(
          (item: { names?: string[]; shortName?: string }) => ({
            names: item.names || [item.shortName || "Unknown"],
          })
        );
      }
    } else if (Array.isArray(competition.broadcasts)) {
      processedBroadcasts = competition.broadcasts.map(
        (broadcast: { names?: string[]; shortName?: string }) => ({
          names: broadcast.names || [broadcast.shortName || "Unknown"],
        })
      );
    }

    // Procesar venue
    let processedVenue: ESPNVenue = {
      fullName: "Unknown Venue",
      address: { city: "Unknown", state: "Unknown" },
    };
    if ((competition.venue as ESPNRef)?.$ref) {
      const venueData = await fetchWithErrorHandling(
        (competition.venue as ESPNRef).$ref,
        "Error fetching venue"
      );
      if (venueData) {
        processedVenue = {
          fullName: extractValue(venueData.fullName, "Unknown Venue") as string,
          address: {
            city: extractValue(venueData.address?.city, "Unknown") as string,
            state: extractValue(venueData.address?.state, "Unknown") as string,
          },
        };
      }
    } else if (
      competition.venue &&
      typeof competition.venue === "object" &&
      !("$ref" in competition.venue)
    ) {
      processedVenue = {
        fullName: extractValue(
          (competition.venue as { fullName?: string }).fullName,
          "Unknown Venue"
        ) as string,
        address: {
          city: extractValue(
            (competition.venue as { address?: { city?: string } }).address
              ?.city,
            "Unknown"
          ) as string,
          state: extractValue(
            (competition.venue as { address?: { state?: string } }).address
              ?.state,
            "Unknown"
          ) as string,
        },
      };
    }

    // Procesar status
    let processedStatus: ESPNStatus = {
      type: { name: "Scheduled", state: "pre" },
      period: 0,
      clock: 0,
      displayClock: "0:00",
    };

    if (competition.status && !("$ref" in competition.status)) {
      processedStatus = {
        type: {
          name: extractValue(
            competition.status.type?.name,
            "Scheduled"
          ) as string,
          state: extractValue(competition.status.type?.state, "pre") as string,
        },
        period: extractValue(competition.status.period, 0) as number,
        clock: extractValue(competition.status.clock, 0) as number,
        displayClock: extractValue(
          competition.status.displayClock,
          "0:00"
        ) as string,
      };
    }

    // Si el status tiene $ref, intentar obtener los datos completos
    if ((competition.status as ESPNRef)?.$ref) {
      const statusData = await fetchWithErrorHandling(
        (competition.status as ESPNRef).$ref,
        "Error fetching status"
      );
      if (statusData) {
        processedStatus = {
          type: {
            name: extractValue(statusData.type?.name, "Scheduled") as string,
            state: extractValue(statusData.type?.state, "pre") as string,
          },
          period: extractValue(statusData.period, 0) as number,
          clock: extractValue(statusData.clock, 0) as number,
          displayClock: extractValue(statusData.displayClock, "0:00") as string,
        };
      }
    }

    const processedCompetition = {
      ...competition,
      competitors: processedCompetitors,
      venue: processedVenue,
      broadcasts: processedBroadcasts,
    };

    const processedData = {
      ...data,
      competitions: [processedCompetition],
      status: processedStatus,
    };

    // SOLICITUDES ADICIONALES PARA DATOS DE APUESTAS
    let oddsData: ESPNOddsItem[] = [];
    let probabilitiesData: {
      homeWinPercentage: number;
      awayWinPercentage: number;
    } | null = null;
    let probablesData: {
      home: {
        id?: string;
        displayName: string;
        era: string | number;
        wins: number;
        losses: number;
        strikeouts: number;
      };
      away: {
        id?: string;
        displayName: string;
        era: string | number;
        wins: number;
        losses: number;
        strikeouts: number;
      };
    } | null = null;
    let seriesData: {
      current: { summary: string; wins: { home: number; away: number } };
      season: { summary: string; wins: { home: number; away: number } };
    } | null = null;

    // 1. Obtener odds (apuestas)
    if ((competition.odds as ESPNRef)?.$ref) {
      const oddsResponse = await fetchWithErrorHandling(
        (competition.odds as ESPNRef).$ref,
        "Error fetching odds"
      );

      if (oddsResponse && oddsResponse.items) {
        oddsData = oddsResponse.items.map((item: ESPNOddsItem) => ({
          provider: {
            id: item.provider?.id || "unknown",
            name: item.provider?.name || "Unknown Provider",
          },
          details: item.details || "No details available",
          overUnder: item.overUnder || 0,
          moneyLineAway: item.awayMoneyLine || 0,
          moneyLineHome: item.homeMoneyLine || 0,
        }));
      }
    }

    // 2. Obtener probabilidades
    if ((competition.probabilities as ESPNRef)?.$ref) {
      const probabilitiesResponse = await fetchWithErrorHandling(
        (competition.probabilities as ESPNRef).$ref,
        "Error fetching probabilities"
      );

      if (probabilitiesResponse) {
        probabilitiesData = {
          homeWinPercentage: Math.round(
            ((probabilitiesResponse as ESPNProbabilities).homeWinPercentage ||
              0) * 100
          ),
          awayWinPercentage: Math.round(
            ((probabilitiesResponse as ESPNProbabilities).awayWinPercentage ||
              0) * 100
          ),
        };
      }
    }

    // 3. Procesar pitchers probables (solo para MLB)
    if (
      leagueUpper === "MLB" &&
      homeTeam?.probables?.[0] &&
      awayTeam?.probables?.[0]
    ) {
      try {
        // Obtener datos del pitcher local
        const homePitcherData: ESPNPitcherData | null = (
          homeTeam.probables[0].athlete as ESPNRef
        )?.$ref
          ? await fetchWithErrorHandling(
              (homeTeam.probables[0].athlete as ESPNRef).$ref,
              "Error fetching home pitcher data"
            )
          : null;

        // Obtener datos del pitcher visitante
        const awayPitcherData: ESPNPitcherData | null = (
          awayTeam.probables[0].athlete as ESPNRef
        )?.$ref
          ? await fetchWithErrorHandling(
              (awayTeam.probables[0].athlete as ESPNRef).$ref,
              "Error fetching away pitcher data"
            )
          : null;

        probablesData = {
          home: {
            id: homeTeam.probables[0].playerId,
            displayName: homePitcherData?.fullName || "To be confirmed",
            era: extractValue(homePitcherData?.statistics?.eras, "N/A") as
              | string
              | number,
            wins: extractValue(homePitcherData?.statistics?.wins, 0) as number,
            losses: extractValue(
              homePitcherData?.statistics?.losses,
              0
            ) as number,
            strikeouts: extractValue(
              homePitcherData?.statistics?.strikeouts,
              0
            ) as number,
          },
          away: {
            id: awayTeam.probables[0].playerId,
            displayName: awayPitcherData?.fullName || "To be confirmed",
            era: extractValue(awayPitcherData?.statistics?.eras, "N/A") as
              | string
              | number,
            wins: extractValue(awayPitcherData?.statistics?.wins, 0) as number,
            losses: extractValue(
              awayPitcherData?.statistics?.losses,
              0
            ) as number,
            strikeouts: extractValue(
              awayPitcherData?.statistics?.strikeouts,
              0
            ) as number,
          },
        };
      } catch (pitchError) {
        console.error("Error processing pitchers:", pitchError);
      }
    }

    // 4. Procesar datos de series
    if ((competition.series as ESPNRef)?.$ref) {
      const seriesResponse = await fetchWithErrorHandling(
        (competition.series as ESPNRef).$ref,
        "Error fetching series data"
      );

      if (seriesResponse && seriesResponse.items) {
        const currentSeries = seriesResponse.items.find(
          (s: ESPNSeriesItem) => s.type === "current"
        );
        const seasonSeries = seriesResponse.items.find(
          (s: ESPNSeriesItem) => s.type === "season"
        );

        seriesData = {
          current: {
            summary: currentSeries?.summary || "No current series data",
            wins: {
              home:
                currentSeries?.competitors?.find(
                  (c: { id: string }) => c.id === homeTeam?.id
                )?.wins || 0,
              away:
                currentSeries?.competitors?.find(
                  (c: { id: string }) => c.id === awayTeam?.id
                )?.wins || 0,
            },
          },
          season: {
            summary: seasonSeries?.summary || "No season series data",
            wins: {
              home:
                seasonSeries?.competitors?.find(
                  (c: { id: string }) => c.id === homeTeam?.id
                )?.wins || 0,
              away:
                seasonSeries?.competitors?.find(
                  (c: { id: string }) => c.id === awayTeam?.id
                )?.wins || 0,
            },
          },
        };
      }
    } else if (Array.isArray(competition.series)) {
      const currentSeries = competition.series.find(
        (s: ESPNSeriesItem) => s.type === "current"
      );
      const seasonSeries = competition.series.find(
        (s: ESPNSeriesItem) => s.type === "season"
      );

      seriesData = {
        current: {
          summary: currentSeries?.summary || "No current series data",
          wins: {
            home:
              currentSeries?.competitors?.find(
                (c: { id: string }) => c.id === homeTeam?.id
              )?.wins || 0,
            away:
              currentSeries?.competitors?.find(
                (c: { id: string }) => c.id === awayTeam?.id
              )?.wins || 0,
          },
        },
        season: {
          summary: seasonSeries?.summary || "No season series data",
          wins: {
            home:
              seasonSeries?.competitors?.find(
                (c: { id: string }) => c.id === homeTeam?.id
              )?.wins || 0,
            away:
              seasonSeries?.competitors?.find(
                (c: { id: string }) => c.id === awayTeam?.id
              )?.wins || 0,
          },
        },
      };
    }

    // Combinar todos los datos
    const enhancedData = {
      ...processedData,
      odds: oddsData,
      probabilities: probabilitiesData,
      probables: probablesData,
      series: seriesData,
    };

    return NextResponse.json({
      success: true,
      data: enhancedData,
      league: leagueUpper,
    });
  } catch (error) {
    console.error("Error fetching game details:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch game details",
      },
      { status: 500 }
    );
  }
}
