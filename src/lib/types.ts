type Mode = "B" | "T" | "M";

export interface Departure {
  dst: string;
  due: string;
  etd: string;
  srv: string;
  sta: string;
  mod: Mode;
}

export type Station = [boolean, number];

export interface Update {
  // sorted list of station [key, name] tuples
  names: Array<[string, string]>;
  departures: Departure[];
  // time offset used in departures query in minutes
  offset: number;
  // number of departures per station
  stations: { [k: string]: number };
  updatedAt: string;
  nextUpdateAfter: string;
}
