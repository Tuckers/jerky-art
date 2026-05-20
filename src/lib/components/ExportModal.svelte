<script lang="ts">
  import type { Tile } from '$lib/stores/AppState.svelte';
  import type { Language } from '$lib/data/seed-cards';
  import { SET_CODES } from '$lib/data/seed-cards';
  import { variantSuffixOf } from '$lib/variants';
  import Modal from './Modal.svelte';

  interface Props {
    open: boolean;
    tiles: Tile[];
    collection: Record<string, true>;
    currentLang: Language;
    setOrderEn: string[];
    setOrderJa: string[];
    onclose: () => void;
  }
  let { open, tiles, collection, currentLang, setOrderEn, setOrderJa, onclose }: Props = $props();

  type Mode = 'all' | 'missing' | 'lang';
  let mode: Mode = $state('all');
  let copied = $state(false);

  function generate(): string {
    const lines = ['# Jerky Collection · Pokémon TCG bulk list', '# Format: count name SETCODE number variant', ''];
    let filtered: Tile[];
    if (mode === 'missing') filtered = tiles.filter((t) => !collection[t.tileId]);
    else if (mode === 'lang') filtered = tiles.filter((t) => t.language === currentLang);
    else filtered = tiles;

    const bySet: Record<string, { set: string; language: Language; tiles: Tile[] }> = {};
    for (const t of filtered) {
      const key = `${t.language}:${t.set}`;
      if (!bySet[key]) bySet[key] = { set: t.set, language: t.language, tiles: [] };
      bySet[key].tiles.push(t);
    }

    const sortedKeys = Object.keys(bySet).sort((a, b) => {
      const ag = bySet[a];
      const bg = bySet[b];
      if (ag.language !== bg.language) return ag.language === 'en' ? -1 : 1;
      const order = ag.language === 'en' ? setOrderEn : setOrderJa;
      const ai = order.indexOf(ag.set);
      const bi = order.indexOf(bg.set);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    for (const key of sortedKeys) {
      const group = bySet[key];
      const setCode = SET_CODES[group.set] || group.set.replace(/\s+/g, '').toUpperCase().slice(0, 8);
      const langTag = group.language === 'ja' ? ' [JP]' : '';
      lines.push(`## ${group.set} (${setCode})${langTag}`);
      for (const tile of group.tiles) {
        const cardNum = tile.num.split('/')[0].replace(/^0+/, '');
        const suffix = variantSuffixOf(tile.variant);
        lines.push(`1 ${tile.pokemon} ${setCode} ${cardNum}${suffix}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  let text = $derived(open ? generate() : '');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback: ignore
    }
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<Modal {open} title="Bulk Card List" {onclose} body={exportBody} footer={exportFooter} />

{#snippet exportBody()}
  <p>Generates a Limitless / PTCGL-style list. Pick which slice you want, then copy.</p>
  <div class="mode-row">
    <button class="btn" class:active={mode === 'all'} onclick={() => (mode = 'all')}>All</button>
    <button class="btn" class:active={mode === 'lang'} onclick={() => (mode = 'lang')}>Current language</button>
    <button class="btn" class:active={mode === 'missing'} onclick={() => (mode = 'missing')}>Missing only</button>
  </div>
  <textarea class="export-area" readonly value={text}></textarea>
{/snippet}

{#snippet exportFooter()}
  <span class="copy-status" class:show={copied}>✓ Copied to clipboard</span>
  <button class="btn btn-primary" onclick={copy}>Copy to Clipboard</button>
{/snippet}

<style lang="scss">
  @use '$styles/colors' as *;

  .mode-row {
    display: flex;
    gap: 8px;
    padding-bottom: 12px;
    flex-wrap: wrap;
  }

  .export-area {
    width: 100%;
    border: 1px solid var(--ink);
    padding: 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    background: var(--bg);
    resize: vertical;
    min-height: 240px;
    color: var(--ink);
  }

  .copy-status {
    font-size: 10px;
    color: var(--collected);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .copy-status.show {
    opacity: 1;
  }
</style>
