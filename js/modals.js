/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* ============================================================
   KGR GROUP — MODALS & EVENT HANDLERS
   ============================================================ */

/* Generic Modal Root Helpers */
function openModal(html) {
  const root = $('#overlayRoot');
  if (!root) return;
  root.innerHTML = html;
  root.classList.add('active');
  root.addEventListener('click', e => { if (e.target === root) closeModal(); }, { once: true });
}

function closeModal() {
  const root = $('#overlayRoot');
  if (!root) return;
  root.classList.remove('active');
  root.innerHTML = '';
}

const RF_DETAIL_STEPS = [
  { n: 1, key: 'receive', t: 'จัดรับงาน' },
  { n: 2, key: 'melt', t: 'หลอม' },
  { n: 3, key: 'test', t: 'ทดสอบ %' },
  { n: 4, key: 'deduct', t: 'หักทอง' },
  { n: 5, key: 'tdc', t: 'TDC' },
];

function genericDetailModal(rf) {
  const step = state.detailStep || 1;
  const chips = RF_DETAIL_STEPS.map(s => {
    const cls = s.n === step ? 'current' : s.n < step ? 'complete' : '';
    const statusText = s.n === step ? 'กำลังทำ' : s.n < step ? 'เสร็จแล้ว' : 'ยังไม่ถึง';
    return `<div class="step-chip ${cls}" data-detail-step="${s.n}">
      <div class="n">${s.n < step ? iconCheck() : s.n}</div>
      <div><div class="t">${esc(s.t)}</div><div class="s">${esc(statusText)}</div></div>
    </div>`;
  }).join('');

  const currentLabel = RF_DETAIL_STEPS.find(s => s.n === step)?.t || '';
  const isLast = step >= RF_DETAIL_STEPS.length;

  return `
    <div class="modal modal-lg">
      <div class="modal-head"><h3>รายละเอียดงาน · ${esc(rf)}</h3><button class="modal-close" data-close-modal>${iconX()}</button></div>
      <div class="modal-body">
        <div class="stepper" style="margin-bottom:20px;">${chips}</div>

        <div class="grid-2" style="gap:16px; margin-bottom:16px;">
          <div class="field"><label>RF No</label><input type="text" value="${esc(rf)}" class="input-locked" disabled></div>
          <div class="field"><label>ขั้นตอนปัจจุบัน</label><input type="text" value="${esc(currentLabel)}" class="input-locked" disabled></div>
        </div>

        <div class="grid-2" style="gap:16px; margin-bottom:16px;">
          <div class="field"><label>% Au (ทอง)</label><input class="num-input" type="text" placeholder="0.00" value="96.50"></div>
          <div class="field"><label>% Ag (เงิน)</label><input class="num-input" type="text" placeholder="0.00" value="2.10"></div>
        </div>

        <div class="field" style="margin-bottom:16px;"><label>น้ำหนักทอง (g)</label><input class="num-input" type="text" placeholder="0.00" value="100.00"></div>
        <div class="field" style="margin-bottom:16px;"><label>หมายเหตุ</label><input type="text" placeholder="บันทึกหมายเหตุขั้นตอนนี้ (ไม่บังคับ)"></div>

        <div class="divider"></div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" data-action="goto-history">${iconClock()} ดูประวัติการใช้งานและการแก้ไข (Audit Log)</button>
          <button class="btn btn-ghost btn-sm" data-action="export-excel-rf" data-rf="${esc(rf)}">${iconDownload()} Export Excel</button>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-secondary" data-close-modal>ปิด</button>
        <button class="btn btn-secondary" data-action="save-detail-step" data-rf="${esc(rf)}">บันทึก</button>
        <button class="btn btn-primary" data-action="advance-detail-step" data-rf="${esc(rf)}" ${isLast ? 'disabled' : ''}>${isLast ? 'เสร็จสิ้นขั้นตอนทั้งหมด' : 'บันทึก / ส่งต่อขั้นตอนถัดไป →'}</button>
      </div>
    </div>`;
}

function invoiceTemplatePickerModal() {
  const options = [
    { key: 'blank', title: 'เอกสารเปล่า', desc: 'เริ่มจากฟอร์มว่าง — กรอกรายการเองทั้งหมด', icon: iconDoc() },
    { key: 'gold', title: 'ค่าดำเนินการสกัดทอง', desc: 'เทมเพลตคำนวณสกัดทองมาตรฐาน พร้อมสูตรน้ำหนัก/ราคา', icon: iconChart() },
    { key: 'silver', title: 'ค่าดำเนินการสกัดเงิน', desc: 'เทมเพลตคำนวณสกัดเงินมาตรฐาน พร้อมสูตรน้ำหนัก/ราคา', icon: iconChart() },
  ];
  return `
    <div class="modal modal-md">
      <div class="modal-head"><h3>เลือก Template สำหรับ Invoice ใหม่</h3><button class="modal-close" data-close-modal>${iconX()}</button></div>
      <div class="modal-body">
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${options.map(o => `
          <button type="button" class="tpl-pick-card" data-action="pick-invoice-template" data-tpl="${o.key}">
            <span class="tpl-pick-icon">${o.icon}</span>
            <span class="tpl-pick-text">
              <span class="tpl-pick-title">${esc(o.title)}</span>
              <span class="tpl-pick-desc">${esc(o.desc)}</span>
            </span>
          </button>`).join('')}
        </div>
      </div>
    </div>`;
}

function lotReportModal(rows) {
  const totalW = rows.reduce((s, r) => s + (parseFloat(String(r.w).replace(/,/g, '')) || 0), 0);
  const stageLabel = LOT_STAGES.find(s => s.key === state.lotStage)?.label || 'ทั้งหมด';
  return `
    <div class="modal modal-md">
      <div class="modal-head"><h3>รายงาน Lot · ${esc(stageLabel)}</h3><button class="modal-close" data-close-modal>${iconX()}</button></div>
      <div class="modal-body">
        <div class="grid-2" style="gap:14px; margin-bottom:18px;">
          <div class="stat-card"><div class="label">จำนวนรายการ</div><div class="value">${rows.length}<span class="unit">Lot</span></div></div>
          <div class="stat-card"><div class="label">น้ำหนักรวม</div><div class="value">${totalW.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span class="unit">g</span></div></div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>RF No</th><th>Lot</th><th>ลูกค้า</th><th>วันที่</th><th class="num">น้ำหนัก</th></tr></thead>
            <tbody>${rows.length ? rows.map(r => `<tr><td class="cell-primary">${esc(r.rf)}</td><td>${esc(r.lot)}</td><td>${esc(r.cust)}</td><td>${esc(r.date)}</td><td class="num">${esc(r.w)} g</td></tr>`).join('') : `<tr class="empty-row"><td colspan="5">ไม่มีรายการ</td></tr>`}</tbody>
          </table>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-secondary" data-close-modal>ปิด</button>
        <button class="btn btn-primary" data-action="print-lot-report">${iconDownload()} พิมพ์ / บันทึก PDF</button>
      </div>
    </div>`;
}

function confirmDeleteModal(label, onConfirmAction, extraData = '') {
  return `
    <div class="modal modal-sm">
      <div class="modal-body" style="text-align:center; padding:30px 26px;">
        <div style="width:46px;height:46px;border-radius:50%;background:var(--st-hold-bg);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:var(--st-hold-fg);">${iconTrash()}</div>
        <h3 style="font-size:16px; margin-bottom:6px;">ย้าย "${esc(label)}" ไปถังขยะ?</h3>
        <p style="font-size:16px; color:var(--text-secondary); line-height:1.6;">ระบบใช้ Soft Delete — ข้อมูลจะไม่ถูกลบถาวร และสามารถกู้คืนได้ภายหลังจากเมนู "แสดงรายการที่ลบแล้ว"</p>
      </div>
      <div class="modal-foot" style="justify-content:center;">
        <button class="btn btn-secondary" data-close-modal>ยกเลิก</button>
        <button class="btn btn-danger-ghost" data-action="${onConfirmAction}" ${extraData}>ย้ายไปถังขยะ</button>
      </div>
    </div>`;
}

function addCustomerModal() {
  return `
    <div class="modal modal-md">
      <div class="modal-head"><h3>เพิ่มลูกค้าใหม่</h3><button class="modal-close" data-close-modal>${iconX()}</button></div>
      <div class="modal-body" style="display:flex; flex-direction:column; gap:16px;">

        <div class="field">
          <label>ประเภทลูกค้า<span class="req">*</span></label>
          <select id="custType">
            <option value="">เลือกประเภทลูกค้า</option>
            <option value="person">บุคคลธรรมดา</option>
            <option value="corp">นิติบุคคล</option>
          </select>
        </div>

        <div class="grid-2">
          <div class="field"><label>ชื่อ<span class="req">*</span></label><input type="text" placeholder="ชื่อ"></div>
          <div class="field"><label>นามสกุล<span class="req">*</span></label><input type="text" placeholder="นามสกุล"></div>
        </div>

        <div class="field"><label>เลขบัตรประชาชน<span class="req">*</span></label><input type="text" placeholder="เลขบัตรประชาชน 13 หลัก" maxlength="13"></div>

        <div class="grid-2">
          <div class="field"><label>เบอร์โทร</label><input type="text" placeholder="0812345678"></div>
          <div class="field"><label>ที่อยู่<span class="req">*</span></label><input type="text" placeholder="บ้านเลขที่ / ถนน / ซอย"></div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>จังหวัด<span class="req">*</span></label>
            <div class="ss-wrap" id="ssProvince">
              <input type="text" class="ss-input" id="custProvinceInput" placeholder="พิมพ์เพื่อค้นหาจังหวัด" autocomplete="off" role="combobox" aria-expanded="false">
              <input type="hidden" id="custProvince" value="">
              <div class="ss-menu" id="custProvinceMenu" hidden></div>
            </div>
          </div>
          <div class="field">
            <label>อำเภอ / เขต<span class="req">*</span></label>
            <select id="custDistrict" disabled>
              <option value="">เลือกจังหวัดก่อน</option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>ตำบล / แขวง<span class="req">*</span></label>
            <select id="custSubdistrict" disabled>
              <option value="">เลือกอำเภอ/เขตก่อน</option>
            </select>
          </div>
          <div class="field"><label>รหัสไปรษณีย์<span class="req">*</span></label><input type="text" placeholder="10900" maxlength="5"></div>
        </div>

        <div class="field"><label>หมายเหตุ</label><input type="text" placeholder="ไม่บังคับ"></div>

      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close-modal>ยกเลิก</button><button class="btn btn-primary" data-action="save-customer">บันทึก</button></div>
    </div>`;
}

function addUserModal() {
  return `
    <div class="modal modal-sm">
      <div class="modal-head"><h3>เพิ่มผู้ใช้งานใหม่</h3><button class="modal-close" data-close-modal>${iconX()}</button></div>
      <div class="modal-body" style="display:flex; flex-direction:column; gap:14px;">
        <div class="field"><label>ชื่อ-นามสกุล<span class="req">*</span></label><input type="text"></div>
        <div class="field"><label>ชื่อผู้ใช้งาน (อีเมล)<span class="req">*</span></label><input type="text" placeholder="name@kgr.local"></div>
        <div class="field"><label>สิทธิ์การใช้งาน<span class="req">*</span></label>
          <select><option>บัญชีทอง</option><option>ช่างหลอม/จัด/สกัด</option><option>เซลส์</option><option>ผู้ดูแลระบบ</option></select>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close-modal>ยกเลิก</button><button class="btn btn-primary" data-action="save-user">บันทึก</button></div>
    </div>`;
}

function updateLotSelection() {
  const n = $$('.lot-check:checked').length;
  const label = $('#lotSelectedCount');
  if (label) label.textContent = `เลือกแล้ว ${n} รายการ`;
  const btn = $('#lotCreateBtn');
  if (btn) btn.disabled = n === 0;
}

function bindModalEvents() {
  $$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

  const custProvinceInput = $('#custProvinceInput');
  const custProvince = $('#custProvince');
  const custProvinceMenu = $('#custProvinceMenu');
  const custDistrict = $('#custDistrict');
  const custSubdistrict = $('#custSubdistrict');
  if (custProvinceInput && custProvince && custProvinceMenu && custDistrict && custSubdistrict) {
    initSearchableSelect(custProvinceInput, custProvince, custProvinceMenu, Object.keys(TH_LOCATIONS), (value) => {
      const districts = TH_LOCATIONS[value] || {};
      const keys = Object.keys(districts);
      custDistrict.innerHTML = `<option value="">เลือกอำเภอ/เขต</option>` + keys.map(d => `<option value="${esc(d)}">${esc(d)}</option>`).join('');
      custDistrict.disabled = keys.length === 0;
      custSubdistrict.innerHTML = `<option value="">เลือกอำเภอ/เขตก่อน</option>`;
      custSubdistrict.disabled = true;
    });
    custDistrict.addEventListener('change', () => {
      const districts = TH_LOCATIONS[custProvince.value] || {};
      const subs = districts[custDistrict.value] || [];
      custSubdistrict.innerHTML = `<option value="">เลือกตำบล/แขวง</option>` + subs.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
      custSubdistrict.disabled = subs.length === 0;
    });
  }

  const printLotReport = $('[data-action="print-lot-report"]');
  if (printLotReport) printLotReport.addEventListener('click', () => window.print());
  $$('[data-action="pick-invoice-template"]').forEach(el => el.addEventListener('click', () => {
    state.invoiceTemplate = el.dataset.tpl;
    state.invoiceNo = null; state.invoiceMode = 'new';
    closeModal(); goPage('invoice-edit');
  }));

  const confirmCancelOrder = $('[data-action="confirm-cancel-order"]');
  if (confirmCancelOrder) confirmCancelOrder.addEventListener('click', (e) => {
    const rf = e.currentTarget.dataset.rf;
    const rec = ORDERS.find(o => o.rf === rf);
    if (rec) { rec.cancelled = true; rec.status = 'hold'; rec.statusLabel = 'ยกเลิก'; }
    toast('ย้าย Order ไปถังขยะแล้ว (กู้คืนได้)');
    closeModal();
    if (state.page === 'orders') renderPage();
  });
  const confirmDelCust = $('[data-action="confirm-delete-customer"]');
  if (confirmDelCust) confirmDelCust.addEventListener('click', (e) => {
    const idx = e.currentTarget.dataset.idx;
    const removed = CUSTOMERS.splice(idx, 1)[0];
    if (removed) { removed.deletedBy = 'office@kgr.local'; removed.deletedAt = '18/08/2569 · เมื่อสักครู่'; CUSTOMERS_TRASH.unshift(removed); }
    toast('ย้ายลูกค้าไปถังขยะแล้ว');
    closeModal(); renderPage();
  });
  const confirmDelUser = $('[data-action="confirm-delete-user"]');
  if (confirmDelUser) confirmDelUser.addEventListener('click', () => { toast('ย้ายผู้ใช้งานไปถังขยะแล้ว'); closeModal(); renderPage(); });

  const saveCust = $('[data-action="save-customer"]');
  if (saveCust) saveCust.addEventListener('click', () => { toast('บันทึกข้อมูลลูกค้าเรียบร้อย'); closeModal(); renderPage(); });
  const saveUser = $('[data-action="save-user"]');
  if (saveUser) saveUser.addEventListener('click', () => { toast('บันทึกข้อมูลผู้ใช้งานเรียบร้อย'); closeModal(); renderPage(); });

  const saveInv = $('[data-action="save-invoice"]');
  if (saveInv) saveInv.addEventListener('click', () => { toast('บันทึก invoice แล้ว — ปุ่ม "แก้ไข" และ "Preview" ใช้งานได้ตลอด'); closeModal(); renderPage(); });
  const doPreview = $('[data-action="do-preview"]');
  if (doPreview) doPreview.addEventListener('click', (e) => { closeModal(); openInvoicePreviewTab(e.currentTarget.dataset.no); });
  const dlPdf = $('[data-action="download-pdf"]');
  if (dlPdf) dlPdf.addEventListener('click', () => toast('ดาวน์โหลด PDF สำเร็จ'));

  const confirmApprove = $('[data-action="tdc-confirm-approve"]');
  if (confirmApprove) {
    confirmApprove.addEventListener('click', (e) => {
      const rf = e.currentTarget.dataset.rf;
      const ord = ORDERS.find(o => o.rf === rf);
      if (ord) {
        ord.percentApprovalStatus = 'approved';
        ord.statusLabel = 'หักทอง';
        ord.station = 4;
      }
      closeModal();
      toast('อัปเดตสถานะเป็น ชักทอง แล้ว');
      state.tdcDetailId = null;
      renderBreadcrumb();
      renderPage();
    });
  }

  const gotoHistory = $('[data-action="goto-history"]');
  if (gotoHistory) gotoHistory.addEventListener('click', () => { closeModal(); goPage('history'); });
}

function bindPageEvents() {
  $$('[data-tab]').forEach(el => el.addEventListener('click', () => {
    const group = el.dataset.tab, key = el.dataset.key;
    if (group === 'order') state.orderTab = key;
    if (group === 'lot') state.lotStage = key;
    if (group === 'acct') state.acctTab = key;
    if (group === 'stock') state.stockTab = key;
    renderPage();
  }));

  $$('[data-go]').forEach(el => el.addEventListener('click', () => goPage(el.dataset.go)));

  $$('[data-rf-summary]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    state.rfSummaryTarget = el.dataset.rfSummary;
    state.page = 'rf-summary';
    renderSidebar(); renderBreadcrumb(); renderPage();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }));
  const rfSummaryBack = $('#wf_rfSummaryBack');
  if (rfSummaryBack) rfSummaryBack.addEventListener('click', () => {
    state.page = 'lot-allocate';
    renderSidebar(); renderBreadcrumb(); renderPage();
  });

  $$('[data-action="view-lot"]').forEach(el => el.addEventListener('click', (e) => {
    state.lotDetailId = e.currentTarget.dataset.lot;
    state.lotDetailStage = e.currentTarget.dataset.stage;
    renderBreadcrumb();
    renderPage();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }));

  $$('[data-action="back-lot-list"]').forEach(el => el.addEventListener('click', () => {
    state.lotDetailId = null;
    renderBreadcrumb();
    renderPage();
  }));

  $$('[data-action="next-lot-stage"]').forEach(el => el.addEventListener('click', () => {
    toast('บันทึกและส่งต่อไปขั้นตอนถัดไปเรียบร้อยแล้ว');
    state.lotDetailId = null;
    renderBreadcrumb();
    renderPage();
  }));

  /* ---- TDC Approve Handlers ---- */
  $$('[data-action="tdc-view-detail"]').forEach(el => el.addEventListener('click', (e) => {
    state.tdcDetailId = e.currentTarget.dataset.rf;
    renderBreadcrumb();
    renderPage();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }));

  $$('[data-action="tdc-back-list"]').forEach(el => el.addEventListener('click', () => {
    state.tdcDetailId = null;
    renderBreadcrumb();
    renderPage();
  }));

  $$('[data-action="tdc-approve-row"]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    const rf = e.currentTarget.dataset.rf;
    openConfirmApproveModal(rf);
  }));

  $$('[data-action="tdc-reject-row"]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    const rf = e.currentTarget.dataset.rf;
    const ord = ORDERS.find(o => o.rf === rf);
    if (ord) {
      ord.percentApprovalStatus = 'rejected';
    }
    toast('ปฏิเสธรายการเรียบร้อยแล้ว');
    state.tdcDetailId = null;
    renderBreadcrumb();
    renderPage();
  }));

  $$('[data-action="tdc-go-page"]').forEach(el => el.addEventListener('click', (e) => {
    state.tdcPage = parseInt(e.currentTarget.dataset.page);
    renderPage();
  }));

  $$('[data-action="tdc-prev-page"]').forEach(el => el.addEventListener('click', () => {
    state.tdcPage = Math.max(1, (state.tdcPage || 1) - 1);
    renderPage();
  }));

  $$('[data-action="tdc-next-page"]').forEach(el => el.addEventListener('click', () => {
    state.tdcPage = (state.tdcPage || 1) + 1;
    renderPage();
  }));

  $$('[data-action="tdc-search-btn"]').forEach(el => el.addEventListener('click', () => {
    const inp = $('#tdcSearchInput');
    state.tdcSearchQuery = inp ? inp.value : '';
    state.tdcPage = 1;
    renderPage();
  }));

  const tdcSearchInp = $('#tdcSearchInput');
  if (tdcSearchInp) {
    tdcSearchInp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        state.tdcSearchQuery = e.target.value;
        state.tdcPage = 1;
        renderPage();
      }
    });
  }

  const tdcSelectPerPage = $('#tdcItemsPerPage');
  if (tdcSelectPerPage) {
    tdcSelectPerPage.addEventListener('change', (e) => {
      state.tdcItemsPerPage = parseInt(e.target.value);
      state.tdcPage = 1;
      renderPage();
    });
  }


  $$('[data-detail]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    const rf = el.dataset.detail;
    const lotStation = el.dataset.lotStation ? parseInt(el.dataset.lotStation) : null;
    const existing = ORDERS.find(o => o.rf === rf);
    order = wfFreshOrder(rf);
    if (lotStation) {
      order.station1.customerName = el.dataset.lotCust || '';
      order.station1.receiveDate = el.dataset.lotDate || todayStr();
      order.station1.receivedWeight = wfNum(el.dataset.lotW);
      order.station1.declaredWeight = wfNum(el.dataset.lotW);
      order.lotNo = el.dataset.lotNo || null;
      order.jobType = el.dataset.lotJobtype || 'bar';
      order.station1.jobFormat = order.jobType;
      state.wfCurrent = lotStation;
      state.wfMaxUnlocked = lotStation;
      state.wfStepperLimit = null;
      state.wfStepperRange = [5, 9];
    } else if (existing) {
      order.station1.customerName = existing.cust || '';
      order.station1.receiveDate = existing.date || todayStr();
      order.station1.receivedWeight = wfNum(existing.w);
      order.station1.declaredWeight = wfNum(existing.w);
      order.station1.diffWeight = WfFormula.diffWeight(order.station1.declaredWeight, order.station1.receivedWeight);
      order.station3.percentAu = existing.percentAu ?? null;
      order.station3.percentAg = existing.percentAg ?? null;
      order.percentApproval.status = existing.percentApprovalStatus || 'none';
      state.wfCurrent = existing.station || 1;
      state.wfMaxUnlocked = existing.station || 1;
      state.wfStepperLimit = (state.wfCurrent <= 4) ? 4 : null;
      state.wfStepperRange = null;
    } else {
      state.wfCurrent = 1; state.wfMaxUnlocked = 1;
      state.wfStepperLimit = 4;
      state.wfStepperRange = null;
    }
    wfRecalcStation4();
    goPage('workflow');
  }));

  $$('[data-action="manual-search"]').forEach(el => el.addEventListener('click', () => toast('ค้นหาแล้ว — โหลดผลลัพธ์ล่าสุด')));

  $$('[data-action="tdc-approve-row"]').forEach(el => el.addEventListener('click', () => {
    const rf = el.dataset.rf;
    const rec = ORDERS.find(o => o.rf === rf);
    if (!rec) return;
    rec.percentApprovalStatus = 'approved';
    if (order.rfNo === rf) { order.percentApproval.status = 'approved'; order.percentApproval.decidedAt = new Date().toLocaleString('th-TH'); }
    toast(`อนุมัติ %Au/%Ag สำหรับ ${rf} เรียบร้อย — พร้อมเข้าสู่ขั้นตอนหักทอง`);
    renderSidebar();
    if (state.page === 'tdc-approve') renderPage();
  }));
  $$('[data-action="tdc-reject-row"]').forEach(el => el.addEventListener('click', () => {
    const rf = el.dataset.rf;
    const rec = ORDERS.find(o => o.rf === rf);
    if (!rec) return;
    rec.percentApprovalStatus = 'rejected';
    if (order.rfNo === rf) { order.percentApproval.status = 'rejected'; }
    toast(`ปฏิเสธผลทดสอบของ ${rf} แล้ว — รอแก้ไขและส่งใหม่`);
    renderSidebar();
    if (state.page === 'tdc-approve') renderPage();
  }));

  const applyReportFilter = $('[data-action="apply-report-filter"]');
  if (applyReportFilter) applyReportFilter.addEventListener('click', () => toast('กรองข้อมูลแล้ว — อัปเดตผลลัพธ์ด้านล่าง'));
  $$('[data-action="export-excel-report"]').forEach(el => el.addEventListener('click', () => {
    const scope = el.dataset.scope;
    if (scope === 'rf') {
      exportCSV(`report-rf-${Date.now()}.csv`, ['RF No', 'ลูกค้า', 'วันที่', 'น้ำหนัก (g)'],
        Object.values(LOT_MANAGE_DATA).flat().map(r => [r.rf, r.cust, r.date, r.w]));
    } else {
      exportCSV(`report-lot-${Date.now()}.csv`, ['RF No', 'Lot', 'ลูกค้า', 'วันที่', 'น้ำหนัก (g)'],
        Object.values(LOT_MANAGE_DATA).flat().map(r => [r.rf, r.lot, r.cust, r.date, r.w]));
    }
    toast('ส่งออก Excel (CSV) เรียบร้อย');
  }));

  const newOrderBtn = $('[data-action="new-order"]');
  if (newOrderBtn) newOrderBtn.addEventListener('click', () => {
    order = wfFreshOrder();
    state.wfCurrent = 1; state.wfMaxUnlocked = 1; state.wfStepperLimit = 4; state.wfStepperRange = null;
    goPage('workflow');
  });
  $$('[data-action="cancel-order"]').forEach(el => el.addEventListener('click', e => {
    e.stopPropagation();
    openModal(confirmDeleteModal(el.dataset.rf, 'confirm-cancel-order', `data-rf="${esc(el.dataset.rf)}"`));
    bindModalEvents();
  }));

  $$('[data-action="open-lot-type"]').forEach(el => el.addEventListener('click', () => {
    openLotAllocateView(el.dataset.type);
  }));

  const checkAll = $('#lotCheckAll');
  if (checkAll) checkAll.addEventListener('change', () => {
    $$('.lot-check').forEach(cb => cb.checked = checkAll.checked);
    updateLotSelection();
  });
  $$('.lot-check').forEach(cb => cb.addEventListener('change', updateLotSelection));
  const createLotBtn = $('#lotCreateBtn');
  if (createLotBtn) createLotBtn.addEventListener('click', () => {
    const n = $$('.lot-check:checked').length;
    toast(`จัดล็อตสำเร็จ — รวม ${n} รายการเป็น Lot ใหม่`);
    goPage('lot-allocate');
  });

  const addCustBtn = $('[data-action="add-customer"]');
  if (addCustBtn) addCustBtn.addEventListener('click', () => { openModal(addCustomerModal()); bindModalEvents(); });
  $$('[data-action="delete-customer"]').forEach(el => el.addEventListener('click', () => {
    openModal(confirmDeleteModal(CUSTOMERS[el.dataset.idx].name, 'confirm-delete-customer', `data-idx="${el.dataset.idx}"`));
    bindModalEvents();
  }));
  $$('[data-action="edit-customer"]').forEach(el => el.addEventListener('click', () => { openModal(addCustomerModal()); bindModalEvents(); }));
  const trashToggle = $('[data-action="toggle-trash"]');
  if (trashToggle) trashToggle.addEventListener('click', () => { state.custShowTrash = !state.custShowTrash; renderPage(); });
  $$('[data-action="restore-customer"]').forEach(el => el.addEventListener('click', () => { toast('กู้คืนข้อมูลลูกค้าเรียบร้อย'); state.custShowTrash = false; renderPage(); }));

  const addUserBtn = $('[data-action="add-user"]');
  if (addUserBtn) addUserBtn.addEventListener('click', () => { openModal(addUserModal()); bindModalEvents(); });
  $$('[data-action="delete-user"]').forEach(el => el.addEventListener('click', () => {
    openModal(confirmDeleteModal(USERS[el.dataset.idx].name, 'confirm-delete-user'));
    bindModalEvents();
  }));
  $$('[data-action="edit-user"], [data-action="view-user"]').forEach(el => el.addEventListener('click', () => { openModal(addUserModal()); bindModalEvents(); }));
  const userTrashToggle = $('[data-action="toggle-user-trash"]');
  if (userTrashToggle) userTrashToggle.addEventListener('click', (e) => {
    e.currentTarget.querySelector('.switch').classList.toggle('on');
    toast('ยังไม่มีผู้ใช้งานที่ถูกลบในช่วงนี้');
  });

  $$('[data-action="create-invoice"]').forEach(el => el.addEventListener('click', () => {
    state.invoiceNo = el.dataset.rf || null; state.invoiceMode = 'new'; state.invoiceTemplate = 'gold'; goPage('invoice-edit');
  }));
  $$('[data-action="edit-invoice"]').forEach(el => el.addEventListener('click', () => {
    state.invoiceNo = el.dataset.no || null; state.invoiceMode = 'edit'; state.invoiceTemplate = 'gold'; goPage('invoice-edit');
  }));
  $$('[data-action="preview-invoice"]').forEach(el => el.addEventListener('click', () => { openInvoicePreviewTab(el.dataset.no, el.dataset.doctype); }));
  const genInv = $('[data-action="create-general-invoice"]');
  if (genInv) genInv.addEventListener('click', () => { openModal(invoiceTemplatePickerModal()); bindModalEvents(); });

  const draftBtn = $('[data-action="draft-invoice"]');
  if (draftBtn) draftBtn.addEventListener('click', () => toast('บันทึกร่างแล้ว'));
  const savePreviewBtn = $('[data-action="save-and-preview-invoice"]');
  if (savePreviewBtn) savePreviewBtn.addEventListener('click', () => { openInvoicePreviewTab(state.invoiceNo || 'ใหม่'); });
  const autoFormula = $('[data-action="auto-formula"]');
  if (autoFormula) autoFormula.addEventListener('click', () => toast('คำนวณอัตโนมัติจากสูตร — อัปเดตยอดแล้ว'));
  const showHistInv = $('[data-action="show-history-inv"]');
  if (showHistInv) showHistInv.addEventListener('click', () => { goPage('history'); });

  const exportLot = $('[data-action="export-excel-all"]');
  if (exportLot) exportLot.addEventListener('click', () => {
    const key = state.lotStage || 'all';
    let rows = key === 'all' ? Object.values(LOT_MANAGE_DATA).flat() : (LOT_MANAGE_DATA[key] || []);
    exportCSV(`lot-${key}-${Date.now()}.csv`, ['RF No', 'Lot', 'ลูกค้า', 'วันที่', 'น้ำหนักรับ (g)'],
      rows.map(r => [r.rf, r.lot, r.cust, r.date, r.w]));
    toast('ส่งออก Excel (CSV) เรียบร้อย');
  });
  const reportLot = $('[data-action="report-lot"]');
  if (reportLot) reportLot.addEventListener('click', () => {
    const key = state.lotStage;
    let rows = key === 'all' ? Object.values(LOT_MANAGE_DATA).flat() : (LOT_MANAGE_DATA[key] || []);
    openModal(lotReportModal(rows)); bindModalEvents();
  });
  $$('[data-action="export-excel-rf"]').forEach(el => el.addEventListener('click', () => {
    const rf = el.dataset.rf;
    exportCSV(`${rf}-${Date.now()}.csv`, ['RF No', 'สถานะปัจจุบัน', 'น้ำหนักเข้า (g)', 'น้ำหนักหลังหลอม (g)'],
      [[rf, 'ก่อนส่งหลอม 99', '100.00', '98.75']]);
    toast('ส่งออก Excel (CSV) ของ ' + rf + ' เรียบร้อย');
  }));
  $$('[data-action="export-excel-invoice"]').forEach(el => el.addEventListener('click', () => {
    const no = el.dataset.no;
    const inv = [...INV_WITH_NUMBER, ...INV_GENERAL].find(i => i.no === no) || {};
    exportCSV(`invoice-${no}-${Date.now()}.csv`, ['เลขที่', 'วันที่', 'ลูกค้า', 'ยอดรวม'],
      [[no, inv.date || '', inv.cust || '', inv.total || '']]);
    toast('ส่งออก Excel (CSV) ของ ' + no + ' เรียบร้อย');
  }));

  $$('[data-history]').forEach(el => el.addEventListener('click', () => { openModal(historyDiffModal(el.dataset.history)); bindModalEvents(); }));

  bindModalEvents();
}

function openConfirmApproveModal(rf) {
  const html = `
    <div class="modal modal-sm">
      <div class="modal-head">
        <h3>ยืนยันการอนุมัติ</h3>
        <button class="modal-close" data-close-modal>${iconX()}</button>
      </div>
      <div class="modal-body" style="text-align:center; padding: 24px 16px;">
        <div style="font-size:17px; margin-bottom:24px; color:var(--text-primary);">ยืนยันการอนุมัติ <b>${esc(rf)}</b> ไปยังขั้นตอน 'ชักทอง' หรือไม่?</div>
      </div>
      <div class="modal-foot" style="justify-content:center; gap:16px;">
        <button class="btn btn-secondary" data-close-modal style="min-width:100px;">ยกเลิก</button>
        <button class="btn btn-primary" data-action="tdc-confirm-approve" data-rf="${esc(rf)}" style="min-width:100px;">ยืนยัน</button>
      </div>
    </div>`;
  openModal(html);
  bindModalEvents();
}
