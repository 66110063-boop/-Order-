const fs = require('fs');
let c = fs.readFileSync('d:/work/js/app.js', 'utf8');

c = c.split('${count !== undefined ? `<span class="badge-count">${count}</span>` : \'\'}').join('${count ? `<span class="badge-count">${count}</span>` : \'\'}');

fs.writeFileSync('d:/work/js/app.js', c);
console.log('patched badge visibility');
