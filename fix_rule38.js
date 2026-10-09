const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

const target1 = "- **الشاشات الذكية والتمثيل المضحك (تجسيد الكلام كفيديو 100%):** أي شيء تقوله الشخصيات يجب أن يُعرض كفيديو حي على الشاشة! وإذا كانت الشخصية تقول تشبيهاً مضحكاً، يجب أن تمثله بجسدها وتعابير وجهها، ويُعرض هذا التشبيه كفيديو مضحك على الشاشة! يجب كتابة هذه العبارة بالنص في خانة الـ ACTION: (The smart screen is playing a vivid animated video showing EXACTLY what the character is saying/doing about: [اكتب هنا وصف بصري دقيق بالإنجليزية]. The screen displays ONLY pure visual images and animated pictures, absolutely NO text, NO letters, and NO words. The speaking character is actively ACTING OUT this metaphor with funny, highly expressive body language and hand gestures). هذا لضمان التمثيل المضحك ومنع تداخل النصوص.\\n";
const repl1 = "- **التجسيد المجسم (لا توجد شاشات):** ممنوع استخدام أي شاشات ذكية! أي شيء يتم شرحه يجب أن يظهر كـ (مجسم ثلاثي الأبعاد أو هولوجرام سحري) موضوع على الطاولة مباشرة أمام المتحدث. اكتب هذه العبارة في خانة الـ ACTION: (On the desk right in front of the speaker, a magical 3D glowing hologram/object is resting or floating, perfectly illustrating what they are talking about: [اكتب وصف المجسم هنا]. The speaker is actively pointing at it and ACTING OUT the metaphor. NO screens, NO text, NO words).\\n";
text = text.replace(target1, repl1);

fs.writeFileSync('src/app/api/generate/route.ts', text);
