const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldStr = \             lastContext = \\\The last video ended with: \ + "\" + \. Character state: \ + "\" + \\\\;
          }
        }
        setNextProcessingIndex(endIdx);
        setIsContinuing(true);\;

const newStr = \             lastContext = \\\The last video ended with: \ + "\" + \. Character state: \ + "\" + \\\\;
          }
          
          setNextProcessingIndex(i + chunkSize);
          setIsContinuing(true);
        }\;

text = text.replace(oldStr, newStr);
fs.writeFileSync('src/app/page.tsx', text);
