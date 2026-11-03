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

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل مهما كان الموضوع دون أي افتراضات مسبقة"}.

### القواعد الصارمة والجوهرية لأسلوب الشرح والفيديوهات (بناءً على طلب المعلمة الحرفي):
1. **الشرح بالراحة بهدوء ومن الصفر (بالراحة بالراحة):**
   - المعلمة تسجل صوتها في المونتاج لتشرح لطلاب أول مرة في حياتهم يدرسون مادة العلوم.
   - الشرح بالعامية المصرية الدافئة والمشجعة، بدون سرعة أو قفزات أو تعقيدات.

2. **التشبيه فقط في الدخلة والتمهيد (Introductory Hook Only):**
   - المعلمة طلبت بوضوح: "مش عايزة يبقى كل الشرح تشبيهات ملهاش معنى، عايزة بس إني أوصل البداية بتشبيه وبعدين أشرح عادي، يعني عايزة الدخلة تبقى تشبيه بس".
   - ابتكر تشبيهاً واحداً واقعياً جذاباً من حياة الأطفال (الأكل، الشرب، البيت، الألعاب، المطبخ) ليكون مدخلاً لفتح شهية الطالب وفهم فكرة الدرس الأساسية.
   - ولد برومبت فيديو Flow لهذا التشبيه فقط (3D Pixar animation، بدون معلمة نهائياً).

3. **بقية الشرح: فيديوهات علمية سينمائية للموضوع نفسه (Scientific 3D Visualization):**
   - المعلمة طلبت: "وبقية الشرح يبقى فيديوهات علمية للموضوع نفسه، وكل جزئية بيشرحها بالراحة واحدة واحدة للناس أول مرة تاخد علوم".
   - قسّم الدرس إلى جزئيات علمية متتابعة (من 5 إلى 9 جزئيات علمية).
   - لكل جزئية: كلام المعلمة بالراحة + الشرح العلمي المبسط + برومبت فيديو Flow يصور **الظاهرة العلمية الحقيقية نفسها** (مثلاً: زووم ثلاثي الأبعاد على الأوعية الناقلة، البلاستيدات، التفاعلات، الخلايا، حركة الذرات أو الشحنات أو الأجهزة الحيوية) بأسلوب 3D Pixar علمي مبهر وممتع للأطفال، وبدون معلمات نهائياً (ABSOLUTELY NO teachers, NO school).

4. **المصطلح والتعريف كما هو في كتاب المدرسة نصاً:**
   - المعلمة طلبت: "وعايزة في الآخر المصطلح اللي موجود في الكتاب أو التعريف المكتوب في الكتاب إحنا نقوله. وفي الآخر تقولي المصطلح، كل مصطلح موجود في الكتاب".
   - في نهاية كل جزئية علمية، اذكر تحديداً:
     * **textbookTerm**: المصطلح العلمي كما هو وارد في منهج وكتاب العلوم (مثال: البناء الضوئي، الثغور، أوعية الخشب، الشريان الأورطي، القوة المغناطيسية...).
     * **textbookDefinition**: التعريف الواضح المكتوب في الكتاب والمطلوب من الطالب حفظه وفهمه.

5. **التجارب العلمية مقسمة لخطوات احترافية (1، 2، 3) مع برومبت فيديو Flow لكل خطوة:**
   - المعلمة طلبت: "ولو فيه تجربة، التجربة دي تتعمل وتتقسم، كل تجربة يعني مثلاً تتعمل في الفيديو، اللي هو برومبت الفيديو، تتعمل التجربة، تتقسم مثلاً 1 2 3 وكده، عايزة حاجة احترافية".
   - إذا تضمن الدرس تجربة علمية (أو نشاط استكشافي):
     * قسّم التجربة إلى خطوات مرقمة واضحة ومحددة.
     * لكل خطوة: ما نفعله ولماذا + كلام المعلمة أثناء الخطوة + **برومبت فيديو Flow يصور تنفيذ هذه الخطوة معملياً بدقة (أدوات المعمل، حركة الأيدي، التفاعل)** بجودة 3D Pixar سينمائية وبدون معلمات.
     * الملاحظة بالعين المجردة مع برومبت فيديو Flow يوضح ظهور النتيجة وتغيرها.
     * الاستنتاج النهائي واحتياطات الأمان.

6. **السبورة وأسئلة الفهم:**
   - السبورة تحتوي فقط على ما يكتبه المعلم (العنوان، المصطلحات، التعريفات، المقارنات، الاستنتاج).
   - أسئلة شفوية متدرجة للتأكد من فهم الأطفال مع الإجابات النموذجية.

المطلوب: توليد كائن JSON دقيق جداً وفق الهيكل التالي بالضبط:
{
  "lessonTitle": "عنوان الدرس الدقيق",
  "detectedTopic": "المجال والموضوع العلمي المستخرج أوتوماتيكياً",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية بالتشبيه الحياتي",
    "teacherScript": "كلام المعلمة بالراحة بالعامية المصرية لافتتاح الدرس والتمهيد بالتشبيه...",
    "analogyStory": "شرح التشبيه الواقعي من حياة الطفل (الأكل/الشرب/المطبخ/البيت)...",
    "flowVideoPrompt": "Detailed English 3D Pixar animation prompt for Flow strictly showing this real-life analogy hook scene. Dynamic cinematic motion, warm joyful lighting. ABSOLUTELY NO teachers, NO school classroom."
  },
  "scientificBeats": [
    {
      "beatNumber": 1,
      "conceptTitle": "عنوان الجزئية العلمية الأولى",
      "teacherScript": "كلام المعلمة بالراحة واحدة واحدة للأطفال من الصفر بالعامية المصرية...",
      "simpleExplanation": "الشرح العلمي المبسط خطوة بخطوة للظاهرة وكيف تحدث...",
      "textbookTerm": "المصطلح العلمي كما ورد في كتاب المدرسة",
      "textbookDefinition": "التعريف المكتوب في كتاب المدرسة المطلوب من الطالب",
      "flowVideoPrompt": "Detailed English 3D Pixar scientific macro visualization prompt for Flow strictly illustrating the actual scientific mechanism (cells, molecules, internal organs, forces). Dynamic camera, educational, vivid colors. ABSOLUTELY NO teachers, NO classrooms."
    }
  ],
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
          "teacherSpeech": "كلام المعلمة أثناء تنفيذ الخطوة...",
          "flowVideoPrompt": "Detailed English 3D laboratory animation prompt for Flow strictly showing this specific lab step action with glass beakers, tools, and materials on a clean lab bench. Macro cinematic lighting. ABSOLUTELY NO teachers."
        }
      ],
      "observations": "ماذا نلاحظ بعيوننا أثناء التجربة؟",
      "observationVideoPrompt": "Detailed English 3D macro animation prompt for Flow showing the visible scientific result and color/state change in the test. ABSOLUTELY NO teachers.",
      "finalConclusion": "الاستنتاج العلمي النهائي",
      "safetyPrecautions": "احتياطات الأمان في المعمل"
    }
  ],
  "blackboardSummary": {
    "title": "عنوان السبورة",
    "keyVocabulary": ["المصطلح 1: معناه", "المصطلح 2: معناه"],
    "definitions": ["التعريف 1 كما ورد في الكتاب", "التعريف 2 كما ورد في الكتاب"],
    "comparisons": ["مقارنة سريعة بين كذا وكذا"],
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
