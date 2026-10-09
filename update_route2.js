const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

const injectCode = "      const configObj = JSON.parse(characterConfigStrInput || '{}');\n      const randomOutfits = ['a bright yellow sweater', 'a navy blue blazer', 'a green turtleneck', 'a red jacket', 'a purple blazer', 'a denim jacket'];\n      const randomCartoons = ['a cute blue robot', 'a fluffy orange fox', 'a green dinosaur', 'a smart owl', 'a tiny monkey', 'a penguin with a bowtie'];\n      const teacherOutfit = configObj.teacherOutfit || randomOutfits[Math.floor(Math.random() * randomOutfits.length)];\n      const cartoonCharacter = configObj.cartoonCharacter || randomCartoons[Math.floor(Math.random() * randomCartoons.length)];\n      configObj.teacherOutfit = teacherOutfit;\n      configObj.cartoonCharacter = cartoonCharacter;";

text = text.replace('      const configObj = JSON.parse(characterConfigStrInput || "{}");', injectCode);

text = text.replace(/" \+ \(configObj\.teacherOutfit \|\| "a purple headband, a white silk blouse, and a sleek purple blazer"\) \+ "/g, '" + teacherOutfit + "');
text = text.replace(/like a cute robot or animal/g, '" + cartoonCharacter + "');

text = text.replace('return NextResponse.json({ prompts: enhancedPrompts });', 'return NextResponse.json({ prompts: enhancedPrompts, teacherOutfit, cartoonCharacter });');

fs.writeFileSync('src/app/api/generate/route.ts', text);
