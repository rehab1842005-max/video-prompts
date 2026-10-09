const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

text = text.replace(/\"duration\": \"10 seconds \(أو 6 seconds للحوار القصير\)\",/g, '\"duration\": \"استنتج المدة بالثواني بناء على عدد الكلمات كما في القاعدة\",');

fs.writeFileSync('src/app/api/generate/route.ts', text);
