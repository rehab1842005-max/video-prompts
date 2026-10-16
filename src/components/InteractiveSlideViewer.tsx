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
  flowRoute?: string;
  storyStage?: string;
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
  // 0: Master Overview (الرسمة موجودة بالكامل في البداية), 1..N: Progressive details appear
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScreenRecordMode, setIsScreenRecordMode] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<SVGGElement>(null);
  const presenterWindowRef = useRef<Window | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const steps = presentation.steps;
  const isOverview = currentStepIndex === 0;
  // Step 0 is overview, step 1 is index 0 of steps, step 2 is index 1, etc.
  const activeStep = isOverview ? null : steps[currentStepIndex - 1];

  // Initialize BroadcastChannel
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
      if (isOverview) {
        broadcastChannelRef.current.postMessage({
          stepNumber: 0,
          totalSteps: steps.length,
          title: "نظرة عامة على الرسمة والتركيب الأساسي",
          category: "مقدمة الرسمة",
          flowRoute: "جسم الإنسان ➔ الجهاز البولي ➔ الدورة الإخراجية الكاملة",
          teacherScript: "أهلاً بكم يا أبطالي! تعالوا نبص مع بعض على الرسمة الجميلة دي.. ده الجهاز الإخراجي والكليتين في جسمنا، ومع كل كليك هنبدأ نكتشف سر وتفصيلة جديدة ونعيش قصة متسلسلة!",
          nextStepTitle: steps[0]?.title || "",
        });
      } else if (activeStep) {
        broadcastChannelRef.current.postMessage({
          stepNumber: activeStep.stepNumber,
          totalSteps: steps.length,
          title: activeStep.title,
          category: activeStep.category,
          flowRoute: activeStep.flowRoute || "",
          teacherScript: activeStep.teacherScript,
          nextStepTitle: steps[currentStepIndex]?.title || "نهاية العرض",
        });
      }
    }
  }, [currentStepIndex, isOverview, activeStep, steps]);

  const nextStep = () => {
    if (currentStepIndex < steps.length) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setCurrentStepIndex(0); // Loop back to overview
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "Enter") {
        e.preventDefault();
        nextStep();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        prevStep();
      } else if (e.key.toLowerCase() === "r") {
        setIsScreenRecordMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, steps.length]);

  // Dynamic particle animations (including clear waste in blood)
  useEffect(() => {
    const container = particlesContainerRef.current;
    if (!container) return;
    container.innerHTML = "";

    if (isOverview || !activeStep) return;

    const type = activeStep.particleType;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 28 && container.firstChild) {
        container.removeChild(container.firstChild);
      }

      if (type === "incoming_blood" || type === "waste_particles") {
        const isLeft = Math.random() > 0.5;
        const isWaste = type === "waste_particles" && Math.random() > 0.35;

        if (isWaste) {
          // Sharp Yellow/Amber Waste Crystal
          const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          poly.setAttribute("points", "370,55 375,62 370,69 365,62");
          poly.setAttribute("fill", "#facc15");
          poly.setAttribute("stroke", "#ca8a04");
          poly.setAttribute("stroke-width", "1.5");
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
            poly.setAttribute("points", `${cx},${cy - 5} ${cx + 5},${cy} ${cx},${cy + 5} ${cx - 5},${cy}`);
            if (t >= 1) {
              clearInterval(move);
              poly.remove();
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
      } else if (type === "generic_flow") {
        const isUrine = Math.random() > 0.5;
        if (isUrine) {
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
        } else {
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
      }
    }, 170);

    return () => clearInterval(interval);
  }, [currentStepIndex, isOverview, activeStep]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Open Synced Presenter Notes Window
  const openPresenterNotesWindow = () => {
    const popup = window.open("", "RehabPresenterNotes", "width=520,height=650,left=50,top=50");
    if (popup) {
      presenterWindowRef.current = popup;
      const initialTitle = isOverview ? "نظرة عامة على الرسمة والتركيب الأساسي" : activeStep?.title || "";
      const initialScript = isOverview 
        ? "أهلاً بكم يا أبطالي! تعالوا نبص مع بعض على الرسمة الكاملة دي.. ده الجهاز الإخراجي والكليتين في جسمنا، ومع كل كليك هنبدأ نكتشف سر وتفصيلة جديدة!"
        : activeStep?.teacherScript || "";
      const initialCat = isOverview ? "مقدمة الرسمة" : activeStep?.category || "";
      const initialNext = isOverview ? steps[0]?.title : (steps[currentStepIndex]?.title || "نهاية العرض");

      popup.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>🎙️ ملاحظات المعلمة (شاشة المحاضر المستقلة)</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-900 text-slate-100 p-6 font-sans select-none flex flex-col justify-between min-h-screen">
          <div>
            <div class="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <div>
                <span class="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-full">
                  شاشة المعلمة الخفية (لا تظهر للطلاب)
                </span>
                <h1 class="text-lg font-black text-white mt-1">نافذة التلقين الصوتي لمس رحاب</h1>
              </div>
              <span id="step-badge" class="bg-blue-600/40 text-blue-300 font-bold text-sm px-3 py-1 rounded-full border border-blue-500">
                ${isOverview ? "نظرة عامة" : `الخطوة ${activeStep?.stepNumber} من ${steps.length}`}
              </span>
            </div>

            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <span class="text-xs text-teal-400 font-bold" id="category">المرحلة: ${initialCat}</span>
              <h2 id="title" class="text-xl font-black text-white mt-0.5">${initialTitle}</h2>
            </div>

            <div class="bg-blue-950/80 border-2 border-blue-600/60 rounded-2xl p-5 shadow-2xl">
              <span class="text-xs font-bold text-blue-300 flex items-center gap-1.5 mb-2">
                🎙️ قولي للطلاب بصوتك الآن:
              </span>
              <p id="script" class="text-lg text-slate-100 font-bold leading-relaxed">
                "${initialScript}"
              </p>
            </div>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4 flex justify-between items-center">
            <span>الخطوة القادمة: <b id="next-title" class="text-slate-200">${initialNext}</b></span>
            <span class="text-teal-400">متزامنة تلقائياً مع الكليك ✅</span>
          </div>

          <script>
            const channel = new BroadcastChannel("rehab_slide_notes");
            channel.onmessage = (e) => {
              const data = e.data;
              document.getElementById("step-badge").textContent = data.stepNumber === 0 ? "نظرة عامة" : "الخطوة " + data.stepNumber + " من " + data.totalSteps;
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

  // Export Real Microsoft PowerPoint (.pptx) file via API
  const exportRealPPTX = async () => {
    setIsExportingPptx(true);
    try {
      const res = await fetch("/api/export-pptx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentation }),
      });

      if (!res.ok) {
        throw new Error("فشل توليد ملف الباوربوينت");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentation.title.replace(/\s+/g, "_")}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
      alert("🎉 تم تحميل ملف الباوربوينت الأصلي (.pptx) بنجاح! يمكنك فتحه في مايكروسوفت باوربوينت مع الشرائح المتسلسلة وملاحظات المعلمة.");
    } catch (e: any) {
      alert("حدث خطأ أثناء تحميل ملف الباوربوينت: " + e.message);
    } finally {
      setIsExportingPptx(false);
    }
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
                باوربوينت تفاعلي (أسلوب د. أحمد الغريب)
              </span>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                {presentation.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              الرسمة موجودة في البداية 🫘، ومع كل كليك يظهر تفصيل وسهم ومعلومة مكتوبة 🎯
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Download Real PPTX */}
          <button
            onClick={exportRealPPTX}
            disabled={isExportingPptx}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1.5 font-bold disabled:opacity-50"
            title="تحميل كملف مايكروسوفت باوربوينت حقيقي (.pptx) يحتوي على الشرائح المتتالية وملاحظات المحاضر"
          >
            <span>📊</span>
            <span>{isExportingPptx ? "جاري تجهيز PPTX..." : "تحميل باوربوينت (.pptx)"}</span>
          </button>

          {/* Screen Recording Mode Toggle */}
          <button
            onClick={() => setIsScreenRecordMode(prev => !prev)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 font-bold ${
              isScreenRecordMode
                ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-600/30 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title="إخفاء كلام المعلمة من الشاشة الموجهة للطلاب لتسجيل فيديو شاشة احترافي"
          >
            <span>📹</span>
            <span>{isScreenRecordMode ? "وضع تصوير الشاشة (مُفعّل)" : "وضع تصوير الشاشة"}</span>
          </button>

          {/* Open Separate Presenter Window */}
          <button
            onClick={openPresenterNotesWindow}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-xl border border-indigo-500 shadow transition flex items-center gap-1.5 font-bold"
            title="فتح نافذة منفصلة تعرض كلام المعلمة متزامناً مع الكليك لتضعيها على شاشة ثانية"
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
                (خفي أثناء تصوير الشاشة)
              </span>
            </div>
            <p className="text-slate-100 text-sm font-semibold leading-relaxed">
              "{isOverview 
                ? "أهلاً بكم يا أبطالي! تعالوا نبص مع بعض على الرسمة الكاملة دي.. ده الجهاز الإخراجي والكليتين في جسمنا، ومع كل كليك هنبدأ نكتشف سر وتفصيلة جديدة!"
                : activeStep?.teacherScript}"
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

      {/* Main Presentation Stage (16:9 Master Canvas - Progressive Reveal) */}
      <div 
        onClick={nextStep}
        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-800 hover:border-blue-500/50 transition-all p-3 sm:p-5 cursor-pointer overflow-hidden flex-1 min-h-[510px] shadow-2xl flex flex-col justify-between group"
        title="اضغط في أي مكان أو اضغط المسطرة (Space) للحركة التالية"
      >
        {/* Step Header on Slide */}
        <div className="flex justify-between items-center z-10 bg-slate-950/70 backdrop-blur border border-slate-800/80 px-4 py-2.5 rounded-xl">
          <div>
            <span className="text-xs font-bold text-teal-400">
              {isOverview ? "البداية: نظرة عامة" : `كليك ${currentStepIndex} من ${steps.length}: ${activeStep?.category}`}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isOverview ? "الرسمة التشريحية الأساسية للكليتين" : activeStep?.title}
            </h3>
          </div>
          <span className="bg-blue-600/40 text-blue-200 border border-blue-500/50 text-xs font-bold px-3 py-1 rounded-full">
            {isOverview ? "نظرة عامة 🫘" : `كليك ${currentStepIndex}`}
          </span>
        </div>

        {/* Story Directional Flow Tracker (مين رايح لمين) */}
        <div className="z-10 flex flex-wrap items-center justify-between bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900/90 border border-indigo-500/40 px-4 py-2 rounded-xl shadow-lg gap-2">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <span className="font-black text-amber-400 flex items-center gap-1.5 whitespace-nowrap">
              <span>🧭</span> مسار الحركة (مين رايح لمين):
            </span>
            <span className="font-bold text-white bg-slate-800/95 px-3 py-1 rounded-lg border border-indigo-400/30 text-xs sm:text-sm">
              {activeStep?.flowRoute || (isOverview ? "جسم الإنسان ➔ الجهاز البولي ➔ الدورة الإخراجية الكاملة" : "")}
            </span>
          </div>
          <span className="text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-700/60 px-3 py-1 rounded-md hidden md:inline">
            {isOverview ? "نظرة عامة 🫘" : `المحطة ${currentStepIndex} من ${steps.length}: ${activeStep?.category}`}
          </span>
        </div>

        {/* Central Display: Progressive SVG Visual + Written Key Points */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-auto py-2 z-10">
          
          {/* Visual Master Diagram Box with Progressive Disclosure */}
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
                <radialGradient id="kidneyMedullaGrad" cx="40%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#7f1d1d" />
                  <stop offset="100%" stopColor="#450a0a" />
                </radialGradient>
                <filter id="pulseGlow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
                <marker id="arrow-yellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#facc15" />
                </marker>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>

              {/* ------------------------------------------------------------- */}
              {/* STAGE 1: HUMAN BODY CONTEXT (جسم الإنسان وتحديد موقع العضو أولاً) */}
              {/* ------------------------------------------------------------- */}
              {(activeStep?.storyStage === "human_body" || (steps.length >= 8 && currentStepIndex === 1)) ? (
                <g id="human-body-stage" className="animate-fade-in">
                  {/* Head & Neck */}
                  <ellipse cx="400" cy="55" rx="34" ry="42" fill="rgba(30, 41, 59, 0.45)" stroke="#64748b" strokeWidth="2"/>
                  <path d="M 388 95 L 388 122 M 412 95 L 412 122" stroke="#64748b" strokeWidth="2.5" fill="none"/>
                  
                  {/* Torso & Abdomen Contour */}
                  <path 
                    d="M 388 122 Q 300 135 240 180 Q 230 220 250 290 Q 275 350 280 440 L 520 440 Q 525 350 550 290 Q 570 220 560 180 Q 500 135 412 122 Z" 
                    fill="rgba(15, 23, 42, 0.65)" 
                    stroke="#475569" 
                    strokeWidth="2.5" 
                  />

                  {/* Vertebral Column (العمود الفقري في المنتصف) */}
                  <line x1="400" y1="122" x2="400" y2="440" stroke="#94a3b8" strokeWidth="9" strokeDasharray="14,4" strokeLinecap="round" opacity="0.6"/>

                  {/* Rib Cage Arches (القفص الصدري) */}
                  <g opacity="0.35" stroke="#94a3b8" strokeWidth="2.5" fill="none">
                    <path d="M 400 150 Q 330 160 300 200" />
                    <path d="M 400 150 Q 470 160 500 200" />
                    <path d="M 400 180 Q 320 190 295 230" />
                    <path d="M 400 180 Q 480 190 505 230" />
                    <path d="M 400 210 Q 330 220 310 260" />
                    <path d="M 400 210 Q 470 220 490 260" />
                    <path d="M 400 240 Q 350 250 330 280" />
                    <path d="M 400 240 Q 450 250 470 280" />
                  </g>

                  {/* Left Kidney in Posterior Abdominal Cavity at Lumbar Level */}
                  <g>
                    <path 
                      d="M 325 245 C 300 245 285 265 285 290 C 285 315 300 335 325 335 C 340 335 345 315 338 295 C 332 280 338 260 342 253 C 340 247 332 245 325 245 Z" 
                      fill="url(#kidneyGlow)" 
                      stroke="#f87171" 
                      strokeWidth="3"
                      filter="url(#pulseGlow)"
                    />
                    {/* Concentric Pulsing Radar Rings */}
                    <circle cx="315" cy="290" r="34" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="5,5" className="animate-spin" />
                    <circle cx="315" cy="290" r="8" fill="#38bdf8" opacity="0.8" />
                  </g>

                  {/* Right Kidney in Posterior Abdominal Cavity at Lumbar Level */}
                  <g>
                    <path 
                      d="M 475 245 C 500 245 515 265 515 290 C 515 315 500 335 475 335 C 460 335 455 315 462 295 C 468 280 462 260 458 253 C 460 247 468 245 475 245 Z" 
                      fill="url(#kidneyGlow)" 
                      stroke="#f87171" 
                      strokeWidth="3"
                      filter="url(#pulseGlow)"
                    />
                    {/* Concentric Pulsing Radar Rings */}
                    <circle cx="485" cy="290" r="34" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="5,5" className="animate-spin" />
                    <circle cx="485" cy="290" r="8" fill="#38bdf8" opacity="0.8" />
                  </g>

                  {/* Center Target Indicator Banner */}
                  <g className="animate-bounce">
                    <rect x="160" y="380" width="480" height="48" rx="14" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="2.5" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.8))"/>
                    <text x="400" y="410" fill="#38bdf8" fontSize="13.5" fontWeight="black" textAnchor="middle">
                      🎯 موقع الكليتين: في الناحية الظهرية للتجويف البطني على جانبي العمود الفقري
                    </text>
                  </g>

                  {/* Pointer Arrows to Kidneys */}
                  <path d="M 225 290 L 275 290" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <rect x="80" y="275" width="140" height="30" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="1.5"/>
                  <text x="150" y="295" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">الكلية اليسرى (جهة الظهر)</text>

                  <path d="M 575 290 L 525 290" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <rect x="580" y="275" width="140" height="30" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="1.5"/>
                  <text x="650" y="295" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">الكلية اليمنى (جهة الظهر)</text>
                </g>
              ) : (
                /* ------------------------------------------------------------- */
                /* STAGES 2..8: ZOOMED DETAILED URINARY SYSTEM & NEPHRON WORLD  */
                /* ------------------------------------------------------------- */
                <g id="master-base-drawing">
                  {/* Subtle Torso Background Guide */}
                  <path 
                    d="M 280 40 Q 400 20 520 40 Q 560 250 540 480 Q 400 490 260 480 Q 240 250 280 40 Z" 
                    fill="rgba(30, 41, 59, 0.15)" 
                    stroke="rgba(71, 85, 105, 0.25)" 
                    strokeDasharray="6,6" 
                    strokeWidth="1.5"
                  />

                  {/* Abdominal Aorta (Active in Step 2+ or Step 1+ in 7-step) */}
                  {(() => {
                    const isArteryActive = currentStepIndex >= (steps.length >= 8 ? 2 : 1) || isOverview;
                    return (
                      <g>
                        <path 
                          d="M 370 30 L 370 480" 
                          stroke={isArteryActive ? "url(#arteryGrad)" : "rgba(239, 68, 68, 0.3)"} 
                          strokeWidth="22" 
                          strokeLinecap="round"
                          className={currentStepIndex === 2 || currentStepIndex === 3 ? "filter-pulse" : ""}
                        />
                        {/* Branching to Left Kidney */}
                        <path 
                          d="M 370 210 Q 320 210 270 230" 
                          fill="none" 
                          stroke={isArteryActive ? "url(#arteryGrad)" : "rgba(239, 68, 68, 0.3)"} 
                          strokeWidth="14" 
                          strokeLinecap="round"
                        />
                        {/* Branching to Right Kidney */}
                        <path 
                          d="M 370 210 Q 450 210 530 230" 
                          fill="none" 
                          stroke={isArteryActive ? "url(#arteryGrad)" : "rgba(239, 68, 68, 0.3)"} 
                          strokeWidth="14" 
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  })()}

                  {/* Inferior Vena Cava (Active in Step 7, Step 8, Overview, or Step 6+ in 7-step) */}
                  {(() => {
                    const isVeinActive = isOverview || 
                      (steps.length >= 8 ? (currentStepIndex === 7 || currentStepIndex === 8) : currentStepIndex >= 6);
                    return (
                      <g>
                        <path 
                          d="M 430 30 L 430 480" 
                          stroke={isVeinActive ? "url(#veinGrad)" : "rgba(56, 189, 248, 0.25)"} 
                          strokeWidth="20" 
                          strokeLinecap="round"
                          className={isVeinActive && (currentStepIndex === 7 || currentStepIndex === 6) ? "filter-pulse" : ""}
                        />
                        <path 
                          d="M 270 250 Q 350 250 430 240" 
                          fill="none" 
                          stroke={isVeinActive ? "url(#veinGrad)" : "rgba(56, 189, 248, 0.25)"} 
                          strokeWidth="12" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M 530 250 Q 480 250 430 240" 
                          fill="none" 
                          stroke={isVeinActive ? "url(#veinGrad)" : "rgba(56, 189, 248, 0.25)"} 
                          strokeWidth="12" 
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  })()}

                  {/* Ureters & Bladder (Active in Step 6, Step 8, Overview, or Step 5+ in 7-step) */}
                  {(() => {
                    const isUreterActive = isOverview || 
                      (steps.length >= 8 ? (currentStepIndex === 6 || currentStepIndex === 8) : currentStepIndex >= 5);
                    return (
                      <g>
                        <path 
                          d="M 245 280 Q 280 380 370 430" 
                          fill="none" 
                          stroke={isUreterActive ? "url(#ureterGrad)" : "rgba(234, 179, 8, 0.25)"} 
                          strokeWidth="10" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M 555 280 Q 520 380 430 430" 
                          fill="none" 
                          stroke={isUreterActive ? "url(#ureterGrad)" : "rgba(234, 179, 8, 0.25)"} 
                          strokeWidth="10" 
                          strokeLinecap="round"
                        />
                        <ellipse 
                          cx="400" 
                          cy="445" 
                          rx="50" 
                          ry="32" 
                          fill="#ca8a04" 
                          opacity={isUreterActive ? 0.95 : 0.3} 
                          stroke="#facc15" 
                          strokeWidth={isUreterActive ? 3 : 1.5}
                        />
                      </g>
                    );
                  })()}

                  {/* --------------------------------------------------------- */}
                  {/* REALISTIC ANATOMICAL KIDNEYS (NO CARTOON EYES - MEDICAL ART) */}
                  {/* --------------------------------------------------------- */}
                  {(() => {
                    const showCrossSection = (steps.length >= 8 && (currentStepIndex === 4 || currentStepIndex === 5)) || 
                      (steps.length < 8 && (currentStepIndex === 3 || currentStepIndex === 4));
                    return (
                      <>
                        {/* Left Kidney */}
                        <g className="transition-all duration-500">
                          {/* Outer Kidney Shape with Medial Hilum */}
                          <path 
                            d="M 250 140 C 180 140 160 210 160 255 C 160 315 190 360 250 360 C 275 360 285 315 275 275 C 265 245 270 205 280 165 C 275 145 260 140 250 140 Z" 
                            fill={showCrossSection ? "url(#kidneyMedullaGrad)" : "url(#kidneyGlow)"} 
                            stroke="#f87171" 
                            strokeWidth={showCrossSection ? 3.5 : 2.5}
                            filter={showCrossSection ? "url(#pulseGlow)" : undefined}
                          />

                          {/* Anatomical Cross Section Layers (Cortex, Pyramids, Pelvis) */}
                          {showCrossSection && (
                            <g className="animate-fade-in">
                              {/* Outer Renal Cortex Band */}
                              <path 
                                d="M 245 155 C 190 155 175 215 175 255 C 175 305 200 345 245 345" 
                                fill="none" 
                                stroke="#f87171" 
                                strokeWidth="8" 
                                opacity="0.6"
                              />

                              {/* Medullary Pyramids (أهرامات النخاع الكلوية) */}
                              <polygon points="200,215 240,235 205,245" fill="#991b1b" stroke="#fca5a5" strokeWidth="1"/>
                              <polygon points="195,255 245,260 200,280" fill="#991b1b" stroke="#fca5a5" strokeWidth="1"/>
                              <polygon points="205,290 240,285 215,315" fill="#991b1b" stroke="#fca5a5" strokeWidth="1"/>

                              {/* Renal Pelvis (حوض الكلية - ملتقى البول) */}
                              <path 
                                d="M 245 240 Q 265 255 245 275 Q 255 260 270 255 Z" 
                                fill="#fef08a" 
                                stroke="#ca8a04" 
                                strokeWidth="1.5"
                              />

                              {/* Glowing Nephron Filter Nodes */}
                              <circle cx="190" cy="225" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
                              <circle cx="185" cy="265" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
                              <circle cx="195" cy="305" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
                              <text x="190" y="228" fontSize="8" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                              <text x="185" y="268" fontSize="8" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                              <text x="195" y="308" fontSize="8" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                            </g>
                          )}
                        </g>

                        {/* Right Kidney */}
                        <g className="transition-all duration-500">
                          {/* Outer Kidney Shape with Medial Hilum */}
                          <path 
                            d="M 550 140 C 620 140 640 210 640 255 C 640 315 610 360 550 360 C 525 360 515 315 525 275 C 535 245 530 205 520 165 C 525 145 540 140 550 140 Z" 
                            fill={showCrossSection ? "url(#kidneyMedullaGrad)" : "url(#kidneyGlow)"} 
                            stroke="#f87171" 
                            strokeWidth={showCrossSection ? 3.5 : 2.5}
                            filter={showCrossSection ? "url(#pulseGlow)" : undefined}
                          />

                          {/* Anatomical Cross Section Layers (Cortex, Pyramids, Pelvis) */}
                          {showCrossSection && (
                            <g className="animate-fade-in">
                              {/* Outer Renal Cortex Band */}
                              <path 
                                d="M 555 155 C 610 155 625 215 625 255 C 625 305 600 345 555 345" 
                                fill="none" 
                                stroke="#f87171" 
                                strokeWidth="8" 
                                opacity="0.6"
                              />

                              {/* Medullary Pyramids (أهرامات النخاع الكلوية) */}
                              <polygon points="600,215 560,235 595,245" fill="#991b1b" stroke="#fca5a5" strokeWidth="1"/>
                              <polygon points="605,255 555,260 600,280" fill="#991b1b" stroke="#fca5a5" strokeWidth="1"/>
                              <polygon points="595,290 560,285 585,315" fill="#991b1b" stroke="#fca5a5" strokeWidth="1"/>

                              {/* Renal Pelvis (حوض الكلية - ملتقى البول) */}
                              <path 
                                d="M 555 240 Q 535 255 555 275 Q 545 260 530 255 Z" 
                                fill="#fef08a" 
                                stroke="#ca8a04" 
                                strokeWidth="1.5"
                              />

                              {/* Glowing Nephron Filter Nodes */}
                              <circle cx="610" cy="225" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
                              <circle cx="615" cy="265" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
                              <circle cx="605" cy="305" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
                              <text x="610" y="228" fontSize="8" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                              <text x="615" y="268" fontSize="8" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                              <text x="605" y="308" fontSize="8" fill="#000" textAnchor="middle" fontWeight="bold">فلتر</text>
                            </g>
                          )}
                        </g>
                      </>
                    );
                  })()}
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PROGRESSIVE CALLOUTS & ARROWS ACCORDING TO CURRENT STORY STEP   */}
              {/* ------------------------------------------------------------- */}

              {/* Step 2: Incoming Blood Entry from Aorta */}
              {((steps.length >= 8 && currentStepIndex === 2) || (steps.length < 8 && currentStepIndex === 1)) && (
                <g className="animate-fade-in">
                  <path d="M 280 80 L 355 80" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow-red)"/>
                  <rect x="90" y="62" width="185" height="34" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#ef4444" strokeWidth="2"/>
                  <text x="182" y="84" fill="#f87171" fontSize="12" fontWeight="bold" textAnchor="middle">الشريان الكلوي (دم قادم من الأورطي)</text>
                </g>
              )}

              {/* Step 3: Spacious Microscopic Blood Chamber (ZERO OVERLAPPING TEXT) */}
              {((steps.length >= 8 && currentStepIndex === 3) || (steps.length < 8 && currentStepIndex === 2)) && (
                <g className="animate-fade-in" filter="drop-shadow(0 6px 14px rgba(0,0,0,0.85))">
                  <rect x="100" y="22" width="600" height="78" rx="14" fill="rgba(15, 23, 42, 0.95)" stroke="#facc15" strokeWidth="2.5"/>
                  
                  {/* Center Vertical Divider */}
                  <line x1="400" y1="28" x2="400" y2="94" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3"/>

                  {/* Left Column: Useful Blood Cells & Proteins */}
                  <g>
                    <circle cx="135" cy="50" r="10" fill="#ef4444"/>
                    <circle cx="150" cy="58" r="6" fill="#f87171"/>
                    <text x="175" y="47" fill="#f87171" fontSize="12" fontWeight="bold">🔴 خلايا الدم والبروتينات</text>
                    <text x="175" y="67" fill="#cbd5e1" fontSize="10.5">كبيرة الحجم • تظل محفوظة في الدم</text>
                  </g>

                  {/* Right Column: Harmful Nitrogenous Urea & Excess Salts */}
                  <g>
                    <polygon points="435,42 444,50 435,58 426,50" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5"/>
                    <polygon points="448,56 454,62 448,68 442,62" fill="#facc15" stroke="#ca8a04" strokeWidth="1"/>
                    <text x="470" y="47" fill="#facc15" fontSize="12" fontWeight="black">⚠️ فضلات نيتروجينية (يوريا وأملاح)</text>
                    <text x="470" y="67" fill="#fde047" fontSize="10.5">سموم ذائبة صغيرة • تُعزل وتُطرد في البول</text>
                  </g>
                </g>
              )}

              {/* Step 4: Internal Cross Section Callout */}
              {((steps.length >= 8 && currentStepIndex === 4) || (steps.length < 8 && currentStepIndex === 3)) && (
                <g className="animate-fade-in">
                  <path d="M 110 270 L 175 270" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrow-yellow)"/>
                  <rect x="5" y="252" width="105" height="34" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#fbbf24" strokeWidth="2"/>
                  <text x="57" y="274" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">فلاتر النيفرون 🔬</text>

                  <path d="M 690 270 L 625 270" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrow-yellow)"/>
                  <rect x="690" y="252" width="105" height="34" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#fbbf24" strokeWidth="2"/>
                  <text x="742" y="274" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">مليون وحدة ترشيح</text>
                </g>
              )}

              {/* Step 5: Nephron Filtration Action */}
              {((steps.length >= 8 && currentStepIndex === 5) || (steps.length < 8 && currentStepIndex === 4)) && (
                <g className="animate-fade-in">
                  <path d="M 115 280 L 175 280" stroke="#facc15" strokeWidth="2.5" markerEnd="url(#arrow-yellow)"/>
                  <rect x="10" y="260" width="115" height="40" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#facc15" strokeWidth="2"/>
                  <text x="67" y="278" fill="#facc15" fontSize="10.5" fontWeight="bold" textAnchor="middle">ترشيح الفضلات</text>
                  <text x="67" y="293" fill="#cbd5e1" fontSize="9.5" textAnchor="middle">يوريا + ماء + أملاح</text>

                  <path d="M 685 280 L 625 280" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow-red)"/>
                  <rect x="675" y="260" width="115" height="40" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#ef4444" strokeWidth="2"/>
                  <text x="732" y="278" fill="#f87171" fontSize="10.5" fontWeight="bold" textAnchor="middle">حجز خلايا الدم</text>
                  <text x="732" y="293" fill="#cbd5e1" fontSize="9.5" textAnchor="middle">كرات دم + بروتين</text>
                </g>
              )}

              {/* Step 6: Ureters & Bladder Downward Flow */}
              {((steps.length >= 8 && currentStepIndex === 6) || (steps.length < 8 && currentStepIndex === 5)) && (
                <g className="animate-fade-in">
                  <path d="M 230 390 L 300 370" stroke="#facc15" strokeWidth="3" markerEnd="url(#arrow-yellow)"/>
                  <rect x="90" y="380" width="135" height="34" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#facc15" strokeWidth="2"/>
                  <text x="157" y="402" fill="#facc15" fontSize="12" fontWeight="bold" textAnchor="middle">الحالب (نزول البول ⬇️)</text>

                  <path d="M 530 445 L 455 445" stroke="#facc15" strokeWidth="3" markerEnd="url(#arrow-yellow)"/>
                  <rect x="535" y="428" width="145" height="34" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#facc15" strokeWidth="2"/>
                  <text x="607" y="450" fill="#facc15" fontSize="12" fontWeight="bold" textAnchor="middle">المثانة (تجميع البول)</text>
                </g>
              )}

              {/* Step 7: Clean Renal Vein Upward Flow */}
              {((steps.length >= 8 && currentStepIndex === 7) || (steps.length < 8 && currentStepIndex === 6)) && (
                <g className="animate-fade-in">
                  <path d="M 540 80 L 445 80" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)"/>
                  <rect x="545" y="62" width="195" height="34" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="2"/>
                  <text x="642" y="84" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">الوريد الكلوي (دم نقي 100% ⬆️)</text>
                </g>
              )}

              {/* Step 8: Complete Dual Outputs Summary */}
              {((steps.length >= 8 && currentStepIndex === 8) || (steps.length < 8 && currentStepIndex === 7)) && (
                <g className="animate-fade-in">
                  {/* Output 1: Clean blood up to body */}
                  <path d="M 540 80 L 445 80" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)"/>
                  <rect x="520" y="58" width="230" height="38" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="2.5"/>
                  <text x="635" y="82" fill="#38bdf8" fontSize="12" fontWeight="black" textAnchor="middle">المخرج 1: دم نقي 100% يعود للجسم ✨</text>

                  {/* Output 2: Urine expelled down */}
                  <path d="M 530 450 L 455 450" stroke="#facc15" strokeWidth="3" markerEnd="url(#arrow-yellow)"/>
                  <rect x="515" y="430" width="230" height="38" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="#facc15" strokeWidth="2.5"/>
                  <text x="630" y="454" fill="#facc15" fontSize="12" fontWeight="black" textAnchor="middle">المخرج 2: بول محمل بالفضلات يُطرد للخارج 🚽</text>
                </g>
              )}

              {/* Dynamic Particles Container */}
              <g ref={particlesContainerRef}></g>
            </svg>
          </div>

          {/* Right: Written Key Points & Scientific Facts (Real PowerPoint Slide Content) */}
          <div className="lg:col-span-4 bg-slate-900/95 border-2 border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3 backdrop-blur">
            <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📝</span> نقاط الشرح المكتوبة للطلاب:
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                {isOverview ? "المقدمة" : `خطوة ${currentStepIndex}`}
              </span>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-2.5 text-sm text-slate-200">
              {isOverview ? (
                <>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-teal-400 font-bold mt-0.5">•</span>
                    <span>الرسمة تمثل الجهاز البولي والإخراجي المسؤول عن تنقية دم الإنسان باستمرار.</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-teal-400 font-bold mt-0.5">•</span>
                    <span>يتكون من الكليتين، الشريان الكلوي، الوريد الكلوي، الحالبين، والمثانة البولية.</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-teal-400 font-bold mt-0.5">•</span>
                    <span className="text-amber-300 font-semibold">اضغطي كليك بالماوس لبدء ظهور تفاصيل الرسمة خطوة بخطوة بالترتيب!</span>
                  </li>
                </>
              ) : (
                (activeStep?.keyPoints || [activeStep?.visualAction || ""]).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-teal-400 font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))
              )}
            </ul>

            {/* Scientific Golden Fact */}
            {(!isOverview && activeStep?.scientificFact) && (
              <div className="mt-2 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-600/40 rounded-xl p-3">
                <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                  💡 معلومة علمية ذهبية:
                </span>
                <p className="text-xs text-amber-100/90 mt-1 leading-relaxed font-medium">
                  {activeStep.scientificFact}
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
            {isOverview ? "اضغطي كليك للكشف عن الجزء الأول من الرسمة" : `الحركة الحالية: ${currentStepIndex} من ${steps.length}`}
          </span>
        </div>
      </div>

      {/* Presentation Timeline & Navigation Bar */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg">
        {/* Step dots */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xl w-full">
          <button
            onClick={() => setCurrentStepIndex(0)}
            className={`h-2.5 px-3 rounded-full text-[10px] font-bold transition-all ${
              isOverview ? "bg-amber-400 text-slate-950 scale-105" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            نظرة عامة
          </button>
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => setCurrentStepIndex(i + 1)}
              className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                i + 1 === currentStepIndex
                  ? "bg-gradient-to-r from-teal-400 to-blue-500 scale-y-125 shadow-md shadow-blue-500/50"
                  : i + 1 < currentStepIndex
                  ? "bg-teal-700/80 hover:bg-teal-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
              title={`كليك ${i + 1}: ${st.title}`}
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
            ⬅️ <span>{isOverview ? "بدء استكشاف التفاصيل (كليك)" : "التالي (كليك)"}</span>
          </button>
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 transition"
            title="العودة لنظرة عامة على الرسمة"
          >
            🔄 البداية
          </button>
        </div>
      </footer>
    </div>
  );
}
