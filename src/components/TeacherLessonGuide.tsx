"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

export interface LessonBeat {
  beatNumber: number;
  conceptTitle: string;
  teacherVoiceover: string;
  analogyIdea: string;
  analogyTitle: string;
  flowVideoPrompt: string;
}

export interface LessonGuideData {
  lessonTitle: string;
  detectedTopic?: string;
  beats: LessonBeat[];
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
  lessonTitle: "كيف تصنع النباتات غذاءها؟ (عملية البناء الضوئي ومطبخ النبتة)",
  detectedTopic: "البناء الضوئي، حاجة النبات للماء والهواء والضوء، ونواتج التغذية",
  beats: [
    {
      beatNumber: 1,
      conceptTitle: "فكرة البداية: كيف يأكل الكائن الحي عند الجوع؟",
      teacherVoiceover: "صباح الفل يا دكاترة المستقبل! كلنا لما بنجوع بنفتح التلاجة وناكل أحلى أكل!",
      analogyIdea: "شخص جائع يفتح ثلاجة مضيئة في مطبخ دافئ ويأكل ساندوتش شهي.",
      analogyTitle: "شخص يفتح الثلاجة ويأكل ساندوتش شهي (بدون معلمة)",
      flowVideoPrompt: "Cinematic 3D Pixar animation of a cozy modern kitchen at night. A hungry person opens a brightly glowing refrigerator, smiles happily, takes out a delicious fresh sandwich and takes a joyful bite. Beautiful soft volumetric lighting, warm cozy atmosphere, smooth camera push-in. ABSOLUTELY NO teachers, NO classroom, pure lifestyle food scene."
    },
    {
      beatNumber: 2,
      conceptTitle: "عجز النبات عن الحركة لشراء الطعام",
      teacherVoiceover: "لكن النبتة دي كائن حي زينا بالظبط، لا عندها رجلين تروح السوبر ماركت تشتري خضار، ولا إيدين تطبخ!",
      analogyIdea: "طفل أو شخص يتسوق في سوبر ماركت مليء بالخضار والفواكه الطازجة.",
      analogyTitle: "التسوق في السوبر ماركت وشراء الأطعمة (بدون معلمة)",
      flowVideoPrompt: "Vibrant 3D Pixar style tracking shot through a modern colorful supermarket aisle. A shopping cart is pushed along rows of fresh glowing apples, bread, and vegetables. Cheerful bright lighting, smooth dynamic camera motion. ABSOLUTELY NO teachers, NO school."
    },
    {
      beatNumber: 3,
      conceptTitle: "مطبخ النبتة السحري (الأوراق الخضراء)",
      teacherVoiceover: "السر يا شطار إن النبتة عندها شيف عبقري ومطبخ سحري جواها بيطبخ لها أحلى أكل، ومطبخها موجود تحديداً في الورقة الخضراء!",
      analogyIdea: "مطبخ كرتوني مشمس مبهج وناعم تتسلل إليه أشعة الشمس الذهبية من الشباك.",
      analogyTitle: "مطبخ مشمس دافئ يتسلل إليه ضوء الصباح (بدون معلمة)",
      flowVideoPrompt: "Charming 3D Pixar scene of a warm rustic kitchen counter flooded with bright morning sunbeams through a large window, illuminating fresh green basil leaves on a cutting board, delicate dust particles sparkling in the sun rays. Cinematic lens flare, cozy appetizing aesthetic. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 4,
      conceptTitle: "امتصاص الجذور للماء والأملاح كالمصاصة",
      teacherVoiceover: "عشان تطبخ محتاجة مية، فالجذور تحت الأرض بتشفط المية والأملاح زي الشفاطة بالضبط، وتطلعها في أنابيب لحد الورقة!",
      analogyIdea: "شفاطة ملونة تشفط مياهاً وعصيراً منعشاً بحيوية من كوب زجاجي مثلج.",
      analogyTitle: "شفاطة تشفط ماء وعصير منعش من كوب مثلج (بدون معلمة)",
      flowVideoPrompt: "Macro close-up 3D Pixar animation of a colorful striped drinking straw smoothly and powerfully sipping up cool sparkling water and vibrant fruit juice from a clear glass with ice cubes, showing dynamic liquid suction and rising bubbly droplets. Clean bright aesthetic, dynamic macro camera motion. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 5,
      conceptTitle: "تنفس الورقة ودخول غاز ثاني أكسيد الكربون عبر الثغور",
      teacherVoiceover: "وتاني حاجة الهواء، الورقة عندها فتحات صغيرة زي مناخيرنا اسمها الثغور بتتنفس وتاخد غاز اسمه ثاني أكسيد الكربون!",
      analogyIdea: "فتحات تهوية لطيفة أو نوافذ شرفة تفتح ليدخل منها نسيم هواء عليل ومتحرك.",
      analogyTitle: "نوافذ تفتح لدخول نسيم هواء عليل ومنعش (بدون معلمة)",
      flowVideoPrompt: "Artistic 3D animation of gentle sheer white curtains fluttering gracefully at an open window as a fresh summer breeze carrying soft glowing pollen swirls into a sunlit room. Soft depth of field, fluid air current visualization. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 6,
      conceptTitle: "طاقة الشمس والبوتجاز لتسوية الطبخة الكيميائية",
      teacherVoiceover: "وتالت حاجة ضوء الشمس اللي بيشغل البوتجاز ويسوي الطبخة، فتتحد المية مع الهواء وتستوي الوجبة!",
      analogyIdea: "صينية كيك شهية تنتفخ وتستوي داخل فرن مضيء ودافئ بحرارة الفرن.",
      analogyTitle: "صينية كيكة تنتفخ وتستوي في فرن دافئ (بدون معلمة)",
      flowVideoPrompt: "Appetizing close-up 3D animation through an oven glass door: A fluffy golden cake batter smoothly rises and bakes into perfection with gentle steam swirling under a warm amber heating glow. Mouthwatering cinematic render. ABSOLUTELY NO teachers."
    },
    {
      beatNumber: 7,
      conceptTitle: "النواتج: سكر الجلوكوز لطاقة النبات والأكسجين لتنفسنا",
      teacherVoiceover: "وبعد ما تستوي الطبخة تطلع هديتين: سكر الجلوكوز عشان النبتة تكبر، وغاز الأكسجين النقي عشان كلنا نتنفس ونعيش!",
      analogyIdea: "صينية حلويات ذهبية شهية يخرج منها البخار المعطر، وفقاعات شفافة نقية تتصاعد في حديقة خضراء.",
      analogyTitle: "صينية حلوى ذهبية وفقاعات أكسجين منعشة في الهواء (بدون معلمة)",
      flowVideoPrompt: "Magical 3D Pixar animation: Iridescent sparkling oxygen bubbles floating upwards into a crystal clear sunny blue sky over a vibrant garden, with golden sparkling glucose crystals glowing gently on green leaves. Uplifting, clean, joyful visual. ABSOLUTELY NO teachers."
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
        // Normalize guide data if beats or sections format
        let normalizedBeats: LessonBeat[] = [];
        if (data.guide.beats && Array.isArray(data.guide.beats)) {
          normalizedBeats = data.guide.beats;
        } else if (data.guide.sections && Array.isArray(data.guide.sections)) {
          normalizedBeats = data.guide.sections.map((sec: any, idx: number) => ({
            beatNumber: idx + 1,
            conceptTitle: sec.title || `جزئية ${idx + 1}`,
            teacherVoiceover: sec.teacherSpeech || "",
            analogyIdea: sec.realLifeAnalogy || "",
            analogyTitle: sec.analogyTitle || `تشبيه الجزئية ${idx + 1}`,
            flowVideoPrompt: sec.flowVideoPrompt || sec.analogyVideoMotionPrompt || ""
          }));
        }

        setGuideData({
          ...data.guide,
          beats: normalizedBeats
        });
        alert("🎉 تم فهم الدرس أوتوماتيكياً وتقسيمه لجزئيات مع برومبت فيديو لكل تشبيه!");
      }
    } catch (e: any) {
      console.error(e);
      alert("خطأ: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy All Voiceovers in sequential order for easy microphone recording
  const copyAllVoiceoverScript = () => {
    if (!guideData || !guideData.beats) return;
    const script = guideData.beats
      .map((b) => `المشهد ${String(b.beatNumber).padStart(2, "0")} (${b.conceptTitle}):\n${b.teacherVoiceover}`)
      .join("\n\n---\n\n");
    copyText(script, "all_voiceover");
  };

  // Copy All Flow Video Prompts sequentially
  const copyAllFlowPrompts = () => {
    if (!guideData || !guideData.beats) return;
    const prompts = guideData.beats
      .map((b) => `SCENE ${String(b.beatNumber).padStart(2, "0")} - ${b.analogyTitle}\nFLOW PROMPT:\n${b.flowVideoPrompt}`)
      .join("\n\n" + "=".repeat(45) + "\n\n");
    copyText(prompts, "all_flow_prompts");
  };

  // Download full formatted file to device (.txt)
  const downloadFullGuideTxt = () => {
    if (!guideData) return;
    let txt = `======================================================================\n`;
    txt += `  دليل المعلمة لشرح وتبسيط العلوم للأطفال بالمونتاج\n`;
    txt += `  (سكريبت الشرح الصوتي + برومبتات فيديو Flow لكل تشبيه بدون معلمة)\n`;
    txt += `  إعداد: Sci.Rehab Elsibai Studio\n`;
    txt += `  عنوان الدرس: ${guideData.lessonTitle}\n`;
    txt += `  الموضوع المكتشف: ${guideData.detectedTopic || "علمي مخصص"}\n`;
    txt += `  عدد الجزئيات والمشاهد: ${guideData.beats?.length || 0} مشهد\n`;
    txt += `======================================================================\n\n`;

    if (guideData.beats && guideData.beats.length > 0) {
      txt += `🎬 مشاهد وسكريبت المونتاج مقسمة جزئية بجزئية مع فيديو التشبيه:\n\n`;
      guideData.beats.forEach((b) => {
        txt += `######################################################################\n`;
        txt += `🎬 مشهد ${String(b.beatNumber).padStart(2, "0")}: ${b.conceptTitle}\n`;
        txt += `🎙️ كلامكِ الصوتي للتسجيل في المونتاج:\n${b.teacherVoiceover}\n\n`;
        txt += `💡 التشبيه من الحياة اليومية: ${b.analogyIdea}\n\n`;
        txt += `🎬 برومبت فيديو Flow للتشبيه (بدون معلمة - ${b.analogyTitle}):\n`;
        txt += `${b.flowVideoPrompt}\n\n`;
      });
      txt += `\n======================================================================\n\n`;
    }

    if (guideData.experiments && guideData.experiments.length > 0) {
      txt += `🧪 شرح التجارب العلمية بالتفصيل:\n\n`;
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

    txt += `📋 ما يُكتب على السبورة فقط:\n`;
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

    txt += `❓ أسئلة التأكد من الفهم وإجاباتها:\n\n`;
    guideData.checkUnderstanding.forEach((q, idx) => {
      txt += `سؤال ${idx + 1} (${q.questionType}): ${q.question}\n`;
      txt += `الإجابة النموذجية: ${q.correctAnswer}\n\n`;
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `سكريبت_الشرح_وفيديوهات_فلو_${guideData.lessonTitle.replace(/[/\\?%*:|"<>]/g, "_")}.txt`;
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
              <span>فهم تلقائي للدرس + تقسيم أوتوماتيكي لكل جزئية مع فيديو التشبيه لـ Flow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              تقسيم الدرس لجزئيات وفيديوهات التشبيه لموقع Flow
            </h2>
            <p className="text-emerald-200/90 text-sm sm:text-base mt-1 max-w-2xl">
              ارفعي أي درس؛ سيفهمه الذكاء الاصطناعي أوتوماتيكياً ويقسمه لجمل صغيرة، ولكل جملة تشبيه واقعي مع برومبت فيديو Flow (بدون معلمة) لتضعيه في المونتاج وأنتِ تتكلمين!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGuideData(PRESET_SAMPLE_GUIDE);
                alert("تم تحميل النموذج الاسترشادي الجاهز (درس النبات ومطبخ الورقة)!");
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
              placeholder="مثال: رحلة داخل القلب، أو الجهاز الهضمي، أو القوى والحركة"
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
              {isLoading ? "جاري فهم الدرس والتقسيم وتوليد فيديوهات Flow..." : "🚀 فهم الدرس وتقسيم الفيديوهات أوتوماتيكياً"}
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
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✨ تم فهم الدرس وتقسيمه إلى ({guideData.beats?.length || 0}) جزئية تشبيهية
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">{guideData.lessonTitle}</h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={copyAllVoiceoverScript}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                title="نسخ جميع جمل المعلمة وراء بعضها للتسجيل الصوتي"
              >
                <span>🎙️</span> {copiedSection === "all_voiceover" ? "✅ تم نسخ السكريبت!" : "نسخ كامل السكريبت الصوتي"}
              </button>

              <button
                onClick={copyAllFlowPrompts}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                title="نسخ جميع برومبتات Flow التشبيهية"
              >
                <span>🎬</span> {copiedSection === "all_flow_prompts" ? "✅ تم نسخ البرومبتات!" : "نسخ كل برومبتات Flow"}
              </button>

              <button
                onClick={downloadFullGuideTxt}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>📥</span> حفظ ملف (.txt)
              </button>

              <button
                onClick={copyBlackboardOnly}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>📋</span> {copiedSection === "blackboard_only" ? "✅ تم نسخ السبورة!" : "السبورة فقط"}
              </button>
            </div>
          </div>

          {/* Section: الجزئيات الدقيقة والمشاهد المتتالية */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 bg-purple-100 text-purple-800 rounded-xl">🎬</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    مشاهد المونتاج والتشبيهات المتتالية (كلامكِ الصوتي + فيديو Flow التشبيهي)
                  </h3>
                  <p className="text-xs text-gray-500">
                    كل جزئية تحتوي على جملتكِ التي تسجلينها بصوتك، مع برومبت فيديو Flow للتشبيه (بدون معلمة) لتضعيه فوقها في المونتاج!
                  </p>
                </div>
              </div>

              <span className="text-xs bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full">
                {guideData.beats?.length || 0} مشهد تفصيلي
              </span>
            </div>

            {/* List of Micro-Beats */}
            <div className="space-y-5">
              {guideData.beats?.map((beat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-purple-300 transition-all space-y-3.5"
                >
                  {/* Beat Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                        {beat.beatNumber}
                      </span>
                      <h4 className="font-black text-sm sm:text-base text-gray-900">
                        {beat.conceptTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyText(beat.teacherVoiceover, `voice_${idx}`)}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs py-1 px-2.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="نسخ كلام المعلمة فقط"
                      >
                        <span>🎙️</span>
                        <span>{copiedSection === `voice_${idx}` ? "✅ تم النسخ" : "نسخ جملة الشرح"}</span>
                      </button>

                      <button
                        onClick={() => copyText(beat.flowVideoPrompt, `flow_${idx}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-1 px-3 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="نسخ برومبت Flow لمشهد التشبيه"
                      >
                        <span>🎬</span>
                        <span>{copiedSection === `flow_${idx}` ? "✅ تم النسخ" : "نسخ برومبت Flow"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. كلامك الصوتي للتسجيل في المونتاج */}
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <span>🎙️</span> كلامكِ الصوتي في المونتاج (اقرأي وسجلي بصوتكِ):
                    </span>
                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                      "{beat.teacherVoiceover}"
                    </p>
                  </div>

                  {/* 2. فكرة التشبيه من الحياة اليومية */}
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      💡 فكرة التشبيه من الحياة اليومية (مطبخ/أكل/لعب):
                    </span>
                    <p className="text-amber-950 font-medium leading-relaxed">
                      {beat.analogyIdea}
                    </p>
                  </div>

                  {/* 3. برومبت فيديو Flow بدون معلمة (B-Roll تحطيه في المونتاج) */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3.5 rounded-xl border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🎬</span>
                        <div>
                          <span className="text-xs font-bold text-purple-950 block">
                            برومبت فيديو Flow للتشبيه (B-Roll بدون معلمة - ضعيه في المونتاج):
                          </span>
                          <span className="text-[11px] text-purple-700 font-medium">
                            {beat.analogyTitle}
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

          {/* Section: التجارب العلمية (إن وجدت) */}
          {guideData.experiments && guideData.experiments.length > 0 && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-teal-100 text-teal-800 rounded-xl">🧪</span>
                <div>
                  <h3 className="text-base font-black text-teal-950">
                    شرح التجارب العلمية خطوة بخطوة بالمنطق واحتياطات الأمان
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

          {/* Section: السبورة الذكية (ما يُكتب على السبورة فقط) */}
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

          {/* Section: التأكد من فهم الطلاب (Oral Questions) */}
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
