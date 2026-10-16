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
  visualAction: string;
  particleType: "incoming_blood" | "waste_particles" | "filtering_action" | "urine_flow" | "clean_blood_return" | "oxygen_flow" | "co2_flow" | "food_flow" | "energy_pulse" | "generic_flow";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<SVGGElement>(null);

  const steps = presentation.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setCurrentStepIndex(0); // loop back
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation: Space, Arrow Left/Right, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "Enter") {
        e.preventDefault();
        nextStep();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        prevStep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, steps.length]);

  // Dynamic particle animations
  useEffect(() => {
    const container = particlesContainerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const type = currentStep.particleType;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 25 && container.firstChild) {
        container.removeChild(container.firstChild);
      }

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

      if (type === "incoming_blood" || type === "waste_particles") {
        const isLeft = Math.random() > 0.5;
        const isWaste = type === "waste_particles" && Math.random() > 0.35;
        circle.setAttribute("cx", "370");
        circle.setAttribute("cy", "60");
        circle.setAttribute("r", isWaste ? "4.5" : "3.5");
        circle.setAttribute("fill", isWaste ? "#facc15" : "#ef4444");
        circle.setAttribute("opacity", "0.9");
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
      } else if (type === "filtering_action") {
        const isLeft = Math.random() > 0.5;
        const kX = isLeft ? 220 + (Math.random() * 40 - 20) : 580 + (Math.random() * 40 - 20);
        const kY = 240 + (Math.random() * 60 - 30);
        circle.setAttribute("cx", kX.toString());
        circle.setAttribute("cy", kY.toString());
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", Math.random() > 0.5 ? "#fbbf24" : "#38bdf8");
        container.appendChild(circle);
        setTimeout(() => circle.remove(), 1200);
      } else if (type === "urine_flow") {
        const isLeft = Math.random() > 0.5;
        const startX = isLeft ? 245 : 555;
        circle.setAttribute("cx", startX.toString());
        circle.setAttribute("cy", "280");
        circle.setAttribute("r", "4.5");
        circle.setAttribute("fill", "#facc15");
        circle.setAttribute("stroke", "#ca8a04");
        circle.setAttribute("stroke-width", "1");
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
        circle.setAttribute("cx", startX.toString());
        circle.setAttribute("cy", "240");
        circle.setAttribute("r", "4");
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
      } else {
        // Generic / pulse flow
        const angle = Math.random() * Math.PI * 2;
        const r = 40 + Math.random() * 80;
        circle.setAttribute("cx", (400 + Math.cos(angle) * r).toString());
        circle.setAttribute("cy", (250 + Math.sin(angle) * r).toString());
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#38bdf8");
        container.appendChild(circle);
        setTimeout(() => circle.remove(), 1000);
      }
    }, 180);

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

  const exportStandaloneHTML = () => {
    const html = generateStandaloneHtml(presentation);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `عرض_تفاعلي_${presentation.title.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    alert("🎉 تم تحميل ملف العرض التفاعلي بنجاح! يمكنك فتحه في أي متصفح بدون إنترنت أو استخدامه كباوربوينت تفاعلي.");
  };

  return (
    <div 
      ref={containerRef}
      className="bg-slate-950 text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col gap-4 max-w-6xl mx-auto my-6 select-none font-sans"
      dir="rtl"
    >
      {/* Top Header */}
      <header className="flex flex-wrap justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl px-6 py-4 shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping"></span>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-md font-bold">
                عرض باوربوينت تفاعلي (كليك لكل حركة)
              </span>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                {presentation.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              تحكم كامل بالماوس أو المسطرة (Spacebar / Click) - لا يوجد فيديو ولا كرتون، الشرح كله من المعلمة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-sm font-bold px-3.5 py-1.5 rounded-full">
            الحركة {currentStep.stepNumber} من {steps.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1 font-medium"
            title="ملء الشاشة للشرح على البروجكتور أو الزووم"
          >
            <span>🖥️</span> ملء الشاشة
          </button>
          <button
            onClick={exportStandaloneHTML}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1 font-bold"
            title="تحميل كملف يعمل بدون إنترنت على أي جهاز أو باوربوينت"
          >
            <span>📥</span> تحميل العرض التفاعلي (HTML)
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
              title="إغلاق العرض"
            >
              ✖
            </button>
          )}
        </div>
      </header>

      {/* Teacher Speaking Cue Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="md:col-span-1 flex flex-col justify-center border-b md:border-b-0 md:border-l border-slate-800 pb-3 md:pb-0 md:pl-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
            {currentStep.category || "المرحلة الحالية"}
          </span>
          <h3 className="text-xl font-black text-white mt-1">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {currentStep.visualAction}
          </p>
        </div>

        <div className="md:col-span-2 bg-blue-950/70 border border-blue-800/60 rounded-xl p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🎙️</span>
            <span className="text-xs font-bold text-blue-300">
              ماذا تقول المعلمة في هذا الكليك (شرح حي مباشر للأطفال):
            </span>
          </div>
          <p className="text-slate-100 text-base font-semibold leading-relaxed">
            "{currentStep.teacherScript}"
          </p>
        </div>
      </div>

      {/* Interactive Presentation Stage */}
      <div 
        onClick={nextStep}
        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-center p-4 cursor-pointer overflow-hidden min-h-[460px] shadow-2xl group"
        title="اضغط في أي مكان أو اضغط المسطرة (Spacebar) للحركة التالية"
      >
        <svg viewBox="0 0 800 500" className="w-full h-full max-h-[460px] drop-shadow-2xl">
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

          {/* Diagram Render: Kidneys / Heart / Generic */}
          {presentation.diagramType === "kidneys" ? (
            <g>
              {/* Human Body Silhouette Hint */}
              <path 
                d="M 280 40 Q 400 20 520 40 Q 560 250 540 480 Q 400 490 260 480 Q 240 250 280 40 Z" 
                fill="rgba(30, 41, 59, 0.25)" 
                stroke="rgba(71, 85, 105, 0.4)" 
                strokeDasharray="6,6" 
                strokeWidth="2"
              />

              {/* Main Artery */}
              <path d="M 370 30 L 370 480" stroke="url(#arteryGrad)" strokeWidth="22" strokeLinecap="round"/>
              <path d="M 370 210 Q 320 210 270 230" fill="none" stroke="url(#arteryGrad)" strokeWidth="14" strokeLinecap="round"/>
              <path d="M 370 210 Q 450 210 530 230" fill="none" stroke="url(#arteryGrad)" strokeWidth="14" strokeLinecap="round"/>

              {/* Main Vein */}
              <path d="M 430 30 L 430 480" stroke="url(#veinGrad)" strokeWidth="20" strokeLinecap="round"/>
              <path d="M 270 250 Q 350 250 430 240" fill="none" stroke="url(#veinGrad)" strokeWidth="12" strokeLinecap="round"/>
              <path d="M 530 250 Q 480 250 430 240" fill="none" stroke="url(#veinGrad)" strokeWidth="12" strokeLinecap="round"/>

              {/* Ureters & Bladder */}
              <path d="M 245 280 Q 280 380 370 430" fill="none" stroke="url(#ureterGrad)" strokeWidth="10" strokeLinecap="round"/>
              <path d="M 555 280 Q 520 380 430 430" fill="none" stroke="url(#ureterGrad)" strokeWidth="10" strokeLinecap="round"/>
              <ellipse cx="400" cy="445" rx="50" ry="32" fill="#ca8a04" opacity="0.85" stroke="#facc15" strokeWidth="3"/>

              {/* Left Kidney */}
              <g className={`transition-all duration-500 ${currentStep.activeGlow ? "filter-pulse" : ""}`}>
                <path 
                  d="M 250 150 C 190 150 170 210 170 250 C 170 310 200 350 250 350 C 280 350 285 300 270 260 C 260 230 270 190 280 170 C 275 155 260 150 250 150 Z" 
                  fill="url(#kidneyGlow)" 
                  stroke="#f87171" 
                  strokeWidth="4"
                  filter={currentStep.activeGlow ? "url(#pulseGlow)" : undefined}
                />
                {/* Filters */}
                <g opacity={currentStep.showFilters ? "1" : "0"} className="transition-opacity duration-700">
                  <circle cx="210" cy="230" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="230" cy="270" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="215" cy="300" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" strokeWidth="1.5"/>
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
              <g className={`transition-all duration-500 ${currentStep.activeGlow ? "filter-pulse" : ""}`}>
                <path 
                  d="M 550 150 C 610 150 630 210 630 250 C 630 310 600 350 550 350 C 520 350 515 300 530 260 C 540 230 530 190 520 170 C 525 155 540 150 550 150 Z" 
                  fill="url(#kidneyGlow)" 
                  stroke="#f87171" 
                  strokeWidth="4"
                  filter={currentStep.activeGlow ? "url(#pulseGlow)" : undefined}
                />
                {/* Filters */}
                <g opacity={currentStep.showFilters ? "1" : "0"} className="transition-opacity duration-700">
                  <circle cx="590" cy="230" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="570" cy="270" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="585" cy="300" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" strokeWidth="1.5"/>
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
            </g>
          ) : (
            /* Generic / Scientific Stage SVG */
            <g>
              <rect x="150" y="80" width="500" height="340" rx="30" fill="rgba(30, 41, 59, 0.4)" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8,8"/>
              <circle cx="400" cy="250" r="110" fill="url(#kidneyGlow)" stroke="#38bdf8" strokeWidth="4" filter="url(#pulseGlow)"/>
              <path d="M 100 250 L 290 250" stroke="#ef4444" strokeWidth="16" strokeLinecap="round"/>
              <path d="M 510 250 L 700 250" stroke="#38bdf8" strokeWidth="16" strokeLinecap="round"/>
              <text x="400" y="255" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">
                {presentation.topic}
              </text>
            </g>
          )}

          {/* Dynamic Animated Particles Container */}
          <g ref={particlesContainerRef}></g>

          {/* Floating Scientific Labels */}
          {currentStep.labels.map((lbl, idx) => {
            const padding = 14;
            const textLen = lbl.text.length * 8.5 + padding * 2;
            return (
              <g key={idx} className="transition-all duration-300">
                <rect 
                  x={lbl.x - textLen / 2} 
                  y={lbl.y - 18} 
                  width={textLen} 
                  height={28} 
                  rx="14" 
                  fill="rgba(15, 23, 42, 0.9)" 
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

        {/* Hover Click Hint */}
        <div className="absolute bottom-4 left-6 bg-slate-950/85 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-300 flex items-center gap-2 pointer-events-none group-hover:scale-105 transition-transform shadow-lg">
          <span className="text-base animate-bounce">👆</span>
          <span>اضغط كليك بالماوس في أي مكان، أو اضغط المسطرة (Space) للانتقال للحركة التالية</span>
        </div>
      </div>

      {/* Presentation Timeline & Controls */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        {/* Step dots */}
        <div className="flex items-center gap-2 flex-1 max-w-xl w-full">
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

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition flex items-center gap-1.5 ${
              currentStepIndex === 0
                ? "bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <span>السابق</span> ➡️
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 text-sm transition transform hover:scale-105 flex items-center gap-2"
          >
            ⬅️ <span>التالي (كليك)</span>
          </button>
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition"
            title="إعادة العرض من البداية"
          >
            🔄 البداية
          </button>
        </div>
      </footer>
    </div>
  );
}

// Helper to generate a completely self-contained offline HTML file
function generateStandaloneHtml(presentation: InteractivePresentation): string {
  const stepsJson = JSON.stringify(presentation.steps);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>العرض التقديمي التفاعلي: ${presentation.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse-glow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6)); }
      50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.95)); }
    }
    .active-glow { animation: pulse-glow 2s infinite ease-in-out; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-between p-4 select-none font-sans">
  <header class="w-full max-w-5xl flex justify-between items-center bg-slate-900/90 border border-slate-800 rounded-2xl px-6 py-4 shadow-xl">
    <div>
      <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
        ${presentation.title}
      </h1>
      <p class="text-xs text-slate-400">عرض تفاعلي كليك لكل حركة - إعداد: Sci.Rehab Elsibai</p>
    </div>
    <div class="flex items-center gap-3">
      <span id="step-badge" class="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-sm font-bold px-3 py-1.5 rounded-full">
        الخطوة 1 من ${presentation.steps.length}
      </span>
      <button onclick="toggleFullscreen()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition">
        🖥️ ملء الشاشة
      </button>
    </div>
  </header>

  <main class="w-full max-w-5xl my-4 flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
    <div class="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-teal-400" id="step-category">المرحلة الحالية:</span>
        <h2 id="step-title" class="text-2xl font-black text-white mt-0.5"></h2>
      </div>
      <div class="bg-blue-950/70 border border-blue-800/60 rounded-xl px-4 py-2.5 max-w-md">
        <span class="text-xs font-bold text-blue-400 flex items-center gap-1">🎙️ ماذا تقول المعلمة في هذا الكليك:</span>
        <p id="teacher-script" class="text-sm text-slate-100 mt-1 leading-relaxed font-semibold"></p>
      </div>
    </div>

    <div class="relative flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4 cursor-pointer overflow-hidden" onclick="nextStep()">
      <svg id="stage-svg" viewBox="0 0 800 500" class="w-full h-full max-h-[460px] drop-shadow-2xl">
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

        <path d="M 280 40 Q 400 20 520 40 Q 560 250 540 480 Q 400 490 260 480 Q 240 250 280 40 Z" fill="rgba(30, 41, 59, 0.25)" stroke="rgba(71, 85, 105, 0.4)" stroke-dasharray="6,6" stroke-width="2"/>
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
            <circle cx="210" cy="230" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
            <circle cx="230" cy="270" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
            <circle cx="215" cy="300" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
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
            <circle cx="590" cy="230" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
            <circle cx="570" cy="270" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
            <circle cx="585" cy="300" r="14" fill="#fbbf24" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
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

        <g id="particles-container"></g>
        <g id="labels-layer"></g>
      </svg>
      <div class="absolute bottom-3 left-4 bg-slate-950/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-400">
        👆 اضغط كليك في أي مكان أو اضغط المسطرة للحركة التالية
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
      <div id="prog-bar-container" class="flex items-center gap-1.5 flex-1 max-w-xl"></div>
      <div class="flex items-center gap-2">
        <button onclick="prevStep()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl border border-slate-700 text-sm">السابق ➡️</button>
        <button onclick="nextStep()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl text-sm shadow-lg shadow-blue-600/30">⬅️ التالي (كليك)</button>
      </div>
    </div>
  </main>

  <script>
    const steps = ${stepsJson};
    let currentStepIndex = 0;
    let animInterval = null;

    function renderStep() {
      const step = steps[currentStepIndex];
      document.getElementById("step-badge").textContent = "الخطوة " + step.stepNumber + " من " + steps.length;
      document.getElementById("step-title").textContent = step.title;
      document.getElementById("step-category").textContent = "المرحلة: " + step.category;
      document.getElementById("teacher-script").textContent = step.teacherScript;

      const progContainer = document.getElementById("prog-bar-container");
      progContainer.innerHTML = "";
      steps.forEach((_, idx) => {
        const div = document.createElement("div");
        div.className = "h-2 flex-1 rounded-full transition-all " + (idx <= currentStepIndex ? "bg-gradient-to-r from-teal-400 to-blue-500" : "bg-slate-800");
        progContainer.appendChild(div);
      });

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
        rect.setAttribute("fill", "rgba(15, 23, 42, 0.9)");
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
    }

    function spawnParticles(type) {
      if (animInterval) clearInterval(animInterval);
      const container = document.getElementById("particles-container");
      container.innerHTML = "";
      let count = 0;
      animInterval = setInterval(() => {
        count++;
        if (count > 25 && container.firstChild) container.removeChild(container.firstChild);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        if (type === "incoming_blood" || type === "waste_particles") {
          const isLeft = Math.random() > 0.5;
          const isWaste = (type === "waste_particles") && (Math.random() > 0.35);
          circle.setAttribute("cx", "370");
          circle.setAttribute("cy", "60");
          circle.setAttribute("r", isWaste ? "4.5" : "3.5");
          circle.setAttribute("fill", isWaste ? "#facc15" : "#ef4444");
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
        } else if (type === "filtering_action") {
          const isLeft = Math.random() > 0.5;
          circle.setAttribute("cx", isLeft ? 220 + (Math.random()*40-20) : 580 + (Math.random()*40-20));
          circle.setAttribute("cy", 240 + (Math.random()*60-30));
          circle.setAttribute("r", "4");
          circle.setAttribute("fill", Math.random() > 0.5 ? "#fbbf24" : "#38bdf8");
          container.appendChild(circle);
          setTimeout(() => circle.remove(), 1200);
        } else if (type === "urine_flow") {
          const isLeft = Math.random() > 0.5;
          const startX = isLeft ? 245 : 555;
          circle.setAttribute("cx", startX);
          circle.setAttribute("cy", "280");
          circle.setAttribute("r", "4.5");
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
          circle.setAttribute("cx", startX);
          circle.setAttribute("cy", "240");
          circle.setAttribute("r", "4");
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
      }, 180);
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
