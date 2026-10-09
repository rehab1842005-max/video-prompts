const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

text = text.replace(/sitting on her chair behind the wooden desk/g, 'standing elegantly next to the huge smart screen');

// Also update the scene camera angle so she is seen standing clearly
text = text.replace(/The teacher is seated on the LEFT side of the frame/g, 'The teacher is standing on the LEFT side of the frame');

fs.writeFileSync('src/app/api/generate/route.ts', text);
