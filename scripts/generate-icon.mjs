import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2d5016"/>
      <stop offset="100%" stop-color="#1a3a0a"/>
    </linearGradient>
    <linearGradient id="tea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7cb342"/>
      <stop offset="100%" stop-color="#558b2f"/>
    </linearGradient>
  </defs>
  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="url(#bg)"/>
  <!-- Cup body -->
  <path d="M130 200 h190 l-15 160 c-2 20-18 35-38 35 h-84 c-20 0-36-15-38-35 z" fill="#f5f5f0" stroke="#ddd" stroke-width="3"/>
  <!-- Tea liquid -->
  <path d="M140 230 h170 l-12 120 c-1 15-14 27-30 27 h-86 c-16 0-29-12-30-27 z" fill="url(#tea)" opacity="0.85"/>
  <!-- Cup handle -->
  <path d="M320 220 c50 0 60 40 50 70 c-8 25-35 40-55 35" fill="none" stroke="#f5f5f0" stroke-width="18" stroke-linecap="round"/>
  <path d="M320 220 c50 0 60 40 50 70 c-8 25-35 40-55 35" fill="none" stroke="#ddd" stroke-width="12" stroke-linecap="round"/>
  <!-- Steam -->
  <path d="M190 185 c0-20 15-20 15-40 c0-18-15-18-15-38" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
  <path d="M225 175 c0-25 15-25 15-50 c0-22-15-22-15-45" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
  <path d="M260 185 c0-20 15-20 15-40 c0-18-15-18-15-38" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
</svg>
`;

const outPath = join(__dirname, "..", "app-icon.png");
await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(outPath);
console.log("Generated app-icon.png");
