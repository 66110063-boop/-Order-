/* ============================================================
   KGR GROUP — STOCK, ACCOUNTING & INVOICE VIEWS
   ============================================================ */

/* STOCK VIEW */
function pageStock() {
  const PREP_STATIONS = [4, 5, 6, 7];
  const DONE_STATIONS_MIN = 9;

  const active = ORDERS.filter(o => !o.cancelled);
  const prepList = active.filter(o => PREP_STATIONS.includes(o.station));
  const doneList = active.filter(o => o.station >= DONE_STATIONS_MIN);

  function aggregate(list) {
    const sum = (key) => wfFmt(list.reduce((s, o) => s + wfNum(o[key]), 0));
    return {
      receivedTotal: sum('w'), meltedTotal: sum('meltedW'),
      au: sum('auCalc'), auBack: sum('auReturn'),
      ag: sum('agCalc'), agBack: sum('agReturn'),
    };
  }
  const prepStats = aggregate(prepList);
  const doneStats = aggregate(doneList);

  const statBlock = (title, stats) => `
    <div class="card card-pad" style="flex:1;">
      <div class="section-label">${esc(title)}</div>
      <div class="grid-2" style="margin-bottom:14px;">
        <div class="stat-card"><div class="label">ผลรวมน้ำหนักได้รับ</div><div class="value num">${stats.receivedTotal}<span class="unit">g</span></div></div>
        <div class="stat-card"><div class="label">ผลรวมน้ำหนักหลังหลอม</div><div class="value num">${stats.meltedTotal}<span class="unit">g</span></div></div>
      </div>
      <div class="grid-2">
        <div>
          <div class="cell-sub" style="margin-bottom:6px; font-weight:700; color:var(--text-primary);">ทองคำ (Au)</div>
          <div class="total-row"><span>น้ำหนักที่คำนวณได้ (g)</span><span class="num">${stats.au}</span></div>
          <div class="total-row"><span>น้ำหนักคืน (Au) (g)</span><span class="num">${stats.auBack}</span></div>
        </div>
        <div>
          <div class="cell-sub" style="margin-bottom:6px; font-weight:700; color:var(--text-primary);">เงิน (Ag)</div>
          <div class="total-row"><span>น้ำหนักที่คำนวณได้ (g)</span><span class="num">${stats.ag}</span></div>
          <div class="total-row"><span>น้ำหนักคืน (Ag) (g)</span><span class="num">${stats.agBack}</span></div>
        </div>
      </div>
    </div>`;

  const stockList = state.stockTab === 'done' ? doneList : prepList;
  const rows = stockList.map(o => `
    <tr class="clickable" data-detail="${esc(o.rf)}">
      <td class="cell-primary">${esc(o.rf)}</td>
      <td>${esc(o.cust)}</td>
      <td>${esc(o.lotNo || '—')}</td>
      <td>${esc(o.date)}</td>
      <td><span class="badge badge-${o.status}">${esc(o.statusLabel)}</span></td>
      <td class="num">${esc(o.w)} g</td>
    </tr>`).join('');

  return `
    <div class="page-head">
      <div><h1>คลังสินค้า</h1><div class="desc">สรุปสต็อกทองคำ/เงิน แบบ Real-time ตามขั้นตอนที่ใบงานกำลังดำเนินอยู่จริง</div></div>
    </div>

    <div class="search-row" style="margin-bottom:18px;">
      <input type="text" placeholder="01/08/2569 – 31/08/2569" style="max-width:220px;">
      <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
      <span class="search-hint">${iconInfo()} เลือกช่วงวันที่แล้วกดค้นหาเพื่อโหลดข้อมูล</span>
    </div>

    <div style="display:flex; gap:16px; margin-bottom:22px; flex-wrap:wrap;">
      ${statBlock('Stock จัดเตรียม (ยังไม่สกัด — ผ่านหักทองแล้ว ก่อนเริ่มหลอม 99)', prepStats)}
      ${statBlock('Stock ที่เสร็จสิ้นกระบวนการแล้ว (ปิดสถานีหลอม 99)', doneStats)}
    </div>

    <div class="tabs">
      <div class="tab ${state.stockTab === 'prep' ? 'active' : ''}" data-tab="stock" data-key="prep">จัดเตรียม<span class="count">${prepList.length}</span></div>
      <div class="tab ${state.stockTab === 'done' ? 'active' : ''}" data-tab="stock" data-key="done">เสร็จสิ้น<span class="count">${doneList.length}</span></div>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>RF-No</th><th>ชื่อลูกค้า</th><th>Lot</th><th>วันที่</th><th>สถานะ</th><th class="num">น้ำหนักได้รับ</th></tr></thead>
        <tbody>${rows || `<tr class="empty-row"><td colspan="6">ไม่มีรายการในสถานะนี้</td></tr>`}</tbody>
      </table>
      <div class="table-foot"><span>ทั้งหมด ${stockList.length} รายการ</span><div class="pager"><button>‹</button><button class="active">1</button><button>›</button></div></div>
    </div>
  `;
}

/* ACCOUNTING VIEW */
function pageAccounting() {
  function invNoSortKey(no) {
    const parts = String(no || '0/0').split('/').map(x => parseInt(x, 10) || 0);
    return (parts[0] || 0) * 10000 + (parts[1] || 0);
  }
  const sortedNoNumber = INV_NO_NUMBER.slice().sort((a, b) => wfParseThaiDate(b.date) - wfParseThaiDate(a.date));
  const sortedWithNumber = INV_WITH_NUMBER.slice().sort((a, b) => invNoSortKey(b.no) - invNoSortKey(a.no));

  const tabs = [
    { key: 'nonum', label: 'RF ที่ยังไม่มีเลข Invoice', count: INV_NO_NUMBER.length },
    { key: 'withnum', label: 'RF ที่มีเลข Invoice', count: INV_WITH_NUMBER.length },
    { key: 'general', label: 'Invoice ทั่วไป', count: INV_GENERAL.length },
  ];
  const DOC_TYPES = ['original', 'copy1', 'copy2'];
  const docType = (i) => DOC_TYPES[i % DOC_TYPES.length];

  let body = '';
  let colCount = 5;
  if (state.acctTab === 'nonum') {
    body = sortedNoNumber.map(r => `
      <tr>
        <td>${esc(r.date)}</td><td>—</td><td class="cell-primary">${esc(r.cust)}</td><td class="num">${esc(r.total)}</td>
        <td class="right"><button class="btn btn-primary btn-sm" data-action="create-invoice" data-rf="${esc(r.rf)}">${iconDoc()} สร้าง invoice</button></td>
      </tr>`).join('');
  } else if (state.acctTab === 'withnum') {
    body = sortedWithNumber.map(r => `
      <tr>
        <td>${esc(r.date)}</td><td class="cell-primary">${esc(r.no)}</td><td>${esc(r.cust)}</td><td class="num">${esc(r.total)}</td>
        <td class="right">
          <div class="table-actions" style="justify-content:flex-end;">
            <button class="btn btn-secondary btn-sm" data-action="preview-invoice" data-no="${esc(r.no)}">${iconEye()} Preview</button>
            <button class="btn btn-secondary btn-sm" data-action="edit-invoice" data-no="${esc(r.no)}">${iconEdit()} แก้ไข</button>
          </div>
        </td>
      </tr>`).join('');
  } else {
    colCount = 4;
    body = INV_GENERAL.map((r, i) => `
      <tr>
        <td>${esc(r.date)}</td>
        <td class="cell-primary">${esc(r.no)} ${docBadge(docType(i))}</td>
        <td>${esc(r.cust)}</td>
        <td class="right">
          <div class="table-actions" style="justify-content:flex-end;">
            <button class="btn btn-secondary btn-sm" data-action="preview-invoice" data-no="${esc(r.no)}" data-doctype="${docType(i)}">${iconEye()} Preview</button>
            <button class="btn btn-secondary btn-sm" data-action="edit-invoice" data-no="${esc(r.no)}">${iconEdit()} แก้ไข</button>
            <button class="btn btn-secondary btn-sm" data-action="export-excel-invoice" data-no="${esc(r.no)}">${iconDownload()} Excel</button>
          </div>
        </td>
      </tr>`).join('');
  }

  return `
    <div class="page-head">
      <div><h1>บัญชี</h1><div class="desc">จัดการ Invoice — แก้ไขและ Preview ได้ตลอดเวลา แม้บันทึกแล้ว</div></div>
      <button class="btn btn-primary" data-action="create-general-invoice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        สร้าง invoice (ทั่วไป)
      </button>
    </div>

    <div class="tabs">
      ${tabs.map(t => `<div class="tab ${state.acctTab === t.key ? 'active' : ''}" data-tab="acct" data-key="${t.key}">${esc(t.label)}<span class="count">${t.count}</span></div>`).join('')}
    </div>

    <div class="search-row" style="margin-bottom:16px;">
      <select style="max-width:150px;"><option>ทั้งหมด</option><option>ค้างชำระ</option><option>ชำระแล้ว</option></select>
      <input type="text" placeholder="ช่วงวันที่" style="max-width:180px;">
      <input type="text" placeholder="ค้นหา RF No หรือชื่อลูกค้า" style="max-width:240px;">
      <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr>${
          state.acctTab === 'general'
            ? '<th>วันที่บันทึก</th><th>เลขที่</th><th>ลูกค้า</th><th class="right">จัดการ</th>'
            : '<th>วันที่บันทึก</th><th>เลขที่</th><th>ลูกค้า</th><th class="num">ยอดรวม</th><th class="right">จัดการ</th>'
        }</tr></thead>
        <tbody>${body || `<tr class="empty-row"><td colspan="${colCount}">ไม่มีรายการ</td></tr>`}</tbody>
      </table>
      <div class="table-foot"><span>แสดง 1-${(state.acctTab === 'nonum' ? INV_NO_NUMBER : state.acctTab === 'withnum' ? INV_WITH_NUMBER : INV_GENERAL).length} รายการ</span><div class="pager"><button>‹</button><button class="active">1</button><button>›</button></div></div>
    </div>
  `;
}

function invoiceEditModal(no) {
  const inv = [...INV_WITH_NUMBER, ...INV_GENERAL].find(i => i.no === no) || { no: no || 'ใหม่', date: '18/08/2569', cust: '—', total: '0.00' };
  return `
    <div class="modal modal-lg">
      <div class="modal-head">
        <h3>แก้ไข invoice · ${esc(inv.no)}</h3>
        <button class="modal-close" data-close-modal>${iconX()}</button>
      </div>
      <div class="modal-body">
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:16px;">
          <span class="locked-tag">${iconLock()} ข้อมูลลูกค้าพื้นฐานล็อกไว้ — ฟิลด์อื่นแก้ไขได้ทั้งหมด</span>
        </div>
        <div class="field" style="margin-bottom:14px; max-width:320px;">
          <label>ลูกค้า</label>
          <input type="text" class="input-locked" value="${esc(inv.cust)}" disabled>
        </div>
        <div class="grid-4" style="grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:16px;">
          <div class="field"><label>เลขที่</label><input type="text" value="${esc(inv.no)}"></div>
          <div class="field"><label>วันที่</label><input type="text" value="${esc(inv.date)}"></div>
          <div class="field"><label>ที่อยู่</label><input type="text" value="7/7 ซอยลาดพร้าว 15 จอมพล เขตจตุจักร กรุงเทพมหา"></div>
          <div class="field"><label>เลขประจำตัวผู้เสียภาษี</label><input type="text" placeholder="ไม่ระบุ"></div>
        </div>

        <div class="section-label">รายการ</div>
        <div class="card" style="border-color:var(--border); margin-bottom:10px;">
          <div style="display:flex; gap:10px; align-items:center; padding:12px 14px;">
            <span style="width:20px; color:var(--text-secondary); font-size:16px;">1.</span>
            <input type="text" value="ค่าหลอมทอง 99.99% (Lot 202608-0016)" style="flex:1;">
            <input class="num-input" type="text" value="${esc(inv.total)}" style="max-width:130px;">
            <button class="icon-btn" title="ลบรายการ">${iconTrash()}</button>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm">+ เพิ่มรายการ</button>

        <div class="divider"></div>
        <div style="display:flex; justify-content:flex-end;">
          <div class="total-box">
            <div class="total-row"><span>รวมเป็นเงิน</span><span>${esc(inv.total)}</span></div>
            <div class="total-row"><span>ภาษีมูลค่าเพิ่ม 7.00%</span><span>${(parseFloat(inv.total.replace(/,/g, '')) * 0.07).toFixed(2)}</span></div>
            <div class="total-row grand"><span>รวมทั้งสิ้น</span><span>${(parseFloat(inv.total.replace(/,/g, '')) * 1.07).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-secondary" data-close-modal>ยกเลิก</button>
        <button class="btn btn-secondary" data-action="do-preview" data-no="${esc(inv.no)}">${iconEye()} Preview</button>
        <button class="btn btn-primary" data-action="save-invoice">บันทึก</button>
      </div>
    </div>`;
}

function pageInvoiceEdit() {
  const no = state.invoiceNo;
  const mode = state.invoiceMode;
  const inv = [...INV_WITH_NUMBER, ...INV_GENERAL].find(i => i.no === no)
    || { no: no || 'RF-2569-0081', rf: 'RF-2569-0081', date: '17/08/2569', cust: 'บริษัท ทองไทย จำกัด', addr: 'กรุงเทพมหานคร', tax: '0105560000000', total: '85,936,000.00' };

  const isNew = (mode === 'new');

  const TEMPLATES = {
    gold: {
      panelTitle: 'รายละเอียดและการคำนวณสกัดทอง',
      serviceName: 'ค่าดำเนินการสกัดทอง',
      unit: 'kg.',
      rows: [
        { label: 'น้ำหนักเข้าตาม RF', value: '0' },
        { label: 'น้ำหนักเข้าจริง', value: '0' },
        { label: 'น้ำหนักคืนทอง 96.5%', value: '0.0114', active: true },
        { label: 'น้ำหนักคำนวณสกัด 96.5', value: '20' },
        { label: 'ราคาทองอ้างอิง', value: '65,500', unit: 'บาท' },
      ],
      subtotal: '85,936,000.00',
    },
    silver: {
      panelTitle: 'รายละเอียดและการคำนวณสกัดเงิน',
      serviceName: 'ค่าดำเนินการสกัดเงิน',
      unit: 'kg.',
      rows: [
        { label: 'น้ำหนักเข้าตาม RF', value: '0' },
        { label: 'น้ำหนักเข้าจริง', value: '0' },
        { label: 'น้ำหนักคืนเงิน 99.9%', value: '0.0000', active: true },
        { label: 'น้ำหนักคำนวณสกัด 99.9', value: '0' },
        { label: 'ราคาเงินอ้างอิง', value: '0', unit: 'บาท' },
      ],
      subtotal: '0.00',
    },
    blank: {
      panelTitle: 'รายละเอียดและการคำนวณ (เอกสารเปล่า)',
      serviceName: '',
      unit: '',
      rows: [
        { label: 'รายการที่ 1', value: '0' },
      ],
      subtotal: '0.00',
    },
  };
  const tpl = TEMPLATES[state.invoiceTemplate] || TEMPLATES.gold;

  return `
  <div class="inv-page">
    <!-- TOP BAR -->
    <div class="inv-topbar">
      <div class="inv-topbar-left">
        <button class="inv-back" data-go="accounting">${iconArrowLeft()}</button>
        <div class="inv-title">
          <h1>${isNew ? 'สร้าง Invoice ใหม่' : 'แก้ไข Invoice'}</h1>
          <div class="sub">จัดการข้อมูลรายการสกัดทอง และคำนวณยอดเงิน</div>
        </div>
      </div>
      <div class="inv-topbar-right">
        <button class="btn btn-secondary btn-sm" data-go="accounting">ยกเลิก</button>
        <button class="inv-btn-history btn-sm" data-action="show-history-inv">${iconClock()} ประวัติแก้ไข</button>
        <button class="inv-btn-draft btn-sm" data-action="draft-invoice">${iconSave()} บันทึกร่าง</button>
        <button class="btn btn-primary btn-sm" data-action="save-and-preview-invoice">
          ${iconEye()} บันทึกและดูตัวอย่าง
        </button>
      </div>
    </div>

    <!-- HEADER INFO ROW -->
    <div class="panel" style="margin-bottom:18px;">
      <div class="panel-body" style="padding:14px 18px;">
        <div class="inv-header-row">
          <div class="field">
            <label>เลขที่ Invoice</label>
            <input type="text" value="${esc(inv.no || 'INV-2569-0081')}">
          </div>
          <div class="field">
            <label>เลขอ้างอิง (RF No.)</label>
            <input type="text" value="${esc(inv.rf || inv.no || 'RF-2569-0081')}">
          </div>
          <div class="field">
            <label>วันที่ออกเอกสาร</label>
            <input type="text" value="${esc(inv.date || '17/08/2569')}">
          </div>
          <div class="field">
            <label>ชื่อลูกค้า</label>
            <input type="text" value="${esc(inv.cust || 'บริษัท ทองไทย จำกัด')}">
          </div>
          <div class="field">
            <label>ที่อยู่</label>
            <input type="text" value="${esc(inv.addr || 'กรุงเทพมหานคร')}">
          </div>
          <div class="field">
            <label>เลขประจำตัวผู้เสียภาษี</label>
            <input type="text" value="${esc(inv.tax || '0105560000000')}">
          </div>
        </div>
      </div>
    </div>

    <!-- BODY: LEFT + RIGHT -->
    <div class="inv-body">

      <!-- LEFT: คำนวณ -->
      <div class="inv-left">
        <div class="panel">
          <div class="panel-head">
            <div class="title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l1 3H8l1-3z"/><rect x="5" y="6" width="14" height="15" rx="1.5"/><path d="M9 11h6M9 15h4"/></svg>
              ${esc(tpl.panelTitle)}
            </div>
            <button class="btn btn-secondary btn-sm" data-action="auto-formula">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M9 3h6l1 3H8l1-3z"/><path d="M12 8v8M8 12h8"/></svg>
              สูตรคำนวณอัตโนมัติ
            </button>
          </div>
          <div class="panel-body">
            <div class="calc-service-row">
              <label>ชื่อรายการบริการ</label>
              <input type="text" value="${esc(tpl.serviceName)}" placeholder="ระบุชื่อรายการบริการ" style="width:100%; max-width:420px;">
            </div>

            <div class="calc-rows">
              ${tpl.rows.map(r => `
              <div class="calc-row">
                <div class="calc-row-label ${r.active ? 'active' : ''}">${esc(r.label)}</div>
                <div class="calc-row-input"><input type="text" class="num-input ${r.active ? 'highlight' : ''}" value="${esc(r.value)}" placeholder="0"></div>
                <div class="calc-unit">${esc(r.unit || tpl.unit)}</div>
              </div>`).join('')}
            </div>

            <div class="calc-subtotal">
              <span class="lbl">ผลลัพธ์คำนวณขั้นต้น (Subtotal):</span>
              <span class="val">${esc(tpl.subtotal)}<span class="unit">บาท</span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: สรุปยอด + หมายเหตุ -->
      <div class="inv-right">

        <!-- สรุปยอดเงินสุทธิ -->
        <div class="panel">
          <div class="panel-head-blue">
            <div class="title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
              สรุปยอดเงินสุทธิ
            </div>
          </div>
          <div class="panel-body">
            <div class="summary-currency">THB (บาท)</div>
            <div class="summary-row">
              <span>ยอดรวมค่าสกัด (Subtotal)</span>
              <span>85,936,000.00</span>
            </div>
            <div class="summary-row">
              <span>ภาษีมูลค่าเพิ่ม (VAT) <b>7%</b></span>
              <span>6,015,520.00</span>
            </div>
            <div class="summary-total-box">
              <div class="summary-total-label">ยอดเงินรวมทั้งสิ้น (GRAND TOTAL)</div>
              <div class="summary-grand">฿91,951,520.00</div>
              <div class="summary-grand-note">* รวมภาษีมูลค่าเพิ่มเรียบร้อยแล้ว</div>
            </div>
          </div>
        </div>

        <!-- หมายเหตุ + เงื่อนไขชำระ -->
        <div class="panel note-panel">
          <div class="panel-head">
            <div class="title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
              หมายเหตุ และ เงื่อนไขการชำระเงิน
            </div>
          </div>
          <div class="panel-body" style="display:flex; flex-direction:column; gap:12px;">
            <div class="field">
              <label style="font-size:16px;">หมายเหตุท้ายเอกสาร</label>
              <textarea placeholder="ระบุความถึงลูกค้า หรือรายละเอียดการส่งมอบ..."></textarea>
            </div>
            <div class="field">
              <label style="font-size:16px;">เงื่อนไขการชำระเงิน</label>
              <select>
                <option>ชำระทันทีเมื่อได้รับเอกสาร (Cash on Delivery)</option>
                <option>ชำระภายใน 7 วัน</option>
                <option>ชำระภายใน 15 วัน</option>
                <option>ชำระภายใน 30 วัน</option>
                <option>ตกลงพิเศษ</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>`;
}

function buildInvoiceHtmlDoc(no, docTypeOverride) {
  const DOC_TYPES = ['original', 'copy1', 'copy2'];
  let docType = docTypeOverride;
  if (!docType) {
    const key = String(no || '0');
    let sum = 0;
    for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
    docType = DOC_TYPES[sum % DOC_TYPES.length];
  }
  return `<!DOCTYPE html>
<html lang="th"><head><meta charset="UTF-8">
<title>invoice-${esc(no || '69-5')}.pdf — Preview</title>
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
:root{
  --header-bg:#002060; --text-primary:#1E293B; --text-secondary:#4B5563; --border:#E2E8F0;
  --table-head-bg:#003399; --fg-on-dark:#fff; --preview-body-bg:#EFF0F5; --surface:#fff;
  --shadow-md:0 4px 14px rgba(0,26,51,.12);
  --doc-original-bg:#FEF9C3; --doc-original-fg:#854D0E; --doc-original-bd:#FDE68A;
  --doc-copy1-bg:#DCFCE7; --doc-copy1-fg:#166534; --doc-copy1-bd:#86EFAC;
  --doc-copy2-bg:#DBEAFE; --doc-copy2-fg:#1E40AF; --doc-copy2-bd:#93C5FD;
}
*{box-sizing:border-box;}
body{margin:0; font-family:'Sarabun',sans-serif; background:var(--preview-body-bg); color:var(--text-primary);}
.toolbar{
  position:sticky; top:0; background:var(--header-bg); color:#fff; padding:12px 20px;
  display:flex; align-items:center; justify-content:space-between; font-size:14px; z-index:10;
}
.toolbar b{font-weight:700;}
.toolbar button{
  background:#fff; color:var(--header-bg); border:none; border-radius:8px; padding:9px 16px;
  font-weight:700; font-size:13.5px; cursor:pointer; font-family:inherit;
}
.page-wrap{padding:32px 20px 60px; display:flex; justify-content:center;}
.doc-badge{display:inline-flex; align-items:center; font-size:12px; font-weight:700; padding:2px 9px; border-radius:20px; border:1px solid transparent; margin-left:8px;}
.doc-original{background:var(--doc-original-bg); color:var(--doc-original-fg); border-color:var(--doc-original-bd);}
.doc-copy1{background:var(--doc-copy1-bg); color:var(--doc-copy1-fg); border-color:var(--doc-copy1-bd);}
.doc-copy2{background:var(--doc-copy2-bg); color:var(--doc-copy2-fg); border-color:var(--doc-copy2-bd);}
@media print{ .toolbar{display:none;} .page-wrap{padding:0;} }
</style></head>
<body>
  <div class="toolbar">
    <span>Preview ก่อนดาวน์โหลด — invoice-${esc(no || '69-5')}.pdf</span>
    <button onclick="window.print()">ดาวน์โหลด / พิมพ์ PDF</button>
  </div>
  <div class="page-wrap">
    <div style="background:var(--surface); box-shadow:var(--shadow-md); border-radius:4px; padding:34px 30px; max-width:480px; width:100%; font-family:'Sarabun';">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px;">
        <div>
          <div style="font-weight:700; font-size:16px; color:var(--header-bg);">K.G.R. GROUP</div>
          <div style="font-size:14px; color:var(--text-secondary); margin-top:2px;">โรงงานหลอมทองคำและโลหะมีค่า</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; font-size:16px;">ใบแจ้งหนี้ / INVOICE ${docBadge(docType)}</div>
          <div style="font-size:14px; color:var(--text-secondary);">เลขที่ ${esc(no || '69/5')}</div>
        </div>
      </div>
      <div style="font-size:14px; color:var(--text-secondary); margin-bottom:16px;">วันที่ 18/08/2569</div>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead><tr style="background:var(--table-head-bg); color:var(--fg-on-dark);"><th style="padding:7px 9px; text-align:left;">รายการ</th><th style="padding:7px 9px; text-align:right;">จำนวนเงิน</th></tr></thead>
        <tbody>
          <tr><td style="padding:8px 9px; border-bottom:1px solid var(--border);">ค่าหลอมทอง 99.99% (Lot 202608-0016)</td><td style="padding:8px 9px; text-align:right; border-bottom:1px solid var(--border); font-family:'IBM Plex Mono';">2,450.00</td></tr>
        </tbody>
      </table>
      <div style="display:flex; justify-content:flex-end; margin-top:14px;">
        <div style="min-width:200px; font-size:14px;">
          <div style="display:flex; justify-content:space-between; padding:3px 0;"><span>รวมเป็นเงิน</span><span>2,450.00</span></div>
          <div style="display:flex; justify-content:space-between; padding:3px 0;"><span>ภาษีมูลค่าเพิ่ม 7%</span><span>171.50</span></div>
          <div style="display:flex; justify-content:space-between; padding:5px 0; font-weight:700; border-top:1px solid var(--text-primary); margin-top:3px;"><span>รวมทั้งสิ้น</span><span>2,621.50</span></div>
        </div>
      </div>
    </div>
  </div>
</body></html>`;
}

function openInvoicePreviewTab(no, docTypeOverride) {
  const html = buildInvoiceHtmlDoc(no, docTypeOverride);
  const b64 = btoa(unescape(encodeURIComponent(html)));
  const win = window.open('data:text/html;base64,' + b64, '_blank');
  if (!win) toast('เบราว์เซอร์บล็อกการเปิดแท็บใหม่ — กรุณาอนุญาต pop-up สำหรับเว็บนี้');
}
