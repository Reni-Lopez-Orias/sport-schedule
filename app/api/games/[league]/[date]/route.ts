import { NextResponse } from "next/server";
import axios from "axios";

const LEAGUE_MAP = {
  MLB: "baseball/mlb",
  NFL: "football/nfl",
  NBA: "basketball/nba",
};

const LEAGUE_LOGOS = {
  NFL: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  NBA: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  MLB: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
};

export async function GET(req, context) {
  // 🔹 await context.params
  const params = await context.params;
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
    const url = `https://site.api.espn.com/apis/site/v2/sports/${espnLeague}/scoreboard?dates=${date.replace(/-/g,"")}`;
    const { data } = await axios.get(url);

    const games = data.events.map(e => {
      const comp = e.competitions[0];
      const home = comp.competitors.find(c => c.homeAway === "home");
      const away = comp.competitors.find(c => c.homeAway === "away");

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
