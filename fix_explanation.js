const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('جملة واحدة مركزة')) {
    lines[i] = lines[i].replace(/\*\*\(أهم قاعدة\):\*\*.*?(?=\\n)/g, '**(قاعدة حياة أو موت): يُمنع منعاً باتاً أن تطرح المعلمة السؤال فوراً! يجب إجبارياً أن تنطق المعلمة بـ (معلومة علمية من النص المرفق) في جملة قصيرة تشرحها للمشاهدين أولاً، وبعد الانتهاء من سرد المعلومة تطرح سؤالاً صغيراً جداً من 3 أو 4 كلمات كحد أقصى. إجمالي كلمات المعلمة (الشرح + السؤال) يجب أن يكون بين 15 و 22 كلمة.**');
  }
}

fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
