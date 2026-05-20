<script lang="ts">
  import type { Card } from '$lib/data/seed-cards';
  import Modal from './Modal.svelte';

  interface Props {
    open: boolean;
    cards: Card[];
    onclose: () => void;
    onapply: (parsed: Card[]) => Promise<void>;
  }
  let { open, cards, onclose, onapply }: Props = $props();

  let text = $state('');
  let status = $state('');
  let showStatus = $state(false);

  $effect(() => {
    if (open) {
      const stripped = cards.map((c) => {
        const { id: _id, ...rest } = c;
        return rest;
      });
      text = JSON.stringify(stripped, null, 2);
      status = '';
      showStatus = false;
    }
  });

  function flashStatus(msg: string) {
    status = msg;
    showStatus = true;
    setTimeout(() => (showStatus = false), 2000);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      flashStatus('✓ Copied');
    } catch {
      // ignore
    }
  }

  function download() {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jerky-collection.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function apply() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      alert('Invalid JSON: ' + (e as Error).message);
      return;
    }
    if (!Array.isArray(parsed)) {
      alert('JSON must be an array of card objects.');
      return;
    }
    for (let i = 0; i < parsed.length; i++) {
      const c = parsed[i] as Partial<Card>;
      if (!c.pokemon || !c.set || !c.num) {
        alert(`Card #${i + 1} is missing required fields (pokemon, set, num).`);
        return;
      }
    }
    await onapply(parsed as Card[]);
    flashStatus('✓ Applied');
  }
</script>

<Modal {open} title="Card Data (JSON)" {onclose} body={dataBody} footer={dataFooter} />

{#snippet dataBody()}
  <p>Edit the underlying card list as JSON. Make changes and click <strong>Apply</strong> to update. Export to back up your data, or paste in JSON to import.</p>
  <textarea class="export-area" bind:value={text}></textarea>
{/snippet}

{#snippet dataFooter()}
  <span class="copy-status" class:show={showStatus}>{status}</span>
  <div style="display: flex; gap: 8px;">
    <button class="btn" onclick={download}>↓ Download JSON</button>
    <button class="btn" onclick={copy}>⎘ Copy</button>
    <button class="btn btn-primary" onclick={apply}>Apply Changes</button>
  </div>
{/snippet}

<style lang="scss">
  @use '$styles/colors' as *;

  .export-area {
    width: 100%;
    border: 1px solid var(--ink);
    padding: 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    background: var(--bg);
    resize: vertical;
    min-height: 360px;
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
