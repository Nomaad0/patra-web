#!/usr/bin/env node
/**
 * Génère les icônes PWA depuis public/patra-logo.svg
 * Usage : node scripts/generate-icons.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC = path.join(__dirname, '..', 'public');
const svgPath = path.join(PUBLIC, 'patra-logo.svg');

if (!fs.existsSync(svgPath)) {
  console.error('❌ patra-logo.svg introuvable dans public/');
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

// #0E1430 → R:14 G:20 B:48
const BG = { r: 14, g: 20, b: 48, alpha: 255 };

async function generateIcon(size, outputName, logoRatio) {
  const logoSize = Math.round(size * logoRatio);
  const offset = Math.round((size - logoSize) / 2);

  // Redimensionner le SVG
  const resizedLogo = await sharp(svgBuffer)
    .resize(logoSize, logoSize)
    .png()
    .toBuffer();

  // Fond opaque + logo centré
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG
    }
  })
    .composite([{ input: resizedLogo, top: offset, left: offset }])
    .png()
    .toFile(path.join(PUBLIC, outputName));

  console.log(`✅ ${outputName} (${size}×${size}, logo ${Math.round(logoRatio * 100)}%)`);
}

async function main() {
  await generateIcon(192, 'icon-192.png', 0.9);
  await generateIcon(512, 'icon-512.png', 0.9);
  await generateIcon(512, 'icon-512-maskable.png', 0.8); // zone safe maskable : 80%
  await generateIcon(180, 'apple-touch-icon.png', 0.9);
  console.log('\n✅ Toutes les icônes PWA générées dans public/');
}

main().catch(err => {
  console.error('❌ Erreur génération icônes :', err.message);
  process.exit(1);
});
