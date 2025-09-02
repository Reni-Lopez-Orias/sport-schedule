import { NextRequest, NextResponse } from "next/server";

const LEAGUE_MAP: { [key: string]: string } = {
  MLB: "baseball/mlb",
  NFL: "football/nfl",
  COLLEGEFOOTBALL: "football/college-football",
  NBA: "basketball/nba",
  COLLEGEBASKETBALL: "basketball/mens-college-basketball",
  NHL: "hockey/nhl",
};

interface ESPNTeam {
  score: string;
  team: {
    logo: string;
    displayName: string;
    abbreviation: string;
  };
  homeAway: string;
}

interface ESPNCompetition {
  competitors: ESPNTeam[];
  status: {
    type: {
      name: string;
    };
  };
  venue?: {
    fullName: string;
  };
}

interface ESPNGame {
  id: string;
  date: string;
  competitions: ESPNCompetition[];
}

// types/espn.interfaces.ts

export interface ESPNSeason {
  year: number;
  startDate: string;
  endDate: string;
  type: {
    id: number;
    name: string;
    abbreviation: string;
  };
}

export interface ESPNLogo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
  lastUpdated?: string;
}

export interface ESPNCalendarEvent {
  label: string;
  startDate: string;
  endDate: string;
  seasonType?: {
    id: number;
    name: string;
    abbreviation: string;
  };
}

export interface ESPNLeague {
  id: string;
  uid: string;
  name: string;
  abbreviation: string;
  slug: string;
  season: ESPNSeason;
  logos: ESPNLogo[];
  calendarType: "day" | "week" | "month" | "year";
  calendarIsWhitelist: boolean;
  calendarStartDate: string;
  calendarEndDate: string;
  calendar: ESPNCalendarEvent[];
}

export interface ESPNLeaguesResponse {
  leagues: ESPNLeague[];
  events?: ESPNGame[]; // Puedes tipar esto más específicamente si necesitas
}

interface ESPNResponse {
  events: ESPNGame[];
  leagues: ESPNLeague[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ league: string; date: string }> }
) {
  // 🔹 AWAIT los parámetros (esto es nuevo en Next.js 15)
  const { league, date } = await params;

  if (!league || !date) {
    return NextResponse.json(
      { error: true, data: "Missing league or date" },
      { status: 400 }
    );
  }

  const leagueUpper = league.toUpperCase();
  const espnLeague = LEAGUE_MAP[leagueUpper];
  console.log("liga que llega: ", leagueUpper);

  console.log("liga buscada", espnLeague);

  if (!espnLeague) {
    return NextResponse.json(
      { error: true, data: "League not found" },
      { status: 400 }
    );
  }

  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${espnLeague}/scoreboard?dates=${date.replace(
      /-/g,
      ""
    )}`;

    // Reemplazar axios con fetch
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ESPNResponse = await response.json();

    const games = data.events.map((e: ESPNGame) => {
      const comp = e.competitions[0];
      const home = comp.competitors.find(
        (c: ESPNTeam) => c.homeAway === "home"
      );
      const away = comp.competitors.find(
        (c: ESPNTeam) => c.homeAway === "away"
      );

      if (!home || !away) {
        throw new Error("Home or away team not found");
      }

      return {
        id: e.id,
        status: comp.status.type.name,
        startTimeISO: e.date,
        league: leagueUpper,
        league_logo: data.leagues[0].logos || "",
        venue: comp.venue?.fullName || "",
        home: {
          score: home.score,
          logo: home.team.logo || "",
          name: home.team.displayName,
          abbr: home.team.abbreviation,
        },
        away: {
          score: away.score,
          logo: away.team.logo || "",
          name: away.team.displayName,
          abbr: away.team.abbreviation,
        },
      };
    });

    return NextResponse.json({
      error: false,
      data: {
        date,
        games,
        league: leagueUpper,
        league_logo: data.leagues[0].logos || "",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: true, data: "An error has occurred" },
      { status: 500 }
    );
  }
}