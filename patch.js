const fs = require('fs');
let c = fs.readFileSync('d:/work/js/views/lots.js', 'utf8');

c = c.replace(
  /const body = rows\.length \? rows\.map\(r => `[\s\S]*?<tr class="empty-row"><td colspan="5">ไม่พบ Lot ที่ตรงกับเงื่อนไข<\/td><\/tr>';/,
  `const body = rows.length ? rows.map(r => {
    let rfStr = r.rf || '-';
    let custStr = r.cust || '-';
    let wStr = r.w || '0.00';
    if (!r.rf && r.rfRows && r.rfRows.length > 0) {
      rfStr = r.rfRows.length > 1 ? 'หลายรายการ' : r.rfRows[0].rf;
      custStr = r.rfRows.length > 1 ? 'หลายลูกค้า' : r.rfRows[0].cust;
      wStr = r.rfRows.reduce((sum, item) => sum + (parseFloat((item.wBill || '0').replace(/,/g, '')) || 0), 0).toFixed(2);
    }
    return \`
    <tr>
      <td class="cell-primary">\${esc(r.lot)}</td>
      <td>\${esc(r.jobType)}</td>
      <td style="color:var(--text-secondary);">\${esc(rfStr)}</td>
      <td style="color:var(--text-secondary);">\${esc(custStr)}</td>
      <td class="num font-mono">\${esc(wStr)}</td>
      <td>\${esc(r.date)}</td>
      <td><span class="badge \${getLotStageBadgeClass(r.stageKey)}">\${esc(r.stageLabel)}</span></td>
      <td class="right">
        <div class="td-actions">
          <button class="btn btn-primary btn-sm" data-action="view-lot" data-lot="\${esc(r.lot)}" data-stage="\${esc(r.stageKey)}">\${iconEye()} ดูรายละเอียด</button>
          <button class="btn btn-excel btn-sm" data-action="export-lot-excel" data-lot="\${esc(r.lot)}">\${iconDownload()} export .xlsx</button>
        </div>
      </td>
    </tr>\`;
  }).join('') : '<tr class="empty-row"><td colspan="8">ไม่พบ Lot ที่ตรงกับเงื่อนไข</td></tr>';`
);

c = c.replace(
  /<thead><tr><th>Lot No<\/th><th>ชนิด<\/th><th>วันที่จัดล็อต<\/th><th>สถานะ<\/th><th class="right">จัดการ<\/th><\/tr><\/thead>/,
  '<thead><tr><th>Lot No</th><th>ชนิด</th><th>รายการ (RF)</th><th>ลูกค้า</th><th class="num">น้ำหนัก (g)</th><th>วันที่จัดล็อต</th><th>สถานะ</th><th class="right">จัดการ</th></tr></thead>'
);

fs.writeFileSync('d:/work/js/views/lots.js', c);
console.log('patched successfully');
