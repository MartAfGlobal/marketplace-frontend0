const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      walk(fp, filelist);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      filelist.push(fp);
    }
  });
  return filelist;
}

const root = path.resolve(__dirname, '..');
const files = walk(root);
let found = false;
files.forEach(file => {
  try {
    if (file.includes('node_modules')) return;
    const txt = fs.readFileSync(file, 'utf8');
    const lines = txt.split(/\r?\n/);
    const imports = lines.filter(l => /^\s*import\s/.test(l)).map(l => l.trim());
    const counts = imports.reduce((acc, imp) => {
      acc[imp] = (acc[imp] || 0) + 1;
      return acc;
    }, {});
    const duplicates = Object.entries(counts).filter(([,c]) => c > 1).map(([imp,c]) => ({imp,c}));
    if (duplicates.length) {
      found = true;
      console.log(`File: ${file}`);
      duplicates.forEach(d => console.log(`  ${d.c}x ${d.imp}`));
      console.log('');
    }
  } catch (err) {
    // ignore
  }
});
if (!found) console.log('No duplicate import lines found.');
