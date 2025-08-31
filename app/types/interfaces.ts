// types/interfaces.ts
export interface Team {
  score: string;
  logo: string;
  name: string;
  abbr: string;
}

export interface Game {
  id: string;
  status: string;
  startTimeISO: string;
  venue: string;
  home: Team;
  away: Team;
}

export interface GamesData {
  [league: string]: Game[];
}

export interface LeagueLoading {
  [league: string]: boolean;
}