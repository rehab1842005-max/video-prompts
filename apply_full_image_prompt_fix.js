const fs = require('fs');

// 1. Update src/app/api/generate/route.ts
let routeCode = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

// Ensure imagePrompt instructions are added to instructions list
if (!routeCode.includes('برومبت الصورة المرجعية (imagePrompt)')) {
  routeCode = routeCode.replace(
    '4. **لغة الإخراج وأسلوب الرسم (مهم جداً جداً):**',
    '5. **برومبت الصورة المرجعية (imagePrompt) وسلسلة الترابط (imageContinuityNote) [إجباري لجميع المشاهد]:** لكل مشهد، يجب كتابة حقل imagePrompt بالإنجليزية لوصف الصورة الثابتة الأولى (Starting frame) بدقة فائقة وبأسلوب 3D Pixar render لكي تستخدم في مولدات الصور. وحقل imageContinuityNote بالعربية ليوضح كيف تكمل هذه الصورة اللقطة السابقة لضمان عدم وجود أي قفزات عشوائية.\\n" +\n' +
    '    "4. **لغة الإخراج وأسلوب الرسم (مهم جداً جداً):**'
  );
}

// Ensure imagePrompt is in the JSON template
if (!routeCode.includes('"    \\"imagePrompt\\":')) {
  routeCode = routeCode.replace(
    '"    \\"partName\\": \\"عنوان\\",\\n"',
    '"    \\"partName\\": \\"عنوان\\",\\n" +\n' +
    '    "    \\"imagePrompt\\": \\"Detailed 3D Pixar scientific image generation prompt in English for the starting frame (for Midjourney/DALL-E)...\\",\\n" +\n' +
    '    "    \\"imageContinuityNote\\": \\"شرح بالعربية لكيفية تسلسل هذه الصورة من نهاية المشهد السابق وتمهيدها للمشهد التالي...\\",\\n"'
  );
}

// Update enhancedPrompts fullText in route.ts
const targetOldMap = `      const fullText = 
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

const targetNewMap = `      let fullText = "";
      if (p.imagePrompt) {
        fullText = 
          "══════════════════════════════════════════════════\\n" +
          "🎬 VIDEO " + String(p.videoNumber).padStart(2, "0") + " - PAGE " + p.pageNumber + " - " + p.partName + "\\n" +
          "⏱️ Duration: " + p.duration + "\\n" +
          "══════════════════════════════════════════════════\\n\\n" +
          "🖼️ [1. IMAGE GENERATION PROMPT (الصورة المرجعية)]:\\n" +
          p.imagePrompt + "\\n\\n" +
          (p.imageContinuityNote ? "🔗 [ملاحظة الترابط والتسلسل]: " + p.imageContinuityNote + "\\n\\n" : "") +
          "🎥 [2. IMAGE-TO-VIDEO MOTION PROMPT (تحريك الصورة)]:\\n" +
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

if (routeCode.includes('const fullText =')) {
  routeCode = routeCode.replace(targetOldMap, targetNewMap);
}

fs.writeFileSync('src/app/api/generate/route.ts', routeCode, 'utf8');
console.log('route.ts successfully updated with imagePrompt in instructions, schema, and fullText!');

// 2. Set default videoMode in src/app/page.tsx to "paired"
let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');
pageCode = pageCode.replace(
  'useState<"cartoon" | "teacher" | "review" | "studio" | "story" | "gameshow" | "paired">("studio")',
  'useState<"cartoon" | "teacher" | "review" | "studio" | "story" | "gameshow" | "paired">("paired")'
);
fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');
console.log('page.tsx default videoMode set to paired!');
