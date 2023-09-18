<script lang="ts">
  import { animationInterval } from "./lib/animationinterval";
  import { onDestroy } from "svelte";

  export let when: Date | null;
  export let live: boolean = true;
  export let format: Intl.RelativeTimeFormatStyle = "narrow";

  const rtf = new Intl.RelativeTimeFormat("en", { style: format });

  const timeSince = (when: Date): string => {
    let now = Math.floor(Date.now() / 1000);
    let then = Math.floor(when.getTime() / 1000);
    let secs = then - now;

    if (secs < 60) {
      return rtf.format(secs, "second");
    }

    let mins = Math.floor(secs / 60);

    return rtf.format(mins, "minute");
  };

  let age: string = "";

  const updateAge = () => {
    let nextAge = timeSince(when!);
    if (nextAge != age) {
      age = nextAge;
    }
  };

  let ab: AbortController;

  const reset = () => {
    if (ab != null) {
      ab.abort;
    }
  };

  onDestroy(reset);

  $: if (live && when != null) {
    ab = new AbortController();
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
