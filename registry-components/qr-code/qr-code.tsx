"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface around the code. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Rendered width preset, or an exact number of pixels. */
type Size = "sm" | "default" | "lg";

/** How much of the code can be lost and still read: about 7%, 15%, 25% or 30%. */
export type QrErrorCorrection = "L" | "M" | "Q" | "H";

/** Shape of the data modules. */
export type QrModuleStyle = "square" | "rounded" | "dots";

/** Shape of the three corner eyes. */
export type QrFinderStyle = "square" | "rounded" | "circle";

export interface QrLogo {
  src: string;
  /** Width of the logo as a share of the code, 0.1 to 0.3. */
  size?: number;
  /** Clear space around the logo, in modules. */
  padding?: number;
  /** Round the cleared plate behind the logo. */
  rounded?: boolean;
  alt?: string;
}

export interface QrMatrix {
  version: number;
  ecc: QrErrorCorrection;
  mask: number;
  /** Modules per side, without the quiet zone. */
  size: number;
  /** `modules[y][x]` is true for a dark module. */
  modules: boolean[][];
}

export interface QrCodeProps {
  /** The text or URL to encode. Encoded as UTF-8 bytes. */
  value: string;
  /**
   * Error correction level. A logo raises it to H automatically.
   * @defaultValue "M" */
  ecc?: QrErrorCorrection;
  /** @defaultValue "square" */
  moduleStyle?: QrModuleStyle;
  /** @defaultValue "square" */
  finderStyle?: QrFinderStyle;
  /**
   * Dark module color. Any CSS color, tokens included.
   * @defaultValue "currentColor" */
  color?: string;
  /**
   * Light module color, drawn behind the whole code including the quiet zone.
   * @defaultValue "transparent" */
  background?: string;
  /**
   * Light border around the code, in modules. The standard asks for 4; 2 reads
   * reliably on screens with good contrast around it.
   * @defaultValue 2 */
  quietZone?: number;
  /** An image centered on the code, over a cleared plate. */
  logo?: QrLogo;
  /** Rendered width: a preset or pixels. @defaultValue "default" */
  size?: Size | number;
  /** @defaultValue "muted" */
  tone?: Tone;
  /** Accessible name. Defaults to "QR code for" plus the value. */
  title?: string;
  className?: string;
}

export const qrCodeDemo: QrCodeProps = {
  value: "https://beste.co",
  ecc: "M",
  moduleStyle: "rounded",
  finderStyle: "rounded",
  quietZone: 2,
  size: "default",
  tone: "muted",
};

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted text-foreground",
  outline: "border border-border bg-background text-foreground",
  ghost: "text-foreground",
};

const sizePixels: Record<Size, number> = { sm: 128, default: 192, lg: 256 };
const padStyles: Record<Size, string> = { sm: "rounded-lg p-2", default: "rounded-xl p-3", lg: "rounded-2xl p-4" };

/* ---------------------------------------------------------------- encoder */

const ECC_ORDER: QrErrorCorrection[] = ["L", "M", "Q", "H"];
const FORMAT_BITS: Record<QrErrorCorrection, number> = { L: 1, M: 0, Q: 3, H: 2 };

// Error correction codewords per block, then the number of blocks, indexed [level][version]
const ECC_PER_BLOCK: number[][] = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const BLOCKS: number[][] = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

const at = (table: number[][], ecc: QrErrorCorrection, version: number) =>
  table[ECC_ORDER.indexOf(ecc)]?.[version] ?? 0;

function rawDataModules(version: number) {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    result -= (25 * align - 10) * align - 55;
    if (version >= 7) result -= 36;
  }
  return result;
}

const dataCodewords = (version: number, ecc: QrErrorCorrection) =>
  Math.floor(rawDataModules(version) / 8) - at(ECC_PER_BLOCK, ecc, version) * at(BLOCKS, ecc, version);

function gfMultiply(x: number, y: number) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number) {
  const result: number[] = new Array(degree - 1).fill(0);
  result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMultiply(result[j] ?? 0, root);
      if (j + 1 < result.length) result[j] = (result[j] ?? 0) ^ (result[j + 1] ?? 0);
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function rsRemainder(data: number[], divisor: number[]) {
  const result: number[] = divisor.map(() => 0);
  for (const byte of data) {
    const factor = byte ^ (result.shift() ?? 0);
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] = (result[i] ?? 0) ^ gfMultiply(coef, factor);
    });
  }
  return result;
}

function alignmentPositions(version: number) {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const result = [6];
  for (let pos = version * 4 + 17 - 7; result.length < count; pos -= step) result.splice(1, 0, pos);
  return result;
}

const bit = (value: number, index: number) => ((value >>> index) & 1) !== 0;

function maskHit(mask: number, x: number, y: number) {
  switch (mask) {
    case 0: return (x + y) % 2 === 0;
    case 1: return y % 2 === 0;
    case 2: return x % 3 === 0;
    case 3: return (x + y) % 3 === 0;
    case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

/**
 * Encodes text as a QR code: byte mode (UTF-8), the smallest version from 1 to 40
 * that fits, Reed-Solomon error correction and the mask with the lowest penalty.
 * Throws when the text is too long for version 40 at the chosen level.
 */
export function encodeQr(value: string, ecc: QrErrorCorrection = "M"): QrMatrix {
  const bytes = Array.from(new TextEncoder().encode(value));

  let version = 1;
  for (; ; version++) {
    if (version > 40) throw new RangeError("The value is too long for a QR code at this error correction level.");
    const countBits = version <= 9 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= dataCodewords(version, ecc) * 8) break;
  }

  // Mode indicator, character count, then the bytes themselves
  const bits: number[] = [];
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, version <= 9 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  const capacity = dataCodewords(version, ecc) * 8;
  push(0, Math.min(4, capacity - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] ?? 0);
    data.push(byte);
  }

  // Split into blocks, add error correction to each, then interleave
  const blockCount = at(BLOCKS, ecc, version);
  const blockEcc = at(ECC_PER_BLOCK, ecc, version);
  const rawCodewords = Math.floor(rawDataModules(version) / 8);
  const shortBlocks = blockCount - (rawCodewords % blockCount);
  const shortLen = Math.floor(rawCodewords / blockCount);
  const divisor = rsDivisor(blockEcc);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < blockCount; i++) {
    const chunk = data.slice(k, k + shortLen - blockEcc + (i < shortBlocks ? 0 : 1));
    k += chunk.length;
    const eccBytes = rsRemainder(chunk, divisor);
    if (i < shortBlocks) chunk.push(0);
    blocks.push(chunk.concat(eccBytes));
  }
  const codewords: number[] = [];
  const blockLen = blocks[0]?.length ?? 0;
  for (let i = 0; i < blockLen; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortLen - blockEcc || j >= shortBlocks) codewords.push(block[i] ?? 0);
    });
  }

  const size = version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    const row = modules[y];
    const flag = reserved[y];
    if (!row || !flag) return;
    row[x] = dark;
    flag[x] = true;
  };

  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]] as const) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, dist !== 2 && dist !== 4);
      }
    }
  }
  const aligns = alignmentPositions(version);
  aligns.forEach((ay, i) => {
    aligns.forEach((ax, j) => {
      const last = aligns.length - 1;
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    });
  });

  const drawFormat = (mask: number) => {
    const fdata = (FORMAT_BITS[ecc] << 3) | mask;
    let rem = fdata;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const fbits = ((fdata << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) set(8, i, bit(fbits, i));
    set(8, 7, bit(fbits, 6));
    set(8, 8, bit(fbits, 7));
    set(7, 8, bit(fbits, 8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(fbits, i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(fbits, i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(fbits, i));
    set(8, size - 8, true);
  };
  drawFormat(0);

  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const vbits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, bit(vbits, i));
      set(b, a, bit(vbits, i));
    }
  }

  // Zigzag the codewords through the free modules, two columns at a time from the right
  let index = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        const row = modules[y];
        if (!row || reserved[y]?.[x] || index >= codewords.length * 8) continue;
        row[x] = bit(codewords[index >>> 3] ?? 0, 7 - (index & 7));
        index++;
      }
    }
  }

  const applyMask = (mask: number) => {
    for (let y = 0; y < size; y++) {
      const row = modules[y];
      if (!row) continue;
      for (let x = 0; x < size; x++) if (!reserved[y]?.[x] && maskHit(mask, x, y)) row[x] = !row[x];
    }
  };

  let best = 0;
  let lowest = Number.POSITIVE_INFINITY;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormat(mask);
    const score = penalty(modules, size);
    if (score < lowest) {
      lowest = score;
      best = mask;
    }
    applyMask(mask);
  }
  applyMask(best);
  drawFormat(best);

  return { version, ecc, mask: best, size, modules };
}

function penalty(modules: boolean[][], size: number) {
  let result = 0;
  const addHistory = (run: number, history: number[]) => {
    if (history[0] === 0) run += size;
    history.pop();
    history.unshift(run);
  };
  const countFinder = (h: number[]) => {
    const n = h[1] ?? 0;
    const core = n > 0 && h[2] === n && h[3] === n * 3 && h[4] === n && h[5] === n;
    return (core && (h[0] ?? 0) >= n * 4 && (h[6] ?? 0) >= n ? 1 : 0) + (core && (h[6] ?? 0) >= n * 4 && (h[0] ?? 0) >= n ? 1 : 0);
  };
  const line = (get: (i: number) => boolean) => {
    let runColor = false;
    let run = 0;
    const history = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < size; i++) {
      if (get(i) === runColor) {
        run++;
        if (run === 5) result += 3;
        else if (run > 5) result++;
      } else {
        addHistory(run, history);
        if (!runColor) result += countFinder(history) * 40;
        runColor = get(i);
        run = 1;
      }
    }
    if (runColor) {
      addHistory(run, history);
      run = 0;
    }
    run += size;
    addHistory(run, history);
    result += countFinder(history) * 40;
  };
  for (let y = 0; y < size; y++) line((x) => modules[y]?.[x] ?? false);
  for (let x = 0; x < size; x++) line((y) => modules[y]?.[x] ?? false);

  let dark = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = modules[y]?.[x] ?? false;
      if (c) dark++;
      if (x < size - 1 && y < size - 1 && c === modules[y]?.[x + 1] && c === modules[y + 1]?.[x] && c === modules[y + 1]?.[x + 1]) result += 3;
    }
  }
  const total = size * size;
  result += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
  return result;
}

/* --------------------------------------------------------------- drawing */

interface DrawOptions {
  moduleStyle: QrModuleStyle;
  finderStyle: QrFinderStyle;
  quietZone: number;
  logo?: QrLogo;
}

interface Drawing {
  /** Side of the viewBox, quiet zone included. */
  view: number;
  modules: string;
  finders: string;
  plate?: { x: number; size: number; radius: number };
  logoBox?: { x: number; size: number };
}

const f = (n: number) => Number(n.toFixed(3));

function roundedRect(x: number, y: number, w: number, h: number, r: [number, number, number, number]) {
  const [tl, tr, br, bl] = r;
  return `M${f(x + tl)} ${f(y)}h${f(w - tl - tr)}${tr ? `a${tr} ${tr} 0 0 1 ${tr} ${tr}` : ""}v${f(h - tr - br)}${br ? `a${br} ${br} 0 0 1 ${-br} ${br}` : ""}h${f(-(w - br - bl))}${bl ? `a${bl} ${bl} 0 0 1 ${-bl} ${-bl}` : ""}v${f(-(h - bl - tl))}${tl ? `a${tl} ${tl} 0 0 1 ${tl} ${-tl}` : ""}z`;
}

function drawMatrix(matrix: QrMatrix, { moduleStyle, finderStyle, quietZone, logo }: DrawOptions): Drawing {
  const { size, modules } = matrix;
  const q = Math.max(0, quietZone);
  const view = size + q * 2;
  const inFinder = (x: number, y: number) => (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);

  // The logo plate clears whole modules around the image
  let plate: Drawing["plate"];
  let logoBox: Drawing["logoBox"];
  let clearFrom = -1;
  let clearTo = -1;
  if (logo) {
    const share = Math.min(0.3, Math.max(0.1, logo.size ?? 0.22));
    const pad = Math.max(0, logo.padding ?? 1);
    const logoSide = size * share;
    let side = Math.ceil(logoSide + pad * 2);
    if ((size - side) % 2 !== 0) side++;
    clearFrom = (size - side) / 2;
    clearTo = clearFrom + side;
    plate = { x: clearFrom + q, size: side, radius: logo.rounded === false ? 0 : Math.min(side / 2, 1.5) };
    logoBox = { x: q + (size - logoSide) / 2, size: logoSide };
  }
  const cleared = (x: number, y: number) => x >= clearFrom && x < clearTo && y >= clearFrom && y < clearTo;
  const dark = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < size && y < size && (modules[y]?.[x] ?? false) && !inFinder(x, y) && !cleared(x, y);

  let path = "";
  for (let y = 0; y < size; y++) {
    if (moduleStyle === "square") {
      for (let x = 0; x < size; x++) {
        if (!dark(x, y)) continue;
        let run = 1;
        while (dark(x + run, y)) run++;
        path += `M${x + q} ${y + q}h${run}v1h${-run}z`;
        x += run - 1;
      }
      continue;
    }
    for (let x = 0; x < size; x++) {
      if (!dark(x, y)) continue;
      if (moduleStyle === "dots") {
        const r = 0.42;
        path += `M${f(x + q + 0.5 - r)} ${f(y + q + 0.5)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0z`;
        continue;
      }
      // A corner is rounded only where both of its neighbours are light, so runs flow together
      const r = 0.5;
      const up = dark(x, y - 1);
      const down = dark(x, y + 1);
      const left = dark(x - 1, y);
      const right = dark(x + 1, y);
      path += roundedRect(x + q, y + q, 1, 1, [!up && !left ? r : 0, !up && !right ? r : 0, !down && !right ? r : 0, !down && !left ? r : 0]);
    }
  }

  let finders = "";
  for (const [fx, fy] of [[0, 0], [size - 7, 0], [0, size - 7]] as const) {
    const x = fx + q;
    const y = fy + q;
    if (finderStyle === "circle") {
      finders += `M${x} ${y + 3.5}a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM${x + 1} ${y + 3.5}a2.5 2.5 0 1 1 5 0a2.5 2.5 0 1 1 -5 0z`;
      finders += `M${x + 2} ${y + 3.5}a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0z`;
    } else {
      const ro = finderStyle === "rounded" ? 2 : 0;
      const ri = finderStyle === "rounded" ? 1.4 : 0;
      const rc = finderStyle === "rounded" ? 0.9 : 0;
      finders += roundedRect(x, y, 7, 7, [ro, ro, ro, ro]);
      // The hole runs the other way round so the fill leaves it open
      finders += `M${x + 1 + ri} ${y + 1}${ri ? `a${ri} ${ri} 0 0 0 ${-ri} ${ri}` : ""}v${f(5 - ri * 2)}${ri ? `a${ri} ${ri} 0 0 0 ${ri} ${ri}` : ""}h${f(5 - ri * 2)}${ri ? `a${ri} ${ri} 0 0 0 ${ri} ${-ri}` : ""}v${f(-(5 - ri * 2))}${ri ? `a${ri} ${ri} 0 0 0 ${-ri} ${-ri}` : ""}z`;
      finders += roundedRect(x + 2, y + 2, 3, 3, [rc, rc, rc, rc]);
    }
  }

  return { view, modules: path, finders, plate, logoBox };
}

interface SvgStringOptions {
  ecc?: QrErrorCorrection;
  moduleStyle?: QrModuleStyle;
  finderStyle?: QrFinderStyle;
  quietZone?: number;
  /** Dark color, written as given. Resolve tokens first for files leaving the page. */
  color?: string;
  background?: string;
  logo?: QrLogo;
  /** Width and height attributes in pixels. */
  pixels?: number;
}

const escapeXml = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The code as a standalone SVG document, for copying or saving. */
export function toSvgString(value: string, options: SvgStringOptions = {}) {
  const ecc = options.logo ? "H" : (options.ecc ?? "M");
  const drawing = drawMatrix(encodeQr(value, ecc), {
    moduleStyle: options.moduleStyle ?? "square",
    finderStyle: options.finderStyle ?? "square",
    quietZone: options.quietZone ?? 2,
    logo: options.logo,
  });
  const color = options.color ?? "#000";
  const bg = options.background ?? "#fff";
  const px = options.pixels ?? 512;
  const { view, plate, logoBox, logo } = { ...drawing, logo: options.logo };
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${view} ${view}" width="${px}" height="${px}" shape-rendering="${options.moduleStyle === "square" || !options.moduleStyle ? "crispEdges" : "geometricPrecision"}">`;
  if (bg !== "transparent") out += `<rect width="${view}" height="${view}" fill="${escapeXml(bg)}"/>`;
  out += `<path fill="${escapeXml(color)}" fill-rule="evenodd" d="${drawing.modules}${drawing.finders}"/>`;
  if (plate && logoBox && logo) {
    out += `<rect x="${plate.x}" y="${plate.x}" width="${plate.size}" height="${plate.size}" rx="${plate.radius}" fill="${escapeXml(bg === "transparent" ? "#fff" : bg)}"/>`;
    out += `<image href="${escapeXml(logo.src)}" x="${f(logoBox.x)}" y="${f(logoBox.x)}" width="${f(logoBox.size)}" height="${f(logoBox.size)}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  return `${out}</svg>`;
}

// Resolves tokens and currentColor to a literal color, so a saved file looks like the page
function resolveCssColor(color: string, context?: Element | null) {
  if (typeof document === "undefined") return color;
  const probe = document.createElement("span");
  probe.style.color = color;
  (context ?? document.body).appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || color;
}

/**
 * Saves the code as a PNG. Tokens are resolved against `context` (the rendered code,
 * usually). A logo from another origin without CORS headers falls back to an SVG file.
 */
export async function downloadQrPng(
  value: string,
  options: SvgStringOptions & { fileName?: string; context?: Element | null } = {},
) {
  const { fileName = "qr-code", context, ...rest } = options;
  const color = resolveCssColor(rest.color ?? "currentColor", context);
  const background = rest.background && rest.background !== "transparent" ? resolveCssColor(rest.background, context) : "#ffffff";
  const pixels = rest.pixels ?? 1024;
  const svg = toSvgString(value, { ...rest, color, background, pixels });
  const save = (href: string, ext: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = `${fileName}.${ext}`;
    a.click();
  };
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("The code could not be drawn."));
      image.src = svgUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = pixels;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2D canvas.");
    ctx.drawImage(image, 0, 0, pixels, pixels);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("The canvas could not be read.");
    const pngUrl = URL.createObjectURL(blob);
    save(pngUrl, "png");
    setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
  } catch {
    save(svgUrl, "svg");
  } finally {
    setTimeout(() => URL.revokeObjectURL(svgUrl), 1000);
  }
}

/* ------------------------------------------------------------- component */

export function QrCode({
  value,
  ecc = "M",
  moduleStyle = "square",
  finderStyle = "square",
  color = "currentColor",
  background = "transparent",
  quietZone = 2,
  logo,
  size = "default",
  tone = "muted",
  title,
  className,
}: QrCodeProps) {
  const level = logo ? "H" : ecc;
  const result = React.useMemo(() => {
    try {
      return { matrix: encodeQr(value, level), error: null };
    } catch (error) {
      return { matrix: null, error: error instanceof Error ? error.message : "The value could not be encoded." };
    }
  }, [value, level]);
  const drawing = React.useMemo(
    () => (result.matrix ? drawMatrix(result.matrix, { moduleStyle, finderStyle, quietZone, logo }) : null),
    [result.matrix, moduleStyle, finderStyle, quietZone, logo],
  );

  const pixels = typeof size === "number" ? size : sizePixels[size];
  const pad = padStyles[typeof size === "number" ? "default" : size];
  const label = title ?? `QR code for ${value}`;

  return (
    <div
      data-slot="qr-code"
      data-version={result.matrix?.version}
      data-ecc={level}
      className={cn("inline-flex max-w-full select-none", toneStyles[tone], tone !== "ghost" && pad, className)}
    >
      {drawing ? (
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${drawing.view} ${drawing.view}`}
          width={pixels}
          height={pixels}
          shapeRendering={moduleStyle === "square" ? "crispEdges" : "geometricPrecision"}
          className="block h-auto max-w-full"
        >
          <title>{label}</title>
          {background !== "transparent" && <rect width={drawing.view} height={drawing.view} fill={background} />}
          <path fill={color} fillRule="evenodd" d={drawing.modules + drawing.finders} />
          {drawing.plate && drawing.logoBox && logo && (
            <>
              <rect
                x={drawing.plate.x}
                y={drawing.plate.x}
                width={drawing.plate.size}
                height={drawing.plate.size}
                rx={drawing.plate.radius}
                fill={background === "transparent" ? "none" : background}
              />
              <image
                href={logo.src}
                x={drawing.logoBox.x}
                y={drawing.logoBox.x}
                width={drawing.logoBox.size}
                height={drawing.logoBox.size}
                preserveAspectRatio="xMidYMid meet"
              >
                {logo.alt && <title>{logo.alt}</title>}
              </image>
            </>
          )}
        </svg>
      ) : (
        <div
          role="img"
          aria-label={result.error ?? label}
          style={{ width: pixels, height: pixels }}
          className="grid max-w-full place-items-center rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground"
        >
          {result.error}
        </div>
      )}
    </div>
  );
}
