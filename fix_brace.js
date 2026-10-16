const fs = require('fs');
let code = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');
code = code.replace(/\}\r?\n\r?\n\s+\} else if \(videoMode === "paired"\) \{/, '} else if (videoMode === "paired") {');
fs.writeFileSync('src/app/api/generate/route.ts', code, 'utf8');
console.log('Fixed brace in route.ts');
