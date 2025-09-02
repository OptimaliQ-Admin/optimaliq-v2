#!/usr/bin/env node

/**
 * Comprehensive script to fix all useSearchParams Suspense boundary issues
 * Wraps components using useSearchParams in proper Suspense boundaries
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all pages that use useSearchParams
const pagesWithUseSearchParams = glob.sync('src/app/**/*.tsx', {
  ignore: ['src/app/**/layout.tsx', 'src/app/**/loading.tsx', 'src/app/**/error.tsx', 'src/app/**/not-found.tsx']
});

console.log(`Found ${pagesWithUseSearchParams.length} pages to check...`);

let fixedCount = 0;
let alreadyFixedCount = 0;

pagesWithUseSearchParams.forEach(pagePath => {
  try {
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if page uses useSearchParams
    if (content.includes('useSearchParams')) {
      // Check if already has Suspense wrapper
      if (!content.includes('<Suspense') && content.includes('export default function')) {
        let fixedContent = content;
        
        // Add Suspense import if not present
        if (!content.includes('import React, { Suspense }') && content.includes('import React')) {
          fixedContent = fixedContent.replace(
            /import React from 'react'/g,
            'import React, { Suspense } from \'react\''
          );
        }
        
        // Find the export default function name
        const functionNameMatch = content.match(/export default function (\w+)/);
        if (functionNameMatch) {
          const functionName = functionNameMatch[1];
          
          // Replace export default function with regular function
          fixedContent = fixedContent.replace(
            new RegExp(`export default function ${functionName}\\(`),
            `function ${functionName}Content(`
          );
          
          // Add the Suspense wrapper at the end
          const lastBraceIndex = fixedContent.lastIndexOf('}');
          if (lastBraceIndex !== -1) {
            const beforeLastBrace = fixedContent.substring(0, lastBraceIndex);
            const afterLastBrace = fixedContent.substring(lastBraceIndex);
            
            fixedContent = beforeLastBrace + '\n}\n\nexport default function ' + functionName + '() {\n' +
              '  return (\n' +
              '    <Suspense fallback={<div>Loading...</div>}>\n' +
              '      <' + functionName + 'Content />\n' +
              '    </Suspense>\n' +
              '  )\n' +
              '}' + afterLastBrace;
          }
        }
        
        if (fixedContent !== content) {
          fs.writeFileSync(pagePath, fixedContent);
          console.log(`✅ Fixed: ${pagePath}`);
          fixedCount++;
        } else {
          alreadyFixedCount++;
        }
      } else {
        alreadyFixedCount++;
      }
    } else {
      alreadyFixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${pagePath}:`, error.message);
  }
});

console.log(`\n🎉 Summary:`);
console.log(`   Fixed: ${fixedCount} pages`);
console.log(`   Already fixed: ${alreadyFixedCount} pages`);
console.log(`   Total processed: ${pagesWithUseSearchParams.length} pages`);
