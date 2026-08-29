const fs = require('fs');
let code = fs.readFileSync('d:/work/css/components.css', 'utf8');

// Use simple substrings or replace all to avoid regex whitespace traps
code = code.replace(
  /\.btn \{[^}]+\}/,
  `.btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 12px; padding: 8px 16px; font-size: 15px; font-weight: 600; min-height: 38px; border: 1px solid transparent; transition: all .12s var(--ease-out); white-space: nowrap; }`
);

fs.writeFileSync('d:/work/css/components.css', code, 'utf8');
console.log('Fixed .btn in components.css');
