const fs = require('fs');
let c = fs.readFileSync('d:/work/js/modals.js', 'utf8');

// 1. Remove duplicate tdc-approve-row and tdc-reject-row from bindPageEvents (lines 740+ and 847+)
// There are multiple blocks. The safest way is to use regex to strip out all blocks starting with
// `$$('[data-action="tdc-approve-row"]')` and `$$('[data-action="tdc-reject-row"]')`
c = c.replace(/\$\$\('\[data-action="tdc-approve-row"\]'\)\.forEach\(el => el\.addEventListener\('click', \(?e?\)? => \{[\s\S]*?\}\)\);/g, '');
c = c.replace(/\$\$\('\[data-action="tdc-reject-row"\]'\)\.forEach\(el => el\.addEventListener\('click', \(?e?\)? => \{[\s\S]*?\}\)\);/g, '');

// 2. Add bindings for tdc-approve-modal and tdc-reject-modal
// We can insert this right before `$$('[data-action="tdc-go-page"]')`
c = c.replace(
  /\$\$\('\[data-action="tdc-go-page"\]'\)/,
  `$$('[data-action="tdc-approve-modal"]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    openTdcApproveModal(e.currentTarget.dataset.rf);
  }));
  $$('[data-action="tdc-reject-modal"]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    openTdcRejectModal(e.currentTarget.dataset.rf);
  }));
  
  $$('[data-action="tdc-go-page"]')`
);

// 3. Update bindModalEvents (line ~321) to handle confirm actions
// Replace existing confirmApprove logic with new logic for both
c = c.replace(
  /const confirmApprove = \$\('\[data-action="tdc-confirm-approve"\]'\);[\s\S]*?closeModal\(\);[\s\S]*?\}\);[\s\S]*?\}/,
  `const confirmApprove = $('[data-action="tdc-confirm-approve"]');
  if (confirmApprove) {
    confirmApprove.addEventListener('click', (e) => {
      const rf = e.currentTarget.dataset.rf;
      const ord = ORDERS.find(o => o.rf === rf);
      if (ord) {
        ord.percentApprovalStatus = 'approved';
        ord.station = 4;
        ord.statusLabel = 'หักทอง';
        if (order && order.rfNo === rf) {
          order.percentApproval.status = 'approved';
          order.percentApproval.decidedAt = new Date().toLocaleString('th-TH');
        }
      }
      closeModal(); toast('อนุมัติเปอร์เซ็นต์ทอง/เงิน สำหรับ ' + rf + ' เรียบร้อย'); state.tdcDetailId = null;
      renderBreadcrumb(); renderPage(); renderSidebar();
    });
  }

  const confirmReject = $('[data-action="tdc-confirm-reject"]');
  if (confirmReject) {
    confirmReject.addEventListener('click', (e) => {
      const rf = e.currentTarget.dataset.rf;
      const reasonInput = document.getElementById('tdcRejectReason');
      const err = document.getElementById('tdcRejectError');
      if (!reasonInput.value.trim()) {
        err.style.display = 'block';
        return;
      }
      err.style.display = 'none';
      
      const ord = ORDERS.find(o => o.rf === rf);
      if (ord) {
        ord.percentApprovalStatus = 'rejected';
        ord.rejectReason = reasonInput.value.trim();
        ord.station = 2; // back to testing
        if (order && order.rfNo === rf) {
          order.percentApproval.status = 'rejected';
          order.percentApproval.rejectReason = ord.rejectReason;
        }
      }
      closeModal(); toast('ปฏิเสธผลทดสอบของ ' + rf + ' แล้ว'); state.tdcDetailId = null;
      renderBreadcrumb(); renderPage(); renderSidebar();
    });
  }`
);

// 4. Redefine openConfirmApproveModal (replace it completely) and add openTdcRejectModal
// Notice it is named openConfirmApproveModal in the original code, but we call it openTdcApproveModal.
// We'll rename it in the regex.
c = c.replace(
  /function openConfirmApproveModal[\s\S]*?bindModalEvents\(\);\s*\}/,
  `function openTdcApproveModal(rf) {
    const html = \`
      <div class="modal modal-sm">
        <div class="modal-head">
          <h3>ยืนยันการอนุมัติ</h3>
          <button class="modal-close" data-close-modal>\${iconX()}</button>
        </div>
        <div class="modal-body" style="padding: 24px 16px;">
          <div style="font-size:16px; margin-bottom:12px; color:var(--text-primary); text-align: center;">
            ยืนยันการอนุมัติเปอร์เซ็นต์ทอง/เงิน สำหรับ RF: <b>\${esc(rf)}</b>?
            <br><br>
            <span style="color:var(--danger); font-weight: 600;">การกระทำนี้ไม่สามารถย้อนกลับได้</span>
          </div>
        </div>
        <div class="modal-foot" style="justify-content:center; gap:16px;">
          <button class="btn btn-secondary" data-close-modal style="min-width:100px;">ยกเลิก</button>
          <button class="btn btn-primary" data-action="tdc-confirm-approve" data-rf="\${esc(rf)}" style="min-width:100px; background-color: #00b050; border-color: #00b050;">ยืนยัน</button>
        </div>
      </div>\`;
    openModal(html);
    bindModalEvents();
  }

  function openTdcRejectModal(rf) {
    const html = \`
      <div class="modal modal-sm">
        <div class="modal-head">
          <h3>ระบุเหตุผลที่ไม่อนุมัติ</h3>
          <button class="modal-close" data-close-modal>\${iconX()}</button>
        </div>
        <div class="modal-body" style="padding: 20px 16px;">
          <p style="font-size: 16px; margin-bottom: 8px;">RF: <b>\${esc(rf)}</b></p>
          <textarea id="tdcRejectReason" class="input-locked" style="background:#fff!important; height:100px; width:100%; border:1px solid var(--border-strong)!important; padding: 12px; font-size: 16px; box-sizing: border-box;" placeholder="ระบุเหตุผลที่ไม่อนุมัติ..."></textarea>
          <div id="tdcRejectError" style="color:var(--danger); display:none; margin-top:6px; font-size:14px;">กรุณาระบุเหตุผลก่อนกดยืนยัน</div>
        </div>
        <div class="modal-foot" style="justify-content:flex-end; gap:12px;">
          <button class="btn btn-secondary" data-close-modal style="min-width:100px;">ยกเลิก</button>
          <button class="btn btn-danger" data-action="tdc-confirm-reject" data-rf="\${esc(rf)}" style="min-width:100px;">ยืนยันไม่อนุมัติ</button>
        </div>
      </div>\`;
    openModal(html);
    bindModalEvents();
  }`
);

fs.writeFileSync('d:/work/js/modals.js', c);
console.log('patched modals.js');
