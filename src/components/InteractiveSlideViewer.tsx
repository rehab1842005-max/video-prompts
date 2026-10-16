"use client";

import React, { useState, useEffect, useRef } from "react";

export interface PresentationLabel {
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface PresentationStep {
  stepNumber: number;
  title: string;
  category: string;
  teacherScript: string;
  keyPoints?: string[];
  scientificFact?: string;
  wasteDetails?: string;
  visualAction: string;
  particleType: "incoming_blood" | "waste_particles" | "filtering_action" | "urine_flow" | "clean_blood_return" | "generic_flow";
  activeElements?: string[];
  showFilters?: boolean;
  activeGlow?: boolean;
  labels: PresentationLabel[];
}

export interface InteractivePresentation {
  id: string;
  title: string;
  topic: string;
  diagramType: "kidneys" | "heart" | "digestive" | "respiratory" | "generic";
  steps: PresentationStep[];
}

interface Props {
  presentation: InteractivePresentation;
  onSave?: (presentation: InteractivePresentation) => void;
  onClose?: () => void;
}

export default function InteractiveSlideViewer({ presentation, onSave, onClose }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScreenRecordMode, setIsScreenRecordMode] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<SVGGElement>(null);
  const presenterWindowRef = useRef<Window | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const steps = presentation.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Initialize BroadcastChannel to sync separate Teacher Notes Window
  useEffect(() => {
    try {
      const channel = new BroadcastChannel("rehab_slide_notes");
      broadcastChannelRef.current = channel;
      return () => {
        channel.close();
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported", e);
    }
  }, []);

  // Broadcast step change to presenter window
  useEffect(() => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        stepNumber: currentStep.stepNumber,
        totalSteps: steps.length,
        title: currentStep.title,
        category: currentStep.category,
        teacherScript: currentStep.teacherScript,
        nextStepTitle: steps[currentStepIndex + 1]?.title || "نهاية العرض",
      });
    }
  }, [currentStepIndex, currentStep, steps]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setCurrentStepIndex(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Keyboard controls: Space, Arrow Left/Right, Enter, N (Notes toggle), R (Record mode toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "Enter") {
        e.preventDefault();
        nextStep();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        prevStep();
      } else if (e.key.toLowerCase() === "n") {
        setShowNotesDrawer(prev => !prev);
      } else if (e.key.toLowerCase() === "r") {
        setIsScreenRecordMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, steps.length]);

  // Dynamic particle animations (including waste in blood)
  useEffect(() => {
    const container = particlesContainerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const type = currentStep.particleType;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 30 && container.firstChild) {
        container.removeChild(container.firstChild);
      }

      if (type === "incoming_blood" || type === "waste_particles") {
        const isLeft = Math.random() > 0.5;
        const isWaste = type === "waste_particles" && Math.random() > 0.35;

        if (isWaste) {
          // Sharp Yellow/Amber Waste Crystal
          const rect = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          rect.setAttribute("points", "370,55 374,62 370,69 366,62");
          rect.setAttribute("fill", "#facc15");
          rect.setAttribute("stroke", "#ca8a04");
          rect.setAttribute("stroke-width", "1.5");
          container.appendChild(rect);

          let t = 0;
          const move = setInterval(() => {
            t += 0.05;
            let cx = 370;
            let cy = 60 + t * 300;
            if (t >= 0.5) {
              const branchT = (t - 0.5) * 2;
              const targetX = isLeft ? 240 : 560;
              cx = 370 + (targetX - 370) * branchT;
              cy = 210 + (240 - 210) * branchT;
            }
            rect.setAttribute("points", `${cx},${cy - 5} ${cx + 5},${cy} ${cx},${cy + 5} ${cx - 5},${cy}`);
            if (t >= 1) {
              clearInterval(move);
              rect.remove();
            }
          }, 30);
        } else {
          // Red Blood Cell
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", "370");
          circle.setAttribute("cy", "60");
          circle.setAttribute("r", "4");
          circle.setAttribute("fill", "#ef4444");
          circle.setAttribute("opacity", "0.95");
          container.appendChild(circle);

          let t = 0;
          const move = setInterval(() => {
            t += 0.05;
            if (t < 0.5) {
              circle.setAttribute("cy", (60 + t * 300).toString());
            } else {
              const branchT = (t - 0.5) * 2;
              const targetX = isLeft ? 240 : 560;
              circle.setAttribute("cx", (370 + (targetX - 370) * branchT).toString());
              circle.setAttribute("cy", (210 + (240 - 210) * branchT).toString());
            }
            if (t >= 1) {
              clearInterval(move);
              circle.remove();
            }
          }, 30);
        }
      } else if (type === "filtering_action") {
        const isLeft = Math.random() > 0.5;
        const kX = isLeft ? 220 + (Math.random() * 40 - 20) : 580 + (Math.random() * 40 - 20);
        const kY = 240 + (Math.random() * 60 - 30);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", kX.toString());
        circle.setAttribute("cy", kY.toString());
        circle.setAttribute("r", "4.5");
        circle.setAttribute("fill", Math.random() > 0.5 ? "#fbbf24" : "#38bdf8");
        container.appendChild(circle);
        setTimeout(() => circle.remove(), 1200);
      } else if (type === "urine_flow") {
        const isLeft = Math.random() > 0.5;
        const startX = isLeft ? 245 : 555;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", startX.toString());
        circle.setAttribute("cy", "280");
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "#facc15");
        circle.setAttribute("stroke", "#ca8a04");
        circle.setAttribute("stroke-width", "1.5");
        container.appendChild(circle);

        let t = 0;
        const move = setInterval(() => {
          t += 0.04;
          const curX = startX + ((isLeft ? 370 : 430) - startX) * t;
          const curY = 280 + (430 - 280) * t;
          circle.setAttribute("cx", curX.toString());
          circle.setAttribute("cy", curY.toString());
          if (t >= 1) {
            clearInterval(move);
            circle.remove();
          }
        }, 30);
      } else if (type === "clean_blood_return") {
        const isLeft = Math.random() > 0.5;
        const startX = isLeft ? 270 : 530;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", startX.toString());
        circle.setAttribute("cy", "240");
        circle.setAttribute("r", "4.5");
        circle.setAttribute("fill", "#38bdf8");
        container.appendChild(circle);

        let t = 0;
        const move = setInterval(() => {
          t += 0.04;
          if (t < 0.5) {
            const curX = startX + (430 - startX) * (t * 2);
            circle.setAttribute("cx", curX.toString());
          } else {
            circle.setAttribute("cx", "430");
            circle.setAttribute("cy", (240 - (t - 0.5) * 400).toString());
          }
          if (t >= 1) {
            clearInterval(move);
            circle.remove();
          }
        }, 30);
      }
    }, 170);

    return () => clearInterval(interval);
  }, [currentStepIndex, currentStep.particleType]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Open Synced Presenter Notes in a separate popup window
  const openPresenterNotesWindow = () => {
    const popup = window.open("", "RehabPresenterNotes", "width=520,height=650,left=50,top=50");
    if (popup) {
      presenterWindowRef.current = popup;
      popup.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>🎙️ ملاحظات المعلمة (المُلقن الصوتي الخفي)</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-900 text-slate-100 p-6 font-sans select-none flex flex-col justify-between min-h-screen">
          <div>
            <div class="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <div>
                <span class="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-full">
                  شاشة المحاضر المستقلة (لا تظهر للطلاب)
                </span>
                <h1 class="text-lg font-black text-white mt-1">نافذة التلقين الصوتي لمس رحاب</h1>
              </div>
              <span id="step-badge" class="bg-blue-600/40 text-blue-300 font-bold text-sm px-3 py-1 rounded-full border border-blue-500">
                الخطوة ${currentStep.stepNumber} من ${steps.length}
              </span>
            </div>

            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <span class="text-xs text-teal-400 font-bold" id="category">المرحلة: ${currentStep.category}</span>
              <h2 id="title" class="text-xl font-black text-white mt-0.5">${currentStep.title}</h2>
            </div>

            <div class="bg-blue-950/80 border-2 border-blue-600/60 rounded-2xl p-5 shadow-2xl">
              <span class="text-xs font-bold text-blue-300 flex items-center gap-1.5 mb-2">
                🎙️ قولي للطلاب بصوتك الآن:
              </span>
              <p id="script" class="text-lg text-slate-100 font-bold leading-relaxed">
                "${currentStep.teacherScript}"
              </p>
            </div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4 flex justify-between items-center">
            <span>الخطوة القادمة: <b id="next-title" class="text-slate-200">${steps[currentStepIndex + 1]?.title || "نهاية العرض"}</b></span>
            <span class="text-teal-400">متزامنة تلقائياً مع الكليك ✅</span>
          </div>

          <script>
            const channel = new BroadcastChannel("rehab_slide_notes");
            channel.onmessage = (e) => {
              const data = e.data;
              document.getElementById("step-badge").textContent = "الخطوة " + data.stepNumber + " من " + data.totalSteps;
              document.getElementById("category").textContent = "المرحلة: " + data.category;
              document.getElementById("title").textContent = data.title;
              document.getElementById("script").textContent = '"' + data.teacherScript + '"';
              document.getElementById("next-title").textContent = data.nextStepTitle;
            };
          </script>
        </body>
        </html>
      `);
      popup.document.close();
    }
  };

  const exportStandaloneHTML = () => {
    const html = generateFullStandaloneHtml(presentation);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `عرض_باوربوينت_تفاعلي_${presentation.title.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    alert("🎉 تم تحميل ملف الباوربوينت التفاعلي بنجاح! يعمل بدون نت، ويحتوي على وضع تصوير الشاشة ونافذة الملاحظات المنفصلة.");
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-950 text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 flex flex-col gap-4 max-w-6xl mx-auto my-4 select-none font-sans relative ${
        isFullscreen ? "w-screen h-screen rounded-none max-w-none p-4" : ""
      }`}
      dir="rtl"
    >
      {/* Top Header / Control Toolbar */}
      <header className="flex flex-wrap justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl px-5 py-3 shadow-lg gap-3">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-md font-bold">
                عرض باوربوينت تفاعلي
              </span>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                {presentation.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              كليك لكل حركة بالماوس أو المسطرة (Space) - النقاط العلمية مكتوبة على الشريحة
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Screen Recording Mode Toggle */}
          <button
            onClick={() => setIsScreenRecordMode(prev => !prev)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 font-bold ${
              isScreenRecordMode
                ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-600/30 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title="إخفاء كلام المعلمة من الشاشة الموجهة للطلاب لتسجيل فيديو شاشة احترافي بدون نصوص مكررة"
          >
            <span>📹</span>
            <span>{isScreenRecordMode ? "وضع تسجيل الشاشة (مُفعّل)" : "وضع تسجيل الشاشة"}</span>
          </button>

          {/* Open Separate Presenter Window */}
          <button
            onClick={openPresenterNotesWindow}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-xl border border-indigo-500 shadow transition flex items-center gap-1.5 font-bold"
            title="فتح نافذة منفصلة تعرض كلام المعلمة متزامناً مع الكليك، لتضعيها على شاشة ثانية أثناء تسجيل الشاشة"
          >
            <span>🎙️</span> نافذة ملاحظاتي (منفصلة)
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1 font-bold"
            title="ملء الشاشة"
          >
            <span>🖥️</span> {isFullscreen ? "تصغير" : "ملء الشاشة"}
          </button>

          {/* Download Standalone HTML */}
          <button
            onClick={exportStandaloneHTML}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs px-3 py-1.5 rounded-xl shadow transition flex items-center gap-1 font-bold"
            title="تحميل كملف باوربوينت تفاعلي مستقل يعمل بدون إنترنت"
          >
            <span>📥</span> تحميل HTML
          </button>

          {onSave && (
            <button
              onClick={() => onSave(presentation)}
              className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-xl shadow transition font-bold"
            >
              💾 حفظ
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs px-2.5 py-1.5 rounded-xl transition font-bold"
            >
              ✖
            </button>
          )}
        </div>
      </header>

      {/* Teacher Speaking Cue Banner (Hidden when Screen Recording Mode is active) */}
      {!isScreenRecordMode && (
        <div className="bg-blue-950/70 border border-blue-800/60 rounded-2xl p-3.5 shadow-inner flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-all">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🎙️</span>
              <span className="text-xs font-bold text-blue-300">
                ماذا تقولين للطلاب في هذا الكليك (شرح صوتي مباشر):
              </span>
              <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded">
                (يمكنك إخفاؤه بالضغط على زر "وضع تسجيل الشاشة")
              </span>
            </div>
            <p className="text-slate-100 text-sm font-semibold leading-relaxed">
              "{currentStep.teacherScript}"
            </p>
          </div>
          <button
            onClick={() => setIsScreenRecordMode(true)}
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap"
          >
            👁️ إخفاء من الشريحة
          </button>
        </div>
      )}

      {/* Main Presentation Stage (16:9 Educational Canvas) */}
      <div 
        onClick={nextStep}
        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-800 hover:border-blue-500/50 transition-all p-3 sm:p-5 cursor-pointer overflow-hidden flex-1 min-h-[500px] shadow-2xl flex flex-col justify-between group"
        title="اضغط في أي مكان أو اضغط المسطرة (Space) للحركة التالية"
      >
        {/* Step Header on Slide */}
        <div className="flex justify-between items-center z-10 bg-slate-950/70 backdrop-blur border border-slate-800/80 px-4 py-2.5 rounded-xl">
          <div>
            <span className="text-xs font-bold text-teal-400">
              المرحلة {currentStep.stepNumber} من {steps.length}: {currentStep.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {currentStep.title}
            </h3>
          </div>
          <span className="bg-blue-600/40 text-blue-200 border border-blue-500/50 text-xs font-bold px-3 py-1 rounded-full">
            كليك {currentStep.stepNumber}
          </span>
        </div>

        {/* Central Display: SVG Visual + Written Key Points Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-auto py-2 z-10">
          
          {/* Left/Center: Visual Anatomical SVG Stage */}
          <div className="lg:col-span-8 relative flex items-center justify-center">
            <svg viewBox="0 0 800 500" className="w-full h-full max-h-[440px] drop-shadow-2xl">
              <defs>
                <linearGradient id="arteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <linearGradient id="veinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="ureterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
                <radialGradient id="kidneyGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
                </radialGradient>
                <filter id="pulseGlow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Kidneys Anatomical SVG */}
              <g>
                {/* Silhouette */}
                <path 
                  d="M 280 40 Q 400 20 520 40 Q 560 250 540 480 Q 400 490 260 480 Q 240 250 280 40 Z" 
                  fill="rgba(30, 41, 59, 0.2)" 
                  stroke="rgba(71, 85, 105, 0.35)" 
                  strokeDasharray="6,6" 
                  strokeWidth="2"
                />

                {/* Artery & Vein */}
                <path d="M 370 30 L 370 480" stroke="url(#arteryGrad)" strokeWidth="22" strokeLinecap="round"/>
                <path d="M 370 210 Q 320 210 270 230" fill="none" stroke="url(#arteryGrad)" strokeWidth="14" strokeLinecap="round"/>
                <path d="M 370 210 Q 450 210 530 230" fill="none" stroke="url(#arteryGrad)" strokeWidth="14" strokeLinecap="round"/>

                <path d="M 430 30 L 430 480" stroke="url(#veinGrad)" strokeWidth="20" strokeLinecap="round"/>
                <path d="M 270 250 Q 350 250 430 240" fill="none" stroke="url(#veinGrad)" strokeWidth="12" strokeLinecap="round"/>
                <path d="M 530 250 Q 480 250 430 240" fill="none" stroke="url(#veinGrad)" strokeWidth="12" strokeLinecap="round"/>

                {/* Ureters & Bladder */}
                <path d="M 245 280 Q 280 380 370 430" fill="none" stroke="url(#ureterGrad)" strokeWidth="10" strokeLinecap="round"/>
                <path d="M 555 280 Q 520 380 430 430" fill="none" stroke="url(#ureterGrad)" strokeWidth="10" strokeLinecap="round"/>
                <ellipse cx="400" cy="445" rx="50" ry="32" fill="#ca8a04" opacity="0.85" stroke="#facc15" strokeWidth="3"/>

                {/* Left Kidney */}
                <g className="transition-all duration-500">
                  <path 
                    d="M 250 150 C 190 150 170 210 170 250 C 170 310 200 350 250 350 C 280 350 285 300 270 260 C 260 230 270 190 280 170 C 275 155 260 150 250 150 Z" 
                    fill="url(#kidneyGlow)" 
                    stroke="#f87171" 
                    strokeWidth="4"
                    filter={currentStep.activeGlow ? "url(#pulseGlow)" : undefined}
                  />
                  <g opacity={currentStep.showFilters ? "1" : "0"} className="transition-opacity duration-700">
                    <circle cx="210" cy="230" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="230" cy="270" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="215" cy="300" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" strokeWidth="1.5"/>
                    <text x="210" y="234" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                    <text x="230" y="274" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                    <text x="215" y="304" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                  </g>
                  <circle cx="215" cy="200" r="6" fill="#fff"/>
                  <circle cx="216" cy="200" r="3" fill="#000"/>
                  <circle cx="240" cy="200" r="6" fill="#fff"/>
                  <circle cx="241" cy="200" r="3" fill="#000"/>
                  <path d="M 220 215 Q 228 225 236 215" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </g>

                {/* Right Kidney */}
                <g className="transition-all duration-500">
                  <path 
                    d="M 550 150 C 610 150 630 210 630 250 C 630 310 600 350 550 350 C 520 350 515 300 530 260 C 540 230 530 190 520 170 C 525 155 540 150 550 150 Z" 
                    fill="url(#kidneyGlow)" 
                    stroke="#f87171" 
                    strokeWidth="4"
                    filter={currentStep.activeGlow ? "url(#pulseGlow)" : undefined}
                  />
                  <g opacity={currentStep.showFilters ? "1" : "0"} className="transition-opacity duration-700">
                    <circle cx="590" cy="230" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="570" cy="270" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="585" cy="300" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" strokeWidth="1.5"/>
                    <text x="590" y="234" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                    <text x="570" y="274" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                    <text x="585" y="304" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                  </g>
                  <circle cx="585" cy="200" r="6" fill="#fff"/>
                  <circle cx="584" cy="200" r="3" fill="#000"/>
                  <circle cx="560" cy="200" r="6" fill="#fff"/>
                  <circle cx="559" cy="200" r="3" fill="#000"/>
                  <path d="M 564 215 Q 572 225 580 215" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </g>

                {/* Waste Zoom Callout Box during Step 2 & 3 */}
                {(currentStep.stepNumber === 2 || currentStep.stepNumber === 3) && (
                  <g className="animate-pulse">
                    <rect x="270" y="40" width="260" height="42" rx="12" fill="rgba(15, 23, 42, 0.95)" stroke="#facc15" strokeWidth="2"/>
                    <circle cx="285" cy="61" r="5" fill="#ef4444"/>
                    <text x="330" y="65" fill="#f87171" fontSize="11" fontWeight="bold">كرات دم حمراء</text>
                    <polygon points="380,56 385,61 380,66 375,61" fill="#facc15" stroke="#ca8a04"/>
                    <text x="445" y="65" fill="#facc15" fontSize="11" fontWeight="bold">جزيئات فضلات (يوريا/أملاح)</text>
                  </g>
                )}
              </g>

              {/* Dynamic Animated Particles Container */}
              <g ref={particlesContainerRef}></g>

              {/* Floating Labels */}
              {currentStep.labels.map((lbl, idx) => {
                const padding = 14;
                const textLen = lbl.text.length * 8.5 + padding * 2;
                return (
                  <g key={idx}>
                    <rect 
                      x={lbl.x - textLen / 2} 
                      y={lbl.y - 18} 
                      width={textLen} 
                      height={28} 
                      rx="14" 
                      fill="rgba(15, 23, 42, 0.92)" 
                      stroke={lbl.color} 
                      strokeWidth="2"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                    />
                    <text 
                      x={lbl.x} 
                      y={lbl.y + 1} 
                      fill={lbl.color} 
                      fontSize="12" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      {lbl.text}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right: Written Key Points & Scientific Facts (Real PowerPoint Slide Content) */}
          <div className="lg:col-span-4 bg-slate-900/95 border-2 border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3 backdrop-blur">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📝</span> نقاط الشرح المكتوبة للطلاب:
              </span>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-2.5 text-sm text-slate-200">
              {(currentStep.keyPoints || [currentStep.visualAction]).map((pt, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-teal-400 font-bold mt-0.5">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Scientific Golden Fact */}
            {currentStep.scientificFact && (
              <div className="mt-2 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-600/40 rounded-xl p-3">
                <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                  💡 معلومة علمية ذهبية:
                </span>
                <p className="text-xs text-amber-100/90 mt-1 leading-relaxed font-medium">
                  {currentStep.scientificFact}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Prompt on Slide */}
        <div className="z-10 flex justify-between items-center bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="animate-bounce">👆</span>
            <span>اضغطي في أي مكان أو المسطرة (Space) للحركة التالية</span>
          </span>
          <span className="hidden sm:inline text-slate-500">
            اختصار الملاحظات: حرف N | اختصار وضع التسجيل: حرف R
          </span>
        </div>
      </div>

      {/* Presentation Timeline & Navigation Bar */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg">
        {/* Step dots */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xl w-full">
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => setCurrentStepIndex(i)}
              className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                i === currentStepIndex
                  ? "bg-gradient-to-r from-teal-400 to-blue-500 scale-y-125 shadow-md shadow-blue-500/50"
                  : i < currentStepIndex
                  ? "bg-teal-700/80 hover:bg-teal-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
              title={`الانتقال إلى خطوة ${i + 1}: ${st.title}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center gap-1 ${
              currentStepIndex === 0
                ? "bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <span>السابق</span> ➡️
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-600/30 text-xs sm:text-sm transition transform hover:scale-105 flex items-center gap-1.5"
          >
            ⬅️ <span>التالي (كليك)</span>
          </button>
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 transition"
            title="إعادة العرض من البداية"
          >
            🔄 البداية
          </button>
        </div>
      </footer>
    </div>
  );
}

// Standalone HTML Exporter with Screen Record Mode & Synced Presenter Window
function generateFullStandaloneHtml(presentation: InteractivePresentation): string {
  const stepsJson = JSON.stringify(presentation.steps);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عرض باوربوينت تفاعلي: ${presentation.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse-glow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6)); }
      50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.95)); }
    }
    .active-glow { animation: pulse-glow 2s infinite ease-in-out; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between p-4 select-none font-sans">
  <header class="w-full max-w-6xl mx-auto flex flex-wrap justify-between items-center bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 shadow-xl gap-3">
    <div>
      <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
        ${presentation.title}
      </h1>
      <p class="text-xs text-slate-400">عرض تفاعلي كليك لكل حركة - إعداد: Sci.Rehab Elsibai</p>
    </div>
    <div class="flex items-center gap-2">
      <button id="record-mode-btn" onclick="toggleRecordMode()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 font-bold transition flex items-center gap-1">
        <span>📹</span> وضع تسجيل الشاشة
      </button>
      <button onclick="openPresenterNotes()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-xl border border-indigo-500 font-bold transition flex items-center gap-1">
        <span>🎙️</span> نافذة ملاحظاتي (منفصلة)
      </button>
      <button onclick="toggleFullscreen()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 font-bold transition">
        🖥️ ملء الشاشة
      </button>
    </div>
  </header>

  <div id="teacher-notes-banner" class="w-full max-w-6xl mx-auto my-3 bg-blue-950/70 border border-blue-800/60 rounded-2xl p-3 shadow-inner flex justify-between items-center gap-3">
    <div>
      <span class="text-xs font-bold text-blue-300">🎙️ ماذا تقولين للطلاب في هذا الكليك (شرح صوتي مباشر):</span>
      <p id="teacher-script" class="text-slate-100 text-sm font-semibold mt-0.5"></p>
    </div>
    <button onclick="toggleRecordMode()" class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">👁️ إخفاء</button>
  </div>

  <main class="w-full max-w-6xl mx-auto my-auto flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative cursor-pointer" onclick="nextStep()">
    <div class="flex justify-between items-center bg-slate-950/70 border border-slate-800/80 px-4 py-2.5 rounded-xl mb-3">
      <div>
        <span id="step-category" class="text-xs font-bold text-teal-400"></span>
        <h2 id="step-title" class="text-xl sm:text-2xl font-black text-white"></h2>
      </div>
      <span id="step-badge" class="bg-blue-600/40 text-blue-200 border border-blue-500/50 text-xs font-bold px-3 py-1 rounded-full"></span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-auto">
      <div class="lg:col-span-8 flex items-center justify-center">
        <svg id="stage-svg" viewBox="0 0 800 500" class="w-full h-full max-h-[440px] drop-shadow-2xl">
          <defs>
            <linearGradient id="arteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ef4444" />
              <stop offset="100%" stop-color="#b91c1c" />
            </linearGradient>
            <linearGradient id="veinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#1d4ed8" />
            </linearGradient>
            <linearGradient id="ureterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
            <radialGradient id="kidneyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f87171" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#991b1b" stop-opacity="1" />
            </radialGradient>
          </defs>

          <path d="M 280 40 Q 400 20 520 40 Q 560 250 540 480 Q 400 490 260 480 Q 240 250 280 40 Z" fill="rgba(30, 41, 59, 0.2)" stroke="rgba(71, 85, 105, 0.35)" stroke-dasharray="6,6" stroke-width="2"/>
          <path id="main-artery" d="M 370 30 L 370 480" stroke="url(#arteryGrad)" stroke-width="22" stroke-linecap="round"/>
          <path d="M 370 210 Q 320 210 270 230" fill="none" stroke="url(#arteryGrad)" stroke-width="14" stroke-linecap="round"/>
          <path d="M 370 210 Q 450 210 530 230" fill="none" stroke="url(#arteryGrad)" stroke-width="14" stroke-linecap="round"/>
          <path id="main-vein" d="M 430 30 L 430 480" stroke="url(#veinGrad)" stroke-width="20" stroke-linecap="round"/>
          <path d="M 270 250 Q 350 250 430 240" fill="none" stroke="url(#veinGrad)" stroke-width="12" stroke-linecap="round"/>
          <path d="M 530 250 Q 480 250 430 240" fill="none" stroke="url(#veinGrad)" stroke-width="12" stroke-linecap="round"/>
          <path d="M 245 280 Q 280 380 370 430" fill="none" stroke="url(#ureterGrad)" stroke-width="10" stroke-linecap="round"/>
          <path d="M 555 280 Q 520 380 430 430" fill="none" stroke="url(#ureterGrad)" stroke-width="10" stroke-linecap="round"/>
          <ellipse cx="400" cy="445" rx="50" ry="32" fill="#ca8a04" opacity="0.85" stroke="#facc15" stroke-width="3"/>

          <g id="kidney-left" class="transition-all duration-500">
            <path d="M 250 150 C 190 150 170 210 170 250 C 170 310 200 350 250 350 C 280 350 285 300 270 260 C 260 230 270 190 280 170 C 275 155 260 150 250 150 Z" fill="url(#kidneyGlow)" stroke="#f87171" stroke-width="4"/>
            <g id="filters-left" opacity="0" class="transition-opacity duration-700">
              <circle cx="210" cy="230" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" stroke-width="1.5"/>
              <circle cx="230" cy="270" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" stroke-width="1.5"/>
              <circle cx="215" cy="300" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" stroke-width="1.5"/>
              <text x="210" y="234" font-size="10" fill="#000" text-anchor="middle" font-weight="bold">فلتر</text>
              <text x="230" y="274" font-size="10" fill="#000" text-anchor="middle" font-weight="bold">فلتر</text>
              <text x="215" y="304" font-size="10" fill="#000" text-anchor="middle" font-weight="bold">فلتر</text>
            </g>
            <circle cx="215" cy="200" r="6" fill="#fff"/>
            <circle cx="216" cy="200" r="3" fill="#000"/>
            <circle cx="240" cy="200" r="6" fill="#fff"/>
            <circle cx="241" cy="200" r="3" fill="#000"/>
            <path d="M 220 215 Q 228 225 236 215" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          </g>

          <g id="kidney-right" class="transition-all duration-500">
            <path d="M 550 150 C 610 150 630 210 630 250 C 630 310 600 350 550 350 C 520 350 515 300 530 260 C 540 230 530 190 520 170 C 525 155 540 150 550 150 Z" fill="url(#kidneyGlow)" stroke="#f87171" stroke-width="4"/>
            <g id="filters-right" opacity="0" class="transition-opacity duration-700">
              <circle cx="590" cy="230" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" stroke-width="1.5"/>
              <circle cx="570" cy="270" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" stroke-width="1.5"/>
              <circle cx="585" cy="300" r="14" fill="#fbbf24" opacity="0.9" stroke="#fff" stroke-width="1.5"/>
              <text x="590" y="234" font-size="10" fill="#000" text-anchor="middle" font-weight="bold">فلتر</text>
              <text x="570" y="274" font-size="10" fill="#000" text-anchor="middle" font-weight="bold">فلتر</text>
              <text x="585" y="304" font-size="10" fill="#000" text-anchor="middle" font-weight="bold">فلتر</text>
            </g>
            <circle cx="585" cy="200" r="6" fill="#fff"/>
            <circle cx="584" cy="200" r="3" fill="#000"/>
            <circle cx="560" cy="200" r="6" fill="#fff"/>
            <circle cx="559" cy="200" r="3" fill="#000"/>
            <path d="M 564 215 Q 572 225 580 215" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          </g>

          <g id="waste-callout"></g>
          <g id="particles-container"></g>
          <g id="labels-layer"></g>
        </svg>
      </div>

      <div class="lg:col-span-4 bg-slate-900/95 border-2 border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
        <span class="text-xs font-bold text-teal-400 border-b border-slate-800 pb-2">📝 نقاط الشرح المكتوبة للطلاب:</span>
        <ul id="key-points-list" class="space-y-2 text-sm text-slate-200"></ul>
        <div id="fact-box" class="mt-2 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-600/40 rounded-xl p-3">
          <span class="text-[11px] font-black text-amber-400">💡 معلومة علمية ذهبية:</span>
          <p id="fact-text" class="text-xs text-amber-100/90 mt-1"></p>
        </div>
      </div>
    </div>
  </main>

  <footer class="w-full max-w-6xl mx-auto mt-3 flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
    <div id="prog-bar" class="flex items-center gap-1.5 flex-1 max-w-xl"></div>
    <div class="flex items-center gap-2">
      <button onclick="prevStep()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl border border-slate-700 text-sm">السابق ➡️</button>
      <button onclick="nextStep()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl text-sm shadow-lg shadow-blue-600/30">⬅️ التالي (كليك)</button>
    </div>
  </footer>

  <script>
    const steps = ${stepsJson};
    let currentStepIndex = 0;
    let animInterval = null;
    let isRecordMode = false;
    const notesChannel = new BroadcastChannel("rehab_slide_notes");

    function renderStep() {
      const step = steps[currentStepIndex];
      document.getElementById("step-badge").textContent = "كليك " + step.stepNumber;
      document.getElementById("step-title").textContent = step.title;
      document.getElementById("step-category").textContent = "المرحلة " + step.stepNumber + " من " + steps.length + ": " + step.category;
      document.getElementById("teacher-script").textContent = '"' + step.teacherScript + '"';

      const progContainer = document.getElementById("prog-bar");
      progContainer.innerHTML = "";
      steps.forEach((_, idx) => {
        const div = document.createElement("div");
        div.className = "h-2.5 flex-1 rounded-full transition-all " + (idx <= currentStepIndex ? "bg-gradient-to-r from-teal-400 to-blue-500" : "bg-slate-800");
        progContainer.appendChild(div);
      });

      const kpList = document.getElementById("key-points-list");
      kpList.innerHTML = "";
      (step.keyPoints || [step.visualAction]).forEach(pt => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-2 leading-relaxed";
        li.innerHTML = '<span class="text-teal-400 font-bold">•</span><span>' + pt + '</span>';
        kpList.appendChild(li);
      });

      const factBox = document.getElementById("fact-box");
      if (step.scientificFact) {
        factBox.style.display = "block";
        document.getElementById("fact-text").textContent = step.scientificFact;
      } else {
        factBox.style.display = "none";
      }

      const fl = document.getElementById("filters-left");
      const fr = document.getElementById("filters-right");
      if (fl && fr) {
        fl.setAttribute("opacity", step.showFilters ? "1" : "0");
        fr.setAttribute("opacity", step.showFilters ? "1" : "0");
      }

      const kl = document.getElementById("kidney-left");
      const kr = document.getElementById("kidney-right");
      if (kl && kr) {
        if (step.activeGlow) {
          kl.classList.add("active-glow");
          kr.classList.add("active-glow");
        } else {
          kl.classList.remove("active-glow");
          kr.classList.remove("active-glow");
        }
      }

      const wasteCallout = document.getElementById("waste-callout");
      wasteCallout.innerHTML = "";
      if (step.stepNumber === 2 || step.stepNumber === 3) {
        wasteCallout.innerHTML = '<rect x="270" y="40" width="260" height="42" rx="12" fill="rgba(15, 23, 42, 0.95)" stroke="#facc15" stroke-width="2"/><circle cx="285" cy="61" r="5" fill="#ef4444"/><text x="330" y="65" fill="#f87171" font-size="11" font-weight="bold">كرات دم حمراء</text><polygon points="380,56 385,61 380,66 375,61" fill="#facc15" stroke="#ca8a04"/><text x="445" y="65" fill="#facc15" font-size="11" font-weight="bold">جزيئات فضلات (يوريا/أملاح)</text>';
      }

      const labelsLayer = document.getElementById("labels-layer");
      labelsLayer.innerHTML = "";
      (step.labels || []).forEach(lbl => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const padding = 12;
        const textLen = lbl.text.length * 8.5 + padding * 2;
        rect.setAttribute("x", lbl.x - textLen / 2);
        rect.setAttribute("y", lbl.y - 18);
        rect.setAttribute("width", textLen);
        rect.setAttribute("height", 28);
        rect.setAttribute("rx", "14");
        rect.setAttribute("fill", "rgba(15, 23, 42, 0.92)");
        rect.setAttribute("stroke", lbl.color);
        rect.setAttribute("stroke-width", "2");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", lbl.x);
        text.setAttribute("y", lbl.y + 1);
        text.setAttribute("fill", lbl.color);
        text.setAttribute("font-size", "12");
        text.setAttribute("font-weight", "bold");
        text.setAttribute("text-anchor", "middle");
        text.textContent = lbl.text;

        g.appendChild(rect);
        g.appendChild(text);
        labelsLayer.appendChild(g);
      });

      spawnParticles(step.particleType);

      notesChannel.postMessage({
        stepNumber: step.stepNumber,
        totalSteps: steps.length,
        title: step.title,
        category: step.category,
        teacherScript: step.teacherScript,
        nextStepTitle: steps[currentStepIndex + 1]?.title || "نهاية العرض"
      });
    }

    function spawnParticles(type) {
      if (animInterval) clearInterval(animInterval);
      const container = document.getElementById("particles-container");
      container.innerHTML = "";
      let count = 0;
      animInterval = setInterval(() => {
        count++;
        if (count > 25 && container.firstChild) container.removeChild(container.firstChild);

        if (type === "incoming_blood" || type === "waste_particles") {
          const isLeft = Math.random() > 0.5;
          const isWaste = (type === "waste_particles") && (Math.random() > 0.35);

          if (isWaste) {
            const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            poly.setAttribute("points", "370,55 374,62 370,69 366,62");
            poly.setAttribute("fill", "#facc15");
            poly.setAttribute("stroke", "#ca8a04");
            container.appendChild(poly);
            let t = 0;
            const move = setInterval(() => {
              t += 0.05;
              let cx = 370;
              let cy = 60 + t * 300;
              if (t >= 0.5) {
                const branchT = (t - 0.5) * 2;
                const targetX = isLeft ? 240 : 560;
                cx = 370 + (targetX - 370) * branchT;
                cy = 210 + (240 - 210) * branchT;
              }
              poly.setAttribute("points", cx + "," + (cy-5) + " " + (cx+5) + "," + cy + " " + cx + "," + (cy+5) + " " + (cx-5) + "," + cy);
              if (t >= 1) { clearInterval(move); poly.remove(); }
            }, 30);
          } else {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", "370");
            circle.setAttribute("cy", "60");
            circle.setAttribute("r", "4");
            circle.setAttribute("fill", "#ef4444");
            container.appendChild(circle);
            let t = 0;
            const move = setInterval(() => {
              t += 0.05;
              if (t < 0.5) circle.setAttribute("cy", 60 + t * 300);
              else {
                const branchT = (t - 0.5) * 2;
                const targetX = isLeft ? 240 : 560;
                circle.setAttribute("cx", 370 + (targetX - 370) * branchT);
                circle.setAttribute("cy", 210 + (240 - 210) * branchT);
              }
              if (t >= 1) { clearInterval(move); circle.remove(); }
            }, 30);
          }
        } else if (type === "filtering_action") {
          const isLeft = Math.random() > 0.5;
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", isLeft ? 220 + (Math.random()*40-20) : 580 + (Math.random()*40-20));
          circle.setAttribute("cy", 240 + (Math.random()*60-30));
          circle.setAttribute("r", "4.5");
          circle.setAttribute("fill", Math.random() > 0.5 ? "#fbbf24" : "#38bdf8");
          container.appendChild(circle);
          setTimeout(() => circle.remove(), 1200);
        } else if (type === "urine_flow") {
          const isLeft = Math.random() > 0.5;
          const startX = isLeft ? 245 : 555;
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", startX);
          circle.setAttribute("cy", "280");
          circle.setAttribute("r", "5");
          circle.setAttribute("fill", "#facc15");
          container.appendChild(circle);
          let t = 0;
          const move = setInterval(() => {
            t += 0.04;
            circle.setAttribute("cx", startX + ((isLeft ? 370 : 430) - startX) * t);
            circle.setAttribute("cy", 280 + (430 - 280) * t);
            if (t >= 1) { clearInterval(move); circle.remove(); }
          }, 30);
        } else if (type === "clean_blood_return") {
          const isLeft = Math.random() > 0.5;
          const startX = isLeft ? 270 : 530;
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", startX);
          circle.setAttribute("cy", "240");
          circle.setAttribute("r", "4.5");
          circle.setAttribute("fill", "#38bdf8");
          container.appendChild(circle);
          let t = 0;
          const move = setInterval(() => {
            t += 0.04;
            if (t < 0.5) circle.setAttribute("cx", startX + (430 - startX) * (t * 2));
            else { circle.setAttribute("cx", "430"); circle.setAttribute("cy", 240 - (t - 0.5) * 400); }
            if (t >= 1) { clearInterval(move); circle.remove(); }
          }, 30);
        }
      }, 170);
    }

    function toggleRecordMode() {
      isRecordMode = !isRecordMode;
      const banner = document.getElementById("teacher-notes-banner");
      const btn = document.getElementById("record-mode-btn");
      if (isRecordMode) {
        banner.style.display = "none";
        btn.className = "bg-rose-600 text-white text-xs px-3 py-1.5 rounded-xl border border-rose-500 font-bold transition flex items-center gap-1 animate-pulse";
        btn.innerHTML = "<span>📹</span> وضع تسجيل الشاشة (مُفعّل)";
      } else {
        banner.style.display = "flex";
        btn.className = "bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 font-bold transition flex items-center gap-1";
        btn.innerHTML = "<span>📹</span> وضع تسجيل الشاشة";
      }
    }

    function openPresenterNotes() {
      const popup = window.open("", "PresenterNotesWin", "width=520,height=650,left=50,top=50");
      if (popup) {
        popup.document.write(\`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>🎙️ ملاحظات المعلمة (شاشة المحاضر)</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 p-6 font-sans select-none flex flex-col justify-between min-h-screen">
  <div>
    <div class="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
      <span class="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full">شاشة المعلمة الخفية</span>
      <span id="p-badge" class="bg-blue-600/40 text-blue-300 font-bold text-sm px-3 py-1 rounded-full"></span>
    </div>
    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
      <span id="p-cat" class="text-xs text-teal-400 font-bold"></span>
      <h2 id="p-title" class="text-xl font-black text-white mt-0.5"></h2>
    </div>
    <div class="bg-blue-950/80 border-2 border-blue-600/60 rounded-2xl p-5 shadow-2xl">
      <span class="text-xs font-bold text-blue-300 mb-2 block">🎙️ قولي للطلاب بصوتك الآن:</span>
      <p id="p-script" class="text-lg text-slate-100 font-bold leading-relaxed"></p>
    </div>
  </div>
  <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4 flex justify-between">
    <span>الخطوة التالية: <b id="p-next" class="text-slate-200"></b></span>
    <span class="text-teal-400">متزامنة ✅</span>
  </div>
  <script>
    const ch = new BroadcastChannel("rehab_slide_notes");
    ch.onmessage = (e) => {
      const d = e.data;
      document.getElementById("p-badge").textContent = "الخطوة " + d.stepNumber + " من " + d.totalSteps;
      document.getElementById("p-cat").textContent = "المرحلة: " + d.category;
      document.getElementById("p-title").textContent = d.title;
      document.getElementById("p-script").textContent = '"' + d.teacherScript + '"';
      document.getElementById("p-next").textContent = d.nextStepTitle;
    };
  <\/script>
</body>
</html>\`);
        popup.document.close();
      }
    }

    function nextStep() {
      currentStepIndex = (currentStepIndex + 1) % steps.length;
      renderStep();
    }

    function prevStep() {
      if (currentStepIndex > 0) { currentStepIndex--; renderStep(); }
    }

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "Enter") {
        e.preventDefault();
        nextStep();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        prevStep();
      } else if (e.key.toLowerCase() === "r") {
        toggleRecordMode();
      }
    });

    function toggleFullscreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else if (document.exitFullscreen) document.exitFullscreen();
    }

    renderStep();
  </script>
</body>
</html>`;
}
