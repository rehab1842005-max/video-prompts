"use client";

import React, { useState } from "react";

export interface CharacterConfig {
  description: string;
  characterLock: boolean;
  sceneLock: boolean;
  continuityLock: boolean;
  isFinalScene: boolean;
  previousStoryContext: string;
  teacherOutfit?: string;
  cartoonCharacter?: string;
}

interface CharacterSettingsProps {
  onSettingsChange: (config: CharacterConfig) => void;
}

export default function CharacterSettings({ onSettingsChange }: CharacterSettingsProps) {
  const [config, setConfig] = useState<CharacterConfig>({
    description: "",
    characterLock: true,
    sceneLock: true,
    continuityLock: true,
    isFinalScene: false,
    previousStoryContext: "",
  });

  const handleChange = (field: keyof CharacterConfig, value: string | boolean) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onSettingsChange(newConfig);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">2. إعدادات الشخصية والاستمرارية</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="char-desc">
          وصف الشخصية (Character Description)
        </label>
        <textarea
          id="char-desc"
          value={config.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="مثال: معلمة لطيفة بملابس ملونة... (يمكنك ترك هذا الحقل فارغاً إذا كنت ستضيفين الوصف في Flow لاحقاً)"
          className="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="rtl"
        />
        <p className="text-xs text-gray-500 mt-1">يجب أن تُستخدم نفس الشخصية في جميع الفيديوهات.</p>
      </div>

      <div className="mb-4 bg-blue-50 p-4 rounded-md border border-blue-200">
        <label className="block text-blue-900 font-bold mb-2" htmlFor="char-prev">
          ربط القصة السابقة (اختياري)
        </label>
        <p className="text-sm text-blue-700 mb-2">
          إذا كنتِ تحللين صفحة جديدة (مثل صفحة 14) وتريدين للقصة أن تكمل من حيث انتهت في الصفحة السابقة (صفحة 13)، ضعي هنا ملخص أو نص المشهد الأخير ليتم استكمال القصة عليه بذكاء.
        </p>
        <textarea
          id="char-prev"
          value={config.previousStoryContext}
          onChange={(e) => handleChange("previousStoryContext", e.target.value)}
          placeholder="مثال: انتهت القصة بوقوف الأبطال أمام مختبر العلوم، وسأل أحدهم: ماذا يوجد بالداخل؟"
          className="w-full border border-blue-300 rounded-md p-3 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="rtl"
        />
      </div>

      <div className="space-y-3 mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">إعدادات التثبيت (Locks)</h3>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.characterLock}
            onChange={(e) => handleChange("characterLock", e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="mr-3 text-gray-800 font-medium">Character Lock</span>
          <span className="mr-2 text-sm text-gray-500">- تثبيت وصف الشخصية في جميع الـ Prompts.</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.sceneLock}
            onChange={(e) => handleChange("sceneLock", e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="mr-3 text-gray-800 font-medium">Scene Lock</span>
          <span className="mr-2 text-sm text-gray-500">- الحفاظ على المكان والخلفية في جميع المشاهد.</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.continuityLock}
            onChange={(e) => handleChange("continuityLock", e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="mr-3 text-gray-800 font-medium">Continuity Lock</span>
          <span className="mr-2 text-sm text-gray-500">- إجبار الـ Prompt على الاستمرار بسلاسة من نهاية الفيديو السابق.</span>
        </label>
        
        <label className="flex items-center cursor-pointer mt-4 pt-3 border-t border-gray-200">
          <input
            type="checkbox"
            checked={config.isFinalScene}
            onChange={(e) => handleChange("isFinalScene", e.target.checked)}
            className="form-checkbox h-5 w-5 text-red-600 rounded"
          />
          <span className="mr-3 text-red-700 font-bold">نهاية القصة (Final Scene)</span>
          <span className="mr-2 text-sm text-red-500">- إذا فعلتِ هذا الخيار، سيقومون بتوديع المشاهدين (باي باي). إذا لم تفعليه، سيتركون القصة مفتوحة للصفحة القادمة.</span>
        </label>
      </div>
    </div>
  );
}
