const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  lines[i] = lines[i].replace(/A giant LED screen in the background showing the exact typographic text \\"Sci\.Rehab Elsibai\\"./g, 'A glowing neon sign displaying the exact typographic text \\"Sci.Rehab Elsibai\\".');
}

fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
