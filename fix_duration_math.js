const fs = require('fs');
let text = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

const oldDurationRule = "- **مدة الفيديو (duration) للحفاظ على الرصيد:** إذا كان الحوار (DIALOGUE) يحتوي على كلمات قليلة جداً (إجابة قصيرة من الكرتون مثلاً)، اجعل حقل duration قيمته \\\"6 seconds\\\". وإذا كان الحوار طويلاً وفيه شرح، اجعله \\\"10 seconds\\\".";
const newDurationRule = "- **مدة الفيديو (duration) للحفاظ على الرصيد:** احسب عدد كلمات الـ (DIALOGUE) بدقة. مدة الفيديو = (عدد الكلمات مقسوماً على 2) + ثانية واحدة للصمت. فإذا كان الحوار 6 كلمات تكون المدة \\\"4 seconds\\\". وإذا كان 10 كلمات تكون المدة \\\"6 seconds\\\". وإذا كان الشرح 20 كلمة تكون \\\"10 seconds\\\". اكتب الرقم الثواني فقط متبوعاً بكلمة seconds في حقل duration.";

text = text.replace(oldDurationRule, newDurationRule);
fs.writeFileSync('src/app/api/generate/route.ts', text);
