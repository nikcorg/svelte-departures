<script lang="ts">
  import type { Departure } from "./lib/types";

  export let departures: Departure[];

  const styleDepartureLine = (d: Departure): string =>
    d.etd.toLowerCase() !== "on time" ? "disrupted" : "";

  const butcher = (s: string): string => s.replaceAll("ä", "a").replaceAll("ö", "o");
</script>

<table>
  <thead>
    <tr>
      <th>Due</th>
      <th>Srv</th>
      <th>To</th>
      <!-- <th class="plat">Plat</th> -->
      <th class="etd">Expected</th>
    </tr>
  </thead>
  <tbody>
    {#each departures as d}
      <tr class={styleDepartureLine(d)}>
        <td>{d.due}</td>
        <td>{d.srv}</td>
        <td>{butcher(d.dst)}</td>
        <!-- <td class="plat">{d.pla}</td> -->
        <td class="etd">{d.etd}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    font-size: var(--font-size-large);
  }

  th {
    font-weight: normal;
    text-align: left;
  }

  td,
  th {
    margin-left: 0;
    margin-right: 0;
  }

  td {
    padding-top: 3px;
    padding-bottom: 3px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  tr.disrupted .etd {
    font-family: var(--font-bold), monospace;
    color: rgb(237, 29, 29);
  }

  .plat,
  .etd {
    text-align: center;
  }
</style>
