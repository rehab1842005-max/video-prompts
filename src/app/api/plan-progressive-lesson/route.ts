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

    const promptText = `
أنت كبير مخرجي الفيديوهات التعليمية ورسامي الرسوم المتحركة 3D Pixar للمنصة التعليمية (المعلمة رحاب - Sci.Rehab Elsibai).
الموضوع المطلوب: ${topic || "محتوى صفحات الكتاب المرفقة"}.

### الفلسفة البصرية الإجبارية (اللوحة الأساسية المتصلة ذات الكشف التدريجي - Progressive Cumulative Canvas):
المستخدمة طلبت صراحة:
"عايزاه برضه هو اللي يعمل صور بما يتناسب مع الدرس، وعايزة الصور تكون مكملة لبعض، يعني نفس الشيء ما يتغيرش، نفس الحاجات اللي جواها ما يتغيروش، اللي يتغير بس الجزء اللي عليه الشرح. فاهمني؟ أنا عايزة مثلاً تبقى نفس الصورة مكملة لغاية نهاية الفيديو، بس الفرق في الصورة الحاجات الجديدة اللي هو بيشرحها وتكون بتكمل بعضها."

قواعد التطبيق الصارمة:
1. **اللوحة الأساسية الموحدة (Base Visual Anchor):**
   كل المشاهد تدور حول نفس النموذج التشريحي أو الكرتوني 3D Pixar ونفس زاوية الرؤية ونفس الاستوديو العلمي (معرض زجاجي مضيء، إضاءة سيان وبنفسجية هادئة). لا يتغير شكل المجسم الأساسي ولا البيئة نهائياً!
2. **الكشف التدريجي الإضافي فقط (Progressive Delta Only):**
   كل صورة تكمل الصورة السابقة حرفياً، والشيء الوحيد الذي يتغير هو ظهور أو إضاءة العنصر الجديد المشروح في هذه الخطوة:
   - الخطوة 1: المشهد الأساسي العام مع إضاءة العضو المطلوب وموقعه.
   - الخطوة 2: نفس المجسم ونفس الاستوديو بالضبط + تدفق المسار الأول (دخول سائل أو تيار دم شرياني).
   - الخطوة 3: نفس المجسم بالضبط + قطاع مجهري يوضح الفلترة والعملية الدقيقة بالداخل.
   - الخطوة 4: نفس المجسم بالضبط + تكون ونزول مسار الفضلات أو الناتج.
   - الخطوة 5: اللوحة المكتملة بنفس المجسم تجمع كافة المسارات في سيمفونية واحدة.
3. **لافتة الاسم الحصرية ومنع أي نصوص أخرى في الفيديو:**
   في برومبت توليد الصورة (imageGenerationPrompt): اكتب دائماً في خلفية الاستوديو العلمي وجود لافتة نيون مضيئة أنيقة تحمل نص "Sci.Rehab Elsibai" حصراً: (Mounted prominently in the upper center background wall, a glowing 3D neon holographic sign clearly displays the exact typographic text "Sci.Rehab Elsibai". The full text "Sci.Rehab Elsibai" must be completely clear and beautifully illuminated).
   في كل برومبت تحريك (motionPrompt)، يجب إجبارياً إضافة التعليمة الصارمة:
   (The glowing neon sign "Sci.Rehab Elsibai" remains static and beautifully illuminated in the upper background wall throughout the video. NEGATIVE EXCLUSION: Absolutely NO other text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).
4. **كلام الشرح الصوتي للدرس (lessonExplanation):**
   بصوت المعلمة رحاب بالعامية المصرية الدافئة والممتعة للأطفال ("بصوا معايا على نفس الصورة.. شايفين إيه اللي زاد هنا؟...").

المطلوب: توليد 4 إلى 5 محطات متناسقة بصيغة JSON صالح فقط:
[
  {
    "stepNumber": 1,
    "title": "عنوان المحطة التعليمية",
    "visualAddition": "ما هو الجزء الجديد المضاف في هذه الصورة فقط",
    "lessonExplanation": "كلام الشرح الصوتي للمعلمة رحاب...",
    "motionPrompt": "Detailed English Image-to-Video motion prompt for Kling/Runway... (NEGATIVE EXCLUSION: Absolutely NO text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).",
    "imageGenerationPrompt": "Detailed 3D Pixar image generation prompt with identical base anchor and progressive element (NO text, NO words)...",
    "montageText": ["نص مونتاج 1", "نص مونتاج 2"],
    "duration": "8 seconds",
    "continuityNote": "كيف تكمل هذه الصورة اللقطة التالية..."
  }
]
`;

    parts.push({ text: promptText });

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
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        });
        resultText = res.response.text();
        if (resultText && resultText.trim()) break;
      } catch (e: any) {
        lastError = e;
      }
    }

    if (!resultText) throw lastError || new Error("فشل توليد الخطة");

    const jsonMatch = resultText.match(/```json\n([\s\S]*?)\n```/) || resultText.match(/\[[\s\S]*\]/);
    const cleanedJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : resultText;
    const scenes = JSON.parse(cleanedJson);

    // Ensure NO TEXT in all motion prompts
    const noTextRule = "(NEGATIVE EXCLUSION: Absolutely NO text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).";
    if (Array.isArray(scenes)) {
      scenes.forEach((s: any) => {
        if (s.motionPrompt && !s.motionPrompt.toLowerCase().includes("no text")) {
          s.motionPrompt = `${s.motionPrompt.trim()}\n\n${noTextRule}`;
        }
      });
    }

    return NextResponse.json({ success: true, scenes });
  } catch (error: any) {
    console.error("Error in plan-progressive-lesson:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء ابتكار الرحلة المصورة" }, { status: 500 });
  }
}
