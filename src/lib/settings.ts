import { tap } from "lodash/fp";
import { writable } from "svelte/store";

const storKey = "__display";

const { set, subscribe, update } = writable(new Map<string, boolean>());

// the subscribable
export const display = { subscribe };

const initialState = JSON.stringify([]);

const persist = tap((nextState: Map<string, boolean>) => {
  try {
    localStorage.setItem(storKey, JSON.stringify([...nextState.entries()]));
  } catch {}
});

// reset to the persisted state or the default state
export const reset = () => {
  try {
    set(new Map(JSON.parse(localStorage.getItem(storKey) ?? initialState)));
  } catch {}
};

// toggle the value for station
export const toggle = (station: string) =>
  update(currentState => persist(currentState.set(station, !(currentState.get(station) ?? true))));

// Set if Not eXists
export const setnx = (station: string, v: boolean) =>
  update(currentState => persist(currentState.set(station, currentState.get(station) ?? v)));
