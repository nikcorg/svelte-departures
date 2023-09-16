export interface Departure {
  dst: string;
  due: string;
  etd: string;
  // pla: string;
  srv: string;
  sta: string;
}

export type Station = [boolean, number];

export interface Update {
  departures: Departure[];
  // time offset used in departures query in minutes
  offset: number;
  // number of departures per station
  stations: { [k: string]: number };
  updatedAt: string;
  nextUpdateAfter: string;
}
