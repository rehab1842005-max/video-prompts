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

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل مهما كان الموضوع دون أي اختصار أو كبس للمعلومات"}.

### ⚠️ القاعدة الجوهرية الإلزامية: الشرح المفصل الدقيق خطوة بخطوة (ممنوع الاختصار أو دمج المفاهيم نهائياً):
المستخدمة تكرر وتؤكد بحزم: "عايزه الشرح يكون بالتفصيل!".
السبب في شعورها بالاختصار سابقاً هو دمج عدة مفاهيم علمية في جزئية واحدة أو الاكتفاء بسرد سريع في سطرين.
لذلك، التزم بالقواعد الصارمة التالية لجعل الشرح مفصلاً وممتعاً من الألف إلى الياء:

1. **تفكيك الدرس إلى جزيئات صغيرة متتالية (One Concept Per Beat):**
   - قسّم الدرس إلى **جميع أفكاره ونقاطه الفرعية الفردية (من 8 إلى 14 جزئية علمية دقيقة)**.
   - ممنوع تماماً دمج نقطتين في جزئية واحدة! كل جزئية تشرح مفهوماً واحداً فقط باستفاضة وتؤدة وتفصيل كامل.
   - مثال في درس النبات: لا تدمج الجذور مع أوعية الخشب، ولا تدمج البلاستيدات مع الكلوروفيل، ولا تدمج ثاني أكسيد الكربون مع الثغور، ولا تدمج الجلوكوز مع الأكسجين.. اجعل لكل واحد منها جزئية منفصلة تماماً!

2. **قواعد صياغة كلام المعلمة في كل جزئية (سيناريو تسجيل صوتي كامل ومستفيض):**
   - **ابدأ من الصفر:** افترض أن الطفل لم يسمع عن هذا المفهوم في حياته ولا يعرف أي مصطلح معقد.
   - **سؤال تمهيدي في بداية الجزئية:** تبدأ المعلمة بسؤال شيق يثير فضول الطلاب وتفكيرهم.
   - **حوار الشرح المستفيض بالعامية المصرية:** كلام هادئ وطبيعي ومفصل كأن المعلمة تشرح داخل الفصل لمدة دقيقة كاملة، تشرح الحكاية خطوة بخطوة دون أي قفز.
   - **توضيح كيف ولماذا تحدث كل خطوة بالمنطق العلمي:** لا تكتفِ بذكر ما يحدث، بل اشرح بالتفصيل: *ليه بيحصل كدا؟ وإزاي بيحصل؟ ومنين جه ده؟ وبيروح فين؟ وماذا يحدث لو مش موجود؟*
   - **التشبيه الحياتي الواقعي:** ضرب مثال من الحياة اليومية (المطبخ، البيت، الأكل، الشرب، اللعب) لتقريب الفكرة.
   - **المصطلح والتعريف في الكتاب:** في نهاية الجزئية بعد التمهيد والشرح، تذكر المعلمة المصطلح الرسمي كما ورد في كتاب المدرسة وتعريفه الواضح المطلوب من الطالب حفظه وفهمه.
   - **سؤال تأكيدي سريع:** سؤال شفهي في نهاية الجزئية مع الإجابة المتوقعة من الطلاب.

3. **توليد برومبت فيديو Flow لكل تشبيه ومشهد ذُكر في كلام المعلمة:**
   - لكل تشبيه أو موقف بصري ورد في كلام المعلمة: ولد برومبت فيديو مستقل لموقع Flow (3D Pixar animation سينمائي بجودة عالية، بدون أي معلمين نهائياً ABSOLUTELY NO teachers, NO school).
   - ينتج عن ذلك قائمة برومبتات فيديو متتالية (فيديو 1، فيديو 2...) لكل جزئية لتجمعها المعلمة في المونتاج فوق صوتها.

4. **الانتقال والتمهيد للتجربة العملية (يلا بينا نجرب ونعمل كذا!):**
   - فقرة كلامية دافئة وحماسية للمعلمة للانتقال من نهاية الشرح النظري إلى بداية التجربة العملية دون أي قفز.
   - برومبت فيديو Flow لدخول معمل العلوم للأطفال بحماس.

5. **التجربة العملية مقسمة لخطوات مرقمة (1، 2، 3) بالتفصيل:**
   - كل خطوة معملية تشرح: ماذا نفعل ولماذا نفعل ذلك بالمنطق العلمي + كلام المعلمة أثناء الخطوة + برومبت فيديو Flow لتنفيذ الخطوة معملياً بدقة.
   - الملاحظة بالعين المجردة مع فيديو Flow لتغير النتيجة + الاستنتاج واحتياطات الأمان.

6. **السبورة الذكية وأسئلة الفهم الشفوية.**

المطلوب: توليد كائن JSON دقيق ومفصل جداً وفق الهيكل التالي بالضبط:
{
  "lessonTitle": "عنوان الدرس الدقيق المستخرج أوتوماتيكياً",
  "detectedTopic": "المجال والموضوع العلمي المستخرج بالتفصيل",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية ومقارنة الفكرة بالحياة",
    "teacherScript": "كلام المعلمة المفصل والمشوق جداً (فقرة حوارية كاملة وغنية) بالعامية المصرية لافتتاح الدرس وطرح التشبيهات...",
    "analogyStory": "شرح التشبيهات الواقعية الواردة بالتفصيل...",
    "videoPrompts": [
      {
        "shotTitle": "فيديو 1: عنوان التشبيه الأول الوارد في كلام المعلمة",
        "prompt": "Detailed English 3D Pixar animation prompt for Flow strictly showing this first analogy scene. Dynamic cinematic motion, warm joyful lighting. ABSOLUTELY NO teachers, NO school classroom."
      },
      {
        "shotTitle": "فيديو 2: عنوان التشبيه أو المشهد الثاني في كلام المعلمة",
        "prompt": "Detailed English 3D Pixar animation prompt for Flow strictly showing this second visual analogy scene. ABSOLUTELY NO teachers, NO school."
      }
    ]
  },
  "scientificBeats": [
    {
      "beatNumber": 1,
      "conceptTitle": "عنوان النقطة العلمية الدقيقة الواحدة فقط",
      "teacherScript": "كلام المعلمة المفصل والمستفيض جداً (حوار متكامل بالعامية المصرية يبدأ بسؤال تمهيدي، ثم شرح هادئ خطوة بخطوة، وتوضيح كيف ولماذا، ثم ربط بالمصطلح العلمي)",
      "simpleExplanation": "الشرح والتحليل العلمي الموسع والمفصل للظاهرة وأسبابها وأهميتها البيولوجية أو الفيزيائية بالتفصيل...",
      "studentQuestion": "سؤال تفاعلي تطرحه المعلمة على الطلاب أثناء الشرح",
      "expectedAnswer": "الإجابة النموذجية المتوقعة من الطلاب",
      "textbookTerm": "المصطلح العلمي كما ورد في كتاب المدرسة نصاً",
      "textbookDefinition": "التعريف المكتوب في كتاب المدرسة المطلوب من الطالب حفظه وفهمه نصاً",
      "videoPrompts": [
        {
          "shotTitle": "فيديو 1: عنوان المشهد أو التشبيه الأول لهذه الجزئية",
          "prompt": "Detailed English 3D Pixar scientific macro visualization prompt for Flow strictly illustrating this specific mechanism. Dynamic camera, educational, vivid colors. ABSOLUTELY NO teachers, NO classrooms."
        },
        {
          "shotTitle": "فيديو 2: عنوان المشهد أو التشبيه الثاني لهذه الجزئية",
          "prompt": "Detailed English 3D Pixar scientific animation prompt for Flow strictly showing the complementary visual moment. ABSOLUTELY NO teachers."
        }
      ]
    }
  ],
  "experimentTransition": {
    "teacherSpeech": "كلام المعلمة الحماسي بالعامية المصرية للتمهيد والانتقال للتجربة: 'شفتوا يا شطار الجمال العلمي ده؟ طب تفتكروا إحنا في العلوم بنصدق وخلاص؟ لأ طبعاً! يلا بينا نلبس البالطو وندخل المعمل سوا ونتأكد بعيوننا... جاهزين؟ يلا بينا نجرب ونعمل كذا!'",
    "flowVideoPrompt": "Delightful 3D Pixar style shot of entering a bright clean children science lab filled with colorful glassware, magnifying glasses, and fun science tools on a wooden bench. Warm inviting lighting. ABSOLUTELY NO teachers."
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
          "flowVideoPrompt": "Detailed English 3D laboratory animation prompt for Flow strictly showing this specific lab step action with glass beakers, tools, and materials on a clean lab bench. Macro cinematic lighting. ABSOLUTELY NO teachers."
        }
      ],
      "observations": "ماذا نلاحظ بعيوننا أثناء التجربة بالتفصيل الدقيق؟",
      "observationVideoPrompt": "Detailed English 3D macro animation prompt for Flow showing the visible scientific result and color/state change in the test. ABSOLUTELY NO teachers.",
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
