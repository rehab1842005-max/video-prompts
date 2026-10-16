const fs = require('fs');

let routeCode = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

// 1. Fix line 34 and line 38 to exclude "paired" mode from hologram / character merging rules
routeCode = routeCode.replace(
  '} else if (videoMode !== "story") {',
  '} else if (videoMode !== "story" && videoMode !== "paired") {'
);

routeCode = routeCode.replace(
  'if (videoMode !== "story") {\n      characterConfigStr += "- **التجسيد المجسم (لا توجد شاشات):**',
  'if (videoMode !== "story" && videoMode !== "paired") {\n      characterConfigStr += "- **التجسيد المجسم (لا توجد شاشات):**'
);

// 2. Enhance paired mode instructions with the strict Active Journey Screen Motion rule
const oldPairedBlockStart = '    } else if (videoMode === "paired") {';
const oldPairedBlockEnd = '    characterConfigStr += "\\n- **ممنوع الوداع نهائياً في الحوار:';

const idxStart = routeCode.indexOf(oldPairedBlockStart);
const idxEnd = routeCode.indexOf(oldPairedBlockEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.error("Could not find paired mode boundaries!");
  process.exit(1);
}

const newPairedBlock = `    } else if (videoMode === "paired") {
      characterConfigStr += "\\n- **وضع السلسلة العلمية المترابطة (استوديو الشاشة الذكية العملاقة بدون نصوص نهائياً):**\\n" +
      "هذا الوضع مستوحى 100% من استوديو تلفزيوني فخم وساحر لتقديم العلوم للأطفال مع شاشة ذكية عملاقة تعرض كل خطوة بالتفصيل الكرتوني الممتع:\\n" +
      "- **المكان الثابت (Scene):** A spectacular, dazzling neon TV educational studio with colorful studio lights and celebratory confetti in the air. In the center of the stage, a HUGE high-tech glowing smart LED screen dominates the space, displaying vivid, adorable 3D educational graphics. Mounted directly ABOVE the top border of the smart screen, a prominent glowing neon sign clearly displays the exact typographic text \\"Sci.Rehab Elsibai\\". The full text \\"Sci.Rehab Elsibai\\" must be completely visible. Inside the screen display, there is NO text, only pure visual 3D cartoon illustrations.\\n" +
      "- **المعلمة وملابسها الثابتة الصارمة (Character):** Teacher Rahab: A beautiful 20-25 years old 3D Pixar-style young female teacher with long wavy dark brown hair, smiling warmly and enthusiastically, holding a sleek professional microphone, standing elegantly on the right side of the smart screen and gesturing towards it. Wearing: " + (configObj.teacherOutfit || "a stunning sparkly silver glitter blazer over a crisp white blouse and sleek dark trousers") + ". (Maintain exact same teacher outfit, face proportions, and microphone in ALL scenes without any change).\\n" +
      "- **قاعدة الشخصية الكرتونية (تظهر عند الحاجة للسؤال فقط):** في مشاهد الشرح العادية، المعلمة رحاب تقف بمفردها تماماً بجوار الشاشة الذكية تشرح للأطفال! الكرتون (" + (configObj.cartoonCharacter || "a tiny cute green cactus mascot") + ") يظهر فقط وفقط إذا كان المشهد يحتوي على سؤال وتحدي موجه إليه على منصة المسابقات. إذا لم يكن هناك سؤال، الكرتون غير موجود على المسرح إطلاقاً!\\n" +
      "- **(قاعدة حاسمة ومقدسة): لافتة الاسم فوق الشاشة إجبارية + منع النصوص داخل الشاشة:**\\n" +
      "  1. **لافتة الاسم (إجبارية في كل الصور imagePrompt):** يجب إجبارياً في كل برومبت صورة (imagePrompt) وكل مشهد (SCENE) كتابة أن هناك لافتة نيون مضيئة ومثبتة أعلى إطار الشاشة الذكية مباشرة مكتوب عليها بالحرف: (Mounted directly ABOVE the top of the smart screen, a glowing neon sign displays the exact text \\"Sci.Rehab Elsibai\\"). هذا الاسم هو النص الوحيد المسموح به في المشهد!\\n" +
      "  2. **منع النصوص داخل محتوى الشاشة (No text inside screen display):** لمنع تشوه الكلمات العربية التي يولدها الذكاء الاصطناعي داخل شاشة العرض (مثل التنظيف الصقيم وغيرها)، يُمنع منعاً باتاً كتابة أي عناوين أو كلمات أو نصوص توضيحية داخل الشاشة! الشاشة تعرض فقط رسومات ومجسمات كرتونية ثلاثية الأبعاد كيوت (Cute 3D Pixar organs with big friendly eyes, smiling kidneys, colorful blood vessels, sieves, flowing arrows, bubbles). كل شيء يُفهم بالرسوم والأسهم التوضيحية فقط! (Inside the smart screen: Pure visual cartoon illustrations, adorable smiling organs, flowing arrows, absolutely NO text, NO labels, NO titles inside the screen).\\n" +
      "- **(أهم قاعدة في الكورس): تحريك الشاشة الذكية كـ (رحلة كرتونية حية ومتحركة 100% - Active Journey Motion):**\\n" +
      "  - **المشكلة الكبرى:** برامج تحريك الفيديو (Kling, Runway, Hedra, Luma, Flow) إذا كتبت لها وصف حركة المعلمة فقط، فإنها تجعل الشاشة صورة ثابتة صامتة وتحرك فم المعلمة فقط! هذا يدمر الكورس!\\n" +
      "  - **الحل الإجباري الصارم في خانة (ACTION / MOTION):** يجب أن تصف بالإنجليزية حركة حية وديناميكية مستمرة (Continuous fluid kinetic animation) لما يدور داخل الشاشة الذكية لكي تبدو كرحلة علمية متصلة وممتعة طوال ثواني الفيديو!\\n" +
      "  - **صيغة كتابة الـ ACTION الإجبارية:**\\n" +
      "    1. صِف أولاً الحركة الحية للرحلة داخل الشاشة: (Inside the giant smart screen, there is an active, continuous, fluid 3D animated journey in motion: [اكتب هنا وصفاً حركياً دقيقاً لما يتحرك داخل الشاشة: تدفق سوائل نشط، انتقال جزيئات الدم، نبض الأوردة، اهتزاز فلاتر التصفية، نزول قطرات البول، حركة أسهم التدفق]. The visual graphics inside the screen are actively flowing, pulsing, and traveling non-stop throughout the entire duration).\\n" +
      "    2. ثم صِف حركة المعلمة رحاب المتزامنة: (Concurrently, Teacher Rahab speaks clearly with expressive mouth movements, smoothly gesturing with her microphone hand towards the flowing animation on the screen to guide the viewers. Teacher maintains a vibrant TV host presence).\\n" +
      "  - **حركة الكاميرا (CAMERA):** في خانة الكاميرا، اكتب زاوية تجمع حركة الشاشة والمعلمة معاً: (Medium cinematic shot framing both Teacher Rahab on the right and the huge smart screen on the left. The camera slowly pushes in towards the active motion on the screen, keeping both the animated journey and the teacher clearly in frame).\\n" +
      "- **(القاعدة الذهبية الإجبارية للمشهد الأول Video 01): خريطة الجسم الكامل ثم زوم:**\\n" +
      "  - **صورة المشهد الأول (Image Prompt 01):** يجب إجبارياً أن تعرض الشاشة الذكية مجسماً ثلاثي الأبعاد لجسم الإنسان كاملاً شفافاً أو كرتونياً يوضح موضع الجهاز المستهدف في الجسم (A full transparent 3D human body model on the smart screen highlighting the exact location of the targeted organ/system in the body). المعلمة رحاب تقف بجوار الشاشة تشير إلى موضع الجهاز.\\n" +
      "  - **فيديو المشهد الأول (Video Motion 01):** في الشاشة يبدأ الجسم الكامل بالإضاءة، وتقوم الكاميرا والشاشة بعمل زوم سينمائي ناعم مقرب جداً (Smooth cinematic zoom-in) من مجسم الجسم الكامل إلى داخل العضو المستهدف تحديداً، ليدرك الطالب والمشاهد مكانه في الجسم قبل بدء تفاصيل الخطوات!\\n" +
      "- **تسلسل المشاهد اللاحقة (مترابطة 100% كرحلة متتابعة):**\\n" +
      "  - كل مشهد يشرح خطوة دقيقة واحدة بالترتيب وبنفس مظهر المعلمة والشاشة (مثال الكلى: مشهد 1: موقع الكليتين في الجسم وعمل زوم -> مشهد 2: استقبال الدم غير المصفى عبر الشريان الكلوي بتدفق سريع -> مشهد 3: عملية الغربلة والتصفية داخل النيفرونات كفلاتر تهتز وتصفي -> مشهد 4: خروج الفضلات كقطرات بول وعودة الدم النظيف للجسم).\\n" +
      "  - صورة كل مشهد (imagePrompt): برومبت إنجليزي فائق الدقة يصف الاستوديو، والمعلمة رحاب بالبدلة الفضية اللامعة والميكروفون، ولافتة النيون المضيئة أعلى الشاشة الحاملة لنص \\"Sci.Rehab Elsibai\\" بوضوح تام، والشاشة الذكية الكبيرة تعرض كادر بداية الخطوة كرسومات كرتونية ثلاثية الأبعاد مبهجة بدون أي كتابة داخل الشاشة.\\n" +
      "- **مدة كل فيديو (Duration):** احسب الثواني بدقة بحسب طول جملة المعلمة (معظمها 6 إلى 9 ثوانٍ) لمنع أي صمت ميت.\\n";
    }\n\n`;

routeCode = routeCode.substring(0, idxStart) + newPairedBlock + routeCode.substring(idxEnd);

fs.writeFileSync('src/app/api/generate/route.ts', routeCode, 'utf8');
console.log('Successfully applied Active Journey Motion rules to paired mode and removed conflicting hologram rules!');
