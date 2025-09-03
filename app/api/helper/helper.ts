import { BaseLeague } from "@/app/types/interfaces";

export const safeGet = <T = unknown>(
  obj: unknown,
  path: string,
  defaultValue: T
): T => {
  if (!obj) return defaultValue;

  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;

    // Solo acceder si es un objeto
    if (typeof result === "object" && result !== null && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }

  return result !== undefined ? (result as T) : defaultValue;
};

export const createEmptyLeague = (
  leagueAbbr: string,
  date: string
): BaseLeague => {
  return {
    id: "",
    uid: "",
    name: leagueAbbr,
    abbreviation: leagueAbbr,
    slug: leagueAbbr.toLowerCase(),
    season: {
      year: new Date().getFullYear(),
      type: {
        id: 0,
        name: "",
        abbreviation: "",
      },
      // slug: "regular-season",
      startDate: date, // <- si ESPNSeason pide estas props
      endDate: date,
    },
    logos: [],
    calendarType: "day",
    calendarIsWhitelist: false,
    calendarStartDate: date,
    calendarEndDate: date,
    calendar: [],
    games: [],
  };
};
