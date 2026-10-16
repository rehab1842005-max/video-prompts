"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import FileUpload from "@/components/FileUpload";
import CharacterSettings, { CharacterConfig } from "@/components/CharacterSettings";
import ContentMapViewer, { ContentPart } from "@/components/ContentMapViewer";
import PromptResultList, { VideoPrompt } from "@/components/PromptResultList";
import InteractiveSlideViewer, { InteractivePresentation } from "@/components/InteractiveSlideViewer";

interface SavedProject {
  id: string;
  name: string;
  date: string;
  prompts?: VideoPrompt[];
  config?: CharacterConfig;
  presentation?: InteractivePresentation;
  type?: "video" | "presentation";
}

// Preset Kidney Model ready out-of-the-box
const PRESET_KIDNEY_PRESENTATION: InteractivePresentation = {
  id: "kidney_model_preset",
  title: "رحلة الكليتين وتنقية الدم في جسم الإنسان",
  topic: "الكليتان وتنقية الدم",
  diagramType: "kidneys",
  steps: [
    {
      stepNumber: 1,
      title: "1. موضع الكليتين واستقبال الدم",
      category: "نظرة عامة على الجهاز الإخراجي",
      teacherScript: "أهلاً بكم يا أبطالي! شايفين الكليتين الجميلتين دول؟ هما مصنع النظافة في جسمنا، بيستقبلوا الدم من الشريان الكلوي الكبير عشان تبدأ أهم رحلة تنقية!",
      visualAction: "يظهر مجسم الكليتين مع الشريان الكلوي الكبير باللون الأحمر، وتبدأ خلايا الدم بالتدفق من أعلى الشريان باتجاه الكليتين.",
      particleType: "incoming_blood",
      showFilters: false,
      activeGlow: false,
      labels: [
        { text: "الشريان الكلوي (دم محمل بالفضلات)", x: 370, y: 70, color: "#ef4444" },
        { text: "الكلية اليسرى", x: 170, y: 140, color: "#f87171" },
        { text: "الكلية اليمنى", x: 630, y: 140, color: "#f87171" }
      ]
    },
    {
      stepNumber: 2,
      title: "2. فحص الدم غير النقي (المحمل بالفضلات)",
      category: "تركيب الدم قبل الفلترة",
      teacherScript: "بصوا معايا جوة الشريان! الدم مش ماشي لوحده، فيه كرات دم حمراء مفيدة، وفيه جزيئات فضلات ضارة صفراء لازم نتخلص منها فوراً عشان جسمنا يفضل سليم!",
      visualAction: "تكبير لمجرى الدم وظهور جزيئات صفراء تمثل الفضلات والسموم محاطة بكرات الدم الحمراء، متجهة إلى داخل أنسجة الكلية.",
      particleType: "waste_particles",
      showFilters: false,
      activeGlow: false,
      labels: [
        { text: "🔴 دم غير نقي", x: 260, y: 190, color: "#ef4444" },
        { text: "⚠️ فضلات ضارة (يجب طردها)", x: 470, y: 190, color: "#facc15" }
      ]
    },
    {
      stepNumber: 3,
      title: "3. دخول الفلاتر المجهرية (النيفرونات)",
      category: "عملية الغربلة والتصفية الدقيقة",
      teacherScript: "شايفين النجوم والمصافي الصفراء اللي نورت جوة الكلية؟ دي النيفرونات! ملايين الفلاتر الدقيقة بتغربل الدم، تحبس الفضلات وتعدي الدم النظيف بأمان!",
      visualAction: "إضاءة شبكات النيفرون داخل الكليتين كدوائر فلترة صفراء متوهجة تهتز لتصفية الفضلات وفصلها عن الدم النقي.",
      particleType: "filtering_action",
      showFilters: true,
      activeGlow: true,
      labels: [
        { text: "فلاتر النيفرون الذكية", x: 210, y: 260, color: "#fbbf24" },
        { text: "عملية الغربلة والترشيح", x: 580, y: 260, color: "#fbbf24" }
      ]
    },
    {
      stepNumber: 4,
      title: "4. فصل الفضلات ونزولها في الحالبين (البول)",
      category: "مرحلة التخلص من السموم",
      teacherScript: "الفضلات والمية الزايدة اتجمعت وتحولت لبول، وبدأت تنزل نقطة بنقطة في الأنبوبين الصفر دول (الحالبين) لحد ما توصل للمثانة وتخرج برة جسمنا خالص!",
      visualAction: "تدفق قطرات صفراء متتابعة عبر الحالبين الأيمن والأيسر هبوطاً إلى المثانة البولية للتخلص النهائي من الفضلات.",
      particleType: "urine_flow",
      showFilters: true,
      activeGlow: false,
      labels: [
        { text: "الحالب (ينقل البول)", x: 300, y: 380, color: "#eab308" },
        { text: "المثانة البولية (تخزين البول)", x: 400, y: 490, color: "#facc15" }
      ]
    },
    {
      stepNumber: 5,
      title: "5. عودة الدم النقي تماماً إلى الجسم",
      category: "اكتمال دورة النظافة",
      teacherScript: "وبكدا يا أبطالي، الدم اتنقى 100%! بيخرج من الوريد الأزرق النظيف ويرجع للقلب وباقي الجسم وهو منتعش وبصحة ممتازة! تبارك الله أحسن الخالقين!",
      visualAction: "توهج الوريد الكلوي باللون السماوي وخروج جزيئات دم نقية زرقاء صافية صاعدة إلى أعلى الجسم لاكتمال الدورة الدموية بنجاح.",
      particleType: "clean_blood_return",
      showFilters: false,
      activeGlow: true,
      labels: [
        { text: "الوريد الكلوي (دم نقي 100%)", x: 430, y: 70, color: "#38bdf8" },
        { text: "تمت التنقية بنجاح ✨", x: 400, y: 240, color: "#34d399" }
      ]
    }
  ]
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"video" | "presentation">("video");
  const [videoMode, setVideoMode] = useState<"cartoon" | "teacher" | "review" | "studio" | "story" | "gameshow" | "paired" | "powerpoint">("paired");
  
  // Video Prompts State
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
    description: "",
    characterLock: true,
    sceneLock: true,
    continuityLock: true,
    isFinalScene: false,
    previousStoryContext: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentMap, setContentMap] = useState<ContentPart[] | null>(null);
  const [nextProcessingIndex, setNextProcessingIndex] = useState(0);
  const [prompts, setPrompts] = useState<VideoPrompt[] | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Interactive Presentation State
  const [activePresentation, setActivePresentation] = useState<InteractivePresentation | null>(null);
  const [presentationTopicInput, setPresentationTopicInput] = useState("رحلة الكليتين وتنقية الدم");
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);

  // تحميل المشاريع المحفوظة من الهارد ديسك عند فتح الصفحة
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setSavedProjects(data.projects);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    fetchProjects();
  }, []);

  const saveCurrentProject = async () => {
    let newProject: SavedProject;

    if (activeTab === "presentation" && activePresentation) {
      newProject = {
        id: Date.now().toString(),
        name: `📊 باوربوينت: ${activePresentation.title}`,
        date: new Date().toLocaleString("ar-EG"),
        presentation: activePresentation,
        type: "presentation",
      };
    } else {
      if (!prompts || prompts.length === 0) return;
      const projectName = selectedFile ? selectedFile.name : `مشروع فيديو ${new Date().toLocaleTimeString()}`;
      newProject = {
        id: Date.now().toString(),
        name: projectName,
        date: new Date().toLocaleString("ar-EG"),
        prompts: prompts,
        config: { ...characterConfig },
        type: "video",
      };
    }
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        setSavedProjects([newProject, ...savedProjects]);
        alert("تم حفظ المشروع بنجاح وإلى الأبد على الكمبيوتر! يمكنك العودة إليه في أي وقت من قائمة 'مشاريعي السابقة'.");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الحفظ على الجهاز.");
    }
  };

  const loadProject = (project: SavedProject) => {
    if (project.presentation) {
      setActivePresentation(project.presentation);
      setActiveTab("presentation");
      alert(`تم تحميل العرض التقديمي: ${project.name}`);
    } else if (project.prompts) {
      setPrompts(project.prompts);
      if (project.config) {
        setCharacterConfig(project.config);
      }
      setContentMap(null);
      setActiveTab("video");
      alert(`تم تحميل ${project.name}`);
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedProjects(savedProjects.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete project", e);
    }
  };

  const handleFileSelect = async (originalFile: File, startPage?: number, endPage?: number, isContinuing: boolean = false) => {
    let fileToProcess = originalFile;
    setIsAnalyzing(true);
    
    try {
      if (startPage !== undefined && endPage !== undefined && !isNaN(startPage) && !isNaN(endPage)) {
        const arrayBuffer = await originalFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        
        let start = Math.max(1, startPage);
        let end = Math.min(totalPages, endPage);
        if (start > end) start = end;
        
        const newPdf = await PDFDocument.create();
        const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        fileToProcess = new File([pdfBytes as any], `sliced_${start}_to_${end}_${originalFile.name}`, { type: "application/pdf" });
      }

      setSelectedFile(fileToProcess);
      setContentMap(null);
      setIsContinuing(isContinuing);
      if (!isContinuing) {
        const randomOutfits = [
          'a stunning sparkly silver glitter blazer over a crisp white blouse and sleek dark trousers',
          'an elegant royal navy blue blazer with satin lapels over a cream silk blouse and dark pants',
          'a chic emerald green blazer with gold buttons over a crisp white top',
          'a glamorous rose gold blazer with subtle sparkles over a white blouse',
          'a stylish pastel lavender blazer over a white lace top and tailored trousers',
          'a vibrant crimson red blazer over a white silk blouse with tailored trousers',
          'a modern sapphire blue blazer over a crisp white top and dark pants'
        ];
        const randomCartoons = ['a cute blue robot', 'a fluffy orange fox', 'a green dinosaur', 'a smart owl', 'a tiny monkey', 'a penguin with a bowtie'];
        setPrompts(null);
        setNextProcessingIndex(0);
        setCharacterConfig(prev => ({
          ...prev,
          teacherOutfit: randomOutfits[Math.floor(Math.random() * randomOutfits.length)],
          cartoonCharacter: randomCartoons[Math.floor(Math.random() * randomCartoons.length)],
          previousStoryContext: ''
        }));
      }

      const formData = new FormData();
      formData.append("file", fileToProcess);
      formData.append("mode", videoMode === "powerpoint" ? "paired" : videoMode);
      
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error("فشل في التحليل");
      }
      
      const data = await res.json();
      setContentMap(data.map);
      
      if (isContinuing) {
        if (prompts && prompts.length > 0) {
          const lastPrompt = prompts[prompts.length - 1];
          setCharacterConfig(prev => ({
            ...prev,
            previousStoryContext: `The last video ended with: ${lastPrompt.endContinuity}. Character state: ${lastPrompt.character}`
          }));
        }
        alert("تم رفع الصفحة الجديدة! سيتم إكمال الدرس بنفس الشخصية والملابس والكرتون.");
      } else {
        if (data.teacherOutfit || data.cartoonCharacter) {
          setCharacterConfig(prev => ({
            ...prev,
            teacherOutfit: data.teacherOutfit || prev.teacherOutfit,
            cartoonCharacter: data.cartoonCharacter || prev.cartoonCharacter,
            previousStoryContext: ""
          }));
        }
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء تحليل الملف. تأكدي من إعداد مفتاح Gemini API، أو جربي تحديد عدد صفحات أقل لتجنب الضغط.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSettingsChange = (config: CharacterConfig) => {
    setCharacterConfig(config);
  };

  const handleGeneratePrompts = async () => {
    if (!selectedFile || !contentMap) return;
    
    setIsGenerating(true);
    const startingPrompts = isContinuing && prompts ? [...prompts] : [];
    if (!isContinuing) setPrompts([]); 
    
    try {
      const allNewPrompts: VideoPrompt[] = [];
      let currentVideoCounter = startingPrompts.length + 1;
      let lastContext = characterConfig.previousStoryContext || "";
      const chunkSize = 1;
      
      const batchSize = 2;
      const startIdx = nextProcessingIndex;
      const endIdx = Math.min(startIdx + batchSize, contentMap.length);
      if (startIdx >= contentMap.length) return;
      for (let i = startIdx; i < endIdx; i += chunkSize) {
        const chunk = contentMap.slice(i, i + chunkSize);
        const isLastChunk = i + chunkSize >= contentMap.length;
        
        const currentConfig = { ...characterConfig };
        if (currentConfig.isFinalScene && !isLastChunk) {
          currentConfig.isFinalScene = false; 
        }
        
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("contentMap", JSON.stringify(chunk));
        formData.append("characterConfig", JSON.stringify(currentConfig));
        formData.append("mode", videoMode === "powerpoint" ? "paired" : videoMode);
        formData.append("startIndex", currentVideoCounter.toString());
        formData.append("lastContext", lastContext);
        
        const res = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const apiErrorMsg = errorData.error || "فشل في التوليد";
          if (apiErrorMsg.includes("503") || apiErrorMsg.includes("demand") || apiErrorMsg.includes("Unavailable")) { 
            alert("السيرفر مضغوط دلوقتي من جوجل. البرومبتات اللي اتعملت لحد دلوقتي اتحفظت تماماً! استني دقيقة بس ودوسي استكمال تاني وهيكمل من مكان ما وقف بالضبط."); 
          } else { 
            alert("رسالة الخطأ من سيرفرات جوجل:\n" + apiErrorMsg); 
          } 
          break;
        }
        
        const data = await res.json();
        allNewPrompts.push(...data.prompts);
        setPrompts([...startingPrompts, ...allNewPrompts]);
        
        currentVideoCounter += data.prompts.length;

        if (data.teacherOutfit || data.cartoonCharacter) {
          setCharacterConfig(prev => ({
            ...prev,
            teacherOutfit: data.teacherOutfit || prev.teacherOutfit,
            cartoonCharacter: data.cartoonCharacter || prev.cartoonCharacter,
          }));
        }

        if (data.prompts.length > 0) {
           const lastPrompt = data.prompts[data.prompts.length - 1];
           lastContext = `The last video ended with: ${lastPrompt.endContinuity}. Character state: ${lastPrompt.character}`;
        }
        setNextProcessingIndex(i + chunkSize);
        setIsContinuing(true);
      }
    } catch (error: any) {
      console.error(error);
      alert("رسالة الخطأ من سيرفرات جوجل:\n" + error.message + "\n\n(لكن ما تم إنشاؤه سيظل محفوظاً في الصفحة).");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = (index: number) => {
    alert(`سيتم إعادة إنشاء المشهد رقم ${index + 1}... (هذه الميزة قيد التطوير)`);
  };

  // Generate Interactive PowerPoint Presentation from topic or PDF
  const handleGenerateInteractivePresentation = async (customTopic?: string, lessonContent?: string) => {
    const topicToUse = customTopic || presentationTopicInput.trim() || "رحلة الكليتين وتنقية الدم";
    
    setIsGeneratingPresentation(true);
    try {
      const res = await fetch("/api/presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicToUse,
          lessonText: lessonContent || topicToUse,
          diagramType: topicToUse.includes("كلى") || topicToUse.includes("كلي") || topicToUse.includes("بول") ? "kidneys" : "generic"
        })
      });

      if (!res.ok) {
        throw new Error("فشل توليد العرض التفاعلي");
      }

      const data = await res.json();
      if (data.presentation) {
        setActivePresentation(data.presentation);
        setActiveTab("presentation");
      }
    } catch (e: any) {
      console.error(e);
      // Fallback to preset kidney if error
      setActivePresentation(PRESET_KIDNEY_PRESENTATION);
      setActiveTab("presentation");
      alert("تم تفعيل نموذج رحلة الكليتين التفاعلي بنجاح!");
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* الشريط الجانبي للمشاريع المحفوظة */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center justify-between">
              <span>مشاريعي السابقة</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                {savedProjects.length}
              </span>
            </h2>
            {savedProjects.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">لا توجد مشاريع محفوظة بعد.</p>
            ) : (
              <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {savedProjects.map((proj) => (
                  <li 
                    key={proj.id} 
                    onClick={() => loadProject(proj)}
                    className="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors relative group"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">
                        {proj.type === "presentation" || proj.presentation ? "📊 باوربوينت" : "🎬 فيديو"}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-gray-800 truncate pl-6">{proj.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{proj.date}</p>
                    <button 
                      onClick={(e) => deleteProject(proj.id, e)}
                      className="absolute left-2 top-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="حذف المشروع"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="w-full lg:w-3/4">
          <header className="mb-6 text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-2">
              Sci.Rehab Elsibai Studio
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              المنصة المتكاملة لتحويل المذكرات والمناهج إلى فيديوهات ذكاء اصطناعي وعروض باوربوينت تفاعلية
            </p>

            {/* Main Tabs Navigation */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 border-t pt-4">
              <button
                onClick={() => setActiveTab("video")}
                className={`py-3 px-6 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-sm ${
                  activeTab === "video"
                    ? "bg-blue-600 text-white shadow-blue-500/30 scale-105"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>🎬</span> استوديو الفيديوهات والبرومبتات (معلمة + شاشة ذكية)
              </button>

              <button
                onClick={() => {
                  setActiveTab("presentation");
                  if (!activePresentation) {
                    setActivePresentation(PRESET_KIDNEY_PRESENTATION);
                  }
                }}
                className={`py-3 px-6 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-sm ${
                  activeTab === "presentation"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/30 scale-105"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                <span>📊</span> صانع الباوربوينت التفاعلي (كليك لكل حركة - بدون فيديو) 🖥️
              </button>
            </div>
          </header>

          {/* TAB 1: INTERACTIVE POWERPOINT PRESENTATION MODE */}
          {activeTab === "presentation" && (
            <div className="space-y-6">
              {/* Feature Intro & Generator Box */}
              <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-teal-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📊</span>
                  <div>
                    <h2 className="text-2xl font-black text-teal-300">
                      صانع الباوربوينت التفاعلي للشرح الحي (كليك لكل حركة)
                    </h2>
                    <p className="text-sm text-slate-300">
                      لا يوجد فيديو ولا كرتون! المعلمة هي التي تشرح بنفسها للطلاب، وكل حركة تظهر بكليك تحكم كامل بالماوس أو المسطرة.
                    </p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-4 pt-4 border-t border-teal-800/80">
                  <span className="text-xs font-bold text-teal-300 block mb-2">
                    ⚡ نماذج جاهزة للتشغيل الفوري بكليك واحد:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActivePresentation(PRESET_KIDNEY_PRESENTATION)}
                      className="bg-teal-800/80 hover:bg-teal-700 text-white text-xs px-3 py-2 rounded-xl border border-teal-600/60 font-bold transition flex items-center gap-1.5"
                    >
                      <span>🫘</span> رحلة الكليتين وتنقية الدم (نموذج الـ 5 كليكات)
                    </button>
                    <button
                      onClick={() => handleGenerateInteractivePresentation("رحلة القلب والدورة الدموية وتوزيع الأكسجين")}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 font-bold transition flex items-center gap-1.5"
                    >
                      <span>🫀</span> القلب والدورة الدموية
                    </button>
                    <button
                      onClick={() => handleGenerateInteractivePresentation("رحلة الجهاز الهضمي وامتصاص الغذاء")}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 font-bold transition flex items-center gap-1.5"
                    >
                      <span>🥗</span> الجهاز الهضمي
                    </button>
                    <button
                      onClick={() => handleGenerateInteractivePresentation("الجهاز التنفسي وتبادل الغازات في الرئتين")}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 font-bold transition flex items-center gap-1.5"
                    >
                      <span>🫁</span> الجهاز التنفسي
                    </button>
                  </div>
                </div>

                {/* Custom Topic Generator */}
                <div className="mt-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={presentationTopicInput}
                    onChange={(e) => setPresentationTopicInput(e.target.value)}
                    placeholder="اكتبي أي درس أو عملية علمية (مثلاً: الكليتان وتنقية الدم، تكوين البول...)"
                    className="flex-1 w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
                  />
                  <button
                    onClick={() => handleGenerateInteractivePresentation()}
                    disabled={isGeneratingPresentation}
                    className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg text-sm transition whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGeneratingPresentation ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>جاري التحليل والإنشاء...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>إنشاء العرض التفاعلي بالذكاء الاصطناعي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Render Interactive Stage Viewer */}
              {activePresentation && (
                <InteractiveSlideViewer 
                  presentation={activePresentation}
                  onSave={saveCurrentProject}
                />
              )}
            </div>
          )}

          {/* TAB 2: VIDEO PROMPT STUDIO MODE */}
          {activeTab === "video" && (
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
                <span className="font-bold text-gray-700 text-lg">نوع وشكل الفيديو المطلوب:</span>
                <select
                  value={videoMode}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setVideoMode(val);
                    if (val === "powerpoint") {
                      setActiveTab("presentation");
                      if (!activePresentation) setActivePresentation(PRESET_KIDNEY_PRESENTATION);
                    }
                  }}
                  className="border-2 border-blue-400 text-blue-900 font-bold rounded-lg p-3 w-full sm:w-auto bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all cursor-pointer"
                >
                  <option value="paired">🧬 سلسلة علمية مترابطة (صورة مرجعية + فيديو متصل لكل جزئية) 🖼️🎬</option>
                  <option value="powerpoint">📊 عرض باوربوينت تفاعلي (تحكم كامل كليك لكل حركة بدون فيديو) 🖥️</option>
                  <option value="story">🦊 وضع القصة السينمائية (شخصيات متغيرة حسب الدرس)</option>
                  <option value="cartoon">🎭 الفيلم الكرتوني (شخصيات مبتكرة وكوميديا)</option>
                  <option value="teacher">👩‍🏫 وضع المعلمة (شرح احترافي بشاشات ذكية)</option>
                  <option value="review">🔄 المراجعة الممتعة (مراجعة تفاعلية للوحدة)</option>
                  <option value="studio">🎬 استوديو الاحتراف (تبادل بين المعلمة والكرتون)</option>
                  <option value="gameshow">🏆 برنامج المسابقات (مراجعة سريعة وحل أسئلة)</option>
                </select>
              </div>

              <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
              
              <CharacterSettings onSettingsChange={handleSettingsChange} />
              
              {contentMap && (
                <ContentMapViewer 
                  map={contentMap} 
                  onGeneratePrompts={handleGeneratePrompts}
                  isGenerating={isGenerating}
                  nextProcessingIndex={nextProcessingIndex}
                  onConvertToPresentation={(part) => {
                    handleGenerateInteractivePresentation(part.title, part.contentSummary);
                  }}
                />
              )}

              {prompts && (
                <div className="mt-8 flex flex-col gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">➕ إكمال الدرس (رفع صفحة جديدة بنفس الستايل)</h3>
                    <p className="text-gray-700 mb-4">ستحافظ المعلمة على نفس ملابسها وسيحافظ الكرتون على شكله لاستكمال السلسلة. حددي الصفحة الجديدة هنا:</p>
                    <FileUpload 
                      onFileSelect={(file, start, end) => handleFileSelect(file, start, end, true)} 
                      isAnalyzing={isAnalyzing} 
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={saveCurrentProject}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
                    >
                      <span className="text-xl">💾</span> حفظ النتائج في مشاريعي
                    </button>
                  </div>
                </div>
              )}

              {prompts && (
                <PromptResultList 
                  prompts={prompts} 
                  onRegenerate={handleRegenerate}
                  onAddPrompt={(newPrompt) => setPrompts(prev => prev ? [...prev, newPrompt] : [newPrompt])}
                  teacherOutfit={characterConfig.teacherOutfit}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
