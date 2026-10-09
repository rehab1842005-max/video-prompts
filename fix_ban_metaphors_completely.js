const fs = require('fs');
let lines = fs.readFileSync('src/app/api/generate/route.ts', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  lines[i] = lines[i].replace(/يتفلسف/g, 'يجيب إجابة قصيرة ومباشرة');
  lines[i] = lines[i].replace(/تتفلسف/g, 'تجاوب بكلمتين فقط');
  lines[i] = lines[i].replace(/متفلسف/g, 'طالب بسيط يجيب بكلمة');
  lines[i] = lines[i].replace(/التفلسف/g, 'الإجابة القصيرة');
}
fs.writeFileSync('src/app/api/generate/route.ts', lines.join('\n'));
