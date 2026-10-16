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

    const chosenTopic = topic || "رحلة الكليتين وتنقية الدم في جسم الإنسان";

    // Default Kidney 5-step Presentation with on-screen written key points & clear waste details
    const defaultKidneyPresentation = {
      id: "pres_" + Date.now(),
      title: "رحلة الكليتين وتنقية الدم في جسم الإنسان",
      topic: chosenTopic,
      diagramType: "kidneys",
      steps: [
        {
          stepNumber: 1,
          title: "1. موضع الكليتين واستقبال الدم",
          category: "نظرة عامة على الجهاز الإخراجي",
          teacherScript: "أهلاً بكم يا أبطالي! شايفين الكليتين الجميلتين دول؟ هما مصنع النظافة في جسمنا، بيستقبلوا الدم من الشريان الكلوي الكبير عشان تبدأ أهم رحلة تنقية!",
          keyPoints: [
            "يدخل الدم غير المصفى إلى الكليتين عبر الشريان الكلوي المتفرع من الشريان الأورطي الكبير.",
            "تقع الكليتان في الناحية الظهرية للبطن على جانبي العمود الفقري.",
            "يصل إلى الكليتين حوالي ربع كمية الدم التي يضخها القلب في كل دقيقة لمواصلة تنقيته."
          ],
          scientificFact: "الكليتان هما العضوان الرئيسيان في الجهاز البولي لتنقية الدم والحفاظ على توازن السوائل في الجسم.",
          visualAction: "يظهر مجسم الكليتين مع الشريان الكلوي الكبير باللون الأحمر، وتبدأ خلايا الدم بالتدفق من أعلى الشريان باتجاه الكليتين.",
          particleType: "incoming_blood",
          showFilters: false,
          activeGlow: false,
          labels: [
            { text: "الشريان الكلوي (دم قادم للتنقية)", x: 370, y: 70, color: "#ef4444" },
            { text: "الكلية اليسرى", x: 170, y: 140, color: "#f87171" },
            { text: "الكلية اليمنى", x: 630, y: 140, color: "#f87171" }
          ]
        },
        {
          stepNumber: 2,
          title: "2. فحص الدم غير النقي وظهور جزيئات الفضلات",
          category: "تركيب الدم ومحتوى السموم واليوريا",
          teacherScript: "بصوا معايا بتركيز جوة الشريان! الدم جواه كرات دم حمراء مفيدة وخلايا حيوية، وفيه جزيئات صفراء سمراء واضحة هي الفضلات النيتروجينية واليوريا والأملاح الزائدة اللي لازم نطردها فوراً!",
          keyPoints: [
            "الدم غير النقي يحتوي على خليط من خلايا حيوية مفيدة (كرات الدم الحمراء) وجزيئات فضلات ضارة.",
            "الفضلات الرئيسية: اليوريا الناتجة عن هضم البروتينات، حمض البوليك، والأملاح والماء الزائد.",
            "تظهر جزيئات الفضلات بلون أصفر مميز داخل تيار الدم لتوضيح مسار عزلها وتنقيتها."
          ],
          scientificFact: "تراكم الفضلات النيتروجينية كاليوريا في الدم بدون تنقية يؤدي لتسمم بولي، لذلك تنقي الكلى الدم باستمرار.",
          visualAction: "تكبير لمجرى الشريان وظهور جزيئات الفضلات الصفراء بوضوح ممزوجة بالدم الأحمر، تتدفق نحو أنسجة الكلية.",
          particleType: "waste_particles",
          showFilters: false,
          activeGlow: false,
          wasteDetails: "حبيبات صفراء حادة ومميزة تمثل جزيئات اليوريا والسموم محاطة بكرات الدم الحمراء.",
          labels: [
            { text: "🔴 كرات دم حمراء مفيدة", x: 260, y: 180, color: "#ef4444" },
            { text: "🟡 فضلات ضارة (يوريا وأملاح سامة)", x: 480, y: 180, color: "#facc15" }
          ]
        },
        {
          stepNumber: 3,
          title: "3. دخول الفلاتر المجهرية (النيفرونات) والغربلة",
          category: "عملية الترشيح وإعادة الامتصاص",
          teacherScript: "شايفين النجوم والمصافي الصفراء اللي نورت جوة الكلية؟ دي النيفرونات! ملايين الفلاتر الدقيقة بتغربل الدم، تحبس الفضلات وتعدي الدم النظيف بأمان!",
          keyPoints: [
            "تحتوي كل كلية على حوالي مليون وحدة ترشيح مجهرية تسمى (النيفرونات).",
            "يتم ترشيح جزيئات الفضلات والماء والأملاح من الشعيرات الدموية داخل محفظة بومان.",
            "تقوم الأنابيب الكلوية بإعادة امتصاص المواد الضرورية كالجلوكوز ومعظم الماء إلى الدم النظيف."
          ],
          scientificFact: "شبكة النيفرونات تعمل كغربال فائق الدقة، تفصل السموم تماماً دون أن تفقد خلية دم واحدة مفيدة.",
          visualAction: "إضاءة شبكات النيفرون داخل الكليتين كفلاتر صفراء متوهجة تهتز أثناء تصفية وحجز جزيئات الفضلات.",
          particleType: "filtering_action",
          showFilters: true,
          activeGlow: true,
          labels: [
            { text: "فلاتر النيفرون الذكية", x: 210, y: 260, color: "#fbbf24" },
            { text: "عملية الترشيح الدقيق", x: 580, y: 260, color: "#fbbf24" }
          ]
        },
        {
          stepNumber: 4,
          title: "4. فصل الفضلات ونزولها عبر الحالبين (تكوين البول)",
          category: "مرحلة التخلص من البول نحو المثانة",
          teacherScript: "الفضلات والمية الزايدة اتجمعت وتحولت لبول، وبدأت تنزل نقطة بنقطة في الأنبوبين الصفر دول (الحالبين) لحد ما توصل للمثانة وتخرج برة جسمنا خالص!",
          keyPoints: [
            "تتجمع الفضلات المعزولة مع الماء الزائد والأملاح لتكوين سائل (البول).",
            "ينتقل البول من حوض الكلية عبر أنبوبين عضليين هما (الحالبان) باتجاه المثانة البولية.",
            "المثانة كيس عضلي مرن يخزن البول مؤقتاً حتى يتم تفريغه خارج الجسم عبر مجرى البول."
          ],
          scientificFact: "الحالب ينقل البول من الكلية للمثانة بقطرات متتالية بفضل حركات عضلية دودية لا إرادية.",
          visualAction: "تدفق قطرات بول صفراء متتابعة عبر الحالبين الأيمن والأيسر هبوطاً إلى المثانة البولية.",
          particleType: "urine_flow",
          showFilters: true,
          activeGlow: false,
          labels: [
            { text: "الحالب (ينقل البول)", x: 300, y: 380, color: "#eab308" },
            { text: "المثانة البولية (تخزين مؤقت)", x: 400, y: 490, color: "#facc15" }
          ]
        },
        {
          stepNumber: 5,
          title: "5. عودة الدم النقي 100% إلى الجسم",
          category: "اكتمال دورة التنقية وصحة الجسم",
          teacherScript: "وبكدا يا أبطالي، الدم اتنقى 100%! بيخرج من الوريد الأزرق النظيف ويرجع للقلب وباقي الجسم وهو منتعش وبصحة ممتازة! تبارك الله أحسن الخالقين!",
          keyPoints: [
            "يخرج الدم النقي تماماً والخالي من الفضلات عبر الوريدين الكلويين إلى الوريد الأجوف السفلي.",
            "يعود الدم النظيف إلى القلب ليتم ضخه من جديد إلى جميع خلايا وأعضاء الجسم.",
            "تنظيم نسبة الأملاح ودرجة حموضة الدم (pH) وكمية السوائل في الجسم بدقة بالغة."
          ],
          scientificFact: "الدورة الدموية الكلوية تتكرر باستمرار لغسيل وتنقية دم الإنسان قرابة 300 مرة يومياً!",
          visualAction: "توهج الوريد الكلوي باللون السماوي وخروج جزيئات دم نقية زرقاء صافية صاعدة إلى أعلى الجسم.",
          particleType: "clean_blood_return",
          showFilters: false,
          activeGlow: true,
          labels: [
            { text: "الوريد الكلوي (دم نقي 100%)", x: 430, y: 70, color: "#38bdf8" },
            { text: "دم نقي جاهز للجسم ✨", x: 400, y: 240, color: "#34d399" }
          ]
        }
      ]
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ presentation: defaultKidneyPresentation });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = `أنت خبير تربوي متقدم ومصمم عروض تقديمية تفاعلية (PowerPoint Click-by-Click) لشرح العلوم والأحياء للأطفال.
المعلمة رحاب (Teacher Rehab) تريد عرضاً تقديمياً تفاعلياً تشرحه بنفسها خطوة بخطوة للطلاب، بحيث كل حركة وعنصر بصري ينتقل بـ (كليك واحد Click) بدون فيديوهات وبدون شخصيات كرتونية على الشاشة.

قواعد هامة جداً وصارمة:
1. **كتابة الكلام المهم على الشريحة مع كل كليك (keyPoints):**
   - الطلاب يشاهدون العرض، ولذلك يجب أن يحتوي كل كليك على مصفوفة "keyPoints" بها 2 إلى 3 نقاط تعليمية مكتوبة واضحة ومباشرة تلخص ما يتعلمه الطالب في هذه الحركة.
   - أضف أيضاً حقل "scientificFact" به معلومة ذهبية أو قاعدة علمية مكتوبة.
2. **وضوح الفضلات في الدم (Waste particles in blood):**
   - إذا كان الدرس عن الكليتين أو الإخراج أو الدم، يجب التوضيح الدقيق لجزيئات الفضلات (اليوريا، الأملاح، السموم) وكيف تبدو مميزة بلون أصفر داخل تيار الدم ويتم فصلها عن كرات الدم الحمراء.
3. **ملاحظات المعلمة الخفية (teacherScript):**
   - حقل "teacherScript" مخصص لما تقوله المعلمة بصوتها (شرح دافئ وممتع بالعامية المصرية الراقية للأطفال).
   - هذا النص سيظهر في نافذة خاصة للمعلمة ولن يظهر على الشاشة الموجهة للطلاب أثناء تسجيل الفيديو!
4. **تقسيم محكم إلى 4 إلى 7 خطوات (كليكات) متسلسلة كرحلة علمية متكاملة.**

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
      "teacherScript": "ما تقوله المعلمة بصوتها للأطفال...",
      "keyPoints": [
        "النقطة التعليمية الأولى المكتوبة على الشاشة...",
        "النقطة الثانية المكتوبة..."
      ],
      "scientificFact": "القاعدة العلمية المكتوبة...",
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
            text: `يرجى قراءة هذه الصفحات المرفقة من كتاب العلوم واستخراج الدرس منها بدقة كاملة، وتحويل جميع المفاهيم والخطوات إلى عرض باوربوينت تفاعلي كليك لكل حركة وفق القواعد السابقة.`
          });
        } else {
          parts.push({
            text: `موضوع الدرس المطلوب تحويله لباوربوينت تفاعلي:
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
