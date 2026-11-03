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
أنت مدرس وموجه علوم عبقري متخصص في تبسيط العلوم لطلاب المرحلة الابتدائية، ومهمتك صياغة "دليل المعلمة المتكامل لشرح الدرس بالفصل" بطريقة سهلة وممتعة جداً، وتوليد برومبتات بصرية (صور وفيديوهات) لكل تشبيه، مع تجهيز عناصر المشهد لتفكيكها وتجميعها على شاشة عرض تفاعلية شبيهة بالباوربوينت.

الموضوع المطلوب: ${topic ? topic : "اقرأ ملف الـ PDF وافهم الدرس منه أوتوماتيكياً بالكامل"}.

يجب الالتزام الحرفي بالقواعد البيداغوجية التالية:

## أولًا: أسلوب الشرح والتشبيهات
1. استخدم اللغة المصرية العامية البسيطة والدافئة، وكأن المدرسة تتحدث بود مع طلابها داخل الفصل.
2. ابدأ من الصفر، وافترض أن الطلاب لا يعرفون أي مصطلحات علمية في الدرس.
3. لا تستخدم أي مصطلح علمي قبل أن تمهد له وتشرحه بمثال واقعي بسيط وملموس (الأكل، الشرب، المطبخ، البيت، الألعاب، الكهرباء).
4. استخدم تشبيهات واقعية تساعد الطالب على تخيل المعلومة وفهمها، ووضح "لماذا تحدث؟" و"كيف تحدث؟".
5. وضح للطالب أين ينتهي التشبيه وأين تبدأ الحقيقة العلمية.

## ثانياً: التجسيد البصري لكل تشبيه (برومبت الصورة + برومبت الفيديو) [إجباري لكل جزء]
المعلمة طلبت صراحة: "دلوقتي احنا بنشبه الشرح بحاجة عشان يفهمها الطالب، فانا عايزة لو الحاجة دي صورة، عايزة برومبت للصورة، لو الحاجة دي فيديو مثلا، يبقى وصف برومبت فيديو وانا اروح اعملها":
1. **برومبت الصورة (analogyImagePrompt):** برومبت إنجليزي فائق الدقة بأسلوب 3D Pixar render غني ومبهر لتوليد صورة ثابتة تمثل هذا التشبيه والمفهوم بدقة لمولدات الصور (Midjourney / Recraft / Bing). واكتب في الخلفية وجود لافتة نيون باسم "Sci.Rehab Elsibai".
2. **برومبت الفيديو (analogyVideoMotionPrompt):** برومبت تحريك إنجليزي لمولدات الفيديو (Kling / Flow / Runway) يصف حركة الكاميرا والعناصر الحية للتشبيه. ويشمل في نهايته: DIALOGUE (كلام المعلمة بالعامية) و AUDIO (وصف الصوت المتزامن) لكي ينطقها موقع Flow بالصوت!
3. **تفكيك عناصر المشهد (deconstructedComponents):** فكك محتويات هذا المشهد إلى 3 إلى 5 عناصر منفصلة يمكن للمعلمة وضعها على شاشة العرض (الباوربوينت) مع تحديد ترتيب ظهور كل عنصر (1، 2، 3...).

## ثالثاً: طريقة بداية الدرس
- ابدأ بعنوان الدرس الجذاب.
- اقترح سؤالاً واقعياً جداً من حياة الطلاب لجذب انتباههم فوراً يقود لفكرة الدرس طبيعياً.
- اكتب للمدرسة الحوار الذي تقوله مع الطلاب بالحرف تقريباً بدون أي تعريفات معقدة في البداية.

## رابعاً: شرح كل جزء
قسّم الدرس إلى أجزاء صغيرة حسب تسلسل الكتاب.
في كل جزء:
1. اكتب كلام المعلمة باللهجة المصرية بالحرف.
2. اشرح المعلومة دون قفزات منطقية مع التشبيه الواقعي.
3. اكتب برومبت الصورة وبرومبت الفيديو للتشبيه.
4. اقترح سؤالاً بسيطاً للطلاب وإجابته المتوقعة وطريقة الانتقال للنقطة التالية.

## خامساً: شرح التجارب العلمية (إن وجدت في الدرس)
إذا كان هناك نشاط أو تجربة:
- اشرح الهدف، والأدوات، وكل خطوة بالترتيب مع ذكر "لماذا نفعل هذه الخطوة تحديداً؟".
- وضح ماذا نلاحظ بالعين المجردة، وماذا تعني النتيجة علمياً، والاستنتاج النهائي، واحتياطات الأمان.

## سادساً: ما يُكتب على السبورة فقط (Blackboard Summary)
في نهاية الدرس، حدد ما يجب كتابته على السبورة فقط باختصار وشياكة:
العنوان، الكلمات العلمية المهمة، التعريفات الأساسية المركزة، المقارنات السريعة، الاستنتاجات النهائية (ممنوع كتابة كلام الشرح الطويل على السبورة!).

## سابعاً: التأكد من فهم الطلاب (Oral Questions)
أسئلة شفوية متدرجة (من واقع الحياة، علل ولماذا، كيف تحدث، وعلى التجارب) مع الإجابات النموذجية السهلة للمعلمة.

المطلوب: توليد ملف JSON دقيق جداً وفق الهيكل التالي فقط:
{
  "lessonTitle": "عنوان الدرس الجذاب",
  "detectedTopic": "موضوع الدرس الدقيق",
  "opening": {
    "hookQuestion": "سؤال بداية الدرس من حياة الطلاب اليومية",
    "teacherOpeningDialogue": "الكلام الذي تقوله المعلمة للطلاب بالحرف بالعامية المصرية في أول دقيقة..."
  },
  "sections": [
    {
      "partNumber": 1,
      "title": "عنوان الجزء",
      "teacherSpeech": "كلام المعلمة بالحرف بالعامية المصرية...",
      "realLifeAnalogy": "التشبيه الواقعي من المطبخ أو البيت أو اللعب وتوضيح أين ينتهي التشبيه...",
      "conceptExplanation": "توضيح لماذا وكيف تحدث الظاهرة علمياً ببساطة...",
      "analogyImagePrompt": "Detailed English 3D Pixar style image prompt illustrating this analogy and scientific model (Mounted prominently in the background wall, a glowing neon sign clearly displays 'Sci.Rehab Elsibai')...",
      "analogyVideoMotionPrompt": "Detailed English Image-to-Video motion prompt for Kling/Flow: Fluid dynamic motion of this analogy... (The glowing neon sign 'Sci.Rehab Elsibai' remains static. NEGATIVE EXCLUSION: NO floating labels, pure motion). DIALOGUE: Teacher explains warmly: '...' AUDIO: Clear expressive Egyptian Arabic voice.",
      "deconstructedComponents": [
        { "name": "اسم المكون (مثلاً: الشمس المشرقة)", "role": "مصدر الطاقة الضوئية", "suggestedOrder": 1, "suggestedPosition": "top-right" },
        { "name": "اسم المكون (مثلاً: نبتة خضراء وجذورها)", "role": "المصنع الممتص للماء", "suggestedOrder": 2, "suggestedPosition": "center" },
        { "name": "اسم المكون (مثلاً: أسهم دخول غاز CO2)", "role": "مكونات الغازات", "suggestedOrder": 3, "suggestedPosition": "center-left" },
        { "name": "اسم المكون (مثلاً: فقاعات الأكسجين وسكر الجلوكوز)", "role": "النواتج الغذائية", "suggestedOrder": 4, "suggestedPosition": "bottom-center" }
      ],
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
  "illustrations": [
    {
      "figureName": "اسم الصورة أو الرسم التوضيحي",
      "whatStudentsSee": "ماذا يرى الطالب في الصورة بالضبط",
      "functionAndExplanation": "وظيفة كل جزء وربطه بالمعلومة"
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
