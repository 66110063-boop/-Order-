const fs = require('fs');
let c = fs.readFileSync('d:/work/js/workflow/stations.js', 'utf8');

c = c.replace(
  "percentApprovalStatus: order.percentApproval.status,",
  "percentApprovalStatus: order.percentApproval.status,\n      rejectReason: order.percentApproval.rejectReason || null,"
);

fs.writeFileSync('d:/work/js/workflow/stations.js', c);
console.log('patched stations.js');
