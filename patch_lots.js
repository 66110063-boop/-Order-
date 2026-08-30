const fs = require('fs');
let c = fs.readFileSync('d:/work/js/views/lots.js', 'utf8');

c = c.replace(
  /rfStr = r\.rfRows\.length > 1 \? 'หลายรายการ' : r\.rfRows\[0\]\.rf;/,
  "rfStr = r.rfRows.length > 1 ? r.rfRows.map(x => x.rf).join(', ') : r.rfRows[0].rf;"
);

c = c.replace(
  /custStr = r\.rfRows\.length > 1 \? 'หลายลูกค้า' : r\.rfRows\[0\]\.cust;/,
  "custStr = r.rfRows.length > 1 ? [...new Set(r.rfRows.map(x => x.cust))].join(', ') : r.rfRows[0].cust;"
);

fs.writeFileSync('d:/work/js/views/lots.js', c);
console.log('patched lots.js');
