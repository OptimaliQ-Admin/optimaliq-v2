// Test LinkedIn URL validation
const { isValidLinkedInUrl, normalizeLinkedInUrl } = require('./src/lib/utils/validation.ts');

// Test cases
const testUrls = [
  'https://www.linkedin.com/in/james-luck-b47777142/',
  'www.linkedin.com/in/james-luck-b47777142/',
  'linkedin.com/in/james-luck-b47777142/',
  'https://linkedin.com/in/james-luck-b47777142/',
  'https://www.linkedin.com/in/james-luck-b47777142',
  'www.linkedin.com/in/james-luck-b47777142',
  'linkedin.com/in/james-luck-b47777142',
  'invalid-url',
  'https://facebook.com/in/james-luck',
  'https://www.linkedin.com/company/optimaliq',
  'https://www.linkedin.com/in/james-luck-b47777142/?originalSubdomain=us'
];

console.log('Testing LinkedIn URL validation:');
console.log('================================');

testUrls.forEach(url => {
  const isValid = isValidLinkedInUrl(url);
  const normalized = normalizeLinkedInUrl(url);
  console.log(`URL: ${url}`);
  console.log(`Valid: ${isValid}`);
  console.log(`Normalized: ${normalized}`);
  console.log('---');
}); 