export type Language = 'en' | 'ja';
export type CardType = 'normal' | 'secret';

export interface Card {
  id?: string;
  pokemon: string;
  set: string;
  num: string;
  type: CardType;
  language: Language;
  notes?: string;
  pokeball?: boolean;
  unreleased?: boolean;
  customVariants?: string[];
}

export const SEED_CARDS: Card[] = [
  // ENGLISH
  { pokemon: 'Lumineon V', set: 'Crown Zenith', num: 'GG39/GG70', type: 'secret', notes: 'Galarian Gallery', language: 'en' },
  { pokemon: 'Shuppet', set: 'Scarlet & Violet', num: '87/198', type: 'normal', language: 'en' },
  { pokemon: 'Medicham', set: 'Scarlet & Violet', num: '111/198', type: 'normal', language: 'en' },
  { pokemon: 'Sudowoodo', set: 'Paldea Evolved', num: '109/198', type: 'normal', language: 'en' },
  { pokemon: 'Passimian', set: 'Paldea Evolved', num: '118/198', type: 'normal', language: 'en' },
  { pokemon: 'Tropius', set: 'Paldea Evolved', num: '195/198', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Carvanha', set: 'Obsidian Flames', num: '46/197', type: 'normal', language: 'en' },
  { pokemon: 'Buizel', set: 'Obsidian Flames', num: '48/197', type: 'normal', language: 'en' },
  { pokemon: 'Rockruff', set: 'Obsidian Flames', num: '116/197', type: 'normal', language: 'en' },
  { pokemon: 'Pidgey', set: 'Obsidian Flames', num: '207/197', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Pidgeotto', set: 'Obsidian Flames', num: '208/197', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Pidgeot ex', set: 'Obsidian Flames', num: '225/197', type: 'secret', notes: 'Special Art Rare', language: 'en' },
  { pokemon: 'Bellsprout', set: '151', num: '69/165', type: 'normal', language: 'en' },
  { pokemon: 'Weepinbell', set: '151', num: '70/165', type: 'normal', language: 'en' },
  { pokemon: 'Victreebel', set: '151', num: '71/165', type: 'normal', language: 'en' },
  { pokemon: 'Pansage', set: 'Paradox Rift', num: '4/182', type: 'normal', language: 'en' },
  { pokemon: 'Tapu Koko ex', set: 'Paradox Rift', num: '247/182', type: 'secret', notes: 'Special Art Rare', language: 'en' },
  { pokemon: 'Croconaw', set: 'Temporal Forces', num: '40/162', type: 'normal', language: 'en' },
  { pokemon: 'Chimchar', set: 'Twilight Masquerade', num: '31/167', type: 'normal', language: 'en' },
  { pokemon: 'Tatsugiri', set: 'Twilight Masquerade', num: '131/167', type: 'normal', language: 'en' },
  { pokemon: 'Grubbin', set: 'Stellar Crown', num: '9/142', type: 'normal', language: 'en' },
  { pokemon: 'Azumarill', set: 'Stellar Crown', num: '34/142', type: 'normal', language: 'en' },
  { pokemon: 'Gulpin', set: 'Stellar Crown', num: '154/142', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Cetitan', set: 'Surging Sparks', num: '201/191', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Dragapult ex', set: 'Prismatic Evolutions', num: '165/131', type: 'secret', notes: 'Special Art Rare', language: 'en' },
  { pokemon: 'Ludicolo', set: 'Journey Together', num: '37/159', type: 'normal', language: 'en' },
  { pokemon: 'Greedent', set: 'Journey Together', num: '132/159', type: 'normal', language: 'en' },
  { pokemon: "Team Rocket's Flaaffy", set: 'Destined Rivals', num: '73/182', type: 'normal', language: 'en' },
  { pokemon: 'Hydrapple', set: 'Destined Rivals', num: '188/182', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Tynamo', set: 'Black Bolt', num: '30/86', type: 'normal', language: 'en' },
  { pokemon: 'Eelektrik', set: 'Black Bolt', num: '31/86', type: 'normal', language: 'en' },
  { pokemon: 'Eelektross', set: 'Black Bolt', num: '32/86', type: 'normal', language: 'en' },
  { pokemon: 'Archeops', set: 'White Flare', num: '132/86', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Makuhita', set: 'Mega Evolution', num: '72/132', type: 'normal', language: 'en' },
  { pokemon: 'Flygon', set: 'Phantasmal Flames', num: '53/94', type: 'normal', language: 'en' },
  { pokemon: 'Ludicolo', set: 'Phantasmal Flames', num: '95/94', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Tatsugiri', set: 'Mega Dream ex', num: '135/193', type: 'normal', language: 'en' },
  { pokemon: 'Dreepy', set: 'Mega Dream ex', num: '211/193', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Drakloak', set: 'Mega Dream ex', num: '212/193', type: 'secret', notes: 'Illustration Rare', language: 'en' },
  { pokemon: 'Thievul', set: 'Abyss Eye', num: '089/081', type: 'secret', notes: 'Full Art — Upcoming', language: 'en', unreleased: true },

  // JAPANESE
  { pokemon: 'Tatsugiri', set: 'Promo / Misc', num: '003/045', type: 'normal', notes: 'Japanese release', language: 'ja' },
  { pokemon: 'Nosepass', set: 'Nihil Zero', num: '036/080', type: 'normal', language: 'ja' },
  { pokemon: 'Grubbin', set: 'Start Deck 100 Battle Collection', num: '057/742', type: 'normal', language: 'ja' },
  { pokemon: 'Chimchar', set: 'Start Deck 100 Battle Collection', num: '103/742', type: 'normal', language: 'ja' },
  { pokemon: 'Croconaw', set: 'Start Deck 100 Battle Collection', num: '166/742', type: 'normal', language: 'ja' },
  { pokemon: 'Ludicolo', set: 'Start Deck 100 Battle Collection', num: '177/742', type: 'normal', language: 'ja' },
  { pokemon: 'Tynamo', set: 'Start Deck 100 Battle Collection', num: '256/742', type: 'normal', language: 'ja' },
  { pokemon: 'Eelektrik', set: 'Start Deck 100 Battle Collection', num: '257/742', type: 'normal', language: 'ja' },
  { pokemon: 'Tatsugiri', set: 'Start Deck 100 Battle Collection', num: '549/742', type: 'normal', language: 'ja' },
  { pokemon: 'Tynamo', set: 'Mega Dream ex (JP)', num: '047/193', type: 'normal', language: 'ja' },
  { pokemon: 'Eelektrik', set: 'Mega Dream ex (JP)', num: '048/193', type: 'normal', language: 'ja' },
  { pokemon: 'Tatsugiri', set: 'Mega Dream ex (JP)', num: '135/193', type: 'normal', language: 'ja' },
  { pokemon: 'Dreepy', set: 'Mega Dream ex (JP)', num: '211/193', type: 'secret', notes: 'Illustration Rare', language: 'ja' },
  { pokemon: 'Drakloak', set: 'Mega Dream ex (JP)', num: '212/193', type: 'secret', notes: 'Illustration Rare', language: 'ja' },
  { pokemon: 'Flygon', set: 'Inferno X', num: '047/080', type: 'normal', notes: 'JP equivalent of Phantasmal Flames', language: 'ja' },
  { pokemon: 'Ludicolo', set: 'Inferno X', num: '081/080', type: 'secret', notes: 'Illustration Rare', language: 'ja' },
  { pokemon: 'Tatsugiri', set: 'Starter Set MEGA Mega Gengar ex', num: '009/021', type: 'normal', language: 'ja' },
  { pokemon: 'Tatsugiri', set: 'Starter Set MEGA Mega Diancie ex', num: '009/021', type: 'normal', language: 'ja' },
  { pokemon: 'Tatsugiri', set: 'Premium Trainer Box MEGA', num: '004/043', type: 'normal', language: 'ja' },
  { pokemon: 'Makuhita', set: 'Mega Brave', num: '024/063', type: 'normal', notes: 'JP equivalent of Mega Evolution', language: 'ja' },
  { pokemon: 'Tynamo', set: 'Black Bolt (JP)', num: '033/086', type: 'normal', language: 'ja' },
  { pokemon: 'Eelektrik', set: 'Black Bolt (JP)', num: '034/086', type: 'normal', language: 'ja' },
  { pokemon: 'Eelektross', set: 'Black Bolt (JP)', num: '035/086', type: 'normal', language: 'ja' },
  { pokemon: 'Archeops', set: 'White Flare (JP)', num: '130/086', type: 'secret', notes: 'Illustration Rare', language: 'ja' },
  { pokemon: "Team Rocket's Flaaffy", set: 'Glory of Team Rocket', num: '035/098', type: 'normal', notes: 'JP equivalent of Destined Rivals', language: 'ja' }
];

// Sets that have Poke Ball + Master Ball reverse holo variants by default.
export const DEFAULT_POKEBALL_SETS: string[] = [
  'Black Bolt',
  'White Flare',
  'Prismatic Evolutions',
  'Black Bolt (JP)',
  'White Flare (JP)',
  'Mega Dream ex (JP)'
];

// Best-effort set codes for Limitless / PTCGL exports.
export const SET_CODES: Record<string, string> = {
  'Crown Zenith': 'CRZ',
  'Scarlet & Violet': 'SVI',
  'Paldea Evolved': 'PAL',
  'Obsidian Flames': 'OBF',
  '151': 'MEW',
  'Paradox Rift': 'PAR',
  'Temporal Forces': 'TEF',
  'Twilight Masquerade': 'TWM',
  'Stellar Crown': 'SCR',
  'Surging Sparks': 'SSP',
  'Prismatic Evolutions': 'PRE',
  'Journey Together': 'JTG',
  'Destined Rivals': 'DRI',
  'Black Bolt': 'BLK',
  'White Flare': 'WHF',
  'Mega Evolution': 'MEG',
  'Phantasmal Flames': 'PHF',
  'Mega Dream ex': 'MDX',
  'Abyss Eye': 'ABY'
};

export const SET_ORDER_EN: string[] = [
  'Abyss Eye', 'Mega Dream ex', 'Phantasmal Flames', 'Mega Evolution',
  'White Flare', 'Black Bolt', 'Destined Rivals', 'Journey Together',
  'Prismatic Evolutions', 'Surging Sparks', 'Stellar Crown',
  'Twilight Masquerade', 'Temporal Forces', 'Paradox Rift', '151',
  'Obsidian Flames', 'Paldea Evolved', 'Scarlet & Violet', 'Crown Zenith'
];

export const SET_ORDER_JA: string[] = [
  'Mega Dream ex (JP)', 'Starter Set MEGA Mega Gengar ex',
  'Starter Set MEGA Mega Diancie ex', 'Premium Trainer Box MEGA',
  'Mega Brave', 'White Flare (JP)', 'Black Bolt (JP)',
  'Glory of Team Rocket', 'Inferno X', 'Nihil Zero',
  'Start Deck 100 Battle Collection', 'Promo / Misc'
];
