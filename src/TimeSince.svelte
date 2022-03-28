<script lang="ts">
  import { animationInterval } from "./animationinterval";
  import { onDestroy } from "svelte";

  export let when: Date | null;
  export let tick: boolean;

  const rtf = new Intl.RelativeTimeFormat("en", { style: "narrow" });

  const timeSince = (when: Date): string => {
    let now = Math.floor(Date.now() / 1000);
    let then = Math.floor(when.getTime() / 1000);
    let secs = now - then;
    let mins = Math.floor(secs / 60);

    if (mins < 1) {
      return rtf.format(-secs, "second");
    }

    return rtf.format(-mins, "minute");
  };

  let age: string = "";

  const updateAge = () => {
    let nextAge = timeSince(when!);
    if (nextAge != age) {
      age = nextAge;
    }
  };

  let ab: AbortController;

  $: if (tick && when != null) {
    if (ab != null) {
      ab.abort;
    }

    ab = new AbortController();

    onDestroy(ab.abort);
    animationInterval(1000, ab.signal, updateAge);
  }
</script>

{#if when != null && age != ""}
  <span class="age"><slot>time since</slot> {age}</span>
{/if}

<style>
  span {
    margin-right: 15px;
  }
</style>
