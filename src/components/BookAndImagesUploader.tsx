"use client";

import React, { useRef, useState, useEffect } from "react";

export interface UploadedImageItem {
  file: File;
  previewUrl: string;
  id: string;
}

interface BookAndImagesUploaderProps {
  onAnalyze: (pdfFile: File | null, images: File[], startPage?: number, endPage?: number) => void;
  isAnalyzing: boolean;
  onLoadPreset?: () => void;
  onAutoPlan?: (topic: string, pdfFile: File | null, startPage?: number, endPage?: number) => void;
  isPlanning?: boolean;
}

export default function BookAndImagesUploader({
  onAnalyze,
  isAnalyzing,
  onLoadPreset,
  onAutoPlan,
  isPlanning = false
}: BookAndImagesUploaderProps) {
  // Mode selection: "auto_generate" (AI invents consistent progressive images) or "manual_upload" (User uploads own images)
  const [subMode, setSubMode] = useState<"auto_generate" | "manual_upload">("auto_generate");
  const [topicInput, setTopicInput] = useState<string>("رحلة الكليتين وتنقية الدم في جسم الإنسان");

  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<string>("");
  const [endPage, setEndPage] = useState<string>("");
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Images state (for manual upload)
  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingImages, setIsDraggingImages] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setPdfFile(file);
      } else {
        alert("الرجاء اختيار ملف PDF صالح لكتاب المدرسة.");
      }
    }
  };

  const addImageFiles = (files: FileList | File[]) => {
    const newItems: UploadedImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        newItems.push({
          file,
          previewUrl: URL.createObjectURL(file),
          id: `${Date.now()}_${Math.random()}_${i}`
        });
      }
    }
    if (newItems.length > 0) {
      setImages(prev => [...prev, ...newItems]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImageFiles(e.target.files);
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const item = prev.find(img => img.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(img => img.id !== id);
    });
  };

  const clearAllImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  // Support paste (Ctrl+V) anywhere
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (subMode !== "manual_upload") return;
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) pastedFiles.push(blob);
        }
      }
      if (pastedFiles.length > 0) {
        addImageFiles(pastedFiles);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [subMode]);

  const handleManualSubmit = () => {
    if (images.length === 0) {
      alert("الرجاء رفع صورة واحدة على الأقل من صور الدرس ليتم تحريكها وربطها بالشرح.");
      return;
    }

    let startNum: number | undefined;
    let endNum: number | undefined;
    if (startPage) startNum = parseInt(startPage);
    if (endPage) endNum = parseInt(endPage);

    onAnalyze(
      pdfFile, 
      images.map(img => img.file),
      startNum,
      endNum
    );
  };

  const handleAutoSubmit = () => {
    if (!topicInput.trim() && !pdfFile) {
      alert("يرجى كتابة موضوع الدرس أو إرفاق ملف كتاب المدرسة.");
      return;
    }
    let startNum: number | undefined;
    let endNum: number | undefined;
    if (startPage) startNum = parseInt(startPage);
    if (endPage) endNum = parseInt(endPage);

    if (onAutoPlan) {
      onAutoPlan(topicInput.trim(), pdfFile, startNum, endNum);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6" dir="rtl">
      
      {/* Preset Banner */}
      {onLoadPreset && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌟</span>
            <div>
              <h4 className="font-extrabold text-amber-950 text-base">
                نموذج جاهز الآن: رحلة الكليتين وتنقية الدم (5 صور مكملة لبعضها)
              </h4>
              <p className="text-xs text-amber-800">
                شاهدِ كيف تكون الصورة الأساسية ثابتة ولا يتغير سوى الجزء المشروح، مع برومبت التحريك والشرح الصوتي بدون أي نصوص بالفيديو!
              </p>
            </div>
          </div>
          <button
            onClick={onLoadPreset}
            className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm py-2 px-5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
          >
            استعراض النموذج الآن 🚀
          </button>
        </div>
      )}

      {/* SubMode Toggle: AI Invents vs User Uploads */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-1.5 bg-gray-100 rounded-xl border border-gray-200">
        <button
          type="button"
          onClick={() => setSubMode("auto_generate")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subMode === "auto_generate"
              ? "bg-blue-700 text-white shadow-sm"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          <span>🎨</span>
          <span>1. الذكاء الاصطناعي يبتكر صوراً متناسقة ومكملة لبعضها (الموصى به)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubMode("manual_upload")}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            subMode === "manual_upload"
              ? "bg-blue-700 text-white shadow-sm"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          <span>📁</span>
          <span>2. رفع صور الدرس من جهازي (إذا كان لدي صور جاهزة)</span>
        </button>
      </div>

      {/* MODE 1: AI Invents Consistent Progressive Images */}
      {subMode === "auto_generate" && (
        <div className="space-y-5 border border-blue-200 bg-blue-50/30 p-5 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                ابتكار رحلة صور مترابطة ومتناسقة (نفس البيئة ونفس المجسم يتغير فقط الجزء المشروح)
              </h3>
              <p className="text-xs text-gray-500">
                الذكاء الاصطناعي سيبتكر الصور المتسلسلة ويكتب تحت كل صورة برومبت التحريك لمولدات الفيديو وكلام الشرح بصوت المعلمة رحاب.
              </p>
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              موضوع الدرس المطلوب ابتكار صوره وشرحه:
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="مثال: رحلة الكليتين وتنقية الدم في جسم الإنسان (أو الجهاز الهضمي، الدورة الدموية)"
              className="w-full p-3.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-xs"
            />
          </div>

          {/* Optional PDF Upload */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700">
                📚 إرفاق كتاب المدرسة أو المذكرة (اختياري لربط المعلومات بالمنهج الحرفي):
              </span>
              {pdfFile && (
                <button 
                  onClick={() => setPdfFile(null)}
                  className="text-xs text-red-600 hover:underline"
                >
                  إلغاء الملف
                </button>
              )}
            </div>

            <input 
              type="file" 
              accept=".pdf" 
              ref={pdfInputRef} 
              onChange={handlePdfChange} 
              className="hidden" 
            />

            {!pdfFile ? (
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="w-full py-3 border border-dashed border-gray-300 hover:border-blue-500 rounded-lg text-xs text-gray-600 hover:text-blue-700 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>📄 اضغطي لإرفاق ملف PDF للدرس (اختياري)</span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-blue-900 truncate">{pdfFile.name}</span>
                <div className="flex items-center gap-1">
                  <span>الصفحات:</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="من"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    className="w-14 p-1 text-center border rounded"
                  />
                  <span>إلى</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="إلى"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    className="w-14 p-1 text-center border rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleAutoSubmit}
            disabled={isPlanning}
            className={`w-full py-4 px-6 rounded-xl font-black text-lg text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
              isPlanning
                ? "bg-gray-400 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            }`}
          >
            {isPlanning ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري ابتكار الصور المترابطة والشرح وبرومبتات التحريك...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✨</span>
                <span>ابتكار الصور المترابطة والشرح وبرومبتات التحريك آلياً</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* MODE 2: Manual Upload of Images */}
      {subMode === "manual_upload" && (
        <div className="space-y-6">
          {/* PDF Book Upload */}
          <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">1. كتاب المدرسة أو المذكرة (PDF)</h3>
                  <p className="text-xs text-gray-500">ارفعي الكتاب وحددي الصفحات ليفهم الذكاء الاصطناعي الشرح الأكاديمي بدقة</p>
                </div>
              </div>
              {pdfFile && (
                <button 
                  onClick={() => setPdfFile(null)}
                  className="text-xs text-red-600 hover:underline"
                >
                  إلغاء الملف
                </button>
              )}
            </div>

            <input 
              type="file" 
              accept=".pdf" 
              ref={pdfInputRef} 
              onChange={handlePdfChange} 
              className="hidden" 
            />

            {!pdfFile ? (
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl bg-white hover:bg-blue-50/70 transition-all text-blue-700 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span className="text-2xl">📄</span>
                <span>اضغطي هنا لاختيار ملف PDF لكتاب المدرسة</span>
              </button>
            ) : (
              <div className="bg-white p-3.5 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate max-w-md">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-bold text-sm text-gray-800 truncate">{pdfFile.name}</p>
                    <p className="text-xs text-gray-500">{(pdfFile.size / (1024 * 1024)).toFixed(2)} ميجابايت</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">الصفحات:</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="من"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    className="w-16 p-1.5 text-center text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <span className="text-gray-500 text-xs">إلى</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="إلى"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    className="w-16 p-1.5 text-center text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Multi-image Upload */}
          <div className="border border-purple-100 bg-purple-50/40 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖼️</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    2. صور الدرس التوضيحية من جهازك
                  </h3>
                  <p className="text-xs text-gray-500">
                    ارفعي صور ومخططات الدرس بالترتيب.. الذكاء الاصطناعي سيكتب تحت كل صورة برومبت تحريكها وكلام الشرح المناسب لها
                  </p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-purple-200 text-purple-900 px-2.5 py-1 rounded-full">
                    {images.length} صورة مرفوعة
                  </span>
                  <button
                    onClick={clearAllImages}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    مسح الكل
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDraggingImages(true); }}
              onDragLeave={() => setIsDraggingImages(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingImages(false);
                if (e.dataTransfer.files) addImageFiles(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white cursor-pointer ${
                isDraggingImages 
                  ? "border-purple-600 bg-purple-50 scale-[1.01]" 
                  : "border-purple-300 hover:border-purple-500 hover:bg-purple-50/50"
              }`}
              onClick={() => imageInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl">
                  ➕
                </div>
                <p className="font-bold text-gray-800 text-base">
                  اضغطي لاختيار صور الدرس أو اسحبي الصور هنا
                </p>
                <p className="text-xs text-gray-500">
                  يمكنك رفع عدة صور معاً دفعة واحدة، أو اللصق المباشر (Ctrl + V)
                </p>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-600 mb-2">ترتيب الصور المرفوعة:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {images.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="relative group bg-white rounded-lg border border-purple-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1.5 right-1.5 bg-purple-900/90 text-white font-bold text-[11px] px-2 py-0.5 rounded-md shadow-xs">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(item.id);
                          }}
                          className="absolute top-1.5 left-1.5 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition-opacity shadow-xs"
                          title="حذف الصورة"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="p-2 text-center bg-gray-50 border-t border-gray-100">
                        <p className="text-[11px] font-bold text-gray-700 truncate" title={item.file.name}>
                          {item.file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={images.length === 0 || isAnalyzing}
            className={`w-full py-4 px-6 rounded-xl font-extrabold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
              images.length === 0 || isAnalyzing
                ? "bg-gray-400 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري تحليل الصور وربطها بالدرس وتوليد برومبتات التحريك والشرح...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✨</span>
                <span>تحليل الصور المرفوعة وربطها بالدرس وتوليد برومبتات التحريك والشرح</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
