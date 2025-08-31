import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const LEAGUE_MAP: { [key: string]: string } = {
  MLB: "baseball/mlb",
  NFL: "football/nfl",
  NBA: "basketball/nba",
};

const LEAGUE_LOGOS: { [key: string]: string } = {
  NFL: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  NBA: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  MLB: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
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

interface ESPNResponse {
  events: ESPNGame[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { league: string; date: string } }
) {
  const { league, date } = params;

  if (!league || !date) {
    return NextResponse.json(
      { error: true, data: "Missing league or date" },
      { status: 400 }
    );
  }

  const leagueUpper = league.toUpperCase();
  const espnLeague = LEAGUE_MAP[leagueUpper];
  if (!espnLeague) {
    return NextResponse.json(
      { error: true, data: "League not found" },
      { status: 400 }
    );
  }

  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${espnLeague}/scoreboard?dates=${date.replace(/-/g, "")}`;
    const { data } = await axios.get<ESPNResponse>(url);

    const games = data.events.map((e: ESPNGame) => {
      const comp = e.competitions[0];
      const home = comp.competitors.find((c: ESPNTeam) => c.homeAway === "home");
      const away = comp.competitors.find((c: ESPNTeam) => c.homeAway === "away");

      if (!home || !away) {
        throw new Error("Home or away team not found");
      }

      return {
        id: e.id,
        status: comp.status.type.name,
        startTimeISO: e.date,
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
      data: { date, games, league: leagueUpper, logo: LEAGUE_LOGOS[leagueUpper] || "" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: true, data: "An error has occurred" }, { status: 500 });
  }
}