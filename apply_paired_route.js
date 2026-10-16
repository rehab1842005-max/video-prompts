const fs = require('fs');

let content = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

// 1. Inject paired mode instructions
const pairedModeText = `    } else if (videoMode === "paired") {
      characterConfigStr += "\\n- **وضع السلسلة العلمية المترابطة (صورة مرجعية + فيديو متصل لكل جزئية - Image-to-Video Sequence):**\\n" +
      "هذا الوضع مخصص لبناء سلسلة تعليمية علمية سينمائية فائقة الترابط كفيلم وثائقي كرتوني (مثل مراحل الهضم، مسار التنفس، تكيف الكائنات، دورة الماء، إلخ).\\n" +
      "- **القاعدة الذهبية الصارمة (الترابط البصري التراكمي المطلق 100% - Handover Continuity):** كل مشهد يجب أن يسلم المشهد التالي بالحرف الواحد:\\n" +
      "  1. **برومبت الصورة المرجعية الأولى (imagePrompt):** يجب أن تكتب بالإنجليزية برومبت فائق الاحترافية لتوليد صورة ثابتة تمثل بداية المشهد (Starting Frame). اكتبه بأسلوب: (3D Pixar medical/scientific educational animation, clean friendly anatomical rendering for kids, vibrant colors, warm cinematic lighting, high-end 3D render, perfectly centered composition, 8k resolution, absolutely NO scary or gross visuals, NO text, NO letters).\\n" +
      "  2. **كيف يكمل المشهد الثاني المشهد الأول بصرياً؟ (Visual Continuity Chain):**\\n" +
      "     - المشهد الأول ينتهي عند حالة بصرية محددة (مثلاً: الفم يمضغ التفاحة واختلطت باللعاب في لقطة مقربة).\\n" +
      "     - صورة المشهد الثاني (imagePrompt للمشهد 02) **يجب إجبارياً أن تبدأ من نفس النقطة والزاوية التي انتهى عندها المشهد الأول بالضبط** (داخل الفم، اللقمة المغلفة باللعاب تتجه نحو البلعوم)!\\n" +
      "     - فيديو المشهد الثاني (ACTION & CAMERA) يحرك تلك اللقمة وهي تنزلق في البلعوم والمريء، وينتهي المشهد واللقمة عند مدخل المعدة.\\n" +
      "     - صورة المشهد الثالث (imagePrompt للمشهد 03) تبدأ من داخل المعدة وهي تستقبل تلك اللقمة القادمة من المريء! وهكذا يستمر التسلسل كشريط سينمائي واحد متصل لا ينقطع أبداً!\\n" +
      "  3. **حقل imageContinuityNote:** اكتب باللغة العربية جملة توضح فيها بدقة: كيف تنطلق صورة هذا المشهد من نهاية المشهد السابق، وما هي الحركة التي ستسلم المشهد التالي.\\n" +
      "  4. **برومبت تحريك الفيديو (ACTION, CAMERA, DIALOGUE, AUDIO):** يصف بدقة بالغة كيف تتحرك تلك الصورة الثابتة عند رفعها لأداة الفيديو (زوم تدريجي ناعم، حركة تدفق أو انقباض، مؤثرات حركية، وشرح صوتي مركز وسلس بأسلوب مشوق).\\n" +
      "  5. **حساب مدة الفيديو بدقة (Duration):** احسب الثواني بناءً على طول الشرح الصوتي المكتوب (معظمها 5 إلى 8 ثوانٍ فقط) لمنع أي صمت زائد في المونتاج.\\n";
    }`;

content = content.replace(
  'characterConfigStr += "\\n- **ممنوع الوداع نهائياً في الحوار:',
  pairedModeText + '\n\n    characterConfigStr += "\\n- **ممنوع الوداع نهائياً في الحوار:'
);

// 2. Add imagePrompt and imageContinuityNote to JSON schema template
const oldSchemaPart = '"    \\"partName\\": \\"عنوان\\",\\n" +\n"    \\"duration\\":';
const newSchemaPart = '"    \\"partName\\": \\"عنوان\\",\\n" +\n' +
  '"    \\"imagePrompt\\": \\"Detailed 3D Pixar scientific image generation prompt in English for the starting frame (for Midjourney/DALL-E)...\\",\\n" +\n' +
  '"    \\"imageContinuityNote\\": \\"شرح بالعربية لكيفية تسلسل هذه الصورة من نهاية المشهد السابق وتمهيدها للمشهد التالي...\\",\\n" +\n' +
  '"    \\"duration\\":';

content = content.replace(oldSchemaPart, newSchemaPart);

// 3. Update fullText formatting in enhancedPrompts.map
const oldFullText = `      const fullText = 
        "VIDEO " + String(p.videoNumber).padStart(2, "0") + " - PAGE " + p.pageNumber + " - " + p.partName + "\\n" +
        "Duration: " + p.duration + "\\n\\n" +
        "START:\\n" + p.startContinuity + "\\n\\n" +
        "SCENE:\\n" + p.scene + "\\n\\n" +
        "CHARACTER:\\n" + p.character + "\\n\\n" +
        "ACTION:\\n" + p.action + "\\n\\n" +
        "CAMERA:\\n" + p.camera + "\\n\\n" +
        "DIALOGUE:\\n" + p.dialogue + "\\n\\n" +
        "AUDIO:\\n" + p.audio + "\\n\\n" +
        "END:\\n" + p.endContinuity + "\\n\\n" +
        p.continuityToNext;`;

const newFullText = `      let fullText = "";
      if (p.imagePrompt) {
        fullText = 
          "══════════════════════════════════════════════════\\n" +
          "🎬 VIDEO " + String(p.videoNumber).padStart(2, "0") + " - PAGE " + p.pageNumber + " - " + p.partName + "\\n" +
          "⏱️ Duration: " + p.duration + "\\n" +
          "══════════════════════════════════════════════════\\n\\n" +
          "🖼️ [1. IMAGE GENERATION PROMPT (برومبت الصورة المرجعية الأولى)]:\\n" +
          p.imagePrompt + "\\n\\n" +
          (p.imageContinuityNote ? "🔗 [ملاحظة الترابط والتسلسل]: " + p.imageContinuityNote + "\\n\\n" : "") +
          "🎥 [2. IMAGE-TO-VIDEO MOTION PROMPT (برومبت تحريك الصورة بالفيديو)]:\\n" +
          "SCENE:\\n" + p.scene + "\\n\\n" +
          "CHARACTER / SUBJECT:\\n" + p.character + "\\n\\n" +
          "ACTION & MOTION:\\n" + p.action + "\\n\\n" +
          "CAMERA MOVEMENT:\\n" + p.camera + "\\n\\n" +
          "DIALOGUE & VOICEOVER:\\n" + p.dialogue + "\\n\\n" +
          "AUDIO & SFX:\\n" + p.audio + "\\n\\n" +
          "END STATE (نقطة تسليم المشهد التالي):\\n" + p.endContinuity;
      } else {
        fullText = 
          "VIDEO " + String(p.videoNumber).padStart(2, "0") + " - PAGE " + p.pageNumber + " - " + p.partName + "\\n" +
          "Duration: " + p.duration + "\\n\\n" +
          "START:\\n" + p.startContinuity + "\\n\\n" +
          "SCENE:\\n" + p.scene + "\\n\\n" +
          "CHARACTER:\\n" + p.character + "\\n\\n" +
          "ACTION:\\n" + p.action + "\\n\\n" +
          "CAMERA:\\n" + p.camera + "\\n\\n" +
          "DIALOGUE:\\n" + p.dialogue + "\\n\\n" +
          "AUDIO:\\n" + p.audio + "\\n\\n" +
          "END:\\n" + p.endContinuity + "\\n\\n" +
          p.continuityToNext;
      }`;

content = content.replace(oldFullText, newFullText);

fs.writeFileSync('src/app/api/generate/route.ts', content, 'utf8');
console.log('Successfully updated route.ts for paired mode!');
