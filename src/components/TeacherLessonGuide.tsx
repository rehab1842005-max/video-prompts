"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { CanvasItem } from "./SceneAssemblerCanvas";

export interface DeconstructedComponent {
  name: string;
  role: string;
  suggestedOrder: number;
  suggestedPosition: string;
}

export interface LessonGuideData {
  lessonTitle: string;
  detectedTopic?: string;
  opening: {
    hookQuestion: string;
    teacherOpeningDialogue: string;
  };
  sections: Array<{
    partNumber: number;
    title: string;
    teacherSpeech: string;
    realLifeAnalogy: string;
    conceptExplanation: string;
    analogyImagePrompt?: string;
    analogyVideoMotionPrompt?: string;
    deconstructedComponents?: DeconstructedComponent[];
    studentQuestion: string;
    expectedAnswer: string;
    transition: string;
  }>;
  experiments?: Array<{
    experimentTitle: string;
    goal: string;
    materials: string[];
    stepsWithLogic: Array<{
      step: string;
      whyWeDoIt: string;
      teacherSpeech: string;
      dailyAnalogy?: string;
    }>;
    observations: string;
    resultMeaning: string;
    finalConclusion: string;
    safetyPrecautions?: string;
  }>;
  illustrations?: Array<{
    figureName: string;
    whatStudentsSee: string;
    functionAndExplanation: string;
  }>;
  blackboardSummary: {
    title: string;
    keyVocabulary: string[];
    definitions: string[];
    comparisons: string[];
    conclusions: string[];
  };
  checkUnderstanding: Array<{
    questionType: string;
    question: string;
    correctAnswer: string;
  }>;
}

export const PRESET_SAMPLE_GUIDE: LessonGuideData = {
  lessonTitle: "كيف تصنع النباتات غذاءها؟ (عملية البناء الضوئي)",
  detectedTopic: "البناء الضوئي وحاجة النبات للضوء والماء والهواء",
  opening: {
    hookQuestion: "يا أبطالي.. لو إنت جعت الصبح، ماما بتعمل إيه؟ بتدخل المطبخ تطبخ لنا أكل جميل صح؟ طب يا ترى النبتة اللي واقفة في البلكونة لما بتجوع.. بتروح تشتري ساندوتش؟ ولا بتعمل إيه؟",
    teacherOpeningDialogue: "صباح الفل يا دكاترة المستقبل! كلنا لما بنجوع بنفتح التلاجة وناكل، لكن النبتة دي كائن حي زينا بالظبط، لا عندها رجلين تروح السوبر ماركت، ولا إيدين تطبخ! طب تفتكروا بتعيش إزاي؟ السر يا شطار إن النبتة عندها شيف عبقري ومطبخ سحري جواها بيطبخ لها أحلى أكل في الدنيا.. النهاردة هنلبس طاقية الشيف وندخل سوا مطبخ النبتة ونعرف بتطبخ أكلها إزاي!"
  },
  sections: [
    {
      partNumber: 1,
      title: "أين يقع مطبخ النبتة؟ (الأوراق الخضراء ومادة الكلوروفيل)",
      teacherSpeech: "بصوا معايا كده على النبتة.. النبتة عندها جذور تحت الأرض، وساق واقفة، وأوراق خضراء عريضة. مطبخ النبتة يا حلوين موجود تحديداً في 'الورقة الخضراء'! الورقة دي عاملة زي صينية الطبخ الشمسية، مفرودة في الهوا وبتستقبل النور.",
      realLifeAnalogy: "الورقة الخضراء عاملة زي الخلايا الشمسية أو صينية الطبخ المفتوحة للشمس، وزي شباك المطبخ اللي بنفتحه عشان يدخل النور والهوا للطباخ.",
      conceptExplanation: "الورقة لونها أخضر عشان جواها مادة سحرية اسمها 'الكلوروفيل' داخل البلاستيدات الخضراء، هي اللي بتمتص أشعة الشمس وتبدأ طبخ الأكل.",
      analogyImagePrompt: "A charming 3D Pixar style wide scene of an adorable glowing green plant leaf rendered as a miniature sunny gourmet kitchen. Tiny friendly animated chloroplast chefs in white chef hats are happily gathering golden sunbeams on a polished glass table. In the background wall, a glowing 3D neon holographic sign clearly displays 'Sci.Rehab Elsibai'. Vibrant emerald greens, soft volumetric lighting, 8k resolution, delightful Disney animation feel.",
      analogyVideoMotionPrompt: "Cinematic close-up push-in on the 3D plant leaf kitchen. Warm golden sun rays stream down, energizing the tiny cute chloroplast characters who cheer with excitement. The glowing neon sign 'Sci.Rehab Elsibai' remains static in the upper background. NEGATIVE EXCLUSION: NO floating text or watermarks. Pure visual dynamic motion. DIALOGUE: Teacher explains enthusiastically: 'شايفين الورقة الخضراء يا أبطال؟ دي مش مجرد ورقة، ده المطبخ الشمسي السحري للنبتة!' AUDIO: Warm joyful Egyptian Arabic teacher voice with gentle magical sparkling sound effects.",
      deconstructedComponents: [
        { name: "شمس الصباح الذهبية", role: "مصدر الطاقة والحرارة الأساسي", suggestedOrder: 1, suggestedPosition: "top-right" },
        { name: "الورقة الخضراء (المطبخ)", role: "المصنع الممتص للضوء ومكان التفاعل", suggestedOrder: 2, suggestedPosition: "center" },
        { name: "حبيبات الكلوروفيل الخضراء", role: "الشيف الصغير الممتص للطاقة", suggestedOrder: 3, suggestedPosition: "bottom-center" }
      ],
      studentQuestion: "تفتكروا ليه الورقة مفرودة وعريضة مش ملفوفة؟",
      expectedAnswer: "عشان تجمع أكبر قدر من أشعة الشمس وماتضيعش أي بصيص نور!",
      transition: "عرفنا مكان المطبخ.. طب عشان نطبخ مش محتاجين مقادير ومكونات؟ تعالوا نشوف الشيف نبات بيحتاج إيه عشان يطبخ أكلته!"
    },
    {
      partNumber: 2,
      title: "مقادير طبخة النبات الثلاثة (الماء، الهواء، وضوء الشمس)",
      teacherSpeech: "الشيف نبات عشان يعمل وجبته اللذيذة محتاج 3 مقادير أساسية: أول حاجة 'المية والأملاح' من تحت الأرض، الجذور بتشفطهم زي الشفاطة، وتطلعهم في أنابيب اسمها 'أوعية الخشب' لحد الورقة! تاني حاجة 'الهواء'، الورقة عندها مسام صغيرة زي فتحات أنفنا اسمها 'الثغور' بتتنفس وتاخد غاز اسمه (ثاني أكسيد الكربون). تالت حاجة 'ضوء الشمس' اللي بيشغل البوتجاز والحرارة للتفاعل!",
      realLifeAnalogy: "زي لما نعمل كيكة: محتاجين مية ودقيق وسكر وبوتجاز يسويها.. النبتة بتاخد مية من تحت، وهوا من الجنب، ونور الشمس يسوي الطبخة!",
      conceptExplanation: "الماء (H2O) + ثاني أكسيد الكربون (CO2) في وجود طاقة ضوء الشمس = سكر الجلوكوز (طاقة النبات) + غاز الأكسجين (للتنفس).",
      analogyImagePrompt: "A whimsical 3D Pixar educational scene illustrating the three ingredients of plant cooking: A transparent plant root drinking glowing blue water droplets through miniature straws, tiny purple puff balls of CO2 floating into open mouth-like stomata on a leaf, and radiant beams of golden sunshine pouring down like warm melted butter. A prominent glowing neon sign on the back wall spells 'Sci.Rehab Elsibai'. Colorful, joyful, educational render.",
      analogyVideoMotionPrompt: "Dynamic multi-part motion: Luminous blue water droplets travel smoothly upwards through translucent plant stems while soft purple atmospheric gas enters stomata pores. Sunbeams pulse warmly on the leaf surface. (Static neon sign 'Sci.Rehab Elsibai' in background). NEGATIVE EXCLUSION: Pure visual motion. DIALOGUE: Teacher speaks: 'المقادير بتدخل الورقة من كل حتة: مية من تحت وهوا من الجنب وشمس من فوق!' AUDIO: Lively clear Egyptian voice with bubbling fluid and gentle wind sound effects.",
      deconstructedComponents: [
        { name: "الجذور وأنابيب الماء الزرقاء", role: "شفط الماء والأملاح من التربة", suggestedOrder: 1, suggestedPosition: "bottom-left" },
        { name: "فتحات الثغور وغاز CO2", role: "امتصاص ثاني أكسيد الكربون من الهواء", suggestedOrder: 2, suggestedPosition: "center-left" },
        { name: "أشعة الشمس الساطعة", role: "إشعال التفاعل الكيميائي بالطاقة", suggestedOrder: 3, suggestedPosition: "top-center" }
      ],
      studentQuestion: "لو قفلنا النبتة في كرتونة مقفولة في الضلمة وماسقيناهاش، إيه اللي هيحصل وليه؟",
      expectedAnswer: "هتدبل وتموت، لأن المطبخ بتاعها مفيش فيه مقادير ولا نور يطبخ بيه أكلها!",
      transition: "طب بعد ما الطبخة استوت والعملية خلصت.. يا ترى إيه الهدية اللي النبتة بتطلعها لنا وللكون كله؟"
    },
    {
      partNumber: 3,
      title: "نواتج الطبخة السحرية (الأكسجين وسكر الجلوكوز)",
      teacherSpeech: "بعد ما الشمس تطبخ المقادير جوا الورقة، بيطلع حاجتين في قمة الجمال: أول حاجة 'سكر الجلوكوز' وده أكل النبتة وغذائها اللي بيديها طاقة عشان تكبر وتبقى شجرة عملاقة! وتاني حاجة 'غاز الأكسجين'، وده بتخرجه في الهوا هدية لينا وللحيوانات عشان نتنفس ونعيش!",
      realLifeAnalogy: "زي صينية البسبوسة لما تطلع من الفرن، بتدينا طاقة وحلاوة (زي سكر النبات)، وريحتها الجميلة بتملى البيت كله فرحة (زي الأكسجين الصافي اللي بيملى الجو).",
      conceptExplanation: "البناء الضوئي هو سر الحياة على كوكب الأرض: النبات هو الكائن الوحيد 'ذاتي التغذية' اللي بيصنع غذاءه بنفسه ويوفر الأكسجين لجميع الكائنات.",
      analogyImagePrompt: "A magical 3D Pixar celebratory scene: An adorable smiling stylized tree gently releasing thousands of glittering iridescent oxygen bubbles into the air that float towards cute cartoon forest animals, while glowing golden sugar crystals circulate inside its bark like pure liquid energy. Glowing neon sign 'Sci.Rehab Elsibai' on background stone. Colorful, warm, heartwarming Pixar visual.",
      analogyVideoMotionPrompt: "Continuous fluid motion: Shimmering oxygen bubbles detach from green leaves and float upwards gracefully into a sunny blue sky. Concurrently, warm glowing glucose sugar flows down the stem like golden honey. Neon sign 'Sci.Rehab Elsibai' remains glowing and static. DIALOGUE: Teacher says: 'شايفين الهدايا؟ سكر جلوكوز للنبتة عشان تكبر، وأكسجين نقي نتنفسه ونعيش!' AUDIO: Warm inspiring voice with soft bell chimes and refreshing outdoor breeze.",
      deconstructedComponents: [
        { name: "حبيبات سكر الجلوكوز الذهبية", role: "غذاء النبتة والطاقة للنمو", suggestedOrder: 1, suggestedPosition: "bottom-center" },
        { name: "فقاعات الأكسجين الشفافة المتطايرة", role: "الغاز الصافي لتنفس الكائنات", suggestedOrder: 2, suggestedPosition: "top-left" },
        { name: "الشجرة السعيدة المكتملة", role: "الكائن الحي المنتج وذاتي التغذية", suggestedOrder: 3, suggestedPosition: "center-right" }
      ],
      studentQuestion: "ليه بنحب نقعد تحت الشجر في الحدائق الصبح؟",
      expectedAnswer: "عشان الشجر بيعمل بناء ضوئي بالنهار وبيخرج لنا أكسجين نقي يخلينا نتنفس بانتعاش!",
      transition: "يلا بقى نثبت المعلومات دي على السبورة زي المحترفين عشان نراجعها في ثانية!"
    }
  ],
  experiments: [
    {
      experimentTitle: "تجربة إثبات حاجة النبات للضوء",
      goal: "إثبات أن النبات لا يستطيع صنع غذائه بدون ضوء الشمس المباشر.",
      materials: ["أصيصان لنباتين متشابهين ومرويين بالماء", "غطاء كرتوني داكن أو كيس أسود معتم", "ماء للري"],
      stepsWithLogic: [
        {
          step: "نضع النبتة (أ) في مكان مشمس، ونغطي النبتة (ب) بالكرتونة المظلمة تماماً.",
          whyWeDoIt: "لمقارنة النبتة التي يصلها ضوء الشمس بنبتة محرومة تماماً من الضوء (عامل المقارنة).",
          teacherSpeech: "هنحط نبتة في شمس الصباح الحلوة، والتانية هنخبيها في الضلمة، ونسقيهم هما الاتنين مية بنفس المقدار.. تفتكروا مين اللي هتكبر ومين اللي هتدبل؟"
        },
        {
          step: "ننتظر لمدة 5 أيام مع استمرار الري المعتدل للنبتتين.",
          whyWeDoIt: "لإعطاء فرصة للنبتة لاستهلاك مخزونها الغذائي وملاحظة تأثير غياب البناء الضوئي.",
          teacherSpeech: "كل يوم هنبص بصه سريعة ونسجل التغيرات."
        }
      ],
      observations: "النبتة (أ) المعرضة للشمس أوراقها خضراء زاهية وتنمو بقوة. بينما النبتة (ب) المظلمة اصفرت أوراقها وذبلت وبدأت تسقط.",
      resultMeaning: "النبتة بدون ضوء لم تستطع تشغيل مطبخها (البناء الضوئي) فجاعت حتى ذبلت.",
      finalConclusion: "ضوء الشمس شرط أساسي وجوهري لقيام النبات بعملية البناء الضوئي وتكوين غذائه.",
      safetyPrecautions: "وضع الأصص في مكان آمن في فناء المدرسة بعيداً عن حواف النوافذ العالية."
    }
  ],
  illustrations: [
    {
      figureName: "مخطط الورقة الخضراء وثقوب الثغور",
      whatStudentsSee: "صورة مكبرة لسطح ورقة النبات تحت المجهر تبين فتحات صغيرة تشبه الشفاه الصغيرة محاطة بخلايا خضراء.",
      functionAndExplanation: "الفتحات دي هي 'الثغور' (Stomata): بوابات سحرية بتفتح لدخول ثاني أكسيد الكربون وخروج الأكسجين وبخار الماء الزائد."
    }
  ],
  blackboardSummary: {
    title: "درس: عملية البناء الضوئي (Photosynthesis)",
    keyVocabulary: [
      "البناء الضوئي: العملية التي يصنع بها النبات غذاءه بنفسه في وجود الضوء.",
      "الكلوروفيل: المادة الخضراء داخل الورقة التي تمتص أشعة الشمس.",
      "الثغور: فتحات دقيقة في أوراق النبات لتبادل الغازات."
    ],
    definitions: [
      "معادلة البناء الضوئي: ماء (من الجذور) + ثاني أكسيد الكربون (من الهواء) + ضوء الشمس = سكر الجلوكوز (غذاء وطاقة) + غاز الأكسجين (تنفس)."
    ],
    comparisons: [
      "مقارنة بين الحيوان والنبات: الحيوان مستهلك يبحث عن طعامه، بينما النبات منتج وذاتي التغذية يصنع طعامه بنفسه."
    ],
    conclusions: [
      "النبات هو مصنع الغذاء ورئة كوكب الأرض التي تزودنا بالأكسجين."
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

interface TeacherLessonGuideProps {
  onOpenSceneAssembler?: (items?: CanvasItem[]) => void;
}

export default function TeacherLessonGuide({ onOpenSceneAssembler }: TeacherLessonGuideProps) {
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
        throw new Error(err.error || "فشل توليد دليل المعلمة");
      }

      const data = await res.json();
      if (data.guide) {
        setGuideData(data.guide);
        alert("🎉 تم إعداد دليل المعلمة وبرومبتات التشبيه والسبورة بنجاح!");
      }
    } catch (e: any) {
      console.error(e);
      alert("خطأ: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert deconstructed components of a section to CanvasItem format for SceneAssembler
  const sendSectionToAssembler = (sec: LessonGuideData["sections"][0]) => {
    if (!onOpenSceneAssembler) return;

    if (sec.deconstructedComponents && sec.deconstructedComponents.length > 0) {
      const posMap: Record<string, { x: number; y: number }> = {
        "top-left": { x: 8, y: 12 },
        "top-center": { x: 40, y: 10 },
        "top-right": { x: 72, y: 12 },
        "center-left": { x: 10, y: 40 },
        "center": { x: 38, y: 35 },
        "center-right": { x: 68, y: 40 },
        "bottom-left": { x: 12, y: 65 },
        "bottom-center": { x: 40, y: 65 },
        "bottom-right": { x: 70, y: 65 },
      };

      const canvasItems: CanvasItem[] = sec.deconstructedComponents.map((comp, idx) => {
        const coords = posMap[comp.suggestedPosition] || { x: 20 + idx * 20, y: 30 + (idx % 2) * 25 };
        return {
          id: `comp_${sec.partNumber}_${idx}_${Date.now()}`,
          title: `${comp.suggestedOrder}. ${comp.name}`,
          subtitle: comp.role,
          type: "concept",
          x: coords.x,
          y: coords.y,
          order: comp.suggestedOrder,
        };
      });

      onOpenSceneAssembler(canvasItems);
    } else {
      onOpenSceneAssembler();
    }
  };

  const downloadFullGuideTxt = () => {
    if (!guideData) return;
    let txt = `======================================================================\n`;
    txt += `  دليل المعلمة لشرح العلوم بطريقة مبسطة وواقعية للأطفال بالفصل\n`;
    txt += `  مرفق برومبتات الصور والفيديوهات للتشبيهات وعناصر تجميع المشاهد\n`;
    txt += `  إعداد: Sci.Rehab Elsibai Studio\n`;
    txt += `  عنوان الدرس: ${guideData.lessonTitle}\n`;
    txt += `======================================================================\n\n`;

    txt += `🎯 أولاً: بداية الدرس والسؤال الواقعي المشوق:\n`;
    txt += `* السؤال لجذب الانتباه: ${guideData.opening.hookQuestion}\n\n`;
    txt += `* كلام المعلمة بالحرف بالعامية المصرية:\n${guideData.opening.teacherOpeningDialogue}\n\n`;
    txt += `----------------------------------------------------------------------\n\n`;

    txt += `📖 ثانياً: شرح أجزاء الدرس بالتفصيل وبرومبتات التشبيه البصري:\n\n`;
    guideData.sections.forEach((s) => {
      txt += `[جزء ${s.partNumber}: ${s.title}]\n`;
      txt += `🗣️ كلام المعلمة: ${s.teacherSpeech}\n\n`;
      txt += `💡 التشبيه من الحياة اليومية: ${s.realLifeAnalogy}\n\n`;
      txt += `🔬 الشرح والسبب العلمي: ${s.conceptExplanation}\n\n`;
      if (s.analogyImagePrompt) {
        txt += `🖼️ برومبت صورة التشبيه لمولدات الصور (Image Prompt):\n${s.analogyImagePrompt}\n\n`;
      }
      if (s.analogyVideoMotionPrompt) {
        txt += `🎬 برومبت تحريك فيديو التشبيه لموقع Flow/Kling (Video Prompt):\n${s.analogyVideoMotionPrompt}\n\n`;
      }
      if (s.deconstructedComponents && s.deconstructedComponents.length > 0) {
        txt += `🧩 العناصر المفككة للمشهد (للباوربوينت التفاعلي):\n`;
        s.deconstructedComponents.forEach((c) => {
          txt += `   - كليك ${c.suggestedOrder}: ${c.name} (${c.role})\n`;
        });
        txt += `\n`;
      }
      txt += `❓ سؤال للطلاب: ${s.studentQuestion}\n`;
      txt += `✅ الإجابة المتوقعة: ${s.expectedAnswer}\n`;
      txt += `🔗 طريقة الانتقال: ${s.transition}\n`;
      txt += `\n----------------------------------------------------------------------\n\n`;
    });

    if (guideData.experiments && guideData.experiments.length > 0) {
      txt += `🧪 ثالثاً: شرح التجارب العلمية بالتفصيل:\n\n`;
      guideData.experiments.forEach((exp, idx) => {
        txt += `[تجربة ${idx + 1}: ${exp.experimentTitle}]\n`;
        txt += `* الهدف: ${exp.goal}\n`;
        txt += `* الأدوات: ${exp.materials.join(" - ")}\n\n`;
        exp.stepsWithLogic.forEach((st, sIdx) => {
          txt += `  الخطوة ${sIdx + 1}: ${st.step}\n`;
          txt += `  لماذا نفعلها: ${st.whyWeDoIt}\n`;
          txt += `  كلام المعلمة: ${st.teacherSpeech}\n`;
          if (st.dailyAnalogy) txt += `  تشبيه مقرب: ${st.dailyAnalogy}\n`;
          txt += `\n`;
        });
        txt += `* الملاحظة بالعين: ${exp.observations}\n`;
        txt += `* ماذا تعني النتيجة: ${exp.resultMeaning}\n`;
        txt += `* الاستنتاج النهائي: ${exp.finalConclusion}\n`;
        if (exp.safetyPrecautions) txt += `* احتياطات الأمان: ${exp.safetyPrecautions}\n`;
        txt += `\n----------------------------------------------------------------------\n\n`;
      });
    }

    txt += `📋 رابعاً: ما يُكتب على السبورة فقط:\n`;
    txt += `* العنوان: ${guideData.blackboardSummary.title}\n`;
    txt += `* الكلمات والمصطلحات الأساسية:\n`;
    guideData.blackboardSummary.keyVocabulary.forEach((v) => (txt += `  - ${v}\n`));
    txt += `* التعريفات الأساسية:\n`;
    guideData.blackboardSummary.definitions.forEach((d) => (txt += `  - ${d}\n`));
    txt += `* المقارنات:\n`;
    guideData.blackboardSummary.comparisons.forEach((c) => (txt += `  - ${c}\n`));
    txt += `* الاستنتاجات:\n`;
    guideData.blackboardSummary.conclusions.forEach((cn) => (txt += `  - ${cn}\n`));
    txt += `\n----------------------------------------------------------------------\n\n`;

    txt += `❓ خامساً: أسئلة التأكد من الفهم وإجاباتها:\n\n`;
    guideData.checkUnderstanding.forEach((q, idx) => {
      txt += `سؤال ${idx + 1} (${q.questionType}): ${q.question}\n`;
      txt += `الإجابة النموذجية: ${q.correctAnswer}\n\n`;
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `دليل_شرح_وبرومبتات_${guideData.lessonTitle.replace(/[/\\?%*:|"<>]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyBlackboardOnly = () => {
    if (!guideData) return;
    let b = `=== ما يُكتب على السبورة فقط ===\n`;
    b += `${guideData.blackboardSummary.title}\n\n`;
    b += `الكلمات الأساسية:\n` + guideData.blackboardSummary.keyVocabulary.map((k) => `• ${k}`).join("\n") + "\n\n";
    b += `التعريفات:\n` + guideData.blackboardSummary.definitions.map((d) => `• ${d}`).join("\n") + "\n\n";
    b += `المقارنات:\n` + guideData.blackboardSummary.comparisons.map((c) => `• ${c}`).join("\n") + "\n\n";
    b += `الاستنتاج:\n` + guideData.blackboardSummary.conclusions.map((c) => `• ${c}`).join("\n");
    copyText(b, "blackboard_only");
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* 1. Header Banner & Uploader */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/30 mb-2">
              <span>✨</span>
              <span>نظام برومبت شرح العلوم الواقعي للأطفال + برومبتات صور وفيديوهات التشبيه</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              دليل المعلمة وبرومبتات التشبيه والسبورة
            </h2>
            <p className="text-emerald-200/90 text-sm sm:text-base mt-1 max-w-2xl">
              شرح بالعامية المصرية وتشبيهات واقعية، مع برومبتات لتوليد صور وفيديوهات كل تشبيه، وتفكيك عناصر الدرس لعرضها كباوربوينت تفاعلي بالكليك!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGuideData(PRESET_SAMPLE_GUIDE);
                alert("تم تحميل النموذج الاسترشادي الجاهز (البناء الضوئي ومطبخ النبتة)!");
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
              2. أو اكتبي عنوان الدرس (اختياري لو تم رفع PDF):
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="مثال: كيف يصنع النبات غذاءه؟ أو الجهاز الهضمي"
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
              {isLoading ? "جاري إعداد الدليل والبرومبتات..." : "🚀 ابتكار دليل الشرح وبرومبتات التشبيه"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Guide Results Container */}
      {guideData && (
        <div className="space-y-8">
          
          {/* Top Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-gray-500">الدرس الحالي:</span>
              <h3 className="text-lg font-black text-emerald-900">{guideData.lessonTitle}</h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={downloadFullGuideTxt}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>📥</span> حفظ وتنزيل الدليل والبرومبتات (.txt)
              </button>

              <button
                onClick={copyBlackboardOnly}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>📋</span> {copiedSection === "blackboard_only" ? "✅ تم نسخ السبورة!" : "نسخ ما يُكتب على السبورة فقط"}
              </button>

              {onOpenSceneAssembler && (
                <button
                  onClick={() => onOpenSceneAssembler()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs py-2 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🎬</span> فتح لوحة تجميع المشاهد (الباوربوينت)
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>🖨️</span> طباعة الدليل
              </button>
            </div>
          </div>

          {/* Section 1: بداية الدرس والسؤال الواقعي */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-amber-100 text-amber-800 rounded-xl">🎯</span>
                <div>
                  <h3 className="text-base font-black text-amber-950">
                    أولاً: بداية الدرس وسؤال جذب الانتباه من حياة الطلاب
                  </h3>
                  <p className="text-xs text-amber-800 font-medium">سؤال واقعي يقود لفكرة الدرس بدون مصطلحات صعبة</p>
                </div>
              </div>

              <button
                onClick={() => copyText(`${guideData.opening.hookQuestion}\n\n${guideData.opening.teacherOpeningDialogue}`, "opening")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{copiedSection === "opening" ? "✅ تم النسخ" : "📋 نسخ البداية"}</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-amber-700 block mb-1">❓ سؤال جذب الانتباه للطلاب:</span>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  "{guideData.opening.hookQuestion}"
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-amber-700 block mb-1">🗣️ كلام المعلمة بالحرف بالعامية المصرية (أول دقيقة):</span>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  "{guideData.opening.teacherOpeningDialogue}"
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: شرح أجزاء الدرس بالتفصيل والتشبيهات والبرومبتات */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-2 bg-blue-100 text-blue-800 rounded-xl">📖</span>
                <h3 className="text-lg font-black text-gray-900">
                  ثانياً: شرح أجزاء الدرس بالتفصيل + برومبتات صور وفيديوهات التشبيه
                </h3>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                {guideData.sections.length} أجزاء تفصيلية
              </span>
            </div>

            <div className="space-y-6">
              {guideData.sections.map((sec, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-all space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {sec.partNumber}
                      </span>
                      <h4 className="font-black text-base text-gray-900">{sec.title}</h4>
                    </div>

                    <button
                      onClick={() => copyText(`[${sec.title}]\nكلام المعلمة: ${sec.teacherSpeech}\nالتشبيه: ${sec.realLifeAnalogy}\nالشرح: ${sec.conceptExplanation}`, `sec_${idx}`)}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs py-1.5 px-3 rounded-lg transition-colors border border-blue-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{copiedSection === `sec_${idx}` ? "✅ تم النسخ" : "📋 نسخ نص الشرح"}</span>
                    </button>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    {/* كلام المعلمة */}
                    <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                        <span>🗣️</span> كلام المعلمة للطلاب بالحرف (باللهجة المصرية):
                      </span>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {sec.teacherSpeech}
                      </p>
                    </div>

                    {/* التشبيه الواقعي */}
                    <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1 mb-1">
                        <span>💡</span> التشبيه من الحياة اليومية (أكل/مطبخ/لعب):
                      </span>
                      <p className="text-amber-950 font-medium leading-relaxed">
                        {sec.realLifeAnalogy}
                      </p>
                    </div>

                    {/* التفسير العلمي */}
                    <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
                      <span className="text-xs font-bold text-purple-800 flex items-center gap-1 mb-1">
                        <span>🔬</span> كيف ولماذا تحدث الظاهرة علمياً؟
                      </span>
                      <p className="text-purple-950 leading-relaxed">
                        {sec.conceptExplanation}
                      </p>
                    </div>

                    {/* NEW: التجسيد البصري للتشبيه (برومبت الصورة وبرومبت الفيديو) */}
                    <div className="bg-gradient-to-r from-indigo-50/90 to-blue-50/90 p-4 rounded-xl border border-indigo-200 space-y-3" dir="ltr">
                      <div className="flex items-center justify-between" dir="rtl">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎨</span>
                          <h5 className="font-bold text-indigo-950 text-xs sm:text-sm">
                            التجسيد البصري للتشبيه (برومبت الصورة وبرومبت الفيديو):
                          </h5>
                        </div>
                        <span className="text-[11px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                          Sci.Rehab Elsibai Branding
                        </span>
                      </div>

                      {sec.analogyImagePrompt && (
                        <div className="bg-white p-3 rounded-lg border border-indigo-100 text-left">
                          <div className="flex items-center justify-between mb-1" dir="rtl">
                            <span className="text-xs font-bold text-indigo-900">
                              🖼️ برومبت صورة التشبيه لمولدات الصور (Midjourney / Bing / Recraft):
                            </span>
                            <button
                              onClick={() => copyText(sec.analogyImagePrompt || "", `img_prompt_${idx}`)}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 cursor-pointer"
                            >
                              {copiedSection === `img_prompt_${idx}` ? "✅ تم النسخ" : "📋 نسخ برومبت الصورة"}
                            </button>
                          </div>
                          <p className="font-mono text-xs text-gray-800 leading-relaxed select-all">
                            {sec.analogyImagePrompt}
                          </p>
                        </div>
                      )}

                      {sec.analogyVideoMotionPrompt && (
                        <div className="bg-white p-3 rounded-lg border border-indigo-100 text-left">
                          <div className="flex items-center justify-between mb-1" dir="rtl">
                            <span className="text-xs font-bold text-indigo-900">
                              🎬 برومبت تحريك فيديو التشبيه لموقع (Flow / Kling / Runway):
                            </span>
                            <button
                              onClick={() => copyText(sec.analogyVideoMotionPrompt || "", `vid_prompt_${idx}`)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
                            >
                              {copiedSection === `vid_prompt_${idx}` ? "✅ تم النسخ" : "📋 نسخ برومبت الفيديو (Flow)"}
                            </button>
                          </div>
                          <p className="font-mono text-xs text-gray-800 leading-relaxed select-all">
                            {sec.analogyVideoMotionPrompt}
                          </p>
                        </div>
                      )}

                      {/* NEW: العناصر المفككة للمشهد مع إمكانية إرسالها للكانفاس */}
                      {sec.deconstructedComponents && sec.deconstructedComponents.length > 0 && (
                        <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 pt-2" dir="rtl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                              <span>🧩</span> عناصر المشهد المفككة (جاهزة للباوربوينت التفاعلي بالكليك):
                            </span>

                            {onOpenSceneAssembler && (
                              <button
                                onClick={() => sendSectionToAssembler(sec)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-3 rounded-md transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                <span>🚀</span> نقل العناصر إلى (لوحة تجميع المشاهد)
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {sec.deconstructedComponents.map((c, cIdx) => (
                              <div key={cIdx} className="bg-purple-50/70 p-2 rounded-md border border-purple-200 text-xs flex items-center gap-2">
                                <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                                  {c.suggestedOrder}
                                </span>
                                <div>
                                  <h6 className="font-bold text-purple-950">{c.name}</h6>
                                  <p className="text-[10px] text-purple-700">{c.role}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* سؤال وتوقع تفاعل وانتقال */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <span className="text-xs font-bold text-gray-700 block mb-0.5">❓ سؤال تطرحه المعلمة:</span>
                        <p className="text-xs font-semibold text-gray-800">{sec.studentQuestion}</p>
                        <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                          الإجابة المتوقعة: {sec.expectedAnswer}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <span className="text-xs font-bold text-gray-700 block mb-0.5">🔗 طريقة الانتقال للجزء التالي:</span>
                        <p className="text-xs text-gray-700 leading-relaxed">{sec.transition}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: التجارب والأنشطة العلمية (إن وجدت) */}
          {guideData.experiments && guideData.experiments.length > 0 && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-teal-100 text-teal-800 rounded-xl">🧪</span>
                <div>
                  <h3 className="text-base font-black text-teal-950">
                    ثالثاً: شرح التجارب العلمية خطوة بخطوة بالمنطق واحتياطات الأمان
                  </h3>
                  <p className="text-xs text-teal-800 font-medium">لماذا نفعل كل خطوة؟ وماذا نلاحظ؟ والاستنتاج النهائي</p>
                </div>
              </div>

              {guideData.experiments.map((exp, eIdx) => (
                <div key={eIdx} className="bg-white rounded-xl p-5 border border-teal-200 shadow-2xs space-y-3.5">
                  <div className="border-b border-gray-100 pb-2">
                    <h4 className="font-black text-base text-teal-900">{exp.experimentTitle}</h4>
                    <p className="text-xs text-teal-700 mt-0.5 font-medium">🎯 الهدف: {exp.goal}</p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-700 block mb-1">🧰 الأدوات المطلوبة:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.materials.map((m, mIdx) => (
                        <span key={mIdx} className="bg-teal-50 text-teal-900 text-xs px-2.5 py-1 rounded-md border border-teal-200 font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-gray-700 block">🪜 خطوات التجربة مع المنطق وراء كل خطوة:</span>
                    {exp.stepsWithLogic.map((st, sIdx) => (
                      <div key={sIdx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-teal-900">
                          <span>{sIdx + 1}.</span>
                          <span>{st.step}</span>
                        </div>
                        <p className="text-gray-700"><span className="font-semibold text-emerald-800">لماذا نفعلها:</span> {st.whyWeDoIt}</p>
                        <p className="text-gray-800"><span className="font-semibold text-blue-800">كلام المعلمة:</span> "{st.teacherSpeech}"</p>
                        {st.dailyAnalogy && (
                          <p className="text-amber-900"><span className="font-semibold text-amber-700">تشبيه مقرب:</span> {st.dailyAnalogy}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <span className="font-bold text-amber-800 block mb-0.5">👀 ماذا نلاحظ بالعين؟</span>
                      <p className="text-amber-950 font-medium">{exp.observations}</p>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-800 block mb-0.5">🏆 الاستنتاج العلمي النهائي:</span>
                      <p className="text-emerald-950 font-bold">{exp.finalConclusion}</p>
                    </div>
                  </div>

                  {exp.safetyPrecautions && (
                    <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-xs text-red-900 font-medium flex items-center gap-2">
                      <span>⚠️</span>
                      <span>احتياطات الأمان في المعمل: {exp.safetyPrecautions}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Section 4: السبورة الذكية (ما يُكتب على السبورة فقط) */}
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
                  {guideData.blackboardSummary.title}
                </h4>
              </div>

              {/* الكلمات والتعريفات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-amber-200 border-b border-amber-500/40 pb-1">
                    📌 المصطلحات والكلمات الأساسية:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-100">
                    {guideData.blackboardSummary.keyVocabulary.map((v, vIdx) => (
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
                    {guideData.blackboardSummary.definitions.map((d, dIdx) => (
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
                    {guideData.blackboardSummary.comparisons.map((c, cIdx) => (
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
                    {guideData.blackboardSummary.conclusions.map((cn, cnIdx) => (
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

          {/* Section 5: التأكد من فهم الطلاب (Oral Questions) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-purple-100 text-purple-800 rounded-xl">❓</span>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    خامساً: أسئلة التأكد من الفهم الشفوية مع الإجابات النموذجية للمعلمة
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">أسئلة من واقع الحياة، علل واستنتج، وعلى التجارب</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const qText = guideData.checkUnderstanding.map((q, i) => `س${i+1} (${q.questionType}): ${q.question}\nج: ${q.correctAnswer}`).join("\n\n");
                  copyText(qText, "questions");
                }}
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs py-1.5 px-3 rounded-lg transition-colors border border-purple-200 flex items-center gap-1 cursor-pointer"
              >
                <span>{copiedSection === "questions" ? "✅ تم النسخ" : "📋 نسخ كل الأسئلة"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {guideData.checkUnderstanding.map((q, idx) => (
                <div key={idx} className="bg-gradient-to-b from-purple-50/50 to-white p-4 rounded-xl border border-purple-100 shadow-2xs space-y-2 text-xs flex flex-col justify-between">
                  <div>
                    <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[11px] inline-block mb-1.5">
                      {q.questionType}
                    </span>
                    <h5 className="font-black text-gray-900 leading-snug">
                      "{q.question}"
                    </h5>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100 mt-2">
                    <span className="text-[11px] font-bold text-emerald-700 block mb-0.5">✅ إجابة المعلمة:</span>
                    <p className="text-gray-800 font-medium leading-relaxed">{q.correctAnswer}</p>
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
