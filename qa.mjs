import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const script = fs.readFileSync(new URL('./script.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('./style.css', import.meta.url), 'utf8');

const checks = [
  ['independent storefront title', html.includes('<title>Lumen Supply — Better tech for everyday rituals</title>')],
  ['real product cards', html.includes('product-card') && html.includes('data-product') && html.includes('data-price')],
  ['cart state', script.includes('renderCart') && script.includes('data-remove')],
  ['category filtering', script.includes('filter-button') && script.includes('product.hidden')],
  ['search feedback', script.includes('searchResults.textContent')],
  ['truthful newsletter behavior', script.includes('Newsletter service is not connected in this preview.') && !script.includes('You’re on the list. See you Sunday.')],
  ['honest checkout boundary', script.includes('Checkout coming soon')],
  ['assistant route and local catalog fallback', script.includes('/api/lumen-assistant') && script.includes('Halo desk light') && script.includes('Field tote') && script.includes('Arc headphones')],
  ['accessible live status', html.includes('aria-live="polite"')],
  ['reduced motion', css.includes('prefers-reduced-motion')],
];

for (const [name, passed] of checks) assert.equal(passed, true, name);
console.log(`bootstrap-big-ecommerce QA: ${checks.length}/${checks.length} checks passed`);
