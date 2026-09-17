"use client";

import React from "react";

export interface ContentPart {
  id: string;
  title: string;
  pageNumber: number;
  contentSummary: string;
}

interface ContentMapViewerProps {
  map: ContentPart[] | null;
  onGeneratePrompts: () => void;
  isGenerating: boolean;
}

export default function ContentMapViewer({ map, onGeneratePrompts, isGenerating }: ContentMapViewerProps) {
  if (!map) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">3. خريطة المحتوى (Content Map)</h2>
      <p className="text-sm text-gray-600 mb-4">
        تم تلخيص الملف إلى مشاهد كرتونية، كل صفحة أصبحت مشهداً مستقلاً لتبسيط الشرح للأطفال.
      </p>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-96 overflow-y-auto mb-6" dir="rtl">
        {map.map((part) => (
          <div key={part.id} className="mb-4 bg-white p-3 border border-gray-100 rounded shadow-sm">
            <h3 className="font-bold text-blue-800 mb-1">
              صفحة {part.pageNumber}: {part.title}
            </h3>
            <p className="text-sm text-gray-600">{part.contentSummary}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onGeneratePrompts}
        disabled={isGenerating}
        className={`w-full py-3 rounded-md font-bold text-white transition-colors ${
          isGenerating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {isGenerating ? "جاري إنشاء الـ Prompts..." : "إنشاء Prompts (10 ثوانٍ لكل فيديو)"}
      </button>
    </div>
  );
}
