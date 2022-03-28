<script lang="ts">
  import type { Departure, Update } from "./types";
  import { display, toggle, setnx, reset } from "./settings";
  import ToggleButton from "./ToggleButton.svelte";
  import Departures from "./Departures.svelte";
  import SlowUpdate from "./SlowUpdate.svelte";
  import TimeSince from "./TimeSince.svelte";

  let updating: boolean = false;
  let departures: Departure[] = [];
  let arrivals = new Map<string, number>();
  let offset: number = 0;
  let updatedAt: Date | null = null;
  let age: string | null = null;

  const updateIntervalMs = 30e3;
  const sourceURL = "https://nikc.kapsi.fi/departures/update.json";
  const load = (): Promise<Update> =>
    fetch(sourceURL).then((r) => r.json() as unknown as Update);

  let updateTimer: ReturnType<typeof setTimeout> | null = null;

  const updater = () => {
    if (updating) {
      return;
    }

    updating = true;

    if (updateTimer != null) {
      clearTimeout(updateTimer);
    }

    load()
      .then((update) => {
        let ts = new Date(update.updatedAt);
        if (updatedAt != null && ts <= updatedAt) {
          return;
        }

        for (let [s, ds] of Object.entries(update.stations)) {
          arrivals.set(s, ds);
          setnx(s, true);
        }

        updatedAt = ts;
        offset = update.offset;
        arrivals = arrivals;
        departures = update.departures;
      })
      .finally(() => {
        updating = false;
        updateTimer = setTimeout(updater, updateIntervalMs);
      });
  };

  reset();
  updater();

  $: filteredDepartures = departures
    .filter((d) => $display.get(d.sta) ?? true)
    .slice(0, 10);
</script>

<main>
  <div class="controls">
    <div class="filters">
      {#each [...$display.entries()].sort( ([sa], [sb]) => (sa > sb ? 1 : 0) ) as [station, include]}
        <ToggleButton click={() => toggle(station)} active={include}
          >{station} ({arrivals.get(station) ?? 0})</ToggleButton
        >
      {/each}
    </div>
    <div class="preferences">
      <span class="offset"
        >{#if offset > 0}(+{offset} min){:else}realtime{/if}</span
      >
      {#if updating}
        <SlowUpdate after={500} active={updating} />
      {:else}
        <button on:click={() => updater()}>&#9842;</button>
      {/if}
    </div>
  </div>

  <div class="state">
    {#if updatedAt != null}
      <TimeSince tick={true} when={updatedAt}>updated</TimeSince>
    {/if}
  </div>

  <div class="departures">
    {#if filteredDepartures.length == 0}
      <p>No departures</p>
    {:else}
      <Departures departures={filteredDepartures} />
    {/if}
  </div>
</main>

<style>
  @font-face {
    font-family: "dot_matrixregular";
    src: url("/fonts/dot_matrix_regular-webfont.woff2") format("woff2"),
      url("/fonts/dot_matrix_regular-webfont.woff") format("woff");
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: "dot_matrixbold";
    src: url("/fonts/dot_matrix_bold-webfont.woff2") format("woff2"),
      url("/fonts/dot_matrix_bold-webfont.woff") format("woff");
    font-weight: normal;
    font-style: normal;
  }

  :root {
    --bg: rgb(0, 0, 0);
    --fg: rgb(236, 161, 32);
    --font-size: 120%;
    --font-size-large: 160%;
    --font-regular: "dot_matrixregular";
    --font-bold: "dot_matrixbold";
  }

  :global(body) {
    background-color: var(--bg);
    color: var(--fg);
    overflow: hidden;
    font-family: var(--font-regular), monospace;
    font-size: var(--font-size);
    padding: 0;
  }

  main {
    position: relative;
    height: 100%;
  }

  button {
    background-color: var(--fg);
    border: 1px solid var(--bg);
    color: var(--bg);

    margin-bottom: 0;
    border-radius: 10px;
    padding: 8px 10px 5px 10px;
    min-width: 30px;
    line-height: 1;
  }

  .state {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .departures {
    margin-top: 10px;
  }

  .controls {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: space-between;
    min-height: 35px;
  }

  .preferences {
    justify-self: right;
    align-items: center;
    display: flex;
  }

  .offset {
    margin-right: 15px;
  }
</style>
