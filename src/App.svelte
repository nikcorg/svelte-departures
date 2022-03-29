<script lang="ts">
  import { onMount } from "svelte";

  import ToggleButton from "./ToggleButton.svelte";
  import Departures from "./Departures.svelte";
  import Throbber from "./Throbber.svelte";
  import TimeSince from "./TimeSince.svelte";

  import { display, toggle, setnx, reset } from "./settings";
  import {
    stations,
    departures,
    offset,
    updatedAt,
    updating,
    didUpdate,
  } from "./updater";

  onMount(reset);

  // all stations enabled by default
  $: for (let [s] of $stations) {
    setnx(s, true);
  }

  // derive filtered departures
  $: ds = $departures.filter((d) => $display.get(d.sta) ?? true).slice(0, 10);

  // derive filters
  $: fs = [...$display.entries()].sort(([sa], [sb]) => (sa > sb ? 1 : 0));
</script>

<div class="container">
  <div class="toolkit">
    {#each fs as [station, include]}
      <ToggleButton click={() => toggle(station)} active={include}
        >{station} ({$stations.get(station) ?? "-"})</ToggleButton
      >
    {/each}
  </div>
  <div class="settings">
    <span class="offset"
      >{#if $offset > 0}+{$offset} min{:else}realtime{/if}</span
    >
  </div>
  <div class="state">
    {#if $didUpdate}
      <TimeSince live={true} when={$updatedAt}>updated</TimeSince>
    {/if}
  </div>
  <div class="display">
    {#if !$didUpdate || ds.length == 0}
      <p class="larger">No departures</p>
    {:else}
      <Departures departures={ds} />
    {/if}
  </div>
  <div class="indicators">
    <Throbber displayAfter={500} active={$updating} />
  </div>
</div>

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

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    background-color: var(--bg);
    color: var(--fg);
    overflow: hidden;
    font-family: var(--font-regular), monospace;
    font-size: var(--font-size);
    padding: 0;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 0.2fr 2.6fr 0.2fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    height: 100%;
  }

  .state {
    align-self: center;
    grid-area: 3 / 1 / 4 / 4;
  }

  .display {
    grid-area: 2 / 1 / 3 / 4;
    align-self: start;
    padding-top: 15px;
  }

  .indicators {
    justify-self: end;
    align-self: center;
    grid-area: 3 / 3 / 4 / 4;
  }

  .toolkit {
    align-self: center;
    grid-area: 1 / 1 / 2 / 4;
  }

  .settings {
    justify-self: end;
    align-self: center;
    grid-area: 1 / 3 / 2 / 4;
  }

  p.larger {
    font-size: var(--font-size-large);
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
</style>
