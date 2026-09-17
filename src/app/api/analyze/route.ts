import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("No Gemini API key found.");
      return NextResponse.json({ error: "No API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const mode = formData.get("mode") as string || "cartoon";
    
    let modeInstructions = "";
    if (mode === "cartoon") {
      modeInstructions = 
"- **الهدف:** شرح تفصيلي دقيق لكل حرف في الصفحة في قالب فيلم كرتوني يوتيوب كوميدي ومجنون للأطفال.\n" +
"- **الترابط القصصي والكوميدي (هام جداً):** لا تقم بتقسيم الصفحة إلى (نقاط) أو (عناوين) منفصلة ومملة! بل قسمها إلى مواقف كوميدية متسلسلة، أو ألغاز ممتعة بين الشخصيات الكرتونية المبتكرة.\n" +
"- **لا تختصر أبداً:** يُمنع منعاً باتاً اختصار أي معلومة! يجب تقسيم القصة إلى أجزاء صغيرة تغطي كل التفاصيل (السبب والنتيجة).\n";
    } else if (mode === "teacher") {
      modeInstructions = 
"- **الهدف:** شرح تفصيلي واحترافي من معلمة شابة ولطيفة (20-25 سنة) تشرح المعلومات بعمق على سبورتها الذكية.\n" +
"- **البناء المنطقي التعليمي:** قم بتقسيم الصفحة إلى خطوات منطقية متسلسلة. كل مشهد يركز على معلومة تشرحها المعلمة بأسلوب طفولي لذيذ ومبسط، مع توضيح أن الشرح يظهر على السبورة بجانبها.\n" +
"- **لا تختصر أبداً:** يجب شرح كل صغيرة وكبيرة في النص وعدم تخطي أي معلومة.\n";
    } else if (mode === "review") {
      modeInstructions = 
"- **الهدف:** مراجعة تفاعلية ولذيذة لوحدة كاملة، مع التأكيد على استرجاع المعلومات بتفصيل شديد.\n" +
"- **الترابط التفاعلي:** قسم الصفحة إلى مشاهد تعتمد على الاسترجاع والتذكير. اذكر المعلومة واشرح لماذا حدثت. لا تسرد النقاط بملل، بل اجعلها تبدو وكأننا نربط الخيوط معاً.\n" +
"- **لا تختصر أبداً:** رغم أنها مراجعة، إلا أنه يُمنع الاختصار المخل. يجب مراجعة كل النقاط المذكورة في النص.\n";
    } else if (mode === "studio") {
      modeInstructions = 
"- **الهدف:** بناء حوار احترافي متبادل وممتع جداً بين (المعلمة رحاب في الاستوديو) و(شخصية كرتونية تلعب دور الطالب) لشرح النص بالتفصيل.\n" +
"- **التناوب الثنائي وحيوية الحوار:** قسم الصفحة بحيث يتناوبان الحديث. الطالب الكرتوني يطرح أسئلة بفضول، والمعلمة تجيب وتشرح بطريقة مبسطة ولذيذة للأطفال، أو المعلمة تسأله وهو يختبر ذكاءه ويرد. يجب أن يكون الحوار تفاعلياً، مرحاً، وبنبرة مريحة جداً تناسب الأطفال.\n" +
"- **لا تختصر أبداً:** الحوار المتبادل يجب أن يغطي كل تفاصيل النص دون استثناء أي حرف.\n";
    }

    modeInstructions += "\n- **العدد حسب الحاجة:** قم بتقسيم الصفحة إلى عدد مشاهد يكفي لشرح القصة كاملة دون اختصار (مشهد، أو 5 أو 10 مشاهد). يُمنع زيادة المشاهد إذا كانت المعلومات قليلة لمنع التكرار.\n- تخطي الصفحات: ممنوع تخطي أي صفحة من الصفحات المحددة. يجب أن تمر على كل الصفحات.";

    const prompt = 
"أنت خبير في تحليل المحتوى التعليمي للأطفال.\n" +
"مهمتك: قراءة ملف الـ PDF وتحليله إلى خريطة محتوى ممتازة.\n" +
"المطلوب:\n" +
"1. تقسيم المحتوى إلى أجزاء.\n" +
"2. كل جزء سيكون عبارة عن فيديو مدته 10 ثوان فقط.\n\n" +
"قواعد هامة جدا:\n" +
modeInstructions + "\n" +
"- الأولوية هي الشمولية ولكن بذكاء واختصار مفيد لا يخل بالمعنى، لضمان استكمال الملف كله في رد واحد.\n" +
"- صيغة الإخراج يجب أن يكون ردك عبارة عن مصفوفة JSON مسطحة فقط لا غير.\n\n" +
"أرجع النتيجة بصيغة JSON فقط بهذا الهيكل المبسط جدا لتوفير المساحة:\n" +
"[\n" +
"  {\n" +
"    'pageNumber': 1,\n" +
"    'id': 'p1',\n" +
"    'title': 'عنوان الصفحة',\n" +
"    'contentSummary': 'ملخص الفكرة'\n" +
"  }\n" +
"]".replace(/'/g, '"');

    let result;
    let retries = 6;
    while (retries > 0) {
      try {
        result = await model.generateContent({
          contents: [{ role: "user", parts: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType: "application/pdf" } }
          ]}],
          generationConfig: {
            maxOutputTokens: 8192,
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        });
        break;
      } catch (err: any) {
        retries--;
        if (retries === 0) throw err;
        const status = err.status || 500;
        if (status === 429) {
          console.log("Analyze: 429 Rate Limit hit, waiting 60s... " + retries + " attempts left.");
          await new Promise(resolve => setTimeout(resolve, 60000));
        } else {
          console.log("Analyze: " + status + " error caught, waiting 15s... " + retries + " attempts left.");
          await new Promise(resolve => setTimeout(resolve, 15000));
        }
      }
    }

    const text = result!.response.text();
    const jsonMatch = text.match(/`json\n([\s\S]*?)\n`/) || text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json({ map: parsed });
    } else {
      const parsed = JSON.parse(text);
      return NextResponse.json({ map: parsed });
    }

  } catch (error: any) {
    console.error("Error analyzing PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
