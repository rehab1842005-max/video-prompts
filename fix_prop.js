const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

text = text.replace(
  '<ContentMapViewer \\n              map={contentMap} \\n              onGeneratePrompts={handleGeneratePrompts}\\n              isGenerating={isGenerating}\\n            />',
  '<ContentMapViewer \\n              map={contentMap} \\n              onGeneratePrompts={handleGeneratePrompts}\\n              isGenerating={isGenerating}\\n              nextProcessingIndex={nextProcessingIndex}\\n            />'
);

fs.writeFileSync('src/app/page.tsx', text);
