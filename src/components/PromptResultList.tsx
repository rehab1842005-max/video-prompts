"use client";

import React from "react";

export interface VideoPrompt {
  id: string;
  videoNumber: number;
  pageNumber: number;
  partName: string;
  duration: string;
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
}

export default function PromptResultList({ prompts, onRegenerate }: PromptResultListProps) {
  if (!prompts || prompts.length === 0) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ بنجاح!");
  };

  const copyAll = () => {
    const allText = prompts.map(p => p.fullText).join("\n\n---\n\n");
    copyToClipboard(allText);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6 mb-12">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">4. النتائج (Video Prompts)</h2>
        <button
          onClick={copyAll}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
        >
          نسخ جميع الـ Prompts
        </button>
      </div>

      <div className="space-y-8" dir="rtl">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <div className="bg-gray-200 p-3 border-b border-gray-300 flex justify-between items-center">
              <div>
                <span className="font-bold text-lg text-gray-800 ml-3">VIDEO {prompt.videoNumber.toString().padStart(2, '0')}</span>
                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">صفحة: {prompt.pageNumber}</span>
                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded mx-2">الجزء: {prompt.partName}</span>
                <span className="text-sm text-red-600 font-bold bg-red-100 px-2 py-1 rounded">المدة: {prompt.duration}</span>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => copyToClipboard(prompt.fullText)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded"
                >
                  نسخ
                </button>
                <button
                  onClick={() => onRegenerate(index)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1 px-3 rounded"
                >
                  إعادة إنشاء
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-white font-mono text-sm text-gray-800 text-left" dir="ltr">
              <p className="font-bold text-blue-800">SCENE:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.scene}</p>

              <p className="font-bold text-blue-800">CHARACTER:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.character}</p>

              <p className="font-bold text-blue-800">ACTION:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.action}</p>

              <p className="font-bold text-blue-800">CAMERA:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.camera}</p>

              <p className="font-bold text-green-700">DIALOGUE:</p>
              <p className="whitespace-pre-wrap mb-4 text-right text-lg font-sans" dir="rtl">{prompt.dialogue}</p>

              <p className="font-bold text-blue-800">AUDIO:</p>
              <p className="whitespace-pre-wrap mb-4">{prompt.audio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
