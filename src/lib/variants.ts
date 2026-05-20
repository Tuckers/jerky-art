import type { Card } from './data/seed-cards';
import { DEFAULT_POKEBALL_SETS } from './data/seed-cards';

export type Variant = 'regular' | 'reverse_holo' | 'poke_ball' | 'master_ball' | `custom:${string}`;

export const VARIANT_LABELS: Record<string, string> = {
  regular: 'Regular',
  reverse_holo: 'Reverse Holo',
  poke_ball: 'Poké Ball Holo',
  master_ball: 'Master Ball Holo'
};

export const VARIANT_SUFFIX: Record<string, string> = {
  regular: '',
  reverse_holo: ' RH',
  poke_ball: ' Poké Ball',
  master_ball: ' Master Ball'
};

export function isCustomVariant(v: string): v is `custom:${string}` {
  return typeof v === 'string' && v.startsWith('custom:');
}

export function customVariantName(v: string): string {
  return v.slice(7);
}

export function variantLabelOf(v: string): string {
  if (isCustomVariant(v)) return customVariantName(v);
  return VARIANT_LABELS[v] ?? v;
}

export function variantSuffixOf(v: string): string {
  if (isCustomVariant(v)) return ' ' + customVariantName(v);
  return VARIANT_SUFFIX[v] ?? '';
}

export function variantCssKey(v: string): string {
  if (isCustomVariant(v)) return 'custom';
  return v;
}

export function getVariantsForCard(card: Pick<Card, 'type' | 'set' | 'pokeball' | 'customVariants'>): Variant[] {
  const customs: Variant[] = Array.isArray(card.customVariants)
    ? card.customVariants
        .filter((n): n is string => typeof n === 'string' && n.trim().length > 0)
        .map((n) => `custom:${n.trim()}` as Variant)
    : [];
  if (card.type === 'secret') return ['regular', ...customs];
  const pokeball = card.pokeball !== undefined ? card.pokeball : DEFAULT_POKEBALL_SETS.includes(card.set);
  const base: Variant[] = pokeball
    ? ['regular', 'reverse_holo', 'poke_ball', 'master_ball']
    : ['regular', 'reverse_holo'];
  return [...base, ...customs];
}
