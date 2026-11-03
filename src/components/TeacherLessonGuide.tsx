"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

export interface IntroHook {
  hookTitle: string;
  teacherScript: string;
  analogyStory: string;
  flowVideoPrompt: string;
}

export interface ScientificBeat {
  beatNumber: number;
  conceptTitle: string;
  teacherScript: string;
  simpleExplanation: string;
  textbookTerm: string;
  textbookDefinition: string;
  flowVideoPrompt: string;
}

export interface ExperimentStep {
  stepNumber: number;
  stepTitle: string;
  actionDetails: string;
  teacherSpeech: string;
  flowVideoPrompt: string;
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
  experiments?: Experiment[];
  blackboardSummary?: BlackboardSummary;
  checkUnderstanding?: CheckUnderstandingItem[];
}

export const PRESET_SAMPLE_GUIDE: LessonGuideData = {
  lessonTitle: "كيف تصنع النباتات غذاءها؟ (عملية البناء الضوئي ومطبخ الورقة)",
  detectedTopic: "البناء الضوئي، حاجة النبات للماء والهواء والضوء، ونواتج التغذية",
  introHook: {
    hookTitle: "مدخل الدرس: الشعور بالجوع وفتح الثلاجة للأكل",
    teacherScript: "صباح الخير يا دكاترة المستقبل! تعالوا نبدأ بسؤال صغنتوت خالص: لما بنكون جعانين وتعبانين بعد يوم طويل، أول حاجة بنعملها إيه؟ بنجري على التلاجة أو المطبخ ناكل حاجة حلوة تديلنا طاقة ونقدر نلعب ونذاكر، صح؟ يا ترى بقى الشجرة أو النبتة الخضراء اللي واقفة في الشارع أو البلكونة دي.. بتاكل إزاي وهي ما بتمشيش ولا عندها إيدين تطبخ؟ تعالوا نشوف مع بعض بالراحة واحدة واحدة!",
    analogyStory: "طفل أو شخص يشعر بالجوع ويفتح ثلاجة دافئة ومضيئة ليأكل ساندوتش طازجاً مغذياً يعيد له طاقته ونشاطه.",
    flowVideoPrompt: "Cinematic 3D Pixar animation of a cozy modern sunlit kitchen. A cheerful hungry boy opens a modern refrigerator glowing with warm bright light, takes out a fresh healthy colorful sandwich, smiles joyfully and takes an appetizing bite as glowing sparkles float around him symbolizing pure energy. Warm cinematic depth of field, vibrant textures. ABSOLUTELY NO teachers, NO school presentation."
  },
  scientificBeats: [
    {
      beatNumber: 1,
      conceptTitle: "النبات كائن حي ذاتي التغذية يصنع طعامه بنفسه",
      teacherScript: "بالراحة كدا يا شطار، النبتة زيها زينا بالظبط، كائن حي بيحتاج يتغذى علشان يعيش ويكبر. بس الفرق العظيم إن النبتة ما بتتحركش تروح تشتري أكل.. هي اللي بتصنع أكلها بنفسها جوا جسمها! وعلشان كده بنسميها كائنات ذاتية التغذية.",
      simpleExplanation: "النبات لا يأكل كائنات أخرى، بل يمتلك قدرة فريدة على تحويل المواد البسيطة من حوله إلى غذاء كامل.",
      textbookTerm: "كائنات ذاتية التغذية (Autotrophs)",
      textbookDefinition: "الكائنات الحية التي تستطيع صنع غذائها بنفسها من خلال عملية البناء الضوئي مثل النباتات الخضراء.",
      flowVideoPrompt: "Macro 3D scientific visualization in Pixar aesthetic: A healthy vibrant green potted plant with leaves gently swaying in a soft breeze. A gentle translucent cutaway view shows internal vital energy glowing warmly through its cellular stem under soft morning sunlight. Crisp educational 3D visual. ABSOLUTELY NO teachers, NO school."
    },
    {
      beatNumber: 2,
      conceptTitle: "امتصاص الجذور للماء والأملاح وصعودها عبر أوعية الخشب",
      teacherScript: "أول حاجة محتاجها النبات علشان يصنع أكله هي المية. مين اللي بيجيب له المية؟ الجذور تحت الأرض! الجذور دي ممتدة في الطين بتسحب المية والأملاح المعدنية من التربة، وتبعتها فوق في أنابيب وأوعية صغيرة جداً اسمها أوعية الخشب لحد ما توصل للورقة الخضراء.",
      simpleExplanation: "تمتص الشعيرات الجذرية الماء والأملاح المعدنية من حبيبات التربة وتضخها للأعلى عبر أوعية الخشب لتصل للأوراق.",
      textbookTerm: "أوعية الخشب (Xylem Vessels)",
      textbookDefinition: "أوعية الخشب: أنابيب دقيقة مجوفة تنقل الماء والأملاح المعدنية الذائبة من الجذور إلى الساق والأوراق.",
      flowVideoPrompt: "Detailed 3D scientific cutaway animation beneath the soil: Translucent plant root hairs absorbing glowing blue water molecules and sparkling mineral particles from brown soil grains, then smoothly pumping the illuminated liquid upward through vertical microscopic xylem tubes inside the plant stem. Educational macro animation. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 3,
      conceptTitle: "الورقة الخضراء ومادة الكلوروفيل صائدة الضوء",
      teacherScript: "تاني حاجة: الورقة الخضراء دي هي مصنع الأكل ومطبخ النبتة. ليه الورقة لونها أخضر؟ علشان جواها مادة سحرية اسمها (الكلوروفيل) موجودة جوة أكياس صغيرة اسمها البلاستيدات الخضراء. المادة الخضراء دي شغلتها تسحب وتمتص ضوء الشمس علشان تدفي وتساعد في طبخ الغذاء.",
      simpleExplanation: "تحتوي خلايا الورقة على بلاستيدات خضراء بداخلها صبغة الكلوروفيل التي تمتص الطاقة الضوئية من الشمس وتحولها لطاقة كيميائية.",
      textbookTerm: "الكلوروفيل / البلاستيدات الخضراء (Chlorophyll / Chloroplasts)",
      textbookDefinition: "الكلوروفيل: الصبغة الخضراء الموجودة في البلاستيدات الخضراء بأوراق النبات، والتي تمتص طاقة الضوء اللازمة للبناء الضوئي.",
      flowVideoPrompt: "Super close-up 3D macro animation diving deep inside a translucent emerald green leaf: Microscopic chloroplast organelles glowing softly green, capturing dancing golden sunlight photons and beams of light across their delicate membranes. Crisp 3D scientific rendering, captivating and clean. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 4,
      conceptTitle: "تنفس الورقة ودخول ثاني أكسيد الكربون عبر الثغور",
      teacherScript: "تالت حاجة محتاجها النبات: الهواء! الورقة فيها فتحات دقيقة جداً ما نشوفهاش إلا بالميكروسكوب اسمها (الثغور). الثغور دي بتفتح وتقفل علشان تسحب من الجو غاز اسمه (ثاني أكسيد الكربون).",
      simpleExplanation: "تنتشر الثغور على سطحي الورقة (خاصة السطح السفلي) وتتحكم فيها خلايا حارسة لتسمح بدخول غاز ثاني أكسيد الكربون اللازم للتفاعل.",
      textbookTerm: "الثغور والخلايا الحارسة (Stomata & Guard Cells)",
      textbookDefinition: "الثغور: فتحات ميكروسكوبية دقيقة على سطح أوراق النبات تسمح بتبادل الغازات وخروج بخار الماء.",
      flowVideoPrompt: "Microscopic 3D cellular animation of a leaf surface: Zooming in on dual bean-shaped guard cells smoothly opening an oval pore (stoma), pulling in floating stylized translucent cyan/purple carbon dioxide gas molecules from the air into the internal spongy leaf tissue. Fluid, clean 3D motion. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 5,
      conceptTitle: "الطبخة الكيميائية وتكوين سكر الجلوكوز",
      teacherScript: "دلوقتي المية جت من الجذور، والهواء دخل من الثغور، وطاقة الشمس مسكتهم كلهم مع بعض، وحصل تفاعل كيميائي جميل جوة الورقة، وطلّع الغذاء اللي النبتة محتاجاه وهو سكر اسمه (سكر الجلوكوز) اللي بيديها الطاقة عشان تكبر وتطول وتعمل ثمار وأزهار!",
      simpleExplanation: "تتحد جزيئات الماء وثاني أكسيد الكربون باستخدام الطاقة الضوئية لإنتاج سكر الجلوكوز الغني بالطاقة الكيميائية المخزنة.",
      textbookTerm: "عملية البناء الضوئي (Photosynthesis)",
      textbookDefinition: "عملية حيوية تقوم بها النباتات الخضراء لصنع غذائها (سكر الجلوكوز) باستخدام طاقة ضوء الشمس والماء وغاز ثاني أكسيد الكربون.",
      flowVideoPrompt: "Magical 3D scientific animation inside a plant cell: Golden sunbeams, blue water droplets, and atmospheric gas molecules combining in harmony inside the chloroplast, transforming into glistening crystalline hexagonal glucose molecules that glow with golden vitality. Inspiring educational visual. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 6,
      conceptTitle: "خروج غاز الأكسجين هدية النبات للعالم",
      teacherScript: "ومش بس كده يا أبطال! بعد ما الورقة خلصت صنع الجلوكوز، بيخرج ناتج تاني هدية عظيمة لينا كلنا، وهو غاز الأكسجين النقي اللي بيطلع من الثغور في الهواء عشان نتنفسه إحنا وكل الكائنات الحية ونعيش.",
      simpleExplanation: "كناتج ثانوي لعملية البناء الضوئي، ينطلق غاز الأكسجين في الهواء الجوي مما يحافظ على استمرار الحياة والتنفس على كوكب الأرض.",
      textbookTerm: "غاز الأكسجين (Oxygen Gas - O₂)",
      textbookDefinition: "الغاز الناتج من عملية البناء الضوئي، والذي تحتاجه جميع الكائنات الحية في عملية التنفس لإنتاج الطاقة.",
      flowVideoPrompt: "Uplifting 3D animation: Microscopic bubbles of pure glowing blue oxygen gas gracefully rising out of the leaf stomata into the fresh sunny atmosphere, drifting upwards over a thriving green forest bathed in morning light. Serene, vibrant, cinematic nature animation. ABSOLUTELY NO teachers."
    }
  ],
  experiments: [
    {
      experimentTitle: "تجربة إثبات حاجة النبات للضوء لصنع غذائه (تكوين النشا)",
      goal: "إثبات عملياً أن النبات لا يستطيع صنع الغذاء (النشا) في غياب ضوء الشمس المباشر.",
      materials: [
        "أصيص نبات مورق أخضر سليم",
        "شريط من الورق الأسود المعتم ودبابيس ورق",
        "كحول إيثيلي وحمام مائي دافئ",
        "محلول اليود المخفف (أسمر/برتقالي) وقطارة",
        "طبق بتري زجاجي وملاقط معملية"
      ],
      steps: [
        {
          stepNumber: 1,
          stepTitle: "حجب جزء من ورقة النبات عن الضوء",
          actionDetails: "نختار ورقة خضراء سليمة ونغطي جزءاً من منتصفها بشريط أسود معتم باستخدام مشبك ورق، ونترك النبات معرضاً للشمس لعدة ساعات.",
          teacherSpeech: "هنمسك الورقة الخضراء دي ونغطي حتة صغيرة في النص بالورق الأسود ده، علشان نحرم الحتة دي تحديداً من الشمس، ونسيب باقي الورقة تاخد شمس براحتها.",
          flowVideoPrompt: "Crisp 3D animation in a bright clean science lab: A neat laboratory bench with a healthy potted plant. Gentle hands using a black opaque paper strip and a metal clip to cover the middle portion of a broad green leaf, while sunlight streams onto the exposed leaf areas. Clean Pixar educational aesthetic. ABSOLUTELY NO teachers, close-up hands and lab bench only."
        },
        {
          stepNumber: 2,
          stepTitle: "نزع الكلوروفيل الأخضر في حمام مائي ساخن مع الكحول",
          actionDetails: "نقطف الورقة ونغمسها في ماء مغلي لدقيقة لقتل الخلايا، ثم نضعها في أنبوبة بها كحول إيثيلي داخل حمام مائي مغلي لإذابة الكلوروفيل وتبييض الورقة.",
          teacherSpeech: "دلوقتي هنقطف الورقة ونحطها في أنبوبة فيها كحول جوة مية سخنة علشان نسحب اللون الأخضر، وتبقى الورقة بيضاء ونقدر نشوف التفاعل اللوني بوضوح.",
          flowVideoPrompt: "Cinematic 3D lab animation: A transparent glass beaker with boiling bubbling water on a digital hotplate. Inside, a glass test tube containing ethyl alcohol holds the leaf; green chlorophyll slowly leaches into the alcohol turning it emerald green, leaving the leaf pale and bleached. Smooth macro lighting. ABSOLUTELY NO teachers."
        },
        {
          stepNumber: 3,
          stepTitle: "إضافة قطرات محلول اليود لاختبار وجود النشا",
          actionDetails: "نغسل الورقة في ماء بارد ونفردها في طبق بتري زجاجي، ثم نسكب فوقها قطرات من محلول اليود البني المائل للبرتقالي بالقطارة.",
          teacherSpeech: "هنحط الورقة في الطبق، وننقط عليها بمحلول اليود بالقطارة.. واليود ده كاشف ذكي جداً، لو لقى نشا وسكر بيتحول لأزرق داكن!",
          flowVideoPrompt: "Macro 3D laboratory shot: A glass pipette dropping golden-amber droplets of iodine solution onto a pale flat leaf resting in a clean Petri dish. Crisp glass reflections, realistic liquid surface tension. ABSOLUTELY NO teachers, macro tabletop focus."
        }
      ],
      observations: "الجزء المعرض للشمس تحول إلى اللون الأزرق الداكن (دليل تكوين النشا). بينما الجزء المحجوب بالورق الأسود ظل لونه برتقالياً باهتاً كما هو دون تغيير.",
      observationVideoPrompt: "Splendid 3D macro animation of the leaf in the Petri dish: The sun-exposed sections of the leaf visibly and smoothly transform into deep dark blue/violet as iodine reacts with starch, while the covered rectangular center remains pale yellowish brown, showing a sharp clear contrast. ABSOLUTELY NO teachers.",
      finalConclusion: "ضوء الشمس شرط أساسي وجوهري لقيام النبات بعملية البناء الضوئي وتكوين غذائه (النشا).",
      safetyPrecautions: "تسخين الكحول يتم فقط في حمام مائي دافئ ولا يعرض للهب المباشر أبداً لأنه سائل سريع الاشتعال."
    }
  ],
  blackboardSummary: {
    title: "درس: عملية البناء الضوئي (Photosynthesis)",
    keyVocabulary: [
      "كائنات ذاتية التغذية: تصنع غذاءها بنفسها من مواد بسيطة.",
      "الكلوروفيل: الصبغة الخضراء التي تمتص طاقة الضوء.",
      "الثغور: فتحات دقيقة في الأوراق لتبادل الغازات.",
      "أوعية الخشب: أنابيب صاعدة تنقل الماء من الجذور للأوراق."
    ],
    definitions: [
      "البناء الضوئي: عملية حيوية يصنع بها النبات سكر الجلوكوز باستخدام ضوء الشمس والماء وثاني أكسيد الكربون.",
      "معادلة التفاعل: ماء + ثاني أكسيد الكربون + ضوء الشمس = سكر الجلوكوز + غاز الأكسجين."
    ],
    comparisons: [
      "مقارنة بين الحيوان والنبات: الحيوان كائن مستهلك يبحث عن طعامه، بينما النبات كائن منتج يصنع طعامه بنفسه."
    ],
    conclusions: [
      "ضوء الشمس هو المصدر الأساسي للطاقة على كوكب الأرض.",
      "النباتات هي مصنع الغذاء ومصدر الأكسجين اللازم لحياة الإنسان والحيوان."
    ]
  },
  checkUnderstanding: [
    {
      questionType: "من الحياة اليومية",
      question: "لو زرعنا وردة حلوة في أوضة نومنا ومقفلين الشيش والستائر طول اليوم.. هل هتفضل عايشة؟ وليه؟",
      correctAnswer: "لأ، هتصفر وتذبل؛ لأن مطبخها محتاج ضوء شمس مباشر عشان يطبخ سكر الجلوكوز اللي بيديها طاقة تعيش بيها."
    },
    {
      questionType: "علل ولماذا",
      question: "علل: تعتبر الأوراق الخضراء هي أهم أجزاء النبات في صناعة الغذاء؟",
      correctAnswer: "لأنها تحتوي على مادة الكلوروفيل التي تمتص ضوء الشمس وبها الثغور لامتصاص ثاني أكسيد الكربون لحدوث البناء الضوئي."
    },
    {
      questionType: "استنتاج ذكي",
      question: "ماذا يحدث لكوكب الأرض إذا اختفت النباتات تماماً؟",
      correctAnswer: "ستنفد كميات الأكسجين ويموت الإنسان والحيوان اختناقاً وجوعاً؛ لأن النبات هو مصدر الأكسجين والغذاء الأساسي للكون."
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

function getSafeBeats(data: any): ScientificBeat[] {
  if (!data) return [];
  if (Array.isArray(data.scientificBeats) && data.scientificBeats.length > 0) {
    return data.scientificBeats;
  }
  if (Array.isArray(data.beats) && data.beats.length > 0) {
    return data.beats.map((b: any, idx: number) => ({
      beatNumber: b.beatNumber || idx + 1,
      conceptTitle: b.conceptTitle || `جزئية ${idx + 1}`,
      teacherScript: b.teacherVoiceover || b.teacherScript || "",
      simpleExplanation: b.simpleExplanation || b.analogyIdea || "",
      textbookTerm: b.textbookTerm || b.conceptTitle || "المصطلح العلمي",
      textbookDefinition: b.textbookDefinition || b.simpleExplanation || "التعريف العلمي المعتمد",
      flowVideoPrompt: b.flowVideoPrompt || ""
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
      flowVideoPrompt: s.flowVideoPrompt || s.analogyVideoMotionPrompt || ""
    }));
  }
  return [];
}

export default function TeacherLessonGuide() {
  const [guideData, setGuideData] = useState<LessonGuideData | null>(PRESET_SAMPLE_GUIDE);
  const [topicInput, setTopicInput] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<number | undefined>(undefined);
  const [endPage, setEndPage] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleGenerateGuide = async () => {
    if (!pdfFile && !topicInput.trim()) {
      alert("الرجاء رفع ملف PDF أو كتابة موضوع الدرس المراد إعداد دليله.");
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
        // Safe extraction of beats and experiments
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
        alert("🎉 تم تحليل الدرس وتجهيز الشرح الهادئ بالراحة مع المصطلحات وتجارب الفيديو!");
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
    let script = `=== سكريبت التسجيل الصوتي الكامل للمعلمة ===\nدرس: ${guideData.lessonTitle}\n\n`;

    if (guideData.introHook) {
      script += `[الدخلة التمهيدية - تشبيه البداية]:\n${guideData.introHook.teacherScript}\n\n---\n\n`;
    }

    if (beatsToRender.length > 0) {
      beatsToRender.forEach((b) => {
        script += `[المشهد ${String(b.beatNumber).padStart(2, "0")} - ${b.conceptTitle}]:\n`;
        script += `${b.teacherScript}\n`;
        script += `(المصطلح في الكتاب: ${b.textbookTerm} | تعريفه: ${b.textbookDefinition})\n\n---\n\n`;
      });
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
    let prompts = `=== برومبتات فيديو Flow لجميع مشاهد الدرس ===\nدرس: ${guideData.lessonTitle}\n\n`;

    if (guideData.introHook?.flowVideoPrompt) {
      prompts += `SCENE 00 [INTRO HOOK - ANALOGY]:\n${guideData.introHook.flowVideoPrompt}\n\n` + "=".repeat(45) + "\n\n";
    }

    if (beatsToRender.length > 0) {
      beatsToRender.forEach((b) => {
        prompts += `SCENE ${String(b.beatNumber).padStart(2, "0")} [SCIENTIFIC VISUALIZATION - ${b.textbookTerm}]:\n`;
        prompts += `${b.flowVideoPrompt}\n\n` + "=".repeat(45) + "\n\n";
      });
    }

    copyText(prompts, "all_flow_prompts");
  };

  // Copy All Experiment Flow Video Prompts
  const copyAllExperimentPrompts = () => {
    if (!experimentsToRender.length) return;
    let prompts = `=== برومبتات فيديو Flow للتجارب العلمية ===\nدرس: ${guideData?.lessonTitle || ""}\n\n`;

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
    txt += `  دليل المعلمة لشرح العلوم بالأداء الهادئ والأطفال\n`;
    txt += `  (سكريبت الشرح الصوتي + مصطلحات الكتاب + فيديوهات Flow العلمية والتجارب)\n`;
    txt += `  إعداد: Sci.Rehab Elsibai Studio\n`;
    txt += `  عنوان الدرس: ${guideData.lessonTitle}\n`;
    txt += `  المجال: ${guideData.detectedTopic || "علمي مخصص"}\n`;
    txt += `======================================================================\n\n`;

    if (guideData.introHook) {
      txt += `🎬 الدخلة والتمهيد بتشبيه واقعي:\n`;
      txt += `* عنوان الدخلة: ${guideData.introHook.hookTitle}\n`;
      txt += `* فكرة التشبيه: ${guideData.introHook.analogyStory}\n`;
      txt += `* كلام المعلمة للتسجيل الصوتي:\n${guideData.introHook.teacherScript}\n\n`;
      txt += `* برومبت فيديو Flow للتشبيه (بدون معلمة):\n${guideData.introHook.flowVideoPrompt}\n\n`;
      txt += `----------------------------------------------------------------------\n\n`;
    }

    if (beatsToRender.length > 0) {
      txt += `🔬 الشرح العلمي المفصل بالراحة للأطفال (المشاهد العلمية):\n\n`;
      beatsToRender.forEach((b) => {
        txt += `######################################################################\n`;
        txt += `مشهد ${String(b.beatNumber).padStart(2, "0")}: ${b.conceptTitle}\n`;
        txt += `🎙️ كلامكِ الصوتي في المونتاج:\n${b.teacherScript}\n\n`;
        txt += `📖 المصطلح في كتاب المدرسة: ${b.textbookTerm}\n`;
        txt += `📝 التعريف المكتوب في الكتاب: ${b.textbookDefinition}\n\n`;
        txt += `💡 الشرح العلمي المبسط: ${b.simpleExplanation}\n\n`;
        txt += `🎬 برومبت فيديو Flow العلمي (3D Scientific Animation للموضوع نفسه - بدون معلمة):\n`;
        txt += `${b.flowVideoPrompt}\n\n`;
      });
      txt += `\n======================================================================\n\n`;
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
    a.download = `دليل_الشرح_العلمي_وفيديوهات_فلو_${(guideData.lessonTitle || "درس").replace(/[/\\?%*:|"<>]/g, "_")}.txt`;
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
              <span>🔬</span>
              <span>شرح هادئ بالراحة للأطفال + تشبيه بالبداية فقط + فيديوهات علمية للموضوع + مصطلحات الكتاب وتجارب مقسمة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              دليل الشرح الهادئ للأطفال وفيديوهات Flow العلمية
            </h2>
            <p className="text-emerald-200/90 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed">
              الدخلة تشبيه واقعي فقط، وبقية الشرح بالراحة واحدة واحدة مع فيديوهات علمية مجسمة للموضوع نفسه، وبطاقة لكل مصطلح وتعريف في كتاب المدرسة، وتجارب مقسمة 1، 2، 3 بالفيديو!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGuideData(PRESET_SAMPLE_GUIDE);
                alert("تم تحميل النموذج الاسترشادي المحدث (شرح هادئ + تشبيه البداية + فيديوهات علمية + تجربة النشا)!");
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              🔄 عرض نموذج استرشادي جاهز
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
              2. أو اكتبي عنوان الدرس (سيفهمه أوتوماتيكياً):
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
              {isLoading ? "جاري التحليل والشرح الهادئ والفيديوهات..." : "🚀 فهم الدرس وصياغة الشرح العلمي والفيديوهات"}
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
                ✨ تم إعداد الشرح العلمي الهادئ ({beatsToRender.length} جزئية علمية)
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">{guideData.lessonTitle}</h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={copyAllVoiceoverScript}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                title="نسخ جميع جمل المعلمة بالترتيب للتسجيل الصوتي"
              >
                <span>🎙️</span> {copiedSection === "all_voiceover" ? "✅ تم نسخ السكريبت!" : "نسخ كامل السكريبت الصوتي"}
              </button>

              <button
                onClick={copyAllFlowPrompts}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                title="نسخ برومبتات Flow العلمية كاملة"
              >
                <span>🎬</span> {copiedSection === "all_flow_prompts" ? "✅ تم نسخ البرومبتات!" : "نسخ كل برومبتات Flow العلمية"}
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

          {/* SECTION 1: الدخلة التمهيدية بتشبيه واقعي فقط (Intro Hook) */}
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

                  <button
                    onClick={() => copyText(guideData.introHook!.flowVideoPrompt, "hook_flow")}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>🎬</span>
                    <span>{copiedSection === "hook_flow" ? "✅ تم النسخ" : "نسخ فيديو التشبيه لـ Flow"}</span>
                  </button>
                </div>
              </div>

              {/* كلام المعلمة في الدخلة */}
              <div className="bg-white/80 p-4 rounded-xl border border-amber-200">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1">
                  <span>🎙️</span> كلامكِ الصوتي في بداية الفيديو (بالعامية المصرية الهادئة لفتح شهية الأطفال):
                </span>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  "{guideData.introHook.teacherScript}"
                </p>
              </div>

              {/* فكرة التشبيه الحياتي */}
              <div className="text-xs text-amber-950">
                <span className="font-bold text-amber-900">💡 فكرة تشبيه البداية: </span>
                <span>{guideData.introHook.analogyStory}</span>
              </div>

              {/* برومبت Flow لفيديو التشبيه */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                    <span>🎬</span> برومبت فيديو Flow للتشبيه (3D Pixar B-Roll - بدون معلمة نهائياً):
                  </span>
                  <button
                    onClick={() => copyText(guideData.introHook!.flowVideoPrompt, "hook_flow_btn")}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <span>{copiedSection === "hook_flow_btn" ? "✅ تم النسخ" : "📋 نسخ لـ Flow"}</span>
                  </button>
                </div>
                <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-100 text-left font-mono text-xs text-amber-950 leading-relaxed select-all" dir="ltr">
                  {guideData.introHook.flowVideoPrompt}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: الشرح العلمي الهادئ بالراحة للأطفال + المصطلح الرسمي في الكتاب */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 bg-blue-100 text-blue-800 rounded-xl">🔬</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    الشرح العلمي المفصل بالراحة للأطفال + فيديوهات Flow للموضوع نفسه
                  </h3>
                  <p className="text-xs text-gray-500">
                    شرح هادئ من الصفر بدون تشبيهات عشوائية، مع فيديوهات علمية مجسمة ومصطلح وتعريف كتاب المدرسة نصاً!
                  </p>
                </div>
              </div>

              <span className="text-xs bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full">
                {beatsToRender.length} جزئية علمية
              </span>
            </div>

            {/* List of Scientific Beats */}
            <div className="space-y-5">
              {beatsToRender.map((beat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-blue-300 transition-all space-y-4"
                >
                  {/* Beat Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                        {beat.beatNumber}
                      </span>
                      <h4 className="font-black text-sm sm:text-base text-gray-900">
                        {beat.conceptTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyText(beat.teacherScript, `voice_${idx}`)}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs py-1 px-2.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="نسخ كلام المعلمة فقط"
                      >
                        <span>🎙️</span>
                        <span>{copiedSection === `voice_${idx}` ? "✅ تم النسخ" : "نسخ جملة الشرح"}</span>
                      </button>

                      <button
                        onClick={() => copyText(beat.flowVideoPrompt, `flow_${idx}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="نسخ برومبت Flow العلمي"
                      >
                        <span>🎬</span>
                        <span>{copiedSection === `flow_${idx}` ? "✅ تم النسخ" : "نسخ برومبت الفيديو العلمي"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. كلام المعلمة بالراحة بالعامية المصرية */}
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1.5">
                      <span>🎙️</span> كلامكِ الصوتي في المونتاج (اشرحي بالراحة بهدوء تام وبحب للأطفال):
                    </span>
                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                      "{beat.teacherScript}"
                    </p>
                  </div>

                  {/* 2. بطاقة المصطلح والتعريف في كتاب المدرسة */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3.5 rounded-xl border border-amber-300 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-5 border-l-0 md:border-l border-amber-200 md:pl-3">
                      <span className="text-[11px] font-black text-amber-800 uppercase block mb-0.5">
                        📖 المصطلح كما هو في كتاب المدرسة:
                      </span>
                      <span className="text-sm font-black text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md inline-block">
                        {beat.textbookTerm}
                      </span>
                    </div>

                    <div className="md:col-span-7">
                      <span className="text-[11px] font-bold text-amber-800 block mb-0.5">
                        📝 التعريف المكتوب في الكتاب (المطلوب حفظه وفهمه):
                      </span>
                      <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                        {beat.textbookDefinition}
                      </p>
                    </div>
                  </div>

                  {/* 3. الشرح العلمي المبسط خطوة بخطوة */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-700">
                    <span className="font-bold text-gray-900 block mb-0.5">
                      💡 الشرح العلمي المبسط للظاهرة (لماذا وكيف تحدث):
                    </span>
                    <p className="leading-relaxed">{beat.simpleExplanation}</p>
                  </div>

                  {/* 4. برومبت فيديو Flow العلمي للموضوع نفسه (3D Scientific Visualization) */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3.5 rounded-xl border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🎬</span>
                        <div>
                          <span className="text-xs font-bold text-purple-950 block">
                            برومبت فيديو Flow العلمي (3D Scientific Animation للموضوع نفسه - بدون معلمة):
                          </span>
                          <span className="text-[11px] text-purple-700 font-medium">
                            تصوير مجسم سينمائي لـ: {beat.textbookTerm}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => copyText(beat.flowVideoPrompt, `flow_btn_${idx}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <span>{copiedSection === `flow_btn_${idx}` ? "✅ تم النسخ" : "📋 نسخ لـ Flow"}</span>
                      </button>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-purple-100 text-left" dir="ltr">
                      <p className="font-mono text-xs text-purple-950 leading-relaxed select-all">
                        {beat.flowVideoPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: التجارب والأنشطة العلمية مقسمة لخطوات 1، 2، 3 بالفيديو */}
          {experimentsToRender.length > 0 && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-teal-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2 bg-teal-100 text-teal-800 rounded-2xl">🧪</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-teal-950">
                      التجارب والأنشطة العلمية مقسمة لخطوات (1، 2، 3) مع فيديو Flow لكل خطوة
                    </h3>
                    <p className="text-xs text-teal-800 font-medium">
                      تنفيذ احترافي بالمعمل: كلام المعلمة + أدوات التجربة + برومبت فيديو مخصص لكل خطوة
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
                  <div key={eIdx} className="bg-white rounded-xl p-5 border border-teal-200 shadow-2xs space-y-4">
                    <div className="border-b border-gray-100 pb-2">
                      <h4 className="font-black text-base text-teal-900">{exp.experimentTitle}</h4>
                      <p className="text-xs text-teal-700 mt-0.5 font-medium">🎯 الهدف: {exp.goal}</p>
                    </div>

                    {materials.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-gray-700 block mb-1">🧰 الأدوات المطلوبة بالمعمل:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {materials.map((m, mIdx) => (
                            <span key={mIdx} className="bg-teal-50 text-teal-900 text-xs px-2.5 py-1 rounded-md border border-teal-200 font-medium">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* الخطوات المقسمة 1، 2، 3 */}
                    {steps.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-teal-950 block">
                          🪜 خطوات التجربة بالتسلسل (مع كلام المعلمة وبرومبت فيديو Flow لكل خطوة):
                        </span>
                        
                        {steps.map((st, sIdx) => (
                          <div key={sIdx} className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-teal-700 text-white rounded-full flex items-center justify-center font-black text-xs">
                                  {st.stepNumber}
                                </span>
                                <span className="font-black text-xs sm:text-sm text-teal-950">
                                  {st.stepTitle}
                                </span>
                              </div>

                              <button
                                onClick={() => copyText(st.flowVideoPrompt, `exp_step_${eIdx}_${sIdx}`)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-2.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>🎬</span>
                                <span>{copiedSection === `exp_step_${eIdx}_${sIdx}` ? "✅ تم النسخ" : "نسخ فيديو الخطوة"}</span>
                              </button>
                            </div>

                            <div className="text-xs space-y-1">
                              <p className="text-gray-700">
                                <span className="font-bold text-teal-900">ما نفعله ولماذا: </span>
                                {st.actionDetails}
                              </p>
                              {st.teacherSpeech && (
                                <p className="text-gray-900 bg-white p-2 rounded-lg border border-gray-200">
                                  <span className="font-bold text-emerald-800">🎙️ كلام المعلمة: </span>
                                  "{st.teacherSpeech}"
                                </p>
                              )}
                            </div>

                            {/* برومبت فيديو الخطوة */}
                            <div className="bg-purple-50/80 p-2.5 rounded-lg border border-purple-200 text-left font-mono text-[11px] text-purple-950" dir="ltr">
                              <span className="font-sans font-bold text-purple-800 text-[10px] block mb-0.5" dir="rtl">
                                برومبت فيديو Flow لتنفيذ هذه الخطوة معملياً (3D Tabletop - بدون معلمة):
                              </span>
                              {st.flowVideoPrompt}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* الملاحظة والاستنتاج */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-2">
                        <span className="font-bold text-amber-900 block">👀 ماذا نلاحظ بالعين المجردة؟</span>
                        <p className="text-amber-950 font-semibold">{exp.observations}</p>
                        {exp.observationVideoPrompt && (
                          <div className="pt-1 border-t border-amber-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-purple-800">🎬 فيديو Flow للنتيجة:</span>
                              <button
                                onClick={() => copyText(exp.observationVideoPrompt!, `exp_obs_${eIdx}`)}
                                className="text-[11px] bg-purple-600 text-white px-2 py-0.5 rounded cursor-pointer"
                              >
                                {copiedSection === `exp_obs_${eIdx}` ? "✅ تم" : "نسخ"}
                              </button>
                            </div>
                            <p className="text-[10px] font-mono text-purple-950 bg-white p-1.5 rounded border border-purple-100" dir="ltr">
                              {exp.observationVideoPrompt}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-800 block mb-1">🏆 الاستنتاج العلمي النهائي:</span>
                        <p className="text-emerald-950 font-bold leading-relaxed">{exp.finalConclusion}</p>
                      </div>
                    </div>

                    {exp.safetyPrecautions && (
                      <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-900 font-semibold flex items-center gap-2">
                        <span>⚠️</span>
                        <span>احتياطات الأمان بالمعمل: {exp.safetyPrecautions}</span>
                      </div>
                    )}
                  </div>
                );
              })}
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
    </div>
  );
}
