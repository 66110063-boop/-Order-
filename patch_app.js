const fs = require('fs');
let c = fs.readFileSync('d:/work/js/app.js', 'utf8');

c = c.replace(
  /const count = n.key === 'tdc-approve' \? ORDERS.filter\(o => !o.cancelled && o.percentApprovalStatus === 'pending'\).length : n.count;/,
  "const count = n.key === 'tdc-approve' ? ORDERS.filter(o => !o.cancelled && o.percentApprovalStatus === 'pending').length : (n.key === 'lot-allocate' ? (typeof LOT_ALLOCATE !== 'undefined' ? LOT_ALLOCATE.length : 0) : n.count);"
);

fs.writeFileSync('d:/work/js/app.js', c);
console.log('patched app.js');
