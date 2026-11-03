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
    } else if (mode === "paired" || mode === "paired_no_teacher") {
      modeInstructions = 
"- **الهدف:** بناء سلسلة علمية مترابطة خطوة بخطوة (رحلة بصرية حية). كل مشهد يشرح مرحلة دقيقة متسلسلة بدون اختصار.\n" +
"- **الفهم الأوتوماتيكي الدقيق لموضوع الدرس:** حدد بدقة ما إذا كان الدرس يتحدث عن (نباتات / جسم إنسان / فضاء / كيمياء / حيوانات / طاقة). واجعل تقسيم المشاهد يتبع هذا الموضوع العلمي بدقة تامة.\n" +
"- **لا تختصر أبداً:** قسم كل فكرة إلى خطوة واضحة مبسطة للأطفال.\n";
    }
    modeInstructions += "\n- **التقسيم الإجباري والمفصل:** إياك أن تختصر! قسّم كل صفحة من ملف الـ PDF إلى 4 أو 5 أجزاء (مشاهد) على الأقل. لا تقم بدمج الأفكار الكثيرة في مشهد واحد طويل أبداً. كل معلومة صغيرة يجب أن تكون في مشهد مستقل.\n- ترتيب الصفحات: ممنوع تخطي أي صفحة من الصفحات الموجودة. تأكد من المرور على كل الصفحات بالترتيب.";

    const prompt = 
"أنت خبير في تحليل المحتوى التعليمي للأطفال.\n" +
"مهمتك: قراءة ملف الـ PDF وفهم موضوع الدرس أوتوماتيكياً بدقة متناهية، وتحويله إلى خريطة محتوى مقسمة، **واستخراج الموضوع العلمي، والمجسم البصري المناسب، وملابس المعلمة والشخصية الكرتونية**.\n" +
"التعليمات:\n" +
"1. فهم موضوع الدرس أوتوماتيكياً (lessonTopic & subjectDomain): حدد بدقة موضوع الدرس الحقيقي من الملف (مثلاً: أجزاء النبات وعملية البناء الضوئي، أو الجهاز البولي للإنسان، أو دورة الصخور)، والمجال العلمي (botany, human_anatomy, space, animals, physics, chemistry).\n" +
"2. المجسم البصري الأساسي (primaryVisualAnchor): اكتب وصفاً بالإنجليزية لمجسم 3D Pixar رئيسي يطابق موضوع الدرس بدقة (مثلاً لو نبات: A beautiful 3D Pixar stylized plant with roots in transparent soil, sturdy green stem, and lush leaves with glowing veins. يُمنع منعاً باتاً وصف جسم إنسان إذا كان الدرس عن النباتات!).\n" +
"3. قسّم المحتوى إلى فقرات مفصلة جداً وكثيرة. كل فقرة ستكون عبارة عن فيديو مدته 10 ثوانٍ فقط.\n" +
"4. صف فقط ملابس المعلمة (teacherOutfit) بحيث تكون ملابس بناتي جميلة جداً وأنيقة بألوان (بينك، موف، أو ألوان فاتحة كيوت). ليس شرطاً أن تكون رسمية بليزرات، المهم أن تكون أنيقة ومناسبة ولذيذة (مثل: a beautiful pastel pink cardigan over a white blouse). لا تكتب أي وصف لملامحها أو شعرها، اكتب فقط الملابس!\n" +
"5. ابتكر شخصية كرتونية (cartoonCharacter) تناسب الموضوع علمياً (مثلاً في درس النبات: نبتة صغيرة أو ورقة شجر متكلمة كيوت؛ في درس الفضاء: كائن فضائي لطيف).\n\n" +
"قواعد هامة جدا:\n" +
modeInstructions + "\n" +
"- الشمولية والتفصيل هما الأولوية المطلقة! لا تتجاهل أي تفاصيل هامة، قم بعمل تقسيمات كثيرة جداً لكل صفحة بحيث لا يتم اختصار الدرس أبداً.\n\n" +
"يجب أن ترجع النتيجة كـ JSON كالتالي بالضبط:\n" +
"{\n" +
"  'lessonTopic': 'الموضوع العلمي الحقيقي للدرس (مثال: تركيب النبات وعملية البناء الضوئي)',\n" +
"  'subjectDomain': 'botany',\n" +
"  'primaryVisualAnchor': 'A beautiful adorable 3D Pixar stylized green plant with roots in transparent soil, sturdy stem, and lush leaves with glowing veins',\n" +
"  'teacherOutfit': 'a beautiful pastel pink cardigan over a white blouse',\n" +
"  'cartoonCharacter': 'A tiny cute round 3D Pixar-style green talking plant sprout with two big sparkling eyes and a tiny watering can',\n" +
"  'map': [\n" +
"    {\n" +
"      'pageNumber': 1,\n" +
"      'id': 'p1',\n" +
"      'title': 'عنوان الصفحة',\n" +
"      'contentSummary': 'ملخص الفكرة'\n" +
"    }\n" +
"  ]\n" +
"}".replace(/'/g, '"');

    let parsed: any;
    let retries = 6;
    while (retries > 0) {
      try {
        const result = await model.generateContent({
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
        
        const text = result.response.text();
        if (!text || text.trim() === "") {
            throw new Error("AI returned empty text");
        }

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
        let rawJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;

        try {
          parsed = JSON.parse(rawJson);
        } catch (e: any) {
          console.log("Analyze JSON truncated. Attempting aggressive recovery...");
          let recoveredStr = rawJson.trim();
          
          if (recoveredStr.endsWith('"')) {
            recoveredStr += '}';
          } else if (!recoveredStr.endsWith('}') && !recoveredStr.endsWith(']')) {
            recoveredStr = recoveredStr.replace(/,[^,]*$/, ''); 
            const openBrackets = (recoveredStr.match(/\[/g) || []).length;
            const closeBrackets = (recoveredStr.match(/\]/g) || []).length;
            const openBraces = (recoveredStr.match(/\{/g) || []).length;
            const closeBraces = (recoveredStr.match(/\}/g) || []).length;
            
            for (let i = 0; i < (openBraces - closeBraces); i++) recoveredStr += '}';
            for (let i = 0; i < (openBrackets - closeBrackets); i++) recoveredStr += ']';
            
            if (!recoveredStr.endsWith('}')) {
               recoveredStr += '}';
            }
          }
          parsed = JSON.parse(recoveredStr);
        }

        break;
      } catch (err: any) {
        retries--;
        if (retries === 0) throw err;
        const status = err.status || 500;
        if (status === 429) {
          console.log("Analyze: 429 Rate Limit hit, waiting 60s... " + retries + " attempts left.");
          await new Promise(resolve => setTimeout(resolve, 60000));
        } else {
          console.log("Analyze: " + status + " or parse error caught, waiting 15s... " + retries + " attempts left.");
          await new Promise(resolve => setTimeout(resolve, 15000));
        }
      }
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Error analyzing PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
