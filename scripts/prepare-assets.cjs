/* Technical sprite slicing and WebP encoding; original generated artwork is retained. */
const sharp = require('sharp');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
async function main() {
  const princess = path.join(root, 'assets/princesses-base-v2-original.png');
  const hair = path.join(root, 'assets/hairstyles-v2-original.png');
  const scene = path.join(root, 'assets/scenes-original.png');
  const meta = await sharp(princess).metadata();
  const cellWidth = meta.width / 3;
  const cellHeight = meta.height / 2;
  if (!Number.isInteger(cellWidth) || !Number.isInteger(cellHeight) || !meta.hasAlpha) throw new Error('Sprite atlas dimensions or transparency do not match the production layout.');
  await Promise.all([
    sharp(princess).webp({quality: 85, alphaQuality: 95, effort: 6}).toFile(path.join(root, 'assets/princesses-v2.webp')),
    sharp(hair).extend({right: 1, bottom: 1, background: {r: 0, g: 0, b: 0, alpha: 0}}).webp({quality: 85, alphaQuality: 95, effort: 6}).toFile(path.join(root, 'assets/hairstyles-v2.webp')),
    sharp(scene).webp({quality: 84, effort: 6}).toFile(path.join(root, 'assets/scenes.webp')),
    ...Array.from({length: 6}, (_, index) => sharp(princess).extract({left: index % 3 * cellWidth, top: Math.floor(index / 3) * cellHeight + 222, width: cellWidth, height: 420}).resize({width: 200, height: 210, fit: 'inside'}).webp({quality: 84, alphaQuality: 95, effort: 6}).toFile(path.join(root, `assets/dress-${index}.webp`))),
    ...Array.from({length: 6}, async (_, index) => {
      const cell = await sharp(hair).extract({left: index % 3 * 352, top: Math.floor(index / 3) * 746, width: 351, height: 570}).toBuffer();
      return sharp(cell).trim().resize({width: 200, height: 210, fit: 'inside'}).webp({quality: 84, alphaQuality: 95, effort: 6}).toFile(path.join(root, `assets/hair-${index}.webp`));
    })
  ]);
  console.log('Layered character, hairstyle atlas and twelve thumbnails are ready. Original art is unchanged.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
