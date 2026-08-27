/* ============================================================
   KGR GROUP — ORDERS & TDC APPROVAL VIEWS
   ============================================================ */

function pageOrders() {
  const tabToStation = {};
  WF_STATIONS.forEach(s => { tabToStation[s.key] = s.n; });

  function matchesTab(o, tabKey) {
    if (tabKey === 'all') return !o.cancelled;
    if (tabKey === 'cancel') return !!o.cancelled;
    if (o.cancelled) return false;
    return o.station === tabToStation[tabKey];
  }

  const visible = ORDERS.filter(o => matchesTab(o, state.orderTab));

  const rows = visible.map(o => `
    <tr class="clickable" data-detail="${esc(o.rf)}">
      <td class="cell-primary">${esc(o.rf)}</td>
      <td>${esc(o.date)}</td>
      <td>${esc(o.cust)}</td>
      <td class="num">${esc(o.w)} g</td>
      <td><span class="badge badge-${o.status}">${esc(o.statusLabel)}</span></td>
      <td class="right">
        <div class="table-actions">
          <button class="icon-btn" title="ดูรายละเอียด" data-detail="${esc(o.rf)}">${iconEye()}</button>
          ${o.cancelled ? '' : `<button class="icon-btn" title="ยกเลิก Order" data-action="cancel-order" data-rf="${esc(o.rf)}">${iconTrash()}</button>`}
        </div>
      </td>
    </tr>`).join('');

  return `
    <div class="page-head">
      <div><h1>รายการสั่งซื้อ</h1><div class="desc">รายการ Order ทองทั้งหมด แยกตามสถานะการดำเนินงาน</div></div>
      <button class="btn btn-primary" data-action="new-order">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        สร้าง Order
      </button>
    </div>

    <div class="search-row" style="margin-bottom:16px;">
      <input type="text" placeholder="ค้นหา RF No / ลูกค้า" style="max-width:260px;">
      <input type="text" placeholder="ช่วงวันที่" value="" style="max-width:190px;">
      <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
    </div>

    <div class="tabs">
      ${ORDER_TABS.map(t => {
        const n = ORDERS.filter(o => matchesTab(o, t.key)).length;
        return `<div class="tab ${state.orderTab === t.key ? 'active' : ''}" data-tab="order" data-key="${t.key}">${esc(t.label)}<span class="count">${n}</span></div>`;
      }).join('')}
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>RF No</th><th>วันที่รับ</th><th>ลูกค้า</th><th class="num">น้ำหนักรับ</th><th>สถานะ</th><th class="right">จัดการ</th></tr></thead>
        <tbody>${rows || `<tr class="empty-row"><td colspan="6">ไม่พบรายการในสถานะนี้</td></tr>`}</tbody>
      </table>
      <div class="table-foot">
        <span>แสดง ${visible.length ? 1 : 0}-${visible.length} จาก ${visible.length} รายการ</span>
        <div class="pager"><button>‹</button><button class="active">1</button><button>›</button></div>
      </div>
    </div>
  `;
}

function orderWizardModal() {
  const steps = [
    { n: 1, t: 'รับงาน', s: 'กำลังทำ' },
    { n: 2, t: 'ส่งหลอม', s: 'ยังไม่ถึง' },
    { n: 3, t: 'ทดสอบ %', s: 'ยังไม่ถึง' },
    { n: 4, t: 'คิดค่าใช้จ่าย (หักทอง)', s: 'ยังไม่ถึง' },
    { n: 5, t: 'ส่งให้ TDC', s: 'ยังไม่ถึง' },
  ];
  const chips = steps.map(s => `
    <div class="step-chip ${s.n === state.wizardStep ? 'current' : ''} ${s.n < state.wizardStep ? 'complete' : ''}" data-wizard-step="${s.n}">
      <div class="n">${s.n < state.wizardStep ? '✓' : s.n}</div>
      <div><div class="t">${esc(s.t)}</div><div class="s">${s.n === state.wizardStep ? 'กำลังทำ' : (s.n < state.wizardStep ? 'เสร็จสิ้น' : 'ยังไม่ถึง')}</div></div>
    </div>`).join('');

  const step1 = `
    <div class="grid-4" style="grid-template-columns:repeat(4,1fr); gap:14px;">
      <div class="field"><label>RF No<span class="req">*</span></label><input type="text" placeholder="เช่น RF-B010"></div>
      <div class="field"><label>วันที่รับ<span class="req">*</span></label><input type="date"></div>
      <div class="field"><label>ลูกค้า<span class="req">*</span></label>
        <select><option>เลือกลูกค้า</option>${CUSTOMERS.map(c => `<option>${esc(c.name)}</option>`).join('')}</select>
      </div>
      <div class="field"><label>ชนิดหลอม<span class="req">*</span></label><select><option>ทอง</option><option>เงิน</option></select></div>
      <div class="field"><label>น้ำหนักแจ้ง (g)<span class="req">*</span></label><input class="num-input" type="text" placeholder="0.00"></div>
      <div class="field"><label>น้ำหนักรับ (g)<span class="req">*</span></label><input class="num-input" type="text" placeholder="0.00"></div>
      <div class="field"><label>ขาด/เกิน (auto)</label><input class="num-input input-locked" type="text" value="0.00" disabled></div>
      <div class="field"><label>รูปแบบ<span class="req">*</span></label><select><option>แบบแท่ง</option><option>แบบเม็ด</option></select></div>
    </div>
    <div class="field" style="margin-top:14px;"><label>รายละเอียด</label><input type="text" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"></div>
  `;
  const placeholderStep = (label) => `<div style="padding:50px 0; text-align:center; color:var(--text-secondary);">
      <div style="font-size:16px;">ขั้นตอน "${esc(label)}" จะเปิดใช้งานหลังจากบันทึกสเตปก่อนหน้า</div>
    </div>`;

  const body = state.wizardStep === 1 ? step1
    : state.wizardStep === 2 ? placeholderStep('ส่งหลอม')
    : state.wizardStep === 3 ? placeholderStep('ทดสอบ %')
    : state.wizardStep === 4 ? placeholderStep('คิดค่าใช้จ่าย (หักทอง)')
    : placeholderStep('ส่งให้ TDC');

  return `
    <div class="modal modal-lg">
      <div class="modal-head">
        <h3>สร้าง Order</h3>
        <button class="modal-close" data-close-modal>${iconX()}</button>
      </div>
      <div class="modal-body">
        <div class="stepper">${chips}</div>
        <div class="card card-pad">
          <div style="font-weight:700; font-size:16px; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
            <span style="width:22px;height:22px;border-radius:50%;background:var(--btn-primary);color:var(--fg-on-dark);display:inline-flex;align-items:center;justify-content:center;font-size:16px;">${state.wizardStep}</span>
            ${esc(steps[state.wizardStep - 1].t)}
          </div>
          ${body}
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-secondary" data-close-modal>ยกเลิก</button>
        <button class="btn btn-secondary" data-action="wizard-save">บันทึก</button>
        <button class="btn btn-primary" data-action="wizard-send">ส่งหลอม</button>
      </div>
    </div>`;
}

function pageTdcApprove() {
  const queue = ORDERS.filter(o => !o.cancelled && o.percentApprovalStatus === 'pending');

  const cards = queue.map((r) => {
    const isSilver = wfNum(r.percentAg) > 0;
    return `
    <div class="tdc-card">
      <div class="tdc-card-head">
        <div>
          <div class="tdc-card-rf">${esc(r.rf)}</div>
          <div class="tdc-card-cust">${esc(r.cust)} • ทดสอบเมื่อ ${esc(r.date)}</div>
        </div>
        <div class="tdc-card-weight"><span class="val">${esc(r.w)} g</span><span class="lbl">น้ำหนักรับ</span></div>
      </div>
      <div class="tdc-card-body">
        <div class="grid grid-2">
          <div class="tdc-metal-panel" style="margin-bottom:0;">
            <div class="tdc-metal-head"><span class="badge badge-progress">Au — ทอง</span></div>
            <div class="tdc-metal-body" style="grid-template-columns:1fr;">
              <div class="field"><label>% Au ที่ทดสอบได้</label><input type="text" class="num-input input-locked" style="font-size:24px; font-weight:800;" value="${wfFmt(wfNum(r.percentAu))}%" disabled></div>
            </div>
          </div>
          <div class="tdc-metal-panel" style="margin-bottom:0; ${isSilver ? '' : 'opacity:.55;'}">
            <div class="tdc-metal-head"><span class="badge badge-sched">Ag — เงิน</span>${isSilver ? '' : '<span class="badge badge-hold" style="margin-left:10px;">Order นี้ไม่มีเงิน</span>'}</div>
            <div class="tdc-metal-body" style="grid-template-columns:1fr;">
              <div class="field"><label>% Ag ที่ทดสอบได้</label><input type="text" class="num-input input-locked" style="font-size:24px; font-weight:800;" value="${wfFmt(wfNum(r.percentAg))}%" disabled></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tdc-card-foot">
        <button class="btn btn-danger-ghost" data-action="tdc-reject-row" data-rf="${esc(r.rf)}">ปฏิเสธ</button>
        <button class="btn btn-primary" data-action="tdc-approve-row" data-rf="${esc(r.rf)}">${iconCheck()} อนุมัติ %</button>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="page-head">
      <div><h1>TDC อนุมัติ %</h1><div class="desc">ตรวจสอบและอนุมัติ %Au/%Ag ที่ทดสอบได้ ก่อนเข้าสู่ขั้นตอนหักทอง</div></div>
      <span class="badge badge-progress" style="font-size:16px; padding:8px 16px;">รออนุมัติ ${queue.length} รายการ</span>
    </div>

    <div class="search-row" style="margin-bottom:20px;">
      <input type="text" placeholder="ค้นหา RF No / ลูกค้า">
      <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
    </div>

    ${cards || `<div class="panel"><div class="panel-body" style="text-align:center; color:var(--text-secondary); padding:40px;">ไม่มีรายการรออนุมัติ</div></div>`}
  `;
}
