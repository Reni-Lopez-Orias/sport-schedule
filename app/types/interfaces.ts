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

// types/game-detail.ts
export interface GameDetail {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status: {
    type: {
      name: string;
      state: string;
    };
    period: number;
    clock: number;
    displayClock: string;
  };
  competitions: Array<{
    competitors: Array<{
      id: string;
      homeAway: string;
      score: string;
      team: {
        logo: string;
        name: string;
        abbreviation: string;
      };
      records?: Array<{
        summary: string;
      }>;
    }>;
    venue: {
      fullName: string;
      address: {
        city: string;
        state: string;
      };
    };
    broadcasts?: Array<{
      names: string[];
    }>;
  }>;
  // ... más campos según lo que devuelva la API
}
