const fs = require('fs');
let c = fs.readFileSync('d:/work/js/views/orders.js', 'utf8');

const oldHtml = `    <div style="display:flex; justify-content:center; gap:20px; margin-top:28px; width:100%;">
      <div class="decision-card reject" data-action="tdc-reject-row" data-rf="\${esc(r.rf)}">
        <input type="radio" name="approval_status" value="rejected">
        <span class="title">ไม่อนุมัติ</span>
      </div>
      <div class="decision-card approve" data-action="tdc-approve-row" data-rf="\${esc(r.rf)}">
        <input type="radio" name="approval_status" value="approved">
        <span class="title">อนุมัติ</span>
      </div>
    </div>`;

const newHtml = `    \${r.percentApprovalStatus === 'rejected' && r.rejectReason ? \`
    <div class="lot-section-bar" style="background-color: #fff0f0; color: var(--danger); border-bottom-color: #ffcccc;">เหตุผลที่ไม่อนุมัติล่าสุด</div>
    <div class="lot-section-body" style="border-color: #ffcccc; background-color: #fffaf0;">
      <div style="padding: 4px 0; color: var(--danger); font-size: 16px;">\${esc(r.rejectReason)}</div>
    </div>
    \` : ''}

    <div style="display:flex; justify-content:center; gap:20px; margin-top:28px; width:100%;">
      <button class="btn btn-danger" data-action="tdc-reject-modal" data-rf="\${esc(r.rf)}" style="min-width: 160px; font-size: 18px; padding: 14px 24px; font-weight: 600;">\${iconX()} ไม่อนุมัติ</button>
      <button class="btn btn-primary" data-action="tdc-approve-modal" data-rf="\${esc(r.rf)}" style="min-width: 160px; font-size: 18px; padding: 14px 24px; background-color: #00b050; border-color: #00b050; font-weight: 600;">\${iconCheck()} อนุมัติ</button>
    </div>`;

c = c.replace(oldHtml, newHtml);

fs.writeFileSync('d:/work/js/views/orders.js', c);
console.log('patched orders.js');
