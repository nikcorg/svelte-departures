import { derived, readable } from "svelte/store";
import { updateURL } from "./config";
import { fetchJSON } from "./fetchjson";
import type { Update } from "./types";
import { withRetries } from "./withretries";

interface Updater {
  updating: boolean;
  nextCheckAt: Date;
}

interface ZeroState extends Updater {
  lastUpdate: null;
}

interface UpdatedState extends Updater {
  lastUpdate: Update;
}

type UpdaterState = ZeroState | UpdatedState;

let updateTicker: ReturnType<typeof setTimeout>;

const stop = () => clearTimeout(updateTicker);

// wait between updates in milliseconds
const intervalMin = 5e3;
const updateIntervalMax = 300e3;

// retry config
const retryWait = 500;
const maxAttempts = 10;

const initialState: UpdaterState = { updating: false, nextCheckAt: new Date(), lastUpdate: null };
const update = readable<UpdaterState>(initialState, updateExternalState => {
  let internalState: UpdaterState = {
    ...initialState,
  };

  const updater = () => {
    if (internalState.updating) {
      return;
    }

    updateExternalState((internalState = { ...internalState, updating: true }));

    withRetries(retryWait, maxAttempts, () => fetchJSON<Update>(updateURL))
      .then(page => {
        // Ignore stale updates
        if (page.updatedAt == internalState.lastUpdate?.updatedAt) {
          return;
        }

        updateExternalState(
          (internalState = {
            ...internalState,
            lastUpdate: page,
          }),
        );
      })
      .finally(() => {
        let interval = updateIntervalMax;

        if (internalState.lastUpdate?.nextUpdateAfter) {
          interval = Math.max(
            intervalMin,
            Math.min(Date.parse(internalState.lastUpdate.nextUpdateAfter) - Date.now(), interval),
          );
        }

        updateExternalState(
          (internalState = {
            ...internalState,
            updating: false,
            nextCheckAt: new Date(Date.now() + interval),
          }),
        );

        updateTicker = setTimeout(updater, interval);
      });
  };

  updater();

  return stop;
});

const withDefault =
  <T>(zero: T, f: (_: Update) => T) =>
  (u: UpdaterState) => {
    if (!u.lastUpdate) {
      return zero;
    }

    return f(u.lastUpdate);
  };

const offset = derived(
  update,
  withDefault(0, u => u.offset),
);

const stations = derived(
  update,
  withDefault(
    new Map<string, number>(),
    ({ stations }) => new Map<string, number>(Object.entries(stations)),
  ),
);

const names = derived(
  update,
  withDefault([] as Array<[string, string]>, ({ names }) => names),
);

const departures = derived(
  update,
  withDefault([], ({ departures }) => departures),
);

const updatedAt = derived(
  update,
  withDefault(new Date(0), ({ updatedAt }) => new Date(updatedAt)),
);

const didUpdate = derived(update, ({ lastUpdate }) => lastUpdate != null);
const updating = derived(update, ({ updating }) => updating);
const nextCheck = derived(update, ({ nextCheckAt }) => nextCheckAt);

export { departures, didUpdate, names, nextCheck, offset, stations, updatedAt, updating };
