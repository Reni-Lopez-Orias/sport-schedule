export interface BaseResponseSportSchedule<T> {
  error: boolean;
  data: T;
}

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

export interface BaseLeague {
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

// export interface ESPNSeason {
//   year: number;
//   type: number;
//   slug: string;
// }

export interface ESPNLogo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
  lastUpdated: string;
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

export interface ESPNCompetition {
  id: string;
  uid: string;
  date: string;
  attendance: number;
  type: CompetitionType;
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  playByPlayAvailable: boolean;
  recent: boolean;
  wasSuspended: boolean;
  venue: Venue;
  competitors: Competitor[];
  status: Status;
  broadcasts: Broadcast[];
  format: Format;
  tickets: Ticket[];
  startDate: string;
  broadcast: string;
  geoBroadcasts: GeoBroadcast[];
  odds: Odds[];
  headlines: Headline[];
  // highlights: any[];
}

interface Format {
  regulation: Regulation;
}

interface Regulation {
  periods: number;
}

interface Ticket {
  summary: string;
  numberAvailable: number;
  links: TicketLink[];
}

interface TicketLink {
  href: string;
}

interface Market {
  id: string;
  type: string;
}

interface GeoBroadcast {
  type: GeoBroadcastType;
  market: Market;
  media: Media;
  lang: string;
  region: string;
}

interface Media {
  shortName: string;
}

// Interfaz para odds/apuestas
export interface Odds {
  provider: Provider;
  details: string;
  overUnder: number;
  spread: number;
  awayTeamOdds: TeamOdds;
  homeTeamOdds: TeamOdds;
  links: Link[];
  featuredBets: FeaturedBet[];
  moneyline: Moneyline;
  pointSpread: PointSpread;
  total: Total;
  link: Link;
  header: Header;
}

interface Provider {
  id: string;
  name: string;
  priority: number;
  logos: Logo[];
}

interface Logo {
  href: string;
  rel: string[];
}

export interface Tags {
  league: string;
  sport: string;
  gameId: number;
  betSide?: string;
  betType?: string;
  betDetails?: string;
}

export interface TeamReference {
  id: string;
}

interface TeamOdds {
  favorite: boolean;
  underdog: boolean;
  moneyLine: number;
  close: Close;
  team: TeamReference;
  favoriteAtOpen: boolean;
}

interface Close {
  pointSpread: PointSpreadDetail;
}

interface PointSpreadDetail {
  value?: number;
  alternateDisplayValue: string;
  decimal?: number;
  american: string;
}

interface FeaturedBet {
  id: string;
  displayName: string;
  type: string;
  odds: string;
  url: string;
  startTime: string;
  payoutText: string;
  locations?: string[];
  displayOrder?: number;
  legCount: number;
  events: FeaturedBetEvent[];
}

interface FeaturedBetEvent {
  displayName: string;
  legs: Leg[];
}

interface Leg {
  marketId: string;
  marketSelectionId: string;
  eventId: string;
  selectionText: string;
  type: string;
  startTime: string;
  marketText: string;
  icon: string;
  iconDark: string;
  url: string;
  link: Link;
}

interface Moneyline {
  displayName: string;
  shortDisplayName: string;
  home: MoneylineSide;
  away: MoneylineSide;
}

interface MoneylineSide {
  close: MoneylineClose;
  open: MoneylineOpen;
}

// Interfaz para cierre de línea de dinero
interface MoneylineClose {
  odds: string;
  link: Link;
}

interface MoneylineOpen {
  odds: string;
}

interface PointSpread {
  displayName: string;
  shortDisplayName: string;
  home: PointSpreadSide;
  away: PointSpreadSide;
}

// Interfaz para lado de spread de puntos
interface PointSpreadSide {
  close: PointSpreadClose;
  open: PointSpreadOpen;
}

interface PointSpreadClose {
  line: string;
  odds: string;
  link: Link;
}

// Interfaz para apertura de spread de puntos
interface PointSpreadOpen {
  line: string;
  odds: string;
}

interface Total {
  displayName: string;
  shortDisplayName: string;
  over: TotalSide;
  under: TotalSide;
}

// Interfaz para lado de total
interface TotalSide {
  close: TotalClose;
  open: TotalOpen;
}

interface TotalClose {
  line: string;
  odds: string;
  link: Link;
}

// Interfaz para apertura de total
interface TotalOpen {
  line: string;
  odds: string;
}

// Interfaz para encabezado
interface Header {
  logo: HeaderLogo;
  text: string;
}

// Interfaz para logo de encabezado
interface HeaderLogo {
  dark: string;
  light: string;
  exclusivesLogoDark: string;
  exclusivesLogoLight: string;
}

// Interfaz para titular
interface Headline {
  type: string;
  description: string;
  shortLinkText: string;
}

interface GeoBroadcastType {
  id: string;
  shortName: string;
}

interface Weather {
  displayValue: string;
  temperature: number;
  highTemperature: number;
  conditionId: string;
  link: Link;
}

export interface ESPNGame {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  season: ESPNSeason;
  competitions: ESPNCompetition[];
  links: Link[];
  weather: Weather;
  status: Status;
}

interface Status {
  clock: number;
  displayClock: string;
  period: number;
  type: StatusType;
}

export interface Competition {
  id: string;
  uid: string;
  date: string;
  attendance: number;
  type: CompetitionType;
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  playByPlayAvailable: boolean;
  recent: boolean;
  wasSuspended: boolean;
  venue: Venue;
  competitors: Competitor[];
  status: GameStatus;
  broadcasts: Broadcast[];
  startDate: string;
}

export interface CompetitionType {
  id: string;
  abbreviation: string;
}

export interface Venue {
  id: string;
  fullName: string;
  address: Address;
  indoor: boolean;
}

export interface Address {
  city: string;
  state: string;
}

export interface Competitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway: string;
  team: Team;
  score: string;
  records: Record[];
}

export interface Team {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  isActive: boolean;
  logo: string;
}

export interface Record {
  name: string;
  abbreviation: string;
  type: string;
  summary: string;
}

export interface GameStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: StatusType;
}

export interface StatusType {
  id: string;
  name: string;
  state: string;
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export interface Broadcast {
  market: string;
  names: string[];
}

export interface Link {
  language: string;
  rel: string[];
  href: string;
  text: string;
  shortText: string;
  isExternal: boolean;
  isPremium: boolean;
}

export interface LeagueLoading {
  [key: string]: boolean;
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
