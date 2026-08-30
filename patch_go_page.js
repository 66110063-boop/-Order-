const fs = require('fs');
let c = fs.readFileSync('d:/work/js/modals.js', 'utf8');

c = c.split(`$('[data-action="tdc-go-page"]')`).join(`$$('[data-action="tdc-go-page"]')`);

fs.writeFileSync('d:/work/js/modals.js', c);
console.log('patched tdc-go-page');
