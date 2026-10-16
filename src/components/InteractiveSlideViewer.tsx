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
  lensMode?: "blood_stream" | "bowman_capsule" | "filter_sieve" | "reabsorption_tubule" | null;
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
  anatomicalDetails?: {
    location?: string;
    dimensions?: string;
    bloodVolume?: string;
    weight?: string;
  };
  fluidBalance?: {
    inflow: string;
    action: string;
    outflow: string;
  };
  examQuestion?: {
    q: string;
    a: string;
    reason: string;
  };
  goldenNumbers?: {
    stat: string;
    label: string;
  }[];
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
  // 0: Master Overview, 1..N: Progressive details appear
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScreenRecordMode, setIsScreenRecordMode] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<"points" | "balance" | "exam" | "numbers">("points");
  const [layoutMode, setLayoutMode] = useState<"studio" | "cinema">("studio");
  const [isLensExpanded, setIsLensExpanded] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<SVGGElement>(null);
  const presenterWindowRef = useRef<Window | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const steps = presentation.steps;
  const isOverview = currentStepIndex === 0;
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
      setCurrentStepIndex(0);
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

  // HIGH-REALISM CONTINUOUS FLOWING BLOOD ANIMATION ("دم نازل")
  useEffect(() => {
    const container = particlesContainerRef.current;
    if (!container) return;
    container.innerHTML = "";

    if (isOverview || !activeStep) return;

    const type = activeStep.particleType;
    let count = 0;

    const interval = setInterval(() => {
      count++;
      if (count > 35 && container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // 1. INCOMING BLOOD CASCADE ("دم نازل من الأورطي ويتفرع للكليتين")
      if (type === "incoming_blood" || type === "waste_particles") {
        const isLeft = Math.random() > 0.5;
        const isWaste = (type === "waste_particles" && Math.random() > 0.35);

        if (isWaste) {
          // Sharp Yellow/Amber Glistening Urea Crystal
          const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          poly.setAttribute("points", "370,45 376,53 370,61 364,53");
          poly.setAttribute("fill", "#facc15");
          poly.setAttribute("stroke", "#ca8a04");
          poly.setAttribute("stroke-width", "1.5");
          poly.setAttribute("filter", "drop-shadow(0 0 4px #facc15)");
          container.appendChild(poly);

          let t = 0;
          const move = setInterval(() => {
            t += 0.045;
            let cx = 370;
            let cy = 50 + t * 320;
            if (t >= 0.45) {
              const branchT = (t - 0.45) * 1.82;
              const targetX = isLeft ? 240 : 560;
              cx = 370 + (targetX - 370) * branchT;
              cy = 210 + (240 - 210) * branchT;
            }
            poly.setAttribute("points", `${cx},${cy - 6} ${cx + 6},${cy} ${cx},${cy + 6} ${cx - 6},${cy}`);
            if (t >= 1) {
              clearInterval(move);
              poly.remove();
            }
          }, 28);
        } else {
          // Real 3D Biconcave Red Blood Cell (with highlight & depth)
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          const outer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          outer.setAttribute("cx", "370");
          outer.setAttribute("cy", "50");
          outer.setAttribute("r", "5.5");
          outer.setAttribute("fill", "#ef4444");
          outer.setAttribute("filter", "drop-shadow(0 0 3px rgba(239, 68, 68, 0.8))");

          const inner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          inner.setAttribute("cx", "370");
          inner.setAttribute("cy", "50");
          inner.setAttribute("r", "2.5");
          inner.setAttribute("fill", "#991b1b");

          g.appendChild(outer);
          g.appendChild(inner);
          container.appendChild(g);

          let t = 0;
          const move = setInterval(() => {
            t += 0.045;
            let cx = 370;
            let cy = 50 + t * 320;
            if (t >= 0.45) {
              const branchT = (t - 0.45) * 1.82;
              const targetX = isLeft ? 240 : 560;
              cx = 370 + (targetX - 370) * branchT;
              cy = 210 + (240 - 210) * branchT;
            }
            outer.setAttribute("cx", cx.toString());
            outer.setAttribute("cy", cy.toString());
            inner.setAttribute("cx", cx.toString());
            inner.setAttribute("cy", cy.toString());

            if (t >= 1) {
              clearInterval(move);
              g.remove();
            }
          }, 28);
        }
      } 
      // 2. NEPHRON FILTERING ACTION (Pulsing separation)
      else if (type === "filtering_action") {
        const isLeft = Math.random() > 0.5;
        const kX = isLeft ? 220 + (Math.random() * 50 - 25) : 580 + (Math.random() * 50 - 25);
        const kY = 240 + (Math.random() * 70 - 35);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", kX.toString());
        circle.setAttribute("cy", kY.toString());
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", Math.random() > 0.5 ? "#fbbf24" : "#38bdf8");
        circle.setAttribute("filter", "drop-shadow(0 0 6px currentColor)");
        container.appendChild(circle);
        setTimeout(() => circle.remove(), 1100);
      } 
      // 3. CONTINUOUS URINE FLOW DOWN URETERS ("نزول البول قطرة بقطرة للمثانة")
      else if (type === "urine_flow") {
        const isLeft = Math.random() > 0.5;
        const startX = isLeft ? 245 : 555;
        const droplet = document.createElementNS("http://www.w3.org/2000/svg", "path");
        droplet.setAttribute("d", `M ${startX} 280 C ${startX - 3} 285 ${startX - 3} 291 ${startX} 294 C ${startX + 3} 291 ${startX + 3} 285 ${startX} 280 Z`);
        droplet.setAttribute("fill", "#facc15");
        droplet.setAttribute("stroke", "#ca8a04");
        droplet.setAttribute("stroke-width", "1");
        droplet.setAttribute("filter", "drop-shadow(0 0 5px #eab308)");
        container.appendChild(droplet);

        let t = 0;
        const move = setInterval(() => {
          t += 0.038;
          const curX = startX + ((isLeft ? 375 : 425) - startX) * t;
          const curY = 280 + (435 - 280) * t;
          droplet.setAttribute("d", `M ${curX} ${curY} C ${curX - 3} ${curY + 5} ${curX - 3} ${curY + 11} ${curX} ${curY + 14} C ${curX + 3} ${curY + 11} ${curX + 3} ${curY + 5} ${curX} ${curY} Z`);
          if (t >= 1) {
            clearInterval(move);
            droplet.remove();
          }
        }, 28);
      } 
      // 4. CLEAN BLOOD RETURNING VIA RENAL VEIN ("صعود الدم النقي للقلب")
      else if (type === "clean_blood_return") {
        const isLeft = Math.random() > 0.5;
        const startX = isLeft ? 270 : 530;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", startX.toString());
        circle.setAttribute("cy", "240");
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "#38bdf8");
        circle.setAttribute("filter", "drop-shadow(0 0 6px #38bdf8)");
        container.appendChild(circle);

        let t = 0;
        const move = setInterval(() => {
          t += 0.038;
          if (t < 0.5) {
            const curX = startX + (430 - startX) * (t * 2);
            circle.setAttribute("cx", curX.toString());
          } else {
            circle.setAttribute("cx", "430");
            circle.setAttribute("cy", (240 - (t - 0.5) * 420).toString());
          }
          if (t >= 1) {
            clearInterval(move);
            circle.remove();
          }
        }, 28);
      } 
      // 5. GENERIC DUAL MASTER FLOW
      else if (type === "generic_flow") {
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
          circle.setAttribute("r", "5");
          circle.setAttribute("fill", "#38bdf8");
          circle.setAttribute("filter", "drop-shadow(0 0 4px #38bdf8)");
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
    }, 140);

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
    const popup = window.open("", "RehabPresenterNotes", "width=540,height=700,left=50,top=50");
    if (popup) {
      presenterWindowRef.current = popup;
      const initialTitle = isOverview ? "نظرة عامة على الرسمة والتركيب الأساسي" : activeStep?.title || "";
      const initialScript = isOverview 
        ? "أهلاً بكم يا أبطالي! تعالوا نبص مع بعض على الرسمة الكاملة دي.. ده الجهاز الإخراجي والكليتين في جسمنا، ومع كل كليك هنبدأ نكتشف سر وتفصيلة جديدة!"
        : activeStep?.teacherScript || "";
      const initialCat = isOverview ? "مقدمة الرسمة" : activeStep?.category || "";
      const initialNext = isOverview ? steps[0]?.title : (steps[currentStepIndex]?.title || "نهاية العرض");
      const initialFlow = isOverview ? "جسم الإنسان ➔ الجهاز البولي ➔ الدورة الإخراجية" : activeStep?.flowRoute || "";

      popup.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>🎙️ ملاحظات المعلمة رحاب (شاشة المحاضر المستقلة)</title>
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

            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-3">
              <span class="text-xs text-teal-400 font-bold" id="category">المرحلة: ${initialCat}</span>
              <h2 id="title" class="text-xl font-black text-white mt-0.5">${initialTitle}</h2>
              <div class="mt-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-600/30 px-3 py-1.5 rounded-lg">
                🧭 <span id="flow">${initialFlow}</span>
              </div>
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
              document.getElementById("flow").textContent = data.flowRoute;
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
      alert("🎉 تم تحميل ملف الباوربوينت الأصلي (.pptx) بنجاح! يحتوي على كافة الشرائح الـ 12 وملاحظات المعلمة وجداول السوائل.");
    } catch (e: any) {
      alert("حدث خطأ أثناء تحميل ملف الباوربوينت: " + e.message);
    } finally {
      setIsExportingPptx(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-950 text-slate-100 rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-800 flex flex-col gap-3.5 max-w-7xl mx-auto my-3 select-none font-sans relative ${
        isFullscreen ? "w-screen h-screen rounded-none max-w-none p-3" : ""
      }`}
      dir="rtl"
    >
      {/* Top Header / Control Toolbar */}
      <header className="flex flex-wrap justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl px-4 py-2.5 shadow-lg gap-2.5">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-md font-bold">
                محاكاة 3D تفاعلية (أسلوب د. أحمد الغريب)
              </span>
              <h2 className="text-base sm:text-lg font-black bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                {presentation.title}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              مجسم 3D نابض 🫘 • دم متدفق حقيقي 🩸 • عدسة تكبير مجهرية 🔬 • بنك بيانات منظم بدقة
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Mode switch: Studio vs Cinema */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setLayoutMode("studio")}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                layoutMode === "studio" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="عرض الاستوديو المتكامل (الرسمة 3D + لوحة البيانات الشاملة)"
            >
              📊 استوديو تفاعلي
            </button>
            <button
              onClick={() => setLayoutMode("cinema")}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                layoutMode === "cinema" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="عرض سينمائي كامل (رسمة عملاقة وكروت بيانات عائمة)"
            >
              🎬 سينمائي كامل
            </button>
          </div>

          {/* Download Real PPTX */}
          <button
            onClick={exportRealPPTX}
            disabled={isExportingPptx}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3 py-1.5 rounded-xl shadow transition flex items-center gap-1.5 font-bold disabled:opacity-50"
            title="تحميل كملف مايكروسوفت باوربوينت حقيقي (.pptx)"
          >
            <span>📊</span>
            <span>{isExportingPptx ? "جاري التجهيز..." : "تحميل باوربوينت (.pptx)"}</span>
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
            <span>{isScreenRecordMode ? "وضع التصوير (مُفعّل)" : "وضع التصوير"}</span>
          </button>

          {/* Open Separate Presenter Window */}
          <button
            onClick={openPresenterNotesWindow}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-xl border border-indigo-500 shadow transition flex items-center gap-1.5 font-bold"
            title="فتح نافذة منفصلة تعرض كلام المعلمة متزامناً مع الكليك"
          >
            <span>🎙️</span> نافذة الملاحظات
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1 font-bold"
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
        <div className="bg-blue-950/70 border border-blue-800/60 rounded-2xl p-3 shadow-inner flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 transition-all">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm">🎙️</span>
              <span className="text-xs font-bold text-blue-300">
                ماذا تقولين للطلاب في هذا الكليك (إلقاء صوتي مباشر لمس رحاب):
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
        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-800 hover:border-blue-500/50 transition-all p-3 sm:p-4 cursor-pointer overflow-hidden flex-1 min-h-[540px] shadow-2xl flex flex-col justify-between group"
        title="اضغط في أي مكان أو اضغط المسطرة (Space) للحركة التالية"
      >
        {/* Step Header on Slide */}
        <div className="flex justify-between items-center z-10 bg-slate-950/80 backdrop-blur border border-slate-800/80 px-4 py-2 rounded-xl">
          <div>
            <span className="text-xs font-bold text-teal-400">
              {isOverview ? "البداية: نظرة عامة" : `كليك ${currentStepIndex} من ${steps.length}: ${activeStep?.category}`}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {isOverview ? "الرسمة التشريحية الأساسية للكليتين" : activeStep?.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {activeStep?.lensMode && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <span>🔬</span> عدسة فحص مجهري 3D
              </span>
            )}
            <span className="bg-blue-600/40 text-blue-200 border border-blue-500/50 text-xs font-bold px-3 py-1 rounded-full">
              {isOverview ? "نظرة عامة 🫘" : `شريحة ${currentStepIndex}`}
            </span>
          </div>
        </div>

        {/* Story Directional Flow Tracker (مين رايح لمين) */}
        <div className="z-10 flex flex-wrap items-center justify-between bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900/90 border border-indigo-500/40 px-3.5 py-1.5 rounded-xl shadow-lg gap-2 mt-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm overflow-x-auto py-0.5">
            <span className="font-black text-amber-400 flex items-center gap-1 whitespace-nowrap">
              <span>🧭</span> مسار الحركة (مين رايح لمين):
            </span>
            <span className="font-bold text-white bg-slate-800/95 px-3 py-0.5 rounded-lg border border-indigo-400/30 text-xs sm:text-sm whitespace-nowrap">
              {activeStep?.flowRoute || (isOverview ? "جسم الإنسان ➔ الجهاز البولي ➔ الدورة الإخراجية الكاملة" : "")}
            </span>
          </div>
          <span className="text-[11px] font-bold text-teal-300 bg-teal-950/80 border border-teal-700/60 px-2.5 py-0.5 rounded-md hidden md:inline">
            {isOverview ? "نظرة عامة 🫘" : `المحطة ${currentStepIndex} من ${steps.length}`}
          </span>
        </div>

        {/* Central Display: Progressive 3D Visual + Structured Scientific Multi-Card Dashboard */}
        <div className={`grid ${layoutMode === "cinema" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"} gap-4 items-center my-auto py-2 z-10`}>
          
          {/* Visual Master 3D Diagram Box with Realistic Lighting & Continuous Particles */}
          <div className={`${layoutMode === "cinema" ? "w-full max-w-4xl mx-auto" : "lg:col-span-7"} relative flex items-center justify-center`}>
            <svg viewBox="0 0 800 500" className="w-full h-full max-h-[460px] drop-shadow-2xl">
              <defs>
                {/* 3D Cylindrical Aorta Gradient */}
                <linearGradient id="aorta3dGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7f1d1d" />
                  <stop offset="30%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#fca5a5" />
                  <stop offset="70%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#450a0a" />
                </linearGradient>

                {/* 3D Cylindrical Vena Cava Gradient */}
                <linearGradient id="vein3dGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0c4a6e" />
                  <stop offset="30%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#7dd3fc" />
                  <stop offset="70%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#082f49" />
                </linearGradient>

                {/* 3D Translucent Ureter Gradient */}
                <linearGradient id="ureter3dGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#854d0e" />
                  <stop offset="40%" stopColor="#eab308" />
                  <stop offset="60%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#713f12" />
                </linearGradient>

                {/* 3D Volumetric Kidney Gradient */}
                <radialGradient id="kidney3dVolume" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="40%" stopColor="#dc2626" />
                  <stop offset="75%" stopColor="#991b1b" />
                  <stop offset="100%" stopColor="#450a0a" />
                </radialGradient>

                {/* 3D Medulla Striation Gradient */}
                <radialGradient id="medulla3dGrad" cx="35%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="60%" stopColor="#581c87" />
                  <stop offset="100%" stopColor="#2e1065" />
                </radialGradient>

                {/* Titanium Magnifier Bezel Gradient */}
                <linearGradient id="lensBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="35%" stopColor="#94a3b8" />
                  <stop offset="70%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Glass Reflection Gradient */}
                <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                </linearGradient>

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
                  
                  {/* Torso & Abdomen Contour with 3D Depth */}
                  <path 
                    d="M 388 122 Q 300 135 240 180 Q 230 220 250 290 Q 275 350 280 440 L 520 440 Q 525 350 550 290 Q 570 220 560 180 Q 500 135 412 122 Z" 
                    fill="rgba(15, 23, 42, 0.75)" 
                    stroke="#475569" 
                    strokeWidth="2.5" 
                  />

                  {/* Vertebral Column (العمود الفقري في المنتصف - T12 to L3) */}
                  <line x1="400" y1="122" x2="400" y2="440" stroke="#94a3b8" strokeWidth="10" strokeDasharray="16,5" strokeLinecap="round" opacity="0.6"/>

                  {/* Rib Cage Arches (القفص الصدري الحامي للكليتين) */}
                  <g opacity="0.4" stroke="#94a3b8" strokeWidth="3" fill="none">
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
                      fill="url(#kidney3dVolume)" 
                      stroke="#f87171" 
                      strokeWidth="3"
                      filter="url(#pulseGlow)"
                    />
                    {/* Concentric Pulsing Radar Rings */}
                    <circle cx="315" cy="290" r="34" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="5,5" className="animate-spin" />
                    <circle cx="315" cy="290" r="8" fill="#38bdf8" opacity="0.85" />
                  </g>

                  {/* Right Kidney in Posterior Abdominal Cavity (slightly lower due to liver) */}
                  <g>
                    <path 
                      d="M 475 255 C 500 255 515 275 515 300 C 515 325 500 345 475 345 C 460 345 455 325 462 305 C 468 290 462 270 458 263 C 460 257 468 255 475 255 Z" 
                      fill="url(#kidney3dVolume)" 
                      stroke="#f87171" 
                      strokeWidth="3"
                      filter="url(#pulseGlow)"
                    />
                    {/* Concentric Pulsing Radar Rings */}
                    <circle cx="485" cy="300" r="34" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="5,5" className="animate-spin" />
                    <circle cx="485" cy="300" r="8" fill="#38bdf8" opacity="0.85" />
                  </g>

                  {/* Center Target Indicator Banner */}
                  <g className="animate-bounce">
                    <rect x="150" y="380" width="500" height="48" rx="14" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="2.5" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.8))"/>
                    <text x="400" y="410" fill="#38bdf8" fontSize="13.5" fontWeight="black" textAnchor="middle">
                      🎯 موقع الكليتين: في الناحية الظهرية للتجويف البطني (T12 - L3) خلف البريتون
                    </text>
                  </g>

                  {/* Leader line labels */}
                  <path d="M 225 290 L 275 290" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <rect x="75" y="275" width="145" height="32" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="1.5"/>
                  <text x="147" y="295" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">الكلية اليسرى (مستوى T12)</text>

                  <path d="M 575 300 L 525 300" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <rect x="580" y="285" width="145" height="32" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="1.5"/>
                  <text x="652" y="305" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">الكلية اليمنى (أدنى بسبب الكبد)</text>
                </g>
              ) : (
                /* ------------------------------------------------------------- */
                /* STAGES 2..N: ZOOMED DETAILED 3D URINARY SYSTEM               */
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

                  {/* 3D Abdominal Aorta with Cylindrical Specular Shading */}
                  <g>
                    <path 
                      d="M 370 20 L 370 480" 
                      stroke="url(#aorta3dGrad)" 
                      strokeWidth="24" 
                      strokeLinecap="round"
                      filter="drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))"
                    />
                    {/* Branching to Left Kidney */}
                    <path 
                      d="M 370 210 Q 320 210 270 230" 
                      fill="none" 
                      stroke="url(#aorta3dGrad)" 
                      strokeWidth="16" 
                      strokeLinecap="round"
                    />
                    {/* Branching to Right Kidney */}
                    <path 
                      d="M 370 210 Q 450 210 530 230" 
                      fill="none" 
                      stroke="url(#aorta3dGrad)" 
                      strokeWidth="16" 
                      strokeLinecap="round"
                    />
                  </g>

                  {/* 3D Inferior Vena Cava with Cylindrical Specular Shading */}
                  <g>
                    <path 
                      d="M 430 20 L 430 480" 
                      stroke="url(#vein3dGrad)" 
                      strokeWidth="22" 
                      strokeLinecap="round"
                      filter="drop-shadow(0 0 8px rgba(2, 132, 199, 0.4))"
                    />
                    {/* Left Renal Vein */}
                    <path 
                      d="M 270 250 Q 350 250 430 240" 
                      fill="none" 
                      stroke="url(#vein3dGrad)" 
                      strokeWidth="14" 
                      strokeLinecap="round"
                    />
                    {/* Right Renal Vein */}
                    <path 
                      d="M 530 250 Q 480 250 430 240" 
                      fill="none" 
                      stroke="url(#vein3dGrad)" 
                      strokeWidth="14" 
                      strokeLinecap="round"
                    />
                  </g>

                  {/* 3D Ureters & Bladder */}
                  <g>
                    <path 
                      d="M 245 280 Q 280 380 370 430" 
                      fill="none" 
                      stroke="url(#ureter3dGrad)" 
                      strokeWidth="11" 
                      strokeLinecap="round"
                      filter="drop-shadow(0 0 5px rgba(234, 179, 8, 0.4))"
                    />
                    <path 
                      d="M 555 280 Q 520 380 430 430" 
                      fill="none" 
                      stroke="url(#ureter3dGrad)" 
                      strokeWidth="11" 
                      strokeLinecap="round"
                      filter="drop-shadow(0 0 5px rgba(234, 179, 8, 0.4))"
                    />
                    {/* Translucent 3D Bladder Sphere */}
                    <ellipse 
                      cx="400" 
                      cy="445" 
                      rx="52" 
                      ry="34" 
                      fill="#ca8a04" 
                      opacity="0.9" 
                      stroke="#facc15" 
                      strokeWidth="3"
                      filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"
                    />
                    <ellipse cx="400" cy="435" rx="36" ry="14" fill="rgba(254, 240, 138, 0.3)" />
                  </g>

                  {/* --------------------------------------------------------- */}
                  {/* REALISTIC 3D ANATOMICAL KIDNEYS (VOLUMETRIC SHADING)       */}
                  {/* --------------------------------------------------------- */}
                  {(() => {
                    const showCrossSection = activeStep?.storyStage === "kidney_layers" || 
                      activeStep?.storyStage === "nephron_zoom" ||
                      activeStep?.storyStage === "ultrafiltration" ||
                      activeStep?.storyStage === "reabsorption" ||
                      activeStep?.storyStage === "urine_formation";
                    
                    return (
                      <>
                        {/* Left Kidney */}
                        <g className="transition-all duration-500">
                          {/* Outer Kidney Silhouette with 3D Medial Hilum */}
                          <path 
                            d="M 250 140 C 180 140 160 210 160 255 C 160 315 190 360 250 360 C 275 360 285 315 275 275 C 265 245 270 205 280 165 C 275 145 260 140 250 140 Z" 
                            fill={showCrossSection ? "url(#medulla3dGrad)" : "url(#kidney3dVolume)"} 
                            stroke="#f87171" 
                            strokeWidth={showCrossSection ? 3.5 : 2.5}
                            filter="drop-shadow(0 10px 20px rgba(0,0,0,0.7))"
                          />

                          {/* Anatomical Cross Section Layers (Cortex, Pyramids, Pelvis) */}
                          {showCrossSection && (
                            <g className="animate-fade-in">
                              {/* Outer Renal Cortex Band */}
                              <path 
                                d="M 245 155 C 190 155 175 215 175 255 C 175 305 200 345 245 345" 
                                fill="none" 
                                stroke="#f87171" 
                                strokeWidth="9" 
                                opacity="0.65"
                              />

                              {/* Medullary Pyramids (أهرامات النخاع الكلوية المخططة) */}
                              <polygon points="200,215 240,235 205,245" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.2"/>
                              <polygon points="195,255 245,260 200,280" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.2"/>
                              <polygon points="205,290 240,285 215,315" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.2"/>

                              {/* Renal Pelvis (حوض الكلية - ملتقى البول القمعي) */}
                              <path 
                                d="M 245 240 Q 265 255 245 275 Q 255 260 270 255 Z" 
                                fill="#fef08a" 
                                stroke="#ca8a04" 
                                strokeWidth="2"
                              />

                              {/* Glowing Nephron Filter Nodes */}
                              <circle cx="190" cy="225" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 5px #fbbf24)"/>
                              <circle cx="185" cy="265" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 5px #fbbf24)"/>
                              <circle cx="195" cy="305" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 5px #fbbf24)"/>
                              <text x="190" y="229" fontSize="8" fill="#000" textAnchor="middle" fontWeight="black">نيفرون</text>
                              <text x="185" y="269" fontSize="8" fill="#000" textAnchor="middle" fontWeight="black">نيفرون</text>
                              <text x="195" y="309" fontSize="8" fill="#000" textAnchor="middle" fontWeight="black">نيفرون</text>
                            </g>
                          )}
                        </g>

                        {/* Right Kidney */}
                        <g className="transition-all duration-500">
                          {/* Outer Kidney Silhouette with 3D Medial Hilum */}
                          <path 
                            d="M 550 140 C 620 140 640 210 640 255 C 640 315 610 360 550 360 C 525 360 515 315 525 275 C 535 245 530 205 520 165 C 525 145 540 140 550 140 Z" 
                            fill={showCrossSection ? "url(#medulla3dGrad)" : "url(#kidney3dVolume)"} 
                            stroke="#f87171" 
                            strokeWidth={showCrossSection ? 3.5 : 2.5}
                            filter="drop-shadow(0 10px 20px rgba(0,0,0,0.7))"
                          />

                          {/* Anatomical Cross Section Layers */}
                          {showCrossSection && (
                            <g className="animate-fade-in">
                              {/* Outer Renal Cortex Band */}
                              <path 
                                d="M 555 155 C 610 155 625 215 625 255 C 625 305 600 345 555 345" 
                                fill="none" 
                                stroke="#f87171" 
                                strokeWidth="9" 
                                opacity="0.65"
                              />

                              {/* Medullary Pyramids */}
                              <polygon points="600,215 560,235 595,245" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.2"/>
                              <polygon points="605,255 555,260 600,280" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.2"/>
                              <polygon points="595,290 560,285 585,315" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.2"/>

                              {/* Renal Pelvis */}
                              <path 
                                d="M 555 240 Q 535 255 555 275 Q 545 260 530 255 Z" 
                                fill="#fef08a" 
                                stroke="#ca8a04" 
                                strokeWidth="2"
                              />

                              {/* Glowing Nephron Filter Nodes */}
                              <circle cx="610" cy="225" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 5px #fbbf24)"/>
                              <circle cx="615" cy="265" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 5px #fbbf24)"/>
                              <circle cx="605" cy="305" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 5px #fbbf24)"/>
                              <text x="610" y="229" fontSize="8" fill="#000" textAnchor="middle" fontWeight="black">نيفرون</text>
                              <text x="615" y="269" fontSize="8" fill="#000" textAnchor="middle" fontWeight="black">نيفرون</text>
                              <text x="605" y="309" fontSize="8" fill="#000" textAnchor="middle" fontWeight="black">نيفرون</text>
                            </g>
                          )}
                        </g>
                      </>
                    );
                  })()}
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 🔬 3D MAGNIFYING LENS HUD ("عاملة مكبر وبشوف كل حاجة بالتفصيل") */}
              {/* ------------------------------------------------------------- */}
              {activeStep?.lensMode && isLensExpanded && (
                <g id="microscopic-lens-hud" className="animate-fade-in" filter="drop-shadow(0 14px 28px rgba(0,0,0,0.9))">
                  {/* Outer Titanium Bezel */}
                  <circle cx="400" cy="250" r="150" fill="#090d16" stroke="url(#lensBezelGrad)" strokeWidth="8"/>
                  <circle cx="400" cy="250" r="142" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8,6" className="animate-spin"/>

                  {/* Crosshair Target Marks */}
                  <line x1="255" y1="250" x2="275" y2="250" stroke="#38bdf8" strokeWidth="2"/>
                  <line x1="525" y1="250" x2="545" y2="250" stroke="#38bdf8" strokeWidth="2"/>
                  <line x1="400" y1="105" x2="400" y2="125" stroke="#38bdf8" strokeWidth="2"/>
                  <line x1="400" y1="375" x2="400" y2="395" stroke="#38bdf8" strokeWidth="2"/>

                  {/* Top Lens Header Badge */}
                  <rect x="290" y="115" width="220" height="26" rx="10" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="1.5"/>
                  <text x="400" y="132" fill="#38bdf8" fontSize="11" fontWeight="black" textAnchor="middle">
                    {activeStep.lensMode === "blood_stream" && "🔬 فحص تيار الدم (تكبير ×1,000)"}
                    {activeStep.lensMode === "bowman_capsule" && "🔬 محفظة بومان والكبيبة (تكبير ×50,000)"}
                    {activeStep.lensMode === "filter_sieve" && "🔬 آلية الترشيح الفائق (Slits 8nm)"}
                    {activeStep.lensMode === "reabsorption_tubule" && "🔬 إعادة الامتصاص الاختياري (99%)"}
                  </text>

                  {/* LENS CONTENT 1: BLOOD STREAM (RBCs vs Urea Crystals) */}
                  {activeStep.lensMode === "blood_stream" && (
                    <g>
                      {/* 3D Biconcave Red Blood Cells */}
                      <g transform="translate(320, 220)">
                        <circle cx="0" cy="0" r="26" fill="url(#kidney3dVolume)" stroke="#fca5a5" strokeWidth="1.5"/>
                        <circle cx="0" cy="0" r="12" fill="#7f1d1d"/>
                        <text x="0" y="42" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">كرة دم حمراء (RBC)</text>
                      </g>

                      <g transform="translate(350, 310)">
                        <circle cx="0" cy="0" r="20" fill="url(#kidney3dVolume)" stroke="#fca5a5" strokeWidth="1.5"/>
                        <circle cx="0" cy="0" r="9" fill="#7f1d1d"/>
                      </g>

                      {/* Albumin Protein Globules */}
                      <g transform="translate(450, 190)">
                        <circle cx="0" cy="0" r="16" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1.5"/>
                        <text x="0" y="28" fill="#a5b4fc" fontSize="9" fontWeight="bold" textAnchor="middle">بروتين ألبومين</text>
                      </g>

                      {/* Glistening Golden Urea Crystals */}
                      <g transform="translate(460, 275)" className="animate-pulse">
                        <polygon points="0,-18 16,0 0,18 -16,0" fill="#facc15" stroke="#ca8a04" strokeWidth="2"/>
                        <text x="0" y="32" fill="#fde047" fontSize="10.5" fontWeight="black" textAnchor="middle">بلورة يوريا CO(NH2)2</text>
                      </g>

                      <g transform="translate(390, 260)">
                        <polygon points="0,-10 10,0 0,10 -10,0" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5"/>
                      </g>
                    </g>
                  )}

                  {/* LENS CONTENT 2 & 3: BOWMAN'S CAPSULE & ULTRAFILTRATION */}
                  {(activeStep.lensMode === "bowman_capsule" || activeStep.lensMode === "filter_sieve") && (
                    <g>
                      {/* Bowman's Double-Walled Cup */}
                      <path 
                        d="M 310 170 C 270 210 270 290 310 330 C 340 360 400 360 440 330" 
                        fill="none" 
                        stroke="#fbbf24" 
                        strokeWidth="10" 
                        strokeLinecap="round"
                      />
                      <text x="265" y="255" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="end">محفظة بومان</text>

                      {/* Glomerulus Capillary Cluster (Loop) */}
                      <path 
                        d="M 400 160 Q 360 210 390 250 Q 430 280 390 320" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="14" 
                        strokeLinecap="round"
                        filter="drop-shadow(0 0 6px #ef4444)"
                      />

                      {/* Slit Pores with Slipping Filtrate */}
                      <g className="animate-bounce">
                        <circle cx="340" cy="245" r="4" fill="#facc15"/>
                        <circle cx="355" cy="275" r="3.5" fill="#38bdf8"/>
                        <circle cx="345" cy="300" r="4" fill="#facc15"/>
                        <text x="360" y="350" fill="#facc15" fontSize="9.5" fontWeight="black">⬇️ راشح نافذ (يوريا + ماء)</text>
                      </g>

                      {/* Blocked Red Blood Cell Bouncing */}
                      <g transform="translate(425, 230)">
                        <circle cx="0" cy="0" r="14" fill="#ef4444" stroke="#fff" strokeWidth="2"/>
                        <text x="20" y="5" fill="#f87171" fontSize="9" fontWeight="bold">🛑 حجز خلايا الدم</text>
                      </g>
                    </g>
                  )}

                  {/* LENS CONTENT 4: SELECTIVE REABSORPTION IN TUBULE */}
                  {activeStep.lensMode === "reabsorption_tubule" && (
                    <g>
                      {/* Renal Tubule Channel */}
                      <path d="M 310 210 L 490 210" stroke="#fbbf24" strokeWidth="6" strokeDasharray="6,4"/>
                      <path d="M 310 290 L 490 290" stroke="#fbbf24" strokeWidth="6" strokeDasharray="6,4"/>

                      {/* Active Reabsorption Arrows */}
                      <path d="M 360 225 L 360 170" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)"/>
                      <text x="360" y="160" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">استعادة 99% ماء</text>

                      <path d="M 440 225 L 440 170" stroke="#34d399" strokeWidth="3" markerEnd="url(#arrow)"/>
                      <text x="440" y="160" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">استعادة 100% جلوكوز</text>

                      {/* Concentrated Urea Remaining */}
                      <circle cx="400" cy="250" r="8" fill="#facc15" stroke="#ca8a04" strokeWidth="2"/>
                      <text x="400" y="275" fill="#facc15" fontSize="10" fontWeight="black" textAnchor="middle">بقاء اليوريا المركزة</text>
                    </g>
                  )}

                  {/* Glass Specular Reflection Highlight Arc */}
                  <path d="M 280 170 A 130 130 0 0 1 520 170 A 130 90 0 0 0 280 170 Z" fill="url(#glassReflection)" opacity="0.7"/>
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* ON-CANVAS INTERACTIVE PIN CALLOUTS (CONNECTED LEADER LINES)    */}
              {/* ------------------------------------------------------------- */}
              {!isOverview && activeStep?.labels && activeStep.labels.length > 0 && (
                <g id="interactive-pins" className="animate-fade-in">
                  {activeStep.labels.map((lbl, idx) => (
                    <g key={idx} transform={`translate(${lbl.x}, ${lbl.y})`}>
                      {/* Pulsing Pin Head */}
                      <circle cx="0" cy="0" r="7" fill={lbl.color} filter="drop-shadow(0 0 6px currentColor)"/>
                      <circle cx="0" cy="0" r="14" fill="none" stroke={lbl.color} strokeWidth="1.5" opacity="0.6" className="animate-ping"/>
                      {/* Glassmorphism Chip */}
                      <rect x="-85" y="-34" width="170" height="26" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke={lbl.color} strokeWidth="1.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.8))"/>
                      <text x="0" y="-17" fill="#fff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                        {lbl.text}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Dynamic Particles Container */}
              <g ref={particlesContainerRef}></g>
            </svg>
          </div>

          {/* Structured Multi-Card Scientific Dashboard (Real Interactive HUD) */}
          <div className={`${layoutMode === "cinema" ? "w-full max-w-4xl mx-auto mt-2" : "lg:col-span-5"} bg-slate-900/95 border-2 border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3 backdrop-blur`}>
            
            {/* Section Tabs Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveInfoTab("points")}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  activeInfoTab === "points" ? "bg-teal-500/20 text-teal-300 border border-teal-500/40" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                📝 نقاط الشرح
              </button>
              <button
                onClick={() => setActiveInfoTab("balance")}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  activeInfoTab === "balance" ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🧪 ميزان السوائل
              </button>
              <button
                onClick={() => setActiveInfoTab("exam")}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  activeInfoTab === "exam" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                💡 سؤال معلل
              </button>
              <button
                onClick={() => setActiveInfoTab("numbers")}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  activeInfoTab === "numbers" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🔢 أرقام ذهبية
              </button>
            </div>

            {/* TAB 1: Core Pedagogical Points */}
            {activeInfoTab === "points" && (
              <div className="space-y-2.5 min-h-[220px]">
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
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
                        <span className="text-amber-300 font-semibold">اضغطي كليك بالماوس لبدء الرحلة المجهرية خطوة بخطوة بالترتيب!</span>
                      </li>
                    </>
                  ) : (
                    (activeStep?.keyPoints || [activeStep?.visualAction || ""]).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        <span className="text-teal-400 font-bold mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))
                  )}
                </ul>

                {/* Golden Scientific Fact */}
                {(!isOverview && activeStep?.scientificFact) && (
                  <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-600/40 rounded-xl p-2.5 mt-2">
                    <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                      💡 معلومة علمية ذهبية:
                    </span>
                    <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed font-medium">
                      {activeStep.scientificFact}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Fluid Balance & Physiological Inputs/Outputs */}
            {activeInfoTab === "balance" && (
              <div className="space-y-2 min-h-[220px] text-xs">
                {activeStep?.fluidBalance ? (
                  <>
                    <div className="bg-red-950/40 border border-red-700/50 rounded-xl p-2.5">
                      <span className="text-[11px] font-black text-red-300 flex items-center gap-1">
                        🩸 السائل الداخل (Inflow):
                      </span>
                      <p className="text-slate-200 mt-1">{activeStep.fluidBalance.inflow}</p>
                    </div>

                    <div className="bg-indigo-950/40 border border-indigo-700/50 rounded-xl p-2.5">
                      <span className="text-[11px] font-black text-indigo-300 flex items-center gap-1">
                        ⚙️ الآلية البيولوجية الحيوية:
                      </span>
                      <p className="text-slate-200 mt-1">{activeStep.fluidBalance.action}</p>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-xl p-2.5">
                      <span className="text-[11px] font-black text-emerald-300 flex items-center gap-1">
                        ✨ السائل الناتج (Outflow):
                      </span>
                      <p className="text-slate-200 mt-1">{activeStep.fluidBalance.outflow}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    ميزان السوائل يظهر في كل خطوات الترشيح والتنقية المباشرة.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Exam Question & Why (سؤال معلل للشهادات) */}
            {activeInfoTab === "exam" && (
              <div className="space-y-2.5 min-h-[220px]">
                {activeStep?.examQuestion ? (
                  <div className="bg-gradient-to-br from-amber-950/40 to-slate-950 border-2 border-amber-500/50 rounded-2xl p-3.5 space-y-2">
                    <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                      🎯 سؤال امتحان متكرر:
                    </span>
                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      {activeStep.examQuestion.q}
                    </h4>
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[11px] font-bold text-emerald-400">الإجابة النموذجية:</span>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-semibold">
                        {activeStep.examQuestion.a}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      📌 {activeStep.examQuestion.reason}
                    </span>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8 text-xs">
                    اختر خطوة لعرض السؤال الامتحاني المخصص لها.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Golden Statistics by the Numbers */}
            {activeInfoTab === "numbers" && (
              <div className="space-y-2 min-h-[220px]">
                {activeStep?.goldenNumbers && activeStep.goldenNumbers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeStep.goldenNumbers.map((num, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center flex flex-col justify-center items-center">
                        <span className="text-lg font-black text-emerald-400 tracking-tight">{num.stat}</span>
                        <span className="text-[11px] text-slate-400 font-bold mt-1">{num.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeStep?.anatomicalDetails && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1 mt-2 text-slate-300">
                    <div>📍 <b>الموقع الدقيق:</b> {activeStep.anatomicalDetails.location}</div>
                    <div>📏 <b>الأبعاد:</b> {activeStep.anatomicalDetails.dimensions}</div>
                    <div>⚖️ <b>الوزن والكتلة:</b> {activeStep.anatomicalDetails.weight}</div>
                    <div>🩸 <b>تدفق الدم:</b> {activeStep.anatomicalDetails.bloodVolume}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Prompt on Slide */}
        <div className="z-10 flex justify-between items-center bg-slate-950/70 border border-slate-800 px-4 py-1.5 rounded-xl text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="animate-bounce">👆</span>
            <span>اضغطي في أي مكان أو المسطرة (Space) للحركة التالية</span>
          </span>
          <span className="hidden sm:inline text-slate-500">
            {isOverview ? "اضغطي كليك للبدء برحلة جسم الإنسان" : `الحركة: ${currentStepIndex} من ${steps.length}`}
          </span>
        </div>
      </div>

      {/* Presentation Timeline & Navigation Bar */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
        {/* Step dots */}
        <div className="flex items-center gap-1 flex-1 max-w-2xl w-full overflow-x-auto py-1">
          <button
            onClick={() => setCurrentStepIndex(0)}
            className={`h-2.5 px-2.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
              isOverview ? "bg-amber-400 text-slate-950 scale-105" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            نظرة عامة
          </button>
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => setCurrentStepIndex(i + 1)}
              className={`h-2.5 flex-1 min-w-[14px] rounded-full transition-all duration-300 ${
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
        <div className="flex items-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center gap-1 ${
              currentStepIndex === 0
                ? "bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <span>السابق</span> ➡️
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-1.5 rounded-xl shadow-lg shadow-blue-600/30 text-xs sm:text-sm transition transform hover:scale-105 flex items-center gap-1.5"
          >
            ⬅️ <span>{isOverview ? "بدء استكشاف التفاصيل (كليك)" : "التالي (كليك)"}</span>
          </button>
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 transition"
            title="العودة لنظرة عامة"
          >
            🔄 البداية
          </button>
        </div>
      </footer>
    </div>
  );
}
