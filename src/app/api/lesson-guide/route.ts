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
أنت كبير موجهي العلوم ومؤلف السيناريوهات التعليمية للأطفال وخبير فيديوهات الـ B-Roll والرسوم العلمية ثلاثية الأبعاد (3D Scientific Visualization).

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل مهما كان الموضوع دون أي اختصار أو تخمين"}.

### ⚠️ القواعد الجوهرية الصارمة (بناءً على طلب المعلمة الحرفي):
1. **الشرح وكلام المعلمة مبسط ومفصل وممتع جداً أوتوماتيكياً:**
   - افهم الدرس أوتوماتيكياً واشرحه بأسلوب المعلمة الدافئ بالعامية المصرية الصبورة للأطفال من الصفر.
   - ممنوع الاختصار أو الإيجاز الشديد، بل فقرة حوارية ممتعة ومفصلة في كل جزئية تشرح (ليه وإزاي ومنين راح وفين؟).

2. **توليد كذا برومبت فيديو تحت كلام المعلمة (لكل تشبيه وموقف بصري قيل في كلام المعلمة):**
   - المعلمة طلبت بوضوح: "في كلام المعلمة في كذا تشبيه، فانت تعمل كل تشبيه، يعني اعمل كذا برومبت فيديو تحت بعض، كل برومبت يشمل تشبيه من اللي اتقال، وأنا هجمع الفيديوهات دي مع بعض في المونتاج.. مش فيديو واحد بس، لا المفروض كل تشبيه كلام المعلمة قالته يبقى موجود!".
   - حلل كلام المعلمة في الدخلة وفي كل جزئية علمية بدقة، واستخرج **كل تشبيه أو مشهد بصري** ورد في كلامها، وضع له برومبت فيديو مستقل لموقع Flow (بدون معلمة نهائياً ABSOLUTELY NO teachers, NO school).
   - ينتج عن ذلك قائمة برومبتات فيديو متتالية (فيديو 1، فيديو 2، فيديو 3...) لكل جزئية لتجمعها المعلمة في المونتاج.

3. **انتقال وتمهيد سلس من الشرح إلى التجربة (بدون أي قفز):**
   - المعلمة طلبت: "انت دخلت لما خلصت الشرح ودخلت على التجربة نطيت على طول، المفروض كلام المعلمة 'يلا بينا نجرب ونعمل كذا'، خلي الكلام في تناسق وميبقاش فيه نط".
   - صغ فقرة كلامية دافئة وحماسية للمعلمة للانتقال للتجربة:
     (مثال: "شفتوا يا شطار الجمال العلمي ده؟ طب تفتكروا إحنا كعلماء بنصدق الكلام وخلاص من غير ما نتأكد بعنينا؟ لأ طبعاً! يلا بينا نلبس البالطو الأبيض وندخل المعمل سوا، ونعمل أحلى تجربة عملية نتأكد بيها من المعجزة دي بعيوننا! جاهزين؟ يلا بينا!").
   - مع برومبت فيديو Flow لحماس دخول معمل الأطفال والأدوات المعملية.

4. **تفكيك كل تجربة إلى خطوات مرقمة (1، 2، 3) مع برومبت فيديو لكل خطوة في المعمل.**
5. **المصطلح والتعريف كما هو في كتاب المدرسة نصاً في نهاية كل جزئية.**
6. **السبورة الذكية وأسئلة الفهم الشفوية.**

المطلوب: توليد كائن JSON دقيق ومفصل جداً وفق الهيكل التالي بالضبط:
{
  "lessonTitle": "عنوان الدرس الدقيق المستخرج أوتوماتيكياً",
  "detectedTopic": "المجال والموضوع العلمي المستخرج",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية",
    "teacherScript": "كلام المعلمة المفصل والمشوق بالعامية المصرية لافتتاح الدرس وطرح التشبيهات...",
    "analogyStory": "شرح فكرة التشبيهات الحياتية الواردة بالتفصيل...",
    "videoPrompts": [
      {
        "shotTitle": "عنوان التشبيه الأول الوارد في كلام المعلمة",
        "prompt": "Detailed English 3D Pixar animation prompt for Flow strictly showing this first analogy scene. Dynamic cinematic motion, warm joyful lighting. ABSOLUTELY NO teachers, NO school classroom."
      },
      {
        "shotTitle": "عنوان التشبيه الثاني الوارد في كلام المعلمة",
        "prompt": "Detailed English 3D Pixar animation prompt for Flow strictly showing this second visual analogy scene. ABSOLUTELY NO teachers, NO school."
      }
    ]
  },
  "scientificBeats": [
    {
      "beatNumber": 1,
      "conceptTitle": "عنوان الجزئية العلمية بالتفصيل",
      "teacherScript": "كلام المعلمة المستفيض والمفصل (4-8 أسطر كاملة) بالراحة واحدة واحدة للأطفال من الصفر بالعامية المصرية...",
      "simpleExplanation": "الشرح العلمي الموسع والمفصل للظاهرة وكيف ولماذا تحدث بالتحديد...",
      "textbookTerm": "المصطلح العلمي كما ورد في كتاب المدرسة",
      "textbookDefinition": "التعريف المكتوب في كتاب المدرسة المطلوب من الطالب",
      "videoPrompts": [
        {
          "shotTitle": "عنوان المشهد أو التشبيه 1 في هذه الجزئية",
          "prompt": "Detailed English 3D Pixar scientific macro visualization prompt for Flow strictly illustrating this specific mechanism. Dynamic camera, educational, vivid colors. ABSOLUTELY NO teachers, NO classrooms."
        },
        {
          "shotTitle": "عنوان المشهد أو التشبيه 2 في هذه الجزئية",
          "prompt": "Detailed English 3D Pixar scientific animation prompt for Flow strictly showing the second complementary visual moment. ABSOLUTELY NO teachers."
        }
      ]
    }
  ],
  "experimentTransition": {
    "teacherSpeech": "كلام المعلمة بالعامية المصرية للتمهيد والانتقال للتجربة: 'شفتوا يا شطار الجمال العلمي ده؟ يلا بينا نجرب وندخل المعمل ونتأكد بعيوننا ونعمل أحلى تجربة...'",
    "flowVideoPrompt": "Delightful 3D Pixar style shot of entering a bright clean children science lab filled with colorful glassware, magnifying glasses, and fun science tools on a wooden bench. Warm inviting lighting. ABSOLUTELY NO teachers."
  },
  "experiments": [
    {
      "experimentTitle": "عنوان التجربة العلمية",
      "goal": "الهدف: لماذا نقوم بهذه التجربة؟",
      "materials": ["الأداة 1", "الأداة 2", "الأداة 3"],
      "steps": [
        {
          "stepNumber": 1,
          "stepTitle": "عنوان الخطوة 1",
          "actionDetails": "تفاصيل ما نفعله في الخطوة بالمنطق ولماذا",
          "teacherSpeech": "كلام المعلمة المفصل أثناء تنفيذ الخطوة...",
          "flowVideoPrompt": "Detailed English 3D laboratory animation prompt for Flow strictly showing this specific lab step action with glass beakers, tools, and materials on a clean lab bench. Macro cinematic lighting. ABSOLUTELY NO teachers."
        }
      ],
      "observations": "ماذا نلاحظ بعيوننا أثناء التجربة بالتفصيل؟",
      "observationVideoPrompt": "Detailed English 3D macro animation prompt for Flow showing the visible scientific result and color/state change in the test. ABSOLUTELY NO teachers.",
      "finalConclusion": "الاستنتاج العلمي النهائي الموسع",
      "safetyPrecautions": "احتياطات الأمان في المعمل"
    }
  ],
  "blackboardSummary": {
    "title": "عنوان السبورة",
    "keyVocabulary": ["المصطلح 1: معناه المفصل", "المصطلح 2: معناه المفصل"],
    "definitions": ["التعريف 1 كما ورد في الكتاب نصاً", "التعريف 2 كما ورد في الكتاب نصاً"],
    "comparisons": ["مقارنة سريعة ودقيقة بين كذا وكذا"],
    "conclusions": ["الاستنتاج النهائي المهم"]
  },
  "checkUnderstanding": [
    {
      "questionType": "من الحياة اليومية / علل ولماذا / استنتاج ذكي",
      "question": "نص السؤال الشفوي للطلاب",
      "correctAnswer": "الإجابة النموذجية الميسرة للمعلمة"
    }
  ]
}
`;

    parts.push({ text: systemPrompt });

    const fallbackModels = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest"
    ];

    let resultText = "";
    let lastError = null;

    for (const modelName of fallbackModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const res = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: "application/json"
          }
        });
        resultText = res.response.text();
        if (resultText && resultText.trim()) break;
      } catch (e: any) {
        lastError = e;
      }
    }

    if (!resultText) throw lastError || new Error("فشل توليد دليل المعلمة");

    const jsonMatch = resultText.match(/```json\n([\s\S]*?)\n```/) || resultText.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : resultText;
    const guideData = JSON.parse(cleanedJson);

    return NextResponse.json({ success: true, guide: guideData });
  } catch (error: any) {
    console.error("Error in lesson-guide route:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء إعداد دليل المعلمة" }, { status: 500 });
  }
}
