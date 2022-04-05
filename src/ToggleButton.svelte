<script lang="ts">
  export let active: boolean;
  export let click: () => void;

  const activeStyle = (active: boolean): string => (active ? "active" : "inactive");
</script>

<button class={activeStyle(active)} on:click={click}><slot /></button>

<style>
  button {
    background-color: var(--fg);
    border: 1px solid var(--bg);
    color: var(--bg);

    margin-left: 5px;
    margin-bottom: 0;
    border-radius: 10px;
    padding: 8px 10px 5px 10px;
    min-width: 30px;
    line-height: 1;

    transition-property: color, background-color;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
  }

  button:focus {
    outline: 0;
  }

  button:nth-of-type(1) {
    margin-left: 0;
  }

  button.inactive {
    background-color: var(--bg);
    border: 1px solid var(--fg);
    color: var(--fg);
  }
</style>
