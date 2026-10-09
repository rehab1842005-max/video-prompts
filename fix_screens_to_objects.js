const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  // Replace smart screen logic in generic rule
  lines[i] = lines[i].replace(/- \*\*الشاشات الذكية والتمثيل المضحك.*?تداخل النصوص\.\)/g, '- **التجسيد البصري المجسم (Hologram/Objects) بدلاً من الشاشات:** ممنوع استخدام أي شاشات ذكية (No smart screens)! بدلاً من ذلك، أي شيء تشرحه المعلمة يجب أن يتجسد كعنصر ثلاثي الأبعاد حقيقي أو مجسم سحري مضيء (Magical 3D hologram or real objects) موضوع على الطاولة (Desk) أمام المعلمة مباشرة لكي يراه المشاهد! يجب كتابة هذه العبارة في خانة ACTION: (On the desk right in front of the speaker, there is a magical 3D glowing object/hologram showing EXACTLY what they are explaining: [اكتب هنا وصف بصري دقيق للمجسم]. NO text, NO words)');
  
  // Replace in cartoon mode scene
  lines[i] = lines[i].replace(/In the background on the LEFT side.*?pure cartoon fantasy\./g, 'A HUGE glowing neon sign in the background displays the exact typographic text "Sci.Rehab Elsibai". The full text must be completely visible. The characters are standing around a large desk where magical educational 3D objects appear in front of them.');
  lines[i] = lines[i].replace(/The HUGE background smart screen on the LEFT side is completely visible and unobstructed/g, 'Magical 3D objects representing the lesson are placed on the desk right in front of her');
  lines[i] = lines[i].replace(/standing elegantly next to the huge smart screen/g, 'standing elegantly behind a desk');

  // Replace in gameshow mode scene
  lines[i] = lines[i].replace(/A giant LED screen in the background showing the exact typographic text "Sci.Rehab Elsibai"\./g, 'A glowing neon sign displaying the exact typographic text "Sci.Rehab Elsibai".');
  
  // Replace in studio mode scene
  lines[i] = lines[i].replace(/and a HUGE glowing smart screen is on the RIGHT side of the frame, completely unobstructed by her body\. The screen is playing a vivid animated video of exactly what she is saying right now, absolutely NO TEXT on screen/g, 'On the desk directly in front of her, a beautiful 3D object/hologram perfectly representing exactly what she is explaining is resting or magically floating in the air. NO TEXT.');
  lines[i] = lines[i].replace(/A HUGE glowing smart screen is clearly visible in the background playing an animated video of exactly what he is saying right now, NO TEXT/g, 'On the desk directly in front of him, a beautiful 3D object perfectly representing what he is saying is resting or magically floating in the air. NO TEXT.');
}

fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
