import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get("pdfFile") as File | null;
    const imagesCount = parseInt(formData.get("imagesCount") as string || "0");

    if (!pdfFile && imagesCount === 0) {
      return NextResponse.json({ error: "الرجاء رفع ملف الكتاب أو الصور التوضيحية" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "لم يتم العثور على مفتاح Gemini API" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const parts: any[] = [];

    // 1. Convert PDF if provided
    let hasPdf = false;
    if (pdfFile) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      parts.push({
        inlineData: {
          data: pdfBuffer.toString("base64"),
          mimeType: "application/pdf"
        }
      });
      hasPdf = true;
    }

    // 2. Convert all uploaded images
    const imagesInfo: { index: number; name: string }[] = [];
    for (let i = 0; i < imagesCount; i++) {
      const imgFile = formData.get(`image_${i}`) as File | null;
      if (imgFile) {
        const imgBuffer = Buffer.from(await imgFile.arrayBuffer());
        const mimeType = imgFile.type || "image/jpeg";
        parts.push({
          inlineData: {
            data: imgBuffer.toString("base64"),
            mimeType: mimeType
          }
        });
        imagesInfo.push({ index: i, name: imgFile.name });
      }
    }

    if (imagesInfo.length === 0) {
      return NextResponse.json({ error: "الرجاء رفع صورة واحدة على الأقل من صور الدرس" }, { status: 400 });
    }

    const promptText = `
أنت مخرج فيديو تعليمي ومصمم برومبتات ذكاء اصطناعي محترف للمنصة التعليمية (المعلمة رحاب - Sci.Rehab Elsibai).
المطلوب منك تحليل المحتوى التعليمي والربط الدقيق بين:
${hasPdf ? "1. صفحات كتاب المدرسة المرفقة كملف PDF." : "1. موضوع الدرس العلمي."}
2. صور الدرس التوضيحية المرفقة (عددها ${imagesInfo.length} صورة) المرفوعة بالترتيب: صورة 1 إلى صورة ${imagesInfo.length}.

### القواعد الصارمة والمقدسة:
1. **الفهم العلمي الشامل:** افهم الدرس التعليمي وخطواته العلمية بدقة من صفحات الكتاب.
2. **علاقة كل صورة بالدرس:** الذكاء الاصطناعي يفهم علاقة الصور بالدرس، فالصور ستكون شرحاً للدرس.
   لكل صورة تم رفعها:
   - حدد بدقة ما تعرضه الصورة تشريحياً وعلمياً من خطوات الدرس.
   - رتب تسلسل الشرح بحيث تخدم كل صورة خطوة علمية متناسقة.
3. **كلام الشرح الصوتي للدرس (lessonExplanation):**
   - يُكتب بأسلوب المعلمة رحاب الشيق، الدافئ، بالعامية المصرية الراقية والسهلة جداً للأطفال ("بصوا معايا يا أبطالي...", "شايفين في الصورة دي...").
   - يشرح محتوى هذه الصورة بالذات ويربطه بمعلومة الكتاب دون تلعثم.
   - جمل كاملة ومغلقة (بين 20 و 30 كلمة)، بدون أي تكرار لكلمات، وتكون سهلة القراءة والتحويل لصوت.
4. **برومبت تحريك الصورة (motionPrompt) باللغة الإنجليزية:**
   - مخصص حصرياً لمولدات الفيديو الرائدة من الصور (Image-to-Video) مثل: Kling AI, Runway Gen-3 Alpha, Luma Dream Machine, Haiper.
   - يصف بدقة بالغة تحريك العناصر الموجودة بالفعل داخل هذه الصورة الثابتة:
     * تدفق السوائل والجسيمات وحركة الأسهم والنبضات المناسبة للعضو أو الشكل المرسوم (Continuous fluid kinetic animation, liquid flowing, subtle pulsing, active glowing indicators).
     * حركة الكاميرا السينمائية الهادئة (Slow cinematic push-in, subtle smooth panning, macro focus).
     * الحفاظ الكامل على الهوية البصرية ونمط الرسم الأصلي للصورة دون تشويه ودون توليد أشخاص غرباء (Preserve original illustration style, clean fluid motion, 4k cinematic render).
   - **(قاعدة حاسمة ومقدسة - منع تام لأي نصوص أو كلام في الفيديو NO TEXT IN VIDEO):**
     المستخدمة طلبت صراحة: "مش عايزة أي كلام يكون في الفيديو، حتى لو الصورة فيها كلام، فالبرومبت يقول له مش عايز أي كلام في الفيديو".
     لذلك يجب إجبارياً في نهاية كل برومبت تحريك إضافة هذه التعليمة الصارمة بالحرف:
     "(NEGATIVE EXCLUSION: Absolutely NO text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only)."
5. **نصوص وشاشات المونتاج (montageText):**
   - عناوين وبادجات ونقاط رئيسية توضع على الشاشة أثناء المونتاج في برامج المونتاج مثل CapCut أو Premiere.
6. **مدة المشهد (duration):**
   - حدد مدة مناسبة للحركة والشرح (مثلاً "6 seconds" إلى "9 seconds").

يجب أن ترجع المخرجات كمصفوفة JSON صالحة فقط وبدون أي مقدمات أو علامات إضافية:
[
  {
    "imageIndex": 0,
    "stepNumber": 1,
    "title": "عنوان الخطوة التعليمية بالعربية",
    "lessonExplanation": "كلام الشرح الصوتي للمعلمة رحاب المتناسق مع تفاصيل هذه الصورة...",
    "motionPrompt": "Cinematic Image-to-Video motion prompt in English describing continuous animation of the uploaded image elements... (NEGATIVE EXCLUSION: Absolutely NO text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).",
    "montageText": ["نص مونتاج 1", "نص مونتاج 2"],
    "duration": "8 seconds",
    "continuityNote": "كيف يرتبط هذا المشهد بالمشهد التالي..."
  }
]
`;

    parts.push({ text: promptText });

    const fallbackModels = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest"
    ];

    let lastError = null;
    let resultText = "";

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
        if (resultText && resultText.trim()) {
          break;
        }
      } catch (e: any) {
        console.warn(`Model ${modelName} failed:`, e.message);
        lastError = e;
      }
    }

    if (!resultText) {
      throw lastError || new Error("فشل توليد النتائج من جميع النماذج");
    }

    // Clean JSON
    const jsonMatch = resultText.match(/```json\n([\s\S]*?)\n```/) || resultText.match(/\[[\s\S]*\]/);
    const cleanedJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : resultText;
    const parsedData = JSON.parse(cleanedJson);

    // Guaranteed enforcement of NO TEXT in all motion prompts
    const noTextRule = "(NEGATIVE EXCLUSION: Absolutely NO text, NO words, NO letters, NO subtitles, NO typography, NO captions, NO watermark, NO floating labels in the video. Ignore any text in the source image and do not morph or animate words. Pure visual motion only).";
    if (Array.isArray(parsedData)) {
      parsedData.forEach((scene: any) => {
        if (scene.motionPrompt && !scene.motionPrompt.toLowerCase().includes("no text")) {
          scene.motionPrompt = `${scene.motionPrompt.trim()}\n\n${noTextRule}`;
        }
      });
    }

    return NextResponse.json({
      success: true,
      scenes: parsedData
    });
  } catch (error: any) {
    console.error("Error in analyze-images:", error);
    return NextResponse.json({ 
      error: error.message || "حدث خطأ أثناء تحليل الصور وربطها بالدرس" 
    }, { status: 500 });
  }
}
