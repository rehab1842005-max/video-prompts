const fs = require('fs');
let t = fs.readFileSync('src/app/api/generate/route.ts', 'utf8');

// 1. Cartoon Mode
t = t.replace(
  '- **?????? (Scene):** A magical, vibrant, and highly detailed 3D Pixar-style animated world suitable for the topic. No human elements, just pure cartoon fantasy.\\n',
  '- **?????? (Scene):** A magical, vibrant, and highly detailed 3D Pixar-style animated world suitable for the topic. In the background, there is a glowing neon sign displaying the exact typographic text \\'Sci.Rehab Elsibai\\'. The words \\'Sci.Rehab Elsibai\\' must be spelled perfectly. No human elements, just pure cartoon fantasy.\\n'
);

// 2. Teacher Mode
t = t.replace(
  '  - **?????? (Scene):** A futuristic, bright, and engaging smart classroom with holographic educational displays, neon lights, and a huge interactive glowing smartboard.\\n',
  '  - **?????? (Scene):** A futuristic, bright, and engaging smart classroom with holographic educational displays, neon lights, and a huge interactive glowing smartboard. On the wall, there is a glowing neon sign displaying the exact typographic text \\'Sci.Rehab Elsibai\\'. The words \\'Sci.Rehab Elsibai\\' must be spelled perfectly.\\n'
);

// 3. Review Mode
t = t.replace(
  '- **??????:** ????? ????? ??????? ??????.\\n',
  '- **??????:** ????? ????? ??????? ??????.\\n- **?????? (Scene):** A dynamic abstract educational studio. In the background, there is a glowing neon sign displaying the exact typographic text \\'Sci.Rehab Elsibai\\'. The words \\'Sci.Rehab Elsibai\\' must be spelled perfectly.\\n'
);

fs.writeFileSync('src/app/api/generate/route.ts', t);
console.log('SUCCESS');

