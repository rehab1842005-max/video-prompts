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
    characterConfigStr += "- **حوار متبادل وليس تكملة كلام:** هذا حوار تفاعلي (سؤال وجواب أو شرح وتعقيب) بين الشخصيات. الشخصية الأولى تقول جملتها كاملة في مشهدها، والشخصية الثانية ترد بجملتها كاملة في مشهدها. لا تجعلهما يكملان كلام بعضهما أبداً!\n";
    characterConfigStr += "- **التطابق البصري المطلق (قاعدة صارمة جداً):** أنت الآن تكتب مشاهد لفيديو واحد متصل. لذلك يجب أن تحافظ على نفس الوصف الشكلي للشخصيات بالحرف الواحد في خانة الـ Character والـ Scene في **جميع المشاهد** بلا استثناء. يُمنع منعاً باتاً تغيير ملابس أو شكل الشخصيات بين الفيديوهات!\n";
    characterConfigStr += "- **طول الحوار (لضبط الـ 10 ثواني بدون أن يُقطع):** لضمان اكتمال الكلام تماماً قبل نهاية الفيديو الـ 10 ثواني، اجعل الحوار من **20 إلى 22 كلمة فقط** في المشهد الواحد! يُمنع منعاً باتاً أن تتخطى 22 كلمة لكي لا تُقطع الكلمة الأخيرة.\n";
    characterConfigStr += "- **النهايات السينمائية والقطع الثابت (ممنوع الدوران نهائياً):** في خانة الـ END للـ ACTION، يُمنع منعاً باتاً كتابة أن الشخصية تستدير أو تلف جسمها أو أن الكاميرا تتحرك (No spinning, turning around, or camera panning)! بدلاً من ذلك اكتب: (The character finishes speaking and maintains a natural pose for the final second, creating a seamless point for a hard camera cut). القطع بين الزوايا سيتم في المونتاج، لذلك إياك أن تحرك الكاميرا أو تلف جسم الشخصيات.\n" + 
                          "  2. إذا كان المشهد يحتوي على شخصيتين، والشخصية (أ) تتحدث، فيجب أن تكتب صراحة بالإنجليزية في الـ ACTION أن الشخصية (ب) فمها مغلق تماماً وصامتة: (The other character is completely silent, mouth is firmly closed, just listening).\n";
    characterConfigStr += "- **تخصيص الأصوات لكل شخصية (AUDIO):** في خانة الـ AUDIO، يجب أن تكتب وصفاً دقيقاً ومميزاً لصوت المتحدث لكي لا تتشابه الأصوات! مع الحفاظ دائماً على كتابة: (Voice starts immediately at 0:00. NO intro music at all. Just clean voice).\\n";
    characterConfigStr += "- **سلاسة اللغة، الكوميديا، والمعلومات الصريحة (مهم جداً جداً):**\n" + 
                          "  1. الحوار يجب أن يكون سريعاً، حيوياً جداً، وفي غاية السهولة والانسيابية ليناسب الأطفال.\n" +
                          (videoMode !== "story" ? "  2. **ممنوع الترحيب المتكرر:** قل (أهلاً بيكم يا أبطالي) في **المشهد الأول فقط لا غير!** يُمنع منعاً باتاً تكرار الترحيب في باقي المشاهد، ادخل في صلب الشرح فوراً.\n" : "") +
                          (videoMode !== "story" ? "  3. **الموازنة بين الكوميديا والعلم:** استخدم تشبيهات مضحكة جداً، ولكن **يجب ذكر المعلومة العلمية بشكل صريح ومباشر وواضح** لتصل للأطفال دون لبس. لا تجعل الكوميديا تطغى على وضوح المعلومة العلمية.\n" : "") +
                          "  4. **تطابق المتحدث مع الكاميرا (لمنع تبادل الأدوار):** الشخصية التي تتحدث في خانة (DIALOGUE) يجب أن تكون هي نفسها الشخصية التي تركز عليها (CAMERA) وهي نفسها المذكورة كمتحدث في (ACTION). لا تجعل الكاميرا تركز على شخصية بينما شخصية أخرى هي من تتحدث!\n" +
                          "  5. **التوزيع العادل للكلام (مهم جداً للاحترافية):** يجب أن يكون هناك توازن مثالي و\"عدل\" في مساحة الكلام بين الشخصيتين. لا تجعل شخصية تتحدث طوال الوقت والأخرى تقول كلمة واحدة. قسم الحوار بالتساوي التام بينهم.\n" +
                          "  6. **ضبط نطق الذكاء الاصطناعي للغة العربية (للتغلب على التلعثم):** برامج الصوت الأجنبية تخطئ وتتلعثم، لذلك يجب الالتزام الصارم بالآتي في الـ (DIALOGUE): أ) **يُمنع منعاً باتاً تكرار أي كلمة مرتين متتاليتين** (مثل: جداً جداً، أو يلا يلا) اكتبها مرة واحدة فقط لمنع التلعثم. ب) **اكتب الأرقام بالحروف دائماً** (مثل: خمسة بدلاً من 5). ج) **استخدم التشكيل (الفتحة، الضمة، الشدة)** لكي ينطقها البرنامج بشكل صحيح، **ولكن إياك أن تستخدم اللغة العربية الفصحى! حافظ على اللهجة العامية المصرية الشعبية الدارجة 100% مع وضع التشكيل عليها.** د) **استخدم الفواصل (،)** بكثرة لكي يأخذ المتحدث نفساً ولا يسرع في الكلام.\n" +
                          "  7. **متحدث واحد فقط (ممنوع المقاطعة):** يُمنع منعاً باتاً كتابة حوار لشخصيتين في نفس خانة الـ (DIALOGUE). المتحدث يُكمل جملته للنهاية بدون أي مقاطعة. إذا أردت للشخصية الأخرى أن ترد أو تقاطع، يجب أن يكون ذلك في المشهد (الفيديو) المنفصل الذي يليه.\n";
    if (videoMode === "cartoon") {
      characterConfigStr += "- **التطابق البصري (عالم الكرتون فقط - ممنوع وجود بشر):** إياك أن تذكر المعلمة رحاب أو أي إنسان بشري في هذا الوضع! هذا العالم كرتوني 100%. الشخصية الأولى هي الكرتون الثابت: (" + (configObj.cartoonCharacter || "A tiny round blue alien with exactly three green spots on its forehead, wearing oversized yellow steampunk goggles, large black eyes, and a small red scarf") + "). والشخصية الثانية هي شخصية كرتونية مضحكة من ابتكارك (تلعب دور الصديق الفضولي). اكتب وصف الشخصيتين معاً في خانة الـ (character) في كل المشاهد بلا استثناء! واكتب في النهاية: (Same exact character designs and proportions as the previous scene).\\n";
    } else if (videoMode !== "story") {
      characterConfigStr += "- **التطابق البصري المطلق (إجباري لمنع ظهور شخصيات عشوائية كالأطفال):** لكي لا ينسى برنامج الفيديو شكل الشخصيات ويخترع أشخاصاً عشوائيين، **يجب عليك دمج وصف المعلمة رحاب ووصف الكرتون معاً ولصقهما بالكامل داخل خانة الـ (character) في كل المشاهد بلا استثناء!** (سواء كان المشهد يركز على المعلمة أو الكرتون). استخدم دائماً هذا الوصف الموحد والثابت للكرتون: (" + (configObj.cartoonCharacter || "A tiny round blue alien with exactly three green spots on its forehead, wearing oversized yellow steampunk goggles, large black eyes, and a small red scarf") + "). واكتب في النهاية: (Same exact character designs and proportions as the previous scene).\\n";
    }
    characterConfigStr += "- **السر السحري لمنع تبادل الأدوار وتداخل الشفاه (قاعدة صارمة جداً):** برامج الفيديو تخطئ وتجعل الشخصية الخاطئة تتحدث! لمنع هذا، يجب أن تذكر **اسم/وصف الشخصية بالإنجليزية صراحة** في خانة الـ Action. مثلاً يجب أن تكتب: ([اسم المتحدث] is speaking clearly, mouth is moving naturally. The other character [اسم المستمع] is COMPLETELY SILENT, listening attentively, with their mouth FIRMLY CLOSED and lips sealed. ONLY [اسم المتحدث]'s mouth is moving). إياك أن تكتب Action عام بدون تحديد أسماء من يتحدث ومن يصمت!\n";
    if (videoMode !== "story") {
      characterConfigStr += "- **الشاشات الذكية والتمثيل المضحك (تجسيد الكلام كفيديو 100%):** أي شيء تقوله الشخصيات يجب أن يُعرض كفيديو حي على الشاشة! وإذا كانت الشخصية تقول تشبيهاً مضحكاً، يجب أن تمثله بجسدها وتعابير وجهها، ويُعرض هذا التشبيه كفيديو مضحك على الشاشة! يجب كتابة هذه العبارة بالنص في خانة الـ ACTION: (The smart screen is playing a vivid animated video showing EXACTLY what the character is saying/doing about: [اكتب هنا وصف بصري دقيق بالإنجليزية]. The screen displays ONLY pure visual images and animated pictures, absolutely NO text, NO letters, and NO words. The speaking character is actively ACTING OUT this metaphor with funny, highly expressive body language and hand gestures). هذا لضمان التمثيل المضحك ومنع تداخل النصوص.\n";
    }

    if (videoMode === "story") {
      characterConfigStr += "\n- **أسلوب فيلم ديزني (قصة وليس درس):** المشاهد يتفرج على فيلم كرتون به حبكة ودراما! الشخصيات تعيش في أزمة أو مشكلة حقيقية تهدد عالمهم. يتشاجرون أو يكتشفون سراً للنجاة. **يُمنع تماماً توجيه الحديث للمشاهد أو طرح أي أسئلة عليه.**\n" +
      "- **تحويل الدرس إلى استعارة سينمائية (Metaphor):** ممنوع ذكر المعلومات العلمية كنص مدرسي جاف! حوّل المعلومة إلى (أزمة درامية) في عالمهم. (مثلاً: بدلاً من سؤال \"ما هو العضو المسؤول عن تبادل الغازات؟\"، تجعل الشخصية تصرخ برعب: \"طريق الهوا مسدود فوق! مين اللي قفل الأبواب بيننا وبين المناخير؟!\").\n" +
      "- **المكان (Scene):** A beautiful 3D Pixar-style cinematic setting tailored EXACTLY to the lesson's topic. (e.g., if the lesson is about space, the setting is an alien planet. If it's biology, it's a magical forest or a giant cave). The scene changes dynamically based on the story. IMPORTANT: Do NOT include any smart screens, whiteboards, or laboratory/studio elements that make it look educational! It must look like a real movie world. However, the exact text \"Sci.Rehab Elsibai\" MUST be naturally integrated into the environment (e.g., carved into a magical tree, written on a spaceship console, glowing on a rock). The FULL text \"Sci.Rehab Elsibai\" must be perfectly spelled and COMPLETELY VISIBLE.\n" +
      "- **الشخصيات (أبطال الفيلم):** يُمنع تجسيد أعضاء الجسم أو الغازات! (ممنوع رئة ناطقة أو أكسجين ناطق). الشخصيات يجب أن تكون فقط: حيوانات غابة (كالماعز والثعلب والبومة)، أو كائنات فضائية، أو وحوش لطيفة. ابتكر 3 أنماط: (1) شخصية طيبة وحكيمة، (2) شخصية شريرة أو متهورة، (3) شخصية بريئة خائفة. هذا التناقض سيخلق الدراما الممتعة! اذكر وصفهم صراحة في الـ CHARACTER بدقة.\n" +
      "- **اللهجة والحوار (عامية مصرية درامية قحة):** الحوار عبارة عن (عتاب، توبيخ، أو خوف من الكارثة) وليس شرحاً هادئاً. (مثلاً: \"إنت خربت الدنيا\"، \"إحنا هنموت لو ده حصل\"). الحوار يجب أن يكون في قمة الإثارة بلهجة مصرية شعبية دارجة.\n" +
      "- **حركة الكاميرا والإخراج:** (Cinematic cuts, varying camera angles. Close-ups on characters' faces showing strong emotions like crying, anger, or whispering secrets. Dynamic and highly expressive movements).\n" +
      "- **هام للشفاه (ممنوع التداخل):** يجب أن تكتب اسم الشخصية المتحدثة بالإنجليزية وتأمر بأن باقي الشخصيات صامتة تماماً وفمها مغلق (The other characters are completely silent with mouths firmly closed).\n";
    } else if (videoMode === "cartoon") {
      characterConfigStr += "\n- **أسلوب فيلم كرتوني (حوار تفاعلي):** المشهد عبارة عن حوار تفاعلي متبادل بين الشخصيتين الكرتونيتين فقط. يفهمون بعضهم البعض، أحدهما يشرح والآخر يسأل أو يندهش.\n" +
      "- **المكان (Scene):** A magical, vibrant, and highly detailed 3D Pixar-style animated world suitable for the topic. In the background on the LEFT side of the frame, there is a HUGE cinematic glowing smart screen dominating the space to show educational videos, and a HUGE glowing neon sign displaying the exact typographic text \"Sci.Rehab Elsibai\". The FULL text \"Sci.Rehab Elsibai\" must be perfectly spelled and COMPLETELY VISIBLE without any missing words. Both cartoon characters are standing together on the RIGHT side of the frame, ensuring they NEVER block the huge smart screen. No human elements, just pure cartoon fantasy.\n" +
      "- **أسلوب يوتيوب الكوميدي والحماسي:** إيقاع مجنون وسريع. استخدم المقاطعات الكوميدية والمفاجآت. اجعل المشاهد يضحك ويندهش!\n" +
      "- **اللهجة (عامية مصرية كوميدية):** عامية مصرية قحة مليئة بالإيفيهات والمصطلحات الدارجة للأطفال.\n" +
      "- **منع تداخل الأصوات (فصل الحوار):** اكتب حوار متحدث واحد فقط في المشهد الواحد. لا تدمج شخصيتين في نفس المشهد. اجعلهما يتبادلان المشاهد (مشهد للأول ثم مشهد للثاني).\n" +
      "- **حركة الكاميرا والإخراج:** في خانة (camera) يجب أن تكتب: (Medium close-up focusing on the speaking character on the RIGHT side. The HUGE background smart screen on the LEFT side is completely visible and unobstructed). وفي المشاهد الزوجية قم بالتركيز على الشخصية الثانية بنفس الطريقة.\n";
    } else if (videoMode === "teacher") {
      characterConfigStr += "\n- **أسلوب المعلمة الاحترافية:** المتحدثة في كل الفيديوهات هي 'المعلمة رحاب'. تتحدث بلغة واضحة، لذيذة جداً، ومحببة للأطفال.\n" +
      "- **مصطلحات ثابتة إجبارية:** عندما ترحب المعلمة بالأطفال أو تخاطبهم يجب أن تقول (يا أبطالي) ويُمنع منعاً باتاً استخدام كلمة (أصحابي).\n" +
      "- **وصف المشهد والشخصية (ثابت لا يتغير أبداً):** \n" +
      "  - **المكان (Scene):** A futuristic, bright, and engaging smart classroom with holographic educational displays, neon lights, and a huge interactive glowing smartboard. On the wall, there is a HUGE glowing neon sign displaying the exact typographic text \"Sci.Rehab Elsibai\". The FULL text \"Sci.Rehab Elsibai\" must be perfectly spelled and COMPLETELY VISIBLE without any missing words.\n" +
      "  - **الشخصية (Character):** A beautiful 20-25 years old 3D Pixar-style young female teacher with long wavy dark brown hair, big brown eyes, sitting on her chair behind the wooden desk, wearing " + (configObj.teacherOutfit || "a purple headband, a white silk blouse, and a sleek purple blazer") + ". (Maintain exact same character design and proportions as the previous scene).\n" +
      "- **اللهجة والمصطلحات (عامية مصرية قحة للأطفال):** يُمنع تماماً استخدام أي كلمات من الفصحى في الحوار! استخدم كلمات عامية مصرية يومية خفيفة جداً يفهمها الأطفال. مثلاً لا تقل (الجو بارد) بل قل (الجو ساقعة أو تلج).\n" +
      "- **الإظهار البصري:** يجب أن تذكر في الـ Action أن المعلمة تشرح على السبورة الذكية، وأن أي معلومة تقولها تظهر على السبورة بجانبها بوضوح.\n" +
      "- **حركة الكاميرا والإخراج:** (Medium close-up on the teacher. IMPORTANT: The teacher is facing the camera directly in a full frontal view so her lips are clearly visible to ensure perfect lip-sync. She is explaining engagingly while interacting with the smartboard).\n" +
      "- **خلو الحوار من الأقواس:** اكتب (المعلمة: ) متبوعاً بكلامها الصافي بدون أي وصف داخل الحوار.\n";
    } else if (videoMode === "review") {
      characterConfigStr += "\n- **أسلوب المراجعة الممتعة:** التركيز على استرجاع المعلومات. اطرح أسئلة ذكية ثم أجب عليها مع الشرح الوافي. أسلوب تفاعلي ولذيذ يربط المعلومات القديمة.\n" +
      "- **اللهجة:** عامية مصرية تفاعلية ومشوقة.\n" +
      "- **المكان (Scene):** A dynamic abstract educational studio. In the background, there is a HUGE glowing neon sign displaying the exact typographic text \"Sci.Rehab Elsibai\". The FULL text \"Sci.Rehab Elsibai\" must be perfectly spelled and COMPLETELY VISIBLE without any missing words.\n" +
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
      "- **اللهجة والمصطلحات (عامية مصرية قحة للأطفال):** يُمنع تماماً استخدام أي كلمات من الفصحى في الحوار! استخدم كلمات عامية مصرية يومية خفيفة جداً يفهمها الأطفال. مثلاً لا تقل (الجو بارد أو شديد البرودة) بل قل (الجو ساقعة أو تلج)، ولا تقل (ماذا يحدث) بل قل (إيه اللي بيحصل). تحدثوا كأنهم أطفال مصريين في الشارع أو المدرسة.\n";
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
(videoMode === "story" 
  ? "أنت مخرج أفلام ومؤلف سيناريوهات ذكي يكتب Prompts لأفلام قصيرة مسلية باستخدام الذكاء الاصطناعي.\n"
  : "أنت مخرج ذكي يكتب Prompts للفيديوهات التعليمية باستخدام الذكاء الاصطناعي.\n") +
"الرجاء استخراج مشاهد للفيديوهات بناءً على الخريطة التالية:\n" +
JSON.stringify(chunk, null, 2) + "\n\n" +
"إعدادات الشخصية والأسلوب:\n" +
characterConfigStr + "\n\n" +
(lastContext ? "معلومات هامة جداً عن نهاية المشهد السابق لكي يكتمل عليه المشهد الحالي:\n" + lastContext + "\n\n" : "") +
"المطلوب:\n" +
"بناء Prompts إبداعية للذكاء الاصطناعي لتوليد الفيديو.\n" +
"كل مشهد فيديو يجب أن يكون ممتعاً. **قم بتوليد أقل عدد ممكن من المشاهد يكفي لتقديم المحتوى المتوفر فقط دون اختصار ودون تكرار.** إذا كانت المعلومات في النص قليلة، فيكفي مشهد واحد أو مشهدين. يُمنع منعاً باتاً زيادة عدد المشاهد أو تكرار الكلام لمجرد الإطالة! قدم الموجود فقط.\n" +
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
"    \"dialogue\": \"[اسم المتحدث فقط]: الكلام الذي يقوله (ممنوع منعاً باتاً دمج شخصيتين، متحدث واحد فقط لكل فيديو)\",\n" +
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
      // Override LLM ID with a guaranteed unique ID
      p.id = `prompt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${index}`;

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
