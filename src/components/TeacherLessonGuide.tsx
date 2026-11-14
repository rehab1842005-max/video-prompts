"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

export interface FlowVideoItem {
  shotTitle: string;
  prompt: string;
}

export interface PptAnimationMovement {
  stepNumber: number;
  trigger: string;
  element: string;
  fromWhere: string;
  toWhere: string;
  animationType: string;
  detailedAction: string;
  syncWithTeacher: string;
}

export interface PptAnimationPlan {
  slideTitle: string;
  slideLayout: string;
  movements: PptAnimationMovement[];
}

export interface IntroHook {
  hookTitle: string;
  teacherScript: string;
  analogyStory: string;
  pptAnimationPlan?: PptAnimationPlan;
  videoPrompts?: FlowVideoItem[];
  flowVideoPrompt?: string; // backwards compatibility
}

export interface ScientificBeat {
  beatNumber: number;
  conceptTitle: string;
  teacherScript: string;
  simpleExplanation: string;
  studentQuestion?: string;
  expectedAnswer?: string;
  textbookTerm: string;
  textbookDefinition: string;
  pptAnimationPlan?: PptAnimationPlan;
  videoPrompts?: FlowVideoItem[];
  flowVideoPrompt?: string; // backwards compatibility
}

export interface ExperimentStep {
  stepNumber: number;
  stepTitle: string;
  actionDetails: string;
  teacherSpeech: string;
  flowVideoPrompt: string;
}

export interface ExperimentTransition {
  teacherSpeech: string;
  flowVideoPrompt?: string;
}

export interface Experiment {
  experimentTitle: string;
  goal: string;
  materials: string[];
  introAndMaterialsSpeech?: string;
  steps?: ExperimentStep[];
  stepsWithLogic?: any[];
  observations: string;
  observationVideoPrompt?: string;
  finalConclusion: string;
  observationAndConclusionSpeech?: string;
  safetyPrecautions?: string;
  pptAnimationPlan?: PptAnimationPlan;
}

export interface LessonConclusion {
  title: string;
  teacherScript: string;
  flowVideoPrompt?: string;
}

export interface BlackboardSummary {
  title: string;
  keyVocabulary: string[];
  definitions: string[];
  comparisons: string[];
  conclusions: string[];
}

export interface CheckUnderstandingItem {
  questionType: string;
  question: string;
  correctAnswer: string;
}

export interface LessonGuideData {
  lessonTitle: string;
  detectedTopic?: string;
  introHook?: IntroHook;
  scientificBeats?: ScientificBeat[];
  beats?: any[];
  sections?: any[];
  experimentTransition?: ExperimentTransition;
  experiments?: Experiment[];
  lessonConclusion?: LessonConclusion;
  blackboardSummary?: BlackboardSummary;
  checkUnderstanding?: CheckUnderstandingItem[];
}

export const PRESET_SAMPLE_GUIDE: LessonGuideData = {
  lessonTitle: "كيف تصنع النباتات غذاءها بالتفصيل الشامل؟ (عملية البناء الضوئي خطوة بخطوة)",
  detectedTopic: "البناء الضوئي، تركيب الورقة والبلاستيدات، امتصاص الماء والغازات، إنتاج الجلوكوز والنشا، وخروج الأكسجين",
  introHook: {
    hookTitle: "المقدمة الثابتة + تمهيد الدرس + تشبيه البداية",
    teacherScript:
      "✨ أولاً - التحية الثابتة وعنوان الدرس:\n" +
      "السلام عليكم ورحمة الله وبركاته! أهلاً بيكم يا أبطال وعلماء المستقبل الصغار، قاعدين ومصحصحين ومركزين معايا؟ عنوان درسنا النهاردة هو: (كيف تصنع النباتات غذاءها؟ - عملية البناء الضوئي).\n\n" +
      "🌱 ثانياً - أول مقدمة عن الدرس:\n" +
      "في درسنا النهاردة هنتعرف مع بعض بتسلسل سهل وبسيط على معجزة جميلة بتحصل حوالينا كل يوم في كل شجرة ووردة.. إزاي النبات بيقدر يجهز أكله بنفسه خطوة بخطوة من غير ما يتحرك من مكانه، وإزاي كمان بيساعدنا نعيش ونتنفس هواء نقي!\n\n" +
      "💡 ثالثاً - تشبيه البداية (لغز الجوع وفتح الثلاجة):\n" +
      "تعالوا كدا قبل ما نفتح أي كتاب أو نقول أي مصطلحات، نسأل نفسنا سؤال من حياتنا كل يوم وبنحسه كل لحظة: لما بنرجع من المدرسة بعد ما جرينا ولعبنا مع صحابنا، بنحس بإيه؟\n" +
      "بنحس إن جسمنا هبطان، بطننا بتصوصو، ومفيش فينا نفس نتحرك ولا نذاكر، صح؟ أول حاجة بنجري عليها هي المطبخ، نفتح التلاجة، ماما ربنا يبارك فيها تعمل لنا أحلى ساندوتش جبنة أو بيض أو طبق مكرونة دافي.. أول ما ناكل الوجبة دي بنحس إن روحنا ردت فينا فجأة، وبقى عندنا باور وطاقة نقوم ونجري ونذاكر! الأكل ده هو البنزين الحقيقي اللي بيشغل مكنة جسمنا.\n\n" +
      "طب فكرتوا مرة في الشجرة العظيمة اللي واقفة في الشارع في الشمس، أو الوردة الرقيقة اللي في بلكونة بيتنا؟ الشجرة دي كائن حي بيتنفس ويكبر زينا بالظبط، بس عمركم شفتوا شجرة بتطلب دليفري أو بتمشي برجليها تروح السوبر ماركت تشتري خضار؟ لأ طبعاً!\n" +
      "طب بتاكل منين وبتجيب طاقتها إزاي وهي ثابتة مكانها في الطين؟ ده السر العظيم والمعجزة الإلهية اللي هنكتشفها سوا النهاردة خطوة بخطوة وبالتفصيل الممتع جداً!",
    analogyStory: "تشبيه متكامل يربط بين: شعور الإنسان بالجوع وفتح الثلاجة للأكل، وعجز النبات عن الحركة لشراء الطعام، ومطبخ النبات السحري داخل الورقة الذي يحول الضوء والماء إلى غذاء كامل.",
    videoPrompts: [
      {
        shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: الجوع والثلاجة ⬅ بلكونة النبات والشمس ⬅ مطبخ الورقة السحري)",
        prompt: "A dynamic 10-second multi-scene sequence with rapid seamless cuts, perfectly synchronized with teacher voiceover pacing: [0-3s]: In a warm cozy kitchen, a hungry cartoon boy quickly opens a glowing refrigerator and eagerly takes a delicious bite of a sandwich as sparkles swirl. [3-6s]: Rapid whip-pan camera transition to a sunny apartment balcony where a lovely potted green plant flutters in warm golden morning sunbeams. [6-10s]: Fast dynamic zoom transition deep into a glowing leaf revealing a whimsical miniature kitchen assembling sparkling sugar energy cubes. High-energy visual progression, cute friendly 3D cartoon Pixar animation for children, soft rounded shapes, vibrant cheerful colors. Mute visual action only, strictly NO talking characters, NO mouth animation, NO speaking faces, NO lip sync."
      }
    ]
  },
  scientificBeats: [
    {
      beatNumber: 1,
      conceptTitle: "1. مفهوم التغذية: الكائنات المستهلكة مقابل الكائنات ذاتية التغذية",
      teacherScript:
        "تعالوا نبدأ الحكاية من أول سطر بالراحة خالص:\n\n" +
        "في علم الأحياء والعلوم، ربنا قسم كل الكائنات الحية اللي على كوكب الأرض لنوعين أساسيين في طريقة الأكل:\n" +
        "النوع الأول هو إحنا والحيوانات زي القطة والأسد والحصان.. إحنا اسمنا العلمي (كائنات مستهلكة). يعني إيه مستهلكة يا شطار؟ يعني جسمنا ما بيعرفش يطبخ الأكل جواه، لازم نروح ندور على كائن تاني ناكله، بناكل فراخ أو لحمة أو خضار وفاكهة.\n\n" +
        "لكن بقى النوع التاني وهو النبات: هو المعجزة الفريدة في الكون! النبات كائن ما بيعتمدش على أي حد في أكله، بل بيصنع وجبته الغذائية بنفسه من الصفر جوة خلاياه.\n\n" +
        "وعلشان كده في كتاب المدرسة بنسميه: كائن ذاتي التغذية! يعني بيغذي نفسه بنفسه دون مساعدة من أي مخلوق.",
      simpleExplanation: "تصنف الكائنات الحية تبعا لطريقة حصولها على الطاقة إلى: كائنات غير ذاتية التغذية (Heterotrophs / Consumers) تعتمد على التغذية الجاهزة على كائنات أخرى، وكائنات ذاتية التغذية (Autotrophs / Producers) تقوم ببناء مركباتها العضوية عالية الطاقة كالكربوهيدرات من مواد غير عضوية بسيطة من البيئة المحيطة.",
      studentQuestion: "يا ترى لو حبسنا قطة وأرنب في أوضة مفيهاش أكل خالص، هيقدروا يصنعوا أكلهم بنفسهم؟",
      expectedAnswer: "لأ طبعاً، لأنهم كائنات مستهلكة لازم ياكلوا كائنات تانية عشان يعيشوا.",
      textbookTerm: "كائنات ذاتية التغذية (Autotrophs)",
      textbookDefinition: "الكائنات الحية التي تستطيع صنع غذائها بنفسها من خلال تحويل مواد غير عضوية أولية بسيطة إلى مواد غذائية عضوية معقدة غنية بالطاقة (مثل النباتات الخضراء).",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: أرنب مستهلك يأكل جزرة ⬅ انتقال سريع إلى زهرة منتجة تصنع غذاءها بنفسها)",
          prompt: "A dynamic 10-second multi-shot sequence with rapid seamless transitions, precisely paced for teacher voiceover: [0-5s]: A cute fluffy 3D cartoon bunny happily munches on a crisp orange carrot in a sunlit green meadow, illustrating a consumer eating ready food. [5-10s]: Rapid camera glide transition over the meadow grass to a vibrant 3D sunflower glowing with radiant internal emerald and golden energy under morning sunbeams, producing its own food. Fast visual progression, cute friendly 3D Pixar style for children, soft rounded shapes, vibrant cheerful colors. Mute visual action only, strictly NO talking characters, NO speaking mouth movement, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 2,
      conceptTitle: "2. المكونات الأساسية الثلاثة التي يحتاجها النبات لصنع طعامه",
      teacherScript:
        "بعد ما عرفنا إن النبات بيطبخ أكله بنفسه، تعالوا نسأل: هيحتاج إيه؟\n\n" +
        "أي شيف ماهر لما بيقرر يعمل كيكة أو صينية خضار في الفرن، بيكتب ورقة مقادير: دقيق وسكر ولبن وحرارة الفرن.. طب يا ترى شيف النبتة العبقري محتاج إيه عشان يطبخ الوجبة بتاعته؟\n\n" +
        "محتاج تلات مقادير رئيسية من الطبيعة مفيش غيرهم:\n" +
        "1) أول حاجة: المية والأملاح المعدنية من التربة.\n" +
        "2) تاني حاجة: غاز من الهواء اسمه ثاني أكسيد الكربون.\n" +
        "3) وتالت حاجة: الطاقة السحرية اللي بتسوي كل ده وهي ضوء الشمس!\n\n" +
        "ولو غاب مكون واحد بس من التلاتة دول، المطبخ يقف والطبخة تبوظ والنبات يجوع لحد ما يذبل ويموت!",
      simpleExplanation: "تتطلب عملية التمثيل الغذائي في النبات توفر ثلاثة مدخلات أولية متكاملة: الماء والأملاح المعدنية (كمصدر للهيدروجين والإلكترونات)، غاز ثاني أكسيد الكربون (كمصدر لذرات الكربون والأكسجين العضوي)، وضوء الشمس (كمصدر للطاقة الحركية الكيميائية). غياب أي عنصر يوقف التفاعل الحيوي فورا.",
      studentQuestion: "لو وفرنا للنبتة مية وهوا بس، وخبيناها في كرتونة مظلمة.. هل هتقدر تطبخ وتعيش؟",
      expectedAnswer: "لأ، لأن ضوء الشمس هو بوتاجاز الطاقة اللي بيسوي الطبخة، ومن غيره مش هتقدر تصنع سكر.",
      textbookTerm: "الاحتياجات الأساسية للنبات (Basic Plant Needs)",
      textbookDefinition: "المواد الأولية والعوامل الطبيعية التي لا يستطيع النبات العيش أو بناء غذائه بدونها، وتشمل: الماء، الأملاح المعدنية، غاز ثاني أكسيد الكربون، وضوء الشمس المباشر.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: قطرة ماء من التربة ⬅ تيار هواء ⬅ شعاع شمس يجتمعون حول الورقة)",
          prompt: "A fast-paced 10-second sequence with dynamic multi-scene cuts matching narration: [0-3s]: Macro view of a glowing crystal-blue water droplet rising from dark moist soil. [3-6s]: Fast swirling transition introducing floating cyan air currents streaming smoothly. [6-10s]: Golden sunbeam bursts in and all three elements gracefully merge onto a soft green leaf, lighting it up with vitality. Playful cute 3D cartoon Pixar animation for children, vibrant colors, fast transitions. Mute visual action only, strictly NO talking characters, NO mouth movement, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 3,
      conceptTitle: "3. عالم الجذور تحت الأرض: امتصاص الماء والأملاح كالمصاصات الدقيقة",
      teacherScript:
        "تعالوا بقى نمشي مع أول مكون خطوة بخطوة، وننزل تحت الأرض في الظلمة والطين نشوف أول خطوة بتحصل إزاي:\n\n" +
        "النبتة عندها شبكة جذور قوية متفرعة تحت الطين.. الجذور دي مش بس بتثبت الشجرة عشان الرياح ما تقلعهاش، دي مليانة شعيرات مجهرية دقيقة جداً جداً اسمها (الشعيرات الجذرية).\n\n" +
        "الشعيرات دي عاملة زي ملايين الشفاطات أو المصاصات الصغيرة، جدارها رقيق خالص علشان تقدر تشفط جزيئات المية المحشورة بين حبيبات الطين، ومع المية بتسحب كمان أملاح معدنية مهمة زي الكالسيوم والمغنيسيوم اللي بيقووا جسم النبتة ويخلوها مصحصحة!",
      simpleExplanation: "تعتبر الشعيرات الجذرية (Root Hairs) امتدادات سيتوبلازمية دقيقة لخلايا طبقة البشرة في الجذر، وتتميز بغشاء شبه منفذ ذي مساحة سطح شاسعة. تقوم بامتصاص الماء بالخاصية الأسموزية (Osmosis) نتيجة زيادة تركيز الأملاح داخل الفجوة العصارية عن التربة، مصحوبا بامتصاص الأيونات المعدنية بالانتشار والنقل النشط.",
      studentQuestion: "ليه ربنا خلق للشعيرات الجذرية جدار رقيق جداً ومش سميك زي الخشب؟",
      expectedAnswer: "عشان المية والأملاح يقدروا يعدوا ويدخلوا منها بسهولة وسرعة.",
      textbookTerm: "الشعيرات الجذرية (Root Hairs)",
      textbookDefinition: "امتدادات خلوية أنبوبية دقيقة ورقيقة الجدر تخرج من بشرة جذر النبات، تعمل على زيادة مساحة سطح امتصاص الماء والأملاح المعدنية من حبيبات التربة.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: جذور الشجرة في الطين ⬅ زووم مجهري للشعيرات كالشفاطات ⬅ سحب قطرات الماء المتلألئة)",
          prompt: "A dynamic 10-second multi-scene sequence with rapid cuts, synchronized with voiceover: [0-3s]: Underground view of strong tree roots branching through dark earthy soil. [3-7s]: Quick macro zoom transition to translucent root hairs styled like cute tiny drinking straws wrapped around soil grains. [7-10s]: Rapid suction visual as glowing blue water beads and mineral crystals smoothly sip upwards into the root tube. Cute friendly 3D cartoon Pixar animation for children, playful macro motion. Mute visual action only, strictly NO talking characters, NO speaking faces, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 4,
      conceptTitle: "4. شبكة المواسير الناقلة: صعود الماء كالمصعد عبر أوعية الخشب",
      teacherScript:
        "طب يا دكاترة المستقبل، المية دخلت خلاص في الجذر تحت في الطين.. إزاي بقى هتطلع للشجرة اللي طولها 10 متر في السماء؟\n\n" +
        "سبحان الله العظيم! ساق النبات مش عصاية مصمتة، دي مليانة شبكة مواسير وأنابيب دقيقة جداً مفرغة اسمها (أوعية الخشب).\n\n" +
        "الأوعية دي عاملة زي مواسير المياه في العمارة أو زي أسانسير سريع في اتجاه واحد من تحت لفوق! بتسحب المية والأملاح وتفضل تضخها للأعلى عبر الساق والفروع لحد ما توصلها بالظبط لباب المطبخ في الورقة الخضراء!",
      simpleExplanation: "ينتقل الماء والأملاح الممتصة للأعلى عبر نسيج الخشب (Xylem)، وهو نسيج ناقل يتكون من أوعية أسطوانية مجوفة متصلة وخالية من البروتوبلازم ومدعمة بمادة اللجنين. يعتمد صعود الماء ضد الجاذبية على قوى التماسك والتلاصق بين جزيئات الماء وقوة الشد الناتجة عن عملية النتح بالأوراق.",
      studentQuestion: "أوعية الخشب دي بتنقل المية في أنهي اتجاه؟ من فوق لتحت ولا من تحت لفوق؟",
      expectedAnswer: "من تحت لفوق، من الجذور لحد الأوراق في اتجاه واحد.",
      textbookTerm: "أوعية الخشب (Xylem Vessels)",
      textbookDefinition: "أنابيب وعائية مجوفة تمتد بطول النبات من الجذور عبر الساق إلى الأوراق، وظيفتها نقل الماء والأملاح المعدنية الذائبة في اتجاه واحد نحو الأعلى.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: ساق النبات كالعمارة ⬅ مقطع المواسير الزجاجية ⬅ اندفاع الماء كالمصعد السريع للأوراق)",
          prompt: "A fast-paced 10-second sequence with rapid seamless cuts: [0-3s]: Exterior of a tall green plant stem standing upright like a tiny skyscraper. [3-6s]: Smooth cutaway transition revealing vertical transparent glowing blue xylem pipes inside. [6-10s]: Fast dynamic upward camera rush following sparkling water bubbles shooting upward like a high-speed glass elevator straight into the leaf petioles. Cute friendly 3D Pixar educational style, energetic upward motion. Mute visual action only, strictly NO talking characters, NO mouth movement, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 5,
      conceptTitle: "5. الورقة الخضراء: تشريح مصنع الغذاء ومطبخ النبتة",
      teacherScript:
        "المية دلوقتي وصلت بالسلامة للورقة! تعالوا بقى نروح لبطل الحكاية كلها: الورقة الخضراء!\n\n" +
        "اشمعنى النبات بيطبخ أكله في الورقة ومش في الجذع أو الوردة؟ لأن الورقة مسطحة ورقيقة وعريضة ومفروشة في الهوا زي الصينية، فتقدر تجمع أكبر قدر من الشمس والهواء.\n\n" +
        "ولما ناخد قطاع في الورقة ونبص بالميكروسكوب، هنلاقي جواها خلايا منظمة فيها معامل صغيورة لونها أخضر زاهي اسمها (البلاستيدات الخضراء). البلاستيدات دي هي أفران ومطابخ النبتة اللي بيتم فيها تحضير الوجبة كلها!",
      simpleExplanation: "تعد الورقة العضو الأساسي للتمثيل الضوئي بفضل شكلها المنبسط الذي يعظم امتصاص الضوء وتبادل الغازات. تتركب الورقة داخليا من بشرة علوية وسفلية يتوسطهما نسيج متوسط (Mesophyll) يضم النسيج العمادي المكتظ بالبلاستيدات الخضراء (Chloroplasts) المسؤولة عن التفاعل.",
      studentQuestion: "ليه أوراق الشجر عريضة ومفرودة في الهواء؟",
      expectedAnswer: "عشان تستقبل أكبر كمية من ضوء الشمس والهواء اللازمين لصناعة الغذاء.",
      textbookTerm: "البلاستيدات الخضراء (Chloroplasts)",
      textbookDefinition: "عضيات خلوية متخصصة تنتشر بكثافة داخل خلايا أوراق النبات الخضراء، وتعد الموقع الرئيسي الذي تحدث بداخله جميع تفاعلات عملية البناء الضوئي.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: الورقة العريضة في الهواء ⬅ زووم مجهري داخل الخلايا ⬅ ظهور البلاستيدات الخضراء اللطيفة)",
          prompt: "A dynamic 10-second multi-shot sequence with seamless transitions: [0-3s]: Broad green leaf fluttering openly in fresh outdoor air catching bright sunlight like a wide tray. [3-6s]: Rapid microscopic zoom transition diving straight through the leaf skin into cell layers. [6-10s]: Revealing hundreds of cheerful emerald-green chloroplast organelles floating and bobbing happily like cute jelly beans in crystal cytoplasm. Fast visual storytelling, cute friendly 3D Pixar style for children. Mute visual action only, strictly NO talking characters, NO speaking faces, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 6,
      conceptTitle: "6. الكلوروفيل صائد الضوء: ألواح الطاقة الشمسية للنبات",
      teacherScript:
        "ودلوقتي وصلنا جوه الورقة.. طب ليه الورقة والبلاستيدات لونهم أخضر؟\n\n" +
        "لأن ربنا حط جواها صبغة كيميائية سحرية اسمها (الكلوروفيل). الكلوروفيل ده عامل بالظبط زي ألواح الطاقة الشمسية السوداء اللي بنشوفها على أسطح العمارات النظيفة!\n\n" +
        "وظيفته الأولى إنه يصطاد فوتونات وأشعة الشمس الذهبية ويحبس طاقتها جواه. ضوء الشمس ده هو البوتاجاز اللي هيسخن ويدمج المكونات مع بعضها.. ومن غير الكلوروفيل، الضوء هيمر كأنه مفيش حاجة والنبات مش هيقدر يطبخ نهائياً!",
      simpleExplanation: "الكلوروفيل (Chlorophyll) هو الصبغة الرئيسية الممتصة للضوء داخل أغشية الثايلاكويد، حيث يمتص بكفاءة الفوتونات ذات الأطوال الموجية الزرقاء والحمراء ويعكس الطول الموجي الأخضر. تعمل الطاقة الضوئية الممتصة على تنشيط الإلكترونات لبدء التفاعلات الضوئية وشطر جزيئات الماء.",
      studentQuestion: "الكلوروفيل بيمتص طاقة إيه عشان يسوي بيها الأكل؟",
      expectedAnswer: "بيمتص الطاقة الضوئية من أشعة الشمس.",
      textbookTerm: "صبغة الكلوروفيل (Chlorophyll)",
      textbookDefinition: "الصبغة الخضراء الأساسية الموجودة داخل البلاستيدات الخضراء في أوراق النبات، وظيفتها امتصاص الطاقة الضوئية من الشمس لتحويلها إلى طاقة كيميائية.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: سطح البلاستيدة ⬅ حبيبات الكلوروفيل كألواح الطاقة ⬅ اصطياد فوتونات الشمس والتوهج)",
          prompt: "A fast-paced 10-second sequence with dynamic transitions: [0-3s]: Close-up inside a chloroplast showing delicate green clusters of chlorophyll pigments arranged like solar panels. [3-6s]: Golden solar photon particles raining down and instantly getting trapped by the green pigments. [6-10s]: Quick burst transition as the chlorophyll lights up in a radiant golden-emerald glow of stored energy. Cute friendly 3D Pixar animation for children, vibrant lighting, smooth fast cuts. Mute visual action only, strictly NO talking characters, NO mouth movement, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 7,
      conceptTitle: "7. تنفس الورقة: الثغور الميكروسكوبية ودخول غاز ثاني أكسيد الكربون",
      teacherScript:
        "جميل جداً! دلوقتي المية وصلت، والشمس محبوسة في الكلوروفيل.. ناقص المكون التالت: الهواء! الورقة محتاجة غاز معين اسمه (غاز ثاني أكسيد الكربون).\n\n" +
        "طب الهوا بيدخل منين للورقة؟ لو قلبنا الورقة وبصينا على سطحها السفلي بالميكروسكوب، هنلاقي فتحات ومسام دقيقة جداً جداً اسمها (الثغور). كل فتحة ثغر عليها حارسين شطار اسمهم (الخلايا الحارسة).\n\n" +
        "الخلايا الحارسة دي بتفتح الباب أول ما تطلع شمس الصباح عشان يدخل غاز ثاني أكسيد الكربون، وتقفل الباب في عز الحر عشان النبتة ما تطلعش ميتها وتتبخر وتعطش!",
      simpleExplanation: "تنتشر الثغور (Stomata) بكثافة على البشرة السفلية للورقة لتقليل التبخر الزائد. تُحاط كل فتحة بزوج من الخلايا الحارسة (Guard Cells) المتخصصة التي تنظم فتح وغلق الثغر بواسطة التغير في الضغط الامتلائي، مما يتيح دخول CO₂ من الهواء الجوي وخروج O₂ وبخار الماء.",
      studentQuestion: "إيه اسم الفتحات الصغيرة اللي في الورقة اللي بتتنفس وتدخل الهواء؟",
      expectedAnswer: "اسمها الثغور، وبيحرسها الخلايا الحارسة.",
      textbookTerm: "الثغور والخلايا الحارسة (Stomata & Guard Cells)",
      textbookDefinition: "الثغور: فتحات ميكروسكوبية دقيقة تنتشر على أسطح أوراق النبات وتتحكم في فتحها وغلقها خلايا حارسة لتنظيم تبادل الغازات وخروج بخار الماء.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: السطح السفلي للورقة ⬅ انتفاخ الخلايا الحارسة وفتح الباب ⬅ تدفق جزيئات ثاني أكسيد الكربون)",
          prompt: "A dynamic 10-second sequence with rapid seamless cuts: [0-3s]: Microscopic view gliding across the lower leaf epidermis dotted with tiny pores. [3-6s]: Quick transition focusing on two cute kidney-shaped guard cells swelling like soft cushions to open an oval doorway. [6-10s]: Playful purple and cyan carbon dioxide bubbles cheerfully floating through the open door into the leaf interior. Cute friendly 3D cartoon Pixar animation for children, fluid motion. Mute visual action only, strictly NO talking characters, NO speaking faces, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 8,
      conceptTitle: "8. التفاعل الكيميائي وطبخ سكر الجلوكوز (غذاء النبات وطاقته)",
      teacherScript:
        "وصلنا مع بعض للحظة السحرية والطبخة الكبرى!\n\n" +
        "المية جت من الجذور، وثاني أكسيد الكربون دخل من الثغور، والكلوروفيل سخن بالضوء.. جوة البلاستيدة بيحصل تفاعل كيميائي معجز: ذرات المية بتتفكك وتتحد مع ذرات الكربون، وتكون الناتج الأساسي اللي النبتة كانت بتجري علشانه: سكر اسمه (سكر الجلوكوز)!\n\n" +
        "سكر الجلوكوز ده هو وجبة النبات وطاقته، بينقله في أنابيب اسمها أوعية اللحاء لكل حتة في النبات عشان يكبر ويطلع ورق وفروع وأزهار!",
      simpleExplanation: "تتحد جزيئات الماء وثاني أكسيد الكربون في تفاعلات البناء الضوئي (تفاعلات الضوء ودورة كالفن) لإنتاج مركب الجلوكوز عالي الطاقة (C₆H₁₂O₆). يمثل الجلوكوز الوقود الخلوي المباشر لبناء خلايا النبات وجدرانها السيليلوزية وتغذية العمليات الحيوية.",
      studentQuestion: "إيه اسم السكر اللي بيصنعه النبات كغذاء أساسي لنفسه؟",
      expectedAnswer: "سكر الجلوكوز.",
      textbookTerm: "سكر الجلوكوز (Glucose Sugar - C₆H₁₂O₆)",
      textbookDefinition: "سكر بسيط غني بالطاقة الكيميائية تصنعه النباتات الخضراء أثناء عملية البناء الضوئي، ويمثل الغذاء الأساسي والوقود اللازم لنمو النبات وتكاثره.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: التقاء جزيئات الماء والغاز ⬅ تفاعل الطاقة الحرارية الشمسية ⬅ تبلور جزيء سكر الجلوكوز اللامع)",
          prompt: "A fast-paced 10-second sequence with dynamic transitions matching speech: [0-3s]: Inside the chloroplast stroma, glowing blue water molecules and purple carbon dioxide molecules rush toward each other. [3-6s]: Rapid flash of golden solar energy linking the atoms together like magical puzzle pieces. [6-10s]: Quick transformation transition into a sparkling hexagonal amber glucose sugar crystal radiating sweet energy. Cute friendly 3D cartoon Pixar style, sparkling cheerful effects. Mute visual action only, strictly NO talking characters, NO mouth animation, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 9,
      conceptTitle: "9. تخزين الفائض: كيف يحول النبات الجلوكوز إلى نشا؟",
      teacherScript:
        "طب بعد ما النبتة طبخت سكر الجلوكوز، يا ترى لو شاطرة وطبخت كمية كبيرة زادت عن حاجتها اليومية، هترميها؟\n\n" +
        "لأ طبعاً! ربنا علمها تشيل الفائض في الحصالة.. فبتاخد جزيئات الجلوكوز وتربطها في سلاسل معقدة وتخزنها في صورة (نشا) في الأوراق والجذور والثمار زي البطاطس والقمح!\n\n" +
        "ولما يجي الليل والشمس تغيب أو الجو يمطر ومفيش شمس، النبتة تفتح حصالة النشا وتفككها وتاكل منها عشان تفضل عايشة!",
      simpleExplanation: "يقوم النبات ببلمرة جزيئات الجلوكوز الزائدة عن حاجته الفورية في صورة جزيئات نشا (Starch) غير ذائبة في الماء داخل بلاستيدات متخصصة (Amyloplasts). تضمن هذه الآلية عدم زيادة الضغط الأسموزي للخلية وتوفر مخزونا استراتيجيا من الطاقة أثناء فترات الظلام وغياب الضوء.",
      studentQuestion: "النبات بيخزن السكر الزيادة عن حاجته في صورة إيه؟",
      expectedAnswer: "في صورة نشا، زي اللي موجود في البطاطس والرز والقمح.",
      textbookTerm: "النشا النباتي (Plant Starch)",
      textbookDefinition: "كربوهيدرات معقدة غير ذائبة يخزن فيها النبات سكر الجلوكوز الفائض عن استهلاكه المباشر في خلايا الأوراق والجذور والدرنات لاستخدامه وقت الحاجة.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: تراكم جزيئات الجلوكوز الزائدة ⬅ تشابكها في سلاسل ⬅ تخزينها كلآلئ نشا في حصالة النبات)",
          prompt: "A dynamic 10-second sequence with rapid seamless cuts: [0-3s]: Overflow of cheerful glucose sugar crystals floating in the plant cell. [3-6s]: Quick transition showing sugar units linking hands into long graceful chains. [6-10s]: Rapid camera pan to an amyloplast storage bank where chains pack neatly into smooth glowing white pearls of starch. Fast visual pacing, cute friendly 3D Pixar animation for children. Mute visual action only, strictly NO talking characters, NO speaking mouth movement, NO lip sync."
        }
      ]
    },
    {
      beatNumber: 10,
      conceptTitle: "10. الهدية العظمى للعالم: انطلاق غاز الأكسجين ورئة كوكب الأرض",
      teacherScript:
        "وأخيراً، هل في حاجة تانية بتطلع من الطبخة دي يا شطار غير السكر والنشا؟\n\n" +
        "أيوة، أعظم هدية لكوكب الأرض كله! لما جزيء المية اتفكك عشان ناخد منه الهيدروجين، اتبقى غاز عظيم اسمه (غاز الأكسجين). النبات مش محتاج كل الأكسجين ده، فبيطلعه ويطرده برة في الهواء عبر الثغور.\n\n" +
        "غاز الأكسجين النقي ده هو اللي إحنا وكل إنسان وحيوان وطير بنتنفسه علشان نفضل عايشين! علشان كده بنقول دايماً إن النباتات هي (رئة كوكب الأرض) اللي بتنقي الجو وتسحب الغاز الضار وتدينا النفس النظيف اللي بنعيش بيه!",
      simpleExplanation: "ينطلق غاز الأكسجين (O₂) كناتج عرضي وثانوي من تفاعلات الشطر الضوئي للماء في عملية البناء الضوئي. يتحرر الأكسجين إلى الغلاف الجوي عبر الثغور، وهو ما يضمن الحفاظ على نسبة الأكسجين الحيوية (21%) الضرورية لتنفس جميع الكائنات الحية الهوائية واستمرار الحياة على الأرض.",
      studentQuestion: "إيه هو الغاز العظيم اللي النبات بيطلعه هدية لينا في الهواء عشان نتنفسه؟",
      expectedAnswer: "غاز الأكسجين النقي (O₂).",
      textbookTerm: "غاز الأكسجين (Oxygen Gas - O₂)",
      textbookDefinition: "غاز حيوي ينتج كناتج ثانوي عن عملية البناء الضوئي وينطلق عبر الثغور إلى الهواء الجوي، ويعد ضرورياً لاستمرار تنفس جميع الكائنات الحية الهوائية.",
      videoPrompts: [
        {
          shotTitle: "فيديو تتابعي شامل 10 ثوانٍ (انتقالات سريعة: انطلاق فقاعات الأكسجين من الثغور ⬅ تصاعدها في الهواء ⬅ مشهد الغابات كرئة للأرض)",
          prompt: "A dynamic 10-second sequence with rapid seamless transitions: [0-4s]: Shimmering crystal bubbles of pure oxygen gas gracefully popping out of leaf stomata into the fresh morning air. [4-7s]: Fast upward camera lift following the floating oxygen bubbles rising into a sunny blue sky. [7-10s]: Wide cinematic aerial wipe transition over a vast emerald green forest breathing fresh life into the planet. Inspiring, fast-paced, cute friendly 3D Pixar animation for children. Mute visual action only, strictly NO talking characters, NO speaking faces, NO lip sync."
        }
      ]
    }
  ],
  experimentTransition: {
    teacherSpeech: "شفتوا يا شطار الجمال العلمي ده؟ طب تفتكروا إحنا في مادة العلوم بنصدق الكلام وخلاص من غير ما نتأكد بعنينا؟ لأ طبعاً! إحنا علماء المستقبل، والعلماء لازم يجربوا بنفسهم في المعمل عشان يتأكدوا من الحقيقة خطوة بخطوة. يلا بينا نلبس البالطو الأبيض وندخل المعمل سوا، ونعمل أحلى وأمتع تجربة عملية نتأكد بيها من المعجزة دي بعيوننا! جاهزين؟ يلا بينا نجرب!",
    flowVideoPrompt: "Cute friendly 3D cartoon Pixar style shot entering a bright, colorful, and cheerful children's science lab: A polished wooden lab bench with sparkling rounded glass beakers, a shiny brass magnifying glass, playful colorful test tubes, and a healthy potted green plant under warm golden morning light. Mute visual action only, strictly NO talking characters, NO speaking faces, NO lip sync."
  },
  experiments: [
    {
      experimentTitle: "تجربة إثبات حاجة النبات للضوء لصنع غذائه وتكوين النشا في الأوراق",
      goal: "إثبات عملياً أن ضوء الشمس شرط أساسي وجوهري لحدوث عملية البناء الضوئي وتكوين النشا في أوراق النبات.",
      materials: [
        "أصيص نبات مورق أخضر سليم ونشط (مثل نبات الجيرانيوم)",
        "شريط من الورق الأسود المعتم تماماً للضوء ودبابيس أو مشابك ورق",
        "كأس زجاجي ومصدر حراري (سخان كهربائي) وحمام مائي",
        "أنبوبة اختبار زجاجية تحتوي على كحول إيثيلي 95%",
        "محلول اليود المخفف (ذي اللون البني المائل للبرتقالي) وقطارة معملية",
        "طبق بتري زجاجي وملاقط معملية مسطحة وماء بارد للغسيل"
      ],
      introAndMaterialsSpeech:
        "أهلاً بكم جوه المعمل يا علماء! تجربة النهاردة اسمها: (تجربة إثبات حاجة النبات للضوء لتكوين النشا).\n" +
        "هدفنا من التجربة دي إننا نتأكد بنفسنا إن الورقة مش بتقدر تصنع النشا غير لما يوصلها ضوء الشمس.\n\n" +
        "بصوا معايا على طاولة المعمل، إحنا جهزنا كل الأدوات اللي هنحتاجها:\n" +
        "1) أصيص نبات أخضر سليم ومليان ورق مصحصح (زي نبات الجيرانيوم).\n" +
        "2) شريط ورق أسود معتم ما بيعديش الضوء خالص، ومشبك ورق للتثبيت.\n" +
        "3) كأس زجاجي فيه ماء، وسخان كهربائي وحمام مائي ساخن.\n" +
        "4) أنبوبة اختبار زجاجية فيها كحول إيثيلي تركيزه 95%.\n" +
        "5) طبق بتري زجاجي مسطح، وملاقط معملية، وماء بارد للغسيل.\n" +
        "6) وأهم بطل كاشف معانا: محلول اليود البني المائل للبرتقالي ومعاه قطارة معملية.\n\n" +
        "يلا نبدأ الخطوات بتسلسل دقيق خطوة ورا خطوة!",
      steps: [
        {
          stepNumber: 1,
          stepTitle: "حجب جزء من ورقة النبات عن أشعة الشمس",
          actionDetails: "نختار ورقة خضراء سليمة على نبات سليم، ونغطي جزءاً محدداً من منتصفها بشريط من الورق الأسود المعتم من الجهتين (العلوية والسفلية) ونثبته جيداً بمشبك، ثم نترك النبات في مكان مشمس لعدة ساعات.",
          teacherSpeech:
            "الخطوة الأولى: هنمسك أصيص النبات الحلو ده، وننقي ورقة خضراء سليمة ومصحصحة. هنجيب شريط الورق الأسود المعتم اللي ما بيدخلش أي نور، ونلفه على حتة في نص الورقة من الوش ومن الضهر، ونثبته كويس بمشبك الورق.\n" +
            "ونسيب باقي الورقة من الجنبين مكشوفة للشمس.. كده إحنا عملنا مقارنة عادلة جداً: حتة هيوصلها شمس وحتة في النص محرومة من الشمس تماماً! وبعدين نحط النبات في مكان مشمس لمدة 4 أو 5 ساعات يشتغل براحته.",
          flowVideoPrompt: "Cute friendly 3D cartoon Pixar style laboratory animation for children: Close-up of a neat tabletop and a potted plant. Gentle hands using a black opaque paper strip and a metal clip to cover the middle portion of a broad green leaf, while sunlight streams onto the exposed leaf areas. Tabletop macro focus, mute visual action only, strictly NO talking characters, NO speaking mouth movement, NO lip sync."
        },
        {
          stepNumber: 2,
          stepTitle: "قطف الورقة وغليها بالماء الساخن لقتل الخلايا",
          actionDetails: "ننزع الشريط الأسود ونقطف الورقة، ثم نغمرها في كأس به ماء يغلي لمدة دقيقة واحدة، وذلك لقتل الأنسجة الحية وتليين الجدر الخلوية وتسهيل نفاذ المواد الكيميائية إلى داخل الخلايا.",
          teacherSpeech:
            "دلوقتي نروح للخطوة التانية: بعد ما عدت الساعات في الشمس، هنفك المشبك والشريط الأسود ونقطف الورقة بالراحة. هنجيب الكأس الزجاجي اللي فيه ماء بيغلي على السخان، ونمسك الورقة بالملقط وننزلها في المية المغلية لمدة دقيقة واحدة بس.\n" +
            "ليه بنغليها يا شطار؟ علشان نوقف التفاعلات الحيوية ونقتل الخلايا ونلين جدار الخلية، فيبقى سهل بعد شوية على المحاليل تدخل جوة الورقة.",
          flowVideoPrompt: "Cute friendly 3D cartoon Pixar style laboratory animation for children: A transparent glass beaker with boiling bubbling water on a digital hotplate. Delicate metal forceps gently lowering a broad green leaf into the bubbling water; steam rises gently under focused lab lighting. Tabletop macro focus, mute visual action only, strictly NO talking characters, NO mouth movement, NO lip sync."
        },
        {
          stepNumber: 3,
          stepTitle: "إزالة صبغة الكلوروفيل الخضراء بواسطة الكحول الإيثيلي",
          actionDetails: "نخرج الورقة ونضعها في أنبوبة اختبار بها كحول إيثيلي، ثم نضع الأنبوبة داخل حمام مائي ساخن حتى يذوب الكلوروفيل ويتحول لون الكحول إلى الأخضر وتصبح الورقة بيضاء شاحبة كلياً.",
          teacherSpeech:
            "وبعد الغليان، ننتقل للخطوة التالتة: الورقة لسه لونها أخضر، واللون الأخضر الغامق ده هيغطي على أي تغير لوني يحصل بعدين! فإحنا لازم نسحب اللون الأخضر ده خالص.\n" +
            "هنعمل إيه؟ هنحط الورقة جوه أنبوبة اختبار فيها كحول إيثيلي، وخلي بالكم من قاعدة الأمان المهمة جداً: ممنوع أبداً نقرّب الكحول من النار مباشرة لأنه سريع الاشتعال، عشان كده بنحط الأنبوبة جوه حمام ماء ساخن!\n" +
            "بعد دقائق هنشوف إن صبغة الكلوروفيل دابت في الكحول وبقى لون الكحول أخضر غامق، والورقة نفسها طلعت لونها أبيض شاحب خالص وبقت جاهزة للاختبار!",
          flowVideoPrompt: "Cute friendly 3D cartoon Pixar style laboratory animation for children: Inside a water bath beaker, a glass test tube contains clear ethyl alcohol holding the leaf. The vibrant green chlorophyll visibly leaches out of the leaf tissue into the alcohol, turning the liquid emerald green while the leaf becomes pale, bleached white and translucent. Tabletop macro focus, mute visual action only, strictly NO talking characters, NO speaking mouth movement, NO lip sync."
        },
        {
          stepNumber: 4,
          stepTitle: "إضافة قطرات محلول اليود لاختبار وجود النشا",
          actionDetails: "نغسل الورقة في ماء بارد لتليينها، ثم نفردها في طبق بتري زجاجي مسطح، وننقط فوقها قطرات من محلول اليود الكاشف بواسطة القطارة وننتظر دقيقة لملاحظة الاستجابة اللونية.",
          teacherSpeech:
            "وأخيراً وصلنا للخطوة الرابعة والأحلى: هنطلع الورقة البيضاء من الكحول، ونغسلها في ماء بارد عشان تطرى وتلين، وبعدين نفردها بالراحة جوه طبق بتري الزجاجي.\n" +
            "دلوقتي هنجيب القطارة ومعاها الكاشف السحري بتاعنا: (محلول اليود). اليود لونه الطبيعي بني مائل للبرتقالي، بس اليود ده بيعشق النشا! أول ما يلمس نشا بيتحول فوراً للون الأزرق الداكن القريب من الأسود! تعالوا ننقط قطرات اليود على الورقة كلها ونستنى دقيقة ونشوف المفاجأة!",
          flowVideoPrompt: "Cute friendly 3D cartoon Pixar style laboratory animation for children: A glass pipette dropping golden-amber droplets of iodine solution onto a pale flat leaf resting in a clean Petri dish. Crisp glass reflections, realistic liquid surface tension. Tabletop macro focus, mute visual action only, strictly NO talking characters, NO mouth animation, NO lip sync."
        }
      ],
      observations: "الجزء من الورقة الذي كان معرضاً للشمس المباشرة تلون بالكامل باللون الأزرق القاتم (الأزرق المسود)، بينما الجزء الأوسط الذي كان محجوباً بالشريط الأسود ظل بلون محلول اليود البرتقالي الباهت دون أي تغير لوني.",
      observationVideoPrompt: "Cute friendly 3D cartoon Pixar style laboratory animation for children: Splendid macro view of the leaf in the Petri dish. The sun-exposed sections of the leaf visibly and smoothly transform into deep dark blue/violet as iodine reacts with starch, while the covered rectangular center remains pale yellowish brown, showing a sharp clear contrast. Mute visual action only, strictly NO talking characters, NO speaking faces, NO lip sync.",
      finalConclusion: "الجزء المعرض للشمس فقط هو الذي استطاع القيام بعملية البناء الضوئي وتكوين النشا، مما يثبت بشكل قاطع أن ضوء الشمس شرط أساسي لا غنى عنه لصنع غذاء النبات.",
      observationAndConclusionSpeech:
        "بصوا بعيونكم على المفاجأة اللي حصلت في طبق بتري يا أبطال!\n" +
        "الملاحظة واضحة قدامنا زي الشمس: الجزء المكشوف من الورقة اللي كان متعرض للشمس اتلون كله باللون الأزرق الغامق المسود! ده معناه إن فيه نشا كتير اتكون جواه. أما المستطيل اللي في النص اللي كان متغطي بالشريط الأسود وما شافش الشمس؟ فضل لونه بني برتقالي باهت زي لون اليود، وما اتلونش أزرق خالص!\n\n" +
        "وبكده نوصل للاستنتاج العلمي الأكيد: الجزء اللي وصله ضوء الشمس بس هو اللي قدر يعمل عملية البناء الضوئي ويصنع سكر الجلوكوز ويخزنه كنشا، وده يثبت بالدليل العملي إن ضوء الشمس شرط أساسي لا غنى عنه عشان النبات يصنع غذاءه!",
      safetyPrecautions: "يُمنع منعاً باتاً تسخين أنبوبة الكحول الإيثيلي على اللهب المباشر لأن الكحول مادة شديدة وقابلة للاشتعال، ويجب تسخينه دائماً داخل حمام مائي ساخن فقط."
    }
  ],
  lessonConclusion: {
    title: "خاتمة الدرس الشاملة وتثبيت الرحلة في ذهن الطفل",
    teacherScript:
      "وبكده يا أبطال وعلماء المستقبل نكون وصلنا لنهاية رحلتنا الجميلة النهاردة!\n\n" +
      "تعالوا نفتكر الرحلة كلها في ثواني بتسلسل سريع:\n" +
      "عرفنا إن النبات كائن ذاتي التغذية عنده مطبخ سحري في الورقة الخضراء؛ الجذور بتشفط المية والأملاح من التربة زي المصاصة، والساق يرفعها للأعلى في مواسير الخشب، والثغور في الورقة بتفتح بابها وتدخل غاز ثاني أكسيد الكربون، والكلوروفيل يصطاد ضوء الشمس عشان يطبخ كل ده جوه البلاستيدات الخضراء!\n" +
      "وفي النهاية بيطلع لنا حاجتين: سكر الجلوكوز (والنشا المتخزن في الحصالة) لتغذية النبات، وهديتنا الغالية غاز الأكسجين النقي عشان نتنفس ونعيش.. وكمان أثبتنا بالعيون في تجربة اليود إن الشمس هي سر الطبخة كلها!\n\n" +
      "أحلى تحية ليكم يا علماء المستقبل، اهتموا دايماً بزراعة النباتات والمحافظة عليها.. أشوفكم في درس جديد ومغامرة علمية ممتعة، والسلام عليكم ورحمة الله وبركاته!",
    flowVideoPrompt: "A dynamic 10-second uplifting 3D Pixar style wrap-up sequence for children: [0-3s]: A glowing happy green plant standing tall with water rising, sun shining, and oxygen bubbles drifting into a bright sky. [3-7s]: Smooth zoom revealing sparkling sugar crystals and a blooming vibrant flower on top of the plant. [7-10s]: Gentle pull-back to a lush sunny garden full of thriving green plants and cheerful sparkles. Mute visual action only, strictly NO talking characters, NO speaking faces, NO lip sync."
  },
  blackboardSummary: {
    title: "ملخص السبورة: درس عملية البناء الضوئي ومطبخ النبات (Photosynthesis)",
    keyVocabulary: [
      "كائنات ذاتية التغذية: الكائنات التي تصنع غذاءها بنفسها من مواد غير عضوية بسيطة.",
      "الكلوروفيل: الصبغة الخضراء في البلاستيدات المسؤولة عن امتصاص الطاقة الضوئية.",
      "الثغور: فتحات مجهرية لتبادل الغازات (دخول CO₂ وخروج O₂ وبخار الماء).",
      "أوعية الخشب: أنابيب وعائية صاعدة تنقل الماء والأملاح من الجذور للأوراق.",
      "سكر الجلوكوز: الغذاء الأساسي الناتج من البناء الضوئي والذي يمد النبات بالطاقة."
    ],
    definitions: [
      "معادلة البناء الضوئي: ماء (H₂O) + غاز ثاني أكسيد الكربون (CO₂) + ضوء الشمس (بواسطة الكلوروفيل) ⬅ سكر الجلوكوز (غذاء وطاقة) + غاز الأكسجين (O₂).",
      "النشا: الصورة المعقدة التي يخزن بها النبات سكر الجلوكوز الفائض عن حاجته."
    ],
    comparisons: [
      "المقارنة: الكائنات المستهلكة (كالإنسان والحيوان) تعتمد على غيرها في الغذاء وتتحرك لطلبه، بينما الكائنات المنتجة (كالنباتات) ثابتة وتصنع غذاءها ذاتياً."
    ],
    conclusions: [
      "ضوء الشمس هو مصدر الطاقة الأولي لجميع الكائنات الحية على الأرض.",
      "النباتات الخضراء هي رئة كوكب الأرض المسؤولة عن تجديد الأكسجين وامتصاص غاز الاحتباس الحراري (CO₂)."
    ]
  },
  checkUnderstanding: [
    {
      questionType: "من الحياة اليومية",
      question: "لو زرعنا أصيص ورد في حجرة مظلمة وسقيناه ماء بانتظام كل يوم، هل سيعيش؟ ولماذا بالتفصيل؟",
      correctAnswer: "لن يعيش وسيموت بعد بضعة أيام؛ لأن الماء وحده لا يكفي، فالنبات يحتاج ضوء الشمس لتنشيط صبغة الكلوروفيل لصنع سكر الجلوكوز، وبدون ضوء سيتوقف مطبخه وسينفد مخزونه من النشا فيموت جوعاً."
    },
    {
      questionType: "علل ولماذا",
      question: "علل: انتشار الثغور على السطح السفلي لأوراق النبات أكثر بكثير من سطحها العلوي؟",
      correctAnswer: "لتقليل فقدان الماء بالتبخر أثناء عملية النتح، حيث يكون السطح العلوي معرضاً بشكل مباشر لأشعة الشمس الحارقة والحرارة المرتفعة."
    },
    {
      questionType: "استنتاج ذكي",
      question: "ماذا يحدث لكوكب الأرض إذا اختفت النباتات الخضراء كلياً؟",
      correctAnswer: "ستنقطع السلسلة الغذائية كلياً وتموت الكائنات المستهلكة جوعاً، كما سينفد غاز الأكسجين ويتراكم غاز ثاني أكسيد الكربون السام وتختنق وتموت جميع أشكال الحياة الهوائية."
    }
  ]
};

// ============================================================================
// خطط أنيميشن الباوربوينت التفصيلية الاسترشادية (كل حركة: العنصر + يجي منين + يروح فين + نوع الأنيميشن)
// ============================================================================
const SAMPLE_HOOK_PPT_PLAN: PptAnimationPlan = {
  slideTitle: "شريحة 0 (الدخلة التمهيدية): لغز الجوع والثلاجة مقابل الشجرة الثابتة",
  slideLayout:
    "الشريحة مقسومة نصفين بتصميم كرتوني مبهج: النصف الأيمن مطبخ دافئ به ثلاجة مغلقة وطفل يمسك بطنه من الجوع، والنصف الأيسر بلكونة مشمسة بها أصيص نبات أخضر وشمس ذهبية في الأعلى وعلامات استفهام متفرقة.",
  movements: [
    {
      stepNumber: 1,
      trigger: "كليك 1 (مع بداية التحية وعنوان الدرس)",
      element: "لافتة عنوان الدرس الكرتونية + شخصية الطفل الجائع",
      fromWhere: "اللافتة تنزل من أعلى الشريحة، والطفل يدخل من أقصى يمين الشريحة",
      toWhere: "اللافتة تستقر في أعلى المنتصف، والطفل يقف أمام الثلاجة في النصف الأيمن",
      animationType: "Fly In (دخول طيران من الأعلى واليمين) + Bounce (ارتداد لطيف)",
      detailedAction: "تنزل لافتة العنوان بنعومة، ثم يدخل الطفل وهو يضع يده على بطنه وتظهر فوق رأسه فقاعة تفكير فيها علامة جوع تتحرك بنبض خفيف (Pulse).",
      syncWithTeacher: "مع جملة: (السلام عليكم ورحمة الله وبركاته... لما بنرجع من المدرسة بنحس إن جسمنا هبطان وبطننا بتصوصو)"
    },
    {
      stepNumber: 2,
      trigger: "كليك 2 (تلقائي مع ذكر المطبخ والثلاجة)",
      element: "باب الثلاجة + طبق الساندوتش الساخن + شريط طاقة أخضر",
      fromWhere: "باب الثلاجة يفتح من اليسار لليمين، وطبق الساندوتش يخرج من داخل الثلاجة",
      toWhere: "يتحرك الساندوتش في مسار منحني (Motion Path) نحو يد الطفل، ويرتفع شريط الطاقة للأعلى",
      animationType: "Wipe (فتح الباب) + Motion Path (مسار حركة للساندوتش) + Grow/Turn (تكبير شريط الطاقة)",
      detailedAction: "يفتح باب الثلاجة فيخرج ضوء أصفر دافئ، ويطير الساندوتش من جوه الثلاجة ليد الطفل، فينور جسم الطفل ويرتفع مؤشر البطارية بجانبه من الأحمر إلى الأخضر الكامل.",
      syncWithTeacher: "مع جملة: (نفتح التلاجة، ماما تعمل لنا أحلى ساندوتش.. أول ما ناكل نحس إن روحنا ردت فينا وبقى عندنا باور وطاقة!)"
    },
    {
      stepNumber: 3,
      trigger: "كليك 3 (مع الانتقال لسؤال الشجرة)",
      element: "الشجرة الخضراء في الأصيص + علامة ممنوع المشي / ممنوع الدليفري",
      fromWhere: "تظهر الشجرة من أسفل النصف الأيسر، وتدخل أيقونة الدليفري من أقصى اليسار",
      toWhere: "تستقر الشجرة في البلكونة اليسرى، وتتحرك أيقونة الدليفري نحوها ثم يظهر عليها علامة (✗) حمراء وتختفي",
      animationType: "Zoom In (ظهور الشجرة) + Fly In + Spin & Fade Out (لعلامة الدليفري)",
      detailedAction: "تظهر النبتة ثابتة جذورها في الطين، وتقترب منها عربة تسوق صغيرة من اليسار فتظهر علامة خطأ حمراء كبيرة بتأثير نبض (Pulse) لتوضح أن الشجرة لا تتحرك ولا تشتري طعاماً.",
      syncWithTeacher: "مع جملة: (طب فكرتوا مرة في الشجرة اللي واقفة في الشارع؟ عمركم شفتوا شجرة بتطلب دليفري أو بتمشي تروح السوبر ماركت؟ لأ طبعاً!)"
    },
    {
      stepNumber: 4,
      trigger: "كليك 4 (مع كشف سر مطبخ الورقة)",
      element: "عدسة مكبرة ذهبية + ورقة النبات المضيئة + علامات الاستفهام السحرية",
      fromWhere: "تتحرك العدسة المكبرة من الركن العلوي الأيسر",
      toWhere: "تتجه العدسة بمسار مائل لتقف مباشرة فوق ورقة النبات الخضراء في المنتصف وتكبرها",
      animationType: "Motion Path (مسار حركة للعدسة) + Grow/Shrink (تكبير الورقة 150%) + Flash (وميض ذهبي)",
      detailedAction: "تتحرك العدسة المكبرة لتستقر فوق الورقة، فتكبر الورقة وتصبح شفافة يظهر بداخلها شكل مطبخ كرتوني صغير مضيء تتطاير منه نجوم ذهبية.",
      syncWithTeacher: "مع جملة: (طب بتاكل منين وبتجيب طاقتها إزاي وهي ثابتة؟ ده السر العظيم والمعجزة اللي هنكتشفها سوا النهاردة!)"
    }
  ]
};

const SAMPLE_BEATS_PPT_PLANS: Record<number, PptAnimationPlan> = {
  1: {
    slideTitle: "شريحة 1: مقارنة حية بين الكائنات المستهلكة والكائنات ذاتية التغذية",
    slideLayout: "الشريحة مقسومة بخط رأسي مضيء: على اليمين غابة صغيرة بها أرنب وقطة وطفل، وعلى اليسار نبتة عباد شمس جميلة تحت الشمس وجذورها في التربة.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "بطاقة (الكائنات المستهلكة) + الأرنب والجزرة",
        fromWhere: "الأرنب يدخل قافزاً من أقصى يمين الشريحة، والجزرة تظهر أمامه في العشب",
        toWhere: "يتحرك الأرنب بمسار أفقي نحو الجزرة في يمين المنتصف ويلتهمها",
        animationType: "Motion Path (مسار قفز للأرنب) + Disappear (اختفاء الجزرة عند التقاء الأرنب بها)",
        detailedAction: "يقفز الأرنب من اليمين إلى الجزرة فتختفي الجزرة تدريجياً وتظهر فوق الأرنب لافتة (كائن مستهلك: يعتمد على غيره).",
        syncWithTeacher: "مع جملة: (النوع الأول هو إحنا والحيوانات.. اسمنا العلمي كائنات مستهلكة، لازم نروح ندور على كائن تاني ناكله)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "نبتة عباد الشمس في النصف الأيسر + هالة ضوئية خضراء",
        fromWhere: "تنبت وتكبر من أسفل يسار الشريحة نحو الأعلى",
        toWhere: "تستقر شامخة في منتصف القسم الأيسر من الشريحة",
        animationType: "Wipe Up (نمو من الأسفل للأعلى) + Pulse (نبض أخضر متوهج)",
        detailedAction: "ترتفع النبتة من التربة للأعلى وتحيط بأوراقها هالة خضراء لامعة توحي بأنها تعمل وتنتج غذاءها في مكانها دون حركة.",
        syncWithTeacher: "مع جملة: (لكن النوع التاني وهو النبات: هو المعجزة الفريدة! بيصنع وجبته الغذائية بنفسه من الصفر)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "شعاع شمس + قطرة ماء + مكعبات سكر مضيئة داخل النبتة",
        fromWhere: "الشعاع ينزل من أعلى اليسار، والقطرة تصعد من أسفل الجذر",
        toWhere: "يلتقيان في قلب الورقة الخضراء بمنتصف النبتة فيتحولان لمكعبات سكر",
        animationType: "Motion Path (مسارات متلاقية في الورقة) + Zoom In (ظهور مكعبات السكر)",
        detailedAction: "يتحرك شعاع الشمس من الأعلى وقطرة الماء من الأسفل في نفس اللحظة (With Previous) ليدخلا الورقة، وفور التقائهما يظهر مكعب سكر ذهبي يلمع داخل الورقة.",
        syncWithTeacher: "مع جملة: (بيغذي نفسه بنفسه جوه خلاياه من غير مساعدة من أي مخلوق)"
      },
      {
        stepNumber: 4,
        trigger: "كليك 4",
        element: "بطاقة المصطلح الرسمي (كائنات ذاتية التغذية - Autotrophs)",
        fromWhere: "تنبثق من خلف النبتة في القسم الأيسر",
        toWhere: "تستقر في أعلى يسار الشريحة مع إطار ذهبي لامع",
        animationType: "Zoom (تكبير تدريجي) + Glow (توهج الإطار)",
        detailedAction: "تظهر بطاقة تعريف الكتاب بخط واضح وكبير وتومض مرتين لتثبيت المصطلح في عين الطالب.",
        syncWithTeacher: "مع جملة: (وعلشان كده في كتاب المدرسة بنسميه: كائن ذاتي التغذية!)"
      }
    ]
  },
  2: {
    slideTitle: "شريحة 2: المقادير الثلاثة لمطبخ النبتة (الماء + ثاني أكسيد الكربون + ضوء الشمس)",
    slideLayout: "في منتصف الشريحة تماماً نبتة خضراء كبيرة مكتوب على ورقتها (مطبخ النبتة)، وحولها 3 دوائر فارغة مرقمة (1 في الأسفل، 2 في اليسار، 3 في الأعلى).",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "المكون (1): قطرات الماء الزرقاء وحبيبات الأملاح المتلألئة",
        fromWhere: "تبدأ من أسفل الشريحة داخل طبقة التربة البنية",
        toWhere: "تتحرك للأعلى لتستقر في الدائرة رقم (1) عند الجذور ثم يمتد منها سهم أزرق للورقة",
        animationType: "Fly In From Bottom (دخول من الأسفل) + Wipe Up للسهم الأزرق",
        detailedAction: "تخرج 3 قطرات ماء زرقاء مع نقاط أملاح فضية من التربة في الأسفل وتصعد للدائرة الأولى، ثم ينطلق سهم أزرق منقط يشير إلى الورقة.",
        syncWithTeacher: "مع جملة: (أول حاجة: المية والأملاح المعدنية من التربة)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "المكون (2): سحابة وفقاعات غاز ثاني أكسيد الكربون (CO₂)",
        fromWhere: "تدخل من أقصى يسار الشريحة (من الهواء الجوي)",
        toWhere: "تسبح أفقياً لتستقر في الدائرة رقم (2) يسار الورقة ويمتد منها سهم للورقة",
        animationType: "Float In + Motion Path (مسار تموجي من اليسار لمنتصف الشريحة)",
        detailedAction: "تتحرك كرات غاز مكتوب عليها (CO₂) في مسار متموج كالهواء من أقصى اليسار وتقترب من الورقة وتدخل فيها.",
        syncWithTeacher: "مع جملة: (تاني حاجة: غاز من الهواء اسمه ثاني أكسيد الكربون)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "المكون (3): قرص الشمس المبتسم وأشعته الذهبية",
        fromWhere: "يظهر قرص الشمس في الركن العلوي الأيمن، وتنطلق منه 3 أسهم ضوئية ذهبية",
        toWhere: "تتجه الأسهم الذهبية بزاوية مائلة من أعلى اليمين إلى قلب الورقة الخضراء في المنتصف",
        animationType: "Zoom In (للشمس) + Motion Path Diagonal (مسار مائل للأشعة الذهبية)",
        detailedAction: "تشرق الشمس في أعلى اليمين وتدور ببطء (Spin خفيف)، وتندفع منها أشعة ذهبية لتصطدم بسطح الورقة فتنير الورقة كلها.",
        syncWithTeacher: "مع جملة: (وتالت حاجة: الطاقة السحرية اللي بتسوي كل ده وهي ضوء الشمس!)"
      },
      {
        stepNumber: 4,
        trigger: "كليك 4 (تجربة ماذا لو غاب مكون؟)",
        element: "ستارة مظلمة صغيرة تحجب الشمس مؤقتاً + انحناء الورقة",
        fromWhere: "تنزل غيمة سوداء صغيرة من الأعلى لتغطي الشمس لثانيتين",
        toWhere: "تقف أمام الشمس فتبهت الورقة، ثم تختفي الغيمة فتعود الورقة مشرقة",
        animationType: "Fly In From Top + Color Pulse (تغير لون الورقة ثم عودتها للون الأخضر الزاهي)",
        detailedAction: "حركة بصرية سريعة توري الطفل إننا لو خبينا الشمس، السهم الذهبي بيقف والورقة بتطفي، ولما ترجع الشمس الورقة تنور تاني.",
        syncWithTeacher: "مع جملة: (ولو غاب مكون واحد بس من التلاتة دول، المطبخ يقف والطبخة تبوظ!)"
      }
    ]
  },
  3: {
    slideTitle: "شريحة 3: تحت الأرض - الشعيرات الجذرية كالمصاصات تشتغل وتشفط الماء",
    slideLayout: "مقطع عرضي مكبر تحت سطح التربة: على اليسار جذر النبات الرئيسي، وفي المنتصف عدسة زووم مكبرة جداً تُظهر شعيرة جذرية أنبوبية رقيقة وسط حبيبات الطين الزرقاء والبنية.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "شبكة الجذور المتفرعة تحت التربة",
        fromWhere: "تمتد من قاعدة الساق في أعلى الشريحة",
        toWhere: "تتفرع وتنزل إلى عمق التربة في أسفل الشريحة يميناً ويساراً",
        animationType: "Wipe Down (مسح تدريجي من الأعلى للأسفل يحاكي نمو الجذر)",
        detailedAction: "تظهر فروع الجذر وهي تمتد داخل الطين لتثبت الشجرة في مكانها.",
        syncWithTeacher: "مع جملة: (النبتة عندها شبكة جذور قوية متفرعة تحت الطين)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "دائرة الزووم المجهري + الشعيرات الجذرية الرقيقة",
        fromWhere: "تخرج دائرة الزووم من طرف الجذر الصغير",
        toWhere: "تكبر لتحتل منتصف ويمين الشريحة كاشفةً جدار الشعيرة الجذرية الشفاف",
        animationType: "Zoom In (تكبير من نقطة الجذر إلى المنتصف) + Appear",
        detailedAction: "تفتح نافذة ميكروسكوب كبيرة توضح شكل الشعيرة الجذرية كأنها شفاطة عصير جدارها رقيق جداً وشفاف.",
        syncWithTeacher: "مع جملة: (مليانة شعيرات مجهرية دقيقة جداً اسمها الشعيرات الجذرية عاملة زي الشفاطات)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "جزيئات الماء الزرقاء + أيونات الأملاح المعدنية (كالسيوم ومغنيسيوم)",
        fromWhere: "تبدأ من الفجوات الموجودة بين حبيبات الطين خارج الشعيرة (أقصى اليمين والأسفل)",
        toWhere: "تتحرك عبر الجدار الرقيق وتدخل إلى جوف الشعيرة الجذرية ثم تتجه لليسار نحو الجذر الرئيسي",
        animationType: "Motion Path (مسار سحب وشفط من الخارج إلى داخل الشعيرة ثم لليسار)",
        detailedAction: "تتحرك الكرات الزرقاء (الماء) والنجوم الصفراء (الأملاح) واحداً تلو الآخر مخترقة الجدار الرقيق للشعيرة الجذرية وتجري بداخلها كأنها تُشفط بمصاصة.",
        syncWithTeacher: "مع جملة: (جدارها رقيق خالص علشان تقدر تشفط جزيئات المية المحشورة بين حبيبات الطين وتسحب الأملاح)"
      }
    ]
  },
  4: {
    slideTitle: "شريحة 4: مصعد أوعية الخشب - صعود الماء من الجذر إلى الورقة في اتجاه واحد",
    slideLayout: "في منتصف الشريحة ساق نبات طويل مرسوم بمقطع طولي شفاف يظهر بداخله أنابيب رأسية زرقاء (أوعية الخشب) تمتد من الجذر في الأسفل إلى الأوراق في الأعلى، وبجانبها رسم مصعد (أسانسير) للتشبيه.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "الطبقة الخارجية للساق + أنابيب أوعية الخشب الداخلية",
        fromWhere: "الطبقة الخارجية تفتح وتنسحب لليمين واليسار",
        toWhere: "تظهر من خلفها في المنتصف مواسير أوعية الخشب الزجاجية الشفافة",
        animationType: "Split Out (انقسام القشرة الخارجية) + Fade In (ظهور مواسير الخشب)",
        detailedAction: "ينفتح ساق النبات طولياً كالستارة ليكشف للطفل أن الساق ليس مصمتاً بل بداخله مواسير طويلة متصلة من تحت لفوق.",
        syncWithTeacher: "مع جملة: (ساق النبات مش عصاية مصمتة، دي مليانة شبكة مواسير وأنابيب دقيقة اسمها أوعية الخشب)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "أيقونة المصعد السريع (الأسانسير) + سهم الاتجاه الواحد (⬆️)",
        fromWhere: "يبدأ المصعد من أسفل يمين الساق عند مستوى التربة",
        toWhere: "يصعد عمودياً في خط مستقيم إلى قمة الساق عند الورقة",
        animationType: "Motion Path Up (مسار حركة رأسي صاعد) + Flash",
        detailedAction: "يتحرك صندوق أسانسير لطيف بداخله قطرة ماء من الدور الأرضي (الجذر) إلى الدور الأخير (الورقة) مع إضاءة أسهم خضراء تشير للأعلى فقط.",
        syncWithTeacher: "مع جملة: (عاملة زي مواسير المياه في العمارة أو زي أسانسير سريع في اتجاه واحد من تحت لفوق!)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "سلسلة قطرات الماء والأملاح المتدفقة داخل أوعية الخشب",
        fromWhere: "تنطلق من الجذور في أسفل الشريحة",
        toWhere: "تصعد داخل أنبوبة الخشب في منتصف الساق ثم تنعطف يميناً ويساراً لتدخل عروق الأوراق في الأعلى",
        animationType: "Custom Motion Path (مسار حرف T مقلوب: صعود رأسي ثم تفرع داخل الورقة)",
        detailedAction: "تتدفق صفوف متتالية من الكرات الزرقاء المضيئة من الجذر صعوداً داخل أنبوبة الخشب حتى تصل لعرق الورقة الخضراء وتملأها.",
        syncWithTeacher: "مع جملة: (بتسحب المية والأملاح وتفضل تضخها للأعلى عبر الساق والفروع لحد ما توصلها لباب المطبخ في الورقة!)"
      }
    ]
  },
  5: {
    slideTitle: "شريحة 5: تشريح الورقة الخضراء واكتشاف أفران البلاستيدات الخضراء",
    slideLayout: "على اليمين ورقة نبات خضراء عريضة مفرودة في الشمس، وفي المنتصف واليسار قطاع مجهري ثلاثي الأبعاد لخلايا الورقة يوضح صفوف الخلايا وبداخلها البلاستيدات الخضراء البيضاوية.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "الورقة الخضراء العريضة + أشعة الشمس الساقطة عليها",
        fromWhere: "الورقة تظهر في يمين الشريحة، والأشعة تنزل عليها من الأعلى",
        toWhere: "تمتد الورقة أفقياً كالصينية المفرودة لتستقبل كل الأشعة الساقطة",
        animationType: "Zoom In + Float (رفرفة خفيفة للورقة)",
        detailedAction: "تظهر الورقة مفرودة وعريضة وتنزل عليها أسهم الضوء على كامل مساحتها لتوضيح لماذا خلقها الله مسطحة وعريضة.",
        syncWithTeacher: "مع جملة: (لأن الورقة مسطحة ورقيقة وعريضة ومفروشة في الهوا زي الصينية، فتقدر تجمع أكبر قدر من الشمس)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "شعاع زووم الميكروسكوب + مقطع خلايا الورقة",
        fromWhere: "ينطلق شعاع التكبير من منتصف الورقة في اليمين",
        toWhere: "يتمدد نحو النصف الأيسر من الشريحة ليفتح قطاع الخلايا النباتية",
        animationType: "Wipe Left (مسح من اليمين لليسار) + Zoom In",
        detailedAction: "يمتد مخروط تكبير من سطح الورقة ليُظهر للطفل شكل الخلايا المنظمة كالطوب المرصوص جوه الورقة.",
        syncWithTeacher: "مع جملة: (ولما ناخد قطاع في الورقة ونبص بالميكروسكوب، هنلاقي جواها خلايا منظمة)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "عضيات البلاستيدات الخضراء (Chloroplasts) داخل الخلايا",
        fromWhere: "تظهر داخل سيتوبلازم كل خلية في القسم الأيسر",
        toWhere: "تتحرك حركة دائرية انسيابية داخل الخلية وتكبر إحداها في المقدمة",
        animationType: "Zoom In + Circular Motion Path (دوران خفيف داخل الخلية) + Glow",
        detailedAction: "تنور كبسولات خضراء زاهية داخل الخلايا وتتحرك بنعومة، ثم تخرج واحدة منها للأمام وتكبر مكتوباً عليها (البلاستيدة الخضراء = مطبخ وفرن النبتة).",
        syncWithTeacher: "مع جملة: (فيها معامل صغيورة لونها أخضر زاهي اسمها البلاستيدات الخضراء.. دي هي أفران ومطابخ النبتة!)"
      }
    ]
  },
  6: {
    slideTitle: "شريحة 6: صبغة الكلوروفيل كألواح الطاقة الشمسية تصطاد الضوء",
    slideLayout: "في المنتصف بلاستيدة خضراء كبيرة مفتوحة تظهر بداخلها أقراص خضراء مرصوصة (الكلوروفيل)، وفي أعلى اليمين صورة لوح طاقة شمسية وشمس مشرقة.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "أقراص صبغة الكلوروفيل الخضراء + بطاقة تشبيه ألواح الطاقة الشمسية",
        fromWhere: "تظهر الأقراص الخضراء من داخل البلاستيدة، ويدخل لوح الطاقة الشمسية من أعلى اليمين",
        toWhere: "تستقر الأقراص في قلب البلاستيدة بالمنتصف، ويقف لوح الطاقة بجانبها للمقارنة",
        animationType: "Fly In + Pulse (وميض باللون الأخضر الزمردي)",
        detailedAction: "تتلألأ حبيبات الكلوروفيل باللون الأخضر الزاهي مع ظهور علامة يساوي (=) تربط بينها وبين ألواح الطاقة الشمسية.",
        syncWithTeacher: "مع جملة: (ربنا حط جواها صبغة كيميائية سحرية اسمها الكلوروفيل.. عامل بالظبط زي ألواح الطاقة الشمسية!)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "كرات الطاقة الضوئية الذهبية (فوتونات الشمس)",
        fromWhere: "تنطلق من قرص الشمس في أعلى الشريحة",
        toWhere: "تهبط بسرعة في مسارات مائلة لتسقط مباشرة فوق أقراص الكلوروفيل الخضراء وتنحبس بداخلها",
        animationType: "Motion Path Down (مسار هبوط سريع) + Bounce",
        detailedAction: "تنزل كرات ذهبية مضيئة من الشمس وتدخل جوه أقراص الكلوروفيل، وأول ما تلمسها يقفل عليها قوس مضيء علامة على اصطياد الطاقة وحبسها.",
        syncWithTeacher: "مع جملة: (وظيفته الأولى إنه يصطاد فوتونات وأشعة الشمس الذهبية ويحبس طاقتها جواه)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "توهج البلاستيدة بالكامل وتحول الطاقة",
        fromWhere: "يبدأ التوهج من حبيبات الكلوروفيل في المركز",
        toWhere: "ينتشر التوهج الذهبي-الأخضر ليشمل البلاستيدة كلها مع ظهور شرارات طاقة",
        animationType: "Pulse + Grow/Shrink + Glow (توهج حراري وطاقة)",
        detailedAction: "تتحول البلاستيدة إلى فرن نشط يبرق باللون الذهبي والأخضر استعداداً لبدء تفاعل الطبخ.",
        syncWithTeacher: "مع جملة: (ضوء الشمس ده هو البوتاجاز اللي هيسخن ويدمج المكونات مع بعضها!)"
      }
    ]
  },
  7: {
    slideTitle: "شريحة 7: بوابات الثغور والخلايا الحارسة على السطح السفلي للورقة",
    slideLayout: "في اليمين ورقة نبات تنقلب ليظهر سطحها السفلي، وفي المنتصف واليسار تكبير مجهري لفتحة ثغر يحرسها خليتان حارستان كلويتا الشكل، وخارجها جزيئات غاز ثاني أكسيد الكربون.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "ورقة النبات + سهم يشير للسطح السفلي",
        fromWhere: "الورقة في يمين الشريحة تدور حول محورها",
        toWhere: "تستقر مقلوبة ليظهر سطحها السفلي المليء بالنقاط الدقيقة (الثغور)",
        animationType: "Spin / Flip (حركة قلب الورقة) + Zoom على السطح السفلي",
        detailedAction: "تنقلب الورقة أمام عين الطالب وتظهر عدسة مكبرة على ظهر الورقة السفلي تكشف المسام الدقيقة.",
        syncWithTeacher: "مع جملة: (لو قلبنا الورقة وبصينا على سطحها السفلي بالميكروسكوب، هنلاقي فتحات ومسام دقيقة اسمها الثغور)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "الخليتان الحارستان (Guard Cells) على جانبي فتحة الثغر",
        fromWhere: "تكون الخليتان متلاصقتين في البداية (الباب مغلق) في منتصف الشريحة",
        toWhere: "تتحرك الخلية اليمنى قليلاً لليمين والخلية اليسرى قليلاً لليسار فتنفتح بوابة الثغر بينهما",
        animationType: "Motion Path Left & Right (تباعد الخليتين الحارستين لفتح البوابة)",
        detailedAction: "تنتفخ الخليتان الحارستان وتتباعدان عن بعضهما فيظهر ممر مفتوح في المنتصف تماماً مثل بوابة القلعة التي يفتحها الحارسان مع شروق الشمس.",
        syncWithTeacher: "مع جملة: (كل فتحة ثغر عليها حارسين شطار اسمهم الخلايا الحارسة.. بتفتح الباب أول ما تطلع شمس الصباح)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "كرات غاز ثاني أكسيد الكربون (CO₂)",
        fromWhere: "تبدأ من الهواء الخارجي أسفل الشريحة خارج الورقة",
        toWhere: "تعبر من خلال فتحة الثغر المفتوحة وتصعد إلى داخل نسيج الورقة والبلاستيدات",
        animationType: "Motion Path Upward (مسار عبور عبر البوابة المفتوحة للداخل)",
        detailedAction: "تمر 4 فقاعات مكتوب عليها (CO₂) من تحت الورقة وتدخل من بين الخليتين الحارستين مباشرة إلى داخل مطبخ الورقة.",
        syncWithTeacher: "مع جملة: (عشان يدخل غاز ثاني أكسيد الكربون، وتقفل الباب في عز الحر عشان النبتة ما تعطش!)"
      }
    ]
  },
  8: {
    slideTitle: "شريحة 8: الطبخة الكبرى داخل البلاستيدة وإنتاج سكر الجلوكوز وتوزيعه",
    slideLayout: "في المنتصف بلاستيدة خضراء كبيرة كغرفة تفاعل، يدخلها سهم ماء من اليمين وسهم CO₂ من اليسار وشعاع شمس من الأعلى، ويخرج منها جزيء سكر جلوكوز سداسي لامع يتجه لأنابيب اللحاء.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "جزيئات الماء (H₂O) + جزيئات ثاني أكسيد الكربون (CO₂)",
        fromWhere: "الماء يدخل من يمين البلاستيدة، وثاني أكسيد الكربون يدخل من يسار البلاستيدة",
        toWhere: "يتحركان نحو مركز البلاستيدة الخضراء في منتصف الشريحة",
        animationType: "Motion Path (مساران متقابلان يلتقيان في المركز)",
        detailedAction: "تندفع الكرات الزرقاء (الماء) من اليمين والكرات البنفسجية (CO₂) من اليسار ليقفوا وجهاً لوجه في قلب البلاستيدة.",
        syncWithTeacher: "مع جملة: (المية جت من الجذور، وثاني أكسيد الكربون دخل من الثغور)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "شرارة الطاقة الضوئية من الكلوروفيل + تفكك واتحاد الذرات",
        fromWhere: "تنطلق شرارة ذهبية من أقراص الكلوروفيل أعلى البلاستيدة",
        toWhere: "تصطدم بجزيئات الماء والغاز في المركز فتدور الذرات وتتحد معاً",
        animationType: "Flash + Spin (دوران سريع للذرات واندماجها)",
        detailedAction: "تومض شرارة ضوئية فتتفكك كرات الماء وتتشابك مع ذرات الكربون مثل قطع البازل السحرية.",
        syncWithTeacher: "مع جملة: (جوة البلاستيدة بيحصل تفاعل كيميائي معجز: ذرات المية بتتفكك وتتحد مع ذرات الكربون)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "بلورة سكر الجلوكوز السداسية الذهبية (C₆H₁₂O₆)",
        fromWhere: "تنبثق من نقطة التفاعل في مركز البلاستيدة",
        toWhere: "تكبر في المنتصف ثم تنطلق منها نسخ صغيرة عبر أنابيب اللحاء إلى الزهرة، الساق، والجذر",
        animationType: "Zoom In (ظهور الجلوكوز) + Multi Motion Paths (توزيع لكل أجزاء النبات)",
        detailedAction: "تظهر بلورة سداسية ذهبية مكتوب عليها (سكر الجلوكوز - غذاء النبات)، ثم تتحرك بلورات صغيرة منها في أنابيب اللحاء صعوداً للزهرة وهبوطاً للجذر فتنمو النبتة وتزهر.",
        syncWithTeacher: "مع جملة: (وتكون الناتج الأساسي: سكر الجلوكوز! بينقله في أوعية اللحاء لكل حتة في النبات عشان يكبر)"
      }
    ]
  },
  9: {
    slideTitle: "شريحة 9: حصالة النبات الذكية - تحويل الجلوكوز الفائض إلى سلاسل نشا",
    slideLayout: "في اليمين مكعبات سكر جلوكوز منفردة كثيرة، وفي المنتصف سهم تحويل، وفي اليسار مخزن/حصالة النبات (ثمرة بطاطس وحبة قمح وورقة) بداخلها سلاسل لؤلؤية بيضاء من النشا.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "مكعبات سكر الجلوكوز الفائضة",
        fromWhere: "تتجمع وتزدحم في القسم الأيمن من الشريحة داخل خلية الورقة",
        toWhere: "تصطف في طابور منظم في منتصف الشريحة",
        animationType: "Fly In + Motion Path (اصطفاف المكعبات بجانب بعضها)",
        detailedAction: "تظهر 6 أشكال سداسية ذهبية لسكر الجلوكوز وتتحرك لتقف في صف واحد جنباً إلى جنب.",
        syncWithTeacher: "مع جملة: (يا ترى لو طبخت كمية كبيرة زادت عن حاجتها اليومية، هترميها؟ لأ طبعاً!)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "روابط كيميائية مضيئة + تحول الجلوكوز إلى سلسلة نشا بيضاء",
        fromWhere: "تظهر حلقات ربط بين مكعبات الجلوكوز في المنتصف",
        toWhere: "تندمج المكعبات معاً وتتحول إلى عقد لؤلؤي أبيض طويل (جزيء النشا)",
        animationType: "Wipe + Color Change / Morph (تحول السلسلة إلى حبيبات نشا بيضاء)",
        detailedAction: "تمسك وحدات الجلوكوز بأيدي بعضها فيتغير لونها من الذهبي المنفرد إلى سلسلة بيضاء متماسكة مكتوب عليها (نشا مخزن).",
        syncWithTeacher: "مع جملة: (بتاخد جزيئات الجلوكوز وتربطها في سلاسل معقدة وتخزنها في صورة نشا)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "حبيبات النشا البيضاء + أيقونة الليل والشتاء",
        fromWhere: "تتحرك سلاسل النشا من المنتصف",
        toWhere: "تدخل إلى داخل رسمة ثمرة البطاطس والجذر والورقة في القسم الأيسر (حصالة النبات)",
        animationType: "Motion Path Left (دخول النشا للحصالة) + Appear (ظهور الهلال والليل)",
        detailedAction: "تنتقل حبيبات النشا لتتخزن داخل البطاطس والورقة، ثم يظهر هلال الليل في الأعلى فتخرج قطعة سكر من الحصالة لتتغذى عليها النبتة ليلاً.",
        syncWithTeacher: "مع جملة: (ولما يجي الليل والشمس تغيب، النبتة تفتح حصالة النشا وتاكل منها عشان تفضل عايشة!)"
      }
    ]
  },
  10: {
    slideTitle: "شريحة 10: هدية النبات لكوكب الأرض - انطلاق غاز الأكسجين (O₂)",
    slideLayout: "على اليمين ورقة نبات خضراء مفتوحة الثغور، وفي المنتصف سماء صافية تسبح فيها فقاعات أكسجين سماوية مضيئة، وعلى اليسار طفل وطائر وكوكب الأرض يتنفسون بسعادة.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1",
        element: "فقاعات غاز الأكسجين السماوية اللامعة (O₂)",
        fromWhere: "تبدأ من داخل البلاستيدة الخضراء في الورقة (أقصى اليمين)",
        toWhere: "تتحرك نحو فتحات الثغور في أسفل الورقة وتنطلق للخارج في الهواء",
        animationType: "Motion Path Outward (مسار خروج من داخل الورقة عبر الثغور للهواء)",
        detailedAction: "تخرج كرات سماوية مضيئة مكتوب عليها (O₂) من بوابة الثغر في الورقة وتندفع إلى الهواء الخارجي.",
        syncWithTeacher: "مع جملة: (اتبقى غاز عظيم اسمه غاز الأكسجين.. فبيطلعه ويطرده برة في الهواء عبر الثغور)"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2",
        element: "تيار فقاعات الأكسجين الصاعد في الهواء",
        fromWhere: "يتحرك من جوار الورقة في اليمين",
        toWhere: "يطير في مسار قوسي عبر منتصف الشريحة نحو الطفل والطائر في القسم الأيسر",
        animationType: "Arc Motion Path (مسار قوسي من اليمين إلى اليسار) + Float",
        detailedAction: "تسبح فقاعات الأكسجين النقية في الهواء من الورقة وتتجه نحو أنف الطفل والطائر المحلق في السماء.",
        syncWithTeacher: "مع جملة: (غاز الأكسجين النقي ده هو اللي إحنا وكل إنسان وحيوان وطير بنتنفسه علشان نفضل عايشين!)"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3",
        element: "مجسم كوكب الأرض الأخضر محاطاً بالأشجار كالرئتين",
        fromWhere: "يظهر في منتصف الشريحة من الخلف ويكبر للأمام",
        toWhere: "يستقر في المركز محاطاً بهالة خضراء ونبض تنفس منتظم",
        animationType: "Zoom In + Pulse (نبض شهيق وزفير لكوكب الأرض)",
        detailedAction: "يظهر كوكب الأرض وعليه غابات خضراء تتحرك بحركة شهيق وزفير لطيفة مع لافتة ذهبية: (النباتات = رئة كوكب الأرض).",
        syncWithTeacher: "مع جملة: (علشان كده بنقول دايماً إن النباتات هي رئة كوكب الأرض اللي بتنقي الجو!)"
      }
    ]
  }
};

const SAMPLE_EXPERIMENT_PPT_PLAN: PptAnimationPlan = {
  slideTitle: "شريحة الباوربوينت التفاعلية للتجربة: إثبات أهمية الضوء لتكوين النشا باستخدام اليود",
  slideLayout: "طاولة معمل علوم كرتونية منظمة مقسمة إلى 4 محطات متتالية من اليمين لليسار: (1) أصيص النبات والشريط الأسود، (2) كأس الماء المغلي، (3) أنبوبة الكحول في الحمام المائي، (4) طبق بتري وقطارة محلول اليود.",
  movements: [
    {
      stepNumber: 1,
      trigger: "كليك 1 (الخطوة الأولى في المعمل)",
      element: "شريط الورق الأسود المعتم + مشبك الورق + أشعة الشمس",
      fromWhere: "يتحرك الشريط الأسود من رف الأدوات في أعلى اليمين",
      toWhere: "ينزل ليستقر فوق منتصف الورقة الخضراء تماماً بينما تسقط أسهم الشمس على طرفي الورقة المكشوفين",
      animationType: "Motion Path (مسار حركة للشريط الأسود نحو منتصف الورقة) + Wipe Down لأشعة الشمس",
      detailedAction: "يطبق الشريط الأسود على وسط الورقة فيحجب الضوء عن المستطيل الأوسط، وتنور أطراف الورقة المكشوفة بأشعة الشمس.",
      syncWithTeacher: "مع كلام الخطوة الأولى: (هنجيب شريط الورق الأسود المعتم ونلفه على حتة في نص الورقة ونثبته بمشبك)"
    },
    {
      stepNumber: 2,
      trigger: "كليك 2 (الخطوة الثانية: الغلي في الماء)",
      element: "الورقة المقطوفة + الملقط المعملي + فقاعات الماء المغلي",
      fromWhere: "يمسك الملقط الورقة من المحطة (1) في اليمين",
      toWhere: "ينقلها في مسار قوسي وينزلها داخل كأس الماء المغلي في المحطة (2)",
      animationType: "Arc Motion Path (نقل الورقة للكأس) + Pulse (غليان وفقاعات الماء)",
      detailedAction: "ينزع الشريط الأسود وتنتقل الورقة بالملقط لتنغمس في كأس الماء الذي يغلي وتتصاعد منه سحب بخار بيضاء لطيفة.",
      syncWithTeacher: "مع كلام الخطوة الثانية: (هنمسك الورقة بالملقط وننزلها في المية المغلية لمدة دقيقة واحدة بس)"
    },
    {
      stepNumber: 3,
      trigger: "كليك 3 (الخطوة الثالثة: الكحول والحمام المائي)",
      element: "الورقة + أنبوبة الكحول الإيثيلي داخل الحمام المائي + تغير الألوان",
      fromWhere: "تنتقل الورقة من كأس الماء في المحطة (2)",
      toWhere: "تدخل داخل أنبوبة الكحول الموضوعة في الحمام المائي بالمحطة (3)",
      animationType: "Motion Path + Color Change (تحول الكحول للأخضر والورقة للأبيض الشاحب)",
      detailedAction: "تدخل الورقة أنبوبة الكحول، وبالتدريج يخرج اللون الأخضر من الورقة ليلون سائل الكحول بالأخضر الزمردي بينما تصبح الورقة نفسها بيضاء مصفرة.",
      syncWithTeacher: "مع كلام الخطوة الثالثة: (صبغة الكلوروفيل دابت في الكحول وبقى لونه أخضر، والورقة طلعت لونها أبيض شاحب)"
    },
    {
      stepNumber: 4,
      trigger: "كليك 4 (الخطوة الرابعة والملاحظة: تقطير اليود وظهور اللون الأزرق الداكن)",
      element: "الورقة البيضاء في طبق بتري + قطارة محلول اليود البرتقالي + التلون بالأزرق المسود",
      fromWhere: "الورقة تنتقل لطبق بتري في المحطة (4) أقصى اليسار، والقطارة تنزل من الأعلى",
      toWhere: "تسقط قطرات اليود البرتقالية من القطارة فوق الورقة بالكامل",
      animationType: "Motion Path Down (لقطرات اليود) + Wipe Color Fill (تلون طرفي الورقة بالأزرق القاتم وبقاء المنتصف برتقالياً)",
      detailedAction: "تنزل 3 قطرات برتقالية من القطارة على الورقة، وفوراً يتغير لون طرفي الورقة (اللذين تعرضا للشمس) إلى اللون الأزرق الغامق المسود، بينما يظل الشريط الأوسط (الذي كان مغطى) بلون اليود البرتقالي الباهت مع ظهور علامة صح كبيرة (✓).",
      syncWithTeacher: "مع كلام الخطوة الرابعة والملاحظة: (الجزء المكشوف للشمس اتلون باللون الأزرق الغامق المسود! أما المستطيل اللي في النص فضل لونه بني برتقالي)"
    }
  ]
};

function getSafePptPlanForBeat(beat: ScientificBeat, idx: number): PptAnimationPlan {
  if (
    beat.pptAnimationPlan &&
    beat.pptAnimationPlan.slideTitle &&
    Array.isArray(beat.pptAnimationPlan.movements) &&
    beat.pptAnimationPlan.movements.length > 0
  ) {
    return beat.pptAnimationPlan;
  }

  // If this is the preset sample lesson (or matches beat 1..10 of photosynthesis), return the crafted sample plan
  if (SAMPLE_BEATS_PPT_PLANS[beat.beatNumber] && (beat.conceptTitle.includes("التغذية") || beat.conceptTitle.includes("المكونات") || beat.conceptTitle.includes("الجذور") || beat.conceptTitle.includes("الخشب") || beat.conceptTitle.includes("الورقة") || beat.conceptTitle.includes("الكلوروفيل") || beat.conceptTitle.includes("الثغور") || beat.conceptTitle.includes("الجلوكوز") || beat.conceptTitle.includes("النشا") || beat.conceptTitle.includes("الأكسجين"))) {
    return SAMPLE_BEATS_PPT_PLANS[beat.beatNumber];
  }

  // Dynamic detailed fallback generator for any custom/saved beat
  const term = beat.textbookTerm || beat.conceptTitle;
  return {
    slideTitle: `شريحة ${beat.beatNumber || idx + 1}: أنيميشن توضيحي مفصل لـ (${beat.conceptTitle})`,
    slideLayout: `خلفية تعليمية كرتونية واضحة مقسمة إلى: منطقة التشبيه الحياتي في اليمين، والمجسم العلمي التفاعلي لـ (${term}) في المنتصف، وبطاقة المصطلح والتعريف في اليسار.`,
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1 (مع بداية شرح الجزئية)",
        element: `عنوان الجزئية (${beat.conceptTitle}) + عناصر التشبيه التمهيدي`,
        fromWhere: "يدخل العنوان من أعلى الشريحة، وتدخل رسمة التشبيه من أقصى يمين الشريحة",
        toWhere: "يستقر العنوان في الأعلى، وتقف رسمة التشبيه في القسم الأيمن من الشريحة",
        animationType: "Fly In (دخول طيران ناعم) + Bounce",
        detailedAction: `تظهر رسمة التشبيه المذكور في كلام المعلمة وتتحرك لجذب انتباه الطفل قبل إظهار الشكل العلمي لـ (${term}).`,
        syncWithTeacher: `مع بداية كلام المعلمة في الجزئية ${beat.beatNumber || idx + 1}`
      },
      {
        stepNumber: 2,
        trigger: "كليك 2 (أثناء شرح الآلية العلمية)",
        element: `المجسم العلمي الرئيسي لـ (${term}) والأسهم التوضيحية`,
        fromWhere: "ينبثق المجسم من منتصف الشريحة، وتتحرك الأسهم التفاعلية من الأطراف",
        toWhere: "تتجه الأسهم عبر مسار حركة (Motion Path) نحو الأجزاء الداخلية للمجسم في المركز",
        animationType: "Zoom In (للمجسم) + Custom Motion Path (مسار حركة للأسهم والجزيئات)",
        detailedAction: `يكبر المجسم العلمي في المنتصف، وتتحرك الجزيئات والأسهم المضيئة خطوة بخطوة لتوضيح (${beat.simpleExplanation.slice(0, 90)}...).`,
        syncWithTeacher: "مع شرح المعلمة لكيفية حدوث الظاهرة ولماذا تحدث"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3 (عند طرح السؤال التفاعلي)",
        element: "نافذة السؤال التفاعلي وعلامة الاستفهام الذهبية ثم الإجابة",
        fromWhere: "تنزل من الركن العلوي الأيسر للشريحة",
        toWhere: "تستقر بجوار المجسم العلمي في المنتصف ثم تتحول للون الأخضر عند ظهور الإجابة",
        animationType: "Float In + Pulse (نبض لعلامة الاستفهام) + Flip (لكشف الإجابة)",
        detailedAction: `تظهر بطاقة السؤال (${beat.studentQuestion || "سؤال التفكير"}) وتومض لثوانٍ، ومع الكليك التالي تنقلب البطاقة لتكشف الإجابة الصحيحة (${beat.expectedAnswer || ""}) مع نجمة تشجيعية.`,
        syncWithTeacher: "مع طرح المعلمة للسؤال التفاعلي على الطلاب"
      },
      {
        stepNumber: 4,
        trigger: "كليك 4 (تثبيت المصطلح الرسمي في الكتاب)",
        element: `بطاقة المصطلح الرسمي: (${term}) وتعريف الكتاب`,
        fromWhere: "تدخل من أسفل يسار الشريحة",
        toWhere: "تستقر في إطار ذهبي بارز في القسم الأيسر من الشريحة",
        animationType: "Zoom + Glow (تكبير مع توهج الإطار الذهبي)",
        detailedAction: `تظهر البطاقة النهائية وبداخلها المصطلح (${term}) والتعريف المعتمد (${beat.textbookDefinition}) مع سهم مضيء يربطها بالمجسم المتحرك.`,
        syncWithTeacher: "مع ختام الجزئية وذكر اسم المصطلح في كتاب المدرسة"
      }
    ]
  };
}

function getSafeHookPptPlan(hook?: IntroHook): PptAnimationPlan {
  if (
    hook?.pptAnimationPlan &&
    hook.pptAnimationPlan.slideTitle &&
    Array.isArray(hook.pptAnimationPlan.movements) &&
    hook.pptAnimationPlan.movements.length > 0
  ) {
    return hook.pptAnimationPlan;
  }
  if (hook?.teacherScript?.includes("البناء الضوئي") || hook?.hookTitle?.includes("مقدمة")) {
    return SAMPLE_HOOK_PPT_PLAN;
  }
  return {
    slideTitle: `شريحة الدخلة التمهيدية: ${hook?.hookTitle || "تمهيد وتشبيه بداية الدرس"}`,
    slideLayout: "الشريحة مقسومة إلى مشهدين متتابعين: على اليمين مشهد التشبيه الحياتي القريب من حياة الطفل، وعلى اليسار مشهد الظاهرة العلمية مع عدسة مكبرة وعلامات استفهام.",
    movements: [
      {
        stepNumber: 1,
        trigger: "كليك 1 (مع التحية وعنوان الدرس)",
        element: "لافتة عنوان الدرس الترحيبية",
        fromWhere: "تنزل من أعلى الشريحة",
        toWhere: "تستقر في منتصف أعلى الشريحة",
        animationType: "Fly In From Top + Bounce",
        detailedAction: "تظهر لافتة عنوان الدرس بألوان مبهجة مع نجوم صغيرة ترحب بأبطال العلوم.",
        syncWithTeacher: "مع التحية الثابتة وذكر عنوان الدرس"
      },
      {
        stepNumber: 2,
        trigger: "كليك 2 (مع تشبيه البداية)",
        element: "عناصر التشبيه الحياتي اليومي",
        fromWhere: "تدخل من أقصى يمين الشريحة",
        toWhere: "تتحرك نحو منتصف القسم الأيمن وتتفاعل معاً",
        animationType: "Motion Path (مسار حركة من اليمين للمنتصف) + Pulse",
        detailedAction: `تتحرك عناصر التشبيه (${hook?.analogyStory || "التشبيه اليومي"}) أمام الطفل لتقريب الفكرة إلى ذهنه.`,
        syncWithTeacher: "مع شرح المعلمة لتشبيه البداية المشوق"
      },
      {
        stepNumber: 3,
        trigger: "كليك 3 (الربط بسؤال الدرس)",
        element: "العدسة المكبرة وعلامة الاستفهام الكبرى",
        fromWhere: "تتحرك من القسم الأيمن",
        toWhere: "تتجه نحو القسم الأيسر لتكبر موضوع الدرس الأساسي",
        animationType: "Motion Path Left + Zoom In (تكبير عنصر الدرس)",
        detailedAction: "تنتقل العدسة المكبرة من التشبيه الحياتي لتقف فوق عنصر الدرس الأساسي في اليسار وتكبره لبدء رحلة الاكتشاف.",
        syncWithTeacher: "مع سؤال التشويق في نهاية المقدمة"
      }
    ]
  };
}

function getSafeExperimentPptPlan(exp: Experiment, idx: number): PptAnimationPlan {
  if (
    exp?.pptAnimationPlan &&
    exp.pptAnimationPlan.slideTitle &&
    Array.isArray(exp.pptAnimationPlan.movements) &&
    exp.pptAnimationPlan.movements.length > 0
  ) {
    return exp.pptAnimationPlan;
  }
  if (exp?.experimentTitle?.includes("النشا") || exp?.experimentTitle?.includes("اليود")) {
    return SAMPLE_EXPERIMENT_PPT_PLAN;
  }
  const steps = getSafeSteps(exp);
  return {
    slideTitle: `شريحة المعمل التفاعلية للتجربة ${idx + 1}: ${exp.experimentTitle}`,
    slideLayout: `طاولة معمل علوم مرتبة: في الأعلى رف الأدوات (${(exp.materials || []).slice(0, 4).join("، ")})، وفي المنتصف منطقة إجراء خطوات التجربة بالتتابع، وفي اليسار لوحة الملاحظة والاستنتاج.`,
    movements: steps.length > 0
      ? steps.map((st, sIdx) => ({
          stepNumber: sIdx + 1,
          trigger: `كليك ${sIdx + 1} (الخطوة ${st.stepNumber})`,
          element: `أدوات وعناصر (${st.stepTitle})`,
          fromWhere: "تتحرك الأداة من رف الأدوات في يمين/أعلى الشريحة",
          toWhere: "تتجه عبر مسار حركة (Motion Path) إلى منتصف طاولة المعمل لتنفيذ الخطوة",
          animationType: "Motion Path (مسار حركة للأداة) + Zoom / Color Effect",
          detailedAction: `تتحرك الأداة لتنفيذ: (${st.actionDetails}) مع إظهار التفاعل البصري خطوة بخطوة أمام الطالب.`,
          syncWithTeacher: `مع كلام المعلمة في الخطوة ${st.stepNumber}: (${st.stepTitle})`
        }))
      : [
          {
            stepNumber: 1,
            trigger: "كليك 1",
            element: "أدوات التجربة والنتيجة المرئية",
            fromWhere: "تتحرك الأدوات من يمين طاولة المعمل",
            toWhere: "تتجمع في منتصف الطاولة ويظهر التغير اللوني/الفيزيائي في اليسار",
            animationType: "Motion Path + Wipe Color",
            detailedAction: `${exp.observations} ⬅ ${exp.finalConclusion}`,
            syncWithTeacher: "مع شرح المعلمة لخطوات وملاحظات التجربة"
          }
        ]
  };
}

// Safe helper functions preventing any undefined property access
function getSafeSteps(exp: any): ExperimentStep[] {
  if (!exp) return [];
  if (Array.isArray(exp.steps) && exp.steps.length > 0) {
    return exp.steps;
  }
  if (Array.isArray(exp.stepsWithLogic) && exp.stepsWithLogic.length > 0) {
    return exp.stepsWithLogic.map((st: any, sIdx: number) => ({
      stepNumber: sIdx + 1,
      stepTitle: typeof st === "string" ? st : (st.step || `الخطوة ${sIdx + 1}`),
      actionDetails: typeof st === "string" ? st : `${st.step || ""} ${st.whyWeDoIt ? "- لماذا: " + st.whyWeDoIt : ""}`.trim(),
      teacherSpeech: st.teacherSpeech || "",
      flowVideoPrompt: "Cute friendly 3D cartoon Pixar style laboratory animation for children: Detailed macro tabletop action of this science step. Clean playful aesthetic. Mute visual action only, strictly NO talking characters, NO speaking mouth animation, NO lip sync."
    }));
  }
  return [];
}

function getSafeVideoPrompts(item: any, defaultTitle: string = "مشهد توضيحي"): FlowVideoItem[] {
  if (!item) return [];
  if (Array.isArray(item.videoPrompts) && item.videoPrompts.length > 0) {
    return item.videoPrompts.map((vp: any, idx: number) => ({
      shotTitle: vp.shotTitle || `مشهد ${idx + 1}`,
      prompt: vp.prompt || vp.flowVideoPrompt || ""
    }));
  }
  if (item.flowVideoPrompt) {
    return [{ shotTitle: item.analogyTitle || defaultTitle, prompt: item.flowVideoPrompt }];
  }
  return [];
}

function getSafeBeats(data: any): ScientificBeat[] {
  if (!data) return [];
  if (Array.isArray(data.scientificBeats) && data.scientificBeats.length > 0) {
    return data.scientificBeats.map((b: any, idx: number) => {
      const normalizedBeat: ScientificBeat = {
        ...b,
        beatNumber: b.beatNumber || idx + 1,
        videoPrompts: getSafeVideoPrompts(b, `مشهد الجزئية ${idx + 1}`)
      };
      normalizedBeat.pptAnimationPlan = getSafePptPlanForBeat(normalizedBeat, idx);
      return normalizedBeat;
    });
  }
  if (Array.isArray(data.beats) && data.beats.length > 0) {
    return data.beats.map((b: any, idx: number) => {
      const normalizedBeat: ScientificBeat = {
        beatNumber: b.beatNumber || idx + 1,
        conceptTitle: b.conceptTitle || `جزئية ${idx + 1}`,
        teacherScript: b.teacherVoiceover || b.teacherScript || "",
        simpleExplanation: b.simpleExplanation || b.analogyIdea || "",
        textbookTerm: b.textbookTerm || b.conceptTitle || "المصطلح العلمي",
        textbookDefinition: b.textbookDefinition || b.simpleExplanation || "التعريف العلمي المعتمد",
        flowVideoPrompt: b.flowVideoPrompt || "",
        videoPrompts: getSafeVideoPrompts(b, `مشهد الجزئية ${idx + 1}`)
      };
      normalizedBeat.pptAnimationPlan = getSafePptPlanForBeat(normalizedBeat, idx);
      return normalizedBeat;
    });
  }
  if (Array.isArray(data.sections) && data.sections.length > 0) {
    return data.sections.map((s: any, idx: number) => {
      const normalizedBeat: ScientificBeat = {
        beatNumber: idx + 1,
        conceptTitle: s.title || `جزئية ${idx + 1}`,
        teacherScript: s.teacherSpeech || "",
        simpleExplanation: s.scientificExplanation || s.realLifeAnalogy || "",
        textbookTerm: s.title || "المصطلح العلمي",
        textbookDefinition: s.scientificExplanation || "",
        flowVideoPrompt: s.flowVideoPrompt || s.analogyVideoMotionPrompt || "",
        videoPrompts: getSafeVideoPrompts(s, `مشهد الجزئية ${idx + 1}`)
      };
      normalizedBeat.pptAnimationPlan = getSafePptPlanForBeat(normalizedBeat, idx);
      return normalizedBeat;
    });
  }
  return [];
}

interface TeacherLessonGuideProps {
  initialGuideData?: LessonGuideData | null;
}

export default function TeacherLessonGuide({ initialGuideData }: TeacherLessonGuideProps) {
  const [guideData, setGuideData] = useState<LessonGuideData | null>(initialGuideData || PRESET_SAMPLE_GUIDE);
  const [topicInput, setTopicInput] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<number | undefined>(undefined);
  const [endPage, setEndPage] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Saved Projects state
  const [savedGuides, setSavedGuides] = useState<Array<{ id: string; name: string; date: string; guideData: LessonGuideData }>>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync when initialGuideData changes from parent
  useEffect(() => {
    if (initialGuideData) {
      setGuideData(initialGuideData);
    }
  }, [initialGuideData]);

  // Load saved guides from /api/projects
  const fetchSavedGuides = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        const guides = (data.projects || []).filter((p: any) => p.type === "lesson_guide" && p.guideData);
        setSavedGuides(guides);
      }
    } catch (e) {
      console.warn("Failed to load saved lesson guides:", e);
    }
  };

  useEffect(() => {
    fetchSavedGuides();
  }, []);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Save current lesson guide to disk /api/projects
  const handleSaveCurrentProject = async () => {
    if (!guideData) return;
    setIsSaving(true);
    try {
      const newProject = {
        id: Date.now().toString(),
        name: guideData.lessonTitle || `درس علوم ${new Date().toLocaleTimeString("ar-EG")}`,
        date: new Date().toLocaleString("ar-EG"),
        type: "lesson_guide",
        guideData: guideData
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        await fetchSavedGuides();
        alert("🎉 تم حفظ مشروع الدرس بالكامل بنجاح في مشاريعك!");
      } else {
        throw new Error("فشل الحفظ في السيرفر");
      }
    } catch (e: any) {
      alert("خطأ أثناء الحفظ: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSavedProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("هل أنتِ متأكدة من حذف هذا الدرس المحفوظ؟")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedGuides(savedGuides.filter((g) => g.id !== id));
      }
    } catch (e) {
      console.warn("Failed to delete project:", e);
    }
  };

  const handleGenerateGuide = async () => {
    if (!pdfFile && !topicInput.trim()) {
      alert("الرجاء رفع ملف PDF أو كتابة موضوع الدرس المراد إعداد دليله المفصل.");
      return;
    }

    setIsLoading(true);
    try {
      let fileToSend: File | null = pdfFile;

      if (pdfFile && startPage !== undefined && endPage !== undefined && !isNaN(startPage) && !isNaN(endPage)) {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        const s = Math.min(Math.max(1, startPage), totalPages);
        const e = Math.min(Math.max(s, endPage), totalPages);
        const newPdf = await PDFDocument.create();
        const pageIndices = Array.from({ length: e - s + 1 }, (_, i) => s - 1 + i);
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        fileToSend = new File([pdfBytes as any], `sliced_${s}_to_${e}_${pdfFile.name}`, { type: "application/pdf" });
      }

      const formData = new FormData();
      if (fileToSend) formData.append("pdfFile", fileToSend);
      if (topicInput.trim()) formData.append("topic", topicInput.trim());

      const res = await fetch("/api/lesson-guide", {
        method: "POST",
        body: formData,
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (_) {
        throw new Error("استجابة غير مكتملة من السيرفر، يرجى الضغط على زر التوليد مرة أخرى.");
      }

      if (!res.ok) {
        throw new Error(data.error || "فشل تحليل وتقسيم الدرس");
      }

      if (data.guide) {
        const normalizedBeats = getSafeBeats(data.guide);
        const rawExperiments = Array.isArray(data.guide.experiments) ? data.guide.experiments : [];
        const normalizedExperiments = rawExperiments.map((exp: any, eIdx: number) => {
          const normExp: Experiment = {
            ...exp,
            materials: Array.isArray(exp.materials) ? exp.materials : [],
            steps: getSafeSteps(exp)
          };
          normExp.pptAnimationPlan = getSafeExperimentPptPlan(normExp, eIdx);
          return normExp;
        });

        setGuideData({
          ...data.guide,
          scientificBeats: normalizedBeats,
          experiments: normalizedExperiments
        });
        alert("🎉 تم إعداد الشرح العلمي المفصل + خطة أنيميشن الباوربوينت الكاملة بنجاح!");
      }
    } catch (e: any) {
      console.warn("Lesson guide generation warning:", e?.message || e);
      alert("تنبيه: " + (e?.message || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى"));
    } finally {
      setIsLoading(false);
    }
  };

  // Safe computed lists
  const beatsToRender = getSafeBeats(guideData);
  const hookPptPlan = getSafeHookPptPlan(guideData?.introHook);
  const hookVideoPrompts = guideData?.introHook ? getSafeVideoPrompts(guideData.introHook, "مشهد تشبيه البداية") : [];
  const experimentsToRender = Array.isArray(guideData?.experiments) ? guideData!.experiments : [];
  const blackboard = guideData?.blackboardSummary || {
    title: guideData?.lessonTitle || "ملخص السبورة",
    keyVocabulary: [],
    definitions: [],
    comparisons: [],
    conclusions: []
  };
  const questionsToRender = Array.isArray(guideData?.checkUnderstanding) ? guideData!.checkUnderstanding : [];

  const formatPptPlanText = (plan: PptAnimationPlan): string => {
    let text = `📊 ${plan.slideTitle}\n`;
    text += `🖼️ تصميم الشريحة وتوزيع العناصر قبل الحركة: ${plan.slideLayout}\n`;
    text += `🎞️ تسلسل حركات الأنيميشن في الباوربوينت خطوة بخطوة:\n`;
    (plan.movements || []).forEach((m) => {
      text += `  [حركة ${m.stepNumber} - ${m.trigger}]:\n`;
      text += `  • 🎯 العنصر اللي يتحرك: ${m.element}\n`;
      text += `  • 📍 يجي منين (البداية): ${m.fromWhere}\n`;
      text += `  • 🚀 يروح فين (المسار والنهاية): ${m.toWhere}\n`;
      text += `  • ✨ نوع الأنيميشن في الباوربوينت: ${m.animationType}\n`;
      text += `  • 🔍 تفاصيل الحركة بالتفصيل: ${m.detailedAction}\n`;
      text += `  • 🎙️ التزامن مع كلام المعلمة: ${m.syncWithTeacher}\n\n`;
    });
    return text;
  };

  const copyAllPptAnimationPlans = () => {
    if (!guideData) return;
    let out = `=== 📊 الدليل الكامل لأنيميشن الباوربوينت التفاعلي (إيه اللي يتحرك ويروح فين ويجي منين في كل شريحة) ===\n`;
    out += `درس: ${guideData.lessonTitle}\n\n`;

    if (guideData.introHook) {
      out += formatPptPlanText(hookPptPlan) + "=".repeat(55) + "\n\n";
    }

    beatsToRender.forEach((b, idx) => {
      const plan = getSafePptPlanForBeat(b, idx);
      out += formatPptPlanText(plan) + "=".repeat(55) + "\n\n";
    });

    experimentsToRender.forEach((exp, eIdx) => {
      const plan = getSafeExperimentPptPlan(exp, eIdx);
      out += formatPptPlanText(plan) + "=".repeat(55) + "\n\n";
    });

    copyText(out, "all_ppt_plans");
  };

  const renderPptAnimationCard = (plan: PptAnimationPlan, copyId: string, badgeLabel: string = "خطة أنيميشن الباوربوينت التفصيلية بعد الشرح") => (
    <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-5 rounded-2xl border-2 border-orange-300 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200 pb-3">
        <div className="flex items-start gap-2.5">
          <span className="text-2xl p-2 bg-orange-600 text-white rounded-xl shadow-xs shrink-0">📊</span>
          <div>
            <span className="text-[11px] bg-orange-200 text-orange-950 font-black px-2.5 py-0.5 rounded-full inline-block mb-1">
              ✨ {badgeLabel} (إيه اللي يتحرك • يجي منين • يروح فين • نوع الأنيميشن)
            </span>
            <h5 className="text-sm sm:text-base font-black text-orange-950">
              {plan.slideTitle}
            </h5>
          </div>
        </div>

        <button
          onClick={() => copyText(formatPptPlanText(plan), copyId)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center gap-1 self-start sm:self-center shrink-0 shadow-2xs"
        >
          <span>{copiedSection === copyId ? "✅ تم نسخ أنيميشن الشريحة!" : "📋 نسخ خطة أنيميشن الشريحة"}</span>
        </button>
      </div>

      {/* تصميم الشريحة وتوزيع العناصر قبل الحركة */}
      <div className="bg-white/95 p-3.5 rounded-xl border border-orange-200 text-xs space-y-1">
        <span className="font-black text-orange-900 flex items-center gap-1.5">
          <span>🖼️</span> شكل وتصميم الشريحة في الباوربوينت قبل بدء الحركة (توزيع العناصر المفككة):
        </span>
        <p className="text-gray-800 font-semibold leading-relaxed">{plan.slideLayout}</p>
      </div>

      {/* خطوات وحركات الأنيميشن بالتفصيل */}
      <div className="space-y-3">
        <span className="text-xs font-black text-orange-950 block">
          🎞️ تسلسل حركات الأنيميشن داخل الشريحة خطوة بخطوة (كل حاجة بتتحرك إزاي وتروح فين وتيجي منين):
        </span>

        <div className="space-y-3">
          {(plan.movements || []).map((mov, mIdx) => (
            <div
              key={mIdx}
              className="bg-white p-4 rounded-xl border border-orange-200 shadow-2xs space-y-2.5 hover:border-orange-400 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-orange-600 text-white rounded-lg text-xs font-black shadow-2xs">
                    حركة {mov.stepNumber}
                  </span>
                  <span className="text-xs font-black text-orange-900 bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200">
                    🖱️ {mov.trigger}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200">
                  ✨ نوع الأنيميشن: {mov.animationType}
                </span>
              </div>

              {/* العنصر المتحرك */}
              <div className="bg-orange-50/70 p-2.5 rounded-lg border border-orange-200/80 text-xs">
                <span className="font-black text-orange-950">🎯 إيه العنصر اللي بيتحرك في الشريحة؟ </span>
                <span className="font-bold text-gray-900">{mov.element}</span>
              </div>

              {/* يجي منين ويروح فين */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                <div className="bg-blue-50/90 p-3 rounded-lg border border-blue-200">
                  <span className="font-black text-blue-900 block mb-0.5">📍 يجي منين؟ (نقطة البداية / الدخول):</span>
                  <p className="text-blue-950 font-semibold leading-relaxed">{mov.fromWhere}</p>
                </div>

                <div className="bg-emerald-50/90 p-3 rounded-lg border border-emerald-200">
                  <span className="font-black text-emerald-900 block mb-0.5">🚀 يروح فين؟ (المسار ونقطة الاستقرار):</span>
                  <p className="text-emerald-950 font-semibold leading-relaxed">{mov.toWhere}</p>
                </div>
              </div>

              {/* تفاصيل الحركة بالتفصيل الممل */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                <span className="font-black text-gray-900 block">
                  🔍 شرح الحركة والأنيميشن بالتفصيل (إيه اللي بيحصل بالظبط على الشريحة):
                </span>
                <p className="text-gray-800 font-medium leading-relaxed">{mov.detailedAction}</p>
              </div>

              {/* التزامن مع كلام المعلمة */}
              <div className="text-[11px] text-amber-950 bg-amber-50/80 px-3 py-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                <span className="font-black text-amber-900 shrink-0">🎙️ توقيت الحركة مع صوتكِ:</span>
                <span className="font-semibold">{mov.syncWithTeacher}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Copy All Voiceovers in sequential order for easy microphone recording
  const copyAllVoiceoverScript = () => {
    if (!guideData) return;
    let script = `=== سكريبت التسجيل الصوتي الشامل والمفصل للمعلمة ===\nدرس: ${guideData.lessonTitle}\n\n`;

    if (guideData.introHook) {
      script += `[1. المقدمة الثابتة + عنوان الدرس + التمهيد + تشبيهات البداية]:\n${guideData.introHook.teacherScript}\n\n---\n\n`;
    }

    if (beatsToRender.length > 0) {
      beatsToRender.forEach((b) => {
        script += `[المشهد ${String(b.beatNumber).padStart(2, "0")} - ${b.conceptTitle}]:\n`;
        script += `${b.teacherScript}\n\n`;
        if (b.studentQuestion) {
          script += `❓ سؤال تفاعلي: ${b.studentQuestion}\n💡 إجابة متوقعة: ${b.expectedAnswer}\n\n`;
        }
        script += `(المصطلح في الكتاب: ${b.textbookTerm} | تعريفه: ${b.textbookDefinition})\n\n---\n\n`;
      });
    }

    if (guideData.experimentTransition?.teacherSpeech) {
      script += `[تمهيد المعلمة والانتقال للتجربة العملية]:\n${guideData.experimentTransition.teacherSpeech}\n\n---\n\n`;
    }

    if (experimentsToRender.length > 0) {
      experimentsToRender.forEach((exp, idx) => {
        script += `[تجربة ${idx + 1}: ${exp.experimentTitle}]:\n`;
        if (exp.introAndMaterialsSpeech) {
          script += `${exp.introAndMaterialsSpeech}\n\n`;
        }
        const steps = getSafeSteps(exp);
        steps.forEach((st) => {
          script += `الخطوة ${st.stepNumber} (${st.stepTitle}):\n${st.teacherSpeech}\n\n`;
        });
        if (exp.observationAndConclusionSpeech) {
          script += `[الملاحظة والاستنتاج النهائي للتجربة]:\n${exp.observationAndConclusionSpeech}\n`;
        } else {
          script += `الملاحظة: ${exp.observations}\nالاستنتاج: ${exp.finalConclusion}\n`;
        }
        script += `\n---\n\n`;
      });
    }

    if (guideData.lessonConclusion?.teacherScript) {
      script += `[خاتمة الدرس الشاملة]:\n${guideData.lessonConclusion.teacherScript}\n\n`;
    }

    copyText(script, "all_voiceover");
  };

  // Copy complete sequential voiceover script for an individual experiment
  const copyExperimentFullScript = (exp: Experiment, idx: number) => {
    let script = `=== السكريبت الصوتي الكامل للتجربة ${idx + 1}: ${exp.experimentTitle} ===\n\n`;
    if (guideData?.experimentTransition?.teacherSpeech) {
      script += `[تمهيد الدخول للمعمل]:\n${guideData.experimentTransition.teacherSpeech}\n\n`;
    }
    if (exp.introAndMaterialsSpeech) {
      script += `[تعريف التجربة والهدف والأدوات]:\n${exp.introAndMaterialsSpeech}\n\n`;
    } else {
      script += `الهدف: ${exp.goal}\nالأدوات: ${(exp.materials || []).join("، ")}\n\n`;
    }
    const steps = getSafeSteps(exp);
    steps.forEach((st) => {
      script += `[الخطوة ${st.stepNumber}: ${st.stepTitle}]:\n${st.teacherSpeech || st.actionDetails}\n\n`;
    });
    if (exp.observationAndConclusionSpeech) {
      script += `[الملاحظة والاستنتاج النهائي]:\n${exp.observationAndConclusionSpeech}\n`;
    } else {
      script += `[الملاحظة]: ${exp.observations}\n[الاستنتاج]: ${exp.finalConclusion}\n`;
    }
    copyText(script, `exp_full_voice_${idx}`);
  };

  // Copy All Scientific & Hook Flow Video Prompts sequentially
  const copyAllFlowPrompts = () => {
    if (!guideData) return;
    let prompts = `=== برومبتات فيديو Flow لجميع مشاهد وتشبيهات الدرس ===\nدرس: ${guideData.lessonTitle}\n\n`;

    if (hookVideoPrompts.length > 0) {
      prompts += `[فيديوهات تشبيهات الدخلة والتمهيد (${hookVideoPrompts.length} فيديو)]:\n`;
      hookVideoPrompts.forEach((vp, idx) => {
        prompts += `SHOT ${idx + 1}: ${vp.shotTitle}\n${vp.prompt}\n\n`;
      });
      prompts += "=".repeat(45) + "\n\n";
    }

    if (beatsToRender.length > 0) {
      beatsToRender.forEach((b) => {
        prompts += `SCENE ${String(b.beatNumber).padStart(2, "0")} [${b.textbookTerm}]:\n`;
        const vps = b.videoPrompts && b.videoPrompts.length > 0 ? b.videoPrompts : getSafeVideoPrompts(b);
        vps.forEach((vp, vIdx) => {
          prompts += `SHOT ${vIdx + 1}: ${vp.shotTitle}\n${vp.prompt}\n\n`;
        });
        prompts += "=".repeat(45) + "\n\n";
      });
    }

    if (guideData.experimentTransition?.flowVideoPrompt) {
      prompts += `[فيديو التمهيد لدخول المعمل]:\n${guideData.experimentTransition.flowVideoPrompt}\n\n` + "=".repeat(45) + "\n\n";
    }

    if (guideData.lessonConclusion?.flowVideoPrompt) {
      prompts += `[فيديو خاتمة الدرس الشاملة]:\n${guideData.lessonConclusion.flowVideoPrompt}\n\n` + "=".repeat(45) + "\n\n";
    }

    copyText(prompts, "all_flow_prompts");
  };

  // Copy All Experiment Flow Video Prompts
  const copyAllExperimentPrompts = () => {
    if (!experimentsToRender.length) return;
    let prompts = `=== برومبتات فيديو Flow لخطوات التجارب العلمية ===\nدرس: ${guideData?.lessonTitle || ""}\n\n`;

    if (guideData?.experimentTransition?.flowVideoPrompt) {
      prompts += `TRANSITION SHOT (دخول المعمل):\n${guideData.experimentTransition.flowVideoPrompt}\n\n` + "=".repeat(35) + "\n\n";
    }

    experimentsToRender.forEach((exp, eIdx) => {
      prompts += `EXPERIMENT ${eIdx + 1}: ${exp.experimentTitle}\n\n`;
      const steps = getSafeSteps(exp);
      steps.forEach((st) => {
        prompts += `STEP ${st.stepNumber} (${st.stepTitle}):\n${st.flowVideoPrompt}\n\n`;
      });
      if (exp.observationVideoPrompt) {
        prompts += `OBSERVATION RESULT VIDEO:\n${exp.observationVideoPrompt}\n\n`;
      }
      prompts += "=".repeat(45) + "\n\n";
    });

    copyText(prompts, "all_exp_prompts");
  };

  // Download full formatted file to device (.txt)
  const downloadFullGuideTxt = () => {
    if (!guideData) return;
    let txt = `======================================================================\n`;
    txt += `  دليل المعلمة المفصل لشرح وتبسيط العلوم للأطفال\n`;
    txt += `  (الشرح المفصل المستفيض + فيديوهات Flow لكل تشبيه + تمهيد التجربة + الخاتمة)\n`;
    txt += `  إعداد: Sci.Rehab Elsibai Studio\n`;
    txt += `  عنوان الدرس: ${guideData.lessonTitle}\n`;
    txt += `  المجال: ${guideData.detectedTopic || "علمي مخصص"}\n`;
    txt += `  عدد الجزئيات التفصيلية: ${beatsToRender.length} جزئية\n`;
    txt += `======================================================================\n\n`;

    if (guideData.introHook) {
      txt += `🎬 المقدمة الثابتة والدخلة التمهيدية:\n`;
      txt += `* عنوان الدخلة: ${guideData.introHook.hookTitle}\n`;
      txt += `* فكرة التشبيهات: ${guideData.introHook.analogyStory}\n`;
      txt += `* كلام المعلمة للتسجيل الصوتي:\n${guideData.introHook.teacherScript}\n\n`;
      txt += formatPptPlanText(hookPptPlan) + `\n`;
      txt += `* فيديوهات Flow لتشبيهات الدخلة (${hookVideoPrompts.length} فيديو):\n`;
      hookVideoPrompts.forEach((vp, idx) => {
        txt += `  [فيديو ${idx + 1} - ${vp.shotTitle}]:\n  ${vp.prompt}\n\n`;
      });
      txt += `----------------------------------------------------------------------\n\n`;
    }

    if (beatsToRender.length > 0) {
      txt += `🔬 الشرح العلمي المفصل المستفيض + أنيميشن الباوربوينت + فيديوهات Flow:\n\n`;
      beatsToRender.forEach((b, idx) => {
        txt += `######################################################################\n`;
        txt += `مشهد ${String(b.beatNumber).padStart(2, "0")}: ${b.conceptTitle}\n`;
        txt += `🎙️ كلامكِ الصوتي في المونتاج (المفصل):\n${b.teacherScript}\n\n`;
        if (b.studentQuestion) {
          txt += `❓ سؤال تفاعلي تطرحه المعلمة: ${b.studentQuestion}\n`;
          txt += `💡 الإجابة المتوقعة من الطلاب: ${b.expectedAnswer}\n\n`;
        }
        txt += `📖 المصطلح في كتاب المدرسة: ${b.textbookTerm}\n`;
        txt += `📝 التعريف المكتوب في الكتاب: ${b.textbookDefinition}\n\n`;
        txt += `💡 الشرح العلمي الموسع: ${b.simpleExplanation}\n\n`;
        txt += formatPptPlanText(getSafePptPlanForBeat(b, idx)) + `\n`;
        const vps = b.videoPrompts && b.videoPrompts.length > 0 ? b.videoPrompts : getSafeVideoPrompts(b);
        txt += `🎬 فيديوهات Flow المرافقة لهذه الجزئية (${vps.length} فيديو):\n`;
        vps.forEach((vp, vIdx) => {
          txt += `  [فيديو ${vIdx + 1} - ${vp.shotTitle}]:\n  ${vp.prompt}\n\n`;
        });
      });
      txt += `\n======================================================================\n\n`;
    }

    if (guideData.experimentTransition) {
      txt += `🥼 تمهيد المعلمة والانتقال للتجربة العملية (يلا بينا نجرب!):\n`;
      txt += `* كلام المعلمة: "${guideData.experimentTransition.teacherSpeech}"\n`;
      if (guideData.experimentTransition.flowVideoPrompt) {
        txt += `* فيديو Flow لدخول المعمل:\n  ${guideData.experimentTransition.flowVideoPrompt}\n`;
      }
      txt += `\n----------------------------------------------------------------------\n\n`;
    }

    if (experimentsToRender.length > 0) {
      txt += `🧪 التجارب العلمية الاحترافية خطوة بخطوة مع برومبتات الفيديو:\n\n`;
      experimentsToRender.forEach((exp, idx) => {
        txt += `[تجربة ${idx + 1}: ${exp.experimentTitle}]\n`;
        txt += `* الهدف: ${exp.goal}\n`;
        txt += `* الأدوات: ${(exp.materials || []).join(" - ")}\n\n`;
        if (exp.introAndMaterialsSpeech) {
          txt += `* كلام المعلمة في بداية التجربة واستعراض الأدوات:\n${exp.introAndMaterialsSpeech}\n\n`;
        }
        const steps = getSafeSteps(exp);
        steps.forEach((st) => {
          txt += `  خطوة ${st.stepNumber} (${st.stepTitle}):\n`;
          txt += `  - التفاصيل: ${st.actionDetails}\n`;
          txt += `  - كلام المعلمة: "${st.teacherSpeech}"\n`;
          txt += `  - برومبت فيديو Flow للخطوة:\n    ${st.flowVideoPrompt}\n\n`;
        });
        txt += `* الملاحظة بالعين: ${exp.observations}\n`;
        if (exp.observationVideoPrompt) {
          txt += `* برومبت فيديو نتيجة الملاحظة:\n  ${exp.observationVideoPrompt}\n`;
        }
        txt += `* الاستنتاج العلمي النهائي: ${exp.finalConclusion}\n`;
        if (exp.observationAndConclusionSpeech) {
          txt += `* كلام المعلمة لشرح الملاحظة والاستنتاج:\n${exp.observationAndConclusionSpeech}\n`;
        }
        if (exp.safetyPrecautions) txt += `* احتياطات الأمان: ${exp.safetyPrecautions}\n`;
        txt += `\n----------------------------------------------------------------------\n\n`;
      });
    }

    if (guideData.lessonConclusion) {
      txt += `🌟 خاتمة الدرس الشاملة:\n`;
      txt += `* العنوان: ${guideData.lessonConclusion.title}\n`;
      txt += `* كلام المعلمة للخاتمة:\n${guideData.lessonConclusion.teacherScript}\n`;
      if (guideData.lessonConclusion.flowVideoPrompt) {
        txt += `* فيديو Flow للخاتمة:\n  ${guideData.lessonConclusion.flowVideoPrompt}\n`;
      }
      txt += `\n----------------------------------------------------------------------\n\n`;
    }

    txt += `📋 ما يُكتب على السبورة فقط:\n`;
    txt += `* العنوان: ${blackboard.title}\n`;
    txt += `* الكلمات والمصطلحات الأساسية:\n`;
    (blackboard.keyVocabulary || []).forEach((v) => (txt += `  - ${v}\n`));
    txt += `* التعريفات الأساسية:\n`;
    (blackboard.definitions || []).forEach((d) => (txt += `  - ${d}\n`));
    txt += `* المقارنات:\n`;
    (blackboard.comparisons || []).forEach((c) => (txt += `  - ${c}\n`));
    txt += `* الاستنتاجات:\n`;
    (blackboard.conclusions || []).forEach((cn) => (txt += `  - ${cn}\n`));
    txt += `\n----------------------------------------------------------------------\n\n`;

    txt += `❓ أسئلة التأكد من الفهم وإجاباتها:\n\n`;
    questionsToRender.forEach((q, idx) => {
      txt += `سؤال ${idx + 1} (${q.questionType}): ${q.question}\n`;
      txt += `الإجابة النموذجية: ${q.correctAnswer}\n\n`;
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `دليل_الشرح_العلمي_المفصل_وفيديوهات_فلو_${(guideData.lessonTitle || "درس").replace(/[/\\?%*:|"<>]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyBlackboardOnly = () => {
    let b = `=== ما يُكتب على السبورة فقط ===\n`;
    b += `${blackboard.title}\n\n`;
    b += `الكلمات والمصطلحات:\n` + (blackboard.keyVocabulary || []).map((k) => `• ${k}`).join("\n") + "\n\n";
    b += `التعريفات المعتمدة:\n` + (blackboard.definitions || []).map((d) => `• ${d}`).join("\n") + "\n\n";
    b += `المقارنات:\n` + (blackboard.comparisons || []).map((c) => `• ${c}`).join("\n") + "\n\n";
    b += `الاستنتاج:\n` + (blackboard.conclusions || []).map((c) => `• ${c}`).join("\n");
    copyText(b, "blackboard_only");
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* 1. Header Banner & Uploader */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/30 mb-2">
              <span>📖</span>
              <span>شرح علمي مفصل مستفيض نقطة بنقطة (بدون أي اختصار) + فيديوهات Flow لكل تشبيه</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              دليل الشرح المفصل من الصفر للأطفال وفيديوهات Flow
            </h2>
            <p className="text-emerald-200/90 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed">
              تفكيك الدرس لكل جزئية وفكرة صغيرة بالتفصيل الممل والممتع، مع حوار كامل للمعلمة بالعامية، وتوضيح كيف ولماذا، وبرومبتات Flow لكل تشبيه، وتمهيد للتجربة وحفظ المشاريع!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setGuideData(PRESET_SAMPLE_GUIDE);
                alert("تم تحميل النموذج الاسترشادي المفصل جداً (10 جزئيات تفصيلية + تجربة النشا الكاملة)!");
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              🔄 عرض النموذج المفصل جداً
            </button>

            <button
              onClick={() => setShowSavedModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs py-2 px-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>📂</span>
              <span>مشاريعي السابقة ({savedGuides.length})</span>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-emerald-300 mb-1.5">
              1. ارفعي صفحات الدرس من كتاب المدرسة (PDF):
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-emerald-100 file:mr-2 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer bg-black/20 p-2 rounded-xl border border-emerald-600/40"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-emerald-300 mb-1.5">
              2. أو اكتبي عنوان الدرس (سيشرحه بالتفصيل الكامل نقطة بنقطة):
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="مثال: البناء الضوئي، الجهاز الهضمي، القلب والدورة الدموية..."
              className="w-full p-2.5 bg-black/20 text-white text-xs rounded-xl border border-emerald-600/40 placeholder-emerald-300/40 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] text-emerald-300 font-semibold">تحديد الصفحات:</span>
              <input
                type="number"
                placeholder="من"
                value={startPage || ""}
                onChange={(e) => setStartPage(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-14 p-1.5 bg-black/20 text-white text-xs rounded-lg border border-emerald-600/40 text-center"
              />
              <span className="text-xs text-emerald-300">إلى</span>
              <input
                type="number"
                placeholder="إلى"
                value={endPage || ""}
                onChange={(e) => setEndPage(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-14 p-1.5 bg-black/20 text-white text-xs rounded-lg border border-emerald-600/40 text-center"
              />
            </div>
            <button
              onClick={handleGenerateGuide}
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-black"
              }`}
            >
              {isLoading ? "جاري صياغة الشرح المفصل نقطة بنقطة..." : "🚀 فهم الدرس وصياغة الشرح المفصل كاملاً"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Guide Results Container */}
      {guideData && (
        <div className="space-y-8">
          
          {/* Top Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✨ تم إعداد الشرح العلمي المفصل ({beatsToRender.length} جزئية تفصيلية مستفيضة)
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">{guideData.lessonTitle}</h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={handleSaveCurrentProject}
                disabled={isSaving}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-2 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="حفظ هذا المشروع في مشاريعك للرجوع إليه دائماً"
              >
                <span>💾</span>
                <span>{isSaving ? "جاري الحفظ..." : "حفظ هذا الدرس في مشاريعي"}</span>
              </button>

              <button
                onClick={copyAllVoiceoverScript}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                title="نسخ جميع جمل المعلمة المفصلة بالترتيب للتسجيل الصوتي"
              >
                <span>🎙️</span> {copiedSection === "all_voiceover" ? "✅ تم نسخ السكريبت!" : "نسخ كامل السكريبت الصوتي"}
              </button>

              <button
                onClick={copyAllPptAnimationPlans}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                title="نسخ خطة حركات وأنيميشن الباوربوينت لجميع شرائح الدرس بالتفصيل"
              >
                <span>📊</span> {copiedSection === "all_ppt_plans" ? "✅ تم نسخ أنيميشن الباوربوينت!" : "نسخ أنيميشن الباوربوينت بالكامل"}
              </button>

              <button
                onClick={copyAllFlowPrompts}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                title="نسخ برومبتات Flow لجميع التشبيهات والمشاهد"
              >
                <span>🎬</span> {copiedSection === "all_flow_prompts" ? "✅ تم نسخ البرومبتات!" : "نسخ كل برومبتات Flow"}
              </button>

              {experimentsToRender.length > 0 && (
                <button
                  onClick={copyAllExperimentPrompts}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                  title="نسخ برومبتات Flow لخطوات التجارب"
                >
                  <span>🧪</span> {copiedSection === "all_exp_prompts" ? "✅ تم النسخ!" : "برومبتات التجارب"}
                </button>
              )}

              <button
                onClick={downloadFullGuideTxt}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>📥</span> حفظ ملف (.txt)
              </button>

              <button
                onClick={copyBlackboardOnly}
                className="bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>📋</span> {copiedSection === "blackboard_only" ? "✅ تم نسخ السبورة!" : "السبورة فقط"}
              </button>
            </div>
          </div>

          {/* SECTION 1: الدخلة التمهيدية مع برومبت فيديو لكل تشبيه ورد في كلام المعلمة */}
          {guideData.introHook && (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2 bg-amber-100 text-amber-800 rounded-2xl shadow-xs">💡</span>
                  <div>
                    <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      مقدمة ثابتة (السلام عليكم + عنوان الدرس + تمهيد + تشبيه البداية)
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-amber-950 mt-0.5">
                      {guideData.introHook.hookTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyText(guideData.introHook!.teacherScript, "hook_voice")}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs py-1 px-2.5 rounded-lg border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>🎙️</span>
                    <span>{copiedSection === "hook_voice" ? "✅ تم النسخ" : "نسخ كلام الدخلة"}</span>
                  </button>
                </div>
              </div>

              {/* كلام المعلمة في الدخلة */}
              <div className="bg-white/95 p-4 sm:p-5 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                  <span>🎙️</span> كلامكِ الصوتي في بداية الفيديو (حوار دافئ مفصل لفتح شهية الأطفال للتفكير):
                </span>
                <p className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                  "{guideData.introHook.teacherScript}"
                </p>
              </div>

              {/* فكرة التشبيه الحياتي */}
              <div className="text-xs text-amber-950">
                <span className="font-bold text-amber-900">💡 فكرة تشبيه البداية بالتفصيل: </span>
                <span>{guideData.introHook.analogyStory}</span>
              </div>

              {/* خطة أنيميشن الباوربوينت التفصيلية للدخلة التمهيدية بعد الشرح */}
              {renderPptAnimationCard(
                hookPptPlan,
                "hook_ppt_plan",
                "خطة أنيميشن الباوربوينت للدخلة التمهيدية بعد الشرح"
              )}

              {/* قائمة برومبتات الفيديو لكل تشبيه ورد في كلام المعلمة */}
              <div className="space-y-3 pt-2 border-t border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <span>🎬</span> فيديو Flow تتابعي شامل (10 ثوانٍ بانتقالات سريعة يجمع كل تشبيهات الدخلة متزامناً مع صوتكِ):
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                      ⚡ فيديو واحد 10 ثوانٍ مقسم بلقطات سريعة متتالية لتضعي صوتكِ فوقه في CapCut ويمشي الصوت مع الصورة تماماً
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const allHookPrompts = hookVideoPrompts.map((vp, i) => `SHOT ${i + 1} - ${vp.shotTitle}:\n${vp.prompt}`).join("\n\n" + "=".repeat(35) + "\n\n");
                      copyText(allHookPrompts, "all_hook_prompts");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{copiedSection === "all_hook_prompts" ? "✅ تم النسخ" : "📋 نسخ فيديو الدخلة"}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {hookVideoPrompts.map((vp, vIdx) => (
                    <div key={vIdx} className="bg-white p-3.5 rounded-xl border border-amber-300 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                            {vIdx + 1}
                          </span>
                          <span>{vp.shotTitle}</span>
                        </span>

                        <button
                          onClick={() => copyText(vp.prompt, `hook_shot_${vIdx}`)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] py-1 px-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <span>{copiedSection === `hook_shot_${vIdx}` ? "✅ تم النسخ" : "📋 نسخ لـ Flow"}</span>
                        </button>
                      </div>

                      <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-100 text-left font-mono text-xs text-amber-950 leading-relaxed select-all" dir="ltr">
                        {vp.prompt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: الشرح العلمي المفصل المستفيض بالراحة للأطفال + المصطلح الرسمي في الكتاب */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 bg-blue-100 text-blue-800 rounded-xl">🔬</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    الشرح العلمي المفصل نقطة بنقطة + فيديوهات Flow المتتالية لكل جزئية
                  </h3>
                  <p className="text-xs text-gray-500">
                    شرح وافٍ بدون أي اختصار أو دمج للمفاهيم، مع سؤال تفاعلي، وتوضيح كيف ولماذا، وبرومبتات Flow لكل تشبيه!
                  </p>
                </div>
              </div>

              <span className="text-xs bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full">
                {beatsToRender.length} جزئية تفصيلية
              </span>
            </div>

            {/* List of Scientific Beats */}
            <div className="space-y-6">
              {beatsToRender.map((beat, idx) => {
                const beatPrompts = beat.videoPrompts && beat.videoPrompts.length > 0 ? beat.videoPrompts : getSafeVideoPrompts(beat);

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-all space-y-4"
                  >
                    {/* Beat Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center font-black text-xs shadow-xs">
                          {beat.beatNumber}
                        </span>
                        <h4 className="font-black text-sm sm:text-base text-gray-900">
                          {beat.conceptTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyText(beat.teacherScript, `voice_${idx}`)}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs py-1.5 px-3 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="نسخ سكريبت الشرح المفصل لهذه الجزئية"
                        >
                          <span>🎙️</span>
                          <span>{copiedSection === `voice_${idx}` ? "✅ تم النسخ" : "نسخ الشرح المفصل"}</span>
                        </button>
                      </div>
                    </div>

                    {/* 1. كلام المعلمة المفصل والمستفيض بالعامية المصرية */}
                    <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-xl border border-emerald-200 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <span>🎙️</span> كلامكِ الصوتي الكامل للتسجيل في المونتاج (حوار هادئ مفصل خطوة بخطوة للأطفال):
                      </span>
                      <p className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                        "{beat.teacherScript}"
                      </p>
                    </div>

                    {/* 2. سؤال تفاعلي تطرحه المعلمة وإجابة الطلاب */}
                    {beat.studentQuestion && (
                      <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-bold text-blue-900 block mb-0.5">❓ سؤال تفاعلي تطرحينه على الطلاب:</span>
                          <p className="text-blue-950 font-semibold">{beat.studentQuestion}</p>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-800 block mb-0.5">💡 الإجابة المتوقعة من الطلاب:</span>
                          <p className="text-emerald-950 font-semibold">{beat.expectedAnswer}</p>
                        </div>
                      </div>
                    )}

                    {/* 3. بطاقة المصطلح والتعريف في كتاب المدرسة */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-300 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-5 border-l-0 md:border-l border-amber-200 md:pl-3">
                        <span className="text-[11px] font-black text-amber-800 uppercase block mb-1">
                          📖 المصطلح كما هو في كتاب المدرسة:
                        </span>
                        <span className="text-sm font-black text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-md inline-block">
                          {beat.textbookTerm}
                        </span>
                      </div>

                      <div className="md:col-span-7">
                        <span className="text-[11px] font-bold text-amber-800 block mb-1">
                          📝 التعريف المكتوب في الكتاب (المطلوب حفظه وفهمه):
                        </span>
                        <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                          {beat.textbookDefinition}
                        </p>
                      </div>
                    </div>

                    {/* 4. الشرح العلمي المفصل والموسع */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
                      <span className="font-bold text-gray-900 block">
                        💡 الشرح والتحليل العلمي الدقيق للظاهرة (الآلية والسبب والأهمية بالمنطق):
                      </span>
                      <p className="leading-relaxed leading-6">{beat.simpleExplanation}</p>
                    </div>

                    {/* 4.5 خطة أنيميشن الباوربوينت التفصيلية بعد الشرح مباشرة */}
                    {renderPptAnimationCard(
                      getSafePptPlanForBeat(beat, idx),
                      `beat_ppt_${idx}`,
                      `خطة أنيميشن الباوربوينت للجزئية ${beat.beatNumber} بعد الشرح`
                    )}

                    {/* 5. قائمة برومبتات فيديو Flow لكل تشبيه/مشهد في كلام المعلمة */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-purple-950 block">
                            🎬 فيديو Flow تتابعي شامل 10 ثوانٍ (انتقالات سريعة تجمع كل التشبيهات متزامنة مع كلامكِ):
                          </span>
                          <span className="text-[11px] text-purple-700 font-medium">
                            ⚡ فيديو واحد 10 ثوانٍ مقسم لقطات [0-3s, 3-6s, 6-10s] ليتطابق المشهد بدقة مع سرعة صوتكِ في CapCut
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            const allBeatPrompts = beatPrompts.map((vp, i) => `SHOT ${i + 1} - ${vp.shotTitle}:\n${vp.prompt}`).join("\n\n" + "=".repeat(35) + "\n\n");
                            copyText(allBeatPrompts, `beat_prompts_${idx}`);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>{copiedSection === `beat_prompts_${idx}` ? "✅ تم النسخ" : "📋 نسخ فيديوهات الجزئية"}</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {beatPrompts.map((vp, vIdx) => (
                          <div key={vIdx} className="bg-white p-3 rounded-lg border border-purple-200 space-y-1 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                                <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                                  {vIdx + 1}
                                </span>
                                <span>{vp.shotTitle}</span>
                              </span>

                              <button
                                onClick={() => copyText(vp.prompt, `beat_shot_${idx}_${vIdx}`)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] py-0.5 px-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                              >
                                <span>{copiedSection === `beat_shot_${idx}_${vIdx}` ? "✅ تم النسخ" : "📋 نسخ لـ Flow"}</span>
                              </button>
                            </div>

                            <p className="font-mono text-xs text-purple-950 leading-relaxed select-all text-left pt-1" dir="ltr">
                              {vp.prompt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2.5: الدليل الكامل لأنيميشن الباوربوينت التفاعلي بعد الشرح (مجمع بالكامل بالتفصيل) */}
          <div className="bg-gradient-to-r from-orange-100/90 via-amber-50 to-orange-100/90 rounded-3xl p-6 sm:p-8 border-2 border-orange-400 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-orange-300 pb-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2.5 bg-orange-600 text-white rounded-2xl shadow-sm">📊</span>
                <div>
                  <span className="text-xs bg-orange-600 text-white font-black px-3 py-0.5 rounded-full inline-block mb-1">
                    الباوربوينت كله عبارة عن أنيميشن بيتحرك خطوة بخطوة
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-orange-950">
                    خريطة وسيناريو أنيميشن الباوربوينت الكامل للدرس بعد الشرح (شريحة بشريحة)
                  </h3>
                  <p className="text-xs sm:text-sm text-orange-900 font-semibold mt-0.5">
                    كل شريحة مشروحة بالتفصيل الممل: شكل الشريحة، وإيه العنصر اللي يتحرك، ويجي منين، ويروح فين، ونوع حركة الأنيميشن في الباوربوينت، وتوقيتها مع صوتكِ!
                  </p>
                </div>
              </div>

              <button
                onClick={copyAllPptAnimationPlans}
                className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 self-start sm:self-center shrink-0"
              >
                <span>📋</span>
                <span>{copiedSection === "all_ppt_plans" ? "✅ تم نسخ خطة الباوربوينت بالكامل!" : "نسخ خطة أنيميشن كل الشرائح"}</span>
              </button>
            </div>

            <div className="space-y-5">
              {guideData.introHook && renderPptAnimationCard(
                hookPptPlan,
                "summary_hook_ppt",
                "شريحة المقدمة والدخلة التمهيدية"
              )}

              {beatsToRender.map((beat, bIdx) => (
                <div key={`summary_ppt_${bIdx}`}>
                  {renderPptAnimationCard(
                    getSafePptPlanForBeat(beat, bIdx),
                    `summary_beat_ppt_${bIdx}`,
                    `شريحة الجزئية العلمية (${beat.beatNumber}): ${beat.conceptTitle}`
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: التمهيد السلس والانتقال للتجربة + التجارب والأنشطة العلمية */}
          <div className="space-y-6">
            
            {/* التمهيد والانتقال السلس (يلا بينا نجرب ونعمل كذا!) */}
            {guideData.experimentTransition && (
              <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-400 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-teal-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 bg-teal-100 text-teal-800 rounded-2xl">🥼</span>
                    <div>
                      <span className="text-xs bg-teal-200 text-teal-900 font-bold px-2.5 py-0.5 rounded-full">
                        انتقال وتمهيد متناسق للتجربة
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-teal-950 mt-0.5">
                        كلامكِ الصوتي للتمهيد والانتقال للتجربة (يلا بينا نجرب ونعمل كذا!)
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => copyText(guideData.experimentTransition!.teacherSpeech, "trans_speech")}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>🎙️</span>
                    <span>{copiedSection === "trans_speech" ? "✅ تم النسخ" : "نسخ كلام التمهيد"}</span>
                  </button>
                </div>

                <div className="bg-white/95 p-4 rounded-xl border border-teal-200 shadow-2xs">
                  <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5 mb-1">
                    <span>🎙️</span> قولي هذا الكلام بصوتكِ في المونتاج بعد نهاية الشرح وقبل بدء التجربة مباشرة:
                  </span>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                    "{guideData.experimentTransition.teacherSpeech}"
                  </p>
                </div>

                {guideData.experimentTransition.flowVideoPrompt && (
                  <div className="bg-white p-3.5 rounded-xl border border-teal-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-950">
                        🎬 برومبت فيديو Flow لحماس دخول معمل العلوم والأدوات:
                      </span>
                      <button
                        onClick={() => copyText(guideData.experimentTransition!.flowVideoPrompt!, "trans_flow")}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>{copiedSection === "trans_flow" ? "✅ تم النسخ" : "📋 نسخ لـ Flow"}</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono text-teal-950 bg-teal-50/70 p-2.5 rounded-lg border border-teal-100 text-left select-all" dir="ltr">
                      {guideData.experimentTransition.flowVideoPrompt}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* تفاصيل خطوات التجربة */}
            {experimentsToRender.length > 0 && (
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-teal-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 bg-teal-100 text-teal-800 rounded-2xl">🧪</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-teal-950">
                        التجارب والأنشطة العلمية مفصلة خطوة بخطوة مع فيديو Flow لكل خطوة
                      </h3>
                      <p className="text-xs text-teal-800 font-medium">
                        تنفيذ احترافي بالمعمل: كلام المعلمة المستفيض + أدوات التجربة + برومبت فيديو مخصص لكل خطوة
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={copyAllExperimentPrompts}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>🧪</span>
                    <span>{copiedSection === "all_exp_prompts" ? "✅ تم النسخ" : "نسخ برومبتات كل الخطوات"}</span>
                  </button>
                </div>

                {experimentsToRender.map((exp, eIdx) => {
                  const steps = getSafeSteps(exp);
                  const materials = Array.isArray(exp.materials) ? exp.materials : [];

                  return (
                    <div key={eIdx} className="bg-white rounded-xl p-5 sm:p-6 border border-teal-200 shadow-2xs space-y-4">
                      <div className="border-b border-gray-100 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-black text-base sm:text-lg text-teal-900">{exp.experimentTitle}</h4>
                          <p className="text-xs sm:text-sm text-teal-700 mt-1 font-medium leading-relaxed">🎯 الهدف العلمي: {exp.goal}</p>
                        </div>
                        <button
                          onClick={() => copyExperimentFullScript(exp, eIdx)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-center shrink-0"
                        >
                          <span>🎙️</span>
                          <span>{copiedSection === `exp_full_voice_${eIdx}` ? "✅ تم نسخ كلام التجربة!" : "نسخ سكريبت التجربة كاملاً بالترتيب"}</span>
                        </button>
                      </div>

                      {materials.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-gray-700 block mb-1.5">🧰 الأدوات المطلوبة بالمعمل بالتفصيل:</span>
                          <div className="flex flex-wrap gap-2">
                            {materials.map((m, mIdx) => (
                              <span key={mIdx} className="bg-teal-50 text-teal-900 text-xs px-3 py-1.5 rounded-lg border border-teal-200 font-semibold">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {exp.introAndMaterialsSpeech && (
                        <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800 block">
                            🎙️ كلام المعلمة في بداية التجربة (تعريف التجربة والهدف والأدوات بالتسلسل):
                          </span>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                            "{exp.introAndMaterialsSpeech}"
                          </p>
                        </div>
                      )}

                      {/* الخطوات المقسمة 1، 2، 3 */}
                      {steps.length > 0 && (
                        <div className="space-y-4 pt-1">
                          <span className="text-xs font-black text-teal-950 block">
                            🪜 خطوات التجربة بالتسلسل الدقيق (مع كلام المعلمة وبرومبت فيديو Flow لكل خطوة):
                          </span>
                          
                          {steps.map((st, sIdx) => (
                            <div key={sIdx} className="bg-gray-50/90 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-3">
                              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-7 h-7 bg-teal-700 text-white rounded-full flex items-center justify-center font-black text-xs">
                                  {st.stepNumber}
                                  </span>
                                  <span className="font-black text-xs sm:text-sm text-teal-950">
                                    {st.stepTitle}
                                  </span>
                                </div>

                                <button
                                  onClick={() => copyText(st.flowVideoPrompt, `exp_step_${eIdx}_${sIdx}`)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>🎬</span>
                                  <span>{copiedSection === `exp_step_${eIdx}_${sIdx}` ? "✅ تم النسخ" : "نسخ فيديو الخطوة"}</span>
                                </button>
                              </div>

                              <div className="text-xs space-y-2">
                                <p className="text-gray-700 leading-relaxed">
                                  <span className="font-bold text-teal-900">ما نفعله والمنطق العلمي وراءه: </span>
                                  {st.actionDetails}
                                </p>
                                {st.teacherSpeech && (
                                  <div className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                    <span className="font-bold text-emerald-800 block mb-0.5">🎙️ كلام المعلمة أثناء الخطوة: </span>
                                    <p className="font-semibold text-xs sm:text-sm leading-relaxed whitespace-pre-line">"{st.teacherSpeech}"</p>
                                  </div>
                                )}
                              </div>

                              {/* برومبت فيديو الخطوة */}
                              <div className="bg-purple-50/80 p-3 rounded-lg border border-purple-200 text-left font-mono text-[11px] text-purple-950" dir="ltr">
                                <span className="font-sans font-bold text-purple-800 text-[10px] block mb-1" dir="rtl">
                                  برومبت فيديو Flow لتنفيذ هذه الخطوة معملياً (3D Tabletop - بدون معلمة):
                                </span>
                                {st.flowVideoPrompt}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* الملاحظة والاستنتاج */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs">
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2.5">
                          <span className="font-bold text-amber-900 block text-xs sm:text-sm">👀 ماذا نلاحظ بالعين المجردة بالتفصيل؟</span>
                          <p className="text-amber-950 font-semibold leading-relaxed">{exp.observations}</p>
                          {exp.observationVideoPrompt && (
                            <div className="pt-2 border-t border-amber-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-bold text-purple-800">🎬 فيديو Flow للنتيجة:</span>
                                <button
                                  onClick={() => copyText(exp.observationVideoPrompt!, `exp_obs_${eIdx}`)}
                                  className="text-[11px] bg-purple-600 text-white px-2 py-0.5 rounded cursor-pointer"
                                >
                                  {copiedSection === `exp_obs_${eIdx}` ? "✅ تم" : "نسخ"}
                                </button>
                              </div>
                              <p className="text-[10px] font-mono text-purple-950 bg-white p-2 rounded border border-purple-100" dir="ltr">
                                {exp.observationVideoPrompt}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
                          <span className="font-bold text-emerald-800 block text-xs sm:text-sm">🏆 الاستنتاج العلمي النهائي الشامل:</span>
                          <p className="text-emerald-950 font-bold leading-relaxed">{exp.finalConclusion}</p>
                        </div>
                      </div>

                      {exp.observationAndConclusionSpeech && (
                        <div className="bg-emerald-50/90 p-4 rounded-xl border border-emerald-200 space-y-1.5">
                          <span className="text-xs font-bold text-emerald-900 block">
                            🎙️ كلام المعلمة لنهاية التجربة (الملاحظة بالتفصيل + الاستنتاج العلمي):
                          </span>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                            "{exp.observationAndConclusionSpeech}"
                          </p>
                        </div>
                      )}

                      {/* خطة أنيميشن الباوربوينت لخطوات التجربة المعملية */}
                      {renderPptAnimationCard(
                        getSafeExperimentPptPlan(exp, eIdx),
                        `exp_ppt_${eIdx}`,
                        `خطة أنيميشن الباوربوينت للتجربة المعملية (${eIdx + 1})`
                      )}

                      {exp.safetyPrecautions && (
                        <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 text-xs text-red-900 font-semibold flex items-center gap-2">
                          <span>⚠️</span>
                          <span>احتياطات الأمان بالمعمل: {exp.safetyPrecautions}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 3.5: خاتمة الدرس الشاملة والمتسلسلة */}
          {guideData.lessonConclusion && (
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-indigo-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2 bg-indigo-100 text-indigo-800 rounded-2xl">🌟</span>
                  <div>
                    <span className="text-xs bg-indigo-200 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full">
                      خاتمة متسلسلة وتثبيت الفهم
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-indigo-950 mt-0.5">
                      {guideData.lessonConclusion.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => copyText(guideData.lessonConclusion!.teacherScript, "conclusion_voice")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>🎙️</span>
                  <span>{copiedSection === "conclusion_voice" ? "✅ تم النسخ" : "نسخ كلام الخاتمة"}</span>
                </button>
              </div>

              <div className="bg-white/95 p-4 sm:p-5 rounded-xl border border-indigo-200 shadow-2xs">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
                  <span>🎙️</span> كلامكِ الصوتي في نهاية الدرس (ملخص متسلسل ومشجع + السلام الختامي):
                </span>
                <p className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                  "{guideData.lessonConclusion.teacherScript}"
                </p>
              </div>

              {guideData.lessonConclusion.flowVideoPrompt && (
                <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950">
                      🎬 برومبت فيديو Flow للخاتمة البصرية:
                    </span>
                    <button
                      onClick={() => copyText(guideData.lessonConclusion!.flowVideoPrompt!, "conclusion_flow")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>{copiedSection === "conclusion_flow" ? "✅ تم النسخ" : "📋 نسخ لـ Flow"}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-indigo-950 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 text-left select-all" dir="ltr">
                    {guideData.lessonConclusion.flowVideoPrompt}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: السبورة الذكية (ما يُكتب على السبورة فقط) */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-600/60 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 bg-black/40 rounded-2xl border border-white/20">📋</span>
                <div>
                  <span className="text-xs bg-amber-400 text-black font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ممنوع حشو الشرح الطويل
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    ما يُكتب على السبورة فقط (Blackboard Summary)
                  </h3>
                </div>
              </div>

              <button
                onClick={copyBlackboardOnly}
                className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs py-2 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
              >
                <span>{copiedSection === "blackboard_only" ? "✅ تم نسخ السبورة!" : "📋 نسخ ملخص السبورة"}</span>
              </button>
            </div>

            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 font-mono text-emerald-100 space-y-5">
              <div className="text-center border-b border-white/10 pb-3">
                <h4 className="text-lg sm:text-xl font-bold text-amber-300">
                  {blackboard.title}
                </h4>
              </div>

              {/* الكلمات والتعريفات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-amber-200 border-b border-amber-500/40 pb-1">
                    📌 المصطلحات والكلمات الأساسية:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-100">
                    {(blackboard.keyVocabulary || []).map((v, vIdx) => (
                      <li key={vIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-amber-200 border-b border-amber-500/40 pb-1">
                    📖 التعريفات والقوانين المركزة:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-100">
                    {(blackboard.definitions || []).map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* المقارنات والاستنتاجات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-amber-200 border-b border-amber-500/40 pb-1">
                    ⚖️ المقارنات السريعة:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-100">
                    {(blackboard.comparisons || []).map((c, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">⇄</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-amber-200 border-b border-amber-500/40 pb-1">
                    🏆 الاستنتاج النهائي:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-100">
                    {(blackboard.conclusions || []).map((cn, cnIdx) => (
                      <li key={cnIdx} className="flex items-start gap-1.5">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold text-amber-200">{cn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: التأكد من فهم الطلاب (Oral Questions) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-purple-100 text-purple-800 rounded-xl">❓</span>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    أسئلة التأكد من الفهم الشفوية مع الإجابات النموذجية للمعلمة
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">أسئلة من واقع الحياة، علل واستنتج، وعلى التجارب</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const qText = questionsToRender.map((q, i) => `س${i+1} (${q.questionType}): ${q.question}\nج: ${q.correctAnswer}`).join("\n\n");
                  copyText(qText, "questions");
                }}
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs py-1.5 px-3 rounded-lg transition-colors border border-purple-200 flex items-center gap-1 cursor-pointer"
              >
                <span>{copiedSection === "questions" ? "✅ تم النسخ" : "📋 نسخ كل الأسئلة"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {questionsToRender.map((q, idx) => (
                <div key={idx} className="bg-gradient-to-b from-purple-50/50 to-white p-4 rounded-xl border border-purple-100 shadow-2xs space-y-2 text-xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="inline-block bg-purple-200/80 text-purple-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {q.questionType}
                    </span>
                    <p className="font-black text-gray-900 text-xs sm:text-sm">
                      {q.question}
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100 text-emerald-900 font-semibold mt-2">
                    <span className="font-bold text-purple-900 block text-[10px] mb-0.5">💡 الإجابة الصحيحة:</span>
                    {q.correctAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL: مشاريع الدروس المحفوظة */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📂</span>
                <div>
                  <h3 className="font-black text-gray-900 text-base sm:text-lg">مشاريع الدروس السابقة المحفوظة</h3>
                  <p className="text-xs text-gray-500">يمكنكِ فتح أي درس تم حفظه سابقاً واستكمال العمل عليه فوراً</p>
                </div>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {savedGuides.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <span className="text-4xl block">📭</span>
                  <p className="text-sm font-bold">لا توجد دروس محفوظة بعد.</p>
                  <p className="text-xs">اضغطي على زر "💾 حفظ هذا الدرس في مشاريعي" لحفظ أي درس تقومين بإعداده!</p>
                </div>
              ) : (
                savedGuides.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setGuideData(g.guideData);
                      setShowSavedModal(false);
                      alert(`تم فتح درس: ${g.name}`);
                    }}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                          📖 درس علوم
                        </span>
                        <h4 className="font-black text-sm text-gray-900 group-hover:text-emerald-950">
                          {g.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        تاريخ الحفظ: {g.date} | عدد الجزئيات: {g.guideData?.scientificBeats?.length || 0} جزئية
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteSavedProject(g.id, e)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="حذف من المحفوظات"
                      >
                        🗑️
                      </button>
                      <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl group-hover:bg-emerald-700">
                        فتح واستعراض ⬅
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowSavedModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
