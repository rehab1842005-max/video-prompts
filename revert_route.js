const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

text = text.replace(/return NextResponse\.json\(\{ prompts: enhancedPrompts, teacherOutfit, cartoonCharacter \}\);/g, 'return NextResponse.json({ prompts: enhancedPrompts });');

text = text.replace(/" \+ teacherOutfit \+ "/g, '" + (configObj.teacherOutfit || "a purple headband, a white silk blouse, and a sleek purple blazer") + "');
text = text.replace(/" \+ cartoonCharacter \+ "/g, '" + (configObj.cartoonCharacter || "a cute robot or animal") + "');

fs.writeFileSync('src/app/api/generate/route.ts', text);
