export interface Departure {
  dst: string;
  due: string;
  etd: string;
  pla: string;
  sta: string;
}

export type Station = [boolean, number];

export interface Update {
  departures: Departure[];
  offset: number;
  stations: { [k: string]: number };
  updatedAt: string;
  nextUpdateAfter: string;
}
