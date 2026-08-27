/* ============================================================
   KGR GROUP — LOT ALLOCATION & LOT MANAGEMENT VIEWS
   ============================================================ */

/* ──────────────────── LOT ALLOCATE ──────────────────── */
function pageLotAllocate() {
  if (!state.lotAllocateView) return pageLotAllocateLanding();
  return pageLotAllocateDetail(state.lotAllocateView);
}

function pageLotAllocateLanding() {
  const barCount = LOT_ALLOCATE.filter(r => r.type === 'bar').length;
  const pelletCount = LOT_ALLOCATE.filter(r => r.type === 'pellet').length;
  return `
    <div class="page-head">
      <div><h1>การจัดล็อต</h1><div class="desc">เลือกรูปแบบการจัดล็อตเพื่อเริ่มรวมรายการ RF เป็น Lot เดียวกัน</div></div>
    </div>

    <div class="choice-grid">
      <button type="button" class="choice-card" data-action="open-lot-type" data-type="bar">
        <span class="choice-card-badge">${barCount} รายการ</span>
        <span class="choice-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="7" rx="1.5"/><path d="M4 9l2-3h12l2 3"/></svg>
        </span>
        <span class="choice-card-title">แบบแท่ง</span>
        <span class="choice-card-desc">เริ่มที่ขั้นตอน ก่อนส่งรีด</span>
      </button>

      <button type="button" class="choice-card" data-action="open-lot-type" data-type="pellet">
        <span class="choice-card-badge">${pelletCount} รายการ</span>
        <span class="choice-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="15" r="2.4"/><circle cx="13" cy="8" r="2.4"/><circle cx="18" cy="16" r="2.4"/><circle cx="11" cy="17.5" r="2.2"/></svg>
        </span>
        <span class="choice-card-title">แบบเม็ด</span>
        <span class="choice-card-desc">ข้ามการรีด เริ่มที่ขั้นตอน สกัด</span>
      </button>
    </div>
  `;
}

function pageLotAllocateDetail(type) {
  const typeLabel = type === 'bar' ? 'แบบแท่ง' : 'แบบเม็ด';
  const startStepLabel = type === 'bar' ? 'ก่อนส่งรีด' : 'สกัด';
  const items = LOT_ALLOCATE.filter(r => r.type === type);
  const rows = items.map((r, i) => `
    <tr>
      <td><input type="checkbox" class="lot-check" data-idx="${i}"></td>
      <td class="cell-primary">${esc(r.rf)}</td>
      <td>${esc(r.date)}</td>
      <td>${esc(r.cust)}</td>
      <td class="num">${esc(r.wDeclared || r.w)} g</td>
      <td class="num">${esc(r.w)} g</td>
      <td class="right"><button class="btn btn-ghost btn-sm" data-rf-summary="${esc(r.rf)}">${iconEye()} ดูรายละเอียด RF-No</button></td>
    </tr>`).join('');

  return `
    <div class="page-head">
      <div><h1>การจัดล็อต ${esc(typeLabel)}</h1><div class="desc">เลือกรายการ RF ที่ต้องการรวมเป็น Lot เดียวกัน — เริ่มที่ขั้นตอน ${esc(startStepLabel)}</div></div>
      <button class="btn btn-secondary" data-go="lot-allocate">${iconArrowLeft()} ย้อนกลับ</button>
    </div>

    <div class="search-row" style="margin-bottom:16px;">
      <input type="text" placeholder="ค้นหา RF No / ลูกค้า">
      <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th style="width:40px;"><input type="checkbox" id="lotCheckAll"></th><th>RF No</th><th>วันที่รับ</th><th>ลูกค้า</th><th class="num">น้ำหนักแจ้ง</th><th class="num">น้ำหนักรับ</th><th></th></tr></thead>
        <tbody>${rows || `<tr class="empty-row"><td colspan="7">ไม่มีรายการ</td></tr>`}</tbody>
      </table>
      <div class="table-foot">
        <span>แสดง 1-${items.length} จาก ${items.length} รายการ</span>
        <div style="display:flex; align-items:center; gap:16px;">
          <span id="lotSelectedCount">เลือกแล้ว 0 รายการ</span>
          <button class="btn btn-primary btn-sm" data-action="create-lot" disabled id="lotCreateBtn">ยืนยันการจัดล็อต</button>
        </div>
      </div>
    </div>
  `;
}

/* ──────────────────── STATUS BADGE HELPER ──────────────────── */
function lotStatusBadge(status, label) {
  const map = {
    presend:  'badge-orange',
    postsend: 'badge-blue',
    extract:  'badge-purple',
    pre99:    'badge-red',
    post99:   'badge-red',
    closed:   'badge-teal',
  };
  const cls = map[status] || 'badge-gray';
  return `<span class="badge ${cls}">${esc(label)}</span>`;
}

/* ──────────────────── LOT MANAGE — LIST VIEW ──────────────────── */
function pageLotManage() {
  // Flatten all lots from all stages into one array (with dedup on lotNo)
  const allLots = [];
  const seen = new Set();
  const stageOrder = ['presend','postsend','extract','pre99','post99','closed'];
  stageOrder.forEach(key => {
    (LOT_MANAGE_DATA[key] || []).forEach(lot => {
      if (!seen.has(lot.lotNo)) { seen.add(lot.lotNo); allLots.push(lot); }
    });
  });

  const activeKey = state.lotStage || 'all';
  let rows = activeKey === 'all' ? allLots : (LOT_MANAGE_DATA[activeKey] || []);

  const body = rows.length ? rows.map(lot => `
    <tr>
      <td class="cell-primary">${esc(lot.lotNo)}</td>
      <td>${esc(lot.jobType)}</td>
      <td>${esc(lot.createdDate)}</td>
      <td>${lotStatusBadge(lot.status, lot.statusLabel)}</td>
      <td class="right" style="white-space:nowrap;">
        <button class="btn btn-primary btn-sm" style="margin-right:6px;" data-lot-detail="${esc(lot.lotNo)}">${iconEye()} ดูรายละเอียด</button>
        <button class="btn btn-excel btn-sm" data-action="export-lot-excel" data-lot-no="${esc(lot.lotNo)}">${iconDownload()} export .xlsx</button>
      </td>
    </tr>`).join('') :
    `<tr class="empty-row"><td colspan="5">ไม่พบ Lot ที่ตรงกับเงื่อนไข</td></tr>`;

  return `
    <div class="page-head">
      <div>
        <h1>รีด/สกัด/หลอม99</h1>
        <div class="desc">ติดตามข้อมูล Lot ในแต่ละขั้นตอนของกระบวนการ</div>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-secondary" data-action="export-excel-lot">${iconDownload()} Export Excel</button>
        <button class="btn btn-primary" data-action="report-lot">${iconChart()} ออกรายงาน</button>
      </div>
    </div>

    <div class="search-row" style="margin-bottom:16px;">
      <input type="text" placeholder="ค้นหาเลข Lot">
      <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
    </div>

    <div class="tabs">
      ${LOT_STAGES.map(s => `<div class="tab ${activeKey === s.key ? 'active' : ''}" data-tab="lot" data-key="${s.key}">${esc(s.label)}</div>`).join('')}
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Lot No</th>
            <th>ชนิด</th>
            <th>วันที่จัดล็อต</th>
            <th>สถานะ</th>
            <th class="right">จัดการ</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
      <div class="table-foot">
        <span>แสดง ${rows.length} จาก ${rows.length} รายการ</span>
        <div class="pager"><button>‹</button><button class="active">1</button><button>›</button></div>
      </div>
    </div>
  `;
}

/* ──────────────────── LOT MANAGE — DETAIL VIEW DISPATCHER ──────────────────── */
function pageLotDetail(lotNo) {
  // Find lot in all stages
  let lot = null;
  const allKeys = ['presend','postsend','extract','pre99','post99','closed'];
  for (const key of allKeys) {
    lot = (LOT_MANAGE_DATA[key] || []).find(l => l.lotNo === lotNo);
    if (lot) break;
  }
  if (!lot) return `<div class="page-head"><div><h1>ไม่พบข้อมูล Lot</h1></div><button class="btn btn-secondary" data-go="lot-manage">${iconArrowLeft()} ย้อนกลับ</button></div>`;

  switch (lot.status) {
    case 'presend':  return pageLotDetailPresend(lot);
    case 'postsend': return pageLotDetailPostsend(lot);
    case 'extract':  return pageLotDetailExtract(lot);
    case 'pre99':    return pageLotDetailPre99(lot);
    case 'post99':   return pageLotDetailPost99(lot);
    case 'closed':   return pageLotDetailClosed(lot);
    default:         return pageLotDetailPresend(lot);
  }
}

function _lotDetailHeader(lot, backBtn) {
  return `
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:6px;">
      ${backBtn || ''}
      <h1 style="font-size:22px; font-weight:700; margin:0;">${esc(lot.lotNo)}</h1>
      ${lotStatusBadge(lot.status, lot.statusLabel)}
      <span style="color:var(--text-secondary); font-size:14px;">จัดล็อตเมื่อ ${esc(lot.createdDate)}</span>
    </div>`;
}

function _lotDetailFooter(lot, stageLabel, nextLabel) {
  return `
    <div class="detail-section">
      <div class="detail-section-title">ผู้ดำเนินการ</div>
      <div class="detail-field-label">ผู้ส่ง - ${esc(stageLabel)}</div>
      <input type="text" class="detail-input" value="${esc(lot.sender)}" readonly style="max-width:280px;">
    </div>
    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:24px; padding-bottom:16px;">
      <button class="btn btn-secondary" data-action="save-lot-stage">บันทึก</button>
      ${nextLabel ? `<button class="btn btn-primary" data-action="next-lot-stage">${esc(nextLabel)} →</button>` : ''}
    </div>`;
}

/* ────── STAGE 1: ก่อนส่งรีด ────── */
function pageLotDetailPresend(lot) {
  const rows = (lot.rfRows || []).map(r => `
    <tr>
      <td>${r.seq}</td>
      <td class="cell-primary">${esc(r.rf)}</td>
      <td>${esc(r.cust)}</td>
      <td class="num">${esc(r.wDeclared)}</td>
      <td class="num">${esc(r.wReceived)}</td>
      <td class="num">${esc(r.wBill)}</td>
      <td><input type="number" class="detail-input-inline" placeholder="" value="${esc(r.wBefore || '')}" data-field="wBefore" data-rf="${esc(r.rf)}"></td>
    </tr>`).join('');

  return `
    <div style="max-width:1000px; margin:0 auto; padding:20px 0;">
      ${_lotDetailHeader(lot, `<button class="btn btn-secondary btn-sm" data-go="lot-manage">${iconArrowLeft()}</button>`)}
      <div style="font-weight:600; font-size:15px; margin-bottom:14px; margin-top:4px;">ก่อนส่งรีด</div>

      <div class="table-wrap" style="margin-bottom:20px;">
        <table>
          <thead><tr>
            <th style="width:48px;">ลำดับ</th>
            <th>RF-No.</th><th>ลูกค้า</th>
            <th class="num">น้ำหนักแจ้ง</th>
            <th class="num">น้ำหนักรับ</th>
            <th class="num">น้ำหนักบิล</th>
            <th style="min-width:150px;">น้ำหนักชั่ง - ก่อนรีด</th>
          </tr></thead>
          <tbody>${rows || `<tr class="empty-row"><td colspan="7">ไม่มีรายการ RF</td></tr>`}</tbody>
        </table>
      </div>

      <div style="color:var(--text-secondary); font-size:13px; margin-bottom:12px;">เลข Lot-No: <strong>${esc(lot.lotNo)}</strong></div>

      <div class="detail-section">
        <div class="detail-section-title">ทองคำ (Au)</div>
        <div class="detail-3col">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักแจ้ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWDeclaredAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักบิล (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBillAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBeforeAu || '')}" readonly>
          </div>
        </div>
      </div>

      ${_lotDetailFooter(lot, 'ก่อนส่งรีด', 'ขั้นตอนถัดไป')}
    </div>`;
}

/* ────── STAGE 2: หลังส่งรีด ────── */
function pageLotDetailPostsend(lot) {
  const rows = (lot.rfRows || []).map(r => `
    <tr>
      <td>${r.seq}</td>
      <td class="cell-primary">${esc(r.rf)}</td>
      <td>${esc(r.cust)}</td>
      <td class="num">${esc(r.wDeclared)}</td>
      <td class="num">${esc(r.wReceived)}</td>
      <td class="num">${esc(r.wBill)}</td>
      <td class="num">${esc(r.wBefore)}</td>
      <td><button class="btn btn-sm" style="background:var(--error,#e53e3e);color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;" data-action="rolling-damage" data-rf="${esc(r.rf)}">รีดเสียหาย</button></td>
    </tr>`).join('');

  return `
    <div style="max-width:1000px; margin:0 auto; padding:20px 0;">
      ${_lotDetailHeader(lot, `<button class="btn btn-secondary btn-sm" data-go="lot-manage">${iconArrowLeft()}</button>`)}
      <div style="font-weight:600; font-size:15px; margin-bottom:14px; margin-top:4px;">หลังส่งรีด</div>

      <div class="table-wrap" style="margin-bottom:20px;">
        <table>
          <thead><tr>
            <th style="width:48px;">ลำดับ</th>
            <th>RF-No.</th><th>ลูกค้า</th>
            <th class="num">น้ำหนักแจ้ง</th>
            <th class="num">น้ำหนักรับ</th>
            <th class="num">น้ำหนักบิล</th>
            <th class="num">น้ำหนักชั่ง - ก่อนรีด</th>
            <th>จัดการ</th>
          </tr></thead>
          <tbody>${rows || `<tr class="empty-row"><td colspan="8">ไม่มีรายการ RF</td></tr>`}</tbody>
        </table>
      </div>

      <div style="color:var(--text-secondary); font-size:13px; margin-bottom:12px;">เลข Lot-No: <strong>${esc(lot.lotNo)}</strong></div>

      <div class="detail-section">
        <div class="detail-section-title">น้ำหนักระหว่างทาง — ไม่แยกโลหะ</div>
        <div style="display:flex; align-items:flex-end; gap:16px; flex-wrap:wrap;">
          <div>
            <div class="detail-field-label" style="display:flex;align-items:center;gap:6px;">
              <span class="badge badge-orange" style="font-size:11px;padding:2px 8px;">กรอกเอง</span>
              ผลรวมน้ำหนักชั่งหลังรีด
            </div>
            <input type="number" class="detail-input" placeholder="" value="${esc(lot.totalWAfterRoll || '')}" style="max-width:280px;">
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">ทองคำ (Au)</div>
        <div class="detail-3col">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักแจ้ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWDeclaredAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักบิล (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBillAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBeforeAu || '')}" readonly>
          </div>
        </div>
      </div>

      ${_lotDetailFooter(lot, 'หลังส่งรีด', 'ขั้นตอนถัดไป')}
    </div>`;
}

/* ────── STAGE 3: สกัด ────── */
function pageLotDetailExtract(lot) {
  const rows = (lot.rfRows || []).map(r => `
    <tr>
      <td>${r.seq}</td>
      <td class="cell-primary">${esc(r.rf)}</td>
      <td>${esc(r.cust)}</td>
      <td class="num">${esc(r.wDeclared)}</td>
      <td class="num">${esc(r.wReceived)}</td>
      <td class="num">${esc(r.wBill)}</td>
      <td class="num">${esc(r.wBefore)}</td>
      <td><input type="number" class="detail-input-inline" placeholder="" value="${esc(r.wBeforeSend || '')}" data-field="wBeforeSend" data-rf="${esc(r.rf)}"></td>
    </tr>`).join('');

  return `
    <div style="max-width:1000px; margin:0 auto; padding:20px 0;">
      ${_lotDetailHeader(lot, `<button class="btn btn-secondary btn-sm" data-go="lot-manage">${iconArrowLeft()}</button>`)}
      <div style="font-weight:600; font-size:15px; margin-bottom:14px; margin-top:4px;">สกัด</div>

      <div class="table-wrap" style="margin-bottom:20px;">
        <table>
          <thead><tr>
            <th style="width:48px;">ลำดับ</th>
            <th>RF-No.</th><th>ลูกค้า</th>
            <th class="num">น้ำหนักแจ้ง</th>
            <th class="num">น้ำหนักรับ</th>
            <th class="num">น้ำหนักบิล</th>
            <th class="num">น้ำหนักชั่ง - ก่อนรีด</th>
            <th style="min-width:150px;">น้ำหนักชั่ง - ก่อนส่งสกัด</th>
          </tr></thead>
          <tbody>${rows || `<tr class="empty-row"><td colspan="8">ไม่มีรายการ RF</td></tr>`}</tbody>
        </table>
      </div>

      <div style="color:var(--text-secondary); font-size:13px; margin-bottom:12px;">เลข Lot-No: <strong>${esc(lot.lotNo)}</strong></div>

      <div class="detail-section">
        <div class="detail-section-title">น้ำหนักระหว่างทาง — ไม่แยกโลหะ</div>
        <div class="detail-2col">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่งหลังรีด</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWAfterRoll || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label" style="display:flex;align-items:center;gap:6px;">
              <span class="badge badge-orange" style="font-size:11px;padding:2px 8px;">กรอกเอง</span>
              ผลรวมน้ำหนักชั่งก่อนส่งสกัด
            </div>
            <input type="number" class="detail-input" placeholder="" value="${esc(lot.totalWSentExtract || '')}" style="max-width:280px;">
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">ทองคำ (Au)</div>
        <div class="detail-3col">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักแจ้ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWDeclaredAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักบิล (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBillAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBeforeAu || '')}" readonly>
          </div>
        </div>
      </div>

      ${_lotDetailFooter(lot, 'ก่อนส่งสกัด', 'ขั้นตอนถัดไป')}
    </div>`;
}

/* ────── STAGE 4: ก่อนหลอม 99 ────── */
function pageLotDetailPre99(lot) {
  const rows = (lot.rfRows || []).map(r => `
    <tr>
      <td>${r.seq}</td>
      <td class="cell-primary">${esc(r.rf)}</td>
      <td>${esc(r.cust)}</td>
      <td class="num">${esc(r.wDeclared)}</td>
      <td class="num">${esc(r.wReceived)}</td>
      <td class="num">${esc(r.wBill)}</td>
      <td class="num">${esc(r.wBefore)}</td>
      <td class="num">${esc(r.wBeforeSend || '')}</td>
      <td class="num">${esc(r.pctAu || '')}</td>
      <td class="num">${esc(r.auG || '')}</td>
      <td class="num">${esc(r.pctAg || '')}</td>
      <td class="num">${esc(r.agG || '')}</td>
    </tr>`).join('');

  return `
    <div style="max-width:1100px; margin:0 auto; padding:20px 0;">
      ${_lotDetailHeader(lot, `<button class="btn btn-secondary btn-sm" data-go="lot-manage">${iconArrowLeft()}</button>`)}
      <div style="font-weight:600; font-size:15px; margin-bottom:14px; margin-top:4px;">ก่อนหลอม 99</div>

      <div class="table-wrap" style="margin-bottom:20px; overflow-x:auto;">
        <table>
          <thead><tr>
            <th style="width:44px;">ลำดับ</th>
            <th>RF-No.</th><th>ลูกค้า</th>
            <th class="num">น้ำหนักแจ้ง</th>
            <th class="num">น้ำหนักรับ</th>
            <th class="num">น้ำหนักบิล</th>
            <th class="num">น้ำหนักชั่ง - ก่อนรีด</th>
            <th class="num">น้ำหนักชั่ง - ก่อนส่งสกัด</th>
            <th class="num">%Au</th>
            <th class="num">Au(g)</th>
            <th class="num">%Ag</th>
            <th class="num">Ag(g)</th>
          </tr></thead>
          <tbody>${rows || `<tr class="empty-row"><td colspan="12">ไม่มีรายการ RF</td></tr>`}</tbody>
        </table>
      </div>

      <div style="color:var(--text-secondary); font-size:13px; margin-bottom:12px;">เลข Lot-No: <strong>${esc(lot.lotNo)}</strong></div>

      <div class="detail-section">
        <div class="detail-section-title">น้ำหนักระหว่างทาง — ไม่แยกโลหะ</div>
        <div class="detail-2col">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่งหลังรีด</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWAfterRoll || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่งก่อนส่งสกัด</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWSentExtract || '')}" readonly>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">ทองคำ (Au)</div>
        <div class="detail-field-label" style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">น้ำหนักชั่ง (จากบิลสกัด)</div>
        <div class="detail-3col" style="margin-bottom:14px;">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักแจ้ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWDeclaredAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักบิล (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBillAu || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่ง (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalWBeforeAu || '')}" readonly>
          </div>
        </div>
        <div style="font-size:13px; font-weight:600; margin-bottom:8px; color:var(--text-primary);">ก่อนหลอม 99</div>
        <div class="detail-2col">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Au)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalW99Au || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label" style="display:flex;align-items:center;gap:6px;">
              <span class="badge badge-orange" style="font-size:11px;padding:2px 8px;">กรอกเอง</span>
              ผลรวมน้ำหนักผ่านเครื่องชั่ง ก่อนหลอม 99 (Au)
            </div>
            <input type="number" class="detail-input" placeholder="" value="${esc(lot.totalWScale99Au || '')}">
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">เงิน (Ag)</div>
        <div class="detail-2col">
          <div>
            <div class="detail-field-label">ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Ag)</div>
            <input type="text" class="detail-input" value="${esc(lot.totalW99Ag || '')}" readonly>
          </div>
          <div>
            <div class="detail-field-label" style="display:flex;align-items:center;gap:6px;">
              <span class="badge badge-orange" style="font-size:11px;padding:2px 8px;">กรอกเอง</span>
              ผลรวมน้ำหนักผ่านเครื่องชั่ง ก่อนหลอม 99 (Ag)
            </div>
            <input type="number" class="detail-input" placeholder="" value="${esc(lot.totalWScale99Ag || '')}">
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">TSM Au + Ag</div>
        <div>
          <div class="detail-field-label">น้ำหนักชั่งรวม Au + Ag</div>
          <input type="text" class="detail-input" value="${esc(lot.totalW99AuAg || '')}" readonly style="max-width:280px;">
        </div>
      </div>

      ${_lotDetailFooter(lot, 'ก่อนหลอม 99', 'ขั้นตอนถัดไป')}
    </div>`;
}

/* ────── STAGE 5: หลังหลอม 99 ────── */
function pageLotDetailPost99(lot) {
  // Re-use pre99 layout but read-only with post99 fields
  return pageLotDetailPre99({ ...lot, status: 'post99', statusLabel: 'หลังหลอม 99' });
}

/* ────── STAGE 6: ปิดงาน ────── */
function pageLotDetailClosed(lot) {
  return `
    <div style="max-width:1000px; margin:0 auto; padding:20px 0;">
      ${_lotDetailHeader(lot, `<button class="btn btn-secondary btn-sm" data-go="lot-manage">${iconArrowLeft()}</button>`)}
      <div style="margin-top:20px; padding:24px; background:var(--card-bg,#fff); border-radius:12px; border:1px solid var(--border); text-align:center; color:var(--text-secondary);">
        <div style="font-size:18px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Lot นี้ปิดงานเรียบร้อยแล้ว</div>
        <div>Lot No: <strong>${esc(lot.lotNo)}</strong> | จัดล็อตเมื่อ: ${esc(lot.createdDate)}</div>
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:16px;">
        <button class="btn btn-excel btn-sm" data-action="export-lot-excel" data-lot-no="${esc(lot.lotNo)}">${iconDownload()} export .xlsx</button>
      </div>
    </div>`;
}
