"use client";

import React, { useState, useRef, useEffect } from "react";

export interface CanvasItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "image" | "video" | "concept";
  mediaUrl?: string; // Image or Video URL
  x: number; // percentage 0 - 85
  y: number; // percentage 0 - 85
  order: number; // 1, 2, 3...
  groupId?: string; // Grouping ID
  color?: string;
}

export const PRESET_DECONSTRUCTED_PLANT_SCENE: CanvasItem[] = [
  {
    id: "item_1",
    title: "1. ضوء الشمس الذهبي (مصدر الطاقة)",
    subtitle: "الشمس الساطعة ترسل أشعتها لتبدأ عملية الطبخ في الورقة",
    type: "concept",
    mediaUrl: "",
    x: 72,
    y: 8,
    order: 1,
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: "item_2",
    title: "2. الجذور وامتصاص الماء والأملاح",
    subtitle: "الجذور تشفط الماء من التربة وترفعه عبر الساق للأوراق",
    type: "concept",
    mediaUrl: "",
    x: 38,
    y: 65,
    order: 2,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "item_3",
    title: "3. مطبخ الورقة الخضراء (الكلوروفيل)",
    subtitle: "الورقة الخضراء تجمع المقادير: ماء + ضوء + هواء",
    type: "concept",
    mediaUrl: "",
    x: 35,
    y: 28,
    order: 3,
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "item_4",
    title: "4. دخول غاز ثاني أكسيد الكربون (عبر الثغور)",
    subtitle: "فتحات الثغور تمتص CO2 من الهواء الجوي",
    type: "concept",
    mediaUrl: "",
    x: 8,
    y: 35,
    order: 4,
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "item_5",
    title: "5. خروج الأكسجين وسكر الجلوكوز (النواتج)",
    subtitle: "سكر الجلوكوز لغذاء النبات، وغاز الأكسجين لتنفس الكائنات",
    type: "concept",
    mediaUrl: "",
    x: 58,
    y: 42,
    order: 5,
    color: "from-rose-500 to-red-600",
  },
];

interface SceneAssemblerCanvasProps {
  initialItems?: CanvasItem[];
  lessonTitle?: string;
}

export default function SceneAssemblerCanvas({
  initialItems,
  lessonTitle = "لوحة تجميع المشاهد والعرض التفاعلي (باوربوينت العلوم)",
}: SceneAssemblerCanvasProps) {
  const [items, setItems] = useState<CanvasItem[]>(initialItems || PRESET_DECONSTRUCTED_PLANT_SCENE);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = nothing revealed yet, 1 = order 1 revealed, etc.
  const [backgroundTheme, setBackgroundTheme] = useState<"studio" | "dark" | "blackboard" | "white">("studio");
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Maximum order among items
  const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) : 0;

  // Handle Dragging
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isPresentationMode) return;
    setDraggedItemId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !draggedItemId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(85, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(80, ((e.clientY - rect.top) / rect.height) * 100));

    setItems((prev) =>
      prev.map((item) => (item.id === draggedItemId ? { ...item, x: Math.round(x), y: Math.round(y) } : item))
    );
    setDraggedItemId(null);
  };

  // Keyboard Navigation in Presentation Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresentationMode) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleNextStep();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        handlePreviousStep();
      } else if (e.key === "Escape") {
        setIsPresentationMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresentationMode, currentStep, maxOrder]);

  // Next step (reveal next numbered item)
  const handleNextStep = () => {
    if (currentStep < maxOrder) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Previous step (Undo / Return to previous reveal)
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Update order for an item
  const updateItemOrder = (id: string, newOrder: number) => {
    if (newOrder < 1) newOrder = 1;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, order: newOrder } : item)));
  };

  // Upload custom media (image or video)
  const handleMediaUpload = (id: string, file: File) => {
    const isVid = file.type.startsWith("video/");
    const url = URL.createObjectURL(file);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              mediaUrl: url,
              type: isVid ? "video" : "image",
            }
          : item
      )
    );
    alert(`🎉 تم رفع ${isVid ? "الفيديو" : "الصورة"} للعنصر بنجاح!`);
  };

  // Merge selected items into a group with shared order
  const handleMergeSelected = () => {
    if (selectedGroupIds.length < 2) {
      alert("الرجاء اختيار عنصرين على الأقل بالضغط عليهما لدمجهما معاً.");
      return;
    }
    const newGroupId = `group_${Date.now()}`;
    const targetOrder = Math.min(
      ...items.filter((i) => selectedGroupIds.includes(i.id)).map((i) => i.order)
    );

    setItems((prev) =>
      prev.map((item) =>
        selectedGroupIds.includes(item.id)
          ? { ...item, groupId: newGroupId, order: targetOrder }
          : item
      )
    );
    setSelectedGroupIds([]);
    alert(`🔗 تم دمج العناصر المحددة معاً! ستظهر جميعاً في الكليك رقم (${targetOrder}).`);
  };

  // Unmerge / Ungroup
  const handleUnmerge = (groupId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.groupId === groupId ? { ...item, groupId: undefined } : item))
    );
    alert("تم فك الدمج عن العناصر.");
  };

  // Toggle selection for grouping
  const toggleSelectForGroup = (id: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Add new blank item
  const handleAddNewItem = () => {
    const newItem: CanvasItem = {
      id: `item_${Date.now()}`,
      title: `عنصر جديد ${items.length + 1}`,
      subtitle: "اضغطي لتعديل النص أو رفع صورة/فيديو",
      type: "concept",
      x: 10 + (items.length * 8) % 60,
      y: 20 + (items.length * 8) % 50,
      order: maxOrder + 1,
      color: "from-blue-600 to-indigo-700",
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  // Background Theme Classes
  const themeClasses = {
    studio: "bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 border-indigo-700/50",
    dark: "bg-neutral-900 border-neutral-700",
    blackboard: "bg-gradient-to-br from-emerald-950 to-teal-950 border-emerald-700/60",
    white: "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300 text-gray-900",
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Top Header & Mode Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1 rounded-full border border-purple-200 mb-1.5">
            <span>🎬</span>
            <span>استوديو تجميع المشاهد والعرض التفاعلي (Click-to-Reveal)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">{lessonTitle}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            فككي عناصر الدرس وضعي كل صورة أو فيديو في مكانه، ورتبي ظهورها بالكليك (1، 2، 3) زي الباوربوينت تماماً!
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!isPresentationMode ? (
            <>
              <button
                onClick={handleAddNewItem}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>➕</span> إضافة عنصر جديد
              </button>

              {selectedGroupIds.length > 1 && (
                <button
                  onClick={handleMergeSelected}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 animate-pulse"
                >
                  <span>🔗</span> دمج ({selectedGroupIds.length}) عناصر معاً
                </button>
              )}

              <button
                onClick={() => {
                  setItems(PRESET_DECONSTRUCTED_PLANT_SCENE);
                  alert("تم تحميل العناصر المفككة لدرس البناء الضوئي والنبات!");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-all border border-gray-300 cursor-pointer"
                title="استعادة العناصر النموذجية لدرس النبات"
              >
                🔄 استعادة درس النبات
              </button>

              <button
                onClick={() => {
                  setIsPresentationMode(true);
                  setCurrentStep(0);
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 ring-2 ring-emerald-300"
              >
                <span>🎮</span> بدء العرض التقديمي (بالكليك)
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsPresentationMode(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>✖</span> إنهاء العرض والعودة للتحرير
            </button>
          )}
        </div>
      </div>

      {/* Presentation Mode Top Control Bar */}
      {isPresentationMode && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white p-4 rounded-2xl shadow-lg border border-blue-400 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-white/10 rounded-xl">🎯</span>
            <div>
              <span className="text-xs text-blue-200 font-medium block">وضع العرض التقديمي المباشر بالفصل</span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {currentStep === 0
                  ? "اضغطي كليك أو (التالي) لبدء إظهار أول عنصر..."
                  : `الخطوة ${currentStep} من ${maxOrder} ظاهرة الآن`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className={`py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                currentStep === 0 ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500 text-white"
              }`}
              title="زر الرجوع: يرجع خطوة لورا ويخفي آخر عنصر"
            >
              <span>⬅️</span> تراجع / خطوة للخلف (Undo)
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStep >= maxOrder}
              className={`py-2 px-5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
                currentStep >= maxOrder
                  ? "bg-emerald-800 text-white/50 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 ring-2 ring-emerald-300"
              }`}
            >
              <span>كليك / التالي ➡️</span>
            </button>

            <button
              onClick={() => setCurrentStep(0)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer"
              title="إعادة من البداية"
            >
              <span>🔄</span> من البداية
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN 16:9 INTERACTIVE CANVAS */}
      <div className="relative">
        
        {/* Background Theme Selector in Edit Mode */}
        {!isPresentationMode && (
          <div className="flex items-center justify-between mb-2 px-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">شاشة العرض (16:9):</span>
              <span>اسحبي أي عنصر بالماوس وضعي في المكان المناسب</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-600 ml-1">الخلفية:</span>
              <button
                onClick={() => setBackgroundTheme("studio")}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  backgroundTheme === "studio" ? "bg-indigo-700 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                استوديو
              </button>
              <button
                onClick={() => setBackgroundTheme("blackboard")}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  backgroundTheme === "blackboard" ? "bg-emerald-800 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                سبورة خضراء
              </button>
              <button
                onClick={() => setBackgroundTheme("white")}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  backgroundTheme === "white" ? "bg-gray-300 text-black" : "bg-gray-100 text-gray-700"
                }`}
              >
                باوربوينت أبيض
              </button>
              <button
                onClick={() => setBackgroundTheme("dark")}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  backgroundTheme === "dark" ? "bg-neutral-800 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                شاشة داكنة
              </button>
            </div>
          </div>
        )}

        {/* The 16:9 Canvas Stage */}
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            if (isPresentationMode) handleNextStep();
          }}
          className={`w-full aspect-[16/9] min-h-[460px] rounded-3xl border-4 relative overflow-hidden shadow-2xl transition-all select-none ${
            themeClasses[backgroundTheme]
          } ${isPresentationMode ? "cursor-pointer ring-4 ring-blue-500/40" : ""}`}
        >
          {/* Neon Watermark Sign */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 z-0">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full bg-cyan-950/40 shadow-cyan-500/20 shadow-lg">
              ✨ Sci.Rehab Elsibai Studio
            </span>
          </div>

          {/* Presentation Mode Helper Notice */}
          {isPresentationMode && currentStep === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none animate-pulse">
              <span className="text-5xl mb-3">👆</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                اضغطي في أي مكان على الشاشة (كليك)
              </h3>
              <p className="text-sm text-gray-300 mt-1 max-w-md">
                ليبدأ ظهور العناصر بالترتيب واحد وراء التاني كما قمتِ ببرمجتها!
              </p>
            </div>
          )}

          {/* Canvas Items */}
          {items.map((item) => {
            const isVisible = !isPresentationMode || item.order <= currentStep;
            const isSelected = selectedItemId === item.id;
            const isCheckedForGroup = selectedGroupIds.includes(item.id);

            return (
              <div
                key={item.id}
                draggable={!isPresentationMode}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPresentationMode) {
                    setSelectedItemId(item.id);
                  } else {
                    handleNextStep();
                  }
                }}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.85)",
                  pointerEvents: isVisible ? "auto" : "none",
                }}
                className={`absolute z-20 max-w-[280px] sm:max-w-[320px] transition-all duration-300 ${
                  !isPresentationMode ? "cursor-move hover:scale-105" : "cursor-pointer"
                }`}
              >
                {/* Element Card Container */}
                <div
                  className={`rounded-2xl p-3.5 shadow-xl border-2 backdrop-blur-md transition-all ${
                    isSelected && !isPresentationMode
                      ? "ring-4 ring-yellow-400 border-yellow-300 scale-105"
                      : isCheckedForGroup
                      ? "ring-4 ring-purple-400 border-purple-300"
                      : "border-white/20 hover:border-white/40"
                  } ${
                    backgroundTheme === "white"
                      ? "bg-white text-gray-900 border-gray-200 shadow-md"
                      : "bg-slate-900/90 text-white"
                  }`}
                >
                  {/* Top Bar of the Element Card */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      {/* Order Badge (The Core Requested Feature: 1, 2, 3...) */}
                      <span
                        className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow-sm"
                        title={`ترتيب الظهور عند الكليك: ${item.order}`}
                      >
                        {item.order}
                      </span>

                      {item.groupId && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold border border-purple-400/30">
                          🔗 مدمج
                        </span>
                      )}
                    </div>

                    {!isPresentationMode && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectForGroup(item.id);
                          }}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                            isCheckedForGroup
                              ? "bg-purple-600 text-white border-purple-400"
                              : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20"
                          }`}
                          title="تحديد لدمج هذا العنصر مع عناصر أخرى"
                        >
                          {isCheckedForGroup ? "✓ محدد للدمج" : "تحديد للدمج"}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="text-gray-400 hover:text-red-400 p-0.5 text-xs"
                          title="حذف هذا العنصر"
                        >
                          ✖
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Media Content (Image or Video) */}
                  {item.mediaUrl ? (
                    <div className="rounded-xl overflow-hidden mb-2 border border-white/10 bg-black/40 aspect-video flex items-center justify-center">
                      {item.type === "video" ? (
                        <video
                          src={item.mediaUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ) : null}

                  {/* Text Title & Subtitle */}
                  <div>
                    <h4 className="font-black text-xs sm:text-sm leading-snug">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-[11px] opacity-80 mt-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Item Inspector & Control Panel (Design Mode Only) */}
      {!isPresentationMode && selectedItemId && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl p-1.5 bg-blue-100 text-blue-800 rounded-lg">⚙️</span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  لوحة التحكم في العنصر المختار
                </h3>
                <p className="text-xs text-gray-500">
                  تحكم في رقم ترتيب الظهور بالكليك، أو ارفعي صورة وفيديو للعنصر
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedItemId(null)}
              className="text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              إغلاق ✕
            </button>
          </div>

          {(() => {
            const currentItem = items.find((i) => i.id === selectedItemId);
            if (!currentItem) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* 1. الترتيب عند الكليك (Requested Core Rule: اكتب عليه رقم 1 يظهر اول كليك، 2 يظهر تاني كليك) */}
                <div className="md:col-span-4 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                  <span className="text-xs font-black text-amber-900 block mb-1">
                    🔢 ترتيب الظهور عند الكليك (Order):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItemOrder(currentItem.id, currentItem.order - 1)}
                      className="w-8 h-8 rounded-lg bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={currentItem.order}
                      onChange={(e) => updateItemOrder(currentItem.id, parseInt(e.target.value) || 1)}
                      className="w-16 p-1.5 text-center font-black text-base bg-white border border-amber-300 rounded-lg"
                    />
                    <button
                      onClick={() => updateItemOrder(currentItem.id, currentItem.order + 1)}
                      className="w-8 h-8 rounded-lg bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-xs text-amber-800 font-semibold mr-1">
                      (الكليك رقم {currentItem.order})
                    </span>
                  </div>
                </div>

                {/* 2. رفع صورة أو فيديو للعنصر */}
                <div className="md:col-span-5 bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                  <span className="text-xs font-black text-blue-900 block mb-1">
                    🖼️ رفع صورة أو 🎬 فيديو متحرك لهذا الجزء:
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMediaUpload(currentItem.id, file);
                    }}
                    className="w-full text-xs text-blue-900 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                  />
                </div>

                {/* 3. تعديل العنوان */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">اسم العنصر:</label>
                  <input
                    type="text"
                    value={currentItem.title}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((it) => (it.id === currentItem.id ? { ...it, title: e.target.value } : it))
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  />
                  {currentItem.groupId && (
                    <button
                      onClick={() => handleUnmerge(currentItem.groupId!)}
                      className="mt-2 text-[11px] text-purple-700 font-bold hover:underline block"
                    >
                      🔓 فك الدمج عن هذا العنصر
                    </button>
                  )}
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* 4. Instructions Card */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-4 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-1.5">
        <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
          <span>💡</span> إرشادات سريعة للمعلمة لشرح الباوربوينت التفاعلي:
        </h4>
        <ul className="list-disc list-inside space-y-1 pr-1 text-gray-600">
          <li><strong>تحريك العناصر وتوزيعها:</strong> اسحبي أي كارت بالماوس وضعيه في المكان اللي يناسب الشرح على الشاشة.</li>
          <li><strong>ترتيب الظهور بالكليك:</strong> اضغطي على أي عنصر واكتبي رقمه (مثلاً 1 يظهر في أول كليك، 2 يظهر في تاني كليك وهكذا).</li>
          <li><strong>دمج العناصر معاً:</strong> علمي على زر "تحديد للدمج" في كذا عنصر واضغطي على زر "دمج العناصر معاً" ليظهروا سوا في نفس الكليك.</li>
          <li><strong>أثناء العرض:</strong> كل ما تضغطي كليك بالماوس (أو مسافة بالكيبورد) يظهر العنصر اللي عليه الدور. وإذا حبيتي ترجعي خطوة للخلف اضغطي على زر "تراجع / السابق" أو سهم للخلف.</li>
        </ul>
      </div>

    </div>
  );
}
