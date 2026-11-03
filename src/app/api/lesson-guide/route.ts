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
أنت مدرس وموجه علوم عبقري ومخرج لقطات B-Roll توضيحية. مهمتك صياغة "دليل المعلمة لشرح وتبسيط العلوم للأطفال بالفصل" بحيث تسجل المعلمة الشرح بصوتها، واستخراج "برومبت فيديو لكل تشبيه حياتي" لاستخدامه في موقع Flow كفيديو توضيحي (B-Roll) يُركب في المونتاج فوق كلام المعلمة.

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل"}.

### القاعدة الجوهرية الإلزامية (برومبت فيديو لكل تشبيه - بدون معلمة نهائياً):
المستخدمة طلبت صراحة:
"دلوقتي احنا بنشبه الشرح بحاجة عشان يفهمها الطالب، فانا عايزة لو الحاجة دي فيديو مثلاً، يبقى وصف برومبت فيديو على فلو وانا اروح اعمله. مثلاً في المثال دوت: بنفتح التلاجة ناكل، فأنا عايزة فيديو بيوضح شخص بيفتح التلاجة وياكل، وأنا مثلاً في المونتاج أروح حطاه وأنا هتكلم. الجزء ده مش عايزة فيه معلمة نهائياً، أنا عايزة بس البرومبت تشبيه لكل حاجة!"

شروط برومبت الفيديو لموقع Flow:
1. **ممنوع وجود معلمات نهائياً (ABSOLUTELY NO teachers, NO classrooms, NO presenters):** الفيديو يصور فقط المشهد الحياتي للتشبيه (شخص يفتح الثلاجة ويأكل ساندوتش، كيكة ترتفع وتخبز في الفرن، شفاطة تسحب عصيراً منعشاً من كوب زجاجي، طفل يشتري فواكه من السوبر ماركت، شباك مشمس تدخله أشعة الشمس...).
2. **الأسلوب البصري (3D Pixar Style / Cinematic):** أسلوب سينمائي كرتوني 3D Pixar مبهج وعالي الجودة، مع حركة كاميرا ناعمة (Cinematic smooth camera motion, warm vibrant lighting).
3. **الجاهزية للنسخ لموقع Flow:** برومبت إنجليزي متقن يصف المشهد والحركة بدقة ليولده موقع Flow كفيديو مدته 5 إلى 10 ثوانٍ تضعه المعلمة في المونتاج (CapCut) فوق صوتها.

### الهيكل التعليمي المطلوب:
1. **بداية الدرس:** سؤال جذاب + كلام المعلمة بالحرف بالعامية المصرية + **برومبت فيديو تشبيه البداية (مثلاً شخص يفتح الثلاجة ويأكل)**.
2. **شرح أجزاء الدرس:**
   - كلام المعلمة بالعامية المصرية بالحرف (السكريبت الصوتي للمعلمة في المونتاج).
   - التشبيه من الحياة اليومية (المطبخ، البيت، الأكل، الشرب، اللعب).
   - **برومبت فيديو لموقع Flow يصور هذا التشبيه بالتحديد بدون معلمة**.
   - الشرح والسبب العلمي (كيف ولماذا تحدث الظاهرة).
   - سؤال بسيط للطلاب وإجابته المتوقعة وطريقة الانتقال.
3. **التجارب العلمية (إن وجدت):** الهدف، الأدوات، كل خطوة ولماذا نفعلها، ماذا نلاحظ، والاستنتاج النهائي، واحتياطات الأمان.
4. **ما يُكتب على السبورة فقط:** العنوان، الكلمات المهمة، التعريفات، المقارنات، الاستنتاج (بدون حشو).
5. **أسئلة قياس الفهم الشفوية:** أسئلة متدرجة مع إجاباتها للمعلمة.

المطلوب: توليد كائن JSON دقيق جداً وفق الهيكل التالي فقط:
{
  "lessonTitle": "عنوان الدرس الجذاب",
  "detectedTopic": "موضوع الدرس الدقيق",
  "opening": {
    "hookQuestion": "سؤال بداية الدرس من حياة الطلاب اليومية",
    "teacherOpeningDialogue": "الكلام الذي تقوله المعلمة للطلاب بالحرف بالعامية المصرية في أول دقيقة...",
    "openingAnalogyTitle": "اسم تشبيه البداية (مثلاً: فتح الثلاجة وتناول طعام خفيف)",
    "openingFlowVideoPrompt": "English 3D Pixar style video prompt for Flow illustrating the opening analogy: A hungry character opens a brightly glowing refrigerator in a cozy kitchen and happily takes out a delicious snack. Cinematic warm lighting, joyful animation. ABSOLUTELY NO teachers, NO school, pure lifestyle scene."
  },
  "sections": [
    {
      "partNumber": 1,
      "title": "عنوان الجزء",
      "teacherSpeech": "كلام المعلمة بالحرف بالعامية المصرية (السكريبت الصوتي للتسجيل)...",
      "realLifeAnalogy": "التشبيه الواقعي من المطبخ أو البيت أو اللعب وتوضيح أين ينتهي التشبيه...",
      "analogyTitle": "عنوان التشبيه بالعربي (مثلاً: صينية طعام في مطبخ مشمس)",
      "flowVideoPrompt": "English video prompt for Flow illustrating this real-life analogy: Cinematic 3D Pixar animation of the specific analogy (e.g. delicious ingredients, kitchen sunlight, straw sipping liquid, baking in oven). Dynamic camera motion, high detail, vibrant colors. ABSOLUTELY NO teachers, NO school, pure visual analogy.",
      "conceptExplanation": "توضيح لماذا وكيف تحدث الظاهرة علمياً ببساطة...",
      "studentQuestion": "سؤال بسيط تطرحه المعلمة على الطلاب...",
      "expectedAnswer": "إجابة الطلاب المتوقعة...",
      "transition": "طريقة الانتقال للنقطة التالية بسلاسة..."
    }
  ],
  "experiments": [
    {
      "experimentTitle": "عنوان التجربة",
      "goal": "الهدف: لماذا نقوم بهذه التجربة؟",
      "materials": ["الأداة 1", "الأداة 2"],
      "stepsWithLogic": [
        {
          "step": "الخطوة",
          "whyWeDoIt": "لماذا نفعل هذه الخطوة؟",
          "teacherSpeech": "كلام المعلمة أثناء تنفيذ الخطوة...",
          "dailyAnalogy": "تشبيه لتقريب الخطوة"
        }
      ],
      "observations": "ماذا نلاحظ بعيوننا أثناء التجربة؟",
      "resultMeaning": "ماذا تعني هذه النتيجة؟",
      "finalConclusion": "الاستنتاج العلمي النهائي",
      "safetyPrecautions": "احتياطات الأمان"
    }
  ],
  "blackboardSummary": {
    "title": "عنوان السبورة",
    "keyVocabulary": ["الكلمة 1: معناها المبسط", "الكلمة 2: معناها المبسط"],
    "definitions": ["التعريف 1 المركز"],
    "comparisons": ["مقارنة سريعة بين كذا وكذا"],
    "conclusions": ["الاستنتاج النهائي المهم"]
  },
  "checkUnderstanding": [
    {
      "questionType": "من الحياة اليومية / علل واستنتج / على التجربة",
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
            temperature: 0.3,
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
