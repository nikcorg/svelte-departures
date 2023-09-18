<script lang="ts">
  import { onMount } from "svelte";

  import Departures from "./Departures.svelte";
  import Throbber from "./Throbber.svelte";
  import TimeSince from "./TimeSince.svelte";
  import TimeUntil from "./TimeUntil.svelte";
  import ToggleButton from "./ToggleButton.svelte";

  import {
    departures,
    didUpdate,
    names,
    nextCheck,
    offset,
    stations,
    updatedAt,
    updating,
  } from "./lib/updater";
  import { display, toggle, reset, setnx } from "./lib/settings";

  onMount(reset);

  // all stations enabled by default
  $: for (let [s] of $stations) {
    setnx(s, true);
  }

  // derive filtered departures
  $: ds = $departures.filter(d => $display.get(d.sta) ?? true).slice(0, 10);

  // derive filters
  $: fs = $names.map(
    ([code, name]) =>
      [code, name, $display.get(code)!, `${$stations.get(code) ?? "-"}`] as [
        string,
        string,
        boolean,
        string,
      ],
  );
</script>

<div class="container">
  <div class="toolkit">
    {#each fs as [code, name, active, departures]}
      <ToggleButton click={() => toggle(code)} {active}>{name} ({departures})</ToggleButton>
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

    {#if $nextCheck}
      <TimeUntil live={true} when={$nextCheck}>next check</TimeUntil>
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

  /* kept for future reference for a planned settings button
  button {
    background-color: var(--fg);
    border: 1px solid var(--bg);
    color: var(--bg);

    margin-bottom: 0;
    border-radius: 10px;
    padding: 8px 10px 5px 10px;
    min-width: 30px;
    line-height: 1;
  } */
</style>
