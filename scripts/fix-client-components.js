#!/usr/bin/env node

/**
 * Script to add 'use client' directive to all pages that use framer-motion
 * This prevents React context errors during build when pages try to use
 * framer-motion in server-side rendering context
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all pages that use framer-motion
const pagesWithMotion = glob.sync('src/app/**/*.tsx', {
  ignore: ['src/app/**/layout.tsx', 'src/app/**/loading.tsx', 'src/app/**/error.tsx', 'src/app/**/not-found.tsx']
});

console.log(`Found ${pagesWithMotion.length} pages to check...`);

let fixedCount = 0;
let alreadyFixedCount = 0;

pagesWithMotion.forEach(pagePath => {
  try {
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if page already has 'use client'
    if (content.includes("'use client'") || content.includes('"use client"')) {
      alreadyFixedCount++;
      return;
    }
    
    // Check if page uses framer-motion
    if (content.includes('framer-motion') || content.includes('motion')) {
      // Add 'use client' after the comment block
      const lines = content.split('\n');
      let insertIndex = 0;
      
      // Find the end of the comment block
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('/**') || lines[i].trim().startsWith('/*')) {
          // Find the end of the comment block
          for (let j = i; j < lines.length; j++) {
            if (lines[j].trim().endsWith('*/')) {
              insertIndex = j + 1;
              break;
            }
          }
          break;
        }
      }
      
      // Insert 'use client' directive
      lines.splice(insertIndex, 0, '', "'use client'", '');
      
      const newContent = lines.join('\n');
      fs.writeFileSync(pagePath, newContent);
      
      console.log(`✅ Fixed: ${pagePath}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${pagePath}:`, error.message);
  }
});

console.log(`\n🎉 Summary:`);
console.log(`   Fixed: ${fixedCount} pages`);
console.log(`   Already fixed: ${alreadyFixedCount} pages`);
console.log(`   Total processed: ${pagesWithMotion.length} pages`);
