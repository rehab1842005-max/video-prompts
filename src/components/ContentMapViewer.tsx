"use client";
import React from 'react';
export interface ContentPart { id: string; title: string; pageNumber: number; contentSummary: string; }
interface ContentMapViewerProps { map: ContentPart[] | null; onGeneratePrompts: () => void; isGenerating: boolean; nextProcessingIndex?: number; }
export default function ContentMapViewer({ map, onGeneratePrompts, isGenerating, nextProcessingIndex = 0 }: ContentMapViewerProps) {
  if (!map) return null;
  const isCompleted = nextProcessingIndex >= map.length;
  const remaining = map.length - nextProcessingIndex;
  return (
    <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6'>
      <h2 className='text-xl font-bold mb-4 text-gray-800'>3. Content Map</h2>
      <p className='text-sm text-gray-600 mb-4'>The file has been divided into parts. We will generate them in batches (2 pages at a time) to save quota.</p>
      <div className='bg-gray-50 p-4 rounded-md border border-gray-200 max-h-96 overflow-y-auto mb-6' dir='rtl'>
        {map.map((part, idx) => (
          <div key={part.id} className={`mb-4 p-3 border rounded shadow-sm ${idx < nextProcessingIndex ? "bg-green-50 border-green-200" : "bg-white border-gray-100"}`}>
            <h3 className={`font-bold mb-1 ${idx < nextProcessingIndex ? "text-green-800" : "text-blue-800"}`}>
              Page {part.pageNumber}: {part.title} {idx < nextProcessingIndex && '✅'}
            </h3>
            <p className='text-sm text-gray-600'>{part.contentSummary}</p>
          </div>
        ))}
      </div>
      {!isCompleted && (
        <button onClick={onGeneratePrompts} disabled={isGenerating}
          className={`w-full py-3 rounded-md font-bold text-white transition-colors ${isGenerating ? "bg-gray-400 cursor-not-allowed" : nextProcessingIndex > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-purple-600 hover:bg-purple-700"}`}
        >
          {isGenerating ? "Generating..." : nextProcessingIndex > 0 ? `⏯️ Continue generating (${remaining} remaining)` : "🚀 Generate Videos (Batch mode)"}
        </button>
      )}
      {isCompleted && (
        <div className='w-full py-3 bg-green-100 text-green-800 text-center font-bold rounded-md'>🎉 All pages generated successfully!</div>
      )}
    </div>
  );
}
