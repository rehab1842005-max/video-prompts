const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

const targetStr = \           lastContext = \\\The last video ended with: \. Character state: \\\\;
        }
      }
    } catch (error: any) {\;

const newStr = \           lastContext = \\\The last video ended with: \. Character state: \\\\;
        }
      }
      
      setNextProcessingIndex(endIdx);
      setIsContinuing(true);
      saveCurrentProject();

    } catch (error: any) {\;

text = text.replace(targetStr, newStr);
fs.writeFileSync('src/app/page.tsx', text);
