import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    let topic = "";
    let lessonText = "";
    let diagramType = "kidneys";
    let pdfBuffer: Buffer | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      topic = (formData.get("topic") as string) || "";
      lessonText = (formData.get("lessonText") as string) || "";
      diagramType = (formData.get("diagramType") as string) || "kidneys";

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
      }
    } else {
      const body = await req.json();
      topic = body.topic || "";
      lessonText = body.lessonText || "";
      diagramType = body.diagramType || "kidneys";
    }

    const chosenTopic = topic || "رحلة الكليتين وتنقية الدم في جسم الإنسان (منهج الصف السادس)";

    // Default Kidney 8-step Master Story Presentation covering pages 85-86 in Ahmed El-Ghareeb's style
    const defaultKidneyPresentation = {
      id: "pres_" + Date.now(),
      title: "رحلة الكليتين وتنقية الدم في جسم الإنسان (منهج الصف السادس)",
      topic: chosenTopic,
      diagramType: "kidneys",
      steps: [
        {
          stepNumber: 1,
          title: "1. أين تقع الكليتان؟ (موقع الكليتين في جسم الإنسان)",
          category: "جسم الإنسان وموقع العضو",
          flowRoute: "جسم الإنسان ➔ تحديد الكليتين في الناحية الظهرية أسفل القفص الصدري",
          storyStage: "human_body",
          teacherScript: "أهلاً بكم يا أبطالي! قبل ما نعرف الكلية بتشتغل إزاي، لازم نسأل نفسنا: هي الكليتان موجودين فين أصلاً في جسمنا؟ بصوا على جسم الإنسان، الكليتان مش في بطننا من قدام، دول موجودين في الناحية الظهرية ورا، أسفل القفص الصدري على جانبي العمود الفقري!",
          keyPoints: [
            "تقع الكليتان في الناحية الظهرية للتجويف البطني على جانبي العمود الفقري.",
            "تحميهما الأضلاع السفلية للقفص الصدري في منطقة أسفل الظهر.",
            "حجم كل كلية يقارب حجم قبضة اليد وتشبه في شكلها بذرة الفاصولياء."
          ],
          scientificFact: "تحاط كل كلية بوسادة دهنية سميكة وأنسجة قوية لتثبيتها في مكانها وحمايتها من الصدمات أثناء الحركة والجري.",
          visualAction: "ظهور مجسم شفاف أنيق لجسم الإنسان والعمود الفقري مع إضاءة دائرية مستهدفة توضح موقع الكليتين أسفل الظهر.",
          particleType: "generic_flow",
          showFilters: false,
          activeGlow: false,
          labels: [
            { text: "الكلية اليسرى (جهة الظهر)", x: 250, y: 220, color: "#f87171" },
            { text: "الكلية اليمنى (جهة الظهر)", x: 550, y: 220, color: "#f87171" }
          ]
        },
        {
          stepNumber: 2,
          title: "2. من أين يأتي الدم؟ (استقبال الدم غير النقي من الشريان الأورطي)",
          category: "دخول الدم غير النقي (مين رايح لمين)",
          flowRoute: "القلب ➔ الشريان الأورطي ➔ الشريان الكلوي ➔ داخل الكليتين 🩸",
          storyStage: "artery_entry",
          teacherScript: "تعالوا نعمل زوم وندخل جوة الكليتين! الدم غير النقي بيجيلهم منين؟ بيخرج من القلب وينزل في الشريان الأورطي الكبير، ويتفرع منه الشريان الكلوي عشان يضخ ربع دم الجسم كله جوة الكليتين في كل دقيقة!",
          keyPoints: [
            "يتفرع الشريان الكلوي مباشرة من الشريان الأورطي الكبير ليضخ الدم غير المصفى إلى الكليتين.",
            "يصل تدفق الدم إلى الكليتين إلى حوالي ربع (25%) من إجمالي كمية الدم التي يضخها القلب في الدقيقة.",
            "يدخل الشريان الكلوي عبر تجويف داخلي يسمى (سرة الكلية) حاملاً الدم المحمل بالفضلات."
          ],
          scientificFact: "الكليتان تعملان كمحطة ترشيح وتنقية عملاقة تفحص وتغسل دم الإنسان قرابة 300 مرة يومياً!",
          visualAction: "زوم مجهري للجهاز البولي وإضاءة الشريان الأورطي والشريان الكلوي باللون الأحمر مع تدفق خلايا الدم باتجاه الكليتين.",
          particleType: "incoming_blood",
          showFilters: false,
          activeGlow: false,
          labels: [
            { text: "الشريان الكلوي (دم غير نقي قادم من الأورطي)", x: 370, y: 70, color: "#ef4444" },
            { text: "الكلية اليسرى", x: 170, y: 140, color: "#f87171" },
            { text: "الكلية اليمنى", x: 630, y: 140, color: "#f87171" }
          ]
        },
        {
          stepNumber: 3,
          title: "3. ماذا يوجد داخل الدم غير النقي؟ (فحص جزيئات اليوريا والفضلات بوضوح)",
          category: "فحص مكونات الدم (المفيد vs الضار)",
          flowRoute: "تيار الدم: كرات دم حمراء وخلايا نافعة 🔴 vs بلورات يوريا وأملاح سامة 🟡",
          storyStage: "blood_microscope",
          teacherScript: "تعالوا نفتح مجهر مكبر جوة الشريان ونشوف الدم ده جواه إيه! جواه كرات دم حمراء مفيدة وخلايا حيوية، لكن ماشي معاها جزيئات صفراء خطيرة جداً.. دي اليوريا والفضلات النيتروجينية والأملاح الزائدة الناتجة عن هدم البروتينات واللي لازم ننظفها فوراً!",
          keyPoints: [
            "الدم القادم يحمل خلايا نافعة (كرات الدم الحمراء والبيضاء) وبروتينات البلازما الحيوية.",
            "الفضلات النيتروجينية (اليوريا): سموم ذائبة ناتجة عن هدم وتكسير البروتينات داخل خلايا الجسم.",
            "تظهر بلورات الفضلات الصفراء بوضوح تام داخل تيار الدم لتتبع مسار عزلها وتنظيفها."
          ],
          scientificFact: "تراكم اليوريا والفضلات النيتروجينية في الدم يؤدي إلى التسمم البولي الخطير إن لم تتخلص منها الكلى فوراً.",
          visualAction: "نافذة فحص مجهرية مكبرة توضح الفارق الحاسم بين كرات الدم الحمراء النافعة وبلورات اليوريا الصفراء السامة.",
          particleType: "waste_particles",
          showFilters: false,
          activeGlow: false,
          wasteDetails: "بلورات وحبيبات صفراء مميزة لليوريا والأملاح الزائدة محاطة بكرات الدم الحمراء.",
          labels: [
            { text: "🔴 كرات دم حمراء وخلايا حيوية (تبقى في الدم)", x: 260, y: 180, color: "#ef4444" },
            { text: "⚠️ فضلات ضارة (يوريا وأملاح سامة تُعزل)", x: 480, y: 180, color: "#facc15" }
          ]
        },
        {
          stepNumber: 4,
          title: "4. أين تتم التصفية؟ (القطاع التشريحي الداخلي وفلاتر النيفرون)",
          category: "محطة الترشيح الداخلية",
          flowRoute: "الشريان الكلوي ➔ القشرة والنخاع ➔ مليون وحدة نيفرون مجهرية 🔬",
          storyStage: "kidney_anatomy",
          teacherScript: "شايفين الكلية من جوة عاملة إزاي؟ الكلية بتتكون من قشرة خارجية، ونخاع به أهرامات كلوية، وحوض الكلية. وجوة كل كلية فيه معجزة: حوالي مليون وحدة ترشيح مجهرية تسمى النيفرون بتشتغل كأدق فلاتر في الكون!",
          keyPoints: [
            "تتركب الكلية تشريحياً من ثلاث مناطق: القشرة الخارجية، النخاع الداخلي، وحوض الكلية.",
            "تحتوي كل كلية على حوالي مليون وحدة ترشيح مجهرية متناهية الصغر تسمى (النيفرون - Nephron).",
            "تتوزع النيفرونات بين القشرة والنخاع لتصفية كل قطرة دم تمر داخل أنسجة الكلية."
          ],
          scientificFact: "المليون نيفرون في كل كلية لو فُردت أنابيبها المتناهية الصغر لبلغ طولها عدة كيلومترات!",
          visualAction: "قطاع طولي تشريحي واقعي للكلية يظهر القشرة والنخاع وحوض الكلية وإضاءة فلاتر النيفرون الذهبية.",
          particleType: "filtering_action",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "فلاتر النيفرون المجهرية (مليون وحدة)", x: 210, y: 260, color: "#fbbf24" },
            { text: "محفظة بومان وشبكة الترشيح", x: 580, y: 260, color: "#fbbf24" }
          ]
        },
        {
          stepNumber: 5,
          title: "5. كيف تحدث الغربلة الذكية؟ (آلية الترشيح وحجز كرات الدم)",
          category: "الغربلة الذكية وإعادة الامتصاص",
          flowRoute: "الفلاتر: عبور اليوريا والماء الزائد ⬇️ وحجز كرات الدم والبروتينات بالداخل 🛑",
          storyStage: "nephron_filter",
          teacherScript: "ازاي فلاتر النيفرون بتفرز؟ النيفرون ذكي جداً! بيسمح للفضلات الصغيرة واليوريا والمية الزيادة تعدي من فتحات الغربال، لكن بيقفل الباب في وش كرات الدم الحمراء والبروتينات الكبيرة عشان تفضل جوة الدم وماتضيعش أبداً!",
          keyPoints: [
            "تسمح فلاتر النيفرون بمرور الجزيئات الصغيرة الذائبة مثل اليوريا والماء الزائد والأملاح الضارة.",
            "لا تسمح بمرور خلايا الدم الحمراء أو البروتينات لكبر حجمها، فتبقى محفوظة داخل مجرى الدم.",
            "تقوم الأنابيب الكلوية بإعادة امتصاص الجلوكوز ومعظم الماء والأملاح المفيدة إلى الدم."
          ],
          scientificFact: "وجود خلايا الدم أو البروتين في البول يشير إلى خلل في فلاتر النيفرون لأنها في الوضع الطبيعي لا تسمح بنفاذها.",
          visualAction: "غربلة دقيقة: اهتزاز الفلاتر وعزل جزيئات الفضلات الصفراء بينما تبقى كرات الدم الحمراء محفوظة داخل الأوعية.",
          particleType: "filtering_action",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "ترشيح الفضلات واليوريا والماء", x: 210, y: 270, color: "#facc15" },
            { text: "حجز كرات الدم والبروتين بالدم", x: 580, y: 270, color: "#ef4444" }
          ]
        },
        {
          stepNumber: 6,
          title: "6. إلى أين تذهب الفضلات؟ (مسار الحالبين والمثانة وتكوين البول)",
          category: "مسار الفضلات والإخراج (مين رايح لمين)",
          flowRoute: "حوض الكلية ➔ الحالبان ➔ المثانة البولية ➔ الإخراج خارج الجسم 🚽",
          storyStage: "ureter_bladder",
          teacherScript: "الفضلات المعزولة اتجمعت في حوض الكلية وكونت سائل البول.. رايح فين البول ده؟ بينزل نقطة بنقطة في أنبوبين رفيعين اسمهم الحالبين، لحد ما يوصل للمثانة البولية اللي بتخزنه بأمان لحد ما يتطرد برة الجسم خالص!",
          keyPoints: [
            "تتجمع الفضلات المعزولة (اليوريا + الأملاح الزائدة + الماء) لتكوين سائل (البول).",
            "ينتقل البول من حوض الكلية عبر أنبوبين عضليين رفيعين هما (الحالبان) باتجاه المثانة.",
            "المثانة كيس عضلي مرن يخزن البول مؤقتاً حتى يتم تفريغه خارج الجسم عبر مجرى البول (الإحليل)."
          ],
          scientificFact: "الحالب ينقل البول بقطرات منتظمة بفضل انقباضات عضلية دودية لا إرادية تدفعه دوماً باتجاه المثانة حتى لو كان الإنسان مستلقياً.",
          visualAction: "إضاءة الحالبين والمثانة باللون الأصفر وتدفق قطرات بول صفراء متتابعة نحو كيس المثانة البولية.",
          particleType: "urine_flow",
          showFilters: true,
          activeGlow: false,
          labels: [
            { text: "الحالب (أنبوب نقل قطرات البول)", x: 300, y: 380, color: "#eab308" },
            { text: "المثانة البولية (تخزين مؤقت للبول)", x: 400, y: 490, color: "#facc15" }
          ]
        },
        {
          stepNumber: 7,
          title: "7. إلى أين يذهب الدم النظيف؟ (مسار الوريد الكلوي وعودة الدم للقلب)",
          category: "مسار الدم النقي وصحة الجسم (مين رايح لمين)",
          flowRoute: "الكلية ➔ الوريد الكلوي ➔ الوريد الأجوف السفلي ➔ القلب والجسم 💖",
          storyStage: "clean_vein",
          teacherScript: "طب والدم اللي اتنقى خلاص؟ بصوا على الوريد الأزرق الجميل ده! الدم النقي 100%، الخالي تماماً من اليوريا والسموم، بيخرج عبر الوريد الكلوي ويصب في الوريد الأجوف عشان يرجع للقلب منتعش ويوزعه على كل أجهزة جسمنا!",
          keyPoints: [
            "يخرج الدم النقي تماماً والخالي من الفضلات عبر الوريدين الكلويين إلى الوريد الأجوف السفلي.",
            "يعود الدم النظيف إلى القلب ليتم ضخه من جديد إلى الدماغ وجميع خلايا وأعضاء الجسم.",
            "يحافظ الجسم بذلك على توازنه المائي وتوازن الأملاح ودرجة حموضة الدم (pH)."
          ],
          scientificFact: "الدورة الدموية الكلوية تضمن أن دم الإنسان بالكامل يمر على الكليتين لتنقيته وتصفيته باستمرار طوال الـ 24 ساعة.",
          visualAction: "توهج الوريد الكلوي باللون السماوي وخروج جزيئات دم نقية زرقاء صافية صاعدة إلى أعلى الجسم نحو القلب.",
          particleType: "clean_blood_return",
          showFilters: false,
          activeGlow: true,
          labels: [
            { text: "الوريد الكلوي (دم نقي 100% عائد للقلب)", x: 430, y: 70, color: "#38bdf8" },
            { text: "دم نقي معافى جاهز للجسم ✨", x: 400, y: 240, color: "#34d399" }
          ]
        },
        {
          stepNumber: 8,
          title: "8. خاتمة الرحلة (اللوحة الشاملة ومخرجات الكلية المعجزة)",
          category: "اللوحة الشاملة وخاتمة القصة",
          flowRoute: "المسار الأزرق: دم نقي للقلب ⬆️ | المسار الأصفر: بول محمل بالفضلات للخارج ⬇️",
          storyStage: "master_summary",
          teacherScript: "وبكدا يا أبطالي نكون حكينا قصة الكلية كاملة! مصنع النظافة اللي بيفصل بين طريقين: طريق الدم النقي المعافى اللي بيرجع للقلب والجسم، وطريق البول المحمل بالفضلات اللي بنطرده برة خالص! فسبحان الله العظيم على هذه الهندسة المعجزة في أجسادنا!",
          keyPoints: [
            "مخرجات الكلية تنقسم بدقة إلى مسارين رئيسيين متوازيين: دم نقي يعاد للجسم، وبول يُطرد للخارج.",
            "الدم النقي: يحتوي على خلايا الدم والبروتينات ونسبة متوازنة من الماء والأملاح والجلوكوز.",
            "البول: يحتوي على اليوريا النيتروجينية، حمض البوليك، الأملاح الزائدة، والماء الفائض."
          ],
          scientificFact: "الحفاظ على شرب 2-3 لتر من الماء النقي يومياً هو أفضل وسيلة لحماية فلاتر الكلى وضمان استمرار هذه المعجزة بكفاءة.",
          visualAction: "إضاءة كامل أجزاء الرسمة بالأسهم والعناصر المتكاملة لتظهر الدورة الإخراجية كاملة بمساريها الأزرق والأصفر.",
          particleType: "generic_flow",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "المخرج 1: دم نقي 100% يعود للجسم ✨", x: 430, y: 65, color: "#38bdf8" },
            { text: "المخرج 2: بول محمل بالفضلات يُطرد للخارج 🚽", x: 400, y: 490, color: "#facc15" }
          ]
        }
      ]
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ presentation: defaultKidneyPresentation });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = `أنت خبير تربوي متقدم ومصمم عروض تقديمية تفاعلية (PowerPoint Click-by-Click) لشرح العلوم والأحياء للأطفال والمناهج الدراسية، على طريقة أستاذ الأحياء الشهير د. أحمد الغريب.
المعلمة رحاب (Teacher Rehab) تريد عرضاً تقديمياً تفاعلياً تشرحه بنفسها كـ "قصة تعليمية متسلسلة ذات نظام واضح (مين رايح لمين)" للطلاب:
1. **نظام القصة والمسار (مين رايح لمين):**
   - تبدأ القصة دائماً بجسم الإنسان وتحديد موقع العضو في الجسم أولاً.
   - ثم زوم انسيابي على العضو ومسار دخول المواد (من أين أتت وإلى أين تذهب).
   - فحص مجهري للمكونات (المفيد vs الضار).
   - القطاع التشريحي الداخلي ووحدات العمل (كفلاتر النيفرون).
   - آلية العمل والغربلة الدقيقة.
   - مسار الفضلات والإخراج (من أين تبدأ وأين تخرج).
   - مسار المواد المنقاة وعودتها للجسم.
   - الخاتمة واللوحة الشاملة التي تجمع المسارين معاً.
2. **شريط مسار الحركة (flowRoute):**
   - في كل خطوة يجب تحديد مسار الحركة بوضوح مثل: "القلب ➔ الشريان الأورطي ➔ الشريان الكلوي ➔ داخل الكلية".
3. **وضوح الفضلات في الدم:**
   - تمييز جزيئات الفضلات (اليوريا والسموم الصفراء) داخل الدم الأحمر وفصلها في الفلاتر دون أي غموض.
4. **ملاحظات المعلمة الخفية (teacherScript):**
   - كلام دافئ، سلس، ومبسط بالعامية المصرية الراقية تشرح به المعلمة للطلاب بصوتها (يظهر للمعلمة في نافذة المحاضر).

المخرجات يجب أن تكون بصيغة JSON صالح فقط لكائن presentation:
{
  "id": "pres_${Date.now()}",
  "title": "عنوان العرض",
  "topic": "موضوع الدرس",
  "diagramType": "${diagramType}",
  "steps": [
    {
      "stepNumber": 1,
      "title": "عنوان الخطوة",
      "category": "اسم المرحلة",
      "flowRoute": "المسار الاتجاهي: مين رايح لمين...",
      "storyStage": "human_body" | "artery_entry" | "blood_microscope" | "kidney_anatomy" | "nephron_filter" | "ureter_bladder" | "clean_vein" | "master_summary",
      "teacherScript": "ما تقوله المعلمة بصوتها...",
      "keyPoints": [
        "نقطة تعليمية أولى مكتوبة...",
        "نقطة ثانية..."
      ],
      "scientificFact": "معلومة ذهبية مكتوبة...",
      "visualAction": "وصف الحركة البصرية...",
      "particleType": "incoming_blood" | "waste_particles" | "filtering_action" | "urine_flow" | "clean_blood_return" | "generic_flow",
      "showFilters": true | false,
      "activeGlow": true | false,
      "labels": [
        { "text": "اسم الجزء", "x": 370, "y": 70, "color": "#ef4444" }
      ]
    }
  ]
}`;

    const fallbackModels = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-3.8-flash"
    ];

    let retries = 5;
    let presentationData = null;

    while (retries > 0) {
      try {
        const modelName = fallbackModels[5 - retries] || fallbackModels[0];
        const model = genAI.getGenerativeModel({ model: modelName });

        const parts: any[] = [{ text: systemPrompt }];

        if (pdfBuffer) {
          parts.push({
            inlineData: {
              data: pdfBuffer.toString("base64"),
              mimeType: "application/pdf"
            }
          });
          parts.push({
            text: `يرجى قراءة هذه الصفحات المرفقة من كتاب العلوم وتحويلها إلى عرض باوربوينت تفاعلي بأسلوب د. أحمد الغريب (الرسمة موجودة في البداية، وكل كليك يكشف تفصيلاً جديداً بالأسهم والنقاط المكتوبة بالتفصيل الدقيق).`
          });
        } else {
          parts.push({
            text: `موضوع الدرس المطلوب تحويله لباوربوينت تفاعلي بأسلوب د. أحمد الغريب:
العنوان: ${chosenTopic}
المحتوى: ${lessonText || chosenTopic}`
          });
        }

        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        });

        const text = result.response.text();
        const rawJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        presentationData = JSON.parse(rawJson);
        if (presentationData && presentationData.steps && presentationData.steps.length > 0) {
          break;
        }
      } catch (err: any) {
        console.warn(`Retry ${6 - retries} failed:`, err.message);
        retries--;
      }
    }

    if (!presentationData || !presentationData.steps) {
      presentationData = defaultKidneyPresentation;
    }

    return NextResponse.json({ presentation: presentationData });
  } catch (error: any) {
    console.error("Presentation API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate presentation" }, { status: 500 });
  }
}
