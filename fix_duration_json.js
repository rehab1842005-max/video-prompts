const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

text = text.replace(/\"duration\": \"10 seconds\",/g, '\"duration\": \"10 seconds (أو 6 seconds للحوار القصير)\",');

fs.writeFileSync('src/app/api/generate/route.ts', text);
