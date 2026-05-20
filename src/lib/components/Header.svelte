<script lang="ts">
  interface Props {
    owned: number;
    total: number;
    currentLang: 'en' | 'ja';
  }
  let { owned, total, currentLang }: Props = $props();
</script>

<header>
  <h1 class="masthead">
    Jerky<br />Collection
    <span class="subtitle">Pokémon TCG cards illustrated by Jerky · personal checklist</span>
  </h1>
  <div class="stats">
    <div class="big-num">
      <span>{owned}</span><span class="of">/</span><span>{total}</span>
    </div>
    <div class="label">Cards Collected · {currentLang === 'en' ? 'English' : 'Japanese'}</div>
  </div>
</header>

<style lang="scss">
  @use '$styles/colors' as *;

  header {
    border-top: 4px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    padding: 24px 0 20px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: end;
  }

  .masthead {
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-weight: 700;
    font-size: clamp(48px, 7vw, 84px);
    line-height: 0.88;
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }

  .masthead .subtitle {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 400;
    font-size: 11px;
    letter-spacing: 0.18em;
    padding-top: 12px;
    color: var(--ink-soft);
  }

  .stats {
    text-align: right;
    font-family: 'IBM Plex Mono', monospace;
  }

  .big-num {
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-weight: 700;
    font-size: 64px;
    line-height: 1;
    letter-spacing: -0.02em;
    font-feature-settings: 'tnum';
  }

  .big-num .of {
    color: var(--ink-muted);
    font-weight: 400;
  }

  .label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-soft);
    padding-top: 4px;
  }

  @media (max-width: 640px) {
    header {
      grid-template-columns: 1fr;
    }
    .stats {
      text-align: left;
    }
  }
</style>
