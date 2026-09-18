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
  const [isContinuing, setIsContinuing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  // ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø§Ù„Ù…Ø­ÙÙˆØ¸Ø© Ù…Ù† Ø§Ù„Ù‡Ø§Ø±Ø¯ Ø¯ÙŠØ³Ùƒ Ø¹Ù†Ø¯ ÙØªØ­ Ø§Ù„ØµÙØ­Ø©
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
    const projectName = selectedFile ? selectedFile.name : `Ù…Ø´Ø±ÙˆØ¹ ${new Date().toLocaleTimeString()}`;
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
        alert("ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ Ø¨Ù†Ø¬Ø§Ø­ ÙˆØ¥Ù„Ù‰ Ø§Ù„Ø£Ø¨Ø¯ Ø¹Ù„Ù‰ Ø§Ù„ÙƒÙ…Ø¨ÙŠÙˆØªØ±! ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„ÙŠÙ‡Ø§ ÙÙŠ Ø£ÙŠ ÙˆÙ‚Øª Ù…Ù† Ù‚Ø§Ø¦Ù…Ø© 'Ù…Ø´Ø§Ø±ÙŠØ¹ÙŠ Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©'.");
      }
    } catch (e) {
      alert("Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø­ÙØ¸ Ø¹Ù„Ù‰ Ø§Ù„Ø¬Ù‡Ø§Ø².");
    }
  };

  const loadProject = (project: SavedProject) => {
    setPrompts(project.prompts);
    if (project.config) {
      setCharacterConfig(project.config);
    }
    setContentMap(null); // Ù†Ø®ÙÙŠ Ø§Ù„Ù€ Map Ù„Ø£Ù†Ù†Ø§ Ù†Ø­Ù…Ù„ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠØ©
    alert(`ØªÙ… ØªØ­Ù…ÙŠÙ„ ${project.name}`);
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
        fileToProcess = new File([pdfBytes], `sliced_${start}_to_${end}_${originalFile.name}`, { type: "application/pdf" });
      }

      setSelectedFile(fileToProcess);
      setContentMap(null);
      setIsContinuing(isContinuing);
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
        throw new Error("ÙØ´Ù„ ÙÙŠ Ø§Ù„ØªØ­Ù„ÙŠÙ„");
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
        alert("ØªÙ… Ø±ÙØ¹ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©! Ø³ÙŠØªÙ… Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„Ø¯Ø±Ø³ Ø¨Ù†ÙØ³ Ø§Ù„Ø´Ø®ØµÙŠØ© ÙˆØ§Ù„Ù…Ù„Ø§Ø¨Ø³ ÙˆØ§Ù„ÙƒØ±ØªÙˆÙ†.");
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
      alert("Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…Ù„Ù. ØªØ£ÙƒØ¯ÙŠ Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙØªØ§Ø­ Gemini APIØŒ Ø£Ùˆ Ø¬Ø±Ø¨ÙŠ ØªØ­Ø¯ÙŠØ¯ Ø¹Ø¯Ø¯ ØµÙØ­Ø§Øª Ø£Ù‚Ù„ Ù„ØªØ¬Ù†Ø¨ Ø§Ù„Ø¶ØºØ·.");
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
          throw new Error("Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø¥Ù†Ø´Ø§Ø¡");
        }
        
        const data = await res.json();
        allNewPrompts.push(...data.prompts);
        setPrompts([...startingPrompts, ...allNewPrompts]); // Progressive UI update!
        
        currentVideoCounter += data.prompts.length;
        if (data.prompts.length > 0) {
           const lastPrompt = data.prompts[data.prompts.length - 1];
           lastContext = `The last video ended with: ${lastPrompt.endContinuity}. Character state: ${lastPrompt.character}`;
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª. Ø³ÙŠØ±ÙØ±Ø§Øª Ø¬ÙˆØ¬Ù„ Ù…Ø²Ø¯Ø­Ù…Ø© Ø­Ø§Ù„ÙŠØ§Ù‹ (503)ØŒ Ù„ÙƒÙ† Ù…Ø§ ØªÙ… Ø¥Ù†Ø´Ø§Ø¤Ù‡ Ø³ÙŠØ¸Ù„ Ù…Ø­ÙÙˆØ¸Ø§Ù‹.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = (index: number) => {
    alert(`Ø³ÙŠØªÙ… Ø¥Ø¹Ø§Ø¯Ø© Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ù…Ø´Ù‡Ø¯ Ø±Ù‚Ù… ${index + 1}... (Ù‡Ø°Ù‡ Ø§Ù„Ù…ÙŠØ²Ø© Ù‚ÙŠØ¯ Ø§Ù„ØªØ·ÙˆÙŠØ±)`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Ø§Ù„Ø´Ø±ÙŠØ· Ø§Ù„Ø¬Ø§Ù†Ø¨ÙŠ Ù„Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø§Ù„Ù…Ø­ÙÙˆØ¸Ø© */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Ù…Ø´Ø§Ø±ÙŠØ¹ÙŠ Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©</h2>
            {savedProjects.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø´Ø§Ø±ÙŠØ¹ Ù…Ø­ÙÙˆØ¸Ø© Ø¨Ø¹Ø¯.</p>
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
                      title="Ø­Ø°Ù"
                    >
                      âœ–
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ */}
        <main className="w-full lg:w-3/4">
          <header className="mb-8 text-center bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2">PDF â†’ Video Prompts</h1>
            <p className="text-gray-600 text-lg">
              Ø­ÙˆÙ‘Ù„ Ù…Ø°ÙƒØ±Ø§ØªÙƒ Ø¥Ù„Ù‰ ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª Ù…Ù…ØªØ¹Ø© Ù„Ù„Ø£Ø·ÙØ§Ù„ (10 Ø«ÙˆØ§Ù†Ù Ù„Ù„Ù…Ø´Ù‡Ø¯)
            </p>
          </header>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <span className="font-bold text-gray-700 text-lg">Ù†ÙˆØ¹ ÙˆØ´ÙƒÙ„ Ø§Ù„ÙÙŠØ¯ÙŠÙˆ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨:</span>
            <select
              value={videoMode}
              onChange={(e) => setVideoMode(e.target.value as any)}
              className="border-2 border-blue-400 text-blue-900 font-bold rounded-lg p-3 w-full sm:w-auto bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all cursor-pointer"
            >
              <option value="cartoon">ðŸŽ­ Ø§Ù„ÙÙŠÙ„Ù… Ø§Ù„ÙƒØ±ØªÙˆÙ†ÙŠ (Ø´Ø®ØµÙŠØ§Øª Ù…Ø¨ØªÙƒØ±Ø© ÙˆÙƒÙˆÙ…ÙŠØ¯ÙŠØ§)</option>
              <option value="teacher">ðŸ‘©â€ðŸ« ÙˆØ¶Ø¹ Ø§Ù„Ù…Ø¹Ù„Ù…Ø© (Ø´Ø±Ø­ Ø§Ø­ØªØ±Ø§ÙÙŠ Ø¨Ø´Ø§Ø´Ø§Øª Ø°ÙƒÙŠØ©)</option>
              <option value="review">ðŸ”„ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ù…Ù…ØªØ¹Ø© (Ù…Ø±Ø§Ø¬Ø¹Ø© ØªÙØ§Ø¹Ù„ÙŠØ© Ù„Ù„ÙˆØ­Ø¯Ø©)</option>
              <option value="studio">ðŸŽ¬ Ø§Ø³ØªÙˆØ¯ÙŠÙˆ Ø§Ù„Ø§Ø­ØªØ±Ø§Ù (ØªØ¨Ø§Ø¯Ù„ Ø¨ÙŠÙ† Ø§Ù„Ù…Ø¹Ù„Ù…Ø© ÙˆØ§Ù„ÙƒØ±ØªÙˆÙ†)</option>
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
            <div className="mt-8 flex flex-col gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">âž• Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„Ø¯Ø±Ø³ (Ø±ÙØ¹ ØµÙØ­Ø© Ø¬Ø¯ÙŠØ¯Ø© Ø¨Ù†ÙØ³ Ø§Ù„Ø³ØªØ§ÙŠÙ„)</h3>
                <p className="text-gray-700 mb-4">Ø³ØªØ­Ø§ÙØ¸ Ø§Ù„Ù…Ø¹Ù„Ù…Ø© Ø¹Ù„Ù‰ Ù†ÙØ³ Ù…Ù„Ø§Ø¨Ø³Ù‡Ø§ ÙˆØ³ÙŠØ­Ø§ÙØ¸ Ø§Ù„ÙƒØ±ØªÙˆÙ† Ø¹Ù„Ù‰ Ø´ÙƒÙ„Ù‡ Ù„Ø§Ø³ØªÙƒÙ…Ø§Ù„ Ø§Ù„Ø³Ù„Ø³Ù„Ø©. Ø­Ø¯Ø¯ÙŠ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ù‡Ù†Ø§:</p>
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
                  <span className="text-xl">ðŸ’¾</span> Ø­ÙØ¸ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ ÙÙŠ Ù…Ø´Ø§Ø±ÙŠØ¹ÙŠ
                </button>
              </div>
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


