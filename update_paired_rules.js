const fs = require('fs');

let routeCode = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

// Find the paired mode block and replace it with the new comprehensive, exact rules
const oldPairedStart = '    } else if (videoMode === "paired") {';
const oldPairedEnd = '    characterConfigStr += "\\n- **ممنوع الوداع نهائياً في الحوار:';

const idxStart = routeCode.indexOf(oldPairedStart);
const idxEnd = routeCode.indexOf(oldPairedEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.error("Could not find paired mode boundaries!");
  process.exit(1);
}

const newPairedBlock = `    } else if (videoMode === "paired") {
      characterConfigStr += "\\n- **وضع السلسلة العلمية المترابطة (استوديو الشاشة الذكية العملاقة بدون نصوص نهائياً):**\\n" +
      "هذا الوضع مستوحى 100% من استوديو تلفزيوني فخم وساحر لتقديم العلوم للأطفال مع شاشة ذكية عملاقة تعرض كل خطوة بالتفصيل الكرتوني الممتع:\\n" +
      "- **المكان الثابت (Scene):** A spectacular, dazzling neon TV educational studio with colorful studio lights and celebratory confetti in the air. In the background, a giant glowing neon sign clearly displays the exact typographic text \\"Sci.Rehab Elsibai\\". In the center of the stage, a HUGE high-tech glowing smart LED screen dominates the space, displaying vivid, adorable 3D educational graphics. No text on screen, only pure visual 3D cartoon illustrations.\\n" +
      "- **المعلمة وملابسها الثابتة الصارمة (Character):** Teacher Rahab: A beautiful 20-25 years old 3D Pixar-style young female teacher with long wavy dark brown hair, smiling warmly and enthusiastically, holding a sleek professional microphone, standing elegantly on the right side of the smart screen and gesturing towards it. Wearing: " + (configObj.teacherOutfit || "a stunning sparkly silver glitter blazer over a crisp white blouse and sleek dark trousers") + ". (Maintain exact same teacher outfit, face proportions, and microphone in ALL scenes without any change).\\n" +
      "- **قاعدة الشخصية الكرتونية (تظهر عند الحاجة للسؤال فقط):** في مشاهد الشرح العادية، المعلمة رحاب تقف بمفردها تماماً بجوار الشاشة الذكية تشرح للأطفال! الكرتون (" + (configObj.cartoonCharacter || "a tiny cute green cactus mascot") + ") يظهر فقط وفقط إذا كان المشهد يحتوي على سؤال وتحدي موجه إليه على منصة المسابقات. إذا لم يكن هناك سؤال، الكرتون غير موجود على المسرح إطلاقاً!\\n" +
      "- **(قاعدة حياة أو موت): منع النصوص والكلمات تماماً داخل الشاشة الذكية (ABSOLUTELY NO TEXT ON SCREEN):** برامج الذكاء الاصطناعي تكتب كلمات مشوهة ومغلوطة! لذلك يُمنع منعاً باتاً كتابة أي نصوص، أرقام، أو كلمات داخل الشاشة! الشاشة الذكية يجب أن تعرض فقط رسومات ومجسمات كرتونية ثلاثية الأبعاد كيوت (Cute 3D Pixar cartoon organs with big friendly eyes, smiling kidneys, colorful blood vessels, filtering sieves, arrows showing direction of blood/fluid, bubbles, magnifying glasses). كل شيء يُفهم بالرسوم والأسهم التوضيحية فقط! (Pure visual cartoon illustrations, adorable smiling organs, flowing arrows, absolutely NO text, NO words, NO letters, NO labels, NO titles on screen).\\n" +
      "- **(القاعدة الذهبية الإجبارية للمشهد الأول Video 01): خريطة الجسم الكامل ثم زوم:**\\n" +
      "  - **صورة المشهد الأول (Image Prompt 01):** يجب إجبارياً أن تعرض الشاشة الذكية مجسماً ثلاثي الأبعاد لجسم الإنسان كاملاً شفافاً أو كرتونياً يوضح موضع الجهاز المستهدف في الجسم (A full transparent 3D human body model on the smart screen highlighting the exact location of the targeted organ/system in the body). المعلمة رحاب تقف بجوار الشاشة تشير إلى موضع الجهاز.\\n" +
      "  - **فيديو المشهد الأول (Video Motion 01):** المعلمة تبدأ بترحيب حار مشوق وتقدم الجهاز، وتقوم الكاميرا والشاشة بعمل زوم سينمائي ناعم مقرب جداً (Smooth cinematic zoom-in) من مجسم الجسم الكامل إلى داخل العضو المستهدف تحديداً، ليدرك الطالب والمشاهد مكانه في الجسم قبل بدء تفاصيل الخطوات!\\n" +
      "- **تسلسل المشاهد اللاحقة (مترابطة 100% كخطوات متتابعة):**\\n" +
      "  - كل مشهد يشرح خطوة دقيقة واحدة بالترتيب وبنفس مظهر المعلمة والشاشة (مثال الكلى: مشهد 1: موقع الكليتين في الجسم وعمل زوم -> مشهد 2: استقبال الدم غير المصفى عبر الشريان الكلوي -> مشهد 3: عملية الغربلة والتصفية داخل النيفرونات كفلاتر صغيرة كيوت -> مشهد 4: خروج الفضلات كبول وعودة الدم النظيف للجسم).\\n" +
      "  - صورة كل مشهد (imagePrompt): برومبت إنجليزي يصف الشاشة الذكية وهي تعرض الخطوة بدقة، بجوار المعلمة رحاب بالبدلة الفضية، وبدون أي نص على الشاشة.\\n" +
      "  - فيديو كل مشهد (Motion & Action): يوضح حركة التدفق والشرح المصاحب.\\n" +
      "- **مدة كل فيديو (Duration):** احسب الثواني بدقة بحسب طول جملة المعلمة (معظمها 6 إلى 9 ثوانٍ) لمنع أي صمت ميت.\\n";
    }\n\n`;

routeCode = routeCode.substring(0, idxStart) + newPairedBlock + routeCode.substring(idxEnd);

fs.writeFileSync('src/app/api/generate/route.ts', routeCode, 'utf8');
console.log("Successfully updated paired mode with exact TV studio, no-text screen, on-demand cartoon, and zoom rules!");
