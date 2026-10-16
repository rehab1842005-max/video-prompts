import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, lessonText, diagramType = "kidneys" } = body;

    const chosenTopic = topic || "رحلة الكليتين وتنقية الدم في جسم الإنسان";

    // Default Kidney 5-step Presentation (the exact reference model user requested)
    const defaultKidneyPresentation = {
      id: "pres_" + Date.now(),
      title: "رحلة الكليتين وتنقية الدم خطوة بخطوة",
      topic: chosenTopic,
      diagramType: "kidneys",
      steps: [
        {
          stepNumber: 1,
          title: "1. موضع الكليتين واستقبال الدم",
          category: "نظرة عامة على الجهاز الإخراجي",
          teacherScript: "أهلاً بكم يا أبطالي! شايفين الكليتين الجميلتين دول؟ هما مصنع النظافة في جسمنا، بيستقبلوا الدم من الشريان الكلوي الكبير عشان تبدأ أهم رحلة تنقية!",
          visualAction: "يظهر مجسم الكليتين مع الشريان الكلوي الكبير باللون الأحمر، وتبدأ خلايا الدم بالتدفق من أعلى الشريان باتجاه الكليتين.",
          particleType: "incoming_blood",
          showFilters: false,
          activeGlow: false,
          labels: [
            { text: "الشريان الكلوي (دم محمل بالفضلات)", x: 370, y: 70, color: "#ef4444" },
            { text: "الكلية اليسرى", x: 170, y: 140, color: "#f87171" },
            { text: "الكلية اليمنى", x: 630, y: 140, color: "#f87171" }
          ]
        },
        {
          stepNumber: 2,
          title: "2. فحص الدم غير النقي (المحمل بالفضلات)",
          category: "تركيب الدم قبل الفلترة",
          teacherScript: "بصوا معايا جوة الشريان! الدم مش ماشي لوحده، فيه كرات دم حمراء مفيدة، وفيه جزيئات فضلات ضارة صفراء لازم نتخلص منها فوراً عشان جسمنا يفضل سليم!",
          visualAction: "تكبير لمجرى الدم وظهور جزيئات صفراء تمثل الفضلات والسموم محاطة بكرات الدم الحمراء، متجهة إلى داخل أنسجة الكلية.",
          particleType: "waste_particles",
          showFilters: false,
          activeGlow: false,
          labels: [
            { text: "🔴 دم غير نقي", x: 260, y: 190, color: "#ef4444" },
            { text: "⚠️ فضلات ضارة (يجب طردها)", x: 470, y: 190, color: "#facc15" }
          ]
        },
        {
          stepNumber: 3,
          title: "3. دخول الفلاتر المجهرية (النيفرونات)",
          category: "عملية الغربلة والتصفية الدقيقة",
          teacherScript: "شايفين النجوم والمصافي الصفراء اللي نورت جوة الكلية؟ دي النيفرونات! ملايين الفلاتر الدقيقة بتغربل الدم، تحبس الفضلات وتعدي الدم النظيف بأمان!",
          visualAction: "إضاءة شبكات النيفرون داخل الكليتين كدوائر فلترة صفراء متوهجة تهتز لتصفية الفضلات وفصلها عن الدم النقي.",
          particleType: "filtering_action",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "فلاتر النيفرون الذكية", x: 210, y: 260, color: "#fbbf24" },
            { text: "عملية الغربلة والترشيح", x: 580, y: 260, color: "#fbbf24" }
          ]
        },
        {
          stepNumber: 4,
          title: "4. فصل الفضلات ونزولها في الحالبين (البول)",
          category: "مرحلة التخلص من السموم",
          teacherScript: "الفضلات والمية الزايدة اتجمعت وتحولت لبول، وبدأت تنزل نقطة بنقطة في الأنبوبين الصفر دول (الحالبين) لحد ما توصل للمثانة وتخرج برة جسمنا خالص!",
          visualAction: "تدفق قطرات صفراء متتابعة عبر الحالبين الأيمن والأيسر هبوطاً إلى المثانة البولية للتخلص النهائي من الفضلات.",
          particleType: "urine_flow",
          showFilters: true,
          activeGlow: false,
          labels: [
            { text: "الحالب (ينقل البول)", x: 300, y: 380, color: "#eab308" },
            { text: "المثانة البولية (تخزين البول)", x: 400, y: 490, color: "#facc15" }
          ]
        },
        {
          stepNumber: 5,
          title: "5. عودة الدم النقي تماماً إلى الجسم",
          category: "اكتمال دورة النظافة",
          teacherScript: "وبكدا يا أبطالي، الدم اتنقى 100%! بيخرج من الوريد الأزرق النظيف ويرجع للقلب وباقي الجسم وهو منتعش وبصحة ممتازة! تبارك الله أحسن الخالقين!",
          visualAction: "توهج الوريد الكلوي باللون السماوي وخروج جزيئات دم نقية زرقاء صافية صاعدة إلى أعلى الجسم لاكتمال الدورة الدموية بنجاح.",
          particleType: "clean_blood_return",
          showFilters: false,
          activeGlow: true,
          labels: [
            { text: "الوريد الكلوي (دم نقي 100%)", x: 430, y: 70, color: "#38bdf8" },
            { text: "تمت التنقية بنجاح ✨", x: 400, y: 240, color: "#34d399" }
          ]
        }
      ]
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ presentation: defaultKidneyPresentation });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `أنت خبير تربوي متقدم ومصمم عروض تقديمية تفاعلية (PowerPoint Click-by-Click) لشرح العلوم والأحياء للأطفال.
المعلمة رحاب (Teacher Rehab) تريد عرضاً تقديمياً تفاعلياً تشرحه بنفسها خطوة بخطوة للطلاب، بحيث كل حركة وعنصر بصري ينتقل بـ (كليك واحد Click) بدون فيديوهات وبدون شخصيات كرتونية على الشاشة.

موضوع الدرس المطلوب تحليله:
"""
العنوان: ${chosenTopic}
المحتوى / التفاصيل: ${lessonText || chosenTopic}
"""

المطلوب:
تحليل العملية العلمية وتقسيمها إلى 4 إلى 6 خطوات تفاعلية دقيقة (كليك لكل حركة بالترتيب المنطقي).
لكل كليك/خطوة:
1. stepNumber: رقم الخطوة (1, 2, 3...)
2. title: عنوان دقيق وجذاب للخطوة (مثلاً: 1. دخول الدم عبر الشريان)
3. category: اسم المرحلة العلمية (مثلاً: الاستقبال، الفلترة، الطرد)
4. teacherScript: ماذا تقول المعلمة في هذا الكليك تحديداً للأطفال بنبرة دافئة ومبسطة بالعامية المصرية الراقية (من 15 إلى 25 كلمة تشرح ما يراه الطفل بعينه الآن).
5. visualAction: وصف الحركة التفاعلية التي تحدث على الشاشة في هذا الكليك (مثلاً: تدفق الدم، ظهور فلاتر النيفرون، تساقط قطرات الفضلات...).
6. particleType: اختر أحد الأنواع التالية بدقة:
   - "incoming_blood" (تدفق دم داخل)
   - "waste_particles" (دم مع جزيئات فضلات مميزة)
   - "filtering_action" (اهتزاز وتصفية الفلاتر)
   - "urine_flow" (تدفق فضلات / قطرات بول في الحالبين)
   - "clean_blood_return" (صعود دم نقي للوريد)
   - "generic_flow" (تدفق عام)
7. showFilters: true إذا كانت الخطوة تخص الفلاتر والنيفرونات، وإلا false
8. activeGlow: true إذا كان العضو متوهجاً أو نشطاً في هذه اللحظة، وإلا false
9. labels: مصفوفة من 2 إلى 3 تأشيرات توضيحية على الرسم:
   [ { "text": "اسم الجزء المضاء", "x": 370, "y": 70, "color": "#ef4444" } ]

يجب أن تكون النتيجة JSON صالح فقط (Valid JSON) لكائن presentation:
{
  "id": "pres_${Date.now()}",
  "title": "${chosenTopic}",
  "topic": "${chosenTopic}",
  "diagramType": "${diagramType}",
  "steps": [ ... ]
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
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 3000,
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
