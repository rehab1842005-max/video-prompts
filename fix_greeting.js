const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');
const startIdx = lines.findIndex(l => l.includes('- **جمل كاملة ومغلقة'));
lines.splice(startIdx, 0, '    characterConfigStr += "- **ممنوع تكرار الترحيب والمقدمات:** يُمنع منعاً باتاً أن تبدأ المعلمة كل فيديو بترحيب (مثل: أهلاً بكم يا أبطالي). الترحيب مسموح به في أول فيديو فقط في الدرس بأكمله. في الفيديوهات التالية، يجب أن تبدأ المعلمة في استكمال الشرح والتفاعل فوراً بدون أي مقدمات تضيّع وقت الفيديو الـ 10 ثواني.\\n";');
fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
