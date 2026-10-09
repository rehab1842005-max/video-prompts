const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /if \(!isContinuing\) \{[\s\S]*?teacherOutfit: "",\s*cartoonCharacter: "",\s*previousStoryContext: "",\s*\}\)\);\s*\}/;

const replace = \if (!isContinuing) {
        const randomOutfits = ['a bright yellow sweater', 'a navy blue blazer', 'a green turtleneck', 'a red jacket', 'a purple blazer', 'a denim jacket'];
        const randomCartoons = ['a cute blue robot', 'a fluffy orange fox', 'a green dinosaur', 'a smart owl', 'a tiny monkey', 'a penguin with a bowtie'];
        
        setPrompts(null);
        setNextProcessingIndex(0);
        setCharacterConfig(prev => ({
          ...prev,
          teacherOutfit: randomOutfits[Math.floor(Math.random() * randomOutfits.length)],
          cartoonCharacter: randomCartoons[Math.floor(Math.random() * randomCartoons.length)],
          previousStoryContext: ""
        }));
      }\;

text = text.replace(regex, replace);
fs.writeFileSync('src/app/page.tsx', text);
