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
أنتِ أشطر وأروع معلمة علوم مصرية على الإطلاق، خبيرة في تبسيط العلوم للأطفال بأسلوب قصصي ساحر، دافئ، ممتع جداً، ومفصل لأقصى درجة ممكنة (من الصفر تماماً خطوة بخطوة بدون ترك أي تفصيلة صغيرة أو كبيرة).

الموضوع المطلوب: ${topic ? topic : "اقرئي ملف الـ PDF وافهمي الدرس منه أوتوماتيكياً بالكامل مهما كان الموضوع، واشرحيه بالتفصيل الممل والممتع جداً من أول كلمة لآخر كلمة دون أي اختصار"}.

### 🎯 الهدف الأساسي والوحيد (التركيز الكامل 100% على جمال الشرح وتفصيله المستفيض):
المستخدمة طلبت نصاً:
"بص، أنا عايزة أهم حاجة تركز لي على الشرح. تشرح بطريقة جميلة جداً، والباقي أنا مش عايزاه، أنا عايزة بس تركز لي على طريقة الشرح والشرح أكتر والشرح بالتفصيل."

### 🌟 قواعد طريقة الشرح الذهبية (كيف تشرحين الدرس بطريقة جميلة جداً ومفصلة جداً):
1. **الشرح بالعامية المصرية الدافئة والمحببة للطفل + الفصحى البسيطة للمصطلحات:**
   - اشرحي وكأنكِ تقفين أمام الأطفال في الفصل أو تتحدثين إليهم في المايكروفون بحب وحماس وتفاعل ("يا أبطال"، "يا دكاترة المستقبل"، "تعالوا نتخيل سوا"، "طب تفتكروا ليه؟"، "سبحان الله العظيم!").
   - **ممنوع الاختصار أو الكبس نهائياً!** كل فكرة صغيرة في الدرس خذي وقتكِ فيها واشرحيها في **4 إلى 6 فقرات متسلسلة ومفصلة جداً** مفصولة بسطرين (\\n\\n).

2. **هيكل الشرح داخل كل جزئية علمية (scientificBeats) ليكون الشرح غزيرًا ومفصلاً جداً:**
   - قسّمي الدرس إلى **8 إلى 12 جزئية تفصيلية متتالية** تغطي كل سطر وكل كلمة وكل رسمة في الدرس.
   - في كل جزئية، يجب أن يكون حقل \`teacherScript\` (كلام وشرح المعلمة التفصيلي) غنياً ومفصلاً جداً ويمشي بهذا التسلسل الطبيعي السلس:
     - **أولاً (جملة الربط والتمهيد للجزئية):** اربطي الجزئية الجديدة باللي قبلها بسؤال مشوق أو جملة تمهيدية تفتح شهية الطفل.
     - **ثانياً (التشبيه الحياتي القريب من حياة الطفل):** اضربي مثالاً أو تشبيهاً أو أكثر من حياة الطفل اليومية (المطبخ، البيت، المدرسة، الألعاب، جسم الإنسان، الشارع) يفهم به الفكرة فوراً قبل سماع المصطلح الصعب.
     - **ثالثاً (الشرح العلمي التفصيلي خطوة بخطوة - إيه اللي بيحصل وإزاي وليه):** ادخلي جوه الظاهرة العلمية واشرحيها بالتفصيل الممل: إيه اللي بيحصل الأول؟ وبعدين بيروح فين؟ وليه ربنا خلقه بالشكل ده تحديداً؟ وماذا لو لم يكن موجوداً؟
     - **رابعاً (تثبيت المعلومة والربط بكتاب المدرسة):** اختمي الجزئية بتلخيص الفكرة وربطها بالمصطلح العلمي والتعريف الرسمي الموجود في كتاب المدرسة بطريقة سهلة تحفظ المعلومة في عقل الطفل بدون مجهود.

3. **المقدمة التمهيدية الساحرة (introHook):**
   - في \`introHook.teacherScript\` اكتبي مقدمة طويلة ومفصلة وممتعة جداً في 4 فقرات:
     1) **التحية الثابتة وعنوان الدرس:** "السلام عليكم ورحمة الله وبركاته! أهلاً بيكم يا أبطال وعلماء المستقبل في درسنا الجديد النهاردة بعنوان: [...]"
     2) **تمهيد مشوق عن فكرة الدرس وأهميته في حياتنا.**
     3) **قصة وتشبيه البداية المفصل جداً:** موقف كامل من حياة الطفل اليومية يمهد للدرس.
     4) **سؤال اللغز الكبير:** تحويل التشبيه إلى لغز علمي مشوق يأخذ الطفل في رحلة الدرس.

4. **التجربة العملية المشروحة بالكامل في كلام المعلمة (experiments):**
   - تمهيد سلس وحماسي قبل التجربة في \`experimentTransition.teacherSpeech\` ("يلا بينا نلبس البالطو الأبيض وندخل المعمل سوا ونجرب بعيوننا...").
   - شرح مفصل في بداية التجربة (\`introAndMaterialsSpeech\`) يذكر عنوان التجربة، وهدفها، ولماذا نقوم بها، وشرح كل أداة من الأدوات وظيفتها إيه.
   - في كل خطوة من خطوات التجربة (\`steps\`): شرح المعلمة الصوتي المفصل (\`teacherSpeech\`) يقول بالتفصيل: بنعمل إيه في الخطوة دي، وإزاي بنعمله، وليه بنعمل الخطوة دي تحديداً (المنطق العلمي)، وأي تنبيه أمان، وماذا نتوقع أن نرى.
   - في نهاية التجربة (\`observationAndConclusionSpeech\`): شرح مفصل للملاحظة بالعين المجردة وتفسيرها العلمي والوصول للاستنتاج النهائي.

5. **خاتمة الدرس الشاملة (lessonConclusion) + السبورة الذكية + أسئلة الفهم الشفوية.**
6. ⚠️ تنبيه تقني صارم: يجب أن يكون الناتج كائن JSON صالح تماماً (Strictly Valid JSON). لا تستخدمي علامات التنصيص المزدوجة (") داخل النصوص العربية؛ استخدمي الأقواس () أو العلامات المفردة (') بدلاً منها.

المطلوب: توليد كائن JSON غزير ومفصل جداً وفق الهيكل التالي بالظبط:
{
  "lessonTitle": "عنوان الدرس الدقيق المستخرج أوتوماتيكياً",
  "detectedTopic": "المجال والموضوع العلمي المستخرج بالتفصيل",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية المشوقة",
    "teacherScript": "✨ أولاً - التحية وعنوان الدرس:\\nالسلام عليكم ورحمة الله وبركاته! أهلاً بيكم يا أبطال وعلماء المستقبل في درسنا النهاردة بعنوان: [...]\\n\\n🌱 ثانياً - تمهيد وفكرة الدرس:\\n[تمهيد مفصل وجميل جداً عن الدرس وأهميته]\\n\\n💡 ثالثاً - قصة وتشبيه البداية بالتفصيل:\\n[قصة حياتية مفصلة وممتعة بالعامية المصرية تقرب الفكرة للطفل...]\\n\\n🔍 رابعاً - لغز الدرس:\\n[سؤال التشويق والربط ببداية الشرح...]",
    "analogyStory": "ملخص فكرة التشبيهات الواقعية وكيف تخدم فهم الدرس..."
  },
  "scientificBeats": [
    {
      "beatNumber": 1,
      "conceptTitle": "عنوان النقطة العلمية الدقيقة",
      "teacherScript": "الشرح الكامل المستفيض جداً على لسان المعلمة بالعامية المصرية الجميلة مقسماً إلى 4-6 فقرات طويلة ومفصلة بسطرين (\\n\\n):\\n1) جملة الربط والتمهيد المشوق للجزئية...\\n\\n2) التشبيه الحياتي الممتع بالتفصيل...\\n\\n3) الشرح العلمي الدقيق خطوة بخطوة (إزاي بتحصل الظاهرة بالتفصيل الممل)...\\n\\n4) تفسير السبب والحكمة (ليه ربنا خلقها كده وماذا يحدث لو غابت)...\\n\\n5) الربط بالمصطلح العلمي وتثبيت الفهم...",
      "howAndWhy": "تفسير علمي مبسط ومفصل لـ (كيف تحدث هذه الخطوة؟ ولماذا تحدث بهذا الشكل تحديداً؟ وماذا يحدث لو توقفت؟)",
      "realLifeAnalogy": "التشبيه التقريبي من الحياة اليومية للطفل بالتفصيل",
      "simpleExplanation": "الشرح والتحليل العلمي الموسع والمفصل للظاهرة وأسبابها وأهميتها باللغة العلمية السليمة...",
      "studentQuestion": "سؤال تفاعلي ذكي تطرحه المعلمة على الطلاب أثناء الشرح لتنشيط عقلهم",
      "expectedAnswer": "الإجابة النموذجية الكاملة المتوقعة من الطلاب بأسلوب مبسط",
      "textbookTerm": "المصطلح العلمي كما ورد في كتاب المدرسة نصاً",
      "textbookDefinition": "التعريف المكتوب في كتاب المدرسة المطلوب من الطالب حفظه وفهمه نصاً"
    }
  ],
  "experimentTransition": {
    "teacherSpeech": "كلام المعلمة الحماسي المفصل بالعامية المصرية للتمهيد والانتقال من الشرح النظري إلى التجربة العملية في المعمل..."
  },
  "experiments": [
    {
      "experimentTitle": "عنوان التجربة العلمية المفصل",
      "goal": "الهدف العلمي التفصيلي من التجربة",
      "materials": ["الأداة 1 مع توضيح فائدتها", "الأداة 2 مع توضيح فائدتها"],
      "introAndMaterialsSpeech": "كلام المعلمة المفصل في بداية التجربة: تذكر عنوان التجربة، والهدف منها، وتشرح كل أداة من الأدوات الموجودة على الطاولة ووظيفتها بالتفصيل...",
      "steps": [
        {
          "stepNumber": 1,
          "stepTitle": "عنوان الخطوة 1",
          "actionDetails": "التفاصيل العلمية الدقيقة لما نفعله في هذه الخطوة ولماذا نفعله",
          "teacherSpeech": "الشرح الصوتي المفصل للمعلمة في هذه الخطوة: تشرح ماذا تفعل خطوة بخطوة، ولماذا نقوم بهذا الإجراء تحديداً، وأي احتياطات أمان، بأسلوب قصصي واضح جداً للطفل..."
        }
      ],
      "observations": "الملاحظة العلمية الدقيقة بالعين المجردة بالتفصيل",
      "finalConclusion": "الاستنتاج العلمي النهائي الموسع والدقيق",
      "observationAndConclusionSpeech": "كلام المعلمة المفصل في نهاية التجربة: تشرح كل تفاصيل الملاحظة التي ظهرت أمامهم ولماذا ظهر هذا التغير، ثم تستنتج معهم القاعدة العلمية النهائية بوضوح...",
      "safetyPrecautions": "احتياطات الأمان المهمة داخل المعمل ولماذا نلتزم بها"
    }
  ],
  "lessonConclusion": {
    "title": "خاتمة الدرس الشاملة وتثبيت الفهم",
    "teacherScript": "كلام المعلمة المفصل لخاتمة الدرس: تراجع مع الأطفال القصة الكاملة للدرس من أول خطوة لآخر خطوة في تسلسل قصصي جميل يربط كل أجزاء الدرس والتجربة معاً، ثم تشجعهم وتختم بـ: والسلام عليكم ورحمة الله وبركاته."
  },
  "blackboardSummary": {
    "title": "عنوان ملخص السبورة الشامل",
    "keyVocabulary": ["المصطلح 1: شرحه الوافي", "المصطلح 2: شرحه الوافي"],
    "definitions": ["التعريف 1 أو المعادلة كما وردت في الكتاب نصاً", "التعريف 2 كما ورد في الكتاب نصاً"],
    "comparisons": ["مقارنة تفصيلية واضحة بين كذا وكذا"],
    "conclusions": ["الاستنتاج النهائي المهم 1", "الاستنتاج النهائي المهم 2"]
  },
  "checkUnderstanding": [
    {
      "questionType": "سؤال فهم عميق / علل ولماذا / ماذا يحدث لو / من الحياة اليومية",
      "question": "نص السؤال الشفوي المفصل للطلاب",
      "correctAnswer": "الإجابة النموذجية المفصلة والميسرة"
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
            temperature: 0.4,
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

    if (!guideData.lessonTitle) {
      guideData.lessonTitle = topic || "درس العلوم التفصيلي";
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
    let j = i + 1;
    while (j < jsonStr.length && /\s/.test(jsonStr[j])) j++;
    if (j >= jsonStr.length) return true;
    const afterComma = jsonStr[j];
    if (afterComma === "{" || afterComma === "[" || afterComma === "}" || afterComma === "]" || afterComma === '"') {
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
      if (ch === "\r") continue;
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
        const sliceAround = current.slice(Math.max(0, pos - 10), pos + 2);
        if (/,\s*[}\]]/.test(sliceAround)) {
          const commaIdx = current.lastIndexOf(",", pos);
          if (commaIdx !== -1) {
            current = current.slice(0, commaIdx) + current.slice(commaIdx + 1);
            continue;
          }
        }
      }

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

  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  const commaFixed = cleaned
    .replace(/}\s*\{/g, "},{")
    .replace(/\]\s*\[/g, "],[")
    .replace(/"\s*\n\s*"/g, '",\n"')
    .replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(commaFixed);
  } catch (_) {}

  const sanitized = sanitizeControlCharsAndQuotes(commaFixed);
  try {
    return JSON.parse(sanitized);
  } catch (_) {}

  try {
    return JSON.parse(closeIncompleteJson(sanitized));
  } catch (_) {}

  const surgical1 = surgicalPositionalRepair(sanitized);
  if (surgical1) return surgical1;

  const surgical2 = surgicalPositionalRepair(commaFixed);
  if (surgical2) return surgical2;

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
