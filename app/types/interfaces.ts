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
  league: string;
  league_logo: string;
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

// Agregar estas interfaces nuevas
export interface ProbablePitcher {
  id: string;
  displayName: string;
  era: string;
  wins: number;
  losses: number;
  strikeouts: number;
}

export interface OddsInfo {
  provider: {
    id: string;
    name: string;
  };
  details: string;
  overUnder: number;
  moneyLineAway: number;
  moneyLineHome: number;
}

export interface ProbabilityInfo {
  homeWinPercentage: number;
  awayWinPercentage: number;
}

export interface SeriesInfo {
  current: {
    summary: string;
    wins: {
      home: number;
      away: number;
    };
  };
  season: {
    summary: string;
    wins: {
      home: number;
      away: number;
    };
  };
}

export interface GameDetail {
  $ref?: string;
  id: string;
  uid?: string;
  date: string;
  name: string;
  shortName: string;
  season?: {
    $ref: string;
  };
  seasonType?: {
    $ref: string;
  };
  timeValid?: boolean;
  competitions: Array<{
    $ref?: string;
    id: string;
    guid?: string;
    uid?: string;
    date: string;
    timeOfDay?: string;
    attendance?: number;
    type?: {
      id: string;
      text: string;
      abbreviation: string;
      slug: string;
      type: string;
    };
    duration?: {
      displayValue: string;
    };
    necessary?: boolean;
    timeValid?: boolean;
    neutralSite?: boolean;
    divisionCompetition?: boolean;
    conferenceCompetition?: boolean;
    previewAvailable?: boolean;
    recapAvailable?: boolean;
    boxscoreAvailable?: boolean;
    lineupAvailable?: boolean;
    gamecastAvailable?: boolean;
    playByPlayAvailable?: boolean;
    conversationAvailable?: boolean;
    commentaryAvailable?: boolean;
    pickcenterAvailable?: boolean;
    summaryAvailable?: boolean;
    liveAvailable?: boolean;
    ticketsAvailable?: boolean;
    shotChartAvailable?: boolean;
    timeoutsAvailable?: boolean;
    possessionArrowAvailable?: boolean;
    onWatchESPN?: boolean;
    recent?: boolean;
    wasSuspended?: boolean;
    bracketAvailable?: boolean;
    wallclockAvailable?: boolean;
    highlightsAvailable?: boolean;
    gameSource?: {
      id: string;
      description: string;
      state: string;
    };
    boxscoreSource?: {
      id: string;
      description: string;
      state: string;
    };
    playByPlaySource?: {
      id: string;
      description: string;
      state: string;
    };
    linescoreSource?: {
      id: string;
      description: string;
      state: string;
    };
    statsSource?: {
      id: string;
      description: string;
      state: string;
    };
    venue: {
      fullName: string;
      address: {
        city: string;
        state: string;
      };
    };
    weather?: {
      $ref: string;
      type: string;
      displayValue: string;
      zipCode: string;
      lastUpdated: string;
      windSpeed: number;
      windDirection: string;
      temperature: number;
      highTemperature: number;
      lowTemperature: number;
      conditionId: string;
      gust: number;
      precipitation: number;
      link: {
        language: string;
        rel: string[];
        href: string;
        text: string;
        shortText: string;
        isExternal: boolean;
        isPremium: boolean;
      };
    };
    competitors: Array<{
      id: string;
      homeAway: string;
      score: string;
      team: {
        logo: string;
        name: string;
        abbreviation: string;
      };
      records: Array<{
        summary: string;
      }>;
      probables?: Array<{
        name: string;
        displayName: string;
        shortDisplayName: string;
        abbreviation: string;
        playerId: number;
        athlete: {
          $ref: string;
        };
        statistics: {
          $ref: string;
        };
      }>;
    }>;
    // notes?: any[];
    situation?: {
      $ref: string;
    };
    status: {
      $ref?: string;
      type: {
        name: string;
        state: string;
      };
      period: number;
      clock: number;
      displayClock: string;
    };
    odds?: {
      $ref: string;
    };
    broadcasts: Array<{
      names: string[];
    }>;
    seriesId?: string;
    series?: Array<{
      type: string;
      title: string;
      description: string;
      summary: string;
      completed: boolean;
      totalCompetitions: number;
      competitors: Array<{
        id: string;
        uid: string;
        wins: number;
        ties: number;
        team: {
          $ref: string;
        };
      }>;
      events: Array<{
        $ref: string;
      }>;
      startDate: string;
    }>;
    tickets?: {
      $ref: string;
    };
    officials?: {
      $ref: string;
    };
    details?: {
      $ref: string;
    };
    leaders?: {
      $ref: string;
    };
    links?: Array<{
      language: string;
      rel: string[];
      href: string;
      text: string;
      shortText: string;
      isExternal: boolean;
      isPremium: boolean;
    }>;
    predictor?: {
      $ref: string;
    };
    probabilities?: {
      $ref: string;
    };
    dataFormat?: string;
    powerIndexes?: {
      $ref: string;
    };
    format?: {
      regulation: {
        periods: number;
        displayName: string;
        slug: string;
      };
    };
  }>;
  links?: Array<{
    language: string;
    rel: string[];
    href: string;
    text: string;
    shortText: string;
    isExternal: boolean;
    isPremium: boolean;
  }>;
  venues?: Array<{
    $ref: string;
  }>;
  weather?: {
    $ref: string;
    type: string;
    displayValue: string;
    zipCode: string;
    lastUpdated: string;
    windSpeed: number;
    windDirection: string;
    temperature: number;
    highTemperature: number;
    lowTemperature: number;
    conditionId: string;
    gust: number;
    precipitation: number;
    link: {
      language: string;
      rel: string[];
      href: string;
      text: string;
      shortText: string;
      isExternal: boolean;
      isPremium: boolean;
    };
  };
  league?: {
    $ref: string;
  };
  status: {
    type: {
      name: string;
      state: string;
    };
    period: number;
    clock: number;
    displayClock: string;
  };
  // Campos procesados adicionales
  odds?: OddsInfo[];
  probabilities?: ProbabilityInfo;
  probables?: {
    home: ProbablePitcher;
    away: ProbablePitcher;
  };
  series?: SeriesInfo;

  // boxscore?: any;
  // leaders?: any;
  // news?: any;
}

// Agrega esta interfaz en tus tipos/interfaces.ts o en este mismo archivo
export interface BettingOdd {
  provider?: {
    id: string;
    name: string;
  };
  details: string;
  overUnder: number;
  moneyLineAway: number;
  moneyLineHome: number;
}

export interface ProbablePitcher {
  id: string;
  displayName: string;
  era: string;
  wins: number;
  losses: number;
  strikeouts: number;
}

export interface OddsInfo {
  provider: {
    id: string;
    name: string;
  };
  details: string;
  overUnder: number;
  moneyLineAway: number;
  moneyLineHome: number;
}

export interface ProbabilityInfo {
  homeWinPercentage: number;
  awayWinPercentage: number;
}

export interface SeriesInfo {
  current: {
    summary: string;
    wins: {
      home: number;
      away: number;
    };
  };
  season: {
    summary: string;
    wins: {
      home: number;
      away: number;
    };
  };
}