import {
  ESPNCalendarEvent,
  ESPNGame,
  ESPNLeague,
  ESPNLogo,
  ESPNSeason,
} from "@/app/types/interfaces";
import { NextRequest, NextResponse } from "next/server";

const LEAGUE_MAP: { [key: string]: string } = {
  NHL: "hockey/nhl",
  MLB: "baseball/mlb",
  NFL: "football/nfl",
  NBA: "basketball/nba",
  LALIGA: "soccer/esp.1",
  SERIEA: "soccer/ita.1",
  LIGUE1: "soccer/fra.1",
  BUNDESLIGA: "soccer/ger.1",
  PREMIERLEAGUE: "soccer/eng.1",
  CHAMPIONSLEAGUE: "soccer/uefa.champions",
  COLLEGEFOOTBALL: "football/college-football",
  COLLEGEBASKETBALL: "basketball/mens-college-basketball",
};

export interface ESPNResponse {
  events: ESPNGame[];
  leagues: ESPNLeague[];
}

export interface ResponseSportSchedule {
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
  games: ESPNGame[];
}

//#endregion

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ league: string; date: string }> }
) {
  const { league, date } = await params;

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
    const url = `https://site.api.espn.com/apis/site/v2/sports/${espnLeague}/scoreboard?dates=${date.replace(
      /-/g,
      ""
    )}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ESPNResponse = await response.json();
    const games = data.events;
    const league = data.leagues[0];

    const responseSportSchedule: ResponseSportSchedule = {
      games: games,
      id: league.id,
      uid: league.uid,
      name: league.name,
      slug: league.slug,
      logos: league.logos,
      season: league.season,
      calendar: league.calendar,
      abbreviation: league.abbreviation,
      calendarType: league.calendarType,
      calendarEndDate: league.calendarEndDate,
      calendarStartDate: league.calendarStartDate,
      calendarIsWhitelist: league.calendarIsWhitelist,
    };

    return NextResponse.json({
      error: false,
      data: responseSportSchedule,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: true, data: "An error has occurred" },
      { status: 500 }
    );
  }
}
