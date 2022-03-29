<script lang="ts">
  import { onDestroy } from "svelte";
  import { animationInterval } from "./lib/animationinterval";

  const throbbers = "⠷⠯⠟⠻⠽⠾".split("");

  export let active: boolean;
  export let displayAfter: number = 0;

  let slow: boolean = false;
  let slowTimer: ReturnType<typeof setTimeout>;
  let ticker: AbortController;
  let ticks = 0;

  const style = (active: boolean, slow: boolean): string =>
    [active ? "active" : "inactive", active && slow ? "slow" : ""].join(" ");

  const tick = () => (ticks = ticks + 1);

  const reset = () => {
    clearTimeout(slowTimer);
    if (ticker) {
      ticker.abort();
    }
    slow = false;
  };

  onDestroy(reset);

  $: if (active) {
    reset();

    ticker = new AbortController();
    animationInterval(200, ticker.signal, tick);
    setTimeout(() => (slow = true), displayAfter);
  } else {
    reset();
  }

  $: throbber = throbbers[ticks % throbbers.length];
</script>

<span class={style(active, slow)}
  >{#if $$slots.default}<slot /> {/if}{throbber}</span
>

<style>
  span {
    opacity: 0;
    transition-property: opacity;
    transition-duration: 0.5s;
  }

  .inactive {
    opacity: 0;
  }

  .slow {
    opacity: 1;
  }
</style>
