const fs = require('fs');
let code = fs.readFileSync('d:/work/css/components.css', 'utf8');

// Update .btn
code = code.replace(
  /\.btn \{[\s\S]*?\n  \}/,
  `.btn {
  display: inline-flex; align-items: center; gap: 8px;
  border-radius: 12px; padding: 8px 16px; font-size: 15px; font-weight: 600;
  min-height: 38px;
  border: 1px solid transparent; transition: all .12s var(--ease-out); white-space: nowrap;
}`
);

// Update .btn-sm
code = code.replace(
  /\.btn-sm \{[^}]+\}/,
  `.btn-sm { padding: 6px 12px; font-size: 14px; border-radius: 9px; min-height: 34px; font-weight: 600; gap: 8px; }`
);

// Update thead th
code = code.replace(
  /thead th \{[\s\S]*?\}/,
  `thead th {
  background: var(--table-head-bg); 
  color: var(--table-head-fg);
  font-size: 16px; 
  font-weight: 700; 
  text-align: left; 
  padding: 12px 14px;
  position: sticky; 
  top: 0;
  white-space: nowrap;
}`
);

// Update tbody td
code = code.replace(
  /tbody td \{[\s\S]*?\}/,
  `tbody td { 
  padding: 12px 14px; 
  font-size: 16px; 
  border-bottom: 1px solid var(--border); 
  vertical-align: middle; 
}`
);

// Update inputs
code = code.replace(
  /input\[type="text"\],[\s\S]*?textarea \{[\s\S]*?\}/,
  `input[type="text"], input[type="number"], input[type="password"], select, textarea {
  width: 100%; box-sizing: border-box;
  padding: 10px 14px; min-height: 42px; font-size: 16px;
  border: 1px solid var(--border-strong); border-radius: var(--radius-sm);
  background: var(--surface); color: var(--text-primary);
  transition: border-color .12s var(--ease-out);
}`
);

fs.writeFileSync('d:/work/css/components.css', code, 'utf8');
console.log('components.css updated');
