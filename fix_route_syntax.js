const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

text = text.replace('""- **الصوت والحوار', '"- **الصوت والحوار');
text = text.replace('""- **ديناميكية الحوار', '"- **ديناميكية الحوار');

fs.writeFileSync('src/app/api/generate/route.ts', text);
