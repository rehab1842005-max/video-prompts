const fs = require('fs');
let lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('apiErrorMsg.includes(503)'));
if (idx !== -1) {
  lines[idx] = '          if (apiErrorMsg.includes("503") || apiErrorMsg.includes("demand") || apiErrorMsg.includes("Unavailable")) { alert("السيرفر مضغوط دلوقتي من جوجل. البرومبتات اللي اتعملت لحد دلوقتي اتحفظت تماماً! استني دقيقة بس ودوسي استكمال تاني وهيكمل من مكان ما وقف بالضبط."); } else { alert("رسالة الخطأ من سيرفرات جوجل:\\n" + apiErrorMsg); } break;';
}
fs.writeFileSync('src/app/page.tsx', lines.join('\n'));
