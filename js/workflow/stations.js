/* ============================================================
   KGR GROUP — 10-STATION GOLD ORDER WORKFLOW LOGIC & FORMS
   ============================================================ */

/* Formula & Math Calculation Library */
const WfFormula = {
  diffWeight(declared, received) { return wfRound2(wfNum(declared) - wfNum(received)); },
  shortage(afterMelt, sample, custSample, received) {
    return wfRound2((wfNum(afterMelt) + wfNum(sample) + wfNum(custSample)) - wfNum(received));
  },
  auCalculatedWeight(weightAfterMeltAu, percentAu) { return wfRound2(wfSafeDiv(wfNum(weightAfterMeltAu) * wfNum(percentAu), 100)); },
  auReturnWeight(auCalc, returnPercent) { return wfRound2(wfSafeDiv(wfNum(auCalc) * wfNum(returnPercent), 100)); },
  auRemark(auCalc, auReturn) { return wfRound2(wfNum(auCalc) - wfNum(auReturn)); },
  agCalculatedWeight(metalType, weightAfterMeltAu, weightAfterMeltAg, percentAg) {
    const base = metalType === 'silver' ? wfNum(weightAfterMeltAg) : wfNum(weightAfterMeltAu);
    return wfRound2(wfSafeDiv(base * wfNum(percentAg), 100));
  },
  agReturnWeight(agCalc, returnPercent) { return wfRound2(wfSafeDiv(wfNum(agCalc) * wfNum(returnPercent), 100)); },
  agServiceFee(receivedWeight) { return wfRound2(wfSafeDiv(wfNum(receivedWeight), 1000) * 200); },
  agRemark(agCalc, agReturn) { return wfRound2(wfNum(agCalc) - wfNum(agReturn)); },
  rowAuGrams(billWeight, percentAu) { return wfRound2(wfSafeDiv(wfNum(billWeight) * wfNum(percentAu), 100)); },
  rowAgGrams(billWeight, percentAg) { return wfRound2(wfSafeDiv(wfNum(billWeight) * wfNum(percentAg), 100)); },
  meltShortage(afterMelt99, beforeMelt99) { return wfRound2(wfNum(afterMelt99) - wfNum(beforeMelt99)); },
  sum(arr) { return wfRound2(arr.reduce((s, v) => s + wfNum(v), 0)); },
};

/* Factory for generating a clean Order object for the 10-Station Workflow */
function wfFreshOrder(rfNo) {
  const rf = rfNo || ('RF-2569-' + String(Math.floor(1000 + Math.random() * 8999)));
  return {
    rfNo: rf, lotNo: null, metalType: null, jobType: null,
    station1: { rfNo: rf, receiveDate: todayStr(), customerName: '', metalType: '', declaredWeight: null, receivedWeight: null, diffWeight: null, detail: '', jobFormat: '' },
    station2: { weightAfterMeltAu: null, sampleWeightAu: null, customerSampleWeightAu: null, shortageAu: null, drossAu: null, weightAfterMeltAg: null, sampleWeightAg: null, customerSampleWeightAg: null, shortageAg: null, drossAg: null, smelterName: null },
    station3: { percentAu: null, percentAg: null, testerName: null },
    station4: { auCalculatedWeight: null, auReturnPercent: null, auReturnWeight: null, auRemark: null, agCalculatedWeight: null, agReturnPercent: 95.00, agReturnWeight: null, agServiceFee: null, laborFee: 200.00, agRemark: null },
    station5: { lotItems: [], summary: { lotNo: null, sumDeclaredWeight: null, sumBillWeight: null, sumWeighedWeight: null }, confirmation: { receiverName: '', senderName: 'เจ้าหน้าที่ระบบ', timestamp: null } },
    station6: { sumWeighedAfterRolling: null, confirmation: { receiverName: '', senderName: '', timestamp: null } },
    station7: { weighedBeforeExtractionTable: null, panel: { sumWeighedAfterRolling: null, sumWeighedBeforeExtraction: null }, confirmation: { receiverName: '', senderName: '', timestamp: null } },
    station8: { rows: [], panel: { sumWeighedAfterRolling: null, sumWeighedBeforeExtraction: null, sumBeforeMelt99Au: null, sumBeforeMelt99Ag: null, totalWeighedAuAg: null, inputThroughMachineAu: null, inputThroughMachineAg: null }, confirmation: { receiverName: '', senderName: '', timestamp: null } },
    station9: { panel: {
      percentAuAfter: 99.99, percentAgAfter: 99.99,
      sumWeighedAfterMelt99Au: null, drossWeightAu: null, shortageGramsAu: null,
      sumWeighedAfterMelt99Ag: null, drossWeightAg: null, shortageGramsAg: null,
      tester: '', testDate: todayStr(),
    }, closeJob: { closedBy: null, closedAt: null } },
    station10: { summary: {}, decision: null, decidedAt: null },
    percentApproval: { status: 'none', decidedBy: null, decidedAt: null }, // 'none' | 'pending' | 'approved' | 'rejected'
  };
}

let order = wfFreshOrder();

/* Realtime sync between Order Workflow and Global Lists / Kanban */
function wfSyncOrdersTable() {
  const idx = ORDERS.findIndex(o => o.rf === order.rfNo);
  const st = WF_STATIONS.find(s => s.n === state.wfCurrent) || WF_STATIONS[0];
  const colorMap = { 1: 'info', 2: 'info', 3: 'info', 4: 'progress', 5: 'progress', 6: 'progress', 7: 'progress', 8: 'progress', 9: 'done' };
  const s4 = order.station4;
  const record = {
    rf: order.rfNo,
    date: order.station1.receiveDate || todayStr(),
    cust: order.station1.customerName || '(ไม่ระบุลูกค้า)',
    w: wfFmt(wfNum(order.station1.receivedWeight)),
    status: colorMap[state.wfCurrent] || 'info',
    statusLabel: st.label,
    station: state.wfCurrent,
    lotNo: order.lotNo || '—',
    meltedW: wfFmt(wfNum(order.station2.weightAfterMeltAu)),
    auCalc: wfFmt(s4.auCalculatedWeight), auReturn: wfFmt(s4.auReturnWeight),
    agCalc: wfFmt(s4.agCalculatedWeight), agReturn: wfFmt(s4.agReturnWeight),
    percentAu: order.station3.percentAu, percentAg: order.station3.percentAg,
    percentApprovalStatus: order.percentApproval.status,
    auSample: order.station2.sampleWeightAu ? wfFmt(order.station2.sampleWeightAu) : null,
    auSampleCust: order.station2.customerSampleWeightAu ? wfFmt(order.station2.customerSampleWeightAu) : null,
    wDeclared: order.station1.declaredWeight ? wfFmt(order.station1.declaredWeight) : null,
    cancelled: idx >= 0 ? ORDERS[idx].cancelled : false,
  };
  if (idx >= 0) {
    ORDERS[idx] = { ...ORDERS[idx], ...record };
  } else {
    ORDERS.unshift(record);
  }
}

function wfMoveKanbanCard() {
  const rf = order.rfNo;
  KANBAN_COLS.forEach(col => { col.items = col.items.filter(it => it.rf !== rf); });
  const closedIdx = KANBAN_CLOSED.findIndex(it => it.rf === rf);
  if (closedIdx >= 0) KANBAN_CLOSED.splice(closedIdx, 1);

  const item = { rf, cust: order.station1.customerName || '(ไม่ระบุลูกค้า)', date: order.station1.receiveDate || todayStr(), w: wfFmt(wfNum(order.station1.receivedWeight)) };
  if (order.lotNo) item.lot = order.lotNo;

  if (state.wfCurrent === 9) { KANBAN_CLOSED.unshift(item); return; }
  const key = WF_STATION_TO_KANBAN_KEY[state.wfCurrent];
  if (!key) return;
  const col = KANBAN_COLS.find(c => c.key === key);
  if (col) col.items.unshift(item);
}

function wfSyncAll() { wfSyncOrdersTable(); wfMoveKanbanCard(); }

function wfCustomerLabel(name) { return name || '—'; }
function wfManualTag() { return `<span class="field-tag">กรอกเอง</span><br>`; }
function wfOperatorPanel(senderLabel, senderValue) {
  return `
    <div class="panel"><div class="panel-head">ผู้ดำเนินการ</div><div class="panel-body">
      <div class="field" style="max-width:340px;"><label>${esc(senderLabel)}</label><input type="text" class="input-locked" value="${esc(senderValue || CURRENT_USER_EMAIL)}" disabled></div>
    </div></div>`;
}
function wfSaveDraftButton(stationLabel) {
  return `<button class="btn btn-secondary" data-wf-save-draft="${esc(stationLabel)}">บันทึก</button>`;
}

function wfPaintDiffField(el, isMatch) {
  if (!el) return;
  el.classList.remove('diff-match', 'diff-mismatch');
  el.classList.add(isMatch ? 'diff-match' : 'diff-mismatch');
}

/* Modal Confirmation for Handover */
function wfOpenConfirmModal({ title, receiverLabel, senderLabel, senderName, onConfirm }) {
  openModal(`
    <div class="modal modal-sm">
      <div class="modal-head"><h3>${esc(title)}</h3><button class="modal-close" data-close-modal>${iconX()}</button></div>
      <div class="modal-body" style="display:flex; flex-direction:column; gap:14px;">
        <div class="field">
          <label>${esc(receiverLabel)}<span class="req">*</span></label>
          <select id="wfModalReceiver">
            <option value="">เลือกผู้รับ</option>
            ${WF_STAFF.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>${esc(senderLabel)}</label>
          <input type="text" class="input-locked" value="${esc(senderName || 'เจ้าหน้าที่ระบบ (Current User)')}" disabled>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close-modal>ยกเลิก</button><button class="btn btn-primary" id="wfModalConfirmBtn">ยืนยัน</button></div>
    </div>`);
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
  return `
    <div class="page-head">
      <div>
        <button class="btn btn-secondary btn-sm" data-action="wf-back" style="margin-bottom:10px;">${iconArrowLeft()} กลับหน้ารายการ Order</button>
        <h1>${esc(order.rfNo)}</h1>
        <div class="desc">ระบบสั่งทำ / หลอม / สกัดทองคำ — 10 Station Workflow</div>
      </div>
    </div>
    <div class="stepper" id="wfStepper"></div>
    <div id="wfBody"></div>
  `;
}

function wfRefresh() {
  if (state.page === 'workflow') renderBreadcrumb();
  const stepperEl = $('#wfStepper');
  if (stepperEl) {
    let visibleStations = WF_STATIONS;
    if (state.wfStepperLimit) visibleStations = visibleStations.filter(s => s.n <= state.wfStepperLimit);
    if (state.wfStepperRange) visibleStations = visibleStations.filter(s => s.n >= state.wfStepperRange[0] && s.n <= state.wfStepperRange[1]);
    if (order.jobType === 'pellet') visibleStations = visibleStations.filter(s => s.n !== 5 && s.n !== 6);
    stepperEl.innerHTML = visibleStations.map(s => {
      const cls = s.n === state.wfCurrent ? 'current' : s.n < state.wfMaxUnlocked ? 'complete' : '';
      const locked = s.n > state.wfMaxUnlocked;
      return `<div class="step-chip ${cls} ${locked ? 'locked' : ''}" data-wf-step="${s.n}" style="${locked ? 'opacity:.5; cursor:not-allowed;' : ''}">
        <div class="n">${s.n < state.wfMaxUnlocked ? iconCheck() : s.n}</div>
        <div><div class="t">${esc(s.label)}</div><div class="s">${s.n === state.wfCurrent ? 'กำลังทำ' : s.n < state.wfMaxUnlocked ? 'เสร็จแล้ว' : 'ยังไม่ถึง'}</div></div>
      </div>`;
    }).join('');
    $$('.step-chip', stepperEl).forEach(el => el.addEventListener('click', () => {
      const n = parseInt(el.dataset.wfStep);
      if (n <= state.wfMaxUnlocked) { state.wfCurrent = n; wfRefresh(); }
    }));
  }
  const builders = { 1: wfStationS1, 2: wfStationS2, 3: wfStationS3, 4: wfStationS4, 5: wfStationS5, 6: wfStationS6, 7: wfStationS7, 8: wfStationS8, 9: wfStationS9, 10: wfStationS10 };
  const bodyEl = $('#wfBody');
  if (bodyEl) bodyEl.innerHTML = builders[state.wfCurrent] ? builders[state.wfCurrent]() : '';
  wfBindStationEvents();
}

/* STATION 1 — สร้าง Order */
function wfStationS1() {
  const s = order.station1;
  return `
    <div class="panel">
      <div class="panel-body">
        <div class="grid grid-2" style="margin-bottom:16px;">
          <div class="field"><label>RF No<span class="req">*</span></label><input type="text" id="wf_s1_rfNo" value="${esc(s.rfNo)}" placeholder="RF-2569-xxxx"></div>
          <div class="field"><label>วันที่รับ</label><input type="text" class="input-locked" id="wf_s1_receiveDate" value="${esc(s.receiveDate)}" disabled></div>
        </div>
        <div class="grid grid-2" style="margin-bottom:16px;">
          <div class="field"><label>ลูกค้า<span class="req">*</span></label>
            <select id="wf_s1_customerName">
              <option value="">เลือกลูกค้า</option>
              ${CUSTOMERS.map(c => `<option value="${esc(c.name)}" ${s.customerName === c.name ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label>ชนิดหลอม<span class="req">*</span></label>
            <div class="seg-control" id="wf_s1_metalType_seg">
              <button type="button" class="seg-btn ${s.metalType === 'gold' ? 'active' : ''}" data-seg-value="gold">ทอง (Au)</button>
              <button type="button" class="seg-btn ${s.metalType === 'silver' ? 'active' : ''}" data-seg-value="silver">เงิน (Ag)</button>
            </div>
          </div>
        </div>
        <div class="grid grid-3" style="margin-bottom:16px;">
          <div class="field"><label>น้ำหนักแจ้ง (g)<span class="req">*</span></label><input class="num-input" type="text" id="wf_s1_declaredWeight" value="${s.declaredWeight ?? ''}" placeholder="0.00"></div>
          <div class="field"><label>น้ำหนักรับ (g)<span class="req">*</span></label><input class="num-input" type="text" id="wf_s1_receivedWeight" value="${s.receivedWeight ?? ''}" placeholder="0.00"></div>
          <div class="field"><label>ขาด/เกิน (g)</label><input class="num-input input-locked ${s.diffWeight === 0 ? 'diff-match' : (s.diffWeight != null ? 'diff-mismatch' : '')}" type="text" id="wf_s1_diffWeight" value="${wfFmt(s.diffWeight)}" disabled></div>
        </div>
        <div class="grid grid-2">
          <div class="field"><label>รายละเอียด</label><input type="text" id="wf_s1_detail" value="${esc(s.detail)}" placeholder="รายละเอียดเพิ่มเติม"></div>
          <div class="field"><label>รูปแบบ<span class="req">*</span></label>
            <div class="seg-control" id="wf_s1_jobFormat_seg">
              <button type="button" class="seg-btn ${s.jobFormat === 'bar' ? 'active' : ''}" data-seg-value="bar">แบบแท่ง</button>
              <button type="button" class="seg-btn ${s.jobFormat === 'pellet' ? 'active' : ''}" data-seg-value="pellet">แบบเม็ด</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 24px;">
      <button class="btn btn-danger-ghost" id="wf_btnCancel1">ยกเลิก RF-No</button>
      <button class="btn btn-primary" id="wf_btnNext1">ขั้นตอนถัดไป &rarr;</button>
    </div>
  `;
}

/* STATION 2 — หลอมทองเก่า */
function wfStationS2() {
  const s = order.station2;
  const isSilver = order.metalType === 'silver';
  return `
    <div class="panel">
      <div class="panel-head"><span class="badge badge-progress">Au — ทอง</span></div>
      <div class="panel-body">
        <div class="grid grid-3" style="margin-bottom:16px;">
          <div class="field"><label>น้ำหนักหลังหลอม (Au)<span class="req">*</span></label><input class="num-input" type="text" id="wf_s2_weightAfterMeltAu" value="${s.weightAfterMeltAu ?? ''}" placeholder="0.00"></div>
          <div class="field"><label>น้ำหนักตัวอย่าง (Au)</label><input class="num-input" type="text" id="wf_s2_sampleWeightAu" value="${s.sampleWeightAu ?? ''}" placeholder="0.00"></div>
          <div class="field"><label>น้ำหนักตัวอย่างลูกค้า (Au)</label><input class="num-input" type="text" id="wf_s2_customerSampleWeightAu" value="${s.customerSampleWeightAu ?? ''}" placeholder="0.00"></div>
        </div>
        <div class="grid grid-2">
          <div class="field"><label>ขาด (Au)</label><input class="num-input input-locked ${s.shortageAu === 0 ? 'diff-match' : (s.shortageAu != null ? 'diff-mismatch' : '')}" type="text" id="wf_s2_shortageAu" value="${wfFmt(s.shortageAu)}" disabled></div>
          <div class="field"><label>ขี้เบ้า (Au)</label><input class="num-input" type="text" id="wf_s2_drossAu" value="${s.drossAu ?? ''}" placeholder="0.00"></div>
        </div>
      </div>
    </div>

    <div class="panel" style="${isSilver ? '' : 'opacity:.55;'}">
      <div class="panel-head"><span class="badge badge-sched">Ag — เงิน</span>${isSilver ? '' : '<span class="badge badge-hold" style="margin-left:8px;">ปิดใช้งาน — เลือกชนิดหลอม = เงิน ที่ Station 1</span>'}</div>
      <div class="panel-body">
        <div class="grid grid-3" style="margin-bottom:16px;">
          <div class="field"><label>น้ำหนักหลังหลอม (Ag)</label><input class="num-input" type="text" id="wf_s2_weightAfterMeltAg" value="${s.weightAfterMeltAg ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></div>
          <div class="field"><label>น้ำหนักตัวอย่าง (Ag)</label><input class="num-input" type="text" id="wf_s2_sampleWeightAg" value="${s.sampleWeightAg ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></div>
          <div class="field"><label>น้ำหนักตัวอย่างลูกค้า (Ag)</label><input class="num-input" type="text" id="wf_s2_customerSampleWeightAg" value="${s.customerSampleWeightAg ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></div>
        </div>
        <div class="grid grid-2">
          <div class="field"><label>ขาด (Ag)</label><input class="num-input input-locked ${s.shortageAg === 0 ? 'diff-match' : (s.shortageAg != null ? 'diff-mismatch' : '')}" type="text" id="wf_s2_shortageAg" value="${wfFmt(s.shortageAg)}" disabled></div>
          <div class="field"><label>ขี้เบ้า (Ag)</label><input class="num-input" type="text" id="wf_s2_drossAg" value="${s.drossAg ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></div>
        </div>
      </div>
    </div>

    <div class="field" style="max-width:320px; margin-bottom:16px;"><label>ช่างหลอม</label><input type="text" class="input-locked" value="${esc(s.smelterName || '—')}" disabled></div>

    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      <button class="btn btn-danger-ghost" id="wf_btnCancel2">ยกเลิก RF-No</button>
      <button class="btn btn-primary" id="wf_btnNext2">ขั้นตอนถัดไป →</button>
    </div>
  `;
}

/* STATION 3 — ทดสอบ % */
function wfStationS3() {
  const s = order.station3;
  const s2 = order.station2;
  const isSilver = order.metalType === 'silver';
  const approvalStatus = order.percentApproval.status;
  const locked = approvalStatus === 'pending' || approvalStatus === 'approved';

  const banner = approvalStatus === 'pending'
    ? `<div class="tdc-gate-banner tdc-gate-pending">ส่งให้ TDC อนุมัติ %Au/%Ag แล้ว — กรุณารอผลการอนุมัติก่อนเข้าสู่ขั้นตอนหักทอง</div>`
    : approvalStatus === 'approved'
    ? `<div class="tdc-gate-banner tdc-gate-approved">${iconCheck()} TDC อนุมัติ %Au/%Ag แล้ว — พร้อมเข้าสู่ขั้นตอนหักทอง</div>`
    : approvalStatus === 'rejected'
    ? `<div class="tdc-gate-banner tdc-gate-rejected">TDC ปฏิเสธผลทดสอบ — กรุณาตรวจสอบ %Au/%Ag แล้วส่งอนุมัติใหม่</div>`
    : '';

  return `
    <div class="panel">
      <div class="panel-head">ผลทดสอบเปอร์เซ็นต์ความบริสุทธิ์</div>
      <div class="panel-body">
        <div class="grid grid-2" style="${banner ? 'margin-bottom:16px;' : ''}">
          <div class="field">
            <label>% Au<span class="req">*</span></label>
            <input class="num-input percent-input-lg" type="text" id="wf_s3_percentAu" value="${s.percentAu ?? ''}" placeholder="0.00" ${locked ? 'disabled' : ''}>
          </div>
          <div class="field">
            <label>% Ag</label>
            <input class="num-input percent-input-lg" type="text" id="wf_s3_percentAg" value="${s.percentAg ?? ''}" placeholder="0.00" ${(isSilver && !locked) ? '' : 'disabled'}>
          </div>
        </div>
        ${banner}
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">ข้อมูลอ้างอิงจาก Station 2 (แก้ไขไม่ได้)</div>
      <div class="panel-body">
        <div class="grid grid-2" style="margin-bottom:16px;">
          <div class="field"><label>น้ำหนักตัวอย่าง (g) — Au</label><input class="num-input input-locked" type="text" value="${wfFmt(wfNum(s2.sampleWeightAu))}" disabled></div>
          <div class="field"><label>น้ำหนักตัวอย่างลูกค้า (g) — Au</label><input class="num-input input-locked" type="text" value="${wfFmt(wfNum(s2.customerSampleWeightAu))}" disabled></div>
        </div>
        <div class="grid grid-2" style="${isSilver ? '' : 'opacity:.55;'}">
          <div class="field"><label>น้ำหนักตัวอย่าง (g) — Ag</label><input class="num-input input-locked" type="text" value="${wfFmt(wfNum(s2.sampleWeightAg))}" disabled></div>
          <div class="field"><label>น้ำหนักตัวอย่างลูกค้า (g) — Ag</label><input class="num-input input-locked" type="text" value="${wfFmt(wfNum(s2.customerSampleWeightAg))}" disabled></div>
        </div>
      </div>
    </div>

    <div class="field" style="max-width:340px; margin-bottom:16px;"><label>ช่างทดสอบ / ผู้ส่งงาน</label><input type="text" class="input-locked" value="${esc(s.testerName || '—')}" disabled></div>

    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      <button class="btn btn-danger-ghost" id="wf_btnCancel3">ยกเลิก RF-No</button>
      ${approvalStatus === 'approved'
        ? `<button class="btn btn-primary" id="wf_btnNext3">ขั้นตอนถัดไป →</button>`
        : approvalStatus === 'pending'
        ? `<button class="btn btn-secondary" disabled>รอ TDC อนุมัติ...</button>`
        : `<button class="btn btn-primary" id="wf_btnSendTdc3">ส่งให้ TDC อนุมัติ %${approvalStatus === 'rejected' ? ' อีกครั้ง' : ''} →</button>`}
    </div>
  `;
}

/* STATION 4 — หักทอง */
function wfStationS4() {
  const s = order.station4;
  return `
    <div class="panel">
      <div class="panel-head"><span class="badge badge-progress">Au</span></div>
      <div class="panel-body">
        <div class="grid grid-2" style="margin-bottom:12px;">
          <div class="field"><label>น้ำหนักหลังหลอม (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station2.weightAfterMeltAu)}" disabled></div>
          <div class="field"><label>น้ำหนักตัวอย่าง (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station2.sampleWeightAu)}" disabled></div>
        </div>
        <div class="field" style="margin-bottom:16px;">
          <label class="check-label" style="display:inline-flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="wf_s4_includeSampleAu" ${s.includeSampleAu ? 'checked' : ''}>
            รวมน้ำหนักตัวอย่างในการคำนวณ Au
          </label>
        </div>
        <div class="grid grid-4">
          <div class="field"><label>Au คำนวณได้ (g)</label><input class="num-input input-locked" type="text" id="wf_s4_auCalculatedWeight" value="${wfFmt(s.auCalculatedWeight)}" disabled></div>
          <div class="field"><label>% คืน (Au)</label><input class="num-input" type="text" id="wf_s4_auReturnPercent" value="${s.auReturnPercent ?? ''}" placeholder="0.00"></div>
          <div class="field"><label>น้ำหนักคืน (Au)</label><input class="num-input input-locked" type="text" id="wf_s4_auReturnWeight" value="${wfFmt(s.auReturnWeight)}" disabled></div>
          <div class="field"><label>หมายเหตุ (Au)</label><input class="num-input input-locked" type="text" id="wf_s4_auRemark" value="${wfFmt(s.auRemark)}" disabled></div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><span class="badge badge-sched">Ag</span></div>
      <div class="panel-body">
        <div class="grid grid-4" style="margin-bottom:16px;">
          <div class="field"><label>Ag คำนวณได้ (g)</label><input class="num-input input-locked" type="text" id="wf_s4_agCalculatedWeight" value="${wfFmt(s.agCalculatedWeight)}" disabled></div>
          <div class="field"><label>% คืน (Ag)</label><input class="num-input" type="text" id="wf_s4_agReturnPercent" value="${s.agReturnPercent}"></div>
          <div class="field"><label>น้ำหนักคืน (Ag)</label><input class="num-input input-locked" type="text" id="wf_s4_agReturnWeight" value="${wfFmt(s.agReturnWeight)}" disabled></div>
          <div class="field"><label>หมายเหตุ (Ag)</label><input class="num-input input-locked" type="text" id="wf_s4_agRemark" value="${wfFmt(s.agRemark)}" disabled></div>
        </div>
        <div class="grid grid-2">
          <div class="field"><label>ค่าบริการ (Ag)</label><input class="num-input input-locked" type="text" id="wf_s4_agServiceFee" value="${wfFmt(s.agServiceFee)}" disabled></div>
          <div class="field"><label>ค่าแรง</label><input class="num-input" type="text" id="wf_s4_laborFee" value="${s.laborFee}"></div>
        </div>
      </div>
    </div>
    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      <button class="btn btn-secondary" onclick="window.openGoldReturnSlipModal()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        พิมพ์ใบรายงานหักทอง
      </button>
      <button class="btn btn-secondary" id="wf_btnRecalc4">${iconChart()} คำนวณใหม่</button>
      <button class="btn btn-primary" id="wf_btnNext4">ขั้นตอนถัดไป →</button>
    </div>
  `;
}

/* STATION 5 — ก่อนส่งรีด */
function wfEnsureLotItems() {
  if (order.station5.lotItems.length) return;
  order.lotNo = 'LOT-2569-0044';
  order.station5.lotItems = [
    { runningNo: 1, rfNo: order.rfNo, cust: order.station1.customerName || '(ไม่ระบุ)', declaredWeight: wfNum(order.station1.declaredWeight) || 300.00, receivedWeight: wfNum(order.station1.receivedWeight) || 298.50, billWeight: wfNum(order.station2.weightAfterMeltAu) || 295.00, weighedBeforeRolling: null, weighedBeforeExtraction: null, damaged: false },
    { runningNo: 2, rfNo: 'RF-2569-0079', cust: 'ห้างทองศิริทองคำ', declaredWeight: 264.10, receivedWeight: 263.00, billWeight: 260.50, weighedBeforeRolling: null, weighedBeforeExtraction: null, damaged: false },
    { runningNo: 3, rfNo: 'RF-2569-0080', cust: 'โรงงานทองไทยเจริญ', declaredWeight: 447.50, receivedWeight: 445.20, billWeight: 441.00, weighedBeforeRolling: null, weighedBeforeExtraction: null, damaged: false },
  ];
}

function wfRecalcStation5Summary() {
  const active = order.station5.lotItems.filter(r => !r.damaged);
  order.station5.summary.sumDeclaredWeight = WfFormula.sum(active.map(r => r.declaredWeight));
  order.station5.summary.sumBillWeight = WfFormula.sum(active.map(r => r.billWeight));
  order.station5.summary.sumWeighedWeight = WfFormula.sum(active.map(r => r.weighedBeforeRolling));
  order.station5.summary.lotNo = order.lotNo;
}

function wfStationS5() {
  wfEnsureLotItems();
  wfRecalcStation5Summary();
  const rows = order.station5.lotItems.map((r, i) => `
    <tr>
      <td>${r.runningNo}</td><td class="cell-primary">${esc(r.rfNo)}</td><td>${esc(r.cust)}</td>
      <td class="num">${wfFmt(r.declaredWeight)}</td>
      <td class="num">${wfFmt(r.receivedWeight)}</td>
      <td class="num">${wfFmt(r.billWeight)}</td>
      <td><input type="text" class="num-input" style="width:110px;" data-wf-s5-row="${i}" value="${r.weighedBeforeRolling ?? ''}" placeholder="0.00"></td>
    </tr>`).join('');
  return `
    <div class="desc" style="margin-bottom:14px;">Lot: <b class="cell-primary">${esc(order.lotNo)}</b> — กรอกน้ำหนักชั่งก่อนรีดของแต่ละ RF</div>
    <div class="table-wrap" style="margin-bottom:20px;">
      <table>
        <thead><tr><th>ลำดับ</th><th>RF No</th><th>ลูกค้า</th><th class="num">น้ำหนักแจ้ง</th><th class="num">น้ำหนักรับ</th><th class="num">น้ำหนักบิล</th><th>น้ำหนักชั่ง - ก่อนรีด</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="field" style="max-width:280px; margin-bottom:16px;"><label>เลข Lot-No</label><input type="text" class="input-locked" value="${esc(order.station5.summary.lotNo)}" disabled></div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head"><span class="badge badge-progress">ทองคำ (Au)</span></div>
      <div class="panel-body">
        <div class="grid grid-3">
          <div class="field"><label>ผลรวมน้ำหนักแจ้ง (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station5.summary.sumDeclaredWeight)}" disabled></div>
          <div class="field"><label>ผลรวมน้ำหนักบิล (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station5.summary.sumBillWeight)}" disabled></div>
          <div class="field"><label>ผลรวมน้ำหนักชั่ง (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station5.summary.sumWeighedWeight)}" disabled></div>
        </div>
      </div>
    </div>

    ${wfOperatorPanel('ผู้ส่ง - ก่อนส่งรีด', order.station5.confirmation.senderName)}
    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      ${wfSaveDraftButton('ก่อนส่งรีด')}
      <button class="btn btn-primary" id="wf_btnNext5">ยืนยันส่งรีด →</button>
    </div>
  `;
}

/* STATION 6 — หลังส่งรีด */
function wfStationS6() {
  order.station6.sumWeighedAfterRolling = order.station6.sumWeighedAfterRolling ?? order.station5.summary.sumWeighedWeight;
  const rows = order.station5.lotItems.map((r, i) => `
    <tr style="${r.damaged ? 'opacity:.4; text-decoration:line-through;' : ''}">
      <td>${r.runningNo}</td><td class="cell-primary">${esc(r.rfNo)}</td><td>${esc(r.cust)}</td>
      <td class="num">${wfFmt(r.declaredWeight)}</td>
      <td class="num">${wfFmt(r.receivedWeight)}</td>
      <td class="num">${wfFmt(r.billWeight)}</td>
      <td class="num">${wfFmt(r.weighedBeforeRolling)}</td>
      <td class="right">${r.damaged ? `<span class="badge badge-hold">รีดเสียหาย</span>` : `<button class="btn btn-danger-ghost btn-sm" data-wf-s6-damage="${i}">รีดเสียหาย</button>`}</td>
    </tr>`).join('');
  return `
    <div class="desc" style="margin-bottom:14px;">กดปุ่ม "รีดเสียหาย" หากพบรายการเสียหาย — ระบบจะคำนวณผลรวมใหม่ทันที</div>
    <div class="table-wrap" style="margin-bottom:20px;">
      <table>
        <thead><tr><th>ลำดับ</th><th>RF No</th><th>ลูกค้า</th><th class="num">น้ำหนักแจ้ง</th><th class="num">น้ำหนักรับ</th><th class="num">น้ำหนักบิล</th><th class="num">น้ำหนักชั่ง - ก่อนรีด</th><th class="right">จัดการ</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">น้ำหนักระหว่างทาง — ไม่แยกโลหะ</div>
      <div class="panel-body">
        <div class="field" style="max-width:320px;">
          ${wfManualTag()}
          <label>ผลรวมน้ำหนักชั่งหลังรีด</label>
          <input class="num-input" type="text" id="wf_s6_sum" value="${order.station6.sumWeighedAfterRolling ?? ''}" placeholder="0.00">
        </div>
      </div>
    </div>
    ${wfOperatorPanel('ผู้ส่ง - หลังส่งรีด', order.station6.confirmation.senderName)}
    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      ${wfSaveDraftButton('หลังส่งรีด')}
      <button class="btn btn-primary" id="wf_btnNext6">ขั้นตอนถัดไป →</button>
    </div>
  `;
}

/* STATION 7 — ก่อนส่งสกัด */
function wfStationS7() {
  const s = order.station7;
  s.panel.sumWeighedAfterRolling = order.station6.sumWeighedAfterRolling;
  const isPellet = order.jobType === 'pellet' || order.station1.jobFormat === 'pellet';
  if (isPellet) s.panel.sumWeighedBeforeExtraction = wfNum(s.weighedBeforeExtractionTable);

  let tableBlock = '';
  if (!isPellet && order.station5.lotItems.length) {
    const rows = order.station5.lotItems.filter(r => !r.damaged).map((r, i) => `
      <tr>
        <td>${r.runningNo}</td><td class="cell-primary">${esc(r.rfNo)}</td><td>${esc(r.cust)}</td>
        <td class="num">${wfFmt(r.declaredWeight)}</td>
        <td class="num">${wfFmt(r.receivedWeight)}</td>
        <td class="num">${wfFmt(r.billWeight)}</td>
        <td class="num">${wfFmt(r.weighedBeforeRolling)}</td>
        <td><input type="text" class="num-input" style="width:110px;" data-wf-s7-row="${i}" value="${r.weighedBeforeExtraction ?? ''}" placeholder="0.00"></td>
      </tr>`).join('');
    tableBlock = `
    <div class="table-wrap" style="margin-bottom:20px;">
      <table>
        <thead><tr><th>ลำดับ</th><th>RF No</th><th>ลูกค้า</th><th class="num">น้ำหนักแจ้ง</th><th class="num">น้ำหนักรับ</th><th class="num">น้ำหนักบิล</th><th class="num">น้ำหนักชั่ง - ก่อนรีด</th><th>น้ำหนักชั่ง - ก่อนส่งสกัด</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  return `
    <div class="desc" style="margin-bottom:14px;">รูปแบบงาน: <b>${isPellet ? 'แบบเม็ด' : 'แบบแท่ง'}</b> — ${isPellet ? 'กรอกน้ำหนักที่ Panel โดยตรง (ไม่ผ่านขั้นตอนรีด)' : 'กรอกน้ำหนักในตารางรายการ และยืนยันผลรวมที่ Panel'}</div>
    ${tableBlock}
    ${isPellet ? `
    <div class="panel" style="margin-bottom:16px;"><div class="panel-head">น้ำหนักแบบเม็ด (ข้ามขั้นตอนรีด)</div><div class="panel-body">
      <div class="field" style="max-width:320px;">${wfManualTag()}<label>น้ำหนักชั่ง - ก่อนส่งสกัด</label><input class="num-input" type="text" id="wf_s7_table" value="${s.weighedBeforeExtractionTable ?? ''}" placeholder="0.00"></div>
    </div></div>` : ''}
    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">น้ำหนักระหว่างทาง — ไม่แยกโลหะ</div>
      <div class="panel-body">
        <div class="grid grid-2">
          <div class="field"><label>ผลรวมน้ำหนักชั่งหลังรีด</label><input class="num-input input-locked" type="text" value="${wfFmt(s.panel.sumWeighedAfterRolling)}" disabled></div>
          <div class="field">
            ${isPellet ? '' : wfManualTag()}
            <label>ผลรวมน้ำหนักชั่งก่อนส่งสกัด ${isPellet ? '' : '<span class="req">*</span>'}</label>
            <input class="num-input ${isPellet ? 'input-locked' : ''}" type="text" id="wf_s7_panel" value="${isPellet ? wfFmt(s.panel.sumWeighedBeforeExtraction) : (s.panel.sumWeighedBeforeExtraction ?? '')}" placeholder="0.00" ${isPellet ? 'disabled' : ''}>
          </div>
        </div>
      </div>
    </div>
    ${wfOperatorPanel('ผู้ส่ง - ก่อนส่งสกัด', order.station7.confirmation.senderName)}
    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      ${wfSaveDraftButton('ก่อนส่งสกัด')}
      <button class="btn btn-primary" id="wf_btnNext7">ขั้นตอนถัดไป →</button>
    </div>
  `;
}

/* STATION 8 — ก่อนหลอม 99 */
function wfEnsureStation8Rows() {
  if (order.station8.rows.length) return;
  order.station8.rows = order.station5.lotItems.filter(r => !r.damaged).map(r => ({
    rfNo: r.rfNo, declaredWeight: r.declaredWeight, receivedWeight: r.receivedWeight, billWeight: r.billWeight,
    weighedBeforeRolling: r.weighedBeforeRolling, weighedBeforeExtraction: r.weighedBeforeExtraction,
    percentAu: order.station3.percentAu || 96.50, auGrams: 0, percentAg: order.station3.percentAg || 0, agGrams: 0,
  }));
}

function wfRecalcStation8() {
  order.station8.rows.forEach(row => {
    row.auGrams = WfFormula.rowAuGrams(row.billWeight, row.percentAu);
    row.agGrams = WfFormula.rowAgGrams(row.billWeight, row.percentAg);
  });
  const p = order.station8.panel;
  p.sumWeighedAfterRolling = order.station6.sumWeighedAfterRolling;
  p.sumWeighedBeforeExtraction = order.station7.panel.sumWeighedBeforeExtraction;
  p.sumBeforeMelt99Au = WfFormula.sum(order.station8.rows.map(r => r.auGrams));
  p.sumBeforeMelt99Ag = WfFormula.sum(order.station8.rows.map(r => r.agGrams));
  p.totalWeighedAuAg = wfRound2(wfNum(p.sumBeforeMelt99Au) + wfNum(p.sumBeforeMelt99Ag));
}

function wfStationS8() {
  wfEnsureStation8Rows();
  wfRecalcStation8();
  const p = order.station8.panel;
  const isSilver = order.metalType === 'silver';
  const rows = order.station8.rows.map((r, i) => `
    <tr>
      <td class="cell-primary">${esc(r.rfNo)}</td>
      <td class="num">${wfFmt(r.declaredWeight)}</td>
      <td class="num">${wfFmt(r.receivedWeight)}</td>
      <td class="num">${wfFmt(r.billWeight)}</td>
      <td class="num">${wfFmt(r.weighedBeforeRolling)}</td>
      <td class="num">${wfFmt(r.weighedBeforeExtraction)}</td>
      <td><input type="text" class="num-input" style="width:90px;" data-wf-s8-au="${i}" value="${r.percentAu ?? ''}" placeholder="0.00"></td>
      <td class="num">${wfFmt(r.auGrams)}</td>
      <td><input type="text" class="num-input" style="width:90px;" data-wf-s8-ag="${i}" value="${r.percentAg ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></td>
      <td class="num">${wfFmt(r.agGrams)}</td>
    </tr>`).join('');
  return `
    <div class="table-wrap" style="margin-bottom:20px;">
      <table>
        <thead><tr><th>RF No</th><th class="num">น้ำหนักแจ้ง</th><th class="num">น้ำหนักรับ</th><th class="num">น้ำหนักบิล</th><th class="num">ก่อนรีด</th><th class="num">ก่อนสกัด</th><th>% Au</th><th class="num">Au (g)</th><th>% Ag</th><th class="num">Ag (g)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">น้ำหนักระหว่างทาง — ไม่แยกโลหะ</div>
      <div class="panel-body">
        <div class="grid grid-2">
          <div class="field"><label>ผลรวมน้ำหนักชั่งหลังรีด</label><input class="num-input input-locked" type="text" value="${wfFmt(p.sumWeighedAfterRolling)}" disabled></div>
          <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนส่งสกัด</label><input class="num-input input-locked" type="text" value="${wfFmt(p.sumWeighedBeforeExtraction)}" disabled></div>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">ทองคำ (Au)</div>
      <div class="panel-body">
        <div class="section-label" style="margin-bottom:10px;">น้ำหนักตั้งต้น (จากบิลลูกค้า)</div>
        <div class="grid grid-3" style="margin-bottom:20px;">
          <div class="field"><label>ผลรวมน้ำหนักแจ้ง (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station5.summary.sumDeclaredWeight)}" disabled></div>
          <div class="field"><label>ผลรวมน้ำหนักบิล (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station5.summary.sumBillWeight)}" disabled></div>
          <div class="field"><label>ผลรวมน้ำหนักชั่ง (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station5.summary.sumWeighedWeight)}" disabled></div>
        </div>
        <div class="section-label" style="margin-bottom:10px;">ก่อนหลอม 99</div>
        <div class="grid grid-2">
          <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(p.sumBeforeMelt99Au)}" disabled></div>
          <div class="field">${wfManualTag()}<label>ผลรวมน้ำหนักผ่านเครื่องชั่ง ก่อนหลอม 99 (Au)</label><input class="num-input" type="text" id="wf_s8_machineAu" value="${p.inputThroughMachineAu ?? ''}" placeholder="0.00"></div>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px; ${isSilver ? '' : 'opacity:.55;'}">
      <div class="panel-head"><span class="badge badge-sched">เงิน (Ag)</span>${isSilver ? '' : '<span class="badge badge-hold" style="margin-left:8px;">ปิดใช้งาน — เลือกชนิดหลอม = เงิน ที่ Station 1</span>'}</div>
      <div class="panel-body">
        <div class="grid grid-2">
          <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Ag)</label><input class="num-input input-locked" type="text" value="${wfFmt(p.sumBeforeMelt99Ag)}" disabled></div>
          <div class="field">${isSilver ? wfManualTag() : ''}<label>ผลรวมน้ำหนักผ่านเครื่องชั่ง ก่อนหลอม 99 (Ag)</label><input class="num-input" type="text" id="wf_s8_machineAg" value="${p.inputThroughMachineAg ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></div>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">รวม Au + Ag</div>
      <div class="panel-body">
        <div class="field" style="max-width:280px;"><label>น้ำหนักชั่งรวม Au + Ag</label><input class="num-input input-locked" type="text" value="${wfFmt(p.totalWeighedAuAg)}" disabled></div>
      </div>
    </div>

    ${wfOperatorPanel('ผู้ส่ง - ก่อนส่งหลอม 99', order.station8.confirmation.senderName)}
    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      ${wfSaveDraftButton('ก่อนส่งหลอม 99')}
      <button class="btn btn-primary" id="wf_btnNext8">ขั้นตอนถัดไป →</button>
    </div>
  `;
}

/* STATION 9 — ปิดงาน */
function wfStationS9() {
  const p = order.station9.panel;
  p.shortageGramsAu = WfFormula.meltShortage(p.sumWeighedAfterMelt99Au, order.station8.panel.sumBeforeMelt99Au);
  p.shortageGramsAg = WfFormula.meltShortage(p.sumWeighedAfterMelt99Ag, order.station8.panel.sumBeforeMelt99Ag);
  if (p.sumWeighedAfterMelt99Ag == null) p.sumWeighedAfterMelt99Ag = order.station8.panel.sumBeforeMelt99Ag;
  const isSilver = order.metalType === 'silver';
  const rows = order.station8.rows.map(r => `
    <tr>
      <td class="cell-primary">${esc(r.rfNo)}</td>
      <td class="num">${wfFmt(r.declaredWeight)}</td>
      <td class="num">${wfFmt(r.receivedWeight)}</td>
      <td class="num">${wfFmt(r.billWeight)}</td>
      <td class="num">${wfFmt(r.percentAu)}%</td><td class="num">${wfFmt(r.auGrams)}</td>
      <td class="num">${wfFmt(r.percentAg)}%</td><td class="num">${wfFmt(r.agGrams)}</td>
    </tr>`).join('');
  return `
    <div class="table-wrap" style="margin-bottom:20px;">
      <table>
        <thead><tr><th>RF No</th><th class="num">น้ำหนักแจ้ง</th><th class="num">น้ำหนักรับ</th><th class="num">น้ำหนักบิล</th><th class="num">% Au</th><th class="num">Au (g)</th><th class="num">% Ag</th><th class="num">Ag (g)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="panel" style="margin-bottom:16px;"><div class="panel-head">ค่าที่ดึงมาจากขั้นตอนก่อนหน้า</div><div class="panel-body">
      <div class="grid grid-3">
        <div class="field"><label>ผลรวมน้ำหนักชั่งหลังรีด</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station6.sumWeighedAfterRolling)}" disabled></div>
        <div class="field"><label>น้ำหนักชั่งก่อนสกัด</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station7.panel.sumWeighedBeforeExtraction)}" disabled></div>
        <div class="field"><label>น้ำหนักชั่งรวม (Au+Ag)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station8.panel.totalWeighedAuAg)}" disabled></div>
      </div>
    </div></div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head"><span class="badge badge-progress">ทองคำ (Au)</span></div>
      <div class="panel-body">
        <div class="section-label" style="margin-bottom:10px;">ก่อนหลอม 99</div>
        <div class="grid grid-2" style="margin-bottom:20px;">
          <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Au)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station8.panel.sumBeforeMelt99Au)}" disabled></div>
          <div class="field"><label>% Au หลังหลอม 99</label><input class="num-input input-locked" type="text" value="${p.percentAuAfter}" disabled></div>
        </div>
        <div class="section-label" style="margin-bottom:10px;">หลังหลอม 99</div>
        <div class="grid grid-3">
          <div class="field">${wfManualTag()}<label>ผลรวมน้ำหนักชั่งหลังหลอม 99 (Au)<span class="req">*</span></label><input class="num-input" type="text" id="wf_s9_afterMelt99Au" value="${p.sumWeighedAfterMelt99Au ?? ''}" placeholder="0.00"></div>
          <div class="field">${wfManualTag()}<label>ขี้เบ้า (Au)</label><input class="num-input" type="text" id="wf_s9_drossAu" value="${p.drossWeightAu ?? ''}" placeholder="0.00"></div>
          <div class="field"><label>ขาด (g) Au</label><input class="num-input input-locked ${p.shortageGramsAu === 0 ? 'diff-match' : (p.shortageGramsAu != null ? 'diff-mismatch' : '')}" type="text" id="wf_s9_shortageAu" value="${wfFmt(p.shortageGramsAu)}" disabled></div>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px; ${isSilver ? '' : 'opacity:.55;'}">
      <div class="panel-head"><span class="badge badge-sched">เงิน (Ag)</span>${isSilver ? '' : '<span class="badge badge-hold" style="margin-left:8px;">ปิดใช้งาน — เลือกชนิดหลอม = เงิน ที่ Station 1</span>'}</div>
      <div class="panel-body">
        <div class="section-label" style="margin-bottom:10px;">ก่อนหลอม 99</div>
        <div class="grid grid-2" style="margin-bottom:20px;">
          <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Ag)</label><input class="num-input input-locked" type="text" value="${wfFmt(order.station8.panel.sumBeforeMelt99Ag)}" disabled></div>
          <div class="field"><label>% Ag หลังหลอม 99</label><input class="num-input input-locked" type="text" value="${p.percentAgAfter}" disabled></div>
        </div>
        <div class="section-label" style="margin-bottom:10px;">หลังหลอม 99</div>
        <div class="grid grid-3">
          <div class="field">${isSilver ? wfManualTag() : ''}<label>ผลรวมน้ำหนักชั่งหลังหลอม 99 (Ag)</label><input class="num-input" type="text" id="wf_s9_afterMelt99Ag" value="${p.sumWeighedAfterMelt99Ag ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></div>
          <div class="field">${isSilver ? wfManualTag() : ''}<label>ขี้เบ้า (Ag)</label><input class="num-input" type="text" id="wf_s9_drossAg" value="${p.drossWeightAg ?? ''}" placeholder="0.00" ${isSilver ? '' : 'disabled'}></div>
          <div class="field"><label>ขาด (g) Ag</label><input class="num-input input-locked ${p.shortageGramsAg === 0 ? 'diff-match' : (p.shortageGramsAg != null ? 'diff-mismatch' : '')}" type="text" id="wf_s9_shortageAg" value="${wfFmt(p.shortageGramsAg)}" disabled></div>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;"><div class="panel-head">ผู้ดำเนินการ</div><div class="panel-body">
      <div class="grid grid-2">
        <div class="field"><label>ผู้ทดสอบ</label><input type="text" class="input-locked" value="${esc(p.tester || CURRENT_USER_EMAIL)}" disabled></div>
        <div class="field"><label>วันที่ทดสอบ</label><input type="text" class="input-locked" value="${esc(p.testDate)}" disabled></div>
      </div>
    </div></div>

    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end; gap:10px;">
      ${wfSaveDraftButton('หลังหลอม 99')}
      <button class="btn btn-danger" id="wf_btnClose9">ปิดงาน</button>
    </div>
  `;
}

/* STATION 10 — TDC Approve */
function wfBuildStation10Summary() {
  const s1 = order.station1, s9 = order.station9.panel, s2 = order.station2;
  order.station10.summary = {
    receiveDate: s1.receiveDate, customerName: wfCustomerLabel(s1.customerName), detail: s1.detail,
    receivedWeight: s1.receivedWeight, declaredWeight: s1.declaredWeight,
    weightAfterMelt: s9.sumWeighedAfterMelt99Au, percentAu: s9.percentAuAfter,
    sampleWeightAu: s2.sampleWeightAu, sampleWeightAg: s2.sampleWeightAg,
  };
}

function wfStationS10() {
  wfBuildStation10Summary();
  const d = order.station10, s = d.summary;
  const statusBadge = d.decision === 'approved' ? `<span class="badge badge-done">อนุมัติแล้ว</span>`
    : d.decision === 'rejected' ? `<span class="badge badge-hold">ปฏิเสธแล้ว</span>`
    : `<span class="badge badge-progress">รออนุมัติ</span>`;
  return `
    <div class="desc" style="margin-bottom:14px;">ตรวจสอบสรุปแล้วอนุมัติ/ปฏิเสธ ${statusBadge}</div>
    <div class="table-wrap" style="margin-bottom:20px;">
      <table><tbody>
        <tr><td>วันรับ</td><td class="num">${esc(s.receiveDate)}</td></tr>
        <tr><td>ชื่อลูกค้า</td><td class="num">${esc(s.customerName)}</td></tr>
        <tr><td>รายละเอียด</td><td class="num">${esc(s.detail || '—')}</td></tr>
        <tr><td>น้ำหนักรับ</td><td class="num">${wfFmt(wfNum(s.receivedWeight))} g</td></tr>
        <tr><td>น้ำหนักแจ้ง</td><td class="num">${wfFmt(wfNum(s.declaredWeight))} g</td></tr>
        <tr><td>น้ำหนักหลังหลอม</td><td class="num">${wfFmt(wfNum(s.weightAfterMelt))} g</td></tr>
        <tr><td>% Au</td><td class="num">${wfFmt(wfNum(s.percentAu))}%</td></tr>
        <tr><td>น้ำหนักตัวอย่าง Au</td><td class="num">${wfFmt(wfNum(s.sampleWeightAu))} g</td></tr>
        <tr><td>น้ำหนักตัวอย่าง Ag</td><td class="num">${wfFmt(wfNum(s.sampleWeightAg))} g</td></tr>
      </tbody></table>
    </div>
    <div class="table-foot" style="border:none; padding:0; justify-content:flex-end;">
      <button class="btn btn-danger" id="wf_btnReject10" ${d.decision ? 'disabled' : ''}>ปฏิเสธ (Reject)</button>
      <button class="btn btn-primary" id="wf_btnApprove10" ${d.decision ? 'disabled' : ''}>อนุมัติ (Approve)</button>
    </div>
  `;
}

/* Event Binding helper forStation forms */
function wfRecalcStation4() {
  const s4 = order.station4, s2 = order.station2, s3 = order.station3, s1 = order.station1;
  const auBaseWeight = s4.includeSampleAu ? (wfNum(s2.weightAfterMeltAu) + wfNum(s2.sampleWeightAu)) : wfNum(s2.weightAfterMeltAu);
  s4.auCalculatedWeight = WfFormula.auCalculatedWeight(auBaseWeight, s3.percentAu);
  s4.auReturnWeight = WfFormula.auReturnWeight(s4.auCalculatedWeight, s4.auReturnPercent);
  s4.auRemark = WfFormula.auRemark(s4.auCalculatedWeight, s4.auReturnWeight);
  s4.agCalculatedWeight = WfFormula.agCalculatedWeight(order.metalType, s2.weightAfterMeltAu, s2.weightAfterMeltAg, s3.percentAg);
  s4.agReturnWeight = WfFormula.agReturnWeight(s4.agCalculatedWeight, s4.agReturnPercent);
  s4.agServiceFee = WfFormula.agServiceFee(s1.receivedWeight);
  s4.agRemark = WfFormula.agRemark(s4.agCalculatedWeight, s4.agReturnWeight);
}

function wfSyncStation4Fields() {
  const map = {
    auCalculatedWeight: 'wf_s4_auCalculatedWeight', auReturnWeight: 'wf_s4_auReturnWeight', auRemark: 'wf_s4_auRemark',
    agCalculatedWeight: 'wf_s4_agCalculatedWeight', agReturnWeight: 'wf_s4_agReturnWeight', agServiceFee: 'wf_s4_agServiceFee', agRemark: 'wf_s4_agRemark'
  };
  Object.entries(map).forEach(([k, id]) => { const el = $('#' + id); if (el) el.value = wfFmt(order.station4[k]); });
}

function wfBindStationEvents() {
  const saveDraftBtn = $('[data-wf-save-draft]');
  if (saveDraftBtn) saveDraftBtn.addEventListener('click', () => {
    wfSyncAll();
    toast(`บันทึกข้อมูล "${saveDraftBtn.dataset.wfSaveDraft}" เรียบร้อย`);
  });

  // Station 1
  $$('#wf_s1_metalType_seg .seg-btn').forEach(btn => btn.addEventListener('click', () => {
    order.station1.metalType = btn.dataset.segValue;
    order.metalType = btn.dataset.segValue || null;
    $$('#wf_s1_metalType_seg .seg-btn').forEach(b => b.classList.toggle('active', b === btn));
  }));
  ['wf_s1_rfNo', 'wf_s1_detail'].forEach(id => {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => { order.station1[id.replace('wf_s1_', '')] = el.value; if (id === 'wf_s1_rfNo') order.rfNo = el.value; });
  });
  $$('#wf_s1_jobFormat_seg .seg-btn').forEach(btn => btn.addEventListener('click', () => {
    order.station1.jobFormat = btn.dataset.segValue;
    order.jobType = btn.dataset.segValue || null;
    $$('#wf_s1_jobFormat_seg .seg-btn').forEach(b => b.classList.toggle('active', b === btn));
  }));
  const s1Cust = $('#wf_s1_customerName');
  if (s1Cust) s1Cust.addEventListener('change', () => { order.station1.customerName = s1Cust.value; });
  ['wf_s1_declaredWeight', 'wf_s1_receivedWeight'].forEach(id => {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => {
      order.station1[id.replace('wf_s1_', '')] = el.value;
      order.station1.diffWeight = WfFormula.diffWeight(order.station1.declaredWeight, order.station1.receivedWeight);
      const diffEl = $('#wf_s1_diffWeight');
      if (diffEl) {
        diffEl.value = wfFmt(order.station1.diffWeight);
        wfPaintDiffField(diffEl, order.station1.diffWeight === 0);
      }
    });
  });
  const btnNext1 = $('#wf_btnNext1');
  if (btnNext1) btnNext1.addEventListener('click', () => {
    if (!order.station1.rfNo || !order.station1.customerName || !order.station1.metalType || order.station1.declaredWeight == null || order.station1.receivedWeight == null || !order.station1.jobFormat) {
      toast('กรุณากรอกข้อมูลที่มี * ให้ครบก่อน'); return;
    }
    if (!wfIsValidRfNo(order.station1.rfNo)) {
      toast('รูปแบบ RF No ไม่ถูกต้อง — ต้องเป็น RF-2569-xxxx (ตัวเลข 4 หลัก)'); return;
    }
    if (wfIsFutureDate(order.station1.receiveDate)) {
      toast('วันที่รับต้องไม่เกินวันที่ปัจจุบัน'); return;
    }
    wfOpenConfirmModal({
      title: 'ยืนยันขั้นตอนถัดไป — Station 1 → 2', receiverLabel: 'ผู้รับ (ช่างหลอม)', senderLabel: 'ผู้ส่ง',
      onConfirm: (receiver) => {
        order.station2.smelterName = receiver;
        state.wfMaxUnlocked = Math.max(state.wfMaxUnlocked, 2); state.wfCurrent = 2;
        wfSyncAll(); toast('ยืนยันส่งต่อ Station 2 เรียบร้อย'); wfRefresh();
      }
    });
  });
  const btnCancel1 = $('#wf_btnCancel1'); if (btnCancel1) btnCancel1.addEventListener('click', () => toast('ยกเลิก RF-No: ' + order.rfNo));

  // Station 2
  ['wf_s2_weightAfterMeltAu', 'wf_s2_sampleWeightAu', 'wf_s2_customerSampleWeightAu', 'wf_s2_drossAu', 'wf_s2_weightAfterMeltAg', 'wf_s2_sampleWeightAg', 'wf_s2_customerSampleWeightAg', 'wf_s2_drossAg'].forEach(id => {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => {
      order.station2[id.replace('wf_s2_', '')] = el.value;
      order.station2.shortageAu = WfFormula.shortage(order.station2.weightAfterMeltAu, order.station2.sampleWeightAu, order.station2.customerSampleWeightAu, order.station1.receivedWeight);
      order.station2.shortageAg = WfFormula.shortage(order.station2.weightAfterMeltAg, order.station2.sampleWeightAg, order.station2.customerSampleWeightAg, order.station1.receivedWeight);
      const shortAuEl = $('#wf_s2_shortageAu'); if (shortAuEl) { shortAuEl.value = wfFmt(order.station2.shortageAu); wfPaintDiffField(shortAuEl, order.station2.shortageAu === 0); }
      const shortAgEl = $('#wf_s2_shortageAg'); if (shortAgEl) { shortAgEl.value = wfFmt(order.station2.shortageAg); wfPaintDiffField(shortAgEl, order.station2.shortageAg === 0); }
    });
  });
  const btnNext2 = $('#wf_btnNext2');
  if (btnNext2) btnNext2.addEventListener('click', () => {
    wfOpenConfirmModal({
      title: 'ยืนยันขั้นตอนถัดไป — Station 2 → 3', receiverLabel: 'ผู้รับ (ช่างทดสอบ)', senderLabel: 'ผู้ส่ง',
      onConfirm: (receiver) => {
        order.station3.testerName = receiver;
        state.wfMaxUnlocked = Math.max(state.wfMaxUnlocked, 3); state.wfCurrent = 3;
        wfSyncAll(); toast('ยืนยันส่งต่อ Station 3 เรียบร้อย'); wfRefresh();
      }
    });
  });
  const btnCancel2 = $('#wf_btnCancel2'); if (btnCancel2) btnCancel2.addEventListener('click', () => toast('ยกเลิก RF-No: ' + order.rfNo));

  // Station 3
  ['wf_s3_percentAu', 'wf_s3_percentAg'].forEach(id => {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => { order.station3[id.replace('wf_s3_', '')] = el.value; });
  });
  const btnSendTdc3 = $('#wf_btnSendTdc3');
  if (btnSendTdc3) btnSendTdc3.addEventListener('click', () => {
    if (order.station3.percentAu == null || order.station3.percentAu === '') {
      toast('กรุณากรอก % Au ก่อนส่งอนุมัติ'); return;
    }
    order.percentApproval.status = 'pending';
    order.percentApproval.decidedBy = null; order.percentApproval.decidedAt = null;
    wfSyncAll();
    toast('ส่ง %Au/%Ag ให้ TDC อนุมัติแล้ว');
    renderSidebar();
    wfRefresh();
  });
  const btnNext3 = $('#wf_btnNext3');
  if (btnNext3) btnNext3.addEventListener('click', () => {
    wfRecalcStation4();
    wfOpenConfirmModal({
      title: 'ยืนยันขั้นตอนถัดไป — Station 3 → 4', receiverLabel: 'ผู้รับ', senderLabel: 'ผู้ส่ง',
      onConfirm: () => { state.wfMaxUnlocked = Math.max(state.wfMaxUnlocked, 4); state.wfCurrent = 4; wfSyncAll(); toast('ยืนยันส่งต่อ Station 4 เรียบร้อย'); wfRefresh(); }
    });
  });
  const btnCancel3 = $('#wf_btnCancel3'); if (btnCancel3) btnCancel3.addEventListener('click', () => toast('ยกเลิก RF-No: ' + order.rfNo));

  // Station 4
  const incSampleAu = $('#wf_s4_includeSampleAu');
  if (incSampleAu) {
    incSampleAu.addEventListener('change', () => {
      order.station4.includeSampleAu = incSampleAu.checked;
      wfRecalcStation4(); wfSyncStation4Fields();
    });
  }
  ['wf_s4_auReturnPercent', 'wf_s4_agReturnPercent', 'wf_s4_laborFee'].forEach(id => {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => { order.station4[id.replace('wf_s4_', '')] = el.value; wfRecalcStation4(); wfSyncStation4Fields(); });
  });
  const btnRecalc4 = $('#wf_btnRecalc4'); if (btnRecalc4) btnRecalc4.addEventListener('click', () => { wfRecalcStation4(); wfSyncStation4Fields(); toast('คำนวณ Station 4 ใหม่แล้ว'); });
  const btnNext4 = $('#wf_btnNext4');
  if (btnNext4) btnNext4.addEventListener('click', () => {
    wfOpenConfirmModal({
      title: 'ยืนยันเสร็จสิ้นระดับ RF — พร้อมเข้าสู่การจัดล็อต', receiverLabel: 'ผู้รับ (เจ้าหน้าที่จัดล็อต)', senderLabel: 'ผู้ส่ง', senderName: 'เจ้าหน้าที่ (Current User)',
      onConfirm: () => {
        wfSyncAll();
        const jobType = order.station1.jobFormat === 'pellet' ? 'pellet' : 'bar';
        toast(`บันทึก ${order.rfNo} เสร็จสิ้นระดับ RF เรียบร้อย — เข้าสู่การจัดล็อตแบบ${jobType === 'pellet' ? 'เม็ด' : 'แท่ง'}อัตโนมัติ`);
        state.wfStepperLimit = null;
        openLotAllocateView(jobType);
      }
    });
  });

  // Station 5
  $$('[data-wf-s5-row]').forEach(el => el.addEventListener('input', () => {
    const i = parseInt(el.dataset.wfS5Row); order.station5.lotItems[i].weighedBeforeRolling = el.value;
    wfRecalcStation5Summary(); wfRefresh();
  }));
  const btnNext5 = $('#wf_btnNext5');
  if (btnNext5) btnNext5.addEventListener('click', () => {
    wfOpenConfirmModal({
      title: 'ยืนยันส่งรีด — Station 5 → 6', receiverLabel: 'ผู้รับ - ก่อนส่งรีด (ช่าง)', senderLabel: 'ผู้ส่ง - ก่อนส่งรีด', senderName: 'เจ้าหน้าที่ (Current User)',
      onConfirm: (receiver) => {
        order.station5.confirmation.receiverName = receiver;
        state.wfMaxUnlocked = Math.max(state.wfMaxUnlocked, 6); state.wfCurrent = 6;
        wfSyncAll(); toast('ยืนยันส่งรีดเรียบร้อย'); wfRefresh();
      }
    });
  });

  // Station 6
  $$('[data-wf-s6-damage]').forEach(el => el.addEventListener('click', () => {
    const i = parseInt(el.dataset.wfS6Damage); const row = order.station5.lotItems[i]; row.damaged = true;
    wfRecalcStation5Summary(); order.station6.sumWeighedAfterRolling = order.station5.summary.sumWeighedWeight;
    toast(`ตัด ${row.rfNo} ออกจาก Lot แล้ว — คำนวณผลรวมใหม่`); wfRefresh();
  }));
  const s6Sum = $('#wf_s6_sum'); if (s6Sum) s6Sum.addEventListener('input', () => { order.station6.sumWeighedAfterRolling = s6Sum.value; });
  const btnNext6 = $('#wf_btnNext6');
  if (btnNext6) btnNext6.addEventListener('click', () => {
    wfOpenConfirmModal({
      title: 'ยืนยันขั้นตอนถัดไป — Station 6 → 7', receiverLabel: 'ผู้รับ - ก่อนส่งรีด (ช่าง)', senderLabel: 'ผู้ส่ง', senderName: 'เจ้าหน้าที่ (Current User)',
      onConfirm: (receiver) => {
        order.station6.confirmation.receiverName = receiver;
        state.wfMaxUnlocked = Math.max(state.wfMaxUnlocked, 7); state.wfCurrent = 7;
        wfSyncAll(); toast('ยืนยันส่งต่อ Station 7 เรียบร้อย'); wfRefresh();
      }
    });
  });

  // Station 7
  $$('[data-wf-s7-row]').forEach(el => el.addEventListener('input', () => {
    const active = order.station5.lotItems.filter(r => !r.damaged);
    const i = parseInt(el.dataset.wfS7Row);
    if (active[i]) active[i].weighedBeforeExtraction = el.value;
  }));
  const s7Table = $('#wf_s7_table'); if (s7Table) s7Table.addEventListener('input', () => { order.station7.weighedBeforeExtractionTable = s7Table.value; });
  const s7Panel = $('#wf_s7_panel'); if (s7Panel && !s7Panel.disabled) s7Panel.addEventListener('input', () => { order.station7.panel.sumWeighedBeforeExtraction = s7Panel.value; });
  const btnNext7 = $('#wf_btnNext7');
  if (btnNext7) btnNext7.addEventListener('click', () => {
    wfOpenConfirmModal({
      title: 'ยืนยันขั้นตอนถัดไป — Station 7 → 8', receiverLabel: 'ผู้รับ', senderLabel: 'ผู้ส่ง', senderName: 'เจ้าหน้าที่ (Current User)',
      onConfirm: (receiver) => {
        order.station7.confirmation.receiverName = receiver;
        state.wfMaxUnlocked = Math.max(state.wfMaxUnlocked, 8); state.wfCurrent = 8;
        wfSyncAll(); toast('ยืนยันส่งต่อ Station 8 เรียบร้อย'); wfRefresh();
      }
    });
  });

  // Station 8
  $$('[data-wf-s8-au]').forEach(el => el.addEventListener('input', () => { const i = parseInt(el.dataset.wfS8Au); order.station8.rows[i].percentAu = el.value; wfRefresh(); }));
  $$('[data-wf-s8-ag]').forEach(el => el.addEventListener('input', () => { const i = parseInt(el.dataset.wfS8Ag); order.station8.rows[i].percentAg = el.value; wfRefresh(); }));
  const s8Au = $('#wf_s8_machineAu'); if (s8Au) s8Au.addEventListener('input', () => { order.station8.panel.inputThroughMachineAu = s8Au.value; });
  const s8Ag = $('#wf_s8_machineAg'); if (s8Ag) s8Ag.addEventListener('input', () => { order.station8.panel.inputThroughMachineAg = s8Ag.value; });
  const btnNext8 = $('#wf_btnNext8');
  if (btnNext8) btnNext8.addEventListener('click', () => {
    wfOpenConfirmModal({
      title: 'ยืนยันขั้นตอนถัดไป — Station 8 → 9', receiverLabel: 'ผู้รับ', senderLabel: 'ผู้ส่ง', senderName: 'เจ้าหน้าที่ (Current User)',
      onConfirm: (receiver) => {
        order.station8.confirmation.receiverName = receiver;
        state.wfMaxUnlocked = Math.max(state.wfMaxUnlocked, 9); state.wfCurrent = 9;
        wfSyncAll(); toast('ยืนยันส่งต่อ Station 9 เรียบร้อย'); wfRefresh();
      }
    });
  });

  // Station 9
  ['wf_s9_afterMelt99Au', 'wf_s9_drossAu', 'wf_s9_afterMelt99Ag', 'wf_s9_drossAg'].forEach(id => {
    const el = $('#' + id); if (!el) return;
    const key = { wf_s9_afterMelt99Au: 'sumWeighedAfterMelt99Au', wf_s9_drossAu: 'drossWeightAu', wf_s9_afterMelt99Ag: 'sumWeighedAfterMelt99Ag', wf_s9_drossAg: 'drossWeightAg' }[id];
    el.addEventListener('input', () => {
      order.station9.panel[key] = el.value;
      order.station9.panel.shortageGramsAu = WfFormula.meltShortage(order.station9.panel.sumWeighedAfterMelt99Au, order.station8.panel.sumBeforeMelt99Au);
      order.station9.panel.shortageGramsAg = WfFormula.meltShortage(order.station9.panel.sumWeighedAfterMelt99Ag, order.station8.panel.sumBeforeMelt99Ag);
      const shortageAuEl = $('#wf_s9_shortageAu'); if (shortageAuEl) { shortageAuEl.value = wfFmt(order.station9.panel.shortageGramsAu); wfPaintDiffField(shortageAuEl, order.station9.panel.shortageGramsAu === 0); }
      const shortageAgEl = $('#wf_s9_shortageAg'); if (shortageAgEl) { shortageAgEl.value = wfFmt(order.station9.panel.shortageGramsAg); wfPaintDiffField(shortageAgEl, order.station9.panel.shortageGramsAg === 0); }
    });
  });
  const btnClose9 = $('#wf_btnClose9');
  if (btnClose9) btnClose9.addEventListener('click', () => {
    wfOpenConfirmModal({
      title: 'ยืนยันปิดงาน — Station 9', receiverLabel: 'ผู้ปิดงาน', senderLabel: 'ผู้ส่ง', senderName: 'เจ้าหน้าที่ (Current User)',
      onConfirm: (receiver) => {
        order.station9.closeJob.closedBy = receiver; order.station9.closeJob.closedAt = new Date().toLocaleString('th-TH');
        wfSyncAll();
        toast(`ปิดงาน ${order.rfNo} เรียบร้อย — จบกระบวนการ`);
        goPage('orders');
      }
    });
  });

  // Station 10
  const btnApprove10 = $('#wf_btnApprove10');
  if (btnApprove10) btnApprove10.addEventListener('click', () => {
    order.station10.decision = 'approved'; order.station10.decidedAt = new Date().toLocaleString('th-TH');
    toast(`อนุมัติ Order ${order.rfNo} เรียบร้อย`); wfRefresh();
  });
  const btnReject10 = $('#wf_btnReject10');
  if (btnReject10) btnReject10.addEventListener('click', () => {
    order.station10.decision = 'rejected'; order.station10.decidedAt = new Date().toLocaleString('th-TH');
    toast(`ปฏิเสธ Order ${order.rfNo} เรียบร้อย`); wfRefresh();
  });

  const btnBack = $('[data-action="wf-back"]');
  if (btnBack) btnBack.addEventListener('click', () => goPage('orders'));
}

/* Read-Only RF Summary View */
function buildRfSummaryData(rf) {
  if (order.rfNo === rf) return order;
  const rec = LOT_ALLOCATE.find(r => r.rf === rf) || ORDERS.find(o => o.rf === rf) || {};
  const declared = wfNum(rec.wDeclared ?? rec.w);
  const received = wfNum(rec.w ?? rec.wDeclared);
  const meltedAu = received;
  const sampleAu = wfRound2(received * 0.01);
  const custSampleAu = sampleAu;
  const percentAu = wfNum(rec.percentAu) || 96.50;
  const percentAg = wfNum(rec.percentAg) || 0;
  const auCalc = WfFormula.auCalculatedWeight(meltedAu, percentAu);
  const auReturnPercent = 95;
  const auReturn = WfFormula.auReturnWeight(auCalc, auReturnPercent);
  return {
    rfNo: rf, metalType: percentAg > 0 ? 'silver' : 'gold',
    station1: {
      rfNo: rf, receiveDate: rec.date || todayStr(), customerName: rec.cust || '', metalType: percentAg > 0 ? 'silver' : 'gold',
      declaredWeight: declared, receivedWeight: received, diffWeight: WfFormula.diffWeight(declared, received),
      detail: '', jobFormat: rec.type || 'bar',
    },
    station2: {
      weightAfterMeltAu: meltedAu, sampleWeightAu: sampleAu, customerSampleWeightAu: custSampleAu,
      shortageAu: WfFormula.shortage(meltedAu, sampleAu, custSampleAu, received), drossAu: 0,
      weightAfterMeltAg: 0, sampleWeightAg: 0, customerSampleWeightAg: 0, shortageAg: 0, drossAg: 0,
      smelterName: 'ชัยวัฒน์ ทองแท้',
    },
    station3: { percentAu, percentAg, testerName: 'ชัยวัฒน์ ทองแท้' },
    station4: {
      auCalculatedWeight: auCalc, auReturnPercent, auReturnWeight: auReturn, auRemark: WfFormula.auRemark(auCalc, auReturn),
      agCalculatedWeight: 0, agReturnPercent: 95, agReturnWeight: 0, agRemark: 0,
      agServiceFee: WfFormula.agServiceFee(received), laborFee: 200,
    },
  };
}

function pageRfSummary(rf) {
  const d = buildRfSummaryData(rf);
  const s1 = d.station1, s2 = d.station2, s3 = d.station3, s4 = d.station4;
  const isSilver = s1.metalType === 'silver';
  return `
    <div class="page-head">
      <div>
        <h1>${esc(rf)} <span class="badge badge-sched" style="vertical-align:middle; font-size:15px;">จัดล็อต</span> <span style="font-size:18px; font-weight:500; color:var(--text-secondary);">${esc(s1.customerName)}</span></h1>
      </div>
      <button class="btn btn-secondary" id="wf_rfSummaryBack">${iconArrowLeft()} ย้อนกลับ</button>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">สร้างบิลรับงาน</div>
      <div class="panel-body">
        <div class="grid grid-4" style="row-gap:18px;">
          <div class="field"><label>RF-No.</label><div class="ro-val">${esc(rf)}</div></div>
          <div class="field"><label>วันที่รับ</label><div class="ro-val">${esc(s1.receiveDate)}</div></div>
          <div class="field"><label>ลูกค้า</label><div class="ro-val">${esc(s1.customerName)}</div></div>
          <div class="field"><label>ชนิดหลอม</label><div class="ro-val">${isSilver ? 'เงิน' : 'ทอง'}</div></div>
          <div class="field"><label>น้ำหนักแจ้ง</label><div class="ro-val">${wfFmt(s1.declaredWeight)}</div></div>
          <div class="field"><label>น้ำหนักรับ</label><div class="ro-val">${wfFmt(s1.receivedWeight)}</div></div>
          <div class="field"><label>ขาด/เกิน</label><div class="ro-val">${wfFmt(s1.diffWeight)}</div></div>
          <div class="field"><label>รูปแบบ</label><div class="ro-val">${s1.jobFormat === 'pellet' ? 'แบบเม็ด' : 'แบบแท่ง'}</div></div>
        </div>
        <div class="field" style="margin-top:18px;"><label>รายละเอียด</label><div class="ro-val">${esc(s1.detail || '—')}</div></div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">หลอมทองเก่า</div>
      <div class="panel-body">
        <div class="grid grid-4" style="row-gap:18px;">
          <div class="field"><label>น้ำหนักหลังหลอม (Au)</label><div class="ro-val">${wfFmt(s2.weightAfterMeltAu)}</div></div>
          <div class="field"><label>น้ำหนักตัวอย่าง (Au)</label><div class="ro-val">${wfFmt(s2.sampleWeightAu)}</div></div>
          <div class="field"><label>น้ำหนักตัวอย่างลูกค้า (Au)</label><div class="ro-val">${wfFmt(s2.customerSampleWeightAu)}</div></div>
          <div class="field"><label>ขาด (Au)</label><div class="ro-val">${wfFmt(s2.shortageAu)}</div></div>
          <div class="field"><label>ขี้เบ้า (Au)</label><div class="ro-val">${wfFmt(s2.drossAu)}</div></div>
          <div class="field"><label>น้ำหนักตัวอย่าง (Ag)</label><div class="ro-val">${isSilver ? wfFmt(s2.sampleWeightAg) : '—'}</div></div>
          <div class="field"><label>น้ำหนักตัวอย่างลูกค้า (Ag)</label><div class="ro-val">${isSilver ? wfFmt(s2.customerSampleWeightAg) : '—'}</div></div>
          <div class="field"><label>ขาด (Ag)</label><div class="ro-val">${isSilver ? wfFmt(s2.shortageAg) : '—'}</div></div>
          <div class="field"><label>ขี้เบ้า (Ag)</label><div class="ro-val">${isSilver ? wfFmt(s2.drossAg) : '—'}</div></div>
        </div>
        <div class="field" style="margin-top:18px; max-width:280px;"><label>ช่างหลอม</label><div class="ro-val" style="font-weight:700;">${esc(s2.smelterName || '—')}</div></div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">ทดสอบ %</div>
      <div class="panel-body">
        <div class="grid grid-3">
          <div class="field"><label>% Au</label><div class="ro-val">${wfFmt(s3.percentAu)}</div></div>
          <div class="field"><label>% Ag</label><div class="ro-val">${isSilver ? wfFmt(s3.percentAg) : '—'}</div></div>
          <div class="field"><label>ช่างทดสอบ</label><div class="ro-val" style="font-weight:700;">${esc(s3.testerName || '—')}</div></div>
        </div>
        <div class="field" style="margin-top:18px;"><label>หมายเหตุ</label><div class="ro-val">—</div></div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head">หักทอง</div>
      <div class="panel-body">
        <div class="grid grid-4" style="row-gap:18px;">
          <div class="field"><label>Au น้ำหนักที่คำนวณได้ (g)</label><div class="ro-val">${wfFmt(s4.auCalculatedWeight)}</div></div>
          <div class="field"><label>% คืน (Au)</label><div class="ro-val">${wfFmt(s4.auReturnPercent)}</div></div>
          <div class="field"><label>น้ำหนักคืน (Au)</label><div class="ro-val">${wfFmt(s4.auReturnWeight)}</div></div>
          <div class="field"><label>หมายเหตุ (Au)</label><div class="ro-val">${wfFmt(s4.auRemark)}</div></div>
          <div class="field"><label>Ag น้ำหนักที่คำนวณได้ (g)</label><div class="ro-val">${isSilver ? wfFmt(s4.agCalculatedWeight) : '—'}</div></div>
          <div class="field"><label>% คืน (Ag)</label><div class="ro-val">${isSilver ? wfFmt(s4.agReturnPercent) : '—'}</div></div>
          <div class="field"><label>น้ำหนักคืน (Ag)</label><div class="ro-val">${isSilver ? wfFmt(s4.agReturnWeight) : '—'}</div></div>
          <div class="field"><label>หมายเหตุ (Ag)</label><div class="ro-val">${isSilver ? wfFmt(s4.agRemark) : '—'}</div></div>
        </div>
        <div class="grid grid-2" style="margin-top:18px; max-width:400px;">
          <div class="field"><label>ค่าบริการ (Ag)</label><div class="ro-val">${wfFmt(s4.agServiceFee)}</div></div>
          <div class="field"><label>ค่าแรง</label><div class="ro-val">${wfFmt(s4.laborFee)}</div></div>
        </div>
      </div>
    </div>
  `;
}
