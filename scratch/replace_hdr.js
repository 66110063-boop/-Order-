const fs = require('fs');
let content = fs.readFileSync('d:/work/js/views/lots.js', 'utf8');

const target = '  const hdr = `\r\n    <div class="page-head" style="margin-bottom:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">\r\n      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">\r\n        <h1>${esc(lotData.lot)}</h1>\r\n        <span class="badge ${badgeClass}">${esc(lotStageLabel)}</span>\r\n        <span class="cell-sub">จัดล็อตเมื่อ ${esc(lotData.date)}</span>\r\n      </div>\r\n      <button class="btn btn-secondary" data-action="back-lot-list">← ย้อนกลับ</button>\r\n    </div>\r\n    <div class="desc" style="margin-bottom:20px;">${esc(lotStageLabel)}</div>`;';

const targetLF = target.replace(/\r\n/g, '\n');

const replacement = `  const lotSteps = LOT_STAGES.filter(s => s.key !== 'all');
  const currentIndex = lotSteps.findIndex(s => s.key === lotStage);

  const stepperHtml = \`
    <div class="stepper" style="margin-bottom: 24px;">
      \${lotSteps.map((s, i) => {
        const cls = i === currentIndex ? 'current' : i < currentIndex ? 'complete' : '';
        const locked = i > currentIndex;
        return \\\`<div class="step-chip \${cls} \${locked ? 'locked' : ''}" style="\${locked ? 'opacity:.5; cursor:default;' : ''}">
          <div class="n">\${i < currentIndex ? iconCheck() : (i + 1)}</div>
          <div>
            <div class="t">\${esc(s.label)}</div>
            <div class="s">\${i === currentIndex ? 'กำลังทำ' : i < currentIndex ? 'เสร็จแล้ว' : 'ยังไม่ถึง'}</div>
          </div>
        </div>\\\`;
      }).join('')}
    </div>
  \`;

  const hdr = \`
    <div class="page-head" style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <h1>\${esc(lotData.lot)}</h1>
        <span class="badge \${badgeClass}">\${esc(lotStageLabel)}</span>
        <span class="cell-sub">จัดล็อตเมื่อ \${esc(lotData.date)}</span>
      </div>
      <button class="btn btn-secondary" data-action="back-lot-list">← ย้อนกลับ</button>
    </div>
    \${stepperHtml}\`;`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('d:/work/js/views/lots.js', content, 'utf8');
    console.log('Replaced using CRLF');
} else if (content.includes(targetLF)) {
    content = content.replace(targetLF, replacement);
    fs.writeFileSync('d:/work/js/views/lots.js', content, 'utf8');
    console.log('Replaced using LF');
} else {
    console.log('Target not found in file!');
}
