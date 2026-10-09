const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

text = text.replace(/ContentMapViewer, \{ ContentPage \}/g, 'ContentMapViewer, { ContentPart }');
text = text.replace(/useState<ContentPage\[\]/g, 'useState<ContentPart[]');
text = text.replace(/new File\(\[pdfBytes\],/g, 'new File([pdfBytes as any],');

fs.writeFileSync('src/app/page.tsx', text);

// Delete the backup to avoid TS checking it
if (fs.existsSync('src/app/page_backup.tsx')) {
    fs.unlinkSync('src/app/page_backup.tsx');
}
