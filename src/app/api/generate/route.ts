import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const contentMapStr = formData.get("contentMap") as string;
    let characterConfigStr = formData.get("characterConfig") as string;
    const configObj = JSON.parse(characterConfigStr);
    
    const videoMode = formData.get("mode") as string || "cartoon";
    
    characterConfigStr += "- **جمل كاملة ومغلقة (ممنوع قطع الكلام):** كل مشهد (فيديو) مدته 10 ثوانٍ يجب أن يحتوي على فكرة كاملة وجملة مغلقة تماماً! يُمنع منعاً باتاً قطع جملة في منتصفها لتكملتها في الفيديو التالي. يجب أن ينتهي كلام الشخصية بنهاية المشهد.\n";
    characterConfigStr += "- **حوار متبادل وليس تكملة كلام:** هذا حوار تفاعلي (سؤال وجواب أو شرح وتعقيب) بين المعلمة والكرتون. المعلمة تقول جملتها كاملة في مشهدها، والكرتون يرد بجملته كاملة في مشهده. لا تجعلهما يكملان كلام بعضهما أبداً!\n";
    characterConfigStr += "- **التطابق البصري المطلق (قاعدة صارمة جداً):** أنت الآن تكتب مشاهد لفيديو واحد متصل. لذلك يجب أن تختار ملابس محددة بدقة للمعلمة (مثلاً: purple blazer over a white shirt) وأن تختار شخصية كرتونية واحدة محددة (مثلاً: a cute tiny blue robot) وتستخدم نفس الوصف بالحرف الواحد في خانة الـ Character والـ Scene في **جميع المشاهد** بلا استثناء. يُمنع منعاً باتاً تغيير ملابس المعلمة أو تغيير الكائن الكرتوني بين الفيديوهات!\n";
    characterConfigStr += "- **طول الحوار (لضبط الـ 10 ثواني بدون أن يُقطع):** لضمان اكتمال الكلام تماماً قبل نهاية الفيديو الـ 10 ثواني، اجعل الحوار من **20 إلى 22 كلمة فقط** في المشهد الواحد! يُمنع منعاً باتاً أن تتخطى 22 كلمة لكي لا تُقطع الكلمة الأخيرة.\n";
    characterConfigStr += "- **النهايات السينمائية والقطع الثابت (ممنوع الدوران نهائياً):** في خانة الـ END للـ ACTION، يُمنع منعاً باتاً كتابة أن الشخصية تستدير أو تلف جسمها أو أن الكاميرا تتحرك (No spinning, turning around, or camera panning)! بدلاً من ذلك اكتب: (The character finishes speaking and maintains a natural pose for the final second, creating a seamless point for a hard camera cut). القطع بين الزوايا سيتم في المونتاج، لذلك إياك أن تحرك الكاميرا أو تلف جسم الشخصيات.\n" + 
                          "  2. إذا كان المشهد يحتوي على شخصيتين (المعلمة والكرتون)، والشخصية (أ) تتحدث، فيجب أن تكتب صراحة بالإنجليزية في الـ ACTION أن الشخصية (ب) فمها مغلق تماماً وصامتة: (The other character is completely silent, mouth is firmly closed, just listening).\n";
    characterConfigStr += "- **الصوت بدون موسيقى في البداية (AUDIO):** في خانة الـ AUDIO، اكتب بوضوح: (Voice starts immediately at 0:00. NO intro music at all. Just clean voice and very low background music).\n";
    characterConfigStr += "- **سلاسة اللغة وسرعتها للأطفال (مهم جداً):** الحوار يجب أن يكون سريعاً، حيوياً جداً، وفي غاية السهولة والانسيابية ليناسب الأطفال. تحدث بأسلوب دافئ ومترابط (مثل: أهلاً بيكم يا أبطالي.. تفتكروا النبات بيعمل إيه عشان يعيش في البرد؟). لا تستخدم مصطلحات معقدة (مثل: لضمان استمرار حياته) بل استخدم كلمات سهلة جداً (عشان يعيش). إياك أن تكتب كلاماً غير مفهوم أو ملصوقاً ببعضه بشكل غريب! السرعة والحيوية والسهولة هم الأساس.\n";
    if (videoMode === "cartoon") {
      characterConfigStr += "- **التطابق البصري (عالم الكرتون فقط - ممنوع وجود بشر):** إياك أن تذكر المعلمة رحاب أو أي إنسان بشري في هذا الوضع! هذا العالم كرتوني 100%. الشخصية الأولى هي الكرتون الثابت: (" + (configObj.cartoonCharacter || "A tiny round blue alien with exactly three green spots on its forehead, wearing oversized yellow steampunk goggles, large black eyes, and a small red scarf") + "). والشخصية الثانية هي شخصية كرتونية مضحكة من ابتكارك (تلعب دور الصديق الفضولي). اكتب وصف الشخصيتين معاً في خانة الـ (character) في كل المشاهد بلا استثناء! واكتب في النهاية: (Same exact character designs and proportions as the previous scene).\\n";
    } else {
      characterConfigStr += "- **التطابق البصري المطلق (إجباري لمنع ظهور شخصيات عشوائية كالأطفال):** لكي لا ينسى برنامج الفيديو شكل الشخصيات ويخترع أشخاصاً عشوائيين، **يجب عليك دمج وصف المعلمة رحاب ووصف الكرتون معاً ولصقهما بالكامل داخل خانة الـ (character) في كل المشاهد بلا استثناء!** (سواء كان المشهد يركز على المعلمة أو الكرتون). استخدم دائماً هذا الوصف الموحد والثابت للكرتون: (" + (configObj.cartoonCharacter || "A tiny round blue alien with exactly three green spots on its forehead, wearing oversized yellow steampunk goggles, large black eyes, and a small red scarf") + "). واكتب في النهاية: (Same exact character designs and proportions as the previous scene).\\n";
    }
    characterConfigStr += "- **السر السحري لتطابق الشفاه (قاعدة إجبارية):** في خانة الـ Action لأي شخصية تتحدث، يجب أن تكتب دائماً وبنص العبارة: (Speaking clearly, mouth is moving naturally in perfect sync). هذا ما يضمن نجاح الفيديو!\n";
    characterConfigStr += "- **الشاشات التعليمية والإظهار البصري (إجباري جداً وممنوع النصوص):** أي شيء تقوله المعلمة أو الكرتون يجب أن يظهر أمامهما فوراً على شاشة ذكية مضيئة (Glowing smart screen). **ممنوع منعاً باتاً ظهور أي نصوص أو كلمات مكتوبة على الشاشة!** (برامج الفيديو ستكتبها كطلاسم غير مفهومة). بدلاً من ذلك، يجب أن تعرض الشاشة **فيديو متحرك ومشاهد حية** (Animated video footage playing on the screen showing...). يجب أن تصف في الـ Action لقطات الفيديو التي تُعرض على الشاشة، وتكون مطابقة 100% لكلامهم.\n";

    if (videoMode === "cartoon") {
      characterConfigStr += "\n- **أسلوب فيلم كرتوني (حوار تفاعلي):** المشهد عبارة عن حوار تفاعلي متبادل بين الشخصيتين الكرتونيتين فقط. يفهمون بعضهم البعض، أحدهما يشرح والآخر يسأل أو يندهش.\n" +
      "- **المكان (Scene):** A magical, vibrant, and highly detailed 3D Pixar-style animated world suitable for the topic. In the background, there is a glowing neon sign displaying the exact typographic text \"Sci.Rehab Elsibai\". The words \"Sci.Rehab Elsibai\" must be spelled perfectly. No human elements, just pure cartoon fantasy.\n" +
      "- **أسلوب يوتيوب الكوميدي والحماسي:** إيقاع مجنون وسريع. استخدم المقاطعات الكوميدية والمفاجآت. اجعل المشاهد يضحك ويندهش!\n" +
      "- **اللهجة (عامية مصرية كوميدية):** عامية مصرية قحة مليئة بالإيفيهات والمصطلحات الدارجة للأطفال.\n" +
      "- **منع تداخل الأصوات (فصل الحوار):** اكتب حوار متحدث واحد فقط في المشهد الواحد. لا تدمج شخصيتين في نفس المشهد. اجعلهما يتبادلان المشاهد (مشهد للأول ثم مشهد للثاني).\n" +
      "- **حركة الكاميرا والإخراج:** في خانة (camera) يجب أن تكتب: (Medium close-up focusing on the speaking character, highly expressive face and gestures). وفي المشاهد الزوجية قم بالتركيز على الشخصية الثانية.\n";
    } else if (videoMode === "teacher") {
      characterConfigStr += "\n- **أسلوب المعلمة الاحترافية:** المتحدثة في كل الفيديوهات هي 'المعلمة رحاب'. تتحدث بلغة واضحة، لذيذة جداً، ومحببة للأطفال.\n" +
      "- **مصطلحات ثابتة إجبارية:** عندما ترحب المعلمة بالأطفال أو تخاطبهم يجب أن تقول (يا أبطالي) ويُمنع منعاً باتاً استخدام كلمة (أصحابي).\n" +
      "- **وصف المشهد والشخصية (ثابت لا يتغير أبداً):** \n" +
      "  - **المكان (Scene):** A futuristic, bright, and engaging smart classroom with holographic educational displays, neon lights, and a huge interactive glowing smartboard. On the wall, there is a glowing neon sign displaying the exact typographic text \"Sci.Rehab Elsibai\". The words \"Sci.Rehab Elsibai\" must be spelled perfectly.\n" +
      "  - **الشخصية (Character):** A beautiful 20-25 years old 3D Pixar-style young female teacher with long wavy dark brown hair, big brown eyes, sitting on her chair behind the wooden desk, wearing " + (configObj.teacherOutfit || "a purple headband, a white silk blouse, and a sleek purple blazer") + ". (Maintain exact same character design and proportions as the previous scene).\n" +
      "- **اللهجة والمصطلحات (عامية مصرية قحة للأطفال):** يُمنع تماماً استخدام أي كلمات من الفصحى في الحوار! استخدم كلمات عامية مصرية يومية خفيفة جداً يفهمها الأطفال. مثلاً لا تقل (الجو بارد) بل قل (الجو ساقعة أو تلج).\n" +
      "- **الإظهار البصري:** يجب أن تذكر في الـ Action أن المعلمة تشرح على السبورة الذكية، وأن أي معلومة تقولها تظهر على السبورة بجانبها بوضوح.\n" +
      "- **حركة الكاميرا والإخراج:** (Medium close-up on the teacher. IMPORTANT: The teacher is facing the camera directly in a full frontal view so her lips are clearly visible to ensure perfect lip-sync. She is explaining engagingly while interacting with the smartboard).\n" +
      "- **خلو الحوار من الأقواس:** اكتب (المعلمة: ) متبوعاً بكلامها الصافي بدون أي وصف داخل الحوار.\n";
    } else if (videoMode === "review") {
      characterConfigStr += "\n- **أسلوب المراجعة الممتعة:** التركيز على استرجاع المعلومات. اطرح أسئلة ذكية ثم أجب عليها مع الشرح الوافي. أسلوب تفاعلي ولذيذ يربط المعلومات القديمة.\n" +
      "- **اللهجة:** عامية مصرية تفاعلية ومشوقة.\n" +
      "- **المكان (Scene):** A dynamic abstract educational studio. In the background, there is a glowing neon sign displaying the exact typographic text \"Sci.Rehab Elsibai\". The words \"Sci.Rehab Elsibai\" must be spelled perfectly.\n" +
      "- **حركة الكاميرا والإخراج:** (Dynamic camera focusing on the presenter and glowing floating UI elements showing the review points).\n" +
      "- **منع الأقواس في الحوار:** لكتابة اسم المتحدث استخدم اسمه فقط دون تفاصيل داخلية لتسهيل تحويل النص لصوت.\n";
    } else if (videoMode === "studio") {
      characterConfigStr += "\n- **وضع الاستوديو المتبادل (الاحترافي):** يعتمد على تبادل المشاهد بين 'المعلمة رحاب' و 'شخصية كرتونية مرحة'. الكرتون يسأل بفضول والمعلمة تجاوب، أو العكس، بحوار ممتع جداً للأطفال.\n" +
      "- **مصطلحات ثابتة إجبارية:** عندما تخاطب المعلمة الكرتون أو الأطفال تقول (يا أبطالي) وممنوع قول (أصحابي). وعندما تتحدث الشخصية الكرتونية مع المعلمة أو تناديها يجب أن تقول دائماً (يا مس رحاب).\n" +
      "- **وصف الاستوديو الثابت للمعلمة والكرتون (صورة ثابتة وجميلة جداً):** \n" +
      "  - **المكان:** A beautiful modern podcast studio. Neon purple lighting. A glowing neon sign displaying the exact typographic text \"Sci.Rehab Elsibai\". The words \"Sci.Rehab Elsibai\" must be spelled perfectly. Bookshelves with trailing plants. A wooden desk in the foreground clearly displaying a professional podcast microphone and an open laptop. **A tiny cute cartoon character is standing ON the desk next to the laptop, looking at the teacher.**\n" +
      "  - **الشخصية:** A beautiful 20-25 years old 3D Pixar-style young female teacher with long wavy dark brown hair, big brown eyes, sitting on her chair behind the wooden desk, wearing " + (configObj.teacherOutfit || "a purple headband, a white silk blouse, and a sleek purple blazer") + ". (Maintain exact same character design and proportions as the previous scene).\n" +
      "- **الشخصية الكرتونية وتشبيهاتها الكوميدية (هام جداً):** ابتكر شخصية كرتونية خيالية صغيرة تقف على المكتب. عندما تشارك هذه الشخصية في الحوار، يجب أن تعلق وتربط الموضوع العلمي دائماً بـ (طبيعة الإنسان وعاداته اليومية) بطريقة كوميدية ومضحكة! تطلب من المعلمة أن تفكر كإنسان وتقول مثلاً: (إحنا كبشر بنعمل كذا.. طب تفتكري الحاجة دي بيحصل فيها إيه؟)، وتستخدم تشبيهات مضحكة من حياتنا اليومية لتبسيط المعلومة بطريقة ذكية وفكاهية.\n" +
      "- **توزيع المشاهد (متحدث واحد فقط في كل فيديو) ونظرات الكاميرا والشاشة:** \n" +
      "  - المشهد الفردي (1, 3, 5): هذا الفيديو مخصص **للمعلمة فقط**. الكاميرا: (Medium shot of the teacher. IMPORTANT for lip-sync: The teacher is facing the camera directly in a full frontal view. Her face and lips must be clearly visible from the front to ensure perfect lip-sync. The teacher is seated on the LEFT side of the frame, and a HUGE glowing smart screen is on the RIGHT side of the frame, completely unobstructed by her body. The screen is playing a vivid animated video of exactly what she is saying right now, absolutely NO TEXT on screen). **ولحل مشكلة ظهور وجه الكرتون وسرقة الشفاه، اكتب صراحة وبقوة في وصف هذا المشهد أن الكرتون يعطي ظهره بالكامل للكاميرا ولا يظهر وجهه أبداً: (The tiny cartoon character is standing on the desk in the foreground with its BACK TURNED to the camera. IMPORTANT: 100% BACK VIEW ONLY. NO FACE, NO EYES, NO MOUTH visible. We only see the back of its head).** في هذا المشهد اكتب حواراً للمعلمة فقط لا غير.\n" +
      "  - المشهد الزوجي (2, 4, 6): هذا الفيديو مخصص **للكرتون فقط**. الكاميرا: (Cinematic Over-The-Shoulder shot from behind the teacher's right shoulder. The teacher is slightly out of focus in the foreground on the left side of the frame, showing only the back of her shoulder and hair. Her face is completely hidden. The camera focuses sharply on the tiny animated cartoon character on the desk in the background, who is facing the camera and talking. A HUGE glowing smart screen is clearly visible in the background playing an animated video of exactly what he is saying right now, NO TEXT). في هذا المشهد اكتب حواراً للكرتون فقط لا غير. المعلمة صامتة وتستمع فقط. يُمنع كتابة أي حوار للمعلمة هنا.\n" +
      "- استمر في هذا التبادل الصارم (فيديو للمعلمة -> فيديو للكرتون -> فيديو للمعلمة -> فيديو للكرتون).\n" +
      "- **اللهجة والمصطلحات (عامية مصرية قحة للأطفال):** يُمنع تماماً استخدام أي كلمات من الفصحى في الحوار! استخدم كلمات عامية مصرية يومية خفيفة جداً يفهمها الأطفال. مثلاً لا تقل (الجو بارد أو شديد البرودة) بل قل (الجو ساقعة أو تلج)، ولا تقل (ماذا يحدث) بل قل (إيه اللي بيحصل). تحدثوا كأنهم أطفال مصريين في الشارع أو المدرسة.\n" +
      "- **قاعدة الحوار الثابتة وممنوع الترحيب المتكرر:** الحوار يُكتب لمتحدث واحد فقط في المشهد الواحد. اكتب اسم المتحدث نقطتين ثم كلامه. يُمنع دمج شخصيتين في حوار واحد. وملاحظة هامة جداً: **يُمنع الترحيب (أهلاً بيكم يا أبطالي) إلا في المشهد الأول فقط من الدرس، وفي باقي المشاهد ادخلوا في صلب الشرح فوراً.**\n";
    }

    characterConfigStr += "\n- **ممنوع الوداع نهائياً في الحوار:** يُمنع منعاً باتاً توديع المشاهدين (مثل: مع السلامة) في أي مشهد. نحن سنقوم بإضافة الوداع برمجياً في النهاية.";
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 });

    const contentMap = JSON.parse(contentMapStr);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const chunk = contentMap;
    const startIndex = parseInt(formData.get("startIndex") as string || "1");
    const lastContext = formData.get("lastContext") as string || "";
    let videoCounter = startIndex;

    const prompt = 
"أنت مخرج ذكي يكتب Prompts للفيديوهات التعليمية باستخدام الذكاء الاصطناعي.\n" +
"الرجاء استخراج مشاهد للفيديوهات بناءً على الخريطة التالية:\n" +
JSON.stringify(chunk, null, 2) + "\n\n" +
"إعدادات الشخصية والأسلوب:\n" +
characterConfigStr + "\n\n" +
(lastContext ? "معلومات هامة جداً عن نهاية المشهد السابق لكي يكتمل عليه المشهد الحالي:\n" + lastContext + "\n\n" : "") +
"المطلوب:\n" +
"بناء Prompts إبداعية للذكاء الاصطناعي لتوليد الفيديو.\n" +
"كل مشهد فيديو يجب أن يكون ممتعاً. **قم بتوليد أقل عدد ممكن من المشاهد يكفي لشرح المعلومات المتوفرة فقط دون اختصار ودون تكرار.** إذا كانت المعلومات في النص قليلة، فيكفي مشهد واحد أو مشهدين. يُمنع منعاً باتاً زيادة عدد المشاهد أو تكرار الكلام لمجرد الإطالة! اشرح الموجود فقط.\n" +
"الترقيم يبدأ من " + videoCounter + ".\n" +
"- مدة كل فيديو: 10 ثوانٍ بالضبط.\n" +
"تعليمات هامة جداً لنجاح الفيديو واحترافيته:\n" +
"1. لمنع (القطعة أو القفزة) بين المشاهد: يجب أن يكون وصف الكاميرا والمكان متصلاً تماماً وبسلاسة بالمشهد السابق (Seamless transition). يجب أن يبدأ المشهد الجديد من نفس الزاوية التي انتهى بها السابق بدون أي انتقال مفاجئ.\n" +
"2. لمنع حركة الفك العشوائية (Lip-sync bleeding): في خانة الـ action، يجب أن توضح بدقة صارمة من يتحدث ومن يستمع. مثال: (الشخصية 'أ' تتحدث وتحرك فمها، بينما الشخصية 'ب' تقف ثابتة في مكانها تستمع وفمها مغلق تماماً بدون أي حركة). يجب التأكيد على إغلاق فم الشخصية المستمعة وعدم تداخل الشخصيات.\n" +
"3. لمنع كلام شخصيتين في نفس الوقت: في خانة الـ camera، عندما تتحدث شخصية معينة، اجعل الكاميرا تقترب منها (Close-up on speaker) لكي تظهر هي فقط بوضوح وهي تتحدث، مما يمنع البرنامج من تحريك فم شخصية أخرى بالخطأ.\n" +
"4. **لغة الإخراج وأسلوب الرسم (مهم جداً جداً):** برامج توليد الفيديو أجنبية ولا تفهم الأسلوب الفني إلا بالإنجليزية. لذلك يجب كتابة الوصف في خانات (scene, character, action, camera) باللغة الإنجليزية! ويجب أن تبدأ وصف الشخصية والمكان دائماً بهذه الكلمات: (3D Animation Pixar/Disney Style, cute stylized cartoon character, NOT real humans) لكي لا يولد صوراً لأشخاص حقيقيين أبداً.\n" +
"يجب أن تكون المخرجات بصيغة JSON صالح (Valid JSON) فقط وبدون أي نصوص إضافية خارج المصفوفة:\n" +
"تحذير صارم جداً: تأكد من إغلاق جميع الأقواس } و ] بشكل صحيح، ولا تترك أي فواصل زائدة (Trailing commas) في نهاية المصفوفة أو الكائنات لكي لا يتعطل النظام.\n" +
"[\n" +
"  {\n" +
"    \"id\": \"unique-id\",\n" +
"    \"videoNumber\": " + videoCounter + ",\n" +
"    \"pageNumber\": 1,\n" +
"    \"partName\": \"عنوان\",\n" +
"    \"duration\": \"10 seconds\",\n" +
"    \"startContinuity\": \"كيف بدأ\",\n" +
"    \"scene\": \"المشهد\",\n" +
"    \"character\": \"الشخصيات\",\n" +
"    \"action\": \"الحركة\",\n" +
"    \"camera\": \"الكاميرا\",\n" +
"    \"dialogue\": \"[اسم الشخصية الأولى]: كلامها\\n[اسم الشخصية الثانية]: كلامها\\n[اسم الشخصية الثالثة]: كلامها (يجب فصل كلام كل شخصية بـ \\\\n)\",\n" +
"    \"audio\": \"الصوت\",\n" +
"    \"endContinuity\": \"كيف انتهى\",\n" +
"    \"continuityToNext\": \"لربط المشهد القادم\"\n" +
"  }\n" +
"]";

    let parsed: any[] = [];
    let retries = 3;
    
    while (retries > 0) {
      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 8192,
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        });
        
        let text = result.response.text();
        if (!text || text.trim() === "") {
          throw new Error("AI returned empty text");
        }

        let rawJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();

        // If the AI outputted something before the JSON array, like "Here are your prompts: [...]"
        if (!rawJson.startsWith("[") && rawJson.includes("[")) {
            rawJson = rawJson.substring(rawJson.indexOf("["));
        }
        if (!rawJson.endsWith("]") && rawJson.lastIndexOf("]") !== -1) {
            rawJson = rawJson.substring(0, rawJson.lastIndexOf("]") + 1);
        }

        try {
          parsed = JSON.parse(rawJson);
        } catch (e: any) {
          console.log("Generate JSON truncated or invalid. Attempting recovery...");
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
        
        if (!Array.isArray(parsed)) {
            parsed = [parsed];
        }
        
        // Successfully parsed
        break; 

      } catch (e: any) {
        retries--;
        if (retries === 0) {
            console.error("Failed to generate/parse JSON after all retries. Last error:", e);
            throw e;
        }
        const status = e.status || e.response?.status || 500;
        if (status === 429) {
          console.log("Generate: 429 Rate Limit hit, waiting 30s... " + retries + " attempts left.");
          await new Promise(resolve => setTimeout(resolve, 30000));
        } else {
          console.log("Generate: " + status + " or parse error caught, waiting 15s... " + retries + " attempts left. Error:", e.message);
          await new Promise(resolve => setTimeout(resolve, 15000));
        }
      }
    }

    if (!Array.isArray(parsed)) parsed = [];

    const enhancedPrompts = parsed.map((p: any, index: number) => {
      if (configObj.movieMode && configObj.isFinalScene && index === parsed.length - 1) {
        p.dialogue += "\n[الشخصيات بصوت واحد]: وبكده خلصنا درس النهاردة، مع السلامة يا أصحابي!";
      }

      const fullText = 
        "VIDEO " + String(p.videoNumber).padStart(2, "0") + " - PAGE " + p.pageNumber + " - " + p.partName + "\n" +
        "Duration: " + p.duration + "\n\n" +
        "START:\n" + p.startContinuity + "\n\n" +
        "SCENE:\n" + p.scene + "\n\n" +
        "CHARACTER:\n" + p.character + "\n\n" +
        "ACTION:\n" + p.action + "\n\n" +
        "CAMERA:\n" + p.camera + "\n\n" +
        "DIALOGUE:\n" + p.dialogue + "\n\n" +
        "AUDIO:\n" + p.audio + "\n\n" +
        "END:\n" + p.endContinuity + "\n\n" +
        p.continuityToNext;

      return { ...p, fullText };
    });

    return NextResponse.json({ prompts: enhancedPrompts });

  } catch (error: any) {
    console.error("Error generating prompts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
