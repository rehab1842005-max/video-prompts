const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');

const idxStart = lines.findIndex(l => l.includes('const startIndex = parseInt'));
if (idxStart !== -1) {
  lines.splice(idxStart, 1);
}
const idxVideo = lines.findIndex(l => l.includes('let videoCounter = startIndex;'));
if (idxVideo !== -1) {
  lines.splice(idxVideo, 1);
}

const insertIdx = lines.findIndex(l => l.includes('const videoMode = formData.get'));
lines.splice(insertIdx + 1, 0, '    const startIndex = parseInt(formData.get("startIndex") as string || "1");');
lines.splice(insertIdx + 2, 0, '    let videoCounter = startIndex;');

fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
