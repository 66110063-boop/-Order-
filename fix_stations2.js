const fs = require('fs');
let c = fs.readFileSync('d:/work/js/workflow/stations.js', 'utf8');

// I will just download the original file from the repo and patch it? No, I don't have internet access to github maybe.
// Let's reconstruct the deleted parts.
const fixBlock = `function wfPaintDiffField(el, isMatch) {
  if (!el) return;
  el.classList.remove('diff-match', 'diff-mismatch');
  el.classList.add(isMatch ? 'diff-match' : 'diff-mismatch');
}

/* Modal Confirmation for Handover */
function wfOpenConfirmModal({ title, receiverLabel, senderLabel, senderName, onConfirm }) {
  openModal(\`
    <div class="modal modal-sm">
      <div class="modal-head"><h3>\${esc(title)}</h3><button class="modal-close" data-close-modal>\${iconX()}</button></div>
      <div class="modal-body" style="display:flex; flex-direction:column; gap:14px;">
        <div class="field">
          <label>\${esc(receiverLabel)}<span class="req">*</span></label>
          <select id="wfModalReceiver">
            <option value="">เลือกผู้รับ</option>
            \${WF_STAFF.map(n => \`<option value="\${esc(n)}">\${esc(n)}</option>\`).join('')}
          </select>
        </div>
        <div class="field">
          <label>\${esc(senderLabel)}</label>
          <input type="text" class="input-locked" style="text-align: left;" value="\${esc(senderName || 'เจ้าหน้าที่ระบบ (Current User)')}" disabled>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close-modal>ยกเลิก</button><button class="btn btn-primary" id="wfModalConfirmBtn">ยืนยัน</button></div>
    </div>\`);
  bindModalEvents();
  const btn = $('#wfModalConfirmBtn');
  if (btn) btn.addEventListener('click', () => {
    const receiver = $('#wfModalReceiver').value;
    if (!receiver) { toast('กรุณาเลือกผู้รับก่อนยืนยัน'); return; }
    closeModal();
    onConfirm(receiver);
  });
}

/* Page workflow shell renderer */
function pageWorkflow() {
  return \`
    <div class="page-head">`;

const badBlockRegex = /function wfPaintDiffField[\s\S]*?<div class="page-head">/m;

if (badBlockRegex.test(c)) {
  c = c.replace(badBlockRegex, fixBlock);
  fs.writeFileSync('d:/work/js/workflow/stations.js', c);
  console.log('Fixed stations.js successfully!');
} else {
  // If the regex didn't match, maybe some parts are completely gone.
  // Let's find exactly what is between wfSaveDraftButton and <div><button class="btn btn-secondary btn-sm"
  const startIdx = c.indexOf('function wfSaveDraftButton');
  const endIdx = c.indexOf('<div>\n        <button class="btn btn-secondary btn-sm" data-action="wf-back"');
  
  if (startIdx !== -1 && endIdx !== -1) {
    const pre = c.substring(0, startIdx);
    const post = c.substring(endIdx);
    const newContent = pre + `function wfSaveDraftButton(stationLabel) {
  return \`<button class="btn btn-secondary" data-wf-save-draft="\${esc(stationLabel)}">บันทึก</button>\`;
}

` + fixBlock + `\n      ` + post;
    fs.writeFileSync('d:/work/js/workflow/stations.js', newContent);
    console.log('Fixed stations.js using substring extraction!');
  } else {
    console.log('Could not find boundaries to fix stations.js');
  }
}
