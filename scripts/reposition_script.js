import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find the main bundled script tag
const scriptRegex = /<script\s+type="module"\s+crossorigin>[\s\S]*?<\/script>/;
const match = html.match(scriptRegex);

if (match) {
  const scriptTag = match[0];
  console.log(`Extracted script tag of size: ${(scriptTag.length / 1024).toFixed(1)} KB`);
  
  // Remove script from its current location
  const scriptStart = match.index;
  const scriptEnd = scriptStart + scriptTag.length;
  html = html.slice(0, scriptStart) + html.slice(scriptEnd);
  
  // Insert script right before </body> using string slice to prevent any regex '$' replacement quirks
  const bodyCloseIndex = html.lastIndexOf('</body>');
  if (bodyCloseIndex !== -1) {
    html = html.slice(0, bodyCloseIndex) + scriptTag + html.slice(bodyCloseIndex);
  }
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.writeFileSync(path.resolve('dist/agency_directory_wordpress.html'), html, 'utf8');
  fs.writeFileSync(path.resolve('public/agency_directory_wordpress.html'), html, 'utf8');
  fs.writeFileSync(path.resolve('public/standalone_index.html'), html, 'utf8');
  console.log('Successfully relocated script cleanly using slice.');
} else {
  console.warn('Could not find script tag to relocate.');
}
