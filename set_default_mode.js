const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

text = text.replace('useState<"cartoon" | "teacher" | "review" | "studio" | "story" | "gameshow">("cartoon");', 'useState<"cartoon" | "teacher" | "review" | "studio" | "story" | "gameshow">("studio");');

fs.writeFileSync('src/app/page.tsx', text);
