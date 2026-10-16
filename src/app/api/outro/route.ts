import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lastPromptText, teacherOutfit, videoNumber } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No API key configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const outfit = teacherOutfit || "a stunning sparkly silver glitter blazer over a crisp white blouse and sleek dark trousers";
    const nextNum = videoNumber || 20;

    const prompt = `أنت مخرج سينمائي تعليمي متخصص في صناعة الخواتم واللقطات النهائية (Outro Video Scenes) لبرامج الأطفال التعليمية على يوتيوب.
المعلمة رحاب (Teacher Rahab) تقدم برنامجها التلفزيوني الشهير للأطفال في استوديو يحمل شعار "Sci.Rehab Elsibai".

إليك نص آخر مشهد من الدرس لمعرفة موضوع الشرح:
"""
${lastPromptText || "درس عن جسم الإنسان والعلوم للأطفال"}
"""

المطلوب:
توليد مشهد ختامي احترافي ومبهر (Outro Scene) مدته 8 إلى 10 ثوانٍ يجمع بين تلخيص دافئ وسريع، وتهنئة الأطفال بإتمام الرحلة العلمية، وتوديعهم وتشويقهم للحلقة القادمة مع مس رحاب!

القواعد الصارمة:
1. **SCENE:** A spectacular, celebratory neon TV educational studio with colorful lights and celebratory golden confetti falling in the air. A HUGE glowing smart LED screen in the background displaying cheerful scientific victory celebration graphics (friendly organs celebrating with gold stars and thumbs up). Mounted directly ABOVE the top border of the smart screen, the prominent glowing neon sign: "Sci.Rehab Elsibai". Absolutely NO text or words inside the screen display, only celebratory cartoon graphics and golden confetti.
2. **CHARACTER:** Teacher Rahab: 3D Animation Pixar/Disney Style. A beautiful 20-25 years old young female teacher with long wavy dark brown hair, smiling warmly and waving happily with one hand while holding a sleek professional microphone in the other. Wearing: ${outfit}.
3. **ACTION:** Inside the smart screen, celebratory 3D cartoon organs and golden stars are gently floating with celebratory confetti in active continuous motion. Concurrently, Teacher Rahab looks directly at the camera with beaming warmth and pride, speaking her encouraging closing words, and waving gently with her hand. The character finishes speaking and maintains a cheerful warm smile and gentle wave for the final second, creating a seamless ending cut.
4. **CAMERA:** Medium cinematic shot capturing Teacher Rahab center-stage waving warmly, with the glowing "Sci.Rehab Elsibai" neon sign and celebratory screen perfectly framed.
5. **DIALOGUE:** كلام ختامي دافئ، مشجع جداً وممتع بالعامية المصرية الراقية للأطفال. تلخص فيه ما أنجزناه وتهنئهم وتشوقهم للدرس القادم (من 15 إلى 20 كلمة كحد أقصى).
مثال: [Teacher Rahab]: وبكدة يا أبطالي الحلوين نكون خلصنا رحلتنا الجميلة مع الكليتين وجسمنا البطل! فخورة بيكم جداً، واستنوني في مغامرة علمية جديدة مع مس رحاب! باي باي يا شطار!
6. **AUDIO:** Triumphant cheerful upbeat cinematic background music with celebratory sparkles and joyful children cheering/clapping applause. Voice starts at 0:00.
7. **imagePrompt:** English prompt for the celebratory closing starting frame: (Teacher Rahab smiling and waving next to the huge smart screen showing celebratory gold stars, with the glowing neon sign "Sci.Rehab Elsibai" directly above the screen, golden confetti in the air, 3D Pixar render, 8k, no text on screen).
8. **duration:** "8 seconds" (أو استنتج المدة حسب طول الحوار).

يجب أن تكون المخرجات بصيغة JSON صالح فقط لكائن واحد (Single Object) بدون أي كود إضافي:
{
  "id": "outro_${Date.now()}",
  "videoNumber": ${nextNum},
  "pageNumber": 1,
  "partName": "خاتمة الدرس والتوديع",
  "duration": "8 seconds",
  "imagePrompt": "...",
  "imageContinuityNote": "المشهد الختامي للدرس: احتفال بإتمام رحلة التعلم مع رسوم النجوم الذهبية وتوديع المعلمة للأبطال وتشويقهم للحلقة القادمة...",
  "startContinuity": "تبدأ المعلمة بالابتسام والتلويح بعد انتهاء الشرح العلمي...",
  "scene": "...",
  "character": "...",
  "action": "...",
  "camera": "...",
  "dialogue": "...",
  "audio": "...",
  "endContinuity": "تلوح المعلمة وتبتسم في ختام الفيديو النهائي للدرس.",
  "continuityToNext": "نهاية الحلقة والدرس بالكامل."
}`;

    const fallbackModels = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-3.8-flash"
    ];

    let retries = 5;
    let parsed: any = null;

    while (retries > 0) {
      try {
        const modelName = fallbackModels[5 - retries] || fallbackModels[0];
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        });

        const text = result.response.text();
        let rawJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const firstBrace = rawJson.indexOf("{");
        const lastBrace = rawJson.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          rawJson = rawJson.substring(firstBrace, lastBrace + 1);
        }
        parsed = JSON.parse(rawJson);
        break;
      } catch (e: any) {
        retries--;
        if (retries === 0) throw e;
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    if (!parsed) {
      return NextResponse.json({ error: "Failed to generate outro" }, { status: 500 });
    }

    const fullText = 
      "══════════════════════════════════════════════════\n" +
      "🎬 VIDEO " + String(parsed.videoNumber).padStart(2, "0") + " - PAGE " + parsed.pageNumber + " - " + parsed.partName + "\n" +
      "⏱️ Duration: " + parsed.duration + "\n" +
      "══════════════════════════════════════════════════\n\n" +
      "🖼️ [1. IMAGE GENERATION PROMPT (الصورة المرجعية)]:\n" +
      parsed.imagePrompt + "\n\n" +
      (parsed.imageContinuityNote ? "🔗 [ملاحظة الترابط والتسلسل]: " + parsed.imageContinuityNote + "\n\n" : "") +
      "🎥 [2. IMAGE-TO-VIDEO MOTION PROMPT (تحريك الصورة)]:\n" +
      "SCENE:\n" + parsed.scene + "\n\n" +
      "CHARACTER / SUBJECT:\n" + parsed.character + "\n\n" +
      "ACTION & MOTION:\n" + parsed.action + "\n\n" +
      "CAMERA MOVEMENT:\n" + parsed.camera + "\n\n" +
      "DIALOGUE & VOICEOVER:\n" + parsed.dialogue + "\n\n" +
      "AUDIO & SFX:\n" + parsed.audio + "\n\n" +
      "END STATE (نهاية الدرس):\n" + parsed.endContinuity;

    return NextResponse.json({ prompt: { ...parsed, fullText } });

  } catch (error: any) {
    console.error("Error generating outro prompt:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
