const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');

const durationRule = "- **مدة الفيديو (duration) للحفاظ على الرصيد:** إذا كان الحوار (DIALOGUE) يحتوي على كلمات قليلة جداً (إجابة قصيرة من الكرتون مثلاً)، اجعل حقل duration قيمته \\\"6 seconds\\\". وإذا كان الحوار طويلاً وفيه شرح، اجعله \\\"10 seconds\\\".\\n";

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('- **جمل كاملة ومغلقة (ممنوع قطع الكلام):**')) {
    lines.splice(i, 0, '    characterConfigStr += "' + durationRule + '";');
    break;
  }
}

fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
