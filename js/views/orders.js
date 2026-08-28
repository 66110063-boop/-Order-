/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
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
    <div style="max-width: 860px; margin: 0 auto;">
      <div class="panel" style="margin-bottom: var(--space-md);">
        <div class="panel-head"><div class="title">ข้อมูลอ้างอิง</div></div>
        <div class="panel-body">
          <div class="grid-3">
            <div class="field"><label>RF No<span class="req">*</span></label><input type="text" placeholder="เช่น RF-B010"></div>
            <div class="field"><label>วันที่รับ<span class="req">*</span></label><input type="date"></div>
            <div class="field"><label>ลูกค้า<span class="req">*</span></label>
              <select><option>เลือกลูกค้า</option>${CUSTOMERS.map(c => `<option>${esc(c.name)}</option>`).join('')}</select>
            </div>
          </div>
        </div>
      </div>
      <div class="panel" style="margin-bottom: var(--space-md);">
        <div class="panel-head"><div class="title">ประเภทงาน</div></div>
        <div class="panel-body">
          <div class="grid-2">
            <div class="field">
              <label>ชนิดหลอม<span class="req">*</span></label>
              <div class="seg-control">
                <button class="seg-btn active">ทองคำ (Au)</button>
                <button class="seg-btn">เงิน (Ag)</button>
              </div>
            </div>
            <div class="field">
              <label>รูปแบบ<span class="req">*</span></label>
              <div class="seg-control">
                <button class="seg-btn active">แบบแท่ง</button>
                <button class="seg-btn">แบบเม็ด</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div class="title">รายละเอียดน้ำหนัก</div></div>
        <div class="panel-body">
          <div class="grid-3">
            <div class="field"><label>น้ำหนักแจ้ง (g)<span class="req">*</span></label><input class="num-input" type="text" inputmode="decimal" placeholder="0.00"></div>
            <div class="field"><label>น้ำหนักรับ (g)<span class="req">*</span></label><input class="num-input" type="text" inputmode="decimal" placeholder="0.00"></div>
            <div class="field"><label>ขาด/เกิน (auto)</label><input class="num-input input-locked" type="text" value="0.00" disabled></div>
          </div>
          <div class="field" style="margin-top:14px;"><label>รายละเอียด</label><input type="text" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"></div>
        </div>
      </div>
    </div>
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
  if (state.tdcDetailId) {
    return pageTdcApproveDetail(state.tdcDetailId);
  }
  return pageTdcApproveList();
}

function pageTdcApproveList() {
  const query = (state.tdcSearchQuery || '').toLowerCase().trim();
  let queue = ORDERS.filter(o => !o.cancelled && o.percentApprovalStatus === 'pending');
  
  if (query) {
    queue = queue.filter(o => 
      o.rf.toLowerCase().includes(query) || 
      (o.cust || '').toLowerCase().includes(query)
    );
  }

  // Pagination logic
  const itemsPerPage = state.tdcItemsPerPage || 20;
  const currentPage = state.tdcPage || 1;
  const totalItems = queue.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Guard current page range
  const activePage = Math.min(currentPage, totalPages);
  const startIdx = (activePage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, totalItems);
  const pageItems = queue.slice(startIdx, endIdx);

  const rows = pageItems.length ? pageItems.map((r, i) => {
    return `
      <tr>
        <td class="cell-primary" style="cursor:pointer; white-space:nowrap; font-weight:700;" data-action="tdc-view-detail" data-rf="${esc(r.rf)}">${esc(r.rf)}</td>
        <td style="white-space:nowrap; color:var(--text-secondary);">${esc(r.date)}</td>
        <td style="white-space:nowrap; font-weight:600; min-width:180px;">${esc(r.cust)}</td>
        <td class="num" style="white-space:nowrap;">${esc(r.wDeclared || r.w)}</td>
        <td class="num" style="white-space:nowrap;">${esc(r.meltedW || '0.00')}</td>
        <td class="num" style="white-space:nowrap;">${r.percentAu || '0.00'}</td>
        <td class="num center" style="white-space:nowrap;">${r.auSample || '0.00'}</td>
        <td class="num center" style="white-space:nowrap;">${r.auSampleCust || '0.00'}</td>
        <td class="num center" style="white-space:nowrap;">${r.percentAg || '0.00'}</td>
        <td style="text-align:center; white-space:nowrap; min-width:180px;">
          <div style="display:flex; align-items:center; justify-content:center; gap:6px; width:100%;">
            <button class="btn btn-sm btn-primary" data-action="tdc-approve-row" data-rf="${esc(r.rf)}">${iconCheck()} อนุมัติ</button>
            <button class="btn btn-sm btn-danger-ghost" data-action="tdc-reject-row" data-rf="${esc(r.rf)}">${iconX()} ไม่อนุมัติ</button>
            <button class="btn btn-sm btn-secondary" data-action="tdc-view-detail" data-rf="${esc(r.rf)}">ดู</button>
          </div>
        </td>
      </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="10">ไม่มีรายการรอตรวจสอบ</td></tr>`;

  // Generate pagination buttons
  let pageButtonsHtml = '';
  for (let p = 1; p <= totalPages; p++) {
    pageButtonsHtml += `<button class="btn btn-sm ${p === activePage ? 'active' : ''}" data-action="tdc-go-page" data-page="${p}">${p}</button>`;
  }

  return `
    <div class="page-head">
      <div><h1>TDC Approve</h1><div class="desc">ตรวจสอบและอนุมัติ %Au/%Ag ที่ทดสอบได้ ก่อนเข้าสู่ขั้นตอนหักทอง</div></div>
    </div>

    <div class="search-row" style="margin-bottom:16px;">
      <input type="text" id="tdcSearchInput" placeholder="ค้นหา RF-No. / ลูกค้า" value="${esc(state.tdcSearchQuery || '')}">
      <button class="btn btn-secondary" data-action="tdc-search-btn">${iconSearch()} ค้นหา</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="white-space:nowrap;">RF-No.</th>
            <th style="white-space:nowrap;">วันที่รับ</th>
            <th style="white-space:nowrap; min-width:180px;">ลูกค้า</th>
            <th class="num" style="white-space:nowrap;">น้ำหนักแจ้ง</th>
            <th class="num" style="white-space:nowrap;">น้ำหนักหลังหลอม</th>
            <th class="num" style="white-space:nowrap;">%Au</th>
            <th class="center" style="white-space:nowrap;">น้ำหนักตัวอย่าง (Au)</th>
            <th class="center" style="white-space:nowrap;">น้ำหนักตัวอย่างลูกค้า (Au)</th>
            <th class="center" style="white-space:nowrap;">%Ag</th>
            <th style="text-align:center; white-space:nowrap; min-width:180px;">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      
      <div class="table-foot" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; font-size:15px; color:var(--text-secondary); border-top:1px solid var(--border);">
        <div style="display:flex; align-items:center; gap:16px; white-space:nowrap;">
          <span>แสดง ${totalItems ? startIdx + 1 : 0}-${endIdx} จาก ${totalItems} รายการ</span>
          <div style="display:flex; align-items:center; gap:6px; white-space:nowrap;">
            <select id="tdcItemsPerPage" style="padding:4px 8px; border-radius:6px; border:1px solid var(--border); font-size:14px; background:var(--surface);">
              <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
              <option value="20" ${itemsPerPage === 20 ? 'selected' : ''}>20</option>
              <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50</option>
            </select>
            <span style="white-space:nowrap;">รายการ/หน้า</span>
          </div>
        </div>
        <div class="pager" style="display:flex; gap:4px; align-items:center;">
          <button class="btn btn-sm" style="border:1px solid var(--border); background:var(--surface); padding: 4px 8px;" data-action="tdc-prev-page" ${activePage === 1 ? 'disabled' : ''}>&lsaquo;</button>
          ${pageButtonsHtml}
          <button class="btn btn-sm" style="border:1px solid var(--border); background:var(--surface); padding: 4px 8px;" data-action="tdc-next-page" ${activePage === totalPages ? 'disabled' : ''}>&rsaquo;</button>
        </div>
      </div>
    </div>`;
}

function pageTdcApproveDetail(rfId) {
  const r = ORDERS.find(o => o.rf === rfId);
  if (!r) return `<div class="page-head"><div><h1>ไม่พบข้อมูล RF</h1></div><button class="btn btn-secondary" data-action="tdc-back-list">ย้อนกลับ</button></div>`;

  return `
    <div class="page-head" style="margin-bottom:12px;">
      <div><h1 style="font-size:24px; font-weight:800; margin:0;">${esc(r.rf)}</h1></div>
    </div>
    
    <div class="lot-section-bar">ข้อมูลรับงาน</div>
    <div class="lot-section-body">
      <div class="lot-field-row">
        <div class="lot-field"><label>วันที่รับ</label><input type="text" class="input-locked" value="${esc(r.date)}" disabled></div>
        <div class="lot-field"><label>ชื่อลูกค้า</label><input type="text" class="input-locked" value="${esc(r.cust)}" disabled></div>
        <div class="lot-field"><label>รายละเอียด</label><input type="text" class="input-locked" value="${esc(r.details || '—')}" disabled></div>
      </div>
    </div>
    
    <div class="lot-section-bar">น้ำหนัก</div>
    <div class="lot-section-body">
      <div class="lot-field-row">
        <div class="lot-field"><label>น้ำหนักรับ</label><input type="text" class="num-input input-locked" value="${esc(r.w)}" disabled></div>
        <div class="lot-field"><label>น้ำหนักแจ้ง</label><input type="text" class="num-input input-locked" value="${esc(r.wDeclared || r.w)}" disabled></div>
        <div class="lot-field"><label>น้ำหนักหลังหลอม</label><input type="text" class="num-input input-locked" value="${esc(r.meltedW || '0.00')}" disabled></div>
      </div>
    </div>
    
    <div class="lot-section-bar">ทอง (Au)</div>
    <div class="lot-section-body">
      <div class="lot-field-row">
        <div class="lot-field"><label>% Au</label><input type="text" class="num-input input-locked" value="${esc(r.percentAu || '0.00')}" disabled></div>
        <div class="lot-field"><label>น้ำหนักตัวอย่าง (Au)</label><input type="text" class="num-input input-locked" value="${esc(r.auSample || '0.00')}" disabled></div>
        <div class="lot-field"><label>น้ำหนักตัวอย่างลูกค้า (Au)</label><input type="text" class="num-input input-locked" value="${esc(r.auSampleCust || '0.00')}" disabled></div>
      </div>
    </div>
    
    <div class="lot-section-bar">เงิน (Ag)</div>
    <div class="lot-section-body">
      <div class="lot-field-row">
        <div class="lot-field"><label>% Ag</label><input type="text" class="num-input input-locked" value="${esc(r.percentAg || '0.00')}" disabled style="max-width:calc(33.33% - 11px);"></div>
      </div>
    </div>
    
    <div style="display:flex; justify-content:center; gap:20px; margin-top:28px; width:100%;">
      <div class="decision-card reject" data-action="tdc-reject-row" data-rf="${esc(r.rf)}">
        <input type="radio" name="approval_status" value="rejected">
        <span class="title">ไม่อนุมัติ</span>
      </div>
      <div class="decision-card approve" data-action="tdc-approve-row" data-rf="${esc(r.rf)}">
        <input type="radio" name="approval_status" value="approved">
        <span class="title">อนุมัติ</span>
      </div>
    </div>`;
}
