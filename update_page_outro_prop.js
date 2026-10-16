const fs = require('fs');

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

const targetStr = `<PromptResultList prompts={prompts} onRegenerate={handleRegenerate} />`;
const replaceStr = `<PromptResultList 
              prompts={prompts} 
              onRegenerate={handleRegenerate}
              onAddPrompt={(newPrompt) => setPrompts(prev => prev ? [...prev, newPrompt] : [newPrompt])}
              teacherOutfit={characterConfig.teacherOutfit}
            />`;

pageCode = pageCode.replace(targetStr, replaceStr);

fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');
console.log('Successfully updated PromptResultList props in page.tsx!');
