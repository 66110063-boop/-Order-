/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* ============================================================
   KGR GROUP — LOT ALLOCATION & LOT MANAGEMENT VIEWS
   ============================================================ */

function pageLotAllocate() {
  if (!state.lotAllocateView) {
    return pageLotAllocateLanding();
  }
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
        <tbody>${rows || '<tr class="empty-row"><td colspan="7">ไม่มีรายการ</td></tr>'}</tbody>
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

/* ============================================================
   LOT MANAGEMENT — รีด/สกัด/หลอม99  LIST + DETAIL
   ============================================================ */

function pageLotManage() {
  if (state.lotDetailId) return pageLotDetail(state.lotDetailId);
  return pageLotManageList();
}

/* ---------- LIST VIEW ---------- */
function pageLotManageList() {
  const key = state.lotStage || 'all';
  let rows = [];
  if (key === 'all') {
    LOT_STAGES.forEach(s => {
      if (s.key === 'all') return;
      (LOT_MANAGE_DATA[s.key] || []).forEach(r => rows.push({ ...r, stageKey: s.key, stageLabel: s.label }));
    });
  } else {
    const s = LOT_STAGES.find(x => x.key === key);
    rows = (LOT_MANAGE_DATA[key] || []).map(r => ({ ...r, stageKey: key, stageLabel: s ? s.label : '' }));
  }

  const body = rows.length ? rows.map(r => `
    <tr>
      <td class="cell-primary">${esc(r.lot)}</td>
      <td>${esc(r.jobType)}</td>
      <td>${esc(r.date)}</td>
      <td><span class="badge ${getLotStageBadgeClass(r.stageKey)}">${esc(r.stageLabel)}</span></td>
      <td style="text-align:right;">
        <div style="display:inline-flex; gap:6px;">
          <button class="btn btn-primary btn-sm" data-action="view-lot" data-lot="${esc(r.lot)}" data-stage="${esc(r.stageKey)}">ดูรายละเอียด</button>
          <button class="btn btn-secondary btn-sm">${iconDownload()} export .xlsx</button>
        </div>
      </td>
    </tr>`).join('') : '<tr class="empty-row"><td colspan="5">ไม่พบ Lot ที่ตรงกับเงื่อนไข</td></tr>';

  return `
    <div class="page-head">
      <div><h1>รีด/สกัด/หลอม99</h1><div class="desc">ติดตามข้อมูล Lot ในแต่ละขั้นตอนของกระบวนการ</div></div>
    </div>
    <div class="search-row" style="margin-bottom:16px;">
      <input type="text" placeholder="ค้นหาเลข Lot" style="max-width:320px;">
      <button class="btn btn-secondary btn-sm">ค้นหา</button>
    </div>
    <div class="tabs" style="margin-bottom:0; border-bottom:none;">
      ${LOT_STAGES.map(s => '<div class="tab ' + (key === s.key ? 'active' : '') + '" data-tab="lot" data-key="' + s.key + '">' + esc(s.label) + '</div>').join('')}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Lot No</th><th>ชนิด</th><th>วันที่จัดล็อต</th><th>สถานะ</th><th style="text-align:right;">จัดการ</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function getLotStageBadgeClass(sKey) {
  switch (sKey) {
    case 'presend': return 'badge-info';
    case 'postsend': case 'extract': case 'pre99': case 'post99': return 'badge-progress';
    case 'closed': return 'badge-done';
    default: return 'badge-info';
  }
}

/* ---------- DETAIL VIEW ---------- */
function pageLotDetail(lotId) {
  let lotData = null, lotStage = null, lotStageLabel = '';
  if (state.lotDetailStage) {
    const s = LOT_STAGES.find(x => x.key === state.lotDetailStage);
    const f = (LOT_MANAGE_DATA[state.lotDetailStage] || []).find(x => x.lot === lotId);
    if (f) {
      lotData = f;
      lotStage = state.lotDetailStage;
      lotStageLabel = s ? s.label : '';
    }
  }
  if (!lotData) {
    for (const s of LOT_STAGES) {
      if (s.key === 'all') continue;
      const f = (LOT_MANAGE_DATA[s.key] || []).find(x => x.lot === lotId);
      if (f) { lotData = f; lotStage = s.key; lotStageLabel = s.label; break; }
    }
  }
  if (!lotData) return '<div class="page-head"><div><h1>ไม่พบข้อมูล Lot</h1></div><button class="btn btn-secondary" data-action="back-lot-list">ย้อนกลับ</button></div>';

  /* ---- header ---- */
  const badgeClass = getLotStageBadgeClass(lotStage);
  const hdr = `
    <div style="margin-bottom:4px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
      <h1 style="font-size:22px; font-weight:800; margin:0;">${esc(lotData.lot)}</h1>
      <span class="lot-stage-badge badge ${badgeClass}">${esc(lotStageLabel)}</span>
      <span style="font-size:15px; color:var(--text-secondary);">จัดล็อตเมื่อ ${esc(lotData.date)}</span>
    </div>
    <div style="font-size:15px; color:var(--text-secondary); margin-bottom:20px;">${esc(lotStageLabel)}</div>`;

  /* ---- table ---- */
  const tbl = _lotTable(lotData, lotStage, lotStageLabel);

  /* ---- middle sections ---- */
  const mid = _lotSections(lotData, lotStage, lotStageLabel);

  /* ---- footer ---- */
  let foot = '';
  if (lotStage !== 'closed') {
    const nextBtnLabel = lotStage === 'post99' ? 'ปิดงาน' : 'ขั้นตอนถัดไป';
    foot = `
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:28px;">
        <button class="btn btn-secondary" data-action="back-lot-list">บันทึก</button>
        <button class="btn btn-primary" data-action="next-lot-stage">${esc(nextBtnLabel)}</button>
      </div>`;
  }

  return hdr + tbl + mid + foot;
}

/* ---- Table builder ---- */
function _lotTable(d, stage, stageLabel) {
  /* header cols */
  const base = '<th style="width:60px;">ลำดับ</th><th>RF-No.</th><th>ลูกค้า</th><th class="num">น้ำหนักแจ้ง</th><th class="num">น้ำหนักรับ</th><th class="num">น้ำหนักบิล</th>';
  let extra = '';

    if (stage === 'presend')
      extra = '<th class="num">น้ำหนักชั่ง - ก่อนรีด</th>';
    else if (stage === 'postsend')
      extra = '<th class="num">น้ำหนักชั่ง - ก่อนรีด</th><th style="text-align:center;">จัดการ</th>';
    else if (stage === 'extract')
      extra = '<th class="num">น้ำหนักชั่ง - ก่อนรีด</th><th class="num">น้ำหนักชั่ง - ก่อนส่งสกัด</th>';
    else if (stage === 'pre99' || stage === 'post99')
      extra = '<th class="num">น้ำหนักชั่ง - ก่อนรีด</th><th class="num">%Au</th><th class="num">Au (g)</th><th class="num">%Ag</th><th class="num">Ag (g)</th>';
    else if (stage === 'closed')
      extra = '<th class="num">น้ำหนักชั่ง - ก่อนรีด</th><th class="num">%Au</th><th class="num">Au (g)</th><th class="num">%Ag</th><th class="num">Ag (g)</th><th style="text-align:center;width:100px;">รายละเอียด</th>';

    /* body rows */
    const bodyRows = d.rfRows.length ? d.rfRows.map((r, i) => {
      let cells = `
        <td style="text-align:center;">${i + 1}</td>
        <td class="cell-primary">${esc(r.rf)}</td>
        <td>${esc(r.cust)}</td>
        <td class="num">${esc(r.wDec)}</td>
        <td class="num">${esc(r.wRec)}</td>
        <td class="num">${esc(r.wBill)}</td>`;

      if (stage === 'presend')
        cells += '<td><input type="text" class="num-input" placeholder="0.00" style="width:100%;"></td>';
      else if (stage === 'postsend')
        cells += `<td class="num">${esc(r.wBill)}</td><td style="text-align:center;"><button class="btn btn-danger-ghost btn-sm">รีดเสียหาย</button></td>`;
      else if (stage === 'extract')
        cells += `<td class="num">${esc(r.wBill)}</td><td><input type="text" class="num-input" placeholder="0.00" style="width:100%;"></td>`;
      else if (stage === 'pre99' || stage === 'post99')
        cells += `
          <td class="num">${esc(r.wBill)}</td>
          <td class="num">${r.percentAu || '100.00'}</td>
          <td class="num">${r.auG || '100.00'}</td>
          <td class="num">${r.percentAg || '100.00'}</td>
          <td class="num">${r.agG || '100.00'}</td>`;
      else if (stage === 'closed')
        cells += `
          <td><input type="text" class="num-input input-locked" value="${esc(r.wBill)}" disabled style="width:100%;"></td>
          <td><input type="text" class="num-input input-locked" value="${r.percentAu || '10.00'}" disabled style="width:100%;"></td>
          <td><input type="text" class="num-input input-locked" value="${r.auG || '10.00'}" disabled style="width:100%;"></td>
          <td><input type="text" class="num-input input-locked" value="${r.percentAg || '10.00'}" disabled style="width:100%;"></td>
          <td><input type="text" class="num-input input-locked" value="${r.agG || '10.00'}" disabled style="width:100%;"></td>
          <td style="text-align:center;"><button class="btn btn-secondary btn-sm">${iconEye()} ดู detail</button></td>`;

      return '<tr>' + cells + '</tr>';
    }).join('') : '<tr class="empty-row"><td colspan="12">ไม่มีรายการ RF</td></tr>';

  return `
    <div class="table-wrap" style="margin-bottom:0; border-radius:0;">
      <table><thead><tr>${base}${extra}</tr></thead><tbody>${bodyRows}</tbody></table>
    </div>`;
}

/* ---- Section builder ---- */
function _lotSections(d, stage, stageLabel) {
  const lotNoLine = `<div class="field" style="max-width:280px; margin-bottom:16px;"><label>เลข Lot-No</label><input type="text" class="input-locked" value="${esc(d.lot)}" disabled></div>`;

  /* --- helper: 3-column Au summary --- */
  const auSummary3 = (v1, v2, v3) => `
    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head panel-head-blue">ทองคำ (Au)</div>
      <div class="panel-body">
        <div class="section-label">น้ำหนักตั้งต้น (จากข้อมูลลูกค้า)</div>
        <div class="grid-3">
          <div class="field"><label>ผลรวมน้ำหนักแจ้ง (Au)</label><input type="text" class="num-input input-locked" value="${v1}" disabled></div>
          <div class="field"><label>ผลรวมน้ำหนักบิล (Au)</label><input type="text" class="num-input input-locked" value="${v2}" disabled></div>
          <div class="field"><label>ผลรวมน้ำหนักชั่ง (Au)</label><input type="text" class="num-input input-locked" value="${v3}" disabled></div>
        </div>
      </div>
    </div>`;

  /* --- helper: operator section --- */
  const operatorSection = (label) => `
    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head panel-head-blue">ผู้ดำเนินการ</div>
      <div class="panel-body">
        <div class="grid-2">
          <div class="field"><label>ผู้ส่ง - ${esc(label)}</label><input type="text" class="input-locked" value="office@kgr.local" disabled></div>
          <div class="field"><label>วันที่ทดสอบ</label><input type="text" class="input-locked" value="27/08/2569" disabled></div>
        </div>
      </div>
    </div>`;

  /* --- helper: standard panel wrapper --- */
  const panel = (title, bodyHtml, extraStyle) => `
    <div class="panel" style="margin-bottom:16px; ${extraStyle || ''}">
      <div class="panel-head panel-head-blue">${esc(title)}</div>
      <div class="panel-body">${bodyHtml}</div>
    </div>`;

  /* ===== PRESEND ===== */
  if (stage === 'presend') return `
    ${lotNoLine}
    ${auSummary3('100.00', '100.00', '100.00')}
    ${operatorSection('ก่อนส่งรีด')}`;

  /* ===== POSTSEND ===== */
  if (stage === 'postsend') return `
    ${lotNoLine}
    ${panel('น้ำหนักระหว่างทาง — ไม่แยกโลหะ', `
      <div class="field" style="max-width:420px;">
        ${wfManualTag()}
        <label>ผลรวมน้ำหนักชั่งหลังรีด</label>
        <input type="text" class="num-input" placeholder="0.00">
      </div>`)}
    ${auSummary3('100.00', '100.00', '100.00')}
    ${operatorSection('หลังส่งรีด')}`;

  /* ===== EXTRACT ===== */
  if (stage === 'extract') return `
    ${lotNoLine}
    ${panel('น้ำหนักระหว่างทาง — ไม่แยกโลหะ', `
      <div class="grid-2">
        <div class="field"><label>ผลรวมน้ำหนักชั่งหลังรีด</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field">${wfManualTag()}<label>ผลรวมน้ำหนักชั่งก่อนส่งสกัด</label><input type="text" class="num-input" placeholder="0.00"></div>
      </div>`)}
    ${auSummary3('100.00', '100.00', '100.00')}
    ${operatorSection('ก่อนส่งสกัด')}`;

  /* ===== PRE99 ===== */
  if (stage === 'pre99') return `
    ${lotNoLine}
    ${panel('น้ำหนักระหว่างทาง — ไม่แยกโลหะ', `
      <div class="grid-2">
        <div class="field"><label>ผลรวมน้ำหนักชั่งหลังรีด</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>น้ำหนักชั่งก่อนสกัด</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>`)}
    ${panel('ทองคำ (Au)', `
      <div class="section-label">น้ำหนักตั้งต้น (จากข้อมูลลูกค้า)</div>
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="field"><label>ผลรวมน้ำหนักแจ้ง (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักบิล (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักชั่ง (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>
      <div class="section-label">ก่อนหลอม 99</div>
      <div class="grid-3">
        <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>`)}
    ${panel('เงิน (Ag)', `
      <div class="section-label">ก่อนหลอม 99</div>
      <div class="grid-3">
        <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Ag)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>`)}
    ${panel('รวม Au + Ag', `
      <div class="field" style="max-width:420px;">
        <label>น้ำหนักชั่งรวม</label>
        <input type="text" class="num-input input-locked" value="200.00" disabled style="font-size:20px; font-weight:800;">
      </div>`)}
    ${operatorSection('ก่อนหลอม 99')}`;

  /* ===== POST99 ===== */
  if (stage === 'post99') return `
    ${lotNoLine}
    ${panel('น้ำหนักระหว่างทาง — ไม่แยกโลหะ', `
      <div class="grid-2">
        <div class="field"><label>ผลรวมน้ำหนักชั่งหลังรีด</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>น้ำหนักชั่งก่อนสกัด</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>`)}
    ${panel('ทองคำ (Au)', `
      <div class="section-label">น้ำหนักตั้งต้น (จากข้อมูลลูกค้า)</div>
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="field"><label>ผลรวมน้ำหนักแจ้ง (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักบิล (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักชั่ง (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>
      <div class="section-label">ก่อนหลอม 99</div>
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>
      <div class="section-label">หลังหลอม 99</div>
      <div class="grid-3">
        <div class="field"><label>%Au หลังหลอม 99</label><input type="text" class="num-input" value="99.99"></div>
        <div class="field">${wfManualTag()}<label>ผลรวมน้ำหนักชั่งหลังหลอม 99 (Au)</label><input type="text" class="num-input" value="100.00"></div>
        <div class="field">${wfManualTag()}<label>ขี้เบ้า</label><input type="text" class="num-input" value=""></div>
      </div>
      <div class="grid-3" style="margin-top:16px;">
        <div class="field"><label>ขาด (g)</label><input type="text" class="num-input input-locked diff-mismatch" value="-100.00" disabled></div>
      </div>`)}
    ${panel('เงิน (Ag)', `
      <div class="section-label">ก่อนหลอม 99</div>
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Ag)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>
      <div class="section-label">หลังหลอม 99</div>
      <div class="grid-3">
        <div class="field"><label>%Ag หลังหลอม 99</label><input type="text" class="num-input" value="99.99"></div>
        <div class="field">${wfManualTag()}<label>ผลรวมน้ำหนักชั่งหลังหลอม 99 (Ag)</label><input type="text" class="num-input" value="100.00"></div>
        <div class="field">${wfManualTag()}<label>ขี้เบ้า</label><input type="text" class="num-input" value="142.00"></div>
      </div>
      <div class="grid-3" style="margin-top:16px;">
        <div class="field"><label>ขาด (g)</label><input type="text" class="num-input input-locked diff-match" value="0.00" disabled></div>
      </div>`)}
    ${panel('รวม Au + Ag', `
      <div class="field" style="max-width:420px;">
        <label>น้ำหนักชั่งรวม</label>
        <input type="text" class="num-input input-locked" value="200.00" disabled style="font-size:20px; font-weight:800;">
      </div>`)}
    ${operatorSection('หลังส่งหลอม 99')}`;

  /* ===== CLOSED ===== */
  if (stage === 'closed') return `
    ${lotNoLine}
    ${panel('น้ำหนักระหว่างทาง — ไม่แยกโลหะ', `
      <div class="grid-2">
        <div class="field"><label>ผลรวมน้ำหนักชั่งหลังรีด</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>น้ำหนักชั่งก่อนสกัด</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>`)}
    ${panel('ทองคำ (Au)', `
      <div class="section-label">น้ำหนักตั้งต้น (จากข้อมูลลูกค้า)</div>
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="field"><label>ผลรวมน้ำหนักแจ้ง (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักบิล (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักชั่ง (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
      </div>
      <div class="section-label">ก่อนหลอม 99</div>
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Au)</label><input type="text" class="num-input input-locked" value="10.00" disabled></div>
      </div>
      <div class="section-label">หลังหลอม 99</div>
      <div class="grid-3">
        <div class="field"><label>%Au หลังหลอม 99</label><input type="text" class="num-input input-locked" value="99.99" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักชั่งหลังหลอม 99 (Au)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ขี้เบ้า</label><input type="text" class="num-input input-locked" value="20.00" disabled></div>
      </div>
      <div class="grid-3" style="margin-top:16px;">
        <div class="field"><label>ขาด (g)</label><input type="text" class="num-input input-locked diff-mismatch" value="90.00" disabled></div>
      </div>`)}
    ${panel('เงิน (Ag)', `
      <div class="section-label">ก่อนหลอม 99</div>
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="field"><label>ผลรวมน้ำหนักชั่งก่อนหลอม 99 (Ag)</label><input type="text" class="num-input input-locked" value="10.00" disabled></div>
      </div>
      <div class="section-label">หลังหลอม 99</div>
      <div class="grid-3">
        <div class="field"><label>%Ag หลังหลอม 99</label><input type="text" class="num-input input-locked" value="99.99" disabled></div>
        <div class="field"><label>ผลรวมน้ำหนักชั่งหลังหลอม 99 (Ag)</label><input type="text" class="num-input input-locked" value="100.00" disabled></div>
        <div class="field"><label>ขี้เบ้า</label><input type="text" class="num-input input-locked" value="142.00" disabled></div>
      </div>
      <div class="grid-3" style="margin-top:16px;">
        <div class="field"><label>ขาด (g)</label><input type="text" class="num-input input-locked diff-match" value="0.00" disabled></div>
      </div>`)}
    ${panel('รวม Au + Ag', `
      <div class="field" style="max-width:420px;">
        <label>น้ำหนักชั่งรวม</label>
        <input type="text" class="num-input input-locked" value="200.00" disabled style="font-size:20px; font-weight:800;">
      </div>`)}
    ${operatorSection(stageLabel)}`;

  /* ===== FALLBACK ===== */
  return `
    ${lotNoLine}
    ${operatorSection(stageLabel)}`;
}
