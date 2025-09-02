#!/usr/bin/env node

/**
 * Script to fix Button asChild patterns that cause React.Children.only errors during build
 * Replaces Button asChild with nested Link/Button structure
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all pages that use Button asChild
const pagesWithButtonAsChild = glob.sync('src/app/**/*.tsx', {
  ignore: ['src/app/**/layout.tsx', 'src/app/**/loading.tsx', 'src/app/**/error.tsx', 'src/app/**/not-found.tsx']
});

console.log(`Found ${pagesWithButtonAsChild.length} pages to check...`);

let fixedCount = 0;
let alreadyFixedCount = 0;

pagesWithButtonAsChild.forEach(pagePath => {
  try {
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Check if page uses Button asChild pattern
    if (content.includes('Button asChild')) {
      // Replace Button asChild pattern with nested Link/Button structure
      const fixedContent = content.replace(
        /<Button asChild>\s*<Link href="([^"]+)">([^<]+)<\/Link>\s*<\/Button>/g,
        '<Link href="$1">\n              <Button>$2</Button>\n            </Link>'
      );
      
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
  } catch (error) {
    console.error(`❌ Error processing ${pagePath}:`, error.message);
  }
});

console.log(`\n🎉 Summary:`);
console.log(`   Fixed: ${fixedCount} pages`);
console.log(`   Already fixed: ${alreadyFixedCount} pages`);
console.log(`   Total processed: ${pagesWithButtonAsChild.length} pages`);
