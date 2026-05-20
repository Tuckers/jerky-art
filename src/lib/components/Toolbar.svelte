<script lang="ts">
  import type { Filter } from '$lib/stores/AppState.svelte';

  interface Props {
    filter: Filter;
    editMode: boolean;
    onfilter: (f: Filter) => void;
    ontoggleedit: () => void;
    onadd: () => void;
    onexport: () => void;
    ondata: () => void;
  }
  let { filter, editMode, onfilter, ontoggleedit, onadd, onexport, ondata }: Props = $props();
</script>

<div class="toolbar">
  <div class="toolbar-group">
    <span class="toolbar-label">View —</span>
    <button class="btn" class:active={filter === 'all'} onclick={() => onfilter('all')}>All</button>
    <button class="btn" class:active={filter === 'missing'} onclick={() => onfilter('missing')}>Missing</button>
    <button class="btn" class:active={filter === 'owned'} onclick={() => onfilter('owned')}>Owned</button>
  </div>
  <div class="toolbar-group">
    <button class="btn btn-accent" class:active={editMode} onclick={ontoggleedit}>
      {editMode ? '✓ Done Editing' : '✎ Edit Mode'}
    </button>
    {#if editMode}
      <button class="btn" onclick={onadd}>+ Add Card</button>
    {/if}
    <a class="btn btn-primary" href="https://limitlesstcg.com/cards?q=artist%3Ajerky" target="_blank" rel="noopener">
      ↗ Limitless
    </a>
    <button class="btn btn-primary" onclick={onexport}>⎘ Export List</button>
    <button class="btn" onclick={ondata}>{'{ } Data'}</button>
  </div>
</div>

<style lang="scss">
  @use '$styles/colors' as *;

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 14px;
    margin-bottom: 28px;
  }

  .toolbar-group {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .toolbar-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  @media (max-width: 640px) {
    .toolbar {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
  }
</style>
