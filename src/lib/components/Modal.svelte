<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title: string;
    onclose: () => void;
    body: Snippet;
    footer?: Snippet;
  }

  let { open, title, onclose, body, footer }: Props = $props();

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onclose();
  }
</script>

<div class="modal-overlay" class:open onclick={handleOverlayClick} role="presentation">
  <div class="modal" role="dialog" aria-modal="true" aria-label={title}>
    <div class="modal-header">
      <div class="modal-title">{title}</div>
      <button class="modal-close" onclick={onclose} aria-label="Close">×</button>
    </div>
    <div class="modal-body">
      {@render body()}
    </div>
    {#if footer}
      <div class="modal-footer">
        {@render footer()}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '$styles/colors' as *;

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13, 12, 10, 0.55);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
  }

  .modal-overlay.open {
    display: flex;
  }

  .modal {
    background: var(--paper);
    border: 2px solid var(--ink);
    max-width: 720px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 8px 8px 0 var(--ink);
  }

  .modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--rule);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-weight: 700;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: -0.01em;
  }

  .modal-close {
    background: none;
    border: 1px solid var(--ink);
    width: 28px;
    height: 28px;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    line-height: 1;
  }

  .modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;

    :global(p) {
      font-size: 11px;
      color: var(--ink-soft);
      margin-bottom: 12px;
      letter-spacing: 0.05em;
    }
  }

  .modal-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--rule);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
</style>
