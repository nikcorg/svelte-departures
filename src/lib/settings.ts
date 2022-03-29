import { tap } from "lodash/fp";
import { writable } from "svelte/store";

const displayKey = "__display";

const { set, subscribe, update } = writable(new Map<string, boolean>());

// the subscribable
export const display = { subscribe };

const persist = tap((state: Map<string, boolean>) => {
  try {
    localStorage.setItem(displayKey, JSON.stringify([...state.entries()]));
  } catch {}
});

// reset to the persisted state or the default state
export const reset = () => {
  try {
    set(new Map(JSON.parse(localStorage.getItem(displayKey) ?? "[]")));
  } catch {}
};

// toggle the value for station
export const toggle = (station: string) =>
  update((x) => persist(x.set(station, !(x.get(station) ?? true))));

// Set if Not eXists
export const setnx = (station: string, v: boolean) =>
  update((x) => persist(x.set(station, x.get(station) ?? v)));
