"use client";
import React from 'react';

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
  nextProcessingIndex?: number;
  onConvertToPresentation?: (part: ContentPart) => void;
}

export default function ContentMapViewer({ 
  map, 
  onGeneratePrompts, 
  isGenerating, 
  nextProcessingIndex = 0,
  onConvertToPresentation
}: ContentMapViewerProps) {
  if (!map) return null;
  const isCompleted = nextProcessingIndex >= map.length;
  const remaining = map.length - nextProcessingIndex;

  return (
    <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6' dir='rtl'>
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-xl font-bold text-gray-800'>3. خريطة المحتوى (Content Map)</h2>
        <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full">
          {map.length} أجزاء مقسمة
        </span>
      </div>
      <p className='text-sm text-gray-600 mb-4'>تم تقسيم الملف إلى أجزاء دقيقة. اضغطي على الزر بالأسفل لتوليد المشاهد وبرومبتات الفيديو.</p>
      
      <div className='bg-gray-50 p-4 rounded-md border border-gray-200 max-h-96 overflow-y-auto mb-6'>
        {map.map((part, idx) => (
          <div key={part.id} className={`mb-4 p-3 border rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${idx < nextProcessingIndex ? "bg-green-50 border-green-200" : "bg-white border-gray-100"}`}>
            <div>
              <h3 className={`font-bold mb-1 ${idx < nextProcessingIndex ? "text-green-800" : "text-blue-800"}`}>
                الصفحة {part.pageNumber}: {part.title} {idx < nextProcessingIndex && '✅'}
              </h3>
              <p className='text-sm text-gray-600'>{part.contentSummary}</p>
            </div>
          </div>
        ))}
      </div>

      {!isCompleted && (
        <button 
          onClick={onGeneratePrompts} 
          disabled={isGenerating}
          className={`w-full py-3 rounded-md font-bold text-white transition-colors ${isGenerating ? "bg-gray-400 cursor-not-allowed" : nextProcessingIndex > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-purple-600 hover:bg-purple-700"}`}
        >
          {isGenerating ? "جاري التوليد..." : nextProcessingIndex > 0 ? `⏯️ استكمال توليد باقي المشاهد (متبقي ${remaining})` : "🚀 توليد برومبتات الفيديو (دفعات)"}
        </button>
      )}

      {isCompleted && (
        <div className='w-full py-3 bg-green-100 text-green-800 text-center font-bold rounded-md'>
          🎉 تم توليد جميع مشاهد الملف بنجاح!
        </div>
      )}
    </div>
  );
}
