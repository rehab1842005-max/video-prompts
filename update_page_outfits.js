const fs = require('fs');

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Update initial characterConfig state
const oldInitial = `  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
    description: "",
    characterLock: true,
    sceneLock: true,
    continuityLock: true,
    isFinalScene: false,
    previousStoryContext: "",
  });`;

const newInitial = `  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
    description: "",
    characterLock: true,
    sceneLock: true,
    continuityLock: true,
    isFinalScene: false,
    previousStoryContext: "",
    teacherOutfit: "a stunning sparkly silver glitter blazer over a crisp white blouse and sleek dark trousers",
  });`;

pageCode = pageCode.replace(oldInitial, newInitial);

// 2. Update randomOutfits array
const oldOutfits = `        const randomOutfits = ['a bright yellow sweater', 'a navy blue blazer', 'a green turtleneck', 'a red jacket', 'a purple blazer', 'a denim jacket'];`;
const newOutfits = `        const randomOutfits = [
          'a stunning sparkly silver glitter blazer over a crisp white blouse and sleek dark trousers',
          'an elegant royal navy blue blazer with satin lapels over a cream silk blouse and dark pants',
          'a chic emerald green blazer with gold buttons over a crisp white top',
          'a glamorous rose gold blazer with subtle sparkles over a white blouse',
          'a stylish pastel lavender blazer over a white lace top and tailored trousers',
          'a vibrant crimson red blazer over a white silk blouse with tailored trousers',
          'a modern sapphire blue blazer over a crisp white top and dark pants'
        ];`;

pageCode = pageCode.replace(oldOutfits, newOutfits);

fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');
console.log('Successfully updated page.tsx with TV host outfits!');
