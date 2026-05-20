<script lang="ts">
  import { onMount } from 'svelte';
  import { appState, type Tile, type Filter } from '$lib/stores/AppState.svelte';
  import type { Card, Language } from '$lib/data/seed-cards';
  import Header from '$lib/components/Header.svelte';
  import Tabs from '$lib/components/Tabs.svelte';
  import Toolbar from '$lib/components/Toolbar.svelte';
  import SetSection from '$lib/components/SetSection.svelte';
  import CardDetailModal from '$lib/components/CardDetailModal.svelte';
  import ExportModal from '$lib/components/ExportModal.svelte';
  import DataModal from '$lib/components/DataModal.svelte';

  let detailOpen = $state(false);
  let detailCard: Card | null = $state(null);
  let exportOpen = $state(false);
  let dataOpen = $state(false);

  onMount(async () => {
    await appState.load();
  });

  // Toggle body class for lang-ja styling
  $effect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('lang-ja', appState.currentLang === 'ja');
    }
  });

  let enCount = $derived(appState.tiles.filter((t) => t.language === 'en').length);
  let jaCount = $derived(appState.tiles.filter((t) => t.language === 'ja').length);

  let visibleTiles = $derived.by(() => {
    const filter = appState.currentFilter;
    return appState.langTiles.filter((t) => {
      const owned = !!appState.collection[t.tileId];
      if (filter === 'owned') return owned;
      if (filter === 'missing') return !owned;
      return true;
    });
  });

  let groupedSets = $derived.by(() => {
    const groups: Record<string, Tile[]> = {};
    for (const tile of visibleTiles) {
      if (!groups[tile.set]) groups[tile.set] = [];
      groups[tile.set].push(tile);
    }
    const order = appState.setOrder;
    const sets = Object.keys(groups).sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    return sets.map((setName, idx) => ({
      setName,
      tiles: groups[setName],
      isFirst: idx === 0,
      isLast: idx === sets.length - 1
    }));
  });

  let pct = $derived(appState.totalCount > 0 ? Math.round((appState.ownedCount / appState.totalCount) * 100) : 0);
  let remaining = $derived(appState.totalCount - appState.ownedCount);

  function handleTileActivate(tile: Tile) {
    if (appState.editMode) {
      const found = appState.cards.find((c) => c.id === tile.cardId);
      if (found) {
        detailCard = found;
        detailOpen = true;
      }
    } else {
      void appState.toggleTile(tile.tileId);
    }
  }

  function openNewCard() {
    detailCard = null;
    detailOpen = true;
  }

  async function handleSaveCard(card: Card, pendingArtUrl: string | null | undefined) {
    await appState.saveCard(card, pendingArtUrl);
    detailOpen = false;
  }

  async function handleDeleteCard(cardId: string) {
    await appState.deleteCard(cardId);
    detailOpen = false;
  }

  function handleLang(lang: Language) {
    appState.currentLang = lang;
  }

  function handleFilter(f: Filter) {
    appState.currentFilter = f;
  }

  function toggleEdit() {
    appState.editMode = !appState.editMode;
  }

  async function handleApplyData(parsed: Card[]) {
    await appState.replaceCards(parsed);
    dataOpen = false;
  }
</script>

<div class="container">
  <Header owned={appState.ownedCount} total={appState.totalCount} currentLang={appState.currentLang} />

  <Tabs currentLang={appState.currentLang} {enCount} {jaCount} onlang={handleLang} />

  <Toolbar
    filter={appState.currentFilter}
    editMode={appState.editMode}
    onfilter={handleFilter}
    ontoggleedit={toggleEdit}
    onadd={openNewCard}
    onexport={() => (exportOpen = true)}
    ondata={() => (dataOpen = true)}
  />

  <main>
    {#if !appState.loaded}
      <div class="loading">Loading…</div>
    {:else}
      {#each groupedSets as group (group.setName)}
        <SetSection
          setName={group.setName}
          tiles={group.tiles}
          collection={appState.collection}
          artwork={appState.artwork}
          editMode={appState.editMode}
          isFirst={group.isFirst}
          isLast={group.isLast}
          onactivate={handleTileActivate}
          onmove={(name, dir) => appState.moveSet(name, dir)}
        />
      {/each}
    {/if}
  </main>

  <footer>
    <div>Click card to toggle · Edit Mode to add/edit/upload art · TCG = TCGplayer · LIM = Limitless · ART = Art of PKM</div>
    <div>{pct}% complete · {remaining} remaining</div>
  </footer>
</div>

<CardDetailModal
  open={detailOpen}
  card={detailCard}
  existingArt={detailCard?.id ? appState.artwork[detailCard.id] : undefined}
  onclose={() => (detailOpen = false)}
  onsave={handleSaveCard}
  ondelete={handleDeleteCard}
/>

<ExportModal
  open={exportOpen}
  tiles={appState.tiles}
  collection={appState.collection}
  currentLang={appState.currentLang}
  setOrderEn={appState.setOrderEn}
  setOrderJa={appState.setOrderJa}
  onclose={() => (exportOpen = false)}
/>

<DataModal
  open={dataOpen}
  cards={appState.cards}
  onclose={() => (dataOpen = false)}
  onapply={handleApplyData}
/>

<style lang="scss">
  @use '$styles/colors' as *;

  .loading {
    padding: 60px 0;
    text-align: center;
    color: var(--ink-muted);
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  footer {
    margin-top: 64px;
    padding-top: 24px;
    border-top: 1px solid var(--rule);
    font-size: 10px;
    color: var(--ink-muted);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
