import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('dist/index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Only relocate inline module script tags (when built in singlefile mode)
  const scriptRegex = /<script\s+type="module"\s+crossorigin>[\s\S]*?<\/script>/;
  const match = html.match(scriptRegex);

  if (match && match.index !== undefined) {
    const scriptTag = match[0];
    console.log(`Extracted inline script tag of size: ${(scriptTag.length / 1024).toFixed(1)} KB`);

    const scriptStart = match.index;
    const scriptEnd = scriptStart + scriptTag.length;
    html = html.slice(0, scriptStart) + html.slice(scriptEnd);

    const bodyCloseIndex = html.lastIndexOf('</body>');
    if (bodyCloseIndex !== -1) {
      html = html.slice(0, bodyCloseIndex) + scriptTag + html.slice(bodyCloseIndex);
    }

    fs.writeFileSync(htmlPath, html, 'utf8');
    fs.writeFileSync(path.resolve('dist/agency_directory_wordpress.html'), html, 'utf8');
    fs.writeFileSync(path.resolve('public/agency_directory_wordpress.html'), html, 'utf8');
    fs.writeFileSync(path.resolve('public/standalone_index.html'), html, 'utf8');
    console.log('Successfully relocated inline script cleanly.');
  } else {
    console.log('Standard multi-chunk build detected — skipping inline script relocation.');
  }
}
