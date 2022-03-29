import type { Update } from "./types";
import { readable, derived } from "svelte/store";
import { updateURL } from "./config";

interface Updater {
  didUpdate: boolean;
  updating: boolean;
  lastUpdate: Update;
}

let updateTicker: ReturnType<typeof setTimeout>;
let updater: () => void;

const stop = () => clearTimeout(updateTicker);

// wait between updates in milliseconds
const intervalMin = 5e3;
const updateInterval = 60e3;

const load = (): Promise<Update> =>
  fetch(updateURL, { mode: "cors" }).then((r) => r.json() as unknown as Update);

const update = readable<Updater>(
  { updating: false, didUpdate: false } as Updater,
  (set) => {
    let state: Updater = {
      didUpdate: false,
      updating: false,
      lastUpdate: {} as any,
    } as Updater;

    updater = () => {
      if (state.updating) {
        return;
      }

      set((state = { ...state, updating: true }));

      load()
        .then((page) => {
          // Ignore stale updates
          if (state.didUpdate && page.updatedAt == state.lastUpdate.updatedAt) {
            return;
          }

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

          let interval = updateInterval;

          if (state.lastUpdate.nextUpdateAfter) {
            interval = Math.max(
              intervalMin,
              Math.min(
                Date.parse(state.lastUpdate.nextUpdateAfter) - Date.now(),
                interval
              )
            );
          }

          updateTicker = setTimeout(updater, interval);
        });
    };
  }
);

const withDefault =
  <T>(zero: T, f: (_: Update) => T) =>
  (u: Updater) => {
    if (!u.didUpdate) {
      return zero;
    }

    return f(u.lastUpdate);
  };

const offset = derived(
  update,
  withDefault(0, (u) => u.offset)
);

const stations = derived(
  update,
  withDefault(
    new Map<string, number>(),
    ({ stations }) => new Map<string, number>(Object.entries(stations))
  )
);

const departures = derived(
  update,
  withDefault([], ({ departures }) => departures)
);

const updatedAt = derived(
  update,
  withDefault(new Date(0), ({ updatedAt }) => new Date(updatedAt))
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
  stop,
};
