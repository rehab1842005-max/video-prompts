const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

const target = 'throw new Error(apiErrorMsg);';
const replacement = if (apiErrorMsg.includes("503") || apiErrorMsg.includes("demand") || apiErrorMsg.includes("Unavailable")) {
            alert("السيرفر مضغوط دلوقتي من جوجل. البرومبتات اللي اتعملت لحد دلوقتي اتحفظت تماماً! استني دقيقة بس ودوسي (استكمال) تاني وهيكمل من مكان ما وقف بالضبط.");
          } else {
            alert("رسالة الخطأ من سيرفرات جوجل:\\n" + apiErrorMsg + "\\n\\n(لكن ما تم إنشاؤه سيظل محفوظاً في الصفحة).");
          }
          break;;

text = text.replace(target, replacement);
fs.writeFileSync('src/app/page.tsx', text);
