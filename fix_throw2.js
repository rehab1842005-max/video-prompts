const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldCode =           if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const apiErrorMsg = errorData.error || "فشل في التوليد";
            throw new Error(apiErrorMsg);
          };

const newCode =           if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const apiErrorMsg = errorData.error || "فشل في التوليد";
            if (apiErrorMsg.includes("503") || apiErrorMsg.includes("high demand") || apiErrorMsg.includes("High demand") || apiErrorMsg.includes("Service Unavailable")) {
              alert("السيرفر مضغوط دلوقتي من جوجل (Error 503). ما تقلقيش، البرومبتات اللي اتعملت لحد دلوقتي اتحفظت تماماً! استني نص دقيقة بس ودوسي 'استكمال' تاني وهيكمل من مكان ما وقف بالضبط.");
            } else {
              alert("رسالة الخطأ من سيرفرات جوجل:\\n" + apiErrorMsg + "\\n\\n(لكن ما تم إنشاؤه سيظل محفوظاً في الصفحة).");
            }
            break; // Stop loop instead of throwing to prevent Next.js dev overlay
          };

text = text.replace(oldCode, newCode);
fs.writeFileSync('src/app/page.tsx', text);
