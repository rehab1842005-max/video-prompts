"use client";

import React, { useState } from "react";

export interface VideoPrompt {
  id: string;
  videoNumber: number;
  pageNumber: number;
  partName: string;
  duration: string;
  imagePrompt?: string;
  imageContinuityNote?: string;
  startContinuity: string;
  scene: string;
  character: string;
  action: string;
  camera: string;
  dialogue: string;
  audio: string;
  endContinuity: string;
  continuityToNext: string;
  fullText: string;
}

interface PromptResultListProps {
  prompts: VideoPrompt[] | null;
  onRegenerate: (index: number) => void;
  onAddPrompt?: (prompt: VideoPrompt) => void;
  teacherOutfit?: string;
}

export default function PromptResultList({ 
  prompts, 
  onRegenerate,
  onAddPrompt,
  teacherOutfit
}: PromptResultListProps) {
  const [outroInput, setOutroInput] = useState("");
  const [isGeneratingOutro, setIsGeneratingOutro] = useState(false);

  if (!prompts || prompts.length === 0) return null;

  const copyToClipboard = (text: string, label = "تم النسخ بنجاح!") => {
    navigator.clipboard.writeText(text);
    alert(label);
  };

  const copyAll = () => {
    const allText = prompts.map(p => p.fullText).join("\n\n---\n\n");
    copyToClipboard(allText, "تم نسخ جميع الـ Prompts بنجاح!");
  };

  const copyAllImages = () => {
    const allImages = prompts
      .filter(p => p.imagePrompt)
      .map(p => `VIDEO ${p.videoNumber.toString().padStart(2, '0')} IMAGE PROMPT:\n${p.imagePrompt}`)
      .join("\n\n---\n\n");
    if (!allImages) {
      alert("لا توجد برومبتات صور مخصصة في هذا الوضع.");
      return;
    }
    copyToClipboard(allImages, "تم نسخ جميع برومبتات الصور بنجاح!");
  };

  const hasImagePrompts = prompts.some(p => p.imagePrompt);

  const handleGenerateOutro = async () => {
    const lastPrompt = prompts[prompts.length - 1];
    const textToSend = outroInput.trim() || (lastPrompt ? lastPrompt.fullText : "");
    
    if (!textToSend) {
      alert("الرجاء وضع نص آخر برومبت أو الضغط على زر الاستيراد التلقائي.");
      return;
    }

    setIsGeneratingOutro(true);
    try {
      const nextNum = lastPrompt ? lastPrompt.videoNumber + 1 : prompts.length + 1;
      const res = await fetch("/api/outro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastPromptText: textToSend,
          teacherOutfit: teacherOutfit,
          videoNumber: nextNum,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "فشل توليد الخاتمة");
      }

      const data = await res.json();
      if (data.prompt && onAddPrompt) {
        onAddPrompt(data.prompt);
        alert("🎉 تم توليد مشهد الخاتمة والتوديع وإضافته بنجاح إلى قائمة الفيديوهات بالأسفل!");
      }
    } catch (e: any) {
      alert("حدث خطأ أثناء توليد الخاتمة: " + e.message);
    } finally {
      setIsGeneratingOutro(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800">4. النتائج (Video Prompts)</h2>
        <div className="flex flex-wrap gap-2">
          {hasImagePrompts && (
            <button
              onClick={copyAllImages}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-3 rounded text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>🖼️</span> نسخ كل برومبتات الصور فقط
            </button>
          )}
          <button
            onClick={copyAll}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded text-xs transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>📋</span> نسخ جميع البرومبتات كاملة
          </button>
        </div>
      </div>

      <div className="space-y-8" dir="rtl">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
            {/* Header */}
            <div className="bg-gray-200 p-3 border-b border-gray-300 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-bold text-lg text-gray-800 ml-2">VIDEO {prompt.videoNumber.toString().padStart(2, '0')}</span>
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">صفحة: {prompt.pageNumber}</span>
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">الجزء: {prompt.partName}</span>
                <span className="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded">المدة: {prompt.duration}</span>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => copyToClipboard(prompt.fullText)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded shadow-sm"
                >
                  نسخ الكل
                </button>
                <button
                  onClick={() => onRegenerate(index)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1 px-3 rounded shadow-sm"
                >
                  إعادة إنشاء
                </button>
              </div>
            </div>

            {/* If Image Prompt Exists */}
            {prompt.imagePrompt && (
              <div className="p-4 bg-purple-50 border-b border-purple-200" dir="ltr">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded">
                      STEP 1: IMAGE PROMPT (الصورة المرجعية)
                    </span>
                    <span className="text-xs text-purple-700 font-medium hidden sm:inline">
                      (استخدمها في Midjourney / Recraft / DALL-E / Bing)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(prompt.imagePrompt || "", "تم نسخ برومبت الصورة بنجاح!")}
                    className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-1 px-3 rounded shadow-sm flex items-center gap-1"
                  >
                    <span>🖼️</span> نسخ برومبت الصورة
                  </button>
                </div>
                <div className="p-3 bg-white rounded border border-purple-200 font-mono text-xs text-purple-950 whitespace-pre-wrap">
                  {prompt.imagePrompt}
                </div>
                {prompt.imageContinuityNote && (
                  <div className="mt-2 text-xs text-purple-900 bg-purple-100/70 p-2 rounded border border-purple-200" dir="rtl">
                    <span className="font-bold ml-1">🔗 سلسلة الترابط:</span>
                    {prompt.imageContinuityNote}
                  </div>
                )}
              </div>
            )}
            
            {/* Video Motion Prompt */}
            <div className="p-4 bg-white font-mono text-sm text-gray-800 text-left" dir="ltr">
              {prompt.imagePrompt && (
                <div className="mb-3 pb-2 border-b border-gray-200 flex justify-between items-center">
                  <span className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded">
                    STEP 2: IMAGE-TO-VIDEO MOTION PROMPT (تحريك الصورة)
                  </span>
                  <button
                    onClick={() => {
                      const videoOnly = `ACTION:\n${prompt.action}\n\nCAMERA:\n${prompt.camera}\n\nDIALOGUE:\n${prompt.dialogue}\n\nAUDIO:\n${prompt.audio}`;
                      copyToClipboard(videoOnly, "تم نسخ برومبت تحريك الفيديو بنجاح!");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded shadow-sm flex items-center gap-1"
                  >
                    <span>🎬</span> نسخ أمر التحريك فقط
                  </button>
                </div>
              )}

              <p className="font-bold text-blue-800">SCENE:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.scene}</p>

              <p className="font-bold text-blue-800">CHARACTER / SUBJECT:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.character}</p>

              <p className="font-bold text-blue-800">ACTION / MOTION:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.action}</p>

              <p className="font-bold text-blue-800">CAMERA:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.camera}</p>

              <p className="font-bold text-green-700">DIALOGUE & VOICEOVER:</p>
              <p className="whitespace-pre-wrap mb-4 text-right text-lg font-sans" dir="rtl">{prompt.dialogue}</p>

              <p className="font-bold text-blue-800">AUDIO:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.audio}</p>

              {prompt.endContinuity && (
                <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
                  <span className="font-bold text-gray-800">END STATE (تسليم المشهد القادم): </span>
                  <span className="font-sans" dir="rtl">{prompt.endContinuity}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5. قسم توليد الخاتمة والتوديع */}
      <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 shadow-md" dir="rtl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎉</span>
          <div>
            <h3 className="text-xl font-bold text-amber-900">5. توليد مشهد خاتمة وتوديع للدرس (Outro Video Prompt)</h3>
            <p className="text-xs text-amber-700 mt-1">مشهد سينمائي احتفالي للمعلمة رحاب لتلخيص ما تم إنجازه، تهنئة الأبطال، وتوديعهم وتشويقهم للحلقة القادمة مع لافتة Sci.Rehab Elsibai.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">
                نص آخر برومبت (لربط الخاتمة بموضوع الشرح):
              </label>
              <button
                type="button"
                onClick={() => {
                  const last = prompts[prompts.length - 1];
                  if (last) {
                    setOutroInput(last.fullText);
                  }
                }}
                className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold py-1 px-3 rounded transition-colors"
              >
                📥 استيراد آخر برومبت تلقائياً (VIDEO {prompts[prompts.length - 1]?.videoNumber})
              </button>
            </div>
            <textarea
              value={outroInput}
              onChange={(e) => setOutroInput(e.target.value)}
              placeholder="الصقي هنا نص آخر برومبت، أو اضغطي زر 'استيراد آخر برومبت تلقائياً' أعلاه..."
              className="w-full border border-amber-300 rounded-lg p-3 text-xs font-mono bg-white min-h-[90px] focus:ring-2 focus:ring-amber-500 text-left"
              dir="ltr"
            />
          </div>

          <button
            type="button"
            disabled={isGeneratingOutro}
            onClick={handleGenerateOutro}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isGeneratingOutro ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transform hover:scale-[1.01]'
            }`}
          >
            {isGeneratingOutro ? (
              <>
                <span className="animate-spin text-lg">⏳</span>
                <span>جاري تأليف مشهد الخاتمة الاحتفالي بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <span className="text-xl">✨</span>
                <span>توليد مشهد خاتمة للدرس وإضافته للفيديوهات فوراً</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
