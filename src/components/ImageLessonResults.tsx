"use client";

import React, { useState } from "react";

export interface ImageLessonScene {
  imageIndex: number;
  stepNumber: number;
  title: string;
  lessonExplanation: string;
  motionPrompt: string;
  montageText: string[];
  duration: string;
  continuityNote?: string;
  imageUrl?: string;
  imageName?: string;
}

interface ImageLessonResultsProps {
  scenes: ImageLessonScene[];
  onSaveProject?: () => void;
  projectName?: string;
}

export default function ImageLessonResults({
  scenes,
  onSaveProject,
  projectName
}: ImageLessonResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  if (!scenes || scenes.length === 0) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const copyAllFlowPrompts = () => {
    const all = scenes
      .map((s, idx) => `SCENE ${(idx + 1).toString().padStart(2, "0")} - ${s.title}\nDURATION: ${s.duration}\nMOTION PROMPT:\n${s.motionPrompt}\n\nDIALOGUE:\nTeacher speaks in warm energetic Egyptian Arabic: "${s.lessonExplanation}"\n\nAUDIO:\nClear expressive female teacher voice speaking warmly in Egyptian Arabic, synchronized with animated movement.`)
      .join("\n\n" + "=".repeat(40) + "\n\n");
    copyText(all, "all_flow");
  };

  const copyAllMotionPrompts = () => {
    const all = scenes
      .map((s, idx) => `SCENE ${(idx + 1).toString().padStart(2, "0")} - ${s.title}\nDURATION: ${s.duration}\nMOTION PROMPT:\n${s.motionPrompt}`)
      .join("\n\n" + "=".repeat(40) + "\n\n");
    copyText(all, "all_motion");
  };

  const copyAllVoiceovers = () => {
    const all = scenes
      .map((s, idx) => `المشهد ${(idx + 1).toString().padStart(2, "0")}: ${s.title}\n${s.lessonExplanation}`)
      .join("\n\n---\n\n");
    copyText(all, "all_voiceover");
  };

  // Direct download to local computer file
  const downloadPromptsFileToDevice = () => {
    let content = `======================================================================\n`;
    content += `  Sci.Rehab Elsibai Studio - برومبتات تحريك صور الدرس وشرح المعلمة\n`;
    content += `  اسم المشروع: ${projectName || "درس بدون عنوان"}\n`;
    content += `  تاريخ التوليد: ${new Date().toLocaleString("ar-EG")}\n`;
    content += `  عدد المشاهد: ${scenes.length}\n`;
    content += `  (ملاحظة هامة: جميع البرومبتات مجهزة بتعليمة منع ظهور أي نصوص أو كتابة في الفيديو NO TEXT)\n`;
    content += `======================================================================\n\n`;

    scenes.forEach((s, idx) => {
      const num = (idx + 1).toString().padStart(2, "0");
      content += `######################################################################\n`;
      content += `🎬 المشهد ${num}: ${s.title}\n`;
      content += `⏱️ المدة المقترحة: ${s.duration}\n`;
      if (s.imageName) content += `🖼️ ملف الصورة: ${s.imageName}\n`;
      content += `----------------------------------------------------------------------\n`;
      content += `🎙️ كلام الشرح الصوتي للدرس (صوت المعلمة رحاب):\n`;
      content += `${s.lessonExplanation}\n\n`;
      content += `🎬 برومبت تحريك الصورة لمولدات الفيديو (Image-to-Video Motion Prompt):\n`;
      content += `${s.motionPrompt}\n\n`;
      if (s.montageText && s.montageText.length > 0) {
        content += `✂️ نصوص المونتاج على الشاشة: ${s.montageText.join(" | ")}\n`;
      }
      if (s.continuityNote) {
        content += `🔗 سلسلة الترابط: ${s.continuityNote}\n`;
      }
      content += `\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const cleanName = (projectName || "prompts").replace(/[/\\?%*:|"<>]/g, "_");
    a.download = `${cleanName}_برومبتات_التحريك_والشرح.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("✅ تم تنزيل ملف البرومبتات مباشرة على جهازك في مجلد التنزيلات (Downloads)!");
  };

  const downloadSingleScene = (scene: ImageLessonScene, idx: number) => {
    const num = (idx + 1).toString().padStart(2, "0");
    let content = `المشهد ${num}: ${scene.title}\n`;
    content += `المدة: ${scene.duration}\n\n`;
    content += `🎙️ كلام الشرح الصوتي للدرس:\n${scene.lessonExplanation}\n\n`;
    content += `🎬 برومبت تحريك الصورة (Kling / Runway):\n${scene.motionPrompt}\n\n`;
    if (scene.montageText) content += `✂️ نصوص المونتاج: ${scene.montageText.join(" | ")}\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `مشهد_${num}_برومبت_تحريك.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "lesson_scene_image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 mt-8" dir="rtl">
      
      {/* Top Banner & Bulk Toolbar */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-blue-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/40">
                ✨ تم التحليل والربط بنجاح
              </span>
              <span className="bg-amber-500/20 text-amber-300 font-bold text-xs px-3 py-1 rounded-full border border-amber-500/40">
                🚫 مجهز بتعليمة منع أي كلام في الفيديو (NO TEXT)
              </span>
              <span className="text-xs text-white/70">
                {scenes.length} مشهد متناسق
              </span>
            </div>
            <h2 className="text-2xl font-black">
              {projectName || "المشاهد والبرومبتات المتناسقة مع صور الدرس"}
            </h2>
            <p className="text-sm text-white/70 mt-1">
              تحت كل صورة ستجدين برومبت التحريك (بدون أي نصوص بالفيديو) وكلام الشرح بصوت المعلمة رحاب
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Direct Save to Device Button */}
            <button
              onClick={downloadPromptsFileToDevice}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer ring-2 ring-emerald-400/50"
              title="تنزيل ملف نصي يحتوي على جميع البرومبتات والشرح على جهازك فوراً"
            >
              <span className="text-lg">📥</span>
              <span>حفظ وتنزيل على جهازك (.txt)</span>
            </button>

            <button
              onClick={copyAllFlowPrompts}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs py-2 px-3.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ring-1 ring-purple-300"
              title="انسخي كل المشاهد مدمجة مع الصوت والحوار لتتحدث المعلمة في موقع Flow"
            >
              <span>{copiedId === "all_flow" ? "✅ تم نسخ البرومبتات بالصوت!" : "🎙️ نسخ الكل مع الصوت والكلام (Flow)"}</span>
            </button>

            <button
              onClick={copyAllMotionPrompts}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{copiedId === "all_motion" ? "✅ تم النسخ!" : "🎬 نسخ أوامر التحريك (صامت)"}</span>
            </button>

            <button
              onClick={copyAllVoiceovers}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{copiedId === "all_voiceover" ? "✅ تم النسخ!" : "🎙️ نسخ كامل الشرح الصوتي"}</span>
            </button>

            {onSaveProject && (
              <button
                onClick={onSaveProject}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center gap-1.5 border border-white/20 active:scale-95 cursor-pointer"
              >
                <span>📁 حفظ بالمشاريع</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Individual Scene Cards */}
      <div className="space-y-6">
        {scenes.map((scene, idx) => {
          const sceneNum = (idx + 1).toString().padStart(2, "0");
          const motionCopyId = `motion_${idx}`;
          const voiceCopyId = `voice_${idx}`;
          const allCopyId = `all_${idx}`;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-700 text-white font-black text-sm px-3 py-1 rounded-lg">
                    المشهد {sceneNum}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                    {scene.title}
                  </h3>
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full">
                    ⏱️ {scene.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadSingleScene(scene, idx)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="تنزيل هذا المشهد كملف نصي على جهازك"
                  >
                    <span>📥 تنزيل المشهد</span>
                  </button>
                  <button
                    onClick={() => {
                      const fullCardText = `المشهد ${sceneNum}: ${scene.title}\nالمدة: ${scene.duration}\n\n🎙️ كلام الشرح الصوتي:\n${scene.lessonExplanation}\n\n🎬 برومبت تحريك الصورة:\n${scene.motionPrompt}`;
                      copyText(fullCardText, allCopyId);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedId === allCopyId ? "✅ تم النسخ!" : "📋 نسخ المشهد كاملاً"}
                  </button>
                </div>
              </div>

              {/* Card Body: Image on side + Explanations & Prompts */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Image Column */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square group shadow-xs">
                    {scene.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={scene.imageUrl}
                        alt={scene.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => setSelectedPreviewImage(scene.imageUrl || null)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <span className="text-4xl mb-2">🖼️</span>
                        <span className="text-xs">صورة المشهد #{scene.imageIndex + 1}</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                      صورة #{scene.imageIndex + 1}
                    </div>

                    {scene.imageUrl && (
                      <button
                        onClick={() => setSelectedPreviewImage(scene.imageUrl || null)}
                        className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
                      >
                        <span>🔍 تكبير</span>
                      </button>
                    )}
                  </div>

                  {scene.imageUrl && (
                    <button
                      onClick={() => downloadImage(scene.imageUrl!, scene.imageName || `scene_${sceneNum}.jpg`)}
                      className="w-full py-2 px-3 border border-gray-300 hover:border-gray-400 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>⬇️ تحميل الصورة المرفوعة (Starting Frame)</span>
                    </button>
                  )}
                </div>

                {/* Content Column */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* 1. كلام الشرح الصوتي للدرس */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎙️</span>
                        <h4 className="font-bold text-emerald-950 text-sm">
                          كلام الشرح الصوتي للدرس (بصوت المعلمة رحاب):
                        </h4>
                      </div>
                      <button
                        onClick={() => copyText(scene.lessonExplanation, voiceCopyId)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1 px-3 rounded-md transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <span>{copiedId === voiceCopyId ? "✅ تم النسخ" : "📋 نسخ كلام الشرح"}</span>
                      </button>
                    </div>
                    <p className="text-base text-gray-900 font-medium leading-relaxed bg-white p-3.5 rounded-lg border border-emerald-100">
                      {scene.lessonExplanation}
                    </p>
                  </div>

                  {/* 2. برومبت تحريك الصورة (Image-to-Video) */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4" dir="ltr">
                    <div className="flex items-center justify-between mb-2" dir="rtl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎬</span>
                        <h4 className="font-bold text-blue-950 text-sm">
                          برومبت تحريك الصورة (Image-to-Video Motion Prompt):
                        </h4>
                        <span className="text-[11px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200">
                          🚫 ممنوع أي كلام بالفيديو (NO TEXT)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const flowPrompt = `${scene.motionPrompt}\n\nDIALOGUE:\nTeacher speaks in warm Egyptian Arabic: "${scene.lessonExplanation}"\n\nAUDIO:\nClear, expressive female teacher voice in warm Egyptian Arabic, lively and synchronized with visual motion.`;
                            copyText(flowPrompt, `${motionCopyId}_flow`);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1 px-3 rounded-md transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="انسخي هذا البرومبت لتتحدث المعلمة بصوتها في موقع Flow"
                        >
                          <span>{copiedId === `${motionCopyId}_flow` ? "✅ تم النسخ بالصوت" : "🎙️ نسخ مع الصوت والكلام (Flow)"}</span>
                        </button>
                        <button
                          onClick={() => copyText(scene.motionPrompt, motionCopyId)}
                          className="bg-gray-700 hover:bg-gray-800 text-white font-bold text-xs py-1 px-3 rounded-md transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <span>{copiedId === motionCopyId ? "✅ Copied" : "📋 تحريك صامت فقط"}</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-blue-100 font-mono text-xs text-blue-950 whitespace-pre-wrap leading-relaxed select-all">
                      {scene.motionPrompt}
                    </div>
                  </div>

                  {/* 3. نصوص المونتاج وسلسلة الترابط */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
                    {scene.montageText && scene.montageText.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-700">✂️ نصوص المونتاج على الشاشة:</span>
                        {scene.montageText.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-amber-100 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {scene.continuityNote && (
                      <div className="text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 text-[11px]">
                        <span className="font-bold text-gray-700 ml-1">🔗 التسلسل:</span>
                        {scene.continuityNote}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-800">
            جاهزة لتوليد الفيديوهات على جهازك؟
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            احفظي ملف البرومبتات فوراً على الكمبيوتر وضعيه في Kling أو Runway لتوليد فيديوهات نقية بدون كتابة مشوهة.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadPromptsFileToDevice}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ring-2 ring-emerald-300"
          >
            <span>📥</span>
            <span>حفظ وتنزيل كل البرومبتات على جهازك (.txt)</span>
          </button>
          <button
            onClick={copyAllMotionPrompts}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-2.5 px-5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            📋 نسخ كل أوامر التحريك
          </button>
          {onSaveProject && (
            <button
              onClick={onSaveProject}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm py-2.5 px-4 rounded-xl border border-gray-300 transition-all cursor-pointer"
            >
              📁 حفظ بالمشاريع
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer z-10"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPreviewImage}
              alt="Preview"
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
