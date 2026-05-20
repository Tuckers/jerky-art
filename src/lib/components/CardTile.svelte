<script lang="ts">
  import type { Tile } from '$lib/stores/AppState.svelte';
  import { variantCssKey, variantLabelOf } from '$lib/variants';
  import { tcgplayerUrl, limitlessUrl, artOfPkmUrl } from '$lib/urls';

  interface Props {
    tile: Tile;
    art: string | undefined;
    collected: boolean;
    editMode: boolean;
    onactivate: (tile: Tile) => void;
  }
  let { tile, art, collected, editMode, onactivate }: Props = $props();

  let cssKey = $derived(variantCssKey(tile.variant));
  let label = $derived(variantLabelOf(tile.variant));
  let showTag = $derived(tile.variant !== 'regular');

  function handleClick() {
    onactivate(tile);
  }

  function handleLinkClick(e: MouseEvent) {
    e.stopPropagation();
  }
</script>

<div
  class="card-tile variant-{cssKey}"
  class:collected
  class:unreleased={tile.unreleased}
  class:edit-mode={editMode}
  onclick={handleClick}
  role="button"
  tabindex="0"
  aria-pressed={collected}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleClick())}
>
  <div class="card-art">
    {#if art}
      <img class="card-art-image" src={art} alt={tile.pokemon} loading="lazy" />
      {#if showTag}
        <span class="variant-chip chip-{cssKey}">{label}</span>
      {/if}
    {:else}
      <div class="card-art-inner">
        <div class="card-art-name">{tile.pokemon}</div>
        <div class="card-art-placeholder">
          {tile.unreleased ? '' : 'Card Art'}
        </div>
        <div class="card-art-num">{tile.num}</div>
      </div>
    {/if}
  </div>
  <div class="card-meta">
    {#if showTag}
      <span class="card-variant-tag variant-tag-{cssKey}">{label}</span>
    {/if}
    <div class="card-pokemon">{tile.pokemon}</div>
    <div class="card-set-line">
      <span>{tile.set}</span>
      <span>{tile.num}</span>
    </div>
    <div class="card-actions">
      <div class="check-indicator">
        <span class="check-box"></span>
        <span>{collected ? 'OWNED' : 'MISSING'}</span>
      </div>
      <div class="link-group">
        <a class="ext-link" href={tcgplayerUrl(tile)} target="_blank" rel="noopener" title="Search TCGplayer" onclick={handleLinkClick}>TCG</a>
        <a class="ext-link" href={limitlessUrl(tile)} target="_blank" rel="noopener" title="Search Limitless" onclick={handleLinkClick}>LIM</a>
        <a class="ext-link" href={artOfPkmUrl()} target="_blank" rel="noopener" title="Browse Art of Pokémon" onclick={handleLinkClick}>ART</a>
      </div>
    </div>
    {#if tile.notes}
      <div class="card-notes">{tile.notes}</div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '$styles/colors' as *;

  .card-tile {
    background: var(--paper);
    border: 1px solid var(--rule);
    cursor: pointer;
    transition: all 0.12s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .card-tile:hover {
    border-color: var(--ink);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--ink);
  }

  .card-tile.collected {
    background: var(--collected-bg);
    border-color: var(--collected);
  }

  .card-tile.collected:hover {
    box-shadow: 3px 3px 0 var(--collected);
  }

  .card-tile.edit-mode {
    border-style: dashed;
  }

  .card-tile.edit-mode:hover {
    border-color: var(--accent);
    box-shadow: 3px 3px 0 var(--accent);
  }

  .card-art {
    aspect-ratio: 5 / 7;
    background: var(--bg-grid);
    position: relative;
    border-bottom: 1px solid var(--rule);
    overflow: hidden;
  }

  .card-art-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: var(--paper);
  }

  .card-art-inner {
    position: absolute;
    inset: 8px;
    border: 1px solid var(--ink);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;
    background: var(--paper);
  }

  .card-art-name {
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-weight: 700;
    font-size: 13px;
    line-height: 1.05;
    text-transform: uppercase;
    word-break: break-word;
  }

  .card-art-placeholder {
    flex: 1;
    margin: 8px 0;
    border: 1px dashed var(--ink-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink-muted);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-align: center;
  }

  .card-art-num {
    font-size: 9px;
    letter-spacing: 0.1em;
    color: var(--ink-soft);
    font-feature-settings: 'tnum';
  }

  // Variant placeholders (only shown when no image)
  .variant-regular .card-art-placeholder {
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 8px,
      rgba(13, 12, 10, 0.04) 8px,
      rgba(13, 12, 10, 0.04) 9px
    );
  }

  .variant-reverse_holo .card-art-placeholder {
    background: linear-gradient(
      135deg,
      rgba(255, 100, 100, 0.18),
      rgba(100, 255, 180, 0.18),
      rgba(100, 150, 255, 0.18),
      rgba(255, 200, 100, 0.18)
    );
  }

  .variant-poke_ball .card-art-placeholder {
    background:
      radial-gradient(circle at 28% 32%, rgba(200, 52, 28, 0.28) 0%, rgba(200, 52, 28, 0.28) 16%, transparent 16%),
      radial-gradient(circle at 72% 65%, rgba(200, 52, 28, 0.22) 0%, rgba(200, 52, 28, 0.22) 12%, transparent 12%),
      radial-gradient(circle at 20% 80%, rgba(200, 52, 28, 0.18) 0%, rgba(200, 52, 28, 0.18) 8%, transparent 8%),
      var(--bg-grid);
  }

  .variant-master_ball .card-art-placeholder {
    background:
      radial-gradient(circle at 32% 38%, rgba(120, 50, 160, 0.32) 0%, rgba(120, 50, 160, 0.32) 14%, transparent 14%),
      radial-gradient(circle at 72% 70%, rgba(120, 50, 160, 0.24) 0%, rgba(120, 50, 160, 0.24) 10%, transparent 10%),
      linear-gradient(180deg, rgba(120, 50, 160, 0.06), rgba(120, 50, 160, 0.16));
  }

  .variant-custom .card-art-placeholder {
    background:
      repeating-linear-gradient(135deg, rgba(184, 138, 30, 0.22) 0px, rgba(184, 138, 30, 0.22) 6px, transparent 6px, transparent 14px),
      var(--bg-grid);
  }

  // Variant chip overlay when image present
  .variant-chip {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 8px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 3px 6px;
    background: var(--paper);
    border: 1px solid var(--ink);
    z-index: 2;
  }

  .variant-chip.chip-reverse_holo {
    background: linear-gradient(90deg, #ffe7e7, #e7ffe7, #e7e7ff);
  }
  .variant-chip.chip-poke_ball {
    background: var(--accent);
    color: var(--paper);
    border-color: var(--accent-deep);
  }
  .variant-chip.chip-master_ball {
    background: #5b2e8a;
    color: var(--paper);
    border-color: #3a1d59;
  }
  .variant-chip.chip-custom {
    background: #b88a1e;
    color: var(--paper);
    border-color: #6b4f10;
  }

  .card-meta {
    padding: 10px 12px;
    border-top: 1px solid var(--rule);
    background: var(--paper);
  }

  .card-tile.collected .card-meta {
    background: var(--collected-bg);
    border-color: var(--collected);
  }

  .card-pokemon {
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.15;
    padding-bottom: 4px;
  }

  .card-set-line {
    font-size: 10px;
    color: var(--ink-soft);
    letter-spacing: 0.08em;
    font-feature-settings: 'tnum';
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding-bottom: 6px;
  }

  .card-variant-tag {
    display: inline-block;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 2px 5px;
    border: 1px solid var(--ink);
    margin-bottom: 8px;
  }

  .variant-tag-reverse_holo {
    background: linear-gradient(90deg, #ffe7e7, #e7ffe7, #e7e7ff);
  }
  .variant-tag-poke_ball {
    background: var(--accent);
    color: var(--paper);
    border-color: var(--accent-deep);
  }
  .variant-tag-master_ball {
    background: #5b2e8a;
    color: var(--paper);
    border-color: #3a1d59;
  }
  .variant-tag-custom {
    background: #b88a1e;
    color: var(--paper);
    border-color: #6b4f10;
  }

  .card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  }

  .check-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-soft);
    font-weight: 500;
  }

  .check-box {
    width: 14px;
    height: 14px;
    border: 1.5px solid var(--ink);
    display: inline-block;
    position: relative;
    background: var(--paper);
    flex-shrink: 0;
  }

  .card-tile.collected .check-indicator {
    color: var(--collected);
    font-weight: 700;
  }

  .card-tile.collected .check-box {
    background: var(--collected);
    border-color: var(--collected);
  }

  .card-tile.collected .check-box::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 0px;
    width: 4px;
    height: 8px;
    border: solid var(--paper);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .link-group {
    display: flex;
    gap: 4px;
  }

  .ext-link {
    width: 26px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--rule);
    color: var(--ink-soft);
    font-size: 9px;
    text-decoration: none;
    transition: all 0.12s ease;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .ext-link:hover {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
  }

  .card-notes {
    font-size: 9px;
    color: var(--ink-soft);
    padding-top: 6px;
    font-style: italic;
    letter-spacing: 0.05em;
  }

  .card-tile.unreleased .card-art-placeholder::after {
    content: 'UNRELEASED';
    color: var(--accent);
    font-weight: 700;
    letter-spacing: 0.2em;
    font-size: 10px;
  }
</style>
