import type { Card, Language } from '$lib/data/seed-cards';
import {
  SEED_CARDS,
  SET_ORDER_EN,
  SET_ORDER_JA
} from '$lib/data/seed-cards';
import { getVariantsForCard, type Variant } from '$lib/variants';
import { storageGet, storageSet, storageDelete, storageList } from '$lib/storage';

const CARDS_KEY = 'jerky-cards-v3';
const COLLECTION_KEY = 'jerky-collection-v3';
const ART_KEY_PREFIX = 'jerky-art-v3:';
const SET_ORDER_EN_KEY = 'jerky-set-order-en-v3';
const SET_ORDER_JA_KEY = 'jerky-set-order-ja-v3';

export interface Tile {
  tileId: string;
  cardId: string;
  pokemon: string;
  set: string;
  num: string;
  variant: Variant;
  notes: string;
  unreleased: boolean;
  language: Language;
}

export type Filter = 'all' | 'owned' | 'missing';

function newId(i: number): string {
  return `card_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`;
}

class AppStateClass {
  cards: Card[] = $state([]);
  collection: Record<string, true> = $state({});
  artwork: Record<string, string> = $state({});
  setOrderEn: string[] = $state([]);
  setOrderJa: string[] = $state([]);

  currentLang: Language = $state('en');
  currentFilter: Filter = $state('all');
  editMode = $state(false);
  loaded = $state(false);

  tiles = $derived.by<Tile[]>(() => {
    const out: Tile[] = [];
    for (const card of this.cards) {
      if (!card.id) continue;
      const variants = getVariantsForCard(card);
      for (const variant of variants) {
        out.push({
          tileId: `${card.id}--${variant}`,
          cardId: card.id,
          pokemon: card.pokemon,
          set: card.set,
          num: card.num,
          variant,
          notes: card.notes || '',
          unreleased: !!card.unreleased,
          language: card.language || 'en'
        });
      }
    }
    return out;
  });

  langTiles = $derived(this.tiles.filter((t) => t.language === this.currentLang));

  ownedCount = $derived(this.langTiles.filter((t) => this.collection[t.tileId]).length);
  totalCount = $derived(this.langTiles.length);

  setOrder = $derived(this.currentLang === 'ja' ? this.setOrderJa : this.setOrderEn);

  async load() {
    try {
      const raw = await storageGet(CARDS_KEY);
      this.cards = raw ? JSON.parse(raw) : structuredClone(SEED_CARDS);
    } catch {
      this.cards = structuredClone(SEED_CARDS);
    }

    this.cards.forEach((card, i) => {
      if (!card.id) card.id = newId(i);
    });

    try {
      const raw = await storageGet(COLLECTION_KEY);
      this.collection = raw ? JSON.parse(raw) : {};
    } catch {
      this.collection = {};
    }

    try {
      const keys = await storageList(ART_KEY_PREFIX);
      const art: Record<string, string> = {};
      for (const key of keys) {
        const v = await storageGet(key);
        if (v) art[key.slice(ART_KEY_PREFIX.length)] = v;
      }
      this.artwork = art;
    } catch {
      this.artwork = {};
    }

    try {
      const raw = await storageGet(SET_ORDER_EN_KEY);
      this.setOrderEn = raw ? JSON.parse(raw) : [...SET_ORDER_EN];
    } catch {
      this.setOrderEn = [...SET_ORDER_EN];
    }
    try {
      const raw = await storageGet(SET_ORDER_JA_KEY);
      this.setOrderJa = raw ? JSON.parse(raw) : [...SET_ORDER_JA];
    } catch {
      this.setOrderJa = [...SET_ORDER_JA];
    }

    this.syncSetOrders();
    this.loaded = true;
  }

  syncSetOrders() {
    const enSets = new Set<string>();
    const jaSets = new Set<string>();
    for (const c of this.cards) {
      if ((c.language || 'en') === 'ja') jaSets.add(c.set);
      else enSets.add(c.set);
    }
    this.setOrderEn = this.setOrderEn.filter((s) => enSets.has(s));
    this.setOrderJa = this.setOrderJa.filter((s) => jaSets.has(s));
    enSets.forEach((s) => {
      if (!this.setOrderEn.includes(s)) this.setOrderEn = [s, ...this.setOrderEn];
    });
    jaSets.forEach((s) => {
      if (!this.setOrderJa.includes(s)) this.setOrderJa = [s, ...this.setOrderJa];
    });
  }

  async saveCards() {
    await storageSet(CARDS_KEY, JSON.stringify(this.cards));
  }
  async saveCollection() {
    await storageSet(COLLECTION_KEY, JSON.stringify(this.collection));
  }
  async saveSetOrders() {
    await storageSet(SET_ORDER_EN_KEY, JSON.stringify(this.setOrderEn));
    await storageSet(SET_ORDER_JA_KEY, JSON.stringify(this.setOrderJa));
  }
  async saveArt(cardId: string, url: string | null) {
    if (url) {
      await storageSet(ART_KEY_PREFIX + cardId, url);
      this.artwork = { ...this.artwork, [cardId]: url };
    } else {
      await storageDelete(ART_KEY_PREFIX + cardId);
      const { [cardId]: _drop, ...rest } = this.artwork;
      this.artwork = rest;
    }
  }

  async toggleTile(tileId: string) {
    if (this.collection[tileId]) {
      const { [tileId]: _drop, ...rest } = this.collection;
      this.collection = rest;
    } else {
      this.collection = { ...this.collection, [tileId]: true };
    }
    await this.saveCollection();
  }

  async moveSet(setName: string, direction: 'up' | 'down') {
    const order = this.currentLang === 'ja' ? this.setOrderJa : this.setOrderEn;
    const i = order.indexOf(setName);
    if (i === -1) return;
    const next = [...order];
    if (direction === 'up' && i > 0) {
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
    } else if (direction === 'down' && i < order.length - 1) {
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
    } else {
      return;
    }
    if (this.currentLang === 'ja') this.setOrderJa = next;
    else this.setOrderEn = next;
    await this.saveSetOrders();
  }

  async saveCard(card: Card, pendingArtUrl: string | null | undefined) {
    if (card.id) {
      const idx = this.cards.findIndex((c) => c.id === card.id);
      if (idx === -1) return;
      this.cards[idx] = card;
    } else {
      card.id = newId(this.cards.length);
      this.cards.push(card);
    }
    if (pendingArtUrl !== undefined) {
      await this.saveArt(card.id!, pendingArtUrl);
    }
    await this.saveCards();
    this.syncSetOrders();
    await this.saveSetOrders();
  }

  async deleteCard(cardId: string) {
    this.cards = this.cards.filter((c) => c.id !== cardId);
    const next: Record<string, true> = {};
    for (const k of Object.keys(this.collection)) {
      if (!k.startsWith(cardId + '--')) next[k] = true;
    }
    this.collection = next;
    await this.saveArt(cardId, null);
    await this.saveCards();
    await this.saveCollection();
    this.syncSetOrders();
    await this.saveSetOrders();
  }

  async replaceCards(parsed: Card[]) {
    const oldBySig: Record<string, string> = {};
    for (const c of this.cards) {
      if (!c.id) continue;
      oldBySig[`${c.pokemon}|${c.set}|${c.num}|${c.language || 'en'}`] = c.id;
    }
    parsed.forEach((c, i) => {
      const sig = `${c.pokemon}|${c.set}|${c.num}|${c.language || 'en'}`;
      c.id = oldBySig[sig] || newId(i);
      c.type = c.type || 'normal';
      c.language = c.language || 'en';
    });
    this.cards = parsed;
    await this.saveCards();
    this.syncSetOrders();
    await this.saveSetOrders();
  }
}

export const appState = new AppStateClass();
