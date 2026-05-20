<script lang="ts">
  import type { Tile } from '$lib/stores/AppState.svelte';
  import CardTile from './CardTile.svelte';

  interface Props {
    setName: string;
    tiles: Tile[];
    collection: Record<string, true>;
    artwork: Record<string, string>;
    editMode: boolean;
    isFirst: boolean;
    isLast: boolean;
    onactivate: (tile: Tile) => void;
    onmove: (setName: string, direction: 'up' | 'down') => void;
  }

  let { setName, tiles, collection, artwork, editMode, isFirst, isLast, onactivate, onmove }: Props = $props();

  let ownedInSet = $derived(tiles.filter((t) => collection[t.tileId]).length);
</script>

<section class="set-section">
  <div class="set-header">
    <div class="set-name">{setName}</div>
    <div class="set-rule"></div>
    <div class="set-header-right">
      {#if editMode}
        <span class="set-reorder">
          <button class="set-arrow" disabled={isFirst} onclick={() => onmove(setName, 'up')} title="Move up">▲</button>
          <button class="set-arrow" disabled={isLast} onclick={() => onmove(setName, 'down')} title="Move down">▼</button>
        </span>
      {/if}
      <span class="set-count">
        {String(ownedInSet).padStart(2, '0')} / {String(tiles.length).padStart(2, '0')}
      </span>
    </div>
  </div>
  <div class="card-grid">
    {#each tiles as tile (tile.tileId)}
      <CardTile
        {tile}
        art={artwork[tile.cardId]}
        collected={!!collection[tile.tileId]}
        {editMode}
        {onactivate}
      />
    {/each}
  </div>
</section>

<style lang="scss">
  @use '$styles/colors' as *;

  .set-section {
    padding-bottom: 56px;
  }

  .set-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 16px;
    align-items: baseline;
    border-bottom: 2px solid var(--ink);
    padding-bottom: 8px;
    margin-bottom: 20px;
  }

  .set-name {
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-weight: 700;
    font-size: 24px;
    text-transform: uppercase;
    letter-spacing: -0.01em;
  }

  :global(body.lang-ja) .set-name::before {
    content: '日 ';
    color: var(--jp-accent);
    font-size: 18px;
    padding-right: 4px;
  }

  .set-rule {
    height: 1px;
    background: var(--rule);
    align-self: center;
  }

  .set-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .set-count {
    font-size: 11px;
    color: var(--ink-soft);
    letter-spacing: 0.1em;
    font-feature-settings: 'tnum';
  }

  .set-reorder {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }

  .set-arrow {
    background: var(--paper);
    border: 1px solid var(--ink);
    width: 24px;
    height: 22px;
    font-family: inherit;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    color: var(--ink);
    padding: 0;
    transition: all 0.12s ease;
  }

  .set-arrow:hover {
    background: var(--ink);
    color: var(--paper);
  }

  .set-arrow:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .set-arrow:disabled:hover {
    background: var(--paper);
    color: var(--ink);
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  @media (max-width: 640px) {
    .card-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
</style>
