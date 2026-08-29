const fs = require('fs');
let code = fs.readFileSync('d:/work/css/components.css', 'utf8');

// Replace the input style block
code = code.replace(
  /input\[type=text\], input\[type=date\], input\[type=number\], select, textarea \{[\s\S]*?\n\}/,
  `input[type=text], input[type=date], input[type=number], select, textarea {
  font-family: inherit; font-size: 16px; color: var(--text-primary);
  border: 1px solid var(--border-strong); border-radius: 10px; padding: 10px 14px; min-height: 42px;
  background: var(--surface); box-sizing: border-box; transition: border-color .12s var(--ease-out);
}`
);

fs.writeFileSync('d:/work/css/components.css', code, 'utf8');
console.log('Fixed inputs in components.css');
