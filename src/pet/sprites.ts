// Text-art pet sprites, the same pet.json format desktop-pet uses (src/renderer/sprites.ts there).
import catJson from '../pets/cat.json';
import raccoonJson from '../pets/raccoon.json';

export type Emotion = 'neutral' | 'blink' | 'happy' | 'content' | 'sleepy' | 'sad' | 'surprised' | 'love' | 'yawn';
export type Grid = (string | null)[][];

export type PetDef = {
  id: string;
  name: string;
  width: number;
  height: number;
  palette: Record<string, string | null>;
  faces: Record<string, string[]>;
  frames: Record<string, { face?: number[]; rows: string[] }>;
  animations: Record<string, { frames: string[]; fps: number }>;
};

export const PETS: Record<'cat' | 'raccoon', PetDef> = {
  cat: catJson as unknown as PetDef,
  raccoon: raccoonJson as unknown as PetDef,
};
export type Species = keyof typeof PETS;

const gridFromRows = (rows: string[], palette: Record<string, string | null>): Grid =>
  rows.map((row) => [...row].map((ch) => palette[ch] ?? null));

const cache = new Map<string, Grid>();

/** A pose with an emotion's face drawn on top ('.' in a face keeps what's underneath). */
export function composeFrame(pet: PetDef, frameName: string, emotion: Emotion): Grid {
  const key = `${pet.id}:${frameName}:${emotion}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const frame = pet.frames[frameName] ?? pet.frames.stand;
  const grid = gridFromRows(frame.rows, pet.palette);
  if (frame.face) {
    const [fx, fy] = frame.face;
    const face = pet.faces[emotion] ?? pet.faces.neutral;
    face.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch !== '.' && grid[fy + y]) grid[fy + y][fx + x] = pet.palette[ch] ?? null;
      }),
    );
  }
  cache.set(key, grid);
  return grid;
}

export function drawGrid(ctx: CanvasRenderingContext2D, grid: Grid, size: number, mirror = false, oy = 0): void {
  const w = grid[0]?.length ?? 0;
  grid.forEach((row, y) =>
    row.forEach((color, x) => {
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect((mirror ? w - 1 - x : x) * size, oy + y * size, size, size);
    }),
  );
}

/** Draws a pet frame into a fresh canvas and returns it as a PNG data URL (for the favicon and icons). */
export function petImage(species: Species, frame = 'sit', emotion: Emotion = 'happy', size = 4): string {
  const pet = PETS[species];
  const c = document.createElement('canvas');
  c.width = pet.width * size;
  c.height = pet.height * size;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  drawGrid(ctx, composeFrame(pet, frame, emotion), size);
  return c.toDataURL('image/png');
}
