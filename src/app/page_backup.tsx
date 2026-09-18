"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import FileUpload from "@/components/FileUpload";
import CharacterSettings, { CharacterConfig } from "@/components/CharacterSettings";
import ContentMapViewer, { ContentPage } from "@/components/ContentMapViewer";
import PromptResultList, { VideoPrompt } from "@/components/PromptResultList";

interface SavedProject {
  id: string;
  name: string;
  date: string;
  prompts: VideoPrompt[];
  config?: CharacterConfig;
}

export default function Home() {
  const [videoMode, setVideoMode] = useState<"cartoon" | "teacher" | "review" | "studio">("cartoon");
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
  const [contentMap, setContentMap] = useState<ContentPage[] | null>(null);
  const [prompts, setPrompts] = useState<VideoPrompt[] | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const continueFileInputRef = React.useRef<HTMLInputElement>(null);

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
    if (!prompts || prompts.length === 0) return;
    const projectName = selectedFile ? selectedFile.name : `مشروع ${new Date().toLocaleTimeString()}`;
    const newProject: SavedProject = {
      id: Date.now().toString(),
      name: projectName,
      date: new Date().toLocaleString("ar-EG"),
      prompts: prompts,
      config: { ...characterConfig },
    };
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        setSavedProjects([newProject, ...savedProjects]);
        alert("تم حفظ النتائج بنجاح وإلى الأبد على الكمبيوتر! يمكنك العودة إليها في أي وقت من قائمة 'مشاريعي السابقة'.");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الحفظ على الجهاز.");
    }
  };

  const loadProject = (project: SavedProject) => {
    setPrompts(project.prompts);
    if (project.config) {
      setCharacterConfig(project.config);
    }
    setContentMap(null); // نخفي الـ Map لأننا نحمل النتائج النهائية
    alert(`تم تحميل ${project.name}`);
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

  const handleContinueLesson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0], undefined, undefined, true);
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
        fileToProcess = new File([pdfBytes], `sliced_${start}_to_${end}_${originalFile.name}`, { type: "application/pdf" });
      }

      setSelectedFile(fileToProcess);
      setContentMap(null);
      if (!isContinuing) {
        setPrompts(null);
      }

      const formData = new FormData();
      formData.append("file", fileToProcess);
      formData.append("mode", videoMode);
      
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error("فشل في التحليل");
      }
      
      const data = await res.json();
      setContentMap(data.map);
      
      // Update character config
      if (isContinuing) {
        // Keep existing characters! Just link the story context.
        if (prompts && prompts.length > 0) {
          const lastPrompt = prompts[prompts.length - 1];
          setCharacterConfig(prev => ({
            ...prev,
            previousStoryContext: `The last video ended with: ${lastPrompt.endContinuity}. Character state: ${lastPrompt.character}`
          }));
        }
        alert("تم رفع الصفحة الجديدة! سيتم إكمال الدرس بنفس الشخصية والملابس والكرتون.");
      } else {
        // New project, use newly invented characters
        if (data.teacherOutfit || data.cartoonCharacter) {
          setCharacterConfig(prev => ({
            ...prev,
            teacherOutfit: data.teacherOutfit || prev.teacherOutfit,
            cartoonCharacter: data.cartoonCharacter || prev.cartoonCharacter,
            previousStoryContext: "" // Reset context for new project
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
    setPrompts([]); // Clear previous prompts
    
    try {
      const allNewPrompts: VideoPrompt[] = [];
      let currentVideoCounter = 1;
      let lastContext = characterConfig.previousStoryContext || "";
      const chunkSize = 1; // Process 1 page at a time to prevent hitting Google AI's 8192 token output limit and causing JSON truncation
      
      for (let i = 0; i < contentMap.length; i += chunkSize) {
        const chunk = contentMap.slice(i, i + chunkSize);
        const isLastChunk = i + chunkSize >= contentMap.length;
        
        // Only pass isFinalScene=true if this is the actual last chunk of the loop
        const currentConfig = { ...characterConfig };
        if (currentConfig.isFinalScene && !isLastChunk) {
          currentConfig.isFinalScene = false; 
        }
        
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("contentMap", JSON.stringify(chunk));
        formData.append("characterConfig", JSON.stringify(currentConfig));
        formData.append("mode", videoMode);
        formData.append("startIndex", currentVideoCounter.toString());
        formData.append("lastContext", lastContext);
        
        const res = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          throw new Error("حدث خطأ في الإنشاء");
        }
        
        const data = await res.json();
        allNewPrompts.push(...data.prompts);
        setPrompts([...allNewPrompts]); // Progressive UI update!
        
        currentVideoCounter += data.prompts.length;
        if (data.prompts.length > 0) {
           const lastPrompt = data.prompts[data.prompts.length - 1];
           lastContext = `The last video ended with: ${lastPrompt.endContinuity}. Character state: ${lastPrompt.character}`;
        }
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إنشاء الفيديوهات. سيرفرات جوجل مزدحمة حالياً (503)، لكن ما تم إنشاؤه سيظل محفوظاً.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = (index: number) => {
    alert(`سيتم إعادة إنشاء المشهد رقم ${index + 1}... (هذه الميزة قيد التطوير)`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* الشريط الجانبي للمشاريع المحفوظة */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">مشاريعي السابقة</h2>
            {savedProjects.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">لا توجد مشاريع محفوظة بعد.</p>
            ) : (
              <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {savedProjects.map((proj) => (
                  <li 
                    key={proj.id} 
                    onClick={() => loadProject(proj)}
                    className="bg-gray-50 p-3 rounded border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors relative group"
                  >
                    <p className="font-bold text-sm text-gray-800 truncate pl-6">{proj.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{proj.date}</p>
                    <button 
                      onClick={(e) => deleteProject(proj.id, e)}
                      className="absolute left-2 top-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="حذف"
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
          <header className="mb-8 text-center bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2">PDF → Video Prompts</h1>
            <p className="text-gray-600 text-lg">
              حوّل مذكراتك إلى فيديوهات ممتعة للأطفال (10 ثوانٍ للمشهد)
            </p>
          </header>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <span className="font-bold text-gray-700 text-lg">نوع وشكل الفيديو المطلوب:</span>
            <select
              value={videoMode}
              onChange={(e) => setVideoMode(e.target.value as any)}
              className="border-2 border-blue-400 text-blue-900 font-bold rounded-lg p-3 w-full sm:w-auto bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all cursor-pointer"
            >
              <option value="cartoon">🎭 الفيلم الكرتوني (شخصيات مبتكرة وكوميديا)</option>
              <option value="teacher">👩‍🏫 وضع المعلمة (شرح احترافي بشاشات ذكية)</option>
              <option value="review">🔄 المراجعة الممتعة (مراجعة تفاعلية للوحدة)</option>
              <option value="studio">🎬 استوديو الاحتراف (تبادل بين المعلمة والكرتون)</option>
            </select>
          </div>

          <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
          
          <CharacterSettings onSettingsChange={handleSettingsChange} />
          
          {contentMap && (
            <ContentMapViewer 
              map={contentMap} 
              onGeneratePrompts={handleGeneratePrompts}
              isGenerating={isGenerating}
            />
          )}

          {prompts && (
            <div className="mt-8 flex flex-wrap justify-end gap-4">
              <input 
                type="file" 
                className="hidden" 
                ref={continueFileInputRef} 
                onChange={handleContinueLesson} 
                accept="application/pdf" 
              />
              <button
                onClick={() => continueFileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
              >
                <span className="text-xl">➕</span> إكمال الدرس (رفع صفحة جديدة بنفس الستايل)
              </button>
              <button
                onClick={saveCurrentProject}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
              >
                <span className="text-xl">💾</span> حفظ النتائج في مشاريعي
              </button>
            </div>
          )}

          {prompts && (
            <PromptResultList prompts={prompts} onRegenerate={handleRegenerate} />
          )}
        </main>
      </div>
    </div>
  );
}

