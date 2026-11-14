import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get("pdfFile") as File | null;
    const topic = (formData.get("topic") as string) || "";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "لم يتم العثور على مفتاح Gemini API" }, { status: 500 });
    }

    if (!pdfFile && !topic) {
      return NextResponse.json({ error: "الرجاء رفع ملف PDF أو كتابة عنوان الدرس" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const parts: any[] = [];

    if (pdfFile) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      parts.push({
        inlineData: {
          data: pdfBuffer.toString("base64"),
          mimeType: "application/pdf"
        }
      });
    }

    const systemPrompt = `
أنت كبير موجهي العلوم ومؤلف السيناريوهات التعليمية للأطفال، وخبير تصميم عروض الباوربوينت التفاعلية المتحركة بالكامل (Animated PowerPoint Choreography) وخبير فيديوهات الـ B-Roll الكرتونية ثلاثية الأبعاد اللطيفة للأطفال (Cute 3D Cartoon Pixar Style).

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل مهما كان الموضوع دون أي اختصار أو كبس للمعلومات"}.

### ⚠️ القواعد الصارمة المحدثة (الشرح بالعامية المصرية ثابت كما هو + تفصيل أنيميشن الباوربوينت بالكامل + فيديوهات Flow):
1. **الشرح وكلام المعلمة بالعامية المصرية ثابت كما هو (ممنوع تغييره أو اختصاره):**
   - المستخدمة أكدت نصاً: "الشرح زي ما هو، جميل وكل حاجة، بس عايزة الجزء اللي هو الباوربوينت كله عبارة عن أنيميشن بيتحرك وكل حاجة باينة بالتفصيل: اشرح المفروض إيه اللي يحصل في الباوربوينت، وإيه اللي يتحرك ويروح فين ويجي منين. اشرح كل حاجة بالتفصيل في الباوربوينت."
2. **خطة أنيميشن الباوربوينت التفصيلية (pptAnimationPlan) بعد كل جزئية شرح وفي الدخلة والتجربة:**
   - يجب أن يكون عرض الباوربوينت كله عبارة عن **أنيميشن حي بيتحرك قدام عين الطفل** (ممنوع الشرائح الثابتة المملة!).
   - في كل جزئية، اشرح بالتفصيل الممل داخل \`pptAnimationPlan\`:
     - \`slideTitle\`: عنوان شريحة الباوربوينت.
     - \`slideLayout\`: وصف تفصيلي لتصميم الشريحة وتوزيع العناصر المفككة عليها قبل بدء الحركة (ماذا يوجد في اليمين، اليسار، المنتصف، الأعلى، الأسفل).
     - \`movements\`: مصفوفة من الحركات المتسلسلة (على الأقل 4 حركات تفصيلية في كل شريحة)، كل حركة توضح بدقة:
       - \`stepNumber\`: رقم الحركة (1، 2، 3، 4...).
       - \`trigger\`: توقيت التشغيل في الباوربوينت (مثلاً: "كليك 1 - عند بدء الشريحة" أو "تلقائي بعد الحركة السابقة After Previous").
       - \`element\`: إيه العنصر اللي هيتحرك بالظبط (اسم الشكل أو الرسمة الكرتونية أو السهم أو الجزيء أو البطاقة).
       - \`fromWhere\`: **يجي منين** (المكان الدقيق الذي يدخل منه العنصر أو يبدأ منه الحركة على الشريحة، مثلاً: "من أسفل الشريحة داخل التربة البنية" أو "من خارج الشريحة جهة اليمين").
       - \`toWhere\`: **يروح فين** (المسار الدقيق والمكان النهائي الذي يتجه إليه العنصر ويستقر فيه، مثلاً: "يصعد في مسار رأسي داخل أنبوبة الساق حتى يدخل قلب الورقة الخضراء في الأعلى").
       - \`animationType\`: نوع الأنيميشن في الباوربوينت (مثل: \`Fly In دخول طيران + Motion Path مسار حركة مخصص\`، \`Zoom تكبير تدريجي\`، \`Pulse نبض ووميض متكرر\`، \`Wipe مسح تدريجي\`، \`Spin دوران\`).
       - \`detailedAction\`: شرح تفصيلي كامل لإيه اللي بيحصل في الحركة دي بالظبط وإزاي العناصر بتتفاعل وتتحرك مع بعض في الشريحة.
       - \`syncWithTeacher\`: مع أي جملة من كلام المعلمة تتحرك هذه الخطوة.

3. **قواعد صياغة برومبتات الفيديو لموقع Flow (مهمة وحاسمة جداً):**
   - ممنوع بتاتاً أي شخصيات تتكلم أو تحرك فمها (STRICTLY NO TALKING, NO LIP-SYNC, NO SPEAKING HEADS).
   - الأسلوب البصري: كرتوني ثلاثي الأبعاد لطيف جداً ومناسب للأطفال (Cute Friendly 3D Cartoon Pixar Style).
   - فيديو رئيسي واحد مدته 10 ثوانٍ لكل جزئية/دخلة، يجمع كل التشبيهات المذكورة في كلام المعلمة في تسلسل حركي سريع بانتقالات متتابعة مقسمة زمنياً \`[0-3s]... [3-6s]... [6-10s]...\`.

4. **تنظيم كلام الشرح في (introHook و scientificBeats و experiments و lessonConclusion):**
   - المقدمة الثابتة في \`introHook.teacherScript\` (3 فقرات: التحية وعنوان الدرس ⬅ أول مقدمة عن الدرس ⬅ تشبيه البداية المشوق).
   - تقسيم الدرس في \`scientificBeats\` إلى جزئيات متتالية شاملة (بين 6 إلى 10 جزئيات علمية دقيقة دون إغفال أي معلومة).
   - التجربة العملية المفصلة في \`experiments\` (مع \`introAndMaterialsSpeech\` و \`steps\` و \`observationAndConclusionSpeech\` و \`pptAnimationPlan\`).
   - ⚠️ تنبيه تقني صارم: يجب أن يكون الناتج كائن JSON صالح تماماً (Strictly Valid JSON). ممنوع تماماً استخدام علامات التنصيص المزدوجة (") داخل النصوص العربية أو الإنجليزية؛ استخدم الأقواس العادية () أو العلامات المفردة (') بدلاً منها داخل النصوص.

المطلوب: توليد كائن JSON دقيق ومفصل جداً وفق الهيكل التالي بالظبط:
{
  "lessonTitle": "عنوان الدرس الدقيق المستخرج أوتوماتيكياً",
  "detectedTopic": "المجال والموضوع العلمي المستخرج بالتفصيل",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية",
    "teacherScript": "✨ أولاً - التحية وعنوان الدرس:\\nالسلام عليكم ورحمة الله وبركاته! أهلاً بيكم يا أبطال وعلماء المستقبل في درسنا النهاردة بعنوان: [...]\\n\\n🌱 ثانياً - مقدمة الدرس:\\n[أول مقدمة مبسطة وواضحة عن الدرس وأهميته]\\n\\n💡 ثالثاً - تشبيه البداية:\\n[كلام المعلمة المشوق بالعامية المصرية والتشبيهات الممتعة بالتفصيل...]",
    "analogyStory": "شرح التشبيهات الواقعية الواردة بالتفصيل...",
    "pptAnimationPlan": {
      "slideTitle": "شريحة الدخلة التمهيدية والتشبيه الحياتي",
      "slideLayout": "وصف تفصيلي لتصميم الشريحة وتوزيع العناصر عليها قبل بدء الأنيميشن...",
      "movements": [
        {
          "stepNumber": 1,
          "trigger": "كليك 1 (مع بداية صوت المعلمة)",
          "element": "اسم العنصر المتحرك في الباوربوينت",
          "fromWhere": "يجي منين بالتفصيل (مثلاً: يدخل من أقصى يمين الشريحة...)",
          "toWhere": "يروح فين بالتفصيل (مثلاً: يتحرك نحو منتصف الشريحة بجوار...)",
          "animationType": "نوع الأنيميشن في الباوربوينت (Fly In + Motion Path / Zoom / Pulse)",
          "detailedAction": "شرح كل حاجة بتحصل في الحركة دي بالتفصيل الممل...",
          "syncWithTeacher": "مع جملة المعلمة لما بتقول: (...)"
        }
      ]
    },
    "videoPrompts": [
      {
        "shotTitle": "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة تشمل كل تشبيهات الدخلة متزامنة مع الصوت)",
        "prompt": "A dynamic 10-second multi-scene sequence with rapid seamless cuts, perfectly synchronized with teacher voiceover pacing: [0-3s]: First visual action... [3-6s]: Rapid seamless transition to second visual action... [6-10s]: Quick dynamic transition/zoom to third visual action... High-energy visual progression, cute friendly 3D cartoon Pixar animation for children, soft rounded shapes, vibrant cheerful colors. Mute visual action only, strictly NO talking characters, NO speaking mouth animation, NO dialogue, NO lip sync."
      }
    ]
  },
  "scientificBeats": [
    {
      "beatNumber": 1,
      "conceptTitle": "عنوان النقطة العلمية الدقيقة الواحدة فقط",
      "teacherScript": "كلام المعلمة المنظم والمتسلسل بالعامية المصرية في فقرات مرتبة (\\n\\n): جملة ربط بسيطة + التشبيهات والشرح الممتع خطوة بخطوة + توضيح كيف ولماذا + ربط بالمصطلح العلمي",
      "simpleExplanation": "الشرح والتحليل العلمي الموسع والمفصل للظاهرة وأسبابها وأهميتها بالتفصيل...",
      "studentQuestion": "سؤال تفاعلي تطرحه المعلمة على الطلاب أثناء الشرح",
      "expectedAnswer": "الإجابة النموذجية المتوقعة من الطلاب",
      "textbookTerm": "المصطلح العلمي كما ورد في كتاب المدرسة نصاً",
      "textbookDefinition": "التعريف المكتوب في كتاب المدرسة المطلوب من الطالب حفظه وفهمه نصاً",
      "pptAnimationPlan": {
        "slideTitle": "عنوان شريحة الباوربوينت المتحركة لهذه الجزئية",
        "slideLayout": "وصف كامل لتصميم الشريحة وأماكن العناصر المفككة عليها قبل التحريك...",
        "movements": [
          {
            "stepNumber": 1,
            "trigger": "كليك 1 / تلقائي مع الصوت",
            "element": "اسم العنصر أو الشكل الذي يتحرك",
            "fromWhere": "يجي منين بالظبط على الشريحة",
            "toWhere": "يروح فين بالظبط على الشريحة",
            "animationType": "نوع الأنيميشن في الباوربوينت (Fly In / Motion Path / Zoom / Pulse / Wipe)",
            "detailedAction": "شرح تفصيلي كامل لإيه اللي بيتحرك وإزاي بيتحرك ويتفاعل في الباوربوينت",
            "syncWithTeacher": "يتزامن مع قول المعلمة: (...)"
          }
        ]
      },
      "videoPrompts": [
        {
          "shotTitle": "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة تشمل كل تشبيهات ونقاط الجزئية متزامنة مع الصوت)",
          "prompt": "A dynamic 10-second multi-shot sequence with rapid seamless transitions, precisely paced for teacher voiceover: [0-3s]: First visual action... [3-7s]: Fast seamless transition to second visual action... [7-10s]: Quick dynamic zoom to third visual action... Fast visual progression, cute friendly 3D Pixar style for children, soft rounded shapes, vibrant cheerful colors. Mute visual action only, strictly NO talking characters, NO speaking mouth movement, NO lip sync."
        }
      ]
    }
  ],
  "experimentTransition": {
    "teacherSpeech": "كلام المعلمة الحماسي بالعامية المصرية للتمهيد والانتقال للتجربة: 'شفتوا يا شطار الجمال العلمي ده؟ طب تفتكروا إحنا في العلوم بنصدق وخلاص؟ لأ طبعاً! يلا بينا نلبس البالطو وندخل المعمل سوا ونتأكد بعيوننا... جاهزين؟ يلا بينا نجرب ونعمل كذا!'",
    "flowVideoPrompt": "Delightful cute 3D Pixar style shot entering a bright friendly children's science lab: Playful colorful glassware, brass magnifying glass, cheerful clean tabletop in warm golden sunlight. Mute visual action, strictly NO talking characters, NO people speaking."
  },
  "experiments": [
    {
      "experimentTitle": "عنوان التجربة العلمية المفصل",
      "goal": "الهدف: لماذا نقوم بهذه التجربة بالتفصيل؟",
      "materials": ["الأداة 1", "الأداة 2", "الأداة 3", "الأداة 4"],
      "introAndMaterialsSpeech": "كلام المعلمة في بداية التجربة تذكر فيه بصوتها عنوان التجربة والهدف منها وتستعرض كل الأدوات أداة بأداة بشكل واضح ومتسلسل للأطفال...",
      "steps": [
        {
          "stepNumber": 1,
          "stepTitle": "عنوان الخطوة 1",
          "actionDetails": "تفاصيل ما نفعله في الخطوة بالمنطق العلمي الدقيق ولماذا",
          "teacherSpeech": "الخطوة الأولى معانا يا أبطال: [كلام المعلمة المتسلسل والواضح يشرح كل تفاصيل الفعل والسبب واحتياط الأمان إن وجد في نفس الكلام...]",
          "flowVideoPrompt": "Cute clean 3D Pixar style laboratory tabletop animation for children: [Specific lab step action]. Macro tabletop focus, beautiful glass reflections. Mute action only, strictly NO talking characters, NO speaking mouth movement."
        }
      ],
      "observations": "ماذا نلاحظ بعيوننا أثناء التجربة بالتفصيل الدقيق؟",
      "observationVideoPrompt": "Delightful 3D macro animation for children showing the visible color change and chemical reaction clearly in vibrant colors. Mute visual action, strictly NO talking characters.",
      "finalConclusion": "الاستنتاج العلمي النهائي الموسع والدقيق",
      "observationAndConclusionSpeech": "ودلوقتي تعالوا نشوف بعيوننا إيه اللي حصل بعد التجربة: [ذكر كل تفاصيل الملاحظة المرئية والنتيجة بالعامية الواضحة]\\n\\nوبكده نستنتج الاستنتاج المهم جداً ده: [ذكر الاستنتاج النهائي ببساطة وتسلسل]",
      "safetyPrecautions": "احتياطات الأمان في المعمل",
      "pptAnimationPlan": {
        "slideTitle": "شريحة الباوربوينت التفاعلية لخطوات التجربة المعملية",
        "slideLayout": "وصف تصميم شريحة المعمل وتوزيع الأدوات عليها...",
        "movements": [
          {
            "stepNumber": 1,
            "trigger": "كليك 1",
            "element": "أداة التجربة المتحركة",
            "fromWhere": "تبدأ من رف الأدوات في يمين الشريحة",
            "toWhere": "تتجه إلى منتصف طاولة المعمل",
            "animationType": "Motion Path مسار حركة + Zoom",
            "detailedAction": "وصف تفصيلي لحركة الأداة والتفاعل اللوني على الشريحة",
            "syncWithTeacher": "مع شرح الخطوة في صوت المعلمة"
          }
        ]
      }
    }
  ],
  "lessonConclusion": {
    "title": "خاتمة الدرس الشاملة وتثبيت الفهم",
    "teacherScript": "كلام المعلمة للخاتمة المتسلسلة للدرس بالكامل: تلخيص سريع وممتع لرحلة الدرس والتجربة خطوة بخطوة بتسلسل واضح + جملة تشجيعية للأبطال + والسلام عليكم ورحمة الله وبركاته.",
    "flowVideoPrompt": "A dynamic 10-second uplifting 3D Pixar style wrap-up sequence for children showing the key elements of the lesson harmoniously glowing together in bright warm sunlight with celebratory sparkles. Mute visual action only, strictly NO talking characters, NO speaking mouth animation, NO lip sync."
  },
  "blackboardSummary": {
    "title": "عنوان السبورة",
    "keyVocabulary": ["المصطلح 1: معناه المفصل", "المصطلح 2: معناه المفصل"],
    "definitions": ["التعريف 1 كما ورد في الكتاب نصاً", "التعريف 2 كما ورد في الكتاب نصاً"],
    "comparisons": ["مقارنة دقيقة وشاملة بين كذا وكذا"],
    "conclusions": ["الاستنتاج النهائي المهم"]
  },
  "checkUnderstanding": [
    {
      "questionType": "من الحياة اليومية / علل ولماذا / استنتاج ذكي",
      "question": "نص السؤال الشفوي المفصل للطلاب",
      "correctAnswer": "الإجابة النموذجية الميسرة للمعلمة"
    }
  ]
}
`;

    parts.push({ text: systemPrompt });

    const fallbackModels = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash"
    ];

    let resultText = "";
    let lastError: any = null;

    for (const modelName of fallbackModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const res = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 65536,
            responseMimeType: "application/json"
          }
        });
        resultText = res.response.text();
        if (resultText && resultText.trim()) break;
      } catch (e: any) {
        lastError = e;
      }
    }

    if (!resultText) throw lastError || new Error("فشل توليد دليل المعلمة من خدمة الذكاء الاصطناعي");

    const guideData = repairAndParseJson(resultText);

    // Ensure safe default structures so the client never crashes
    if (!guideData.lessonTitle) {
      guideData.lessonTitle = topic || "درس العلوم التفاعلي";
    }
    if (!Array.isArray(guideData.scientificBeats)) {
      guideData.scientificBeats = [];
    }

    return NextResponse.json({ success: true, guide: guideData });
  } catch (error: any) {
    console.warn("Handled error in lesson-guide route:", error?.message || error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء إعداد دليل المعلمة" }, { status: 500 });
  }
}

// ==========================================
// Robust Multi-Stage JSON Repair & Recovery
// ==========================================

function isLikelyStructuralCloseQuote(jsonStr: string, quoteIdx: number): boolean {
  let i = quoteIdx + 1;
  while (i < jsonStr.length && /\s/.test(jsonStr[i])) {
    i++;
  }
  if (i >= jsonStr.length) return true;

  const nextChar = jsonStr[i];
  if (nextChar === "}" || nextChar === "]") {
    return true;
  }

  if (nextChar === ":") {
    // After ':', valid JSON must have '"', '{', '[', 'true', 'false', 'null', or a digit/minus
    let j = i + 1;
    while (j < jsonStr.length && /\s/.test(jsonStr[j])) j++;
    if (j >= jsonStr.length) return true;
    const afterColon = jsonStr[j];
    return (
      afterColon === '"' ||
      afterColon === "{" ||
      afterColon === "[" ||
      /[0-9\-tfn]/.test(afterColon)
    );
  }

  if (nextChar === ",") {
    // After ',', in valid JSON we must see '"', '{', '[', ']', '}', or a primitive literal
    let j = i + 1;
    while (j < jsonStr.length && /\s/.test(jsonStr[j])) j++;
    if (j >= jsonStr.length) return true;
    const afterComma = jsonStr[j];
    if (afterComma === "{" || afterComma === "[" || afterComma === "}" || afterComma === "]") {
      return true;
    }
    if (afterComma === '"') {
      return true;
    }
    return false;
  }

  return false;
}

function sanitizeControlCharsAndQuotes(jsonStr: string): string {
  let result = "";
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (inString) {
      if (ch === "\r") {
        continue;
      }
      if (ch === "\n") {
        result += "\\n";
        isEscaped = false;
        continue;
      }
      if (ch === "\t") {
        result += "\\t";
        isEscaped = false;
        continue;
      }
    }

    if (ch === "\\" && inString) {
      isEscaped = !isEscaped;
      result += ch;
      continue;
    }

    if (ch === '"' && !isEscaped) {
      if (!inString) {
        inString = true;
        result += ch;
      } else {
        if (isLikelyStructuralCloseQuote(jsonStr, i)) {
          inString = false;
          result += ch;
        } else {
          result += '\\"';
        }
      }
    } else {
      result += ch;
    }

    isEscaped = false;
  }

  return result;
}

function closeIncompleteJson(str: string): string {
  let s = str.trim();
  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\" && inString) {
      isEscaped = !isEscaped;
      continue;
    }
    if (ch === '"' && !isEscaped) {
      inString = !inString;
    } else if (!inString) {
      if (ch === "{") stack.push("}");
      else if (ch === "[") stack.push("]");
      else if (ch === "}" || ch === "]") {
        if (stack.length && stack[stack.length - 1] === ch) {
          stack.pop();
        }
      }
    }
    isEscaped = false;
  }

  if (inString) {
    s += '"';
  }

  // Strip any dangling key or trailing comma at the end before closing brackets
  s = s.replace(/,\s*$/, "");
  s = s.replace(/,\s*"[^"]*"\s*:\s*$/, "");
  s = s.replace(/:\s*$/, ': ""');

  while (stack.length > 0) {
    s += stack.pop();
  }

  return s;
}

function surgicalPositionalRepair(input: string): any {
  let current = input;

  for (let step = 0; step < 35; step++) {
    try {
      return JSON.parse(current);
    } catch (err: any) {
      const msg = String(err?.message || "");
      const posMatch = msg.match(/position\s+(\d+)/i);
      if (!posMatch) break;

      const pos = parseInt(posMatch[1], 10);
      if (isNaN(pos) || pos <= 0 || pos >= current.length) break;

      if (msg.includes("Expected ',' or ']'") || msg.includes("Expected ',' or '}'")) {
        // Check if there is an unescaped quote right before pos that prematurely ended a string
        const prevQuoteIdx = current.lastIndexOf('"', pos - 1);
        if (
          prevQuoteIdx > 0 &&
          current[prevQuoteIdx - 1] !== "\\" &&
          pos - prevQuoteIdx <= 6
        ) {
          const charAtPos = current[pos];
          if (charAtPos !== '"' && charAtPos !== "{" && charAtPos !== "[") {
            current =
              current.slice(0, prevQuoteIdx) +
              '\\"' +
              current.slice(prevQuoteIdx + 1);
            continue;
          }
        }
        // Otherwise insert a comma at pos
        current = current.slice(0, pos) + "," + current.slice(pos);
        continue;
      }

      if (msg.includes("Expected ':' after property name")) {
        const prevQuoteIdx = current.lastIndexOf('"', pos - 1);
        if (prevQuoteIdx > 0 && current[prevQuoteIdx - 1] !== "\\") {
          current =
            current.slice(0, prevQuoteIdx) +
            '\\"' +
            current.slice(prevQuoteIdx + 1);
          continue;
        }
      }

      if (msg.includes("Unexpected token") || msg.includes("Expected double-quoted property name")) {
        // Remove trailing comma before } or ] around pos
        const sliceAround = current.slice(Math.max(0, pos - 10), pos + 2);
        if (/,\s*[}\]]/.test(sliceAround)) {
          const commaIdx = current.lastIndexOf(",", pos);
          if (commaIdx !== -1) {
            current = current.slice(0, commaIdx) + current.slice(commaIdx + 1);
            continue;
          }
        }
      }

      // If we can't fix in-place at pos, truncate cleanly to the last complete '}' BEFORE pos
      const safeBraceBeforeError = current.lastIndexOf("}", pos - 1);
      if (safeBraceBeforeError > 50) {
        const candidate = closeIncompleteJson(current.slice(0, safeBraceBeforeError + 1));
        try {
          return JSON.parse(candidate);
        } catch (_) {
          current = candidate;
        }
      } else {
        break;
      }
    }
  }

  return null;
}

function repairAndParseJson(rawText: string): any {
  if (!rawText || !rawText.trim()) {
    throw new Error("لم يتم استلام محتوى من خدمة الذكاء الاصطناعي");
  }

  let cleaned = rawText.trim();
  const mdMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (mdMatch) {
    cleaned = mdMatch[1].trim();
  } else {
    const startIdx = cleaned.indexOf("{");
    const lastIdx = cleaned.lastIndexOf("}");
    if (startIdx !== -1 && lastIdx !== -1 && lastIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, lastIdx + 1);
    } else if (startIdx !== -1) {
      cleaned = cleaned.substring(startIdx);
    }
  }

  // Attempt 1: Direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Attempt 2: Fix missing commas between adjacent objects/arrays/strings and trailing commas
  const commaFixed = cleaned
    .replace(/}\s*\{/g, "},{")
    .replace(/\]\s*\[/g, "],[")
    .replace(/"\s*\n\s*"/g, '",\n"')
    .replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(commaFixed);
  } catch (_) {}

  // Attempt 3: Sanitize control chars and interior unescaped quotes
  const sanitized = sanitizeControlCharsAndQuotes(commaFixed);
  try {
    return JSON.parse(sanitized);
  } catch (_) {}

  // Attempt 4: Close incomplete JSON on sanitized
  try {
    return JSON.parse(closeIncompleteJson(sanitized));
  } catch (_) {}

  // Attempt 5: Surgical positional repair on sanitized & commaFixed
  const surgical1 = surgicalPositionalRepair(sanitized);
  if (surgical1) return surgical1;

  const surgical2 = surgicalPositionalRepair(commaFixed);
  if (surgical2) return surgical2;

  // Attempt 6: Progressive backward truncation to find the largest valid prefix
  let searchPos = sanitized.length;
  for (let i = 0; i < 20; i++) {
    const braceIdx = sanitized.lastIndexOf("}", searchPos - 1);
    if (braceIdx <= 50) break;
    searchPos = braceIdx;
    try {
      const candidate = closeIncompleteJson(sanitized.slice(0, braceIdx + 1));
      return JSON.parse(candidate);
    } catch (_) {}
  }

  throw new Error("تعذر فك شفرة استجابة الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.");
}
