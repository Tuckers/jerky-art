<script lang="ts">
  import type { Language } from '$lib/data/seed-cards';

  interface Props {
    currentLang: Language;
    enCount: number;
    jaCount: number;
    onlang: (lang: Language) => void;
  }
  let { currentLang, enCount, jaCount, onlang }: Props = $props();
</script>

<div class="tabs">
  <button class="tab" class:active={currentLang === 'en'} onclick={() => onlang('en')}>
    English <span class="count">{enCount}</span>
  </button>
  <button class="tab" class:active={currentLang === 'ja'} onclick={() => onlang('ja')}>
    Japanese <span class="count">{jaCount}</span>
  </button>
</div>

<style lang="scss">
  @use '$styles/colors' as *;

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--ink);
    margin-bottom: 24px;
  }

  .tab {
    background: none;
    border: 0;
    border-right: 1px solid var(--rule);
    color: var(--ink-soft);
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 14px 22px;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }

  .tab:hover {
    color: var(--ink);
  }

  .tab.active {
    color: var(--ink);
    background: var(--paper);
  }

  .tab.active::after {
    content: '';
    position: absolute;
    inset: auto 0 -1px 0;
    height: 3px;
    background: var(--ink);
  }

  .count {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--ink-muted);
    padding-left: 8px;
    font-feature-settings: 'tnum';
    font-weight: 400;
  }

  @media (max-width: 640px) {
    .tabs {
      overflow-x: auto;
    }
  }
</style>
