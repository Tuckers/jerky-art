<script lang="ts">
  import type { Card, Language, CardType } from '$lib/data/seed-cards';
  import { DEFAULT_POKEBALL_SETS } from '$lib/data/seed-cards';
  import { getVariantsForCard, variantCssKey, variantLabelOf } from '$lib/variants';
  import Modal from './Modal.svelte';

  interface Props {
    open: boolean;
    card: Card | null;
    existingArt: string | undefined;
    onclose: () => void;
    onsave: (card: Card, pendingArtUrl: string | null | undefined) => void;
    ondelete: (cardId: string) => void;
  }
  let { open, card, existingArt, onclose, onsave, ondelete }: Props = $props();

  let pokemon = $state('');
  let setName = $state('');
  let num = $state('');
  let type: CardType = $state('normal');
  let language: Language = $state('en');
  let notes = $state('');
  let unreleased = $state(false);
  let pokeball = $state(false);
  let customVariantsText = $state('');
  let artPreview = $state<string | null>(null);
  let pendingArtUrl = $state<string | null | undefined>(undefined);
  let artUrlInput = $state('');
  let dragover = $state(false);

  let fileInput: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (!open) return;
    if (card) {
      pokemon = card.pokemon || '';
      setName = card.set || '';
      num = card.num || '';
      type = card.type || 'normal';
      language = card.language || 'en';
      notes = card.notes || '';
      unreleased = !!card.unreleased;
      const defaultPb = DEFAULT_POKEBALL_SETS.includes(card.set);
      pokeball = card.pokeball !== undefined ? card.pokeball : defaultPb;
      customVariantsText = Array.isArray(card.customVariants) ? card.customVariants.join(', ') : '';
      artPreview = existingArt ?? null;
    } else {
      pokemon = '';
      setName = '';
      num = '';
      type = 'normal';
      language = 'en';
      notes = '';
      unreleased = false;
      pokeball = false;
      customVariantsText = '';
      artPreview = null;
    }
    pendingArtUrl = undefined;
    artUrlInput = '';
  });

  // Auto-toggle pokeball when typing a known set name
  $effect(() => {
    if (DEFAULT_POKEBALL_SETS.includes(setName) && !pokeball) {
      pokeball = true;
    }
  });

  function parseCustomVariants(): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of customVariantsText.split(',')) {
      const name = raw.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push(name);
    }
    return out;
  }

  let previewVariants = $derived(
    getVariantsForCard({
      type,
      set: setName,
      pokeball,
      customVariants: parseCustomVariants()
    })
  );

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('Image too large. Max 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        pendingArtUrl = result;
        artPreview = result;
        artUrlInput = '';
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragover = false;
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  }

  function handleArtUrlInput() {
    const v = artUrlInput.trim();
    if (v) {
      pendingArtUrl = v;
      artPreview = v;
    }
  }

  function clearArt() {
    pendingArtUrl = '';
    artPreview = null;
    artUrlInput = '';
  }

  function save() {
    if (!pokemon.trim() || !setName.trim() || !num.trim()) {
      alert('Please fill in Pokémon, Set, and Card Number.');
      return;
    }
    const cardData: Card = {
      id: card?.id,
      pokemon: pokemon.trim(),
      set: setName.trim(),
      num: num.trim(),
      type,
      language,
      notes: notes.trim(),
      unreleased
    };
    const defaultPb = DEFAULT_POKEBALL_SETS.includes(cardData.set);
    if (pokeball !== defaultPb) cardData.pokeball = pokeball;
    const customs = parseCustomVariants();
    if (customs.length > 0) cardData.customVariants = customs;

    const artChange = pendingArtUrl === undefined ? undefined : pendingArtUrl === '' ? null : pendingArtUrl;
    onsave(cardData, artChange);
  }

  function handleDelete() {
    if (!card?.id) return;
    if (!confirm('Delete this card? Variants and ownership state will be removed.')) return;
    ondelete(card.id);
  }

  let isNew = $derived(!card?.id);
</script>

<Modal
  {open}
  title={isNew ? 'New Card' : 'Edit Card'}
  {onclose}
  body={cardBody}
  footer={cardFooter}
/>

{#snippet cardBody()}
  <div class="card-detail">
    <div>
      <div class="art-preview">
        {#if artPreview}
          <img src={artPreview} alt="preview" />
        {:else}
          <span class="art-preview-empty">No artwork</span>
        {/if}
      </div>
      <div class="art-controls">
        <input
          type="file"
          accept="image/*"
          style="display:none;"
          bind:this={fileInput}
          onchange={(e) => {
            const file = (e.currentTarget as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div
          class="file-drop"
          class:dragover
          role="button"
          tabindex="0"
          onclick={() => fileInput?.click()}
          onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), fileInput?.click())}
          ondragover={(e) => {
            e.preventDefault();
            dragover = true;
          }}
          ondragleave={() => (dragover = false)}
          ondrop={handleDrop}
        >
          Click or drop image here
        </div>
        <input
          type="text"
          class="field-input"
          placeholder="…or paste image URL"
          bind:value={artUrlInput}
          oninput={handleArtUrlInput}
        />
        <button class="btn" style="font-size: 9px;" onclick={clearArt}>✕ Clear Art</button>
      </div>
    </div>
    <div>
      <div class="field-group">
        <label class="field-label" for="cd-pokemon">Pokémon</label>
        <input id="cd-pokemon" type="text" class="field-input" bind:value={pokemon} />
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="cd-set">Set</label>
          <input id="cd-set" type="text" class="field-input" bind:value={setName} />
        </div>
        <div class="field-group">
          <label class="field-label" for="cd-num">Card Number</label>
          <input id="cd-num" type="text" class="field-input" placeholder="30/86" bind:value={num} />
        </div>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="cd-type">Type</label>
          <select id="cd-type" class="field-select" bind:value={type}>
            <option value="normal">Normal (gets variants)</option>
            <option value="secret">Secret / IR / SAR / ex</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label" for="cd-language">Language</label>
          <select id="cd-language" class="field-select" bind:value={language}>
            <option value="en">English</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="cd-notes">Notes</label>
        <input id="cd-notes" type="text" class="field-input" placeholder="e.g. Illustration Rare" bind:value={notes} />
      </div>
      <div class="field-group">
        <label class="field-label">
          <input type="checkbox" bind:checked={pokeball} style="margin-right: 6px;" />
          Has Poké Ball + Master Ball variants
        </label>
        <div class="field-help">Default applies to Black Bolt, White Flare, Prismatic Evolutions, and Mega Dream ex (JP).</div>
      </div>
      <div class="field-group">
        <label class="field-label">
          <input type="checkbox" bind:checked={unreleased} style="margin-right: 6px;" />
          Unreleased
        </label>
      </div>
      <div class="field-group">
        <label class="field-label" for="cd-customs">Custom Variants</label>
        <input
          id="cd-customs"
          type="text"
          class="field-input"
          placeholder="e.g. Ball Stamped, Energy Stamped"
          bind:value={customVariantsText}
        />
        <div class="field-help">
          Comma-separated. Each name adds an extra variant tile for this card (e.g. Ascended Heroes ball/energy stamps).
        </div>
      </div>
      <div class="field-group">
        <span class="field-label">Variants for this card</span>
        <div class="variant-preview-list">
          {#each previewVariants as v (v)}
            <span class="variant-preview-chip variant-tag-{variantCssKey(v)}">{variantLabelOf(v)}</span>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/snippet}

{#snippet cardFooter()}
  {#if !isNew}
    <button class="btn btn-danger" onclick={handleDelete}>Delete Card</button>
  {:else}
    <span></span>
  {/if}
  <div style="display: flex; gap: 8px;">
    <button class="btn" onclick={onclose}>Cancel</button>
    <button class="btn btn-primary" onclick={save}>Save</button>
  </div>
{/snippet}

<style lang="scss">
  @use '$styles/colors' as *;

  .card-detail {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 24px;
  }

  @media (max-width: 600px) {
    .card-detail {
      grid-template-columns: 1fr;
    }
  }

  .art-preview {
    aspect-ratio: 5/7;
    background: var(--bg-grid);
    border: 1px solid var(--rule);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .art-preview :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .art-preview-empty {
    color: var(--ink-muted);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-align: center;
    padding: 16px;
  }

  .art-controls {
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .file-drop {
    border: 1px dashed var(--ink);
    padding: 12px;
    text-align: center;
    cursor: pointer;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-soft);
    transition: all 0.15s ease;
    background: var(--paper);
  }

  .file-drop:hover,
  .file-drop.dragover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .variant-preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 6px;
  }

  .variant-preview-chip {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 4px 8px;
    border: 1px solid var(--ink);
    background: var(--paper);
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
</style>
