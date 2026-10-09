const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

const injectCode = \      const configObj = JSON.parse(characterConfigStrInput || "{}");
      
      const randomOutfits = [
        "a bright yellow sweater and a stylish white scarf",
        "a professional navy blue blazer and a light pink blouse",
        "a casual green turtleneck and a silver necklace",
        "a stylish red jacket over a black t-shirt",
        "a purple headband, a white silk blouse, and a sleek purple blazer",
        "a trendy denim jacket with a white t-shirt",
        "an elegant emerald green dress",
        "a light blue button-down shirt with rolled up sleeves"
      ];
      const randomCartoons = [
        "a cute tiny blue robot with glowing eyes",
        "a hilarious small fluffy orange fox with big ears",
        "a tiny clumsy green dinosaur wearing a backpack",
        "a smart little owl wearing oversized reading glasses",
        "a funny tiny monkey holding a banana",
        "a cute little penguin wearing a red bowtie",
        "a tiny floating astronaut with a shiny helmet"
      ];
      
      const teacherOutfit = configObj.teacherOutfit || randomOutfits[Math.floor(Math.random() * randomOutfits.length)];
      const cartoonCharacter = configObj.cartoonCharacter || randomCartoons[Math.floor(Math.random() * randomCartoons.length)];
      
      configObj.teacherOutfit = teacherOutfit;
      configObj.cartoonCharacter = cartoonCharacter;\;

text = text.replace('      const configObj = JSON.parse(characterConfigStrInput || "{}");', injectCode);

text = text.replace(/\" \+ \(configObj\.teacherOutfit \|\| \"a purple headband, a white silk blouse, and a sleek purple blazer\"\) \+ \"/g, '" + teacherOutfit + "');
text = text.replace(/like a cute robot or animal/g, '" + cartoonCharacter + "');

text = text.replace('return NextResponse.json({ prompts: enhancedPrompts });', 'return NextResponse.json({ prompts: enhancedPrompts, teacherOutfit, cartoonCharacter });');

fs.writeFileSync('src/app/api/generate/route.ts', text);
