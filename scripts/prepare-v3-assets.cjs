/* Atlas slicing, transparent padding and encoding. Originals remain untouched. */
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'assets/v3');
const files = {avatar: 'assets/v3/avatar.webp', garments: [], dresses: [], hair: [], hairstyles: [], scenes: []};
const blank = () => sharp({create: {width: 362, height: 724, channels: 4, background: '#00000000'}});
async function cell(file, columns, rows, index) {
  const input = path.join(root, file);
  const m = await sharp(input).metadata();
  const x0 = Math.round(index % columns * m.width / columns);
  const y0 = Math.round(Math.floor(index / columns) * m.height / rows);
  const x1 = Math.round((index % columns + 1) * m.width / columns);
  const y1 = Math.round((Math.floor(index / columns) + 1) * m.height / rows);
  return sharp(input).extract({left: x0, top: y0, width: x1 - x0, height: y1 - y0}).resize(362, 724, {fit: 'fill'}).png().toBuffer();
}
async function garments() {
  const packs = ['assets/princesses-base-v2-original.png', ...['a','b','c','d','e'].map((n) => `assets/v3/garments-${n}-original.png`)];
  for (let pack = 0; pack < packs.length; pack++) {
    for (let item = 0; item < 6; item++) {
      const index = pack * 6 + item;
      const source = await cell(packs[pack], 3, 2, item);
      if (pack === 1 && item === 0) {
        const head = await sharp(source).extract({left: 0, top: 0, width: 362, height: 218}).toBuffer();
        await blank().composite([{input: head, top: 0, left: 0}]).webp({quality: 89, alphaQuality: 100}).toFile(path.join(out, 'avatar.webp'));
      }
      const garment = await sharp(source).extract({left: 0, top: 214, width: 362, height: 426}).toBuffer();
      const garmentFile = `assets/v3/garment-${index}.webp`;
      const thumbFile = `assets/v3/dress-${index}.webp`;
      await blank().composite([{input: garment, left: 0, top: 214}]).webp({quality: 84, alphaQuality: 95, effort: 6}).toFile(path.join(root, garmentFile));
      await sharp(garment).resize({width: 190, height: 205, fit: 'inside'}).webp({quality: 84, alphaQuality: 95}).toFile(path.join(root, thumbFile));
      files.garments.push(garmentFile); files.dresses.push(thumbFile);
    }
  }
}
async function hairstyles() {
  const packs = ['assets/hairstyles-v2.webp', 'assets/v3/hair-a-original.png', 'assets/v3/hair-b-original.png'];
  for (let pack = 0; pack < packs.length; pack++) {
    for (let item = 0; item < 6; item++) {
      const index = pack * 6 + item;
      const source = await cell(packs[pack], 3, 2, item);
      const hairFile = `assets/v3/hair-${index}.webp`;
      const thumbFile = `assets/v3/hair-thumb-${index}.webp`;
      await sharp(source).webp({quality: 86, alphaQuality: 95, effort: 6}).toFile(path.join(root, hairFile));
      const upper = await sharp(source).extract({left: 0, top: 0, width: 362, height: 530}).toBuffer();
      await sharp(upper).trim().resize({width: 190, height: 205, fit: 'inside'}).webp({quality: 84, alphaQuality: 95}).toFile(path.join(root, thumbFile));
      files.hair.push(hairFile); files.hairstyles.push(thumbFile);
    }
  }
}
async function scenes() {
  for (let index = 0; index < 12; index++) {
    const source = index < 3 ? await cell('assets/scenes-original.png', 3, 1, index) : await cell('assets/v3/scenes-original.png', 3, 3, index - 3);
    const file = `assets/v3/scene-${index}.webp`;
    await sharp(source).webp({quality: 85, effort: 6}).toFile(path.join(root, file));
    files.scenes.push(file);
  }
}
async function main() {
  await garments(); await hairstyles(); await scenes();
  fs.writeFileSync(path.join(root, 'asset-manifest.json'), JSON.stringify(files, null, 2) + '\n');
  fs.writeFileSync(path.join(root, 'assets.js'), 'window.PrincessAssetFiles = ' + JSON.stringify(files) + ';\n');
  const bytes = [files.avatar, ...Object.values(files).filter(Array.isArray).flat()].reduce((sum, file) => sum + fs.statSync(path.join(root, file)).size, 0);
  console.log(`Prepared 36 garments, 18 hairstyles, 12 scenes and matching thumbnails. Total ${(bytes / 1048576).toFixed(2)} MiB.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
