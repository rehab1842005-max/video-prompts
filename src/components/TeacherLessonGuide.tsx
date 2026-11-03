"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

export interface FlowVideoItem {
  shotTitle: string;
  prompt: string;
}

export interface IntroHook {
  hookTitle: string;
  teacherScript: string;
  analogyStory: string;
  videoPrompts?: FlowVideoItem[];
  flowVideoPrompt?: string; // backwards compatibility
}

export interface ScientificBeat {
  beatNumber: number;
  conceptTitle: string;
  teacherScript: string;
  simpleExplanation: string;
  textbookTerm: string;
  textbookDefinition: string;
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
  steps?: ExperimentStep[];
  stepsWithLogic?: any[];
  observations: string;
  observationVideoPrompt?: string;
  finalConclusion: string;
  safetyPrecautions?: string;
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
  blackboardSummary?: BlackboardSummary;
  checkUnderstanding?: CheckUnderstandingItem[];
}

export const PRESET_SAMPLE_GUIDE: LessonGuideData = {
  lessonTitle: "كيف تصنع النباتات غذاءها بالتفصيل؟ (عملية البناء الضوئي ومطبخ الورقة الخضراء)",
  detectedTopic: "عملية البناء الضوئي، تركيب الورقة والبلاستيدات، امتصاص الماء والغازات، وإنتاج الجلوكوز والأكسجين",
  introHook: {
    hookTitle: "مدخل الدرس: مطبخ النبات السحري ومقارنة طاقة الإنسان بالنبات",
    teacherScript: "يا هلا بكل أبطال العلوم الصغار! قاعدين ومصحصحين معايا؟ بصوا كده في البيت لما ماما تدخل المطبخ تعمل لنا أحلى أكلة مغذية بنحبها، بتحتاج إيه؟ بتحتاج بوتاجاز وأواني ومكونات صح؟ أومال النبات بقى الجميل اللي محطوط في البلكونة ده، بيعمل أكله إزاي وهو ما عندهوش بوتاجاز ولا مطبخ؟ يا ترى بيقف إزاي في الشمس وينط ويجري؟ لا طبعاً النبات مش بيتحرك، بس هو عنده أشطر مطبخ في الدنيا! مطبخ بيشتغل بضوء الشمس والهواء والماء عشان يعمل أحلى طبق طاقة وهو (السكريات والنشا). تعالوا النهاردة ندخل جوه ورقة النبات ونشوف المعجزة دي بتحصل إزاي خطوة بخطوة وبكل بساطة!",
    analogyStory: "تشبيه متكامل يجمع بين: ماما في المطبخ تحضر أشهى طعام على البوتاجاز والأواني، ونبتة جميلة في البلكونة تستمتع بالشمس، ومطبخ كرتوني سحري داخل الورقة يحول الضوء والماء إلى سكر ونشا.",
    videoPrompts: [
      {
        shotTitle: "فيديو 1: ماما في المطبخ والبوتجاز والأواني الشهية (تشبيه الأكل والطبخ)",
        prompt: "Charming 3D Pixar style scene of a warm cozy home kitchen. A cheerful loving mom stands near a modern stove where shiny copper pots simmer with aromatic bubbling stew and fresh colorful vegetables. Soft warm volumetric steam, appetizing lighting, cozy family home feel. ABSOLUTELY NO teachers, pure lifestyle food preparation B-roll."
      },
      {
        shotTitle: "فيديو 2: النبات الجميل في البلكونة يستمتع بالشمس الصباحية والنسيم",
        prompt: "Vibrant 3D Pixar animation of a sunny apartment balcony: A lovely potted green plant with lush healthy leaves sitting on the windowsill, basking in brilliant golden morning sunbeams and a gentle breeze, fluttering softly with life and vitality. Cinematic shallow depth of field. ABSOLUTELY NO teachers."
      },
      {
        shotTitle: "فيديو 3: المطبخ السحري داخل الورقة وطبق سكر الجلوكوز المتلألئ",
        prompt: "Magical 3D Pixar style interior of a translucent glowing green leaf, styled like an enchanting fairy-tale miniature kitchen counter. Golden sunbeams, crystalline water droplets, and floating air currents converge onto a delicate golden plate creating glowing sugar crystal cubes of pure energy. Wonderous, educational, sparkling render. ABSOLUTELY NO teachers."
      }
    ]
  },
  scientificBeats: [
    {
      beatNumber: 1,
      conceptTitle: "مفهوم التغذية: الكائنات المستهلكة مقابل الكائنات ذاتية التغذية",
      teacherScript: "تعالوا نفهم أول نقطة بالراحة كدا يا شطار: في علم الأحياء، ربنا قسم الكائنات الحية لنوعين رئيسيين في طريقة الأكل. النوع الأول هو إحنا والحيوانات زي القطة والأسد والخروف.. إحنا اسمنا (كائنات مستهلكة). يعني إيه مستهلكة؟ يعني ما بنعرفش نصنع أكلنا جوة أجسامنا، لازم نروح ندور على كائن تاني ناكله، زي ما بناكل خضار أو لحمة. لكن بقى النباتات دي معجزة تانية خالص! النبات هو الكائن الوحيد على كوكب الأرض اللي ما بيعتمدش على غيره في أكله، بل بيصنع وجبته الغذائية بنفسه من الصفر جوة خلاياه، وعلشان كده في كتاب العلوم بنسميه (كائن ذاتي التغذية)! يعني بيغذي نفسه بنفسه دون مساعدة من أحد.",
      simpleExplanation: "تنقسم الكائنات الحية وفق طريقة التغذية إلى: كائنات غير ذاتية التغذية (مستهلكة) تعتمد على غيرها للحصول على الغذاء العضوي الجاهز، وكائنات ذاتية التغذية (منتجة) تستطيع تحويل المواد غير العضوية البسيطة إلى مواد عضوية معقدة غنية بالطاقة.",
      textbookTerm: "كائنات ذاتية التغذية (Autotrophs)",
      textbookDefinition: "الكائنات الحية التي تستطيع صنع غذائها بنفسها من خلال تحويل مواد غير عضوية أولية بسيطة إلى مواد غذائية عضوية معقدة غنية بالطاقة (مثل النباتات الخضراء وبعض أنواع البكتيريا).",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: كائن مستهلك يبحث عن طعامه (أرنب لطيف يتناول جزرة)",
          prompt: "Cute 3D Pixar style animation of a friendly fluffy rabbit happily munching on a crisp orange carrot in a lush meadow, illustrating a consumer living organism obtaining ready food. Bright sunny day, delightful details. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: كائن منتج ذاتي التغذية (زهرة مشمسة تشع بطاقة الحياة)",
          prompt: "Elegant 3D animation of a vibrant sunflower growing proudly in rich dark soil, glowing with soft warm internal biological energy radiating outward through its translucent petals and stem under brilliant morning sunlight. Pure nature, educational Pixar aesthetic. ABSOLUTELY NO teachers."
        }
      ]
    },
    {
      beatNumber: 2,
      conceptTitle: "عالم الجذور تحت الأرض: امتصاص الماء والأملاح المعدنية كالمصاصة",
      teacherScript: "عشان أي شيف في الدنيا يطبخ وجبة متكاملة، بيحتاج مكونات أساسية.. أول مكون النبات بيحتاجه هو (الماء والأملاح المعدنية). طب المية دي بتجيله منين وهو واقف مكانه؟ من تحت الأرض! النبات عنده شبكة جذور عبقرية متفرعة في الطين، الجذور دي مش بس بتثبته في الأرض عشان الهوا ما يطيروش، دي مليانة شعيرات مجهرية دقيقة جداً اسمها الشعيرات الجذرية بتشتغل زي ملايين الشفاطات الصغيرة! بتشفط جزيئات المية والأملاح الذائبة في التربة زي الكالسيوم والمغنيسيوم، وتبدأ تضخها لأعلى ضد الجاذبية الأرضية!",
      simpleExplanation: "تمتلك الجذور آلاف الشعيرات الجذرية الدقيقة ذات الجدر الخلوية الرقيقة التي تزيد من مساحة سطح الامتصاص. تعمل هذه الشعيرات بالخاصية الأسموزية والانتشار لامتصاص الماء المحمل بالعناصر المعدنية الأساسية من حبيبات التربة الرطبة.",
      textbookTerm: "الجذور والشعيرات الجذرية (Roots & Root Hairs)",
      textbookDefinition: "الشعيرات الجذرية: امتدادات خلوية دقيقة من خلايا طبقة البشرة في جذر النبات، تعمل على زيادة مساحة السطح لامتصاص الماء والأملاح المعدنية من التربة.",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: ملايين الشعيرات الجذرية تمتص الماء والأملاح كالمصاصات",
          prompt: "Macro 3D cross-section animation beneath the soil: Detailed view of translucent microscopic root hairs wrapped around moist dark soil particles, visibly drawing in shimmering glowing blue water molecules and sparkling mineral ions like tiny straws into the root cylinder. Crisp lighting. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: تدفق قطرات الماء الزرقاء الصافية داخل أنسجة الجذر",
          prompt: "Luminous 3D macro animation showing glistening clear blue water droplets flowing smoothly through the inner root cortex cells, converging toward the central vascular core. Educational, clean Pixar animation. ABSOLUTELY NO teachers."
        }
      ]
    },
    {
      beatNumber: 3,
      conceptTitle: "شبكة المواسير الناقلة: صعود الماء كالمصعد عبر أوعية الخشب",
      teacherScript: "طب يا ترى يا أبطال، بعد ما المية دخلت في الجذر تحت في الطين.. إزاي بتطلع للشجرة العالية اللي طولها ممكن يوصل لـ 10 أمتار أو أكتر؟ سبحان الله! ساق النبات مش مجرد عصاية خشب، دي جواها شبكة مواسير وأنابيب دقيقة جداً ومفرغة اسمها (أوعية الخشب). الأنابيب دي عاملة زي المصعد أو شبكة مواسير المياه في العمارة، بتسحب المية والأملاح من الجذور وتفضل تطلعها للأعلى عبر الساق والفروع لحد ما توصلها بالظبط لباب المطبخ.. والمطبخ هنا هو الورقة الخضراء!",
      simpleExplanation: "ينتقل الماء والأملاح المعدنية في اتجاه واحد من الأسفل إلى الأعلى داخل نسيج وعائي متخصص يُعرف بنسيج الخشب (Xylem). يتكون هذا النسيج من أوعية وقصيبات دقيقة تعمل كأنابيب شعرية تنقل العصارة النيئة بقوى الشد الناتجة عن عملية النتح والضغط الجذري.",
      textbookTerm: "أوعية الخشب (Xylem Vessels)",
      textbookDefinition: "أوعية الخشب: أنابيب وعائية دقيقة ميتة ومجوفة تمتد من الجذور عبر الساق إلى الأوراق لنقل الماء والأملاح المعدنية الذائبة في اتجاه واحد نحو الأعلى.",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: شبكة مواسير الخشب الشفافة كالأسانسير السريع للأعلى",
          prompt: "Spectacular 3D cutaway animation of a green plant stem: Showing microscopic vertical translucent pipes (xylem vessels) glowing with cool blue light, as sparkling streams of water droplets rapidly and smoothly rush upwards through the vessels against gravity toward the upper leaf petioles. Dynamic upward camera motion. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: خروج قطرات الماء المتلألئة من عروق الورقة الخضراء",
          prompt: "Close-up 3D animation of the intricate network of leaf veins glowing as fresh water pulses through them, branching into microscopic capillary networks nourishing millions of green leaf cells. High-end scientific render. ABSOLUTELY NO teachers."
        }
      ]
    },
    {
      beatNumber: 4,
      conceptTitle: "الورقة الخضراء ومصنع البلاستيدات الخضراء العجيب",
      teacherScript: "تعالوا بقى نروح لأهم بطل في القصة كلها: الورقة الخضراء! اشمعنى النبات بيطبخ أكله في الورقة ومش في الساق أو الجذر؟ لأن الورقة مسطحة وعريضة ومرتفعة في الهواء، فتقدر تستقبل أكبر كمية من ضوء الشمس والهواء. ولما نقرب بالميكروسكوب وندخل جوة خلايا الورقة، هنلاقي جواها مصانع صغيورة ولطيفة جداً لونها أخضر اسمها (البلاستيدات الخضراء). البلاستيدات دي هي المطبخ الفعلي للنبات، وجواها كل المعدات اللي هتحول المية والهواء لغذاء مسكر يدي طاقة!",
      simpleExplanation: "تعتبر الأوراق الأعضاء الأساسية المسؤولة عن عملية البناء الضوئي في النبات. يتميز نسيج الورقة بوجود النسيج العمادي المليء بالبلاستيدات الخضراء (Chloroplasts)، وهي عضيات خلوية متخصصة تحتوي على أغشية الثايلاكويد ومادة الستروما حيث تجري التفاعلات الضوئية واللاضوئية.",
      textbookTerm: "البلاستيدات الخضراء (Chloroplasts)",
      textbookDefinition: "البلاستيدات الخضراء: عضيات خلوية متخصصة توجد بكثرة في خلايا أوراق النبات الخضراء، وتعتبر الموقع الرئيسي لحدوث تفاعلات عملية البناء الضوئي.",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: زووم مجهري فائق الدقة يغوص داخل خلايا الورقة الخضراء",
          prompt: "Super macro 3D zoom flying deep into the surface of a lush green leaf: Revealing the internal plant cell walls and showing hundreds of oval emerald-green chloroplast organelles floating harmoniously inside the cytoplasm, gently undulating with vitality. Pristine lighting, hyper-realistic Pixar-style scientific render. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: البلاستيدات الخضراء كورش عمل مصغرة ومبهجة للأطفال",
          prompt: "Enchanting 3D visualization of a single chloroplast organelle cut open to reveal neat stacked coin-like thylakoids (grana) glowing with soft green bioluminescence, bathing in microscopic crystalline fluids. Clean educational 3D visual. ABSOLUTELY NO teachers."
        }
      ]
    },
    {
      beatNumber: 5,
      conceptTitle: "الكلوروفيل صائد الضوء: ألواح الطاقة الشمسية للنبات",
      teacherScript: "طب ليه الورقة لونها أخضر وليه البلاستيدات لونها أخضر؟ علشان ربنا حط جواها صبغة سحرية عجيبة اسمها (الكلوروفيل). الكلوروفيل ده عامل زي ألواح الطاقة الشمسية اللي بنشوفها على أسطح العمارات النظيفة! وظيفته الأولى والأساسية إنه يصطاد أشعة الشمس الذهبية وفوتونات الضوء اللي نازلة من السماء، ويحبس طاقتها جواه. بدون الكلوروفيل، ضوء الشمس هيعدي من الورقة ولا كأن حاجة حصلت، ومش هنعرف نشغل البوتجاز ونسوي الطبخة الكيميائية!",
      simpleExplanation: "الكلوروفيل هو صبغة بيولوجية أساسية قادرة على امتصاص الأطوال الموجية للضوء (خاصة الأزرق والأحمر)، بينما تعكس اللون الأخضر وهو ما يمنح النبات لونه المميز. تعمل الطاقة الضوئية الممتصة على إثارة إلكترونات جزيئات الكلوروفيل مما يطلق سلسلة تفاعلات كيميائية حيوية لتحويل الطاقة الضوئية إلى طاقة كيميائية مخزنة.",
      textbookTerm: "صبغة الكلوروفيل (Chlorophyll Pigment)",
      textbookDefinition: "الكلوروفيل: الصبغة الخضراء الأساسية الموجودة داخل أقراص البلاستيدات الخضراء، والتي تمتص الطاقة الضوئية من أشعة الشمس لتحويلها إلى طاقة كيميائية لازمة لعملية البناء الضوئي.",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: فوتونات الضوء الذهبية تمتصها صبغة الكلوروفيل الخضراء",
          prompt: "Artistic 3D macro animation inside a single chloroplast: Molecular-scale view of delicate green chlorophyll pigment clusters smoothly absorbing incoming golden photons of sunlight, instantly igniting with soft golden and emerald luminescence as solar energy is successfully trapped. Mesmerizing and clear educational visual. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: مقارنة ألواح الطاقة الشمسية الحديثة بأوراق النبات",
          prompt: "Stylized split-screen 3D visual: On one side, sleek modern solar panels glistening under bright blue sky capturing sunlight. On the other side, an emerald green leaf absorbing the same warm sunlight beams in complete harmony. Clean cinematic lighting. ABSOLUTELY NO teachers."
        }
      ]
    },
    {
      beatNumber: 6,
      conceptTitle: "تنفس الورقة: الثغور الميكروسكوبية ودخول غاز ثاني أكسيد الكربون",
      teacherScript: "دلوقتي بقى عندنا المية من الجذور وطاقة الشمس في الكلوروفيل.. ناقص مكون تالت مهم جداً: الهواء! الورقة محتاجة غاز معين من الهوا اسمه (غاز ثاني أكسيد الكربون). طب الهوا بيدخل إزاي للورقة؟ لو قلبنا الورقة وبصينا على سطحها السفلي بالمجهر، هنلاقي فتحات ومسام دقيقة جداً اسمها (الثغور). كل فتحة ثغر عليها حارسين شطار اسمهم (الخلايا الحارسة). الخلايا الحارسة دي بتفتح الباب في الصباح لما يكون في شمس ومية، فيدخل غاز ثاني أكسيد الكربون للورقة، وتقفل الباب لما الجو يبقى حر أوي عشان النبتة ما تفقدش المية بتاعتها وتعطش!",
      simpleExplanation: "تنتشر الثغور (Stomata) بكثافة على السطح السفلي للورقة لتقليل فقد الماء بفعل أشعة الشمس المباشرة. تُحاط كل فتحة ثغر بزوج من الخلايا الحارسة (Guard Cells) المتخصصة التي تنظم فتح وغلق الثغور استجابةً للضوء ومستوى رطوبة النبات، مما يسمح بدخول غاز ثاني أكسيد الكربون اللازم للتفاعل وخروج بخار الماء والأكسجين.",
      textbookTerm: "الثغور والخلايا الحارسة (Stomata & Guard Cells)",
      textbookDefinition: "الثغور: فتحات ميكروسكوبية تنتشر على أسطح أوراق النبات وتتحكم في فتحها وغلقها خلايا حارسة، لتسمح بتبادل الغازات بين النبات والبيئة المحيطة وخروج بخار الماء في عملية النتح.",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: الخلايا الحارسة تفتح مسام الثغر لامتصاص ثاني أكسيد الكربون",
          prompt: "Microscopic 3D cellular animation of leaf lower epidermis: Zooming onto dual kidney-shaped guard cells swelling with water pressure to smoothly open an oval pore (stoma), drawing in floating stylized purple/cyan carbon dioxide gas molecules from the atmosphere into the spongy leaf tissue beneath. Clean, fluid, educational animation. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: انتشار جزيئات ثاني أكسيد الكربون بين الخلايا الإسفنجية",
          prompt: "Internal 3D cutaway of spongy mesophyll leaf tissue: Stylized purple molecules of carbon dioxide gracefully drifting through airy intercellular spaces, entering the moist walls of photosynthetic cells. Soft glowing lighting. ABSOLUTELY NO teachers."
        }
      ]
    },
    {
      beatNumber: 7,
      conceptTitle: "الطبخة الكيميائية الكبرى: إنتاج سكر الجلوكوز وتخزين النشا",
      teacherScript: "تعالوا بقى نجمع الوجبة العظيمة دي مع بعض يا شطار: المية وصلت من الجذور عبر الخشب، وثاني أكسيد الكربون دخل من الثغور في الورقة، والكلوروفيل سخن الموضوع بطاقة الشمس! جوة البلاستيدة بيحصل تفاعل كيميائي بديع: ذرات المية بتتفكك وتتحد مع ذرات الكربون والأكسجين، وتطلع لنا الناتج الأساسي اللي النبتة كانت بتجري علشانه: سكر مسكر اسمه (سكر الجلوكوز)! سكر الجلوكوز ده هو غذاء النبات وطاقته، بينقله في أنابيب تانية اسمها اللحاء لباقي أجزاء النبات عشان يكبر ويعمل جذوع وأوراق وأزهار، واللي بيزيد منه النبات بيخزنه في صورة (نشا) عشان لما يجي الليل ومفيش شمس يلاقي أكل ياكله!",
      simpleExplanation: "تكتمل عملية البناء الضوئي بتثبيت ثاني أكسيد الكربون في دورة كالفن لتكوين سكر الجلوكوز (C₆H₁₂O₆). يمثل الجلوكوز المصدر المباشر للطاقة الكيميائية التي تستهلكها خلايا النبات في التنفس الخلوي وبناء السيليلوز، بينما يُخزن الفائض منه في صورة جزيئات نشا معقدة في البلاستيدات والجذور والثمار.",
      textbookTerm: "عملية البناء الضوئي وسكر الجلوكوز (Photosynthesis & Glucose)",
      textbookDefinition: "عملية البناء الضوئي: عملية حيوية كيميائية تقوم بها النباتات الخضراء داخل البلاستيدات، تتحد فيها جزيئات الماء وغاز ثاني أكسيد الكربون باستخدام طاقة ضوء الشمس لإنتاج سكر الجلوكوز الغني بالطاقة وانطلاق غاز الأكسجين.",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: اندماج جزيئات الماء وثاني أكسيد الكربون بطاقة الشمس لتوليد الجلوكوز",
          prompt: "Magical 3D molecular animation inside the chloroplast stroma: Glowing blue water molecules and purple carbon dioxide molecules harmoniously merging under beams of golden solar light, rapidly assembling into a crystalline hexagonal glucose molecule glowing with warm amber energy. Dynamic macro view. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: تخزين سكر الجلوكوز الفائض في صورة حبيبات نشا براقة",
          prompt: "Detailed 3D macro animation inside a plant storage cell: Glowing glucose sugar units linking together into dense, pearlescent starch granules stacked neatly inside the amyloplast, storing reserve energy for the plant. Crisp lighting. ABSOLUTELY NO teachers."
        }
      ]
    },
    {
      beatNumber: 8,
      conceptTitle: "الهدية العظمى للعالم: انطلاق غاز الأكسجين ورئة كوكب الأرض",
      teacherScript: "طب يا ترى في حاجة تانية بتطلع من التفاعل ده؟ أيوة يا أحبابي، أعظم هدية لكوكب الأرض كله! لما جزيئات المية اتفككت عشان ناخد منها الهيدروجين للطبخة، اتبقى غاز مهم جداً وهو (غاز الأكسجين). النبات مش محتاج كل الأكسجين ده، فبيطلعه ويطرده برة عبر الثغور في الهواء الجوي. الأكسجين النقي ده هو اللي إحنا وكل حيوان وطير على كوكب الأرض بنتنفسه علشان نفضل عايشين! علشان كده بنقول دايماً إن الغابات والنباتات هي (رئة كوكب الأرض) الحقيقية اللي بتنقي الهوا وتدينا النفس النظيف اللي بنعيش بيه!",
      simpleExplanation: "أثناء التفاعلات الضوئية للبناء الضوئي، يحدث شطر ضوئي لجزيء الماء (Photolysis of water)، مما يحرر غاز الأكسجين (O₂) كناتج ثانوي ينطلق عبر الثغور إلى الهواء الجوي. هذه العملية مسؤولة عن تجديد مخزون الأكسجين في الغلاف الجوي واستقرار نسبة الغازات اللازمة لتنفس جميع الكائنات الهوائية.",
      textbookTerm: "غاز الأكسجين (Oxygen Gas - O₂)",
      textbookDefinition: "غاز الأكسجين: الغاز الناتج كناتج ثانوي من انشطار جزيئات الماء أثناء عملية البناء الضوئي، والذي ينطلق إلى الهواء الجوي ويعد أساسياً لاستمرار عملية التنفس لكافة الكائنات الحية الهوائية.",
      videoPrompts: [
        {
          shotTitle: "فيديو 1: فقاعات غاز الأكسجين الكريستالية النقية تنطلق من ثغور الورقة",
          prompt: "Breathtaking 3D animation: Microscopic bubbles of pure glowing blue oxygen gas gracefully rising out of the leaf stomata into the fresh sunny atmosphere, drifting upwards over a thriving green forest bathed in morning light. Serene, vibrant, cinematic nature animation. ABSOLUTELY NO teachers."
        },
        {
          shotTitle: "فيديو 2: مشهد بانورامي لغابات الأرض العظيمة كرئة خضراء تتنفس بالحياة",
          prompt: "Cinematic sweeping aerial drone-style 3D animation over an immense, untouched emerald rainforest at sunrise. Gentle mists rise from the canopy under golden sunbeams, symbolizing oxygen production and global vitality. Epic and uplifting visual. ABSOLUTELY NO teachers."
        }
      ]
    }
  ],
  experimentTransition: {
    teacherSpeech: "شفتوا يا شطار الجمال العلمي ده؟ طب تفتكروا إحنا في مادة العلوم بنصدق الكلام وخلاص من غير ما نتأكد بعنينا؟ لأ طبعاً! إحنا علماء المستقبل، والعلماء لازم يجربوا بنفسهم في المعمل عشان يتأكدوا من الحقيقة خطوة بخطوة. يلا بينا نلبس البالطو الأبيض وندخل المعمل سوا، ونعمل أحلى وأمتع تجربة عملية نتأكد بيها من المعجزة دي بعيوننا! جاهزين؟ يلا بينا نجرب ونشوف النشا بيتكون إزاي بالضوء!",
    flowVideoPrompt: "Exciting 3D Pixar style tracking shot entering a clean, bright, and cheerful children's science lab: A polished lab bench with glass beakers, a metal magnifying glass, colorful test tubes, and a fresh potted green plant under warm golden morning light. Inspiring educational cinematic render. ABSOLUTELY NO teachers."
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
      steps: [
        {
          stepNumber: 1,
          stepTitle: "حجب جزء من ورقة النبات عن أشعة الشمس",
          actionDetails: "نختار ورقة خضراء سليمة على نبات سليم، ونغطي جزءاً محدداً من منتصفها بشريط من الورق الأسود المعتم من الجهتين (العلوية والسفلية) ونثبته جيداً بمشبك، ثم نترك النبات في مكان مشمس لعدة ساعات.",
          teacherSpeech: "هنمسك النبتة الحلوة دي، وننقي ورقة خضراء مصحصحة. هنجيب شريط ورق أسود معتم ما بيدخلش أي نور، ونغطي حتة في نص الورقة ونثبتها بالمشبك، ونسيب باقي الورقة مكشوفة للشمس.. كدا إحنا عملنا مقارنة عادلة: حتة هيوصلها شمس وحتة تانية محرومة من الشمس تماماً، ونسيب النبات في الشمس 4 أو 5 ساعات يشتغل براحته!",
          flowVideoPrompt: "Crisp 3D animation in a bright clean science lab: A neat laboratory bench with a healthy potted plant. Gentle hands using a black opaque paper strip and a metal clip to cover the middle portion of a broad green leaf, while sunlight streams onto the exposed leaf areas. Clean Pixar educational aesthetic. ABSOLUTELY NO teachers, close-up hands and lab bench only."
        },
        {
          stepNumber: 2,
          stepTitle: "قطف الورقة وغليها بالماء الساخن لقتل الخلايا",
          actionDetails: "ننزع الشريط الأسود ونقطف الورقة، ثم نغمرها في كأس به ماء يغلي لمدة دقيقة واحدة، وذلك لقتل الأنسجة الحية وتليين الجدر الخلوية وتسهيل نفاذ المواد الكيميائية إلى داخل الخلايا.",
          teacherSpeech: "بعد ما عدت الساعات، هنفك المشبك الأسود ونقطف الورقة. أول خطوة معملية هنعملها: هنحط الورقة في كاسة فيها مية بتغلي لمدة دقيقة واحدة بس.. ليه بنعمل كدا يا شطار؟ علشان نوقف التفاعلات الحيوية ونلين جدار الخلية، فيبقى سهل على المحاليل تدخل جوة الخلايا بعد شوية.",
          flowVideoPrompt: "Cinematic 3D lab animation: A transparent glass beaker with boiling bubbling water on a digital hotplate. Delicate metal forceps gently lowering a broad green leaf into the bubbling water; steam rises gently under focused lab lighting. High quality macro render. ABSOLUTELY NO teachers."
        },
        {
          stepNumber: 3,
          stepTitle: "إزالة صبغة الكلوروفيل الخضراء بواسطة الكحول الإيثيلي",
          actionDetails: "نخرج الورقة ونضعها في أنبوبة اختبار بها كحول إيثيلي، ثم نضع الأنبوبة داخل حمام مائي ساخن حتى يذوب الكلوروفيل ويتحول لون الكحول إلى الأخضر وتصبح الورقة بيضاء شاحبة كلياً.",
          teacherSpeech: "دلوقتي الورقة لسه لونها أخضر، واللون الأخضر ده هيخلينا مانشوفش أي تغير لوني يحصل! فإحنا عايزين نسحب اللون الأخضر.. هنعمل إيه؟ هنحط الورقة في أنبوبة فيها كحول إيثيلي، والأنبوبة دي هنحطها جوة حمام مية سخنة.. هنلاحظ إن الكحول بقى لونه أخضر غامق، والورقة بقى لونها أبيض شاحب خالص وبقت جاهزة للاختبار!",
          flowVideoPrompt: "Cinematic 3D lab shot: Inside a water bath beaker, a glass test tube contains clear ethyl alcohol holding the leaf. The vibrant green chlorophyll visibly leaches out of the leaf tissue into the alcohol, turning the liquid emerald green while the leaf becomes pale, bleached white and translucent. ABSOLUTELY NO teachers."
        },
        {
          stepNumber: 4,
          stepTitle: "إضافة قطرات محلول اليود لاختبار وجود النشا",
          actionDetails: "نغسل الورقة في ماء بارد لتليينها، ثم نفردها في طبق بتري زجاجي مسطح، وننقط فوقها قطرات من محلول اليود الكاشف بواسطة القطارة وننتظر دقيقة لملاحظة الاستجابة اللونية.",
          teacherSpeech: "هنغسل الورقة البيضاء دي بمية باردة ونفردها بالراحة في طبق زجاجي. دلوقتي هنجيب كاشف سحري اسمه (محلول اليود).. اليود لونه الطبيعي بني برتقالي، بس اليود ده بيعشق النشا! أول ما يقابل جزيئات نشا وسكر بيتحول فوراً للون الأزرق الداكن القريب من الأسود! تعالوا ننقط بالقطارة ونشوف المفاجأة اللي هتحصل!",
          flowVideoPrompt: "Macro 3D laboratory shot: A glass pipette dropping golden-amber droplets of iodine solution onto a pale flat leaf resting in a clean Petri dish. Crisp glass reflections, realistic liquid surface tension. ABSOLUTELY NO teachers, macro tabletop focus."
        }
      ],
      observations: "الجزء من الورقة الذي كان معرضاً للشمس المباشرة تلون بالكامل باللون الأزرق القاتم (الأزرق المسود)، بينما الجزء الأوسط الذي كان محجوباً بالشريط الأسود ظل بلون محلول اليود البرتقالي الباهت دون أي تغير لوني.",
      observationVideoPrompt: "Splendid 3D macro animation of the leaf in the Petri dish: The sun-exposed sections of the leaf visibly and smoothly transform into deep dark blue/violet as iodine reacts with starch, while the covered rectangular center remains pale yellowish brown, showing a sharp clear contrast. ABSOLUTELY NO teachers.",
      finalConclusion: "الجزء المعرض للشمس فقط هو الذي استطاع القيام بعملية البناء الضوئي وتكوين النشا، مما يثبت بشكل قاطع أن ضوء الشمس شرط أساسي لا غنى عنه لصنع غذاء النبات.",
      safetyPrecautions: "يُمنع منعاً باتاً تسخين أنبوبة الكحول الإيثيلي على اللهب المباشر لأن الكحول مادة شديدة وقابلة للاشتعال، ويجب تسخينه دائماً داخل حمام مائي ساخن فقط."
    }
  ],
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
      flowVideoPrompt: "Detailed 3D laboratory animation of this step action. Clean Pixar educational style. ABSOLUTELY NO teachers."
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
    return data.scientificBeats.map((b: any, idx: number) => ({
      ...b,
      beatNumber: b.beatNumber || idx + 1,
      videoPrompts: getSafeVideoPrompts(b, `مشهد الجزئية ${idx + 1}`)
    }));
  }
  if (Array.isArray(data.beats) && data.beats.length > 0) {
    return data.beats.map((b: any, idx: number) => ({
      beatNumber: b.beatNumber || idx + 1,
      conceptTitle: b.conceptTitle || `جزئية ${idx + 1}`,
      teacherScript: b.teacherVoiceover || b.teacherScript || "",
      simpleExplanation: b.simpleExplanation || b.analogyIdea || "",
      textbookTerm: b.textbookTerm || b.conceptTitle || "المصطلح العلمي",
      textbookDefinition: b.textbookDefinition || b.simpleExplanation || "التعريف العلمي المعتمد",
      flowVideoPrompt: b.flowVideoPrompt || "",
      videoPrompts: getSafeVideoPrompts(b, `مشهد الجزئية ${idx + 1}`)
    }));
  }
  if (Array.isArray(data.sections) && data.sections.length > 0) {
    return data.sections.map((s: any, idx: number) => ({
      beatNumber: idx + 1,
      conceptTitle: s.title || `جزئية ${idx + 1}`,
      teacherScript: s.teacherSpeech || "",
      simpleExplanation: s.scientificExplanation || s.realLifeAnalogy || "",
      textbookTerm: s.title || "المصطلح العلمي",
      textbookDefinition: s.scientificExplanation || "",
      flowVideoPrompt: s.flowVideoPrompt || s.analogyVideoMotionPrompt || "",
      videoPrompts: getSafeVideoPrompts(s, `مشهد الجزئية ${idx + 1}`)
    }));
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
      console.error("Failed to load saved lesson guides:", e);
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
      console.error("Failed to delete project:", e);
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

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل تحليل وتقسيم الدرس");
      }

      const data = await res.json();
      if (data.guide) {
        const normalizedBeats = getSafeBeats(data.guide);
        const rawExperiments = Array.isArray(data.guide.experiments) ? data.guide.experiments : [];
        const normalizedExperiments = rawExperiments.map((exp: any) => ({
          ...exp,
          materials: Array.isArray(exp.materials) ? exp.materials : [],
          steps: getSafeSteps(exp)
        }));

        setGuideData({
          ...data.guide,
          scientificBeats: normalizedBeats,
          experiments: normalizedExperiments
        });
        alert("🎉 تم إعداد الشرح العلمي المفصل مع كل برومبتات الفيديو والتمهيد للتجربة!");
      }
    } catch (e: any) {
      console.error(e);
      alert("خطأ: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe computed lists
  const beatsToRender = getSafeBeats(guideData);
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

  // Copy All Voiceovers in sequential order for easy microphone recording
  const copyAllVoiceoverScript = () => {
    if (!guideData) return;
    let script = `=== سكريبت التسجيل الصوتي الشامل والمفصل للمعلمة ===\nدرس: ${guideData.lessonTitle}\n\n`;

    if (guideData.introHook) {
      script += `[الدخلة التمهيدية - تشبيهات البداية]:\n${guideData.introHook.teacherScript}\n\n---\n\n`;
    }

    if (beatsToRender.length > 0) {
      beatsToRender.forEach((b) => {
        script += `[المشهد ${String(b.beatNumber).padStart(2, "0")} - ${b.conceptTitle}]:\n`;
        script += `${b.teacherScript}\n\n`;
        script += `(المصطلح في الكتاب: ${b.textbookTerm} | تعريفه: ${b.textbookDefinition})\n\n---\n\n`;
      });
    }

    if (guideData.experimentTransition?.teacherSpeech) {
      script += `[تمهيد المعلمة والانتقال للتجربة العملية]:\n${guideData.experimentTransition.teacherSpeech}\n\n---\n\n`;
    }

    if (experimentsToRender.length > 0) {
      experimentsToRender.forEach((exp, idx) => {
        script += `[تجربة ${idx + 1}: ${exp.experimentTitle}]:\n`;
        const steps = getSafeSteps(exp);
        steps.forEach((st) => {
          script += `الخطوة ${st.stepNumber}: ${st.teacherSpeech}\n`;
        });
        script += `\n---\n\n`;
      });
    }

    copyText(script, "all_voiceover");
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
    txt += `  (الشرح المفصل + فيديوهات Flow لكل تشبيه + تمهيد التجربة والتجارب)\n`;
    txt += `  إعداد: Sci.Rehab Elsibai Studio\n`;
    txt += `  عنوان الدرس: ${guideData.lessonTitle}\n`;
    txt += `  المجال: ${guideData.detectedTopic || "علمي مخصص"}\n`;
    txt += `======================================================================\n\n`;

    if (guideData.introHook) {
      txt += `🎬 الدخلة والتمهيد بتشبيهات واقعية:\n`;
      txt += `* عنوان الدخلة: ${guideData.introHook.hookTitle}\n`;
      txt += `* فكرة التشبيهات: ${guideData.introHook.analogyStory}\n`;
      txt += `* كلام المعلمة للتسجيل الصوتي:\n${guideData.introHook.teacherScript}\n\n`;
      txt += `* فيديوهات Flow لتشبيهات الدخلة (${hookVideoPrompts.length} فيديو):\n`;
      hookVideoPrompts.forEach((vp, idx) => {
        txt += `  [فيديو ${idx + 1} - ${vp.shotTitle}]:\n  ${vp.prompt}\n\n`;
      });
      txt += `----------------------------------------------------------------------\n\n`;
    }

    if (beatsToRender.length > 0) {
      txt += `🔬 الشرح العلمي المفصل المستفيض (المشاهد العلمية وفيديوهاتها):\n\n`;
      beatsToRender.forEach((b) => {
        txt += `######################################################################\n`;
        txt += `مشهد ${String(b.beatNumber).padStart(2, "0")}: ${b.conceptTitle}\n`;
        txt += `🎙️ كلامكِ الصوتي في المونتاج (المفصل):\n${b.teacherScript}\n\n`;
        txt += `📖 المصطلح في كتاب المدرسة: ${b.textbookTerm}\n`;
        txt += `📝 التعريف المكتوب في الكتاب: ${b.textbookDefinition}\n\n`;
        txt += `💡 الشرح العلمي الموسع: ${b.simpleExplanation}\n\n`;
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
        if (exp.safetyPrecautions) txt += `* احتياطات الأمان: ${exp.safetyPrecautions}\n`;
        txt += `\n----------------------------------------------------------------------\n\n`;
      });
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
              <span>🎬</span>
              <span>فيديوهات Flow لكل تشبيه في كلام المعلمة + تمهيد للتجربة (يلا بينا نجرب) + حفظ المشاريع</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              دليل الشرح المفصل وفيديوهات Flow لكل تشبيه
            </h2>
            <p className="text-emerald-200/90 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed">
              شرح مبسط وممتع أوتوماتيكياً، مع توليد كذا برومبت فيديو تحت كلام المعلمة يغطي كل تشبيه قالته، وتمهيد متناسق للتجربة دون أي قفز، مع حفظ واسترجاع مشاريعكِ في أي وقت!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setGuideData(PRESET_SAMPLE_GUIDE);
                alert("تم تحميل النموذج الاسترشادي الموسع (تشبيهات فيديو متعددة + تمهيد التجربة)!");
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              🔄 عرض النموذج الاسترشادي
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
              2. أو اكتبي عنوان الدرس (سيفهمه ويشرحه أوتوماتيكياً):
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
              {isLoading ? "جاري فهم الدرس وصياغة الفيديوهات..." : "🚀 فهم الدرس وصياغة الشرح وكل فيديوهات التشبيه"}
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
                ✨ تم إعداد الشرح العلمي المفصل ({beatsToRender.length} جزئية تفصيلية)
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
                      التشبيه فقط في الدخلة والبداية
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
              <div className="bg-white/95 p-4 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1.5">
                  <span>🎙️</span> كلامكِ الصوتي في بداية الفيديو (مفصل ومشوق لفتح شهية الأطفال للتفكير):
                </span>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                  "{guideData.introHook.teacherScript}"
                </p>
              </div>

              {/* فكرة التشبيه الحياتي */}
              <div className="text-xs text-amber-950">
                <span className="font-bold text-amber-900">💡 فكرة تشبيه البداية بالتفصيل: </span>
                <span>{guideData.introHook.analogyStory}</span>
              </div>

              {/* قائمة برومبتات الفيديو لكل تشبيه ورد في كلام المعلمة */}
              <div className="space-y-3 pt-2 border-t border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <span>🎬</span> برومبتات فيديو Flow لجميع التشبيهات المذكورة في كلام المعلمة ({hookVideoPrompts.length} فيديو متتالي لتجميعها في المونتاج):
                  </span>
                  <button
                    onClick={() => {
                      const allHookPrompts = hookVideoPrompts.map((vp, i) => `SHOT ${i + 1} - ${vp.shotTitle}:\n${vp.prompt}`).join("\n\n" + "=".repeat(35) + "\n\n");
                      copyText(allHookPrompts, "all_hook_prompts");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{copiedSection === "all_hook_prompts" ? "✅ تم النسخ" : "📋 نسخ كل تشبيهات الدخلة"}</span>
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
                    الشرح العلمي المفصل المستفيض + فيديوهات Flow المتتالية لكل جزئية
                  </h3>
                  <p className="text-xs text-gray-500">
                    شرح وافٍ بدون أي اختصار، مع توليد فيديوهات Flow لكل مشهد أو تشبيه ورد في كلام المعلمة لتجمعيها في المونتاج!
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
                    <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-xl border border-emerald-200">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                        <span>🎙️</span> كلامكِ الصوتي الكامل للتسجيل في المونتاج (اشرحي بالراحة بهدوء وتفصيل مستفيض للأطفال):
                      </span>
                      <p className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                        "{beat.teacherScript}"
                      </p>
                    </div>

                    {/* 2. بطاقة المصطلح والتعريف في كتاب المدرسة */}
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

                    {/* 3. الشرح العلمي المفصل والموسع */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
                      <span className="font-bold text-gray-900 block">
                        💡 الشرح العلمي المفصل والموسع للظاهرة (الآلية والسبب والأهمية):
                      </span>
                      <p className="leading-relaxed leading-6">{beat.simpleExplanation}</p>
                    </div>

                    {/* 4. قائمة برومبتات فيديو Flow لكل تشبيه/مشهد في كلام المعلمة */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-purple-950 block">
                            🎬 برومبتات فيديو Flow المرافقة لكلام المعلمة ({beatPrompts.length} فيديو متتالي لتركيبها معاً):
                          </span>
                          <span className="text-[11px] text-purple-700 font-medium">
                            فيديوهات 3D Pixar بدون معلمات لتضعيها في المونتاج فوق صوتكِ
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
                      <div className="border-b border-gray-100 pb-2.5">
                        <h4 className="font-black text-base sm:text-lg text-teal-900">{exp.experimentTitle}</h4>
                        <p className="text-xs sm:text-sm text-teal-700 mt-1 font-medium leading-relaxed">🎯 الهدف العلمي: {exp.goal}</p>
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
                                    <p className="font-semibold text-xs leading-relaxed">"{st.teacherSpeech}"</p>
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
