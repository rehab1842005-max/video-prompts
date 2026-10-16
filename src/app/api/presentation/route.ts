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

    // Default Kidney 7-step Master Presentation covering pages 85-86 in Ahmed El-Ghareeb's style
    const defaultKidneyPresentation = {
      id: "pres_" + Date.now(),
      title: "رحلة الكليتين وتنقية الدم في جسم الإنسان (منهج الصف السادس)",
      topic: chosenTopic,
      diagramType: "kidneys",
      steps: [
        {
          stepNumber: 1,
          title: "1. موضع الكليتين واستقبال الدم من الشريان الأورطي",
          category: "استقبال الدم غير النقي",
          teacherScript: "أهلاً بكم يا أبطالي! تعالوا نبص على الرسمة الجميلة دي.. الكليتان هما العضوان الرئيسيان في الجهاز البولي، بيستقبلوا الدم غير النقي عبر الشريان الكلوي المتفرع من الشريان الأورطي الكبير عشان تبدأ أهم رحلة تنقية!",
          keyPoints: [
            "تقع الكليتان في الناحية الظهرية للتجويف البطني على جانبي العمود الفقري.",
            "يتفرع الشريان الكلوي من الشريان الأورطي الكبير ليضخ الدم غير المصفى إلى داخل الكليتين.",
            "يصل تدفق الدم إلى الكليتين إلى حوالي ربع كمية الدم التي يضخها القلب في كل دقيقة."
          ],
          scientificFact: "الكليتان تعملان كمحطة ترشيح وتنقية عملاقة تفحص وتغسل دم الإنسان قرابة 300 مرة يومياً!",
          visualAction: "إضاءة الشريان الكلوي باللون الأحمر وظهور سهم موجه يشير إلى تدفق الدم غير النقي إلى داخل الكليتين.",
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
          stepNumber: 2,
          title: "2. فحص الدم غير النقي وظهور جزيئات اليوريا والفضلات بوضوح",
          category: "مكونات الدم والمواد الضارة",
          teacherScript: "بصوا معايا بتركيز شديد جوة الشريان! الدم مش ماشي لوحده، فيه كرات دم حمراء وخلايا حيوية نافعة، وفيه جزيئات صفراء واضحة جداً دي الفضلات النيتروجينية واليوريا والأملاح الزائدة الناتجة عن هدم البروتينات واللي لازم نطردها فوراً!",
          keyPoints: [
            "الدم القادم يحمل خلايا نافعة (كرات الدم الحمراء والبيضاء) مختلطة بفضلات سامة ذائبة في البلازما.",
            "الفضلات النيتروجينية (اليوريا): تنتج عن هدم واستهلاك البروتينات داخل خلايا الجسم.",
            "ظهور جزيئات الفضلات الصفراء بوضوح تام داخل تيار الدم لتتبع مسار عزلها وغربلتها."
          ],
          scientificFact: "تراكم اليوريا والفضلات النيتروجينية في الدم يؤدي إلى التسمم البولي الخطير إن لم تتخلص منها الكلى فوراً.",
          visualAction: "تكبير مجهري لمجرى الشريان وظهور بلورات الفضلات الصفراء بوضوح تام ممزوجة بكرات الدم الحمراء.",
          particleType: "waste_particles",
          showFilters: false,
          activeGlow: false,
          wasteDetails: "بلورات وحبيبات صفراء مميزة لليوريا والأملاح الزائدة محاطة بكرات الدم الحمراء.",
          labels: [
            { text: "🔴 كرات دم حمراء وخلايا حيوية", x: 260, y: 180, color: "#ef4444" },
            { text: "⚠️ فضلات ضارة (يوريا وأملاح سامة)", x: 480, y: 180, color: "#facc15" }
          ]
        },
        {
          stepNumber: 3,
          title: "3. قطاع تشريحي داخل الكلية وظهور شبكة النيفرونات",
          category: "وحدات الترشيح المجهرية",
          teacherScript: "شايفين النجوم والمصافي الصفراء الجميلة اللي نورت جوة الكلية؟ دي النيفرونات! كل كلية بتحتوي على حوالي مليون وحدة ترشيح مجهرية بتشتغل كأذكى فلاتر في العالم!",
          keyPoints: [
            "تحتوي كل كلية على حوالي مليون وحدة ترشيح مجهرية متناهية الصغر تسمى (النيفرون).",
            "تتكون كل وحدة ترشيح من محفظة بومان وشبكة دقيقة من الشعيرات الدموية والأنابيب الملتوية.",
            "تتوزع النيفرونات بين القشرة والنخاع لتصفية كل قطرة دم تمر داخل الكلية."
          ],
          scientificFact: "المليون نيفرون في كل كلية لو فُردت أنابيبها المتناهية الصغر لبلغ طولها عدة كيلومترات!",
          visualAction: "كشف قطاع تشريحي داخلي للكلية وإضاءة شبكات النيفرون الصفراء مع أسهم موجهة تشير لمواقع الترشيح.",
          particleType: "filtering_action",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "فلاتر النيفرون المجهرية (مليون وحدة)", x: 210, y: 260, color: "#fbbf24" },
            { text: "محفظة بومان وأنابيب الترشيح", x: 580, y: 260, color: "#fbbf24" }
          ]
        },
        {
          stepNumber: 4,
          title: "4. آلية الترشيح وإعادة الامتصاص الدقيقة",
          category: "فصل السموم وحجز خلايا الدم",
          teacherScript: "شايفين الغربلة الدقيقة دي؟ الفلاتر بتسمح لليوريا والماء الزائد والأملاح بالمرور، لكن بتحجز كرات الدم الحمراء والبروتينات الكبيرة عشان تفضل جوة دمنا وماتضيعش أبداً!",
          keyPoints: [
            "تسمح فلاتر النيفرون بمرور الجزيئات الصغيرة مثل اليوريا والماء الزائد والأملاح الضارة.",
            "لا تسمح بمرور خلايا الدم الحمراء أو البروتينات لكبر حجمها، فتبقى محفوظة داخل الدم.",
            "تقوم الأنابيب الكلوية بإعادة امتصاص الجلوكوز ومعظم الماء والأملاح المفيدة إلى الدم."
          ],
          scientificFact: "وجود خلايا الدم أو البروتين في البول يشير إلى خلل في فلاتر النيفرون لأنها في الوضع الطبيعي لا تسمح بنفاذها.",
          visualAction: "اهتزاز فلاتر النيفرون وعزل جزيئات الفضلات الصفراء بينما تبقى كرات الدم الحمراء داخل الأوعية.",
          particleType: "filtering_action",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "مرور الفضلات واليوريا والماء الزائد", x: 210, y: 270, color: "#facc15" },
            { text: "حجز كرات الدم والبروتينات الكبيرة", x: 580, y: 270, color: "#ef4444" }
          ]
        },
        {
          stepNumber: 5,
          title: "5. انتقال الفضلات عبر الحالبين وتجمع البول في المثانة",
          category: "تكوين البول ومسار الإخراج",
          teacherScript: "الفضلات والمية الزايدة اتجمعت وتحولت لسائل البول، وبدأت تنزل نقطة بنقطة في الأنبوبين الصفر دول (الحالبين) لحد ما توصل للمثانة البولية اللي بتخزنه بأمان لحد ما نطرده برة الجسم خالص!",
          keyPoints: [
            "تتجمع الفضلات المعزولة (اليوريا + الأملاح الزائدة + الماء) لتكوين سائل (البول).",
            "ينتقل البول من حوض الكلية عبر أنبوبين عضليين رفيعين هما (الحالبان) باتجاه المثانة.",
            "المثانة كيس عضلي مرن يخزن البول مؤقتاً حتى يتم تفريغه خارج الجسم عبر مجرى البول (الإحليل)."
          ],
          scientificFact: "الحالب ينقل البول بقطرات منتظمة بفضل انقباضات عضلية دودية لا إرادية تدفعه دوماً باتجاه المثانة.",
          visualAction: "إضاءة الحالبين والمثانة بالأصفر وتدفق قطرات بول صفراء متتابعة نحو كيس المثانة البولية.",
          particleType: "urine_flow",
          showFilters: true,
          activeGlow: false,
          labels: [
            { text: "الحالب (أنبوب نقل قطرات البول)", x: 300, y: 380, color: "#eab308" },
            { text: "المثانة البولية (تخزين مؤقت للبول)", x: 400, y: 490, color: "#facc15" }
          ]
        },
        {
          stepNumber: 6,
          title: "6. خروج الدم النقي 100% عبر الوريد الكلوي إلى القلب",
          category: "اكتمال التنقية وعودة الدم النظيف",
          teacherScript: "ودلوقتي بصوا على الوريد الأزرق اللي نور ده! الدم اتنقى 100% وأصبح خالي تماماً من الفضلات واليوريا، بيخرج عبر الوريد الكلوي ويرجع للقلب وباقي الجسم وهو منتعش وبصحة ممتازة!",
          keyPoints: [
            "يخرج الدم النقي تماماً والخالي من الفضلات عبر الوريدين الكلويين إلى الوريد الأجوف السفلي.",
            "يعود الدم النظيف إلى القلب ليتم ضخه من جديد إلى جميع خلايا وأعضاء الجسم.",
            "يحافظ الجسم بذلك على توازنه المائي وتوازن الأملاح ودرجة حموضة الدم (pH)."
          ],
          scientificFact: "الدورة الدموية الكلوية تضمن أن دم الإنسان بالكامل يمر على الكليتين لتنقيته وتصفيته باستمرار طوال الـ 24 ساعة.",
          visualAction: "توهج الوريد الكلوي باللون السماوي وخروج جزيئات دم نقية زرقاء صافية صاعدة إلى أعلى الجسم.",
          particleType: "clean_blood_return",
          showFilters: false,
          activeGlow: true,
          labels: [
            { text: "الوريد الكلوي (دم نقي 100% عائد للقلب)", x: 430, y: 70, color: "#38bdf8" },
            { text: "دم نقي معافى جاهز للجسم ✨", x: 400, y: 240, color: "#34d399" }
          ]
        },
        {
          stepNumber: 7,
          title: "7. مخرجات الكلية والخلاصة الذهبية لجهاز الإخراج",
          category: "اكتمال الدورة الشاملة",
          teacherScript: "وبكدا يا شطار نكون عرفنا مخرجات الكلية: دم نقي وجميل بيعود تاني لجسمنا، وبول محمل بالفضلات بيتطرد برة الجسم خالص! تبارك الله أحسن الخالقين على هذه الهندسة المعجزة!",
          keyPoints: [
            "مخرجات الكلية تنقسم إلى قسمين رئيسيين: دم نقي يعاد للجسم، وبول يُطرد للخارج.",
            "الدم النقي: يحتوي على خلايا الدم والبروتينات ومعظم الماء والجلوكوز المتوازن.",
            "البول: يحتوي على اليوريا النيتروجينية، حمض البوليك، الأملاح الزائدة، والماء الزائد."
          ],
          scientificFact: "شرب كميات كافية من الماء يومياً يحافظ على كفاءة فلاتر النيفرون ويحمي الكليتين من ترسب الأملاح والحصوات.",
          visualAction: "إضاءة كامل أجزاء الرسمة بالأسهم والعناصر المتكاملة لتظهر الدورة الإخراجية كاملة بألوانها الزاهية.",
          particleType: "generic_flow",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "المخرج 1: دم نقي 100% يعود للجسم", x: 430, y: 65, color: "#38bdf8" },
            { text: "المخرج 2: بول محمل بالفضلات يُطرد للخارج", x: 400, y: 490, color: "#facc15" }
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
المعلمة رحاب (Teacher Rehab) تريد عرضاً تقديمياً تفاعلياً تشرحه بنفسها خطوة بخطوة للطلاب، بحيث تكون الرسمة الأساسية موجودة بالكامل في البداية، ومع كل كليك يظهر تفصيل جديد على الرسمة مع أسهم موجهة ونقاط مكتوبة على الشريحة.

القواعد الصارمة لأسلوب د. أحمد الغريب:
1. **الرسمة موجودة من البداية:** الشريحة تبدأ بنظرة عامة على الرسمة التشريحية.
2. **كشف تفاصيل الرسمة تدريجياً بالكليك (Step-by-step Progressive Layering):**
   - مع كل كليك يضاء جزء محدد بلونه الخاص.
   - يخرج سهم موجه يشير إلى الجزء واسمه.
   - تظهر نقاط الشرح المكتوبة في مصفوفة "keyPoints" (2 إلى 3 نقاط مهمة مكتوبة يراها الطلاب).
   - تظهر معلومة ذهبية "scientificFact".
3. **وضوح الفضلات في الدم:**
   - توضيح دقيق ومميز لجزيئات الفضلات (اليوريا والسموم الصفراء) داخل الدم الأحمر وفصلها في الفلاتر.
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
