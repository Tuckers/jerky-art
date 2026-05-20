import { SET_CODES } from './data/seed-cards';

interface TileLike {
  pokemon: string;
  set: string;
  num: string;
  language: string;
}

export function tcgplayerUrl(tile: TileLike): string {
  const q = encodeURIComponent(`${tile.pokemon} ${tile.set}`);
  return `https://www.tcgplayer.com/search/pokemon/product?q=${q}`;
}

export function limitlessUrl(tile: TileLike): string {
  const setCode = SET_CODES[tile.set];
  const num = tile.num.split('/')[0].replace(/^0+/, '');
  if (setCode && num) return `https://limitlesstcg.com/cards/${setCode}/${num}`;
  return `https://limitlesstcg.com/cards?q=${encodeURIComponent(tile.pokemon)}`;
}

export function artOfPkmUrl(): string {
  return 'https://artofpkm.com/?artist=Jerky';
}
