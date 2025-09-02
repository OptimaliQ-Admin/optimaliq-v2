#!/usr/bin/env node

/**
 * Script to add export const dynamic = 'force-dynamic' to all pages that use useSearchParams
 * This prevents static generation and avoids useSearchParams Suspense boundary issues
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
      // Check if already has dynamic export
      if (!content.includes('export const dynamic = \'force-dynamic\'')) {
        // Add dynamic export after 'use client'
        const fixedContent = content.replace(
          /('use client')/g,
          '$1\n\nexport const dynamic = \'force-dynamic\''
        );
        
        fs.writeFileSync(pagePath, fixedContent);
        console.log(`✅ Fixed: ${pagePath}`);
        fixedCount++;
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
