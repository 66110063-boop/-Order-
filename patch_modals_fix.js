const fs = require('fs');
let c = fs.readFileSync('d:/work/js/modals.js', 'utf8');

c = c.split(`$('[data-action="tdc-approve-modal"]')`).join(`$$('[data-action="tdc-approve-modal"]')`);
c = c.split(`$('[data-action="tdc-reject-modal"]')`).join(`$$('[data-action="tdc-reject-modal"]')`);

fs.writeFileSync('d:/work/js/modals.js', c);
console.log('patched $$');
