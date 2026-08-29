/* ============================================================
   KGR GROUP — STOCK, ACCOUNTING & INVOICE VIEWS
   ============================================================ */

function docBadge(type) {
  const labels = {
    original: 'ต้นฉบับ',
    copy1: 'สำเนา 1',
    copy2: 'สำเนา 2'
  };
  const label = labels[type] || type || '';
  return `<span class="doc-badge doc-${type}">${esc(label)}</span>`;
}

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
    { key: 'nonum', label: 'RF ที่ยังไม่สร้าง Invoice', count: INV_NO_NUMBER.length },
    { key: 'withnum', label: 'RF ที่สร้าง Invoice', count: INV_WITH_NUMBER.length },
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
            <button class="btn btn-secondary btn-sm" onclick='window.previewTaxInvoiceModal(${JSON.stringify(r).replace(/'/g, "&#39;")})'>${iconEye()} Preview</button>
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
            <button class="btn btn-secondary btn-sm" onclick='window.previewTaxInvoiceModal(${JSON.stringify(r).replace(/'/g, "&#39;")})'>${iconEye()} Preview</button>
            <button class="btn btn-secondary btn-sm" data-action="edit-invoice" data-no="${esc(r.no)}">${iconEdit()} แก้ไข</button>
          </div>
        </td>
      </tr>`).join('');
  }

  return `
    <div class="page-head">
      <div><h1>บัญชี</h1><div class="desc">จัดการ Invoice — แก้ไขและ Preview ได้ตลอดเวลา แม้บันทึกแล้ว</div></div>
      <button class="btn btn-primary" data-action="create-general-invoice" style="display:inline-flex; align-items:center; gap:8px; background:var(--header-bg); border-color:var(--header-bg);">
        ${iconPlus()} สร้าง Invoice (ทั่วไป)
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
        <button class="btn btn-secondary" onclick='window.previewTaxInvoiceModal(${JSON.stringify(inv).replace(/'/g, "&#39;")})'>${iconEye()} Preview</button>
        <button class="btn btn-primary" data-action="save-invoice">บันทึก</button>
      </div>
    </div>`;
}

function pageInvoiceEdit() {
  const no = state.invoiceNo;
  const mode = state.invoiceMode;
  const isNew = (mode === 'new');

  let inv = [...INV_WITH_NUMBER, ...INV_GENERAL].find(i => i.no === no || i.rf === no);
  if (!inv && isNew) {
    const rfSource = INV_NO_NUMBER.find(x => x.rf === no);
    if (rfSource) {
      inv = {
        no: `INV-${rfSource.rf.split('-')[1]}`,
        rf: rfSource.rf,
        date: rfSource.date,
        cust: rfSource.cust,
        addr: rfSource.cust === 'โรงงานทองไทยเจริญ' ? '12/3 ถนนพระราม 3 บางคอแหลม กรุงเทพฯ' : '88/1 ถนนลาดพร้าว จอมพล จตุจักร กรุงเทพฯ',
        tax: rfSource.cust === 'โรงงานทองไทยเจริญ' ? '0105561023456' : '0105560011223',
        total: rfSource.total
      };
    }
  }
  if (!inv) {
    inv = { no: no || 'RF-2569-0081', rf: 'RF-2569-0081', date: '17/08/2569', cust: 'บริษัท ทองไทย จำกัด', addr: 'กรุงเทพมหานคร', tax: '0105560000000', total: '85,936,000.00' };
  }

  let rfWDeclared = 0;
  let rfWMelted = 0;
  let rfAuReturn = 0;
  let purityLabel = state.invoicePurity || '96.5';

  const rfData = ORDERS.find(o => o.rf === inv.rf || o.rf === no);
  if (rfData) {
    rfWDeclared = parseFloat(String(rfData.wDeclared || rfData.w || '0').replace(/,/g, '')) / 1000;
    rfWMelted = parseFloat(String(rfData.meltedW || '0').replace(/,/g, '')) / 1000;
    rfAuReturn = parseFloat(String(rfData.auReturn || '0').replace(/,/g, '')) / 1000;
    if (!state.invoicePurity && rfData.percentAu) {
      purityLabel = rfData.percentAu;
    }
  }

  const TEMPLATES = {
    gold: {
      panelTitle: 'รายละเอียดและการคำนวณสกัดทอง',
      serviceName: 'ค่าดำเนินการสกัดทอง',
      unit: 'g.',
      rows: [
        { label: 'น้ำหนักเข้าตาม RF', value: rfWDeclared },
        { label: 'น้ำหนักเข้าจริง', value: rfWMelted },
        { label: `น้ำหนักคืนทอง ${purityLabel}%`, value: rfAuReturn, active: true },
        { label: `น้ำหนักคำนวณสกัด ${purityLabel}`, value: rfWMelted },
        { label: 'ราคาทองอ้างอิง', value: '44,500', unit: 'บาท' },
      ],
      subtotal: inv.total || '0.00',
    },
    silver: {
      panelTitle: 'รายละเอียดและการคำนวณสกัดเงิน',
      serviceName: 'ค่าดำเนินการสกัดเงิน',
      unit: 'g.',
      rows: [
        { label: 'น้ำหนักเข้าตาม RF', value: rfWDeclared },
        { label: 'น้ำหนักเข้าจริง', value: rfWMelted },
        { label: 'น้ำหนักคืนเงิน 99.9%', value: '0.00', active: true },
        { label: 'น้ำหนักคำนวณสกัด 99.9', value: rfWMelted },
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

  const subtotalVal = parseFloat(String(inv.total || tpl.subtotal).replace(/,/g, '')) || 0;
  const vatVal = subtotalVal * 0.07;
  const grandVal = subtotalVal + vatVal;

  const formatCurrency = (val) => val.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


  return `
  <div class="inv-page">
    <!-- TOP BAR -->
    <div class="inv-topbar">
      <div class="inv-topbar-left">
        <button class="inv-back" data-go="accounting">${iconArrowLeft()}</button>
        <div class="inv-title">
          <h1>แก้ไข invoice · ${esc(inv.rf || inv.no || 'RF-0007')}</h1>
          <div class="sub">จัดการข้อมูลรายการสกัดทอง และคำนวณยอดเงิน</div>
        </div>
      </div>
      <div class="inv-topbar-right">
        <button class="btn btn-secondary btn-sm" data-go="accounting">ยกเลิก</button>
        <button class="btn btn-primary btn-sm" data-action="save-invoice">บันทึก</button>
        <button class="btn btn-primary btn-sm" data-action="save-and-preview-invoice">
          ${iconEye()} Preview
        </button>
      </div>
    </div>

    <!-- HEADER INFO ROW (Grid 5 ช่องเรียงแนวนอน) -->
    <div class="panel" style="margin-bottom:18px;">
      <div class="panel-body" style="padding:14px 18px;">
        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:14px;">
          <div class="field">
            <label>เลขที่</label>
            <input type="text" id="inv_no" value="${esc(inv.no || '69/5')}">
          </div>
          <div class="field">
            <label>วันที่</label>
            <input type="text" id="inv_date" value="${esc(inv.date || '26/08/2569')}">
          </div>
          <div class="field">
            <label>ชื่อลูกค้า</label>
            <input type="text" id="inv_cust" value="${esc(inv.cust || '')}">
          </div>
          <div class="field">
            <label>ที่อยู่</label>
            <input type="text" id="inv_addr" value="${esc(inv.addr || '')}">
          </div>
          <div class="field">
            <label>เลขประจำตัวผู้เสียภาษี</label>
            <input type="text" id="inv_tax" class="num-input" maxlength="13" inputmode="numeric" value="${esc(inv.tax || '')}">
          </div>
        </div>
      </div>
    </div>

    <!-- BODY: LEFT + RIGHT -->
    <div class="inv-body">

      <!-- LEFT: รายการ -->
      <div class="inv-left">
        <div class="panel" style="margin-bottom:18px;">
          <div class="panel-head" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px;">
            <div class="title" style="font-weight:700; font-size:16px;">รายการ</div>
            <div class="title" style="font-weight:700; font-size:16px; margin-right:20px;">จำนวนเงิน (บาท)</div>
          </div>
          <div class="panel-body" style="padding:16px 20px;">
            <!-- MAIN ITEM 1 -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; gap:20px;">
              <div style="flex:1;">
                <input type="text" id="item_name_1" value="1. ค่าดำเนินการสกัดทอง" style="font-weight:700; font-size:16px; width:100%; border:none; border-bottom:1px dashed var(--border); padding:4px 0; background:transparent; color:var(--text-primary);">
                
                <!-- SUB-ITEMS (INDENTED) -->
                <div style="margin-left:24px; margin-top:14px; display:flex; flex-direction:column; gap:12px;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="color:var(--text-secondary); min-width:140px;">น้ำหนักเข้า:</span>
                    <input type="text" id="calc_w_in" class="num-input" value="${esc(rfWDeclared.toFixed(6))}" style="width:120px; text-align:right;">
                    <span style="color:var(--text-secondary);">kg.</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="color:var(--text-secondary); min-width:140px;">น้ำหนักคืน ${purityLabel}:</span>
                    <input type="text" id="calc_w_return" class="num-input" value="${esc(rfAuReturn.toFixed(6))}" style="width:120px; text-align:right;">
                    <span style="color:var(--text-secondary);">kg.</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="color:var(--text-secondary); min-width:140px;">ค่าสกัดทอง ${purityLabel}:</span>
                    <input type="text" id="calc_w_calc" class="num-input" value="${esc(rfWMelted.toFixed(6))}" style="width:120px; text-align:right;">
                    <span style="color:var(--text-secondary);">kg.</span>
                    <span style="color:var(--text-secondary);">X ราคาทอง</span>
                    <input type="text" id="calc_price" class="num-input" value="65000" style="width:120px; text-align:right;">
                    <span style="color:var(--text-secondary);">บาท</span>
                  </div>
                </div>
              </div>
              
              <!-- AMOUNT RIGHT SIDE -->
              <div style="width:180px; text-align:right;">
                <input type="text" id="item_amount_1" class="num-input input-locked" value="${esc(formatCurrency(subtotalVal))}" style="width:100%; text-align:right; font-weight:700; font-size:16px; background:var(--surface);" disabled>
              </div>
            </div>
            
            <!-- ADD ITEM BUTTON -->
            <div style="border-top:1px dashed var(--border); padding-top:14px;">
              <button class="btn btn-secondary btn-sm" id="btnAddItem" data-action="add-item-mock">${iconPlus()} เพิ่มรายการ</button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: สรุปยอด -->
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
              <span>รวมเป็นเงิน</span>
              <span id="summary_subtotal">${esc(formatCurrency(subtotalVal))}</span>
            </div>
            <div class="summary-row">
              <span>ภาษีมูลค่าเพิ่ม 7.00%</span>
              <span id="summary_vat">${esc(formatCurrency(vatVal))}</span>
            </div>
            <div class="summary-total-box">
              <div class="summary-total-label">รวมทั้งสิ้น</div>
              <div class="summary-grand" id="summary_grand">฿${esc(formatCurrency(grandVal))}</div>
              <div class="summary-grand-note">* รวมภาษีมูลค่าเพิ่มเรียบร้อยแล้ว</div>
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

  const inv = [...INV_GENERAL, ...INV_WITH_NUMBER, ...INV_NO_NUMBER].find(i => i.no === no || i.rf === no) || {
    no: no || '69/5',
    date: '26/08/2569',
    cust: 'ลูกค้าทั่วไป',
    total: '2,450.00',
    items: [{ name: 'ค่าหลอมทอง 99.99% (Lot 202608-0016)', amount: 2450.00 }]
  };

  let items = inv.items;
  if (!items) {
    const amt = parseFloat(String(inv.total || '0').replace(/,/g, ''));
    items = [{ name: 'ค่าสกัด/ดำเนินการสกัดทองคำ', amount: amt }];
  }

  const subtotalVal = items.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
  const vatVal = subtotalVal * 0.07;
  const grandVal = subtotalVal + vatVal;

  const formatCurrency = (val) => val.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
      <div style="font-size:14px; color:var(--text-secondary); margin-bottom:8px;">วันที่ ${esc(inv.date || '26/08/2569')}</div>
      <div style="font-size:14px; color:var(--text-primary); margin-bottom:16px;">ลูกค้า: <b>${esc(inv.cust || '')}</b></div>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead><tr style="background:var(--table-head-bg); color:var(--fg-on-dark);"><th style="padding:7px 9px; text-align:left;">รายการ</th><th style="padding:7px 9px; text-align:right;">จำนวนเงิน</th></tr></thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="padding:8px 9px; border-bottom:1px solid var(--border);">${esc(item.name)}</td>
              <td style="padding:8px 9px; text-align:right; border-bottom:1px solid var(--border); font-family:'IBM Plex Mono';">${esc(formatCurrency(item.amount))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="display:flex; justify-content:flex-end; margin-top:14px;">
        <div style="min-width:200px; font-size:14px;">
          <div style="display:flex; justify-content:space-between; padding:3px 0;"><span>รวมเป็นเงิน</span><span>${esc(formatCurrency(subtotalVal))}</span></div>
          <div style="display:flex; justify-content:space-between; padding:3px 0;"><span>ภาษีมูลค่าเพิ่ม 7%</span><span>${esc(formatCurrency(vatVal))}</span></div>
          <div style="display:flex; justify-content:space-between; padding:5px 0; font-weight:700; border-top:1px solid var(--text-primary); margin-top:3px;"><span>รวมทั้งสิ้น</span><span>${esc(formatCurrency(grandVal))}</span></div>
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

function pageInvoiceGeneralEdit() {
  const no = state.invoiceNo;
  const mode = state.invoiceMode;
  const isNew = (mode === 'new');

  const inv = INV_GENERAL.find(i => i.no === no) || {
    no: no || '',
    date: todayStr(),
    cust: '',
    addr: '',
    tax: '',
    items: [{ name: '', subDesc: '', amount: 0.00 }]
  };

  if (!inv.items) {
    inv.items = [{ name: '', subDesc: '', amount: 0.00 }];
  }

  const subtotalVal = inv.items.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
  const vatVal = subtotalVal * 0.07;
  const grandVal = subtotalVal + vatVal;

  const formatCurrency = (val) => val.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return `
  <div class="inv-page">
    <!-- TOP BAR -->
    <div class="inv-topbar">
      <div class="inv-topbar-left">
        <button class="inv-back" data-go="accounting">${iconArrowLeft()}</button>
        <div class="inv-title">
          <h1>${isNew ? 'สร้าง invoice (ทั่วไป)' : `แก้ไข invoice (ทั่วไป) · ${esc(inv.no)}`}</h1>
          <div class="sub">จัดการข้อมูลรายการใบแจ้งหนี้ทั่วไป และคำนวณยอดเงิน</div>
        </div>
      </div>
      <div class="inv-topbar-right">
        <button class="btn btn-secondary btn-sm" data-go="accounting">ยกเลิก</button>
        <button class="btn btn-primary btn-sm" data-action="save-general-invoice">บันทึก</button>
        <button class="btn btn-primary btn-sm" data-action="preview-general-invoice">
          ${iconEye()} Preview
        </button>
      </div>
    </div>

    <!-- CLIENT SELECTOR & HEADER INFO ROW -->
    <div class="panel" style="margin-bottom:18px;">
      <div class="panel-body" style="padding:18px 20px;">
        <div class="field" style="margin-bottom:18px;">
          <label style="font-weight:700;">ลูกค้า <span style="color:red;">*</span></label>
          <select id="client_select" onchange="
            const cust = CUSTOMERS.find(c => c.name === this.value);
            const taxVal = cust ? (cust.taxId || cust.idCard || '') : '';
            setTimeout(() => { const t = document.getElementById('inv_tax'); if(t) t.value = taxVal; }, 10);
          " style="width:100%; max-width:320px; height:40px; padding:0 12px; border-radius:8px; border:1px solid var(--border-strong);">
            <option value="">เลือกลูกค้า</option>
            ${CUSTOMERS.map(c => `<option value="${esc(c.name)}" ${inv.cust === c.name ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
          </select>
        </div>

        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:14px; border-top:1px solid var(--border); padding-top:18px;">
          <div class="field">
            <label>เลขที่</label>
            <input type="text" id="inv_no" value="${esc(inv.no)}" placeholder="กรอกเลขที่บิล">
          </div>
          <div class="field">
            <label>วันที่</label>
            <input type="text" id="inv_date" value="${esc(inv.date || todayStr())}">
          </div>
          <div class="field">
            <label>ชื่อลูกค้า</label>
            <input type="text" id="inv_cust" value="${esc(inv.cust || '')}">
          </div>
          <div class="field">
            <label>ที่อยู่</label>
            <input type="text" id="inv_addr" value="${esc(inv.addr || '')}">
          </div>
          <div class="field">
            <label>เลขประจำตัวผู้เสียภาษี</label>
            <input type="text" id="inv_tax" class="num-input" maxlength="13" inputmode="numeric" value="${esc(inv.tax || '')}">
          </div>
        </div>
      </div>
    </div>

    <!-- BODY: LEFT + RIGHT -->
    <div class="inv-body">

      <!-- LEFT: รายการ -->
      <div class="inv-left">
        <div class="panel" style="margin-bottom:18px;">
          <div class="panel-head" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px;">
            <div class="title" style="font-weight:700; font-size:16px;">รายการ</div>
            <div class="title" style="font-weight:700; font-size:16px; margin-right:60px;">จำนวนเงิน (บาท)</div>
          </div>
          <div class="panel-body" style="padding:16px 20px;">
            <div id="general_items_container">
              ${inv.items.map((item, idx) => `
                <div class="general-item-row" style="margin-bottom: 20px; border-bottom: 1px dashed var(--border); padding-bottom: 16px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:20px;">
                    <div style="flex:1;">
                      <!-- Row 1: Number + Item Name Input -->
                      <div style="display:flex; gap:10px; align-items:center;">
                        <span class="row-number-span" style="font-weight:700; font-size:15px; min-width:20px;">${idx + 1}.</span>
                        <input type="text" class="item-name-input" value="${esc(item.name || '')}" placeholder="กรุณากรอกรายละเอียด" style="font-weight:600; font-size:15px; width:100%; border:none; border-bottom:1px solid var(--border); padding:4px 0; background:transparent; color:var(--text-primary);">
                      </div>
                      
                      <!-- Sub-items container -->
                      <div class="sub-items-container" style="margin-left: 30px; margin-top: 8px; display:flex; flex-direction:column; gap:8px;">
                        <input type="text" class="item-sub-desc-input" value="${esc(item.subDesc || '')}" placeholder="กรุณากรอกรายละเอียดข้อย่อย" style="font-size:13.5px; width:100%; border:none; border-bottom:1px dashed var(--border); padding:2px 0; background:transparent; color:var(--text-secondary);">
                      </div>

                      <!-- Add Sub-item Link -->
                      <div style="margin-left: 30px; margin-top: 8px;">
                        <a href="javascript:void(0)" class="btn-add-sub-item" style="font-size:13px; color:var(--btn-primary); text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                          + เพิ่มข้อย่อย
                        </a>
                      </div>
                    </div>

                    <!-- Right Side: Amount Input + Trash -->
                    <div style="display:flex; align-items:center; gap:10px; width:240px; justify-content:flex-end; padding-top:4px;">
                      <input type="text" class="num-input item-amount-input" value="${item.amount ? item.amount.toFixed(2) : '0.00'}" style="width:120px; text-align:right; font-weight:700;">
                      <span style="color:var(--text-secondary);">บาท</span>
                      <button class="btn-delete-row" style="background:transparent; border:none; color:var(--st-hold-fg); cursor:pointer; font-size:16px; display:inline-flex; align-items:center; justify-content:center; padding:6px;" title="ลบรายการ">${iconTrash()}</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- ADD ITEM BUTTON -->
            <div style="border-top:1px dashed var(--border); padding-top:14px; margin-top:10px;">
              <button class="btn btn-secondary btn-sm" id="btn_add_general_item" style="display:inline-flex; align-items:center; gap:6px;">
                ${iconPlus()} เพิ่มรายการ
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: สรุปยอด -->
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
              <span>รวมเป็นเงิน</span>
              <span id="summary_subtotal">${esc(formatCurrency(subtotalVal))}</span>
            </div>
            <div class="summary-row">
              <span>ภาษีมูลค่าเพิ่ม 7.00%</span>
              <span id="summary_vat">${esc(formatCurrency(vatVal))}</span>
            </div>
            <div class="summary-total-box">
              <div class="summary-total-label">รวมทั้งสิ้น</div>
              <div class="summary-grand" id="summary_grand">฿${esc(formatCurrency(grandVal))}</div>
              <div class="summary-grand-note">* รวมภาษีมูลค่าเพิ่มเรียบร้อยแล้ว</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

