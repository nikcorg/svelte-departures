import type { Update } from "./types";
import { onDestroy } from "svelte";
import { readable, derived } from "svelte/store";

interface Updater {
  didUpdate: boolean;
  updating: boolean;
  lastUpdate: Update;
}

let updater: () => void;

const update = readable<Updater>(
  { updating: false, didUpdate: false } as Updater,
  (set) => {
    const updateIntervalMs = 30e3;
    const sourceURL = "https://nikc.kapsi.fi/departures/update.json";
    const load = (): Promise<Update> =>
      fetch(sourceURL).then((r) => r.json() as unknown as Update);

    let updateTicker: ReturnType<typeof setTimeout>;
    let state: Updater = {} as Updater;

    onDestroy(() => clearTimeout(updateTicker));

    updater = () => {
      if (state.updating) {
        return;
      }

      set((state = { ...state, updating: true }));
      load()
        .then((page) => {
          set(
            (state = {
              ...state,
              didUpdate: true,
              lastUpdate: page,
            })
          );
        })
        .finally(() => {
          set((state = { ...state, updating: false }));
          updateTicker = setTimeout(updater, updateIntervalMs);
        });
    };

    updater();
  }
);

const maybe =
  <T>(zero: T, f: (_: Update) => T) =>
  (u: Updater) => {
    if (!u.didUpdate) {
      return zero;
    }

    return f(u.lastUpdate);
  };

const offset = derived(
  update,
  maybe(0, (u) => u.offset)
);

const stations = derived(
  update,
  maybe(
    new Map<string, number>(),
    ({ stations }) => new Map<string, number>(Object.entries(stations))
  )
);

const departures = derived(
  update,
  maybe([], ({ departures }) => departures)
);

const updatedAt = derived(
  update,
  maybe(new Date(0), ({ updatedAt }) => new Date(updatedAt))
);

const didUpdate = derived(update, ({ didUpdate }) => didUpdate);
const updating = derived(update, ({ updating }) => updating);

export {
  departures,
  didUpdate,
  offset,
  stations,
  updatedAt,
  updating,
  updater,
};
