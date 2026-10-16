const fs = require('fs');

let routeCode = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

// Replace line 101 Scene description
routeCode = routeCode.replace(
  'In the background, a giant glowing neon sign clearly displays the exact typographic text \\"Sci.Rehab Elsibai\\". In the center of the stage, a HUGE high-tech glowing smart LED screen dominates the space, displaying vivid, adorable 3D educational graphics. No text on screen, only pure visual 3D cartoon illustrations.',
  'In the center of the stage, a HUGE high-tech glowing smart LED screen dominates the space, displaying vivid, adorable 3D educational graphics. Mounted directly ABOVE the top border of the smart screen, a prominent glowing neon sign clearly displays the exact typographic text \\"Sci.Rehab Elsibai\\". The full text \\"Sci.Rehab Elsibai\\" must be completely visible. Inside the screen display, there is NO text, only pure visual 3D cartoon illustrations.'
);

// Replace line 104 (NO TEXT rule) with specific name-above-screen rule
const oldRule104 = '- **(قاعدة حياة أو موت): منع النصوص والكلمات تماماً داخل الشاشة الذكية (ABSOLUTELY NO TEXT ON SCREEN):** برامج الذكاء الاصطناعي تكتب كلمات مشوهة ومغلوطة! لذلك يُمنع منعاً باتاً كتابة أي نصوص، أرقام، أو كلمات داخل الشاشة! الشاشة الذكية يجب أن تعرض فقط رسومات ومجسمات كرتونية ثلاثية الأبعاد كيوت (Cute 3D Pixar cartoon organs with big friendly eyes, smiling kidneys, colorful blood vessels, filtering sieves, arrows showing direction of blood/fluid, bubbles, magnifying glasses). كل شيء يُفهم بالرسوم والأسهم التوضيحية فقط! (Pure visual cartoon illustrations, adorable smiling organs, flowing arrows, absolutely NO text, NO words, NO letters, NO labels, NO titles on screen).';

const newRule104 = '- **(قاعدة حاسمة ومقدسة): لافتة الاسم فوق الشاشة إجبارية + منع النصوص داخل الشاشة:**\\n' +
  '  1. **لافتة الاسم (إجبارية في كل الصور imagePrompt):** يجب إجبارياً في كل برومبت صورة (imagePrompt) وكل مشهد (SCENE) كتابة أن هناك لافتة نيون مضيئة ومثبتة أعلى إطار الشاشة الذكية مباشرة مكتوب عليها بالحرف: (Mounted directly ABOVE the top of the smart screen, a glowing neon sign displays the exact text \\"Sci.Rehab Elsibai\\"). هذا الاسم هو النص الوحيد المسموح به في المشهد!\\n' +
  '  2. **منع النصوص داخل محتوى الشاشة (No text inside screen display):** لمنع تشوه الكلمات العربية التي يولدها الذكاء الاصطناعي داخل شاشة العرض (مثل التنظيف الصقيم وغيرها)، يُمنع منعاً باتاً كتابة أي عناوين أو كلمات أو نصوص توضيحية داخل الشاشة! الشاشة تعرض فقط رسومات ومجسمات كرتونية ثلاثية الأبعاد كيوت (Cute 3D Pixar organs with big friendly eyes, smiling kidneys, colorful blood vessels, sieves, flowing arrows, bubbles). كل شيء يُفهم بالرسوم والأسهم التوضيحية فقط! (Inside the smart screen: Pure visual cartoon illustrations, adorable smiling organs, flowing arrows, absolutely NO text, NO labels, NO titles inside the screen).';

routeCode = routeCode.replace(oldRule104, newRule104);

// Replace line 110 imagePrompt instruction
routeCode = routeCode.replace(
  '  - صورة كل مشهد (imagePrompt): برومبت إنجليزي يصف الشاشة الذكية وهي تعرض الخطوة بدقة، بجوار المعلمة رحاب بالبدلة الفضية، وبدون أي نص على الشاشة.\\n',
  '  - صورة كل مشهد (imagePrompt): برومبت إنجليزي فائق الدقة يصف الاستوديو، والمعلمة رحاب بالبدلة الفضية اللامعة والميكروفون، ولافتة النيون المضيئة أعلى الشاشة الحاملة لنص \\"Sci.Rehab Elsibai\\" بوضوح تام، والشاشة الذكية الكبيرة تعرض الخطوة كرسومات كرتونية ثلاثية الأبعاد مبهجة بدون أي كتابة داخل الشاشة.\\n'
);

fs.writeFileSync('src/app/api/generate/route.ts', routeCode, 'utf8');
console.log('Successfully updated Sci.Rehab Elsibai neon sign directly above the smart screen!');
