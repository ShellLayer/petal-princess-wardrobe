/* Publish only the game and the compressed images in the current manifest. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, 'dist');

// Keep recursive cleanup confined to this project's fixed build directory.
if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
  throw new Error('Invalid site output directory.');
}
fs.rmSync(output, {recursive: true, force: true});
fs.mkdirSync(output, {recursive: true});

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'asset-manifest.json'), 'utf8'));
const images = [...new Set(Object.values(manifest).flat())];
for (const image of images) {
  if (typeof image !== 'string' || !/^assets\/[a-zA-Z0-9/_.-]+\.webp$/.test(image) || image.split('/').includes('..')) {
    throw new Error(`Invalid production asset: ${image}`);
  }
}
const files = [
  'index.html', 'styles.css', 'large-play.css', 'ancient-play.css', 'beauty-play.css',
  'assets.js', 'game-data.js', 'ancient-data.js', 'beauty-data.js', 'fitting-data.js',
  'character-renderer.js', 'app.js', 'LICENSE', ...images
];
let bytes = 0;
for (const file of files) {
  const source = path.join(root, file);
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  if (file === 'styles.css') {
    const css = fs.readFileSync(source, 'utf8')
      .replace("url('assets/princesses.webp')", 'none')
      .replace("url('assets/scenes.webp')", 'none');
    fs.writeFileSync(target, css);
  } else {
    fs.copyFileSync(source, target);
  }
  bytes += fs.statSync(target).size;
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log(`Static site: ${files.length} files, ${(bytes / 1048576).toFixed(2)} MiB. No source PNGs or development files included.`);
