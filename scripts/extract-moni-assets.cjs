// Extract the supplied motion document without executing its scripts.
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(process.argv[2], 'utf8');
const folder = path.resolve('public/assets/moni');
fs.mkdirSync(folder, { recursive: true });
const matches = [...source.matchAll(/["']?(idle|bounce|hello|dance|talk|laugh|bored|think|sneak|peek|hide|surprise)["']?\s*:\s*["']data:image\/(png|webp);base64,([A-Za-z0-9+/=]+)["']/g)];
if (matches.length !== 12) throw new Error(`Expected 12 supplied assets, found ${matches.length}`);
for (const [, state, extension, data] of matches) {
  const file = path.join(folder, `${state}.${extension}`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, Buffer.from(data, 'base64'));
  console.log(state, fs.statSync(file).size);
}
