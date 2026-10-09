const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');
lines[53] = lines[53].replace(/"Sci\.Rehab Elsibai"/g, '\\"Sci.Rehab Elsibai\\"');
fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
