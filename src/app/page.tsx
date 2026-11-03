"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import BookAndImagesUploader from "@/components/BookAndImagesUploader";
import ImageLessonResults, { ImageLessonScene } from "@/components/ImageLessonResults";
import FileUpload from "@/components/FileUpload";
import CharacterSettings, { CharacterConfig } from "@/components/CharacterSettings";
import ContentMapViewer, { ContentPart } from "@/components/ContentMapViewer";
import PromptResultList, { VideoPrompt } from "@/components/PromptResultList";
import { PRESET_PROGRESSIVE_KIDNEY_SCENES } from "@/data/progressiveKidneyPreset";
import TeacherLessonGuide from "@/components/TeacherLessonGuide";

interface SavedProject {
  id: string;
  name: string;
  date: string;
  type?: "video" | "image_lesson";
  prompts?: VideoPrompt[];
  imageScenes?: ImageLessonScene[];
  config?: CharacterConfig;
}

export default function Home() {
  // Main Studio Mode: "image_lesson" (new requested flow) or "text_prompts" (classic PDF flow)
  const [studioMode, setStudioMode] = useState<"image_lesson" | "text_prompts" | "lesson_guide">("image_lesson");

  // --- Image Lesson Mode State ---
  const [isAnalyzingImages, setIsAnalyzingImages] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  // Default to the 5 connected progressive scenes ready out of the box!
  const [imageLessonScenes, setImageLessonScenes] = useState<ImageLessonScene[] | null>(PRESET_PROGRESSIVE_KIDNEY_SCENES);
  const [currentProjectName, setCurrentProjectName] = useState<string>("رحلة الكليتين وتنقية الدم (نموذج الصور المترابطة)");

  // --- Classic Video Prompts State ---
  const [videoMode, setVideoMode] = useState<"paired" | "paired_no_teacher" | "story" | "teacher" | "cartoon" | "review" | "studio" | "gameshow">("paired");
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
    description: "",
    characterLock: true,
    sceneLock: true,
    continuityLock: true,
    isFinalScene: false,
    previousStoryContext: "",
  });
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [contentMap, setContentMap] = useState<ContentPart[] | null>(null);
  const [nextProcessingIndex, setNextProcessingIndex] = useState(0);
  const [prompts, setPrompts] = useState<VideoPrompt[] | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [detectedLessonTopic, setDetectedLessonTopic] = useState<string>("");
  const [detectedSubjectDomain, setDetectedSubjectDomain] = useState<string>("");
  const [detectedVisualAnchor, setDetectedVisualAnchor] = useState<string>("");

  // Projects storage
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Load saved projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setSavedProjects(data.projects || []);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    fetchProjects();
  }, []);

  // Save current project to disk
  const saveCurrentProject = async () => {
    let newProject: SavedProject;

    if (studioMode === "image_lesson" && imageLessonScenes && imageLessonScenes.length > 0) {
      newProject = {
        id: Date.now().toString(),
        name: currentProjectName || `تحريك صور الدرس ${new Date().toLocaleTimeString("ar-EG")}`,
        date: new Date().toLocaleString("ar-EG"),
        type: "image_lesson",
        imageScenes: imageLessonScenes,
      };
    } else if (prompts && prompts.length > 0) {
      newProject = {
        id: Date.now().toString(),
        name: selectedPdfFile ? selectedPdfFile.name : `مشروع فيديو ${new Date().toLocaleTimeString("ar-EG")}`,
        date: new Date().toLocaleString("ar-EG"),
        type: "video",
        prompts: prompts,
        config: { ...characterConfig },
      };
    } else {
      alert("لا توجد نتائج لحفظها حالياً.");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        setSavedProjects([newProject, ...savedProjects]);
        alert("🎉 تم حفظ المشروع بنجاح في مشاريعك!");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الحفظ على الجهاز.");
    }
  };

  const loadProject = (project: SavedProject) => {
    if (project.type === "image_lesson" && project.imageScenes) {
      setImageLessonScenes(project.imageScenes);
      setCurrentProjectName(project.name);
      setStudioMode("image_lesson");
      alert(`تم تحميل: ${project.name}`);
    } else if (project.prompts) {
      setPrompts(project.prompts);
      if (project.config) {
        setCharacterConfig(project.config);
      }
      setContentMap(null);
      setStudioMode("text_prompts");
      alert(`تم تحميل: ${project.name}`);
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedProjects(savedProjects.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete project", e);
    }
  };

  // --- 1. Handling Book + Images Analysis (The Core Feature) ---
  const handleAnalyzeBookAndImages = async (
    pdfFile: File | null,
    images: File[],
    startPage?: number,
    endPage?: number
  ) => {
    if (images.length === 0) {
      alert("الرجاء رفع صورة واحدة على الأقل من صور الدرس.");
      return;
    }

    setIsAnalyzingImages(true);
    try {
      let fileToSend: File | null = pdfFile;

      // Slice PDF if page range was provided
      if (pdfFile && startPage !== undefined && endPage !== undefined && !isNaN(startPage) && !isNaN(endPage)) {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();

        const realStart = Math.max(1, startPage);
        const realEnd = Math.min(totalPages, endPage);
        const s = Math.min(realStart, realEnd);
        const e = Math.max(realStart, realEnd);

        const newPdf = await PDFDocument.create();
        const pageIndices = Array.from({ length: e - s + 1 }, (_, i) => s - 1 + i);
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        fileToSend = new File([pdfBytes as any], `sliced_${s}_to_${e}_${pdfFile.name}`, {
          type: "application/pdf",
        });
      }

      const formData = new FormData();
      if (fileToSend) {
        formData.append("pdfFile", fileToSend);
      }
      formData.append("imagesCount", images.length.toString());
      images.forEach((img, idx) => {
        formData.append(`image_${idx}`, img);
      });

      const res = await fetch("/api/analyze-images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "فشل تحليل الصور وربطها بالدرس");
      }

      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        // Attach client-side preview URLs to each scene so images render immediately
        const enrichedScenes: ImageLessonScene[] = data.scenes.map((scene: any) => {
          const imgIndex = scene.imageIndex ?? 0;
          const originalImg = images[imgIndex] || images[0];
          return {
            ...scene,
            imageUrl: originalImg ? URL.createObjectURL(originalImg) : undefined,
            imageName: originalImg ? originalImg.name : `scene_${scene.stepNumber}.jpg`,
          };
        });

        setImageLessonScenes(enrichedScenes);
        const titleName = pdfFile 
          ? `درس: ${pdfFile.name.replace(/\.[^/.]+$/, "")} (${images.length} صور)` 
          : `تحريك صور الدرس (${images.length} صور)`;
        setCurrentProjectName(titleName);
      }
    } catch (e: any) {
      console.error(e);
      alert("حدث خطأ أثناء تحليل الصور: " + e.message);
    } finally {
      setIsAnalyzingImages(false);
    }
  };

  // --- Auto-plan progressive visual journey (AI invents consistent images & prompts) ---
  const handleAutoPlanProgressiveLesson = async (
    topic: string,
    pdfFile: File | null,
    startPage?: number,
    endPage?: number
  ) => {
    setIsPlanning(true);
    try {
      const isKidneys = topic.includes("كلى") || topic.includes("كلي") || topic.includes("بول") || topic.includes("إخراج") || topic.includes("تنقية");
      
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
      if (topic) formData.append("topic", topic);

      const res = await fetch("/api/plan-progressive-lesson", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل ابتكار الرحلة المصورة");
      }

      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        // Enrich with preset progressive images if it matches or assign images
        const enriched: ImageLessonScene[] = data.scenes.map((s: any, idx: number) => {
          const presetImg = PRESET_PROGRESSIVE_KIDNEY_SCENES[idx % PRESET_PROGRESSIVE_KIDNEY_SCENES.length];
          return {
            ...s,
            imageUrl: isKidneys ? presetImg.imageUrl : undefined,
            imageName: isKidneys ? presetImg.imageName : `progressive_scene_${s.stepNumber}.jpg`,
            imageIndex: idx
          };
        });
        setImageLessonScenes(enriched);
        setCurrentProjectName(data.detectedTopic || topic || "رحلة مصورة متناسقة");
      }
    } catch (e: any) {
      console.error(e);
      alert("حدث خطأ أثناء ابتكار الرحلة: " + e.message);
    } finally {
      setIsPlanning(false);
    }
  };

  // --- 2. Handling Classic PDF Flow ---
  const handleClassicPdfSelect = async (originalFile: File, startPage?: number, endPage?: number, continuing: boolean = false) => {
    let fileToProcess = originalFile;
    setIsAnalyzingPdf(true);

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
        fileToProcess = new File([pdfBytes as any], `sliced_${start}_to_${end}_${originalFile.name}`, {
          type: "application/pdf",
        });
      }

      setSelectedPdfFile(fileToProcess);
      setContentMap(null);
      setIsContinuing(continuing);
      if (!continuing) {
        setPrompts(null);
        setNextProcessingIndex(0);
      }

      const formData = new FormData();
      formData.append("file", fileToProcess);
      formData.append("mode", videoMode);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("فشل في التحليل");
      const data = await res.json();
      setContentMap(data.map);
      if (data.lessonTopic) setDetectedLessonTopic(data.lessonTopic);
      if (data.subjectDomain) setDetectedSubjectDomain(data.subjectDomain);
      if (data.primaryVisualAnchor) setDetectedVisualAnchor(data.primaryVisualAnchor);

      if (data.teacherOutfit || data.cartoonCharacter) {
        setCharacterConfig((prev) => ({
          ...prev,
          teacherOutfit: data.teacherOutfit || prev.teacherOutfit,
          cartoonCharacter: data.cartoonCharacter || prev.cartoonCharacter,
        }));
      }
    } catch (error: any) {
      console.error(error);
      alert("حدث خطأ أثناء تحليل الملف: " + error.message);
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!selectedPdfFile || !contentMap) return;

    setIsGeneratingPrompts(true);
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
        formData.append("file", selectedPdfFile);
        formData.append("contentMap", JSON.stringify(chunk));
        formData.append("characterConfig", JSON.stringify(currentConfig));
        formData.append("mode", videoMode);
        formData.append("startIndex", currentVideoCounter.toString());
        formData.append("lastContext", lastContext);
        if (detectedLessonTopic) formData.append("lessonTopic", detectedLessonTopic);
        if (detectedSubjectDomain) formData.append("subjectDomain", detectedSubjectDomain);
        if (detectedVisualAnchor) formData.append("primaryVisualAnchor", detectedVisualAnchor);

        const res = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "فشل في توليد البرومبتات");
        }

        const data = await res.json();
        allNewPrompts.push(...data.prompts);
        setPrompts([...startingPrompts, ...allNewPrompts]);
        currentVideoCounter += data.prompts.length;

        if (data.prompts.length > 0) {
          const lastPrompt = data.prompts[data.prompts.length - 1];
          lastContext = `The last video ended with: ${lastPrompt.endContinuity}. Character state: ${lastPrompt.character}`;
        }
        setNextProcessingIndex(i + chunkSize);
        setIsContinuing(true);
      }
    } catch (error: any) {
      console.error(error);
      alert("خطأ أثناء التوليد: " + error.message);
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* الشريط الجانبي للمشاريع المحفوظة */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center justify-between">
              <span>مشاريعي السابقة</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                {savedProjects.length}
              </span>
            </h2>
            {savedProjects.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">لا توجد مشاريع محفوظة بعد.</p>
            ) : (
              <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {savedProjects.map((proj) => (
                  <li
                    key={proj.id}
                    onClick={() => loadProject(proj)}
                    className="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors relative group"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold text-indigo-700">
                        {proj.type === "image_lesson" ? "📸 صور الدرس وتحريكها" : "🎬 فيديو كتاب"}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-gray-800 truncate pl-6">{proj.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{proj.date}</p>
                    <button
                      onClick={(e) => deleteProject(proj.id, e)}
                      className="absolute left-2 top-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
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
          
          {/* Header */}
          <header className="mb-6 text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-black text-blue-950 mb-2">
              Sci.Rehab Elsibai Studio
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              الاستوديو المتكامل لربط صور الدروس بصفحات الكتاب وتوليد برومبتات التحريك والفيديوهات التعليمية
            </p>

            {/* وضع العمل: تحريك صور الدرس (المطلوب) أو توليد برومبتات من نص الكتاب */}
            <div className="mt-5 inline-flex p-1.5 bg-gray-100 rounded-xl border border-gray-200">
              <button
                onClick={() => setStudioMode("image_lesson")}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  studioMode === "image_lesson"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <span>📸</span>
                <span>تحريك صور الدرس مع الكتاب (الوضع المباشر)</span>
              </button>

              <button
                onClick={() => setStudioMode("text_prompts")}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  studioMode === "text_prompts"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <span>📄</span>
                <span>توليد برومبتات من نصوص الكتاب فقط</span>
              </button>

              <button
                onClick={() => setStudioMode("lesson_guide")}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  studioMode === "lesson_guide"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <span>📖</span>
                <span>دليل المعلمة لشرح الدرس والسبورة (تحضير كامل)</span>
              </button>


            </div>
          </header>

          {/* 1. NEW WORKFLOW: Book + Images Correlated Animation */}
          {studioMode === "image_lesson" && (
            <div className="space-y-6">
              <BookAndImagesUploader
                onAnalyze={handleAnalyzeBookAndImages}
                isAnalyzing={isAnalyzingImages}
                onLoadPreset={() => {
                  setImageLessonScenes(PRESET_PROGRESSIVE_KIDNEY_SCENES);
                  setCurrentProjectName("رحلة الكليتين وتنقية الدم (نموذج الصور المترابطة)");
                }}
                onAutoPlan={handleAutoPlanProgressiveLesson}
                isPlanning={isPlanning}
              />

              {imageLessonScenes && (
                <ImageLessonResults
                  scenes={imageLessonScenes}
                  onSaveProject={saveCurrentProject}
                  projectName={currentProjectName}
                />
              )}
            </div>
          )}

          {/* 3. LESSON GUIDE WORKFLOW: Classroom & Blackboard Teacher Guide */}
          {studioMode === "lesson_guide" && (
            <div className="space-y-6">
              <TeacherLessonGuide />
            </div>
          )}

          {/* 2. CLASSIC WORKFLOW: Text PDF Prompts */}
          {studioMode === "text_prompts" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <span className="font-bold text-gray-700">شكل وأسلوب الفيديو:</span>
                <select
                  value={videoMode}
                  onChange={(e) => setVideoMode(e.target.value as any)}
                  className="border border-blue-400 text-blue-900 font-bold rounded-lg p-2.5 bg-blue-50 focus:ring-2 focus:ring-blue-300 outline-none cursor-pointer"
                >
                  <option value="paired">🧬 سلسلة علمية مترابطة (مع ظهور المعلمة والشاشة الذكية) 👩‍🏫📺</option>
                  <option value="paired_no_teacher">🔬 سلسلة علمية مترابطة (بدون ظهور المعلمة - مجسمات 3D فقط) 🖼️🎬</option>
                  <option value="story">🦊 وضع القصة السينمائية (شخصيات متغيرة حسب الدرس)</option>
                  <option value="cartoon">🎭 الفيلم الكرتوني (شخصيات مبتكرة وكوميديا)</option>
                  <option value="teacher">👩‍🏫 وضع المعلمة (شرح احترافي بشاشات ذكية)</option>
                  <option value="review">🔄 المراجعة الممتعة (مراجعة تفاعلية للوحدة)</option>
                  <option value="studio">🎬 استوديو الاحتراف (تبادل بين المعلمة والكرتون)</option>
                  <option value="gameshow">🏆 برنامج المسابقات (مراجعة سريعة وحل أسئلة)</option>
                </select>
              </div>

              <FileUpload
                onFileSelect={handleClassicPdfSelect}
                isAnalyzing={isAnalyzingPdf}
              />

              <CharacterSettings onSettingsChange={setCharacterConfig} />

              {contentMap && (
                <ContentMapViewer
                  map={contentMap}
                  onGeneratePrompts={handleGeneratePrompts}
                  isGenerating={isGeneratingPrompts}
                  nextProcessingIndex={nextProcessingIndex}
                  detectedTopic={detectedLessonTopic}
                  detectedSubjectDomain={detectedSubjectDomain}
                  primaryVisualAnchor={detectedVisualAnchor}
                />
              )}

              {prompts && (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <button
                      onClick={saveCurrentProject}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>💾</span> حفظ النتائج في مشاريعي
                    </button>
                  </div>

                  <PromptResultList
                    prompts={prompts}
                    onRegenerate={(idx) => alert(`سيتم إعادة إنشاء المشهد ${idx + 1}`)}
                    onAddPrompt={(p) => setPrompts((prev) => (prev ? [...prev, p] : [p]))}
                    teacherOutfit={characterConfig.teacherOutfit}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
