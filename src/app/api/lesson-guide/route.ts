import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get("pdfFile") as File | null;
    const topic = formData.get("topic") as string || "";

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
أنت كبير موجهي العلوم ومؤلف السيناريوهات التعليمية للأطفال وخبير فيديوهات الـ B-Roll الكرتونية ثلاثية الأبعاد اللطيفة للأطفال (Cute 3D Cartoon Pixar Style).

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل مهما كان الموضوع دون أي اختصار أو كبس للمعلومات"}.

### ⚠️ القواعد الصارمة المحدثة (الشرح بالعامية المصرية ثابت كما هو + التركيز الدقيق على الفيديوهات):
المستخدمة أكدت نصاً:
"الشرح الكلام العامي جميل جداً وما تغيرش منه حاجة، إحنا حالياً بنركز على الفيديوهات:
1. أنا مش عايزة الفيديو بيتكلم! أنا اللي هتكلم، فأهم حاجة عندي الفيديو يكون صح ويكون المطلوب يتنفذ.
2. عايزة فيديو بأشكال كرتونية تنفع للأطفال، حاجات 3D كده للأطفال على أشكال لطيفة ومبهجة".

### قواعد صياغة برومبتات الفيديو لموقع Flow (مهمة وحاسمة جداً بناءً على تجربة المونتاج):
1. **ممنوع بتاتاً أي شخصيات تتكلم أو تحرك فمها (STRICTLY NO TALKING, NO LIP-SYNC, NO SPEAKING HEADS):**
   - المعلمة هي التي تسجل صوتها في المونتاج (CapCut). الفيديو عبارة عن لقطات توضيحية بصرية حركية صامتة (Pure visual B-roll action).
   - ممنوع ظهور وجوه تتحدث للكاميرا أو فم يتحرك أو مقدمين.
   - يجب كتابة هذه الجملة الصريحة في كل برومبت:
     \`Mute visual action only, strictly NO talking characters, NO speaking mouth animation, NO dialogue, NO lip sync. Pure visual storytelling for voiceover overlay.\`

2. **الأسلوب البصري: كرتوني ثلاثي الأبعاد لطيف جداً ومناسب للأطفال (Cute Friendly 3D Cartoon Pixar Style):**
   - أشكال ناعمة ومستديرة ولطيفة جداً للأطفال (Soft rounded playful shapes, charming, cheerful vibrant colors, warm inviting lighting).
   - تجسيد كرتوني ثلاثي الأبعاد ممتع ومبهج للعين (قطرات ماء لطيفة ومستديرة، جزيئات ملونة جذابة، خلايا وأنسجة ثلاثية الأبعاد بأسلوب كرتوني ساحر ومحبب للطفل دون أي شكل معقد أو مخيف).

3. **قاعدة المونتاج الحاسمة (فيديو 10 ثوانٍ تتابعي بانتقالات سريعة يجمع كل التشبيهات):**
   - المستخدمة أوضحت مشكلة المونتاج نصاً:
     "في المونتاج، لما أعمل فيديو 10 ثواني وأحطه في المونتاج وأنا بتكلم، الفيديو بيكون طويل ومشهد واحد والصوت مش ماشي مع الصورة! أنا عايزة بدل ما تعمل فيديوهين أو أكتر، تعمل فيديو واحد بس شامل كل التشبيهات اللي بتقولها كلام المعلمة. لو احتجت تعمل فيديو كمان عادي، بس قصدي يبقى في فيديو 10 ثواني فيه انتقالات كتير بما يتناسب مع الكلام اللي بتقوله المعلمة".
   - **التعليمات الصارمة للتنفيذ:**
     - الأصل هو توليد **فيديو رئيسي واحد مدته 10 ثوانٍ** لكل جزئية/دخلة، يجمع كل التشبيهات المذكورة في كلام المعلمة في **تسلسل حركي سريع بانتقالات متتابعة (Multi-scene dynamic sequence with rapid seamless cuts)**.
     - يتم تقسيم الـ 10 ثوانٍ في نص البرومبت عبر مؤشرات زمنية دقيقة مثل: \`[0-3s]... [3-6s] Rapid transition to... [6-10s] Fast zoom to...\` لكي تتغير المشاهد والانتقالات بالتزامن التام مع سرعة كلام المعلمة فلا يشعر المشاهد بأي ملل أو بطء، ويكون الصوت ماشياً تماماً مع الصورة!
     - إذا كانت الجزئية طويلة جداً وتتطلب استكمالاً، يمكن إضافة فيديو ثانٍ تتابعي مكمل بنفس الأسلوب.

4. **صيغة البرومبت الإلزامية:**
   \`A dynamic 10-second multi-scene sequence with rapid seamless transitions, precisely paced for teacher voiceover: [0-3s]: First visual action... [3-6s]: Rapid seamless transition to second visual action... [6-10s]: Quick dynamic transition/zoom to third visual action... Fast-paced visual storytelling, cute friendly 3D cartoon Pixar animation for children, soft rounded playful style, vibrant cheerful colors. Mute visual action only, strictly NO talking characters, NO speaking mouth animation, NO dialogue, NO lip sync.\`

### بقية قواعد الشرح والدرس (تنظيم وتسلسل احترافي مع الحفاظ الكامل على كل التشبيهات الرائعة):
1. **المقدمة الثابتة دائماً في `introHook.teacherScript` (إلزامي في كل درس):**
   يجب تنظيم نص `introHook.teacherScript` في 3 فقرات واضحة ومنفصلة بسطرين (`\\n\\n`) بهذا التسلسل الثابت دائماً:
   - **الفقرة الأولى (التحية الثابتة وعنوان الدرس):** تبدأ دائماً بـ: "السلام عليكم ورحمة الله وبركاته، أهلاً بيكم يا أبطال وعلماء المستقبل في درسنا الجديد النهاردة بعنوان: [عنوان الدرس]."
   - **الفقرة الثانية (أول مقدمة عن الدرس):** تمهيد مبسط وواضح يشرح للطفل فكرة الدرس الأساسية وأهميته في حياتنا بشكل سهل قبل الدخول في التشبيه.
   - **الفقرة الثالثة (تشبيه البداية المشوق):** نفس التشبيهات الحياتية القوية والممتعة بالعامية المصرية بدون حذف أو تقصير، مع ربطها بسلاسة بالدرس.
2. **تنظيم كلام الشرح في `scientificBeats` بتسلسل سهل ومربوط:**
   - تقسيم الدرس إلى جزئيات صغيرة متتالية متصلة وشاملة (بين 6 إلى 10 جزئيات علمية دقيقة دون إغفال أي معلومة).
   - **تنظيم النص:** قسمي `teacherScript` في كل جزئية إلى فقرات قصيرة مرتبة ومنفصلة بـ `\\n\\n` (جملة ربط بالجزئية السابقة ⬅ الشرح والتشبيه الممتع كما هو ⬅ توضيح الكيف واللماذا ⬅ الربط بالمصطلح في الكتاب)، مع الحفاظ على كل التشبيهات كما هي تماماً.
   - ذكر السؤال التفاعلي وإجابته المتوقعة، والمصطلح والتعريف في الكتاب.
3. **التجربة العملية الواضحة والمتسلسلة وكل التفاصيل ظاهرة في الكلام (`experiments`):**
   - التمهيد السلس والانتقال للتجربة العملية في `experimentTransition.teacherSpeech`.
   - في كل تجربة داخل `experiments`:
     - إضافة حقل `introAndMaterialsSpeech`: كلام المعلمة المفصل في بداية التجربة تذكر فيه بصوتها **عنوان التجربة + الهدف منها + كل الأدوات الموجودة على الطاولة أداة بأداة** بتسلسل واضح.
     - تفكيك التجربة إلى خطوات مرقمة (1، 2، 3...) بحيث يبدأ `teacherSpeech` في كل خطوة بربط تسلسلي واضح (الخطوة الأولى... ثم الخطوة التانية... ثم الخطوة التالتة...) ويذكر بوضوح **كل التفاصيل في الكلام**: ماذا نفعل، ولماذا نفعله، وأي احتياطات أمان (مثل التسخين في حمام مائي) داخل كلام المعلمة نفسه + فيديو Flow لكل خطوة.
     - إضافة حقل `observationAndConclusionSpeech`: كلام المعلمة في نهاية التجربة تشرح فيه بصوتها **كل تفاصيل الملاحظة بالعين** (التغير اللوني أو النتيجة بدقة) ثم **الاستنتاج العلمي النهائي** بوضوح.
4. **خاتمة درس متسلسلة وممتازة (`lessonConclusion`):**
   - إضافة قسم `lessonConclusion` في نهاية الدرس يلخص للطفل رحلة الدرس والتجربة بتسلسل سهل ومشجع، ويربط كل النقاط معاً، ويختم بـ: "والسلام عليكم ورحمة الله وبركاته".
5. السبورة الذكية وأسئلة الفهم الشفوية.
6. ⚠️ تنبيه تقني صارم: يجب أن يكون الناتج كائن JSON صالح تماماً (Strictly Valid JSON). تجنب وضع علامات تنصيص مزدوجة (") داخل نصوص الحوار إلا إذا كانت مسبوقة بـ backslash (\\") لتفادي أخطاء الـ JSON syntax.

المطلوب: توليد كائن JSON دقيق ومفصل جداً وفق الهيكل التالي بالضبط:
{
  "lessonTitle": "عنوان الدرس الدقيق المستخرج أوتوماتيكياً",
  "detectedTopic": "المجال والموضوع العلمي المستخرج بالتفصيل",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية",
    "teacherScript": "✨ أولاً - التحية وعنوان الدرس:\\nالسلام عليكم ورحمة الله وبركاته! أهلاً بيكم يا أبطال وعلماء المستقبل في درسنا النهاردة بعنوان: [...]\\n\\n🌱 ثانياً - مقدمة الدرس:\\n[أول مقدمة مبسطة وواضحة عن الدرس وأهميته]\\n\\n💡 ثالثاً - تشبيه البداية:\\n[كلام المعلمة المشوق بالعامية المصرية والتشبيهات الممتعة بالتفصيل...]",
    "analogyStory": "شرح التشبيهات الواقعية الواردة بالتفصيل...",
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
      "safetyPrecautions": "احتياطات الأمان في المعمل"
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
      "gemini-3.5-flash-lite"
    ];

    let resultText = "";
    let lastError: any = null;

    for (const modelName of fallbackModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const res = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 8192,
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
    console.error("Error in lesson-guide route:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء إعداد دليل المعلمة" }, { status: 500 });
  }
}

// ==========================================
// Robust Multi-Stage JSON Repair & Recovery
// ==========================================

function sanitizeUnescapedQuotes(jsonStr: string): string {
  let result = "";
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (ch === '\\' && inString) {
      isEscaped = !isEscaped;
      result += ch;
      continue;
    }

    if (ch === '"' && !isEscaped) {
      if (!inString) {
        inString = true;
        result += ch;
      } else {
        // Look ahead to check if this quote is a structural closing quote
        let nextChar: string | null = null;
        for (let j = i + 1; j < jsonStr.length; j++) {
          const next = jsonStr[j];
          if (!/\s/.test(next)) {
            nextChar = next;
            break;
          }
        }

        if (nextChar === ':' || nextChar === ',' || nextChar === '}' || nextChar === ']' || nextChar === null) {
          inString = false;
          result += ch;
        } else {
          // Interior quote inside string value -> escape it
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
    if (ch === '\\' && inString) {
      isEscaped = !isEscaped;
      continue;
    }
    if (ch === '"' && !isEscaped) {
      inString = !inString;
    } else if (!inString) {
      if (ch === '{') stack.push('}');
      else if (ch === '[') stack.push(']');
      else if (ch === '}' || ch === ']') {
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

  s = s.replace(/,\s*$/, "");
  s = s.replace(/:\s*$/, ': ""');

  while (stack.length > 0) {
    s += stack.pop();
  }

  return s;
}

function truncateToLastValidObject(str: string): string {
  const lastClose = str.lastIndexOf("}");
  if (lastClose === -1) return str;
  const sub = str.substring(0, lastClose + 1);
  return closeIncompleteJson(sub);
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

  // Attempt 2: Sanitize interior unescaped quotes
  try {
    const quoteSanitized = sanitizeUnescapedQuotes(cleaned);
    return JSON.parse(quoteSanitized);
  } catch (_) {}

  // Attempt 3: Fix missing commas and trailing commas
  const fixed = cleaned
    .replace(/}\s*\{/g, "},{")
    .replace(/\]\s*\[/g, "],[")
    .replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(fixed);
  } catch (_) {}

  // Attempt 4: Sanitize quotes on fixed comma string
  try {
    const quoteSanitizedFixed = sanitizeUnescapedQuotes(fixed);
    return JSON.parse(quoteSanitizedFixed);
  } catch (_) {}

  // Attempt 5: Handle cut-off / incomplete JSON structure
  try {
    const closed = closeIncompleteJson(fixed);
    return JSON.parse(closed);
  } catch (_) {}

  // Attempt 6: Truncate back to last complete JSON object
  try {
    const truncated = truncateToLastValidObject(fixed);
    return JSON.parse(truncated);
  } catch (_) {}

  // Attempt 7: Truncate + sanitize quotes
  try {
    const truncatedWithQuotes = sanitizeUnescapedQuotes(truncateToLastValidObject(cleaned));
    return JSON.parse(truncatedWithQuotes);
  } catch (finalErr: any) {
    console.error("All JSON repair attempts failed. Raw snippet:", rawText.slice(0, 300));
    throw new Error("تعذر فك شفرة استجابة الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.");
  }
}
