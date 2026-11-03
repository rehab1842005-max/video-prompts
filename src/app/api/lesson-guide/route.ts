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

### قواعد صياغة برومبتات الفيديو لموقع Flow (مهمة وحاسمة جداً):
1. **ممنوع بتاتاً أي شخصيات تتكلم أو تحرك فمها (STRICTLY NO TALKING, NO LIP-SYNC, NO SPEAKING HEADS):**
   - المعلمة هي التي تسجل صوتها في المونتاج. الفيديو عبارة عن لقطات توضيحية بصرية حركية صامتة (Pure visual B-roll action).
   - ممنوع ظهور وجوه تتحدث للكاميرا أو فم يتحرك أو مقدمين.
   - يجب كتابة هذه الجملة الصريحة في كل برومبت:
     \`Mute visual action only, strictly NO talking characters, NO speaking mouth animation, NO dialogue, NO lip sync. Pure visual storytelling for voiceover overlay.\`

2. **الأسلوب البصري: كرتوني ثلاثي الأبعاد لطيف جداً ومناسب للأطفال (Cute Friendly 3D Cartoon Pixar Style):**
   - أشكال ناعمة ومستديرة ولطيفة جداً للأطفال (Soft rounded playful shapes, charming, cheerful vibrant colors, warm inviting lighting).
   - تجسيد كرتوني ثلاثي الأبعاد ممتع ومبهج للعين (قطرات ماء لطيفة ومستديرة، جزيئات كرتونية ملونة جذابة، خلايا وأنسجة ثلاثية الأبعاد بأسلوب كرتوني ساحر ومحبب للطفل دون أي شكل معقد أو مخيف).

3. **الدقة العلمية وتنفيذ المطلوب بالضبط (Accurate Concept Execution):**
   - البرومبت يصف بدقة الحركة الفعلية التي تتحدث عنها المعلمة (مثلاً: حركة الماء والأملاح وهي تصعد، فتح الثغور واستقبال الهواء، تكوين جزيئات السكر، أو مشهد تشبيهي لطيف).

4. **توليد برومبت فيديو Flow لكل تشبيه ومشهد بصري ورد في كلام المعلمة:**
   - إذا تضمن كلام المعلمة أكثر من تشبيه أو مشهد، يتم توليد برومبت فيديو منفصل لكل تشبيه لتجمعه المعلمة في المونتاج فوق صوتها.

### بقية قواعد الشرح والدرس (ثابتة وممتازة):
1. تقسيم الدرس إلى جزيئات صغيرة متتالية متصلة وشاملة (بين 6 إلى 10 جزئيات علمية دقيقة دون إغفال أي معلومة).
2. كلام المعلمة بالعامية المصرية الصبورة والمفصلة، مع التمهيد وتوضيح الكيف واللماذا، وسؤال تفاعلي وإجابته المتوقعة، وذكر المصطلح والتعريف في الكتاب.
3. التمهيد السلس والانتقال للتجربة العملية ("يلا بينا نجرب ونعمل كذا!").
4. تفكيك التجربة إلى خطوات مرقمة (1، 2، 3) مع فيديو Flow لكل خطوة معملية.
5. السبورة الذكية وأسئلة الفهم الشفوية.
6. ⚠️ تنبيه تقني صارم: يجب أن يكون الناتج كائن JSON صالح تماماً (Strictly Valid JSON). تجنب وضع علامات تنصيص مزدوجة (") داخل نصوص الحوار إلا إذا كانت مسبوقة بـ backslash (\\") لتفادي أخطاء الـ JSON syntax.

المطلوب: توليد كائن JSON دقيق ومفصل جداً وفق الهيكل التالي بالضبط:
{
  "lessonTitle": "عنوان الدرس الدقيق المستخرج أوتوماتيكياً",
  "detectedTopic": "المجال والموضوع العلمي المستخرج بالتفصيل",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية",
    "teacherScript": "كلام المعلمة المفصل والمشوق بالعامية المصرية لافتتاح الدرس وطرح التشبيهات...",
    "analogyStory": "شرح التشبيهات الواقعية الواردة بالتفصيل...",
    "videoPrompts": [
      {
        "shotTitle": "فيديو 1: عنوان التشبيه الأول الوارد في كلام المعلمة",
        "prompt": "Cute friendly 3D cartoon Pixar animation for children, soft rounded playful style, vibrant cheerful colors. [Accurate scene description]. Mute visual action only, strictly NO talking characters, NO speaking mouth animation, NO dialogue, NO lip sync. Clean cinematic motion."
      },
      {
        "shotTitle": "فيديو 2: عنوان التشبيه الثاني الوارد في كلام المعلمة",
        "prompt": "Cute friendly 3D cartoon Pixar animation for children, soft rounded cheerful aesthetic, warm joyful lighting. [Accurate scene description]. Mute visual action only, strictly NO talking characters, NO mouth movement, NO lip sync. Fluid smooth motion."
      }
    ]
  },
  "scientificBeats": [
    {
      "beatNumber": 1,
      "conceptTitle": "عنوان النقطة العلمية الدقيقة الواحدة فقط",
      "teacherScript": "كلام المعلمة المفصل والمستفيض جداً (حوار متكامل بالعامية المصرية يبدأ بسؤال تمهيدي، ثم شرح هادئ خطوة بخطوة، وتوضيح كيف ولماذا، ثم ربط بالمصطلح العلمي)",
      "simpleExplanation": "الشرح والتحليل العلمي الموسع والمفصل للظاهرة وأسبابها وأهميتها بالتفصيل...",
      "studentQuestion": "سؤال تفاعلي تطرحه المعلمة على الطلاب أثناء الشرح",
      "expectedAnswer": "الإجابة النموذجية المتوقعة من الطلاب",
      "textbookTerm": "المصطلح العلمي كما ورد في كتاب المدرسة نصاً",
      "textbookDefinition": "التعريف المكتوب في كتاب المدرسة المطلوب من الطالب حفظه وفهمه نصاً",
      "videoPrompts": [
        {
          "shotTitle": "فيديو 1: عنوان المشهد أو التشبيه الأول لهذه الجزئية",
          "prompt": "Cute friendly 3D cartoon Pixar style scientific visualization for children, soft rounded playful forms, vibrant glowing colors. [Accurate scientific action]. Mute visual action only, strictly NO talking characters, NO speaking mouth movement, NO lip sync. Clean macro focus."
        },
        {
          "shotTitle": "فيديو 2: عنوان المشهد أو التشبيه الثاني لهذه الجزئية",
          "prompt": "Cute friendly 3D Pixar animation for children, playful cheerful style, vibrant warm lighting. [Complementary visual action]. Mute visual action only, strictly NO talking characters, NO mouth animation, NO lip sync."
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
      "steps": [
        {
          "stepNumber": 1,
          "stepTitle": "عنوان الخطوة 1",
          "actionDetails": "تفاصيل ما نفعله في الخطوة بالمنطق العلمي الدقيق ولماذا",
          "teacherSpeech": "كلام المعلمة المفصل أثناء تنفيذ الخطوة في المعمل...",
          "flowVideoPrompt": "Cute clean 3D Pixar style laboratory tabletop animation for children: [Specific lab step action]. Macro tabletop focus, beautiful glass reflections. Mute action only, strictly NO talking characters, NO speaking mouth movement."
        }
      ],
      "observations": "ماذا نلاحظ بعيوننا أثناء التجربة بالتفصيل الدقيق؟",
      "observationVideoPrompt": "Delightful 3D macro animation for children showing the visible color change and chemical reaction clearly in vibrant colors. Mute visual action, strictly NO talking characters.",
      "finalConclusion": "الاستنتاج العلمي النهائي الموسع والدقيق",
      "safetyPrecautions": "احتياطات الأمان في المعمل"
    }
  ],
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
