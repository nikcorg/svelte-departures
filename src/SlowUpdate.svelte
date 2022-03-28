<script lang="ts">
  import { onDestroy } from "svelte";
  import { animationInterval } from "./animationinterval";

  export let active: boolean;
  export let after: number;

  let slow: boolean = false;

  const style = (active: boolean, slow: boolean): string =>
    [active ? "active" : "inactive", active && slow ? "slow" : ""].join(" ");

  let slowTimer: ReturnType<typeof setTimeout>;
  let tickTimer: AbortController;

  const cleanup = () => {
    clearTimeout(slowTimer);
    if (tickTimer) {
      tickTimer.abort();
    }
  };

  onDestroy(cleanup);

  let ticks = 0;
  let throbbers = "⠯⠟⠻⠽⠾⠷".split("");
  $: throbber = throbbers[ticks % throbbers.length];

  const tick = () => {
    ticks = ticks + 1;
  };

  $: if (active) {
    clearTimeout(slowTimer);
    setTimeout(() => (slow = true), after);

    if (tickTimer != null) {
      tickTimer.abort();
    }
    tickTimer = new AbortController();
    animationInterval(200, tickTimer.signal, tick);
  } else {
    cleanup();
  }
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
