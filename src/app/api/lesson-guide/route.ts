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
أنت كبير موجهي العلوم ومؤلف السيناريوهات التعليمية للأطفال وخبير لقطات الـ B-Roll السينمائية.
مهمتك الأساسية: فهم الدرس المرفق أوتوماتيكياً بدقة 100% مهما كان موضوعه، وتقسيم الشرح أوتوماتيكياً إلى جزئيات صغيرة متتالية (Micro-Beats)، وابتكار تشبيه واقعي وملموس من حياة الأطفال لكل جزئية، وتوليد برومبت فيديو سينمائي 3D Pixar لموقع Flow لكل تشبيه (بدون معلمة) لتضعه المعلمة في المونتاج وهي تسجل صوتها!

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل دون أي تخمين مسبق"}.

### القواعد الصارمة والتوجيهات الإلزامية:
1. **الفهم الأوتوماتيكي الخالص (Pure Dynamic Topic Comprehension):**
   ممنوع فرض تشبيهات ثابتة أو افتراض موضوع معين! إذا كان الدرس عن القلب، شبه بالمرور والمضخات. إذا كان عن النبات، شبه بالمطبخ والشمس والشوكولاتة. إذا كان عن الفضاء، شبه بالأراجوزات والمدارات. إذا كان عن المادة والذرات، شبه بالمكعبات والليجو. إذا كان عن الكهرباء، شبه بمواسير المياه ومسارات القطار. ابتكر التشبيهات تلقائياً بما يطابق المحتوى الفعلي للملف المرفق.

2. **التقسيم الأوتوماتيكي لكل جزئية (Granular Micro-Beats):**
   المعلمة طلبت صراحة: "أنا عايزة على كل جزئية من الكلام دوت تشبيه، يعني لو كل حتة محتاجة تشبيه فتقسمها أوتوماتيك وتشبهها، وتعمل لكل جزئية تشبيه وكل حاجة بالتفصيل".
   قسّم الدرس كاملاً إلى جزئيات صغيرة متتابعة ومترابطة (من 7 إلى 14 جزئية / مشهد مونتاج)، بحيث لا توجد معلومة واحدة تمر دون تشبيه واقعي يقربها للطفل!

3. **شروط برومبت فيديو Flow لكل جزئية (B-Roll Clips بدون معلمة نهائياً):**
   - **ممنوع ظهور معلمين أو فصول نهائياً (ABSOLUTELY NO teachers, NO classrooms, NO school presentation).**
   - الفيديو يجسد المشهد الواقعي الحياتي للتشبيه فقط (شخص يفتح الثلاجة ويأكل، طفل يشتري من سوبرماركت، شفاطة تسحب سائلاً منعشاً، كيكة ترتفع في الفرن، سيارات تمر في مسار دائري، طفل يبني برج ليجو، مياه تتدفق في مواسير شفافة...).
   - الأسلوب البصري: لقطة سينمائية كرتونية 3D Pixar فائقة الجمال بدقة عالية وحركة كاميرا ديناميكية ممتعة للأطفال.
   - هذا البرومبت تأخذه المعلمة وتضعه في Flow لينزل لها فيديو 5 ثوانٍ، وتضعه في المونتاج (CapCut) فوق صوتها في هذه الجزئية تحديداً!

4. **ما يُكتب على السبورة فقط:**
   العنوان، المصطلحات الأساسية، التعريفات المركزة، المقارنات، الاستنتاجات النهائية (ممنوع حشو كلام الشرح على السبورة).

5. **أسئلة قياس الفهم الشفوية:**
   أسئلة متدرجة من واقع الحياة مع إجاباتها النموذجية للمعلمة.

المطلوب: توليد كائن JSON دقيق جداً وفق الهيكل التالي فقط:
{
  "lessonTitle": "عنوان الدرس الدقيق المستخرج أوتوماتيكياً",
  "detectedTopic": "موضوع ومجال الدرس العلمي المستخرج",
  "beats": [
    {
      "beatNumber": 1,
      "conceptTitle": "الفكرة العلمية الدقيقة لهذه الجزئية",
      "teacherVoiceover": "الجملة الدقيقة التي تقولها المعلمة بصوتها في المونتاج بالعامية المصرية الدافئة...",
      "analogyIdea": "التشبيه الواقعي من حياة الطفل لهذه الجملة بالذات (الأكل، الشرب، المطبخ، الألعاب، الشارع، الكهرباء)...",
      "analogyTitle": "عنوان التشبيه بالعربي (مثلاً: فتح الثلاجة وتناول طعام خفيف)",
      "flowVideoPrompt": "Detailed English 3D Pixar style prompt for Flow strictly illustrating this real-life analogy. Dynamic camera motion, warm vibrant cinematic lighting. ABSOLUTELY NO teachers, NO school, pure lifestyle/scenic B-roll animation."
    }
  ],
  "experiments": [
    {
      "experimentTitle": "عنوان التجربة (إن وجدت بالدرس)",
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
