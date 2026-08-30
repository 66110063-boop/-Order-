const fs = require('fs');
let c = fs.readFileSync('d:/work/js/workflow/stations.js', 'utf8');

c = c.replace(
  '<input type="text" class="input-locked" value="${esc(senderValue || CURRENT_USER_EMAIL)}" disabled>',
  '<input type="text" class="input-locked" style="text-align: left;" value="${esc(senderValue || CURRENT_USER_EMAIL)}" disabled>'
);

c = c.replace(
  '<input type="text" class="input-locked" value="${esc(senderName || \'เจ้าหน้าที่ระบบ (Current User)\')}" disabled>',
  '<input type="text" class="input-locked" style="text-align: left;" value="${esc(senderName || \'เจ้าหน้าที่ระบบ (Current User)\')}" disabled>'
);

fs.writeFileSync('d:/work/js/workflow/stations.js', c);
console.log('Patched left align in stations.js');
