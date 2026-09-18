"use client";

import React, { useRef, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File, startPage?: number, endPage?: number) => void;
  isAnalyzing: boolean;
}

export default function FileUpload({ onFileSelect, isAnalyzing }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<string>("");
  const [endPage, setEndPage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("الرجاء اختيار ملف PDF صالح");
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      const start = startPage ? parseInt(startPage) : undefined;
      const end = endPage ? parseInt(endPage) : undefined;
      onFileSelect(selectedFile, start, end);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">1. رفع الملف</h2>
      
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4">
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          إرفاق ملف PDF
        </button>
        
        {selectedFile && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 font-medium">الملف المختار:</p>
            <p className="text-gray-900 font-bold truncate max-w-xs">{selectedFile.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-4 justify-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-gray-700">من صفحة:</label>
          <input 
            type="number" 
            min="1"
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            placeholder="مثال: 1"
            className="border p-2 rounded w-24 text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-gray-700">إلى صفحة:</label>
          <input 
            type="number" 
            min="1"
            value={endPage}
            onChange={(e) => setEndPage(e.target.value)}
            placeholder="مثال: 10"
            className="border p-2 rounded w-24 text-center"
          />
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 mb-4">(اتركي الأرقام فارغة إذا أردتِ تحليل الملف بالكامل، ولكن الأفضل تحديد 5 صفحات لتجنب الضغط)</p>

      <button
        onClick={handleAnalyzeClick}
        disabled={!selectedFile || isAnalyzing}
        className={`w-full py-3 rounded-md font-bold text-white transition-colors ${
          !selectedFile || isAnalyzing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isAnalyzing ? "جاري التحليل..." : "تحليل الملف"}
      </button>
    </div>
  );
}
