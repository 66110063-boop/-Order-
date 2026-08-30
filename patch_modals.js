const fs = require('fs');
let c = fs.readFileSync('d:/work/js/modals.js', 'utf8');

c = c.replace(
  /rf: selectedRows\.length === 1 \? selectedRows\[0\]\.rf : 'หลายรายการ',/,
  "rf: selectedRows.map(x => x.rf).join(', '),"
);

c = c.replace(
  /cust: selectedRows\.length === 1 \? selectedRows\[0\]\.cust : 'หลายลูกค้า'/,
  "cust: [...new Set(selectedRows.map(x => x.cust))].join(', ')"
);

fs.writeFileSync('d:/work/js/modals.js', c);
console.log('patched modals.js');
