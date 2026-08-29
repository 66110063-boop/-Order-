const fs = require('fs');
let code = fs.readFileSync('d:/work/js/modals.js', 'utf8');

const modalCode = `
function openTdcInspectModal(rf) {
  const ord = window.ORDERS.find(o => o.rf === rf);
  if (!ord) return;
  const html = \`
    <div class="modal modal-md">
      <div class="modal-head">
        <h3>รายละเอียดเพื่อการอนุมัติ (TDC)</h3>
        <button class="modal-close" data-close-modal>\${iconX()}</button>
      </div>
      <div class="modal-body" style="padding: 24px;">
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
              <div style="font-size:13px; color:#64748b;">RF-No.</div>
              <div style="font-weight:700; font-size:16px; color:#0f172a;">\${esc(ord.rf)}</div>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
              <div style="font-size:13px; color:#64748b;">ลูกค้า</div>
              <div style="font-weight:700; font-size:16px; color:#0f172a;">\${esc(ord.cust)}</div>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
              <div style="font-size:13px; color:#64748b;">น้ำหนักหลังหลอม (g)</div>
              <div style="font-weight:700; font-size:16px; color:#0f172a;">\${esc(ord.meltedW || '0.00')}</div>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
              <div style="font-size:13px; color:#64748b;">น้ำหนักตัวอย่าง (g)</div>
              <div style="font-weight:700; font-size:16px; color:#0f172a;">\${esc(ord.auSample || '0.00')}</div>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
              <div style="font-size:13px; color:#64748b;">%Au</div>
              <div style="font-weight:700; font-size:16px; color:#0056FF;">\${esc(ord.percentAu || '0.00')}</div>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
              <div style="font-size:13px; color:#64748b;">%Ag</div>
              <div style="font-weight:700; font-size:16px; color:#0056FF;">\${esc(ord.percentAg || '0.00')}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-foot" style="justify-content: flex-end; gap: 12px; padding: 16px 24px; background: #FFFFFF; border-top: 1px solid #E2E8F0;">
        <button class="btn btn-secondary" data-close-modal style="font-weight:600; padding:10px 20px;">ปิดหน้าต่าง</button>
        <button class="btn btn-danger-ghost" data-action="tdc-reject-row" data-rf="\${esc(rf)}" style="font-weight:600; padding:10px 20px;">\${iconX()} ไม่อนุมัติ</button>
        <button class="btn btn-primary" data-action="tdc-approve-row" data-rf="\${esc(rf)}" style="font-weight:600; padding:10px 20px;">\${iconCheck()} อนุมัติ</button>
      </div>
    </div>
  \`;
  openModal(html);
  bindModalEvents();
}
`;

// Insert the modal definition before openConfirmApproveModal
code = code.replace('function openConfirmApproveModal(rf) {', modalCode + '\nfunction openConfirmApproveModal(rf) {');

// We also need to bind tdc-inspect-modal event.
const bindStr = `  $$('[data-action="tdc-inspect-modal"]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    openTdcInspectModal(e.currentTarget.dataset.rf);
  }));\n`;

// Insert the binding where tdc-view-detail is bound
if (code.indexOf('$$(\'[data-action="tdc-view-detail"]\')') !== -1) {
  code = code.replace('  $$(\'[data-action="tdc-view-detail"]\').forEach', bindStr + '\n  $$(\'[data-action="tdc-view-detail"]\').forEach');
} else {
  // If not found, put it near tdc-approve-row
  code = code.replace('  $$(\'[data-action="tdc-approve-row"]\').forEach', bindStr + '\n  $$(\'[data-action="tdc-approve-row"]\').forEach');
}

// Modify tdc-reject-row to close modal
code = code.replace(/toast\('ส่งกลับไปแก้ไขที่ขั้นตอนทดสอบ % ทอง \(Station 2\) เรียบร้อยแล้ว'\);\s*state\.tdcDetailId = null;/g, 
  "closeModal(); toast('ส่งกลับไปแก้ไขที่ขั้นตอนทดสอบ % ทอง (Station 2) เรียบร้อยแล้ว'); state.tdcDetailId = null;");

fs.writeFileSync('d:/work/js/modals.js', code, 'utf8');
console.log('REPLACED modals.js with TDC Inspect Modal logic');
