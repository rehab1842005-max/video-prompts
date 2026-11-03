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

### ⚠️ القاعدة الذهبية الأهم (ممنوع الاختصار بتاتاً - الشرح بالتفصيل الممل والممتع):
المستخدمة أكدت بحزم: "حاسه في اختصار للشرح، أنا عايزه الشرح بالتفصيل!".
- **ممنوع الاكتفاء بجملتين أو سرد مختصر!** المعلمة تسجل صوتها في فيديو كامل، وتريد كلاماً غنياً مفصلاً يشرح الفكرة من جذورها بتأنٍ شديد (بالراحة واحدة واحدة) كأن الطلاب أول مرة في حياتهم يسمعون كلمة علوم.
- **في كل جزئية:**
  1. تحدثي للأطفال بود ومحبة وأسأليهم أسئلة تفكير لطيفة.
  2. وضحي كيف ولماذا تحدث كل خطوة بالتفصيل الدقيق (السبب، الآلية، المسار، أين تذهب النواتج، وماذا يحدث لو غابت).
  3. فككي أي مصطلح واشرحيه بهدوء قبل نطقه.
  4. في نهاية الجزئية: قولي المصطلح الموجود في كتاب المدرسة وتعريفه الرسمي المطلوب حفظه.

### الهيكل التعليمي المطلوب:
1. **التشبيه فقط في الدخلة والتمهيد (Introductory Hook):**
   - تشبيه واحد فقط جذاب وملموس من حياة الأطفال (الأكل، الشرب، البيت، الألعاب، المطبخ) ليكون مدخلاً لفتح شهية الطالب وفهم فكرة الدرس الأساسية.
   - كلام المعلمة في الدخلة مفصل وممهد وممتع.
   - برومبت فيديو Flow لهذا التشبيه (3D Pixar animation، بدون معلمة نهائياً).

2. **الشرح العلمي المفصل والموسع (Scientific Beats):**
   - قسّم الدرس إلى جزئيات تفصيلية كافية (من 7 إلى 12 جزئية تفصيلية)، بحيث لا يمر سطر أو مفهوم من الدرس دون تفكيكه وشرحه المستفيض.
   - **teacherScript:** فقرة كلامية كاملة مستفيضة للمعلمة (من 4 إلى 8 أسطر على الأقل لكل جزئية) بالعامية المصرية الصبورة الهادئة.
   - **simpleExplanation:** شرح علمي وافٍ يوضح الظاهرة وأسبابها وأهميتها البيولوجية أو الفيزيائية.
   - **textbookTerm:** المصطلح العلمي كما ورد في كتاب الوزارة/المدرسة نصاً.
   - **textbookDefinition:** التعريف المكتوب في الكتاب نصاً المطلوب من الطالب حفظه وفهمه.
   - **flowVideoPrompt:** برومبت فيديو سينمائي مجسم 3D Pixar علمي يصور الظاهرة الحقيقية نفسها (تكبير مجهري، حركة الجزيئات، الأجهزة الداخلية، تدفق السوائل) بدون معلمة نهائياً (ABSOLUTELY NO teachers, NO school).

3. **التجارب العلمية (إن وجدت في الدرس) مفصلة خطوة بخطوة (1، 2، 3) مع فيديو لكل خطوة:**
   - قسّم التجربة إلى خطوات مفصلة واضحة (الخطوة 1، الخطوة 2، الخطوة 3...).
   - لكل خطوة:
     * **stepTitle:** عنوان الخطوة.
     * **actionDetails:** ماذا نفعل بالتفصيل المعملي ولماذا نفعل ذلك.
     * **teacherSpeech:** كلام المعلمة المستفيض أثناء تنفيذ هذه الخطوة وتوجيه الطلاب للملاحظة.
     * **flowVideoPrompt:** برومبت فيديو Flow مخصص لتصوير تنفيذ هذه الخطوة معملياً بدقة (الأدوات، حركة اليد، الأنابيب، التفاعل) بجودة 3D بدون معلمات.
   - **observations:** ماذا نلاحظ بعيوننا بالتفصيل مع برومبت فيديو للملاحظة وتغير النتيجة.
   - **finalConclusion:** الاستنتاج العلمي النهائي مع احتياطات الأمان.

4. **السبورة الذكية وأسئلة الفهم الشفوية:**
   - ملخص منظم لما يُكتب على السبورة (العنوان، المصطلحات، التعريفات، المقارنات، الاستنتاج).
   - أسئلة شفوية متدرجة للتأكد من فهم الأطفال مع الإجابات النموذجية.

المطلوب: توليد كائن JSON دقيق ومفصل جداً وفق الهيكل التالي:
{
  "lessonTitle": "عنوان الدرس الدقيق",
  "detectedTopic": "المجال والموضوع العلمي المستخرج أوتوماتيكياً",
  "introHook": {
    "hookTitle": "عنوان الدخلة التمهيدية بالتشبيه الحياتي",
    "teacherScript": "كلام المعلمة المفصل والمشوق بالعامية المصرية لافتتاح الدرس والتمهيد بالتشبيه...",
    "analogyStory": "شرح التشبيه الواقعي من حياة الطفل بالتفصيل...",
    "flowVideoPrompt": "Detailed English 3D Pixar animation prompt for Flow strictly showing this real-life analogy hook scene. Dynamic cinematic motion, warm joyful lighting. ABSOLUTELY NO teachers, NO school classroom."
  },
  "scientificBeats": [
    {
      "beatNumber": 1,
      "conceptTitle": "عنوان الجزئية العلمية بالتفصيل",
      "teacherScript": "كلام المعلمة المستفيض والمفصل (4-8 أسطر كاملة) بالراحة واحدة واحدة للأطفال من الصفر بالعامية المصرية...",
      "simpleExplanation": "الشرح العلمي الموسع والمفصل للظاهرة وكيف ولماذا تحدث بالتحديد...",
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
