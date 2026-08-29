/* ============================================================
   KGR GROUP — DASHBOARD & KANBAN VIEW
   ============================================================ */

function pageDashboard() {
  function syncKanbanData() {
    KANBAN_COLS.forEach(c => c.items = []);
    KANBAN_CLOSED.length = 0;

    // Lane 1: Orders (RF Node)
    ORDERS.forEach(o => {
      if (o.cancelled) return;
      const item = { rf: o.rf, cust: o.cust, date: o.date, w: o.w };
      if (o.lotNo && o.lotNo !== '—') item.lot = o.lotNo;
      
      if (o.station === 9) {
        KANBAN_CLOSED.push(item);
      } else if (o.percentApprovalStatus === 'pending') {
        const col = KANBAN_COLS.find(c => c.key === 'tdc');
        if (col) col.items.push(item);
      } else {
        const key = WF_STATION_TO_KANBAN_KEY[o.station];
        if (key) {
          const col = KANBAN_COLS.find(c => c.key === key);
          if (col) col.items.push(item);
        }
      }
    });

    // Lane 2: Lot Allocate
    const lotCol = KANBAN_COLS.find(c => c.key === 'lot');
    if (lotCol) {
      LOT_ALLOCATE.forEach(r => {
        lotCol.items.push({ rf: r.rf, cust: r.cust, date: r.date, w: r.w, lot: 'รอดำเนินการ' });
      });
    }

    // Lane 2: Lot Manage
    Object.keys(LOT_MANAGE_DATA).forEach(stageKey => {
      if (stageKey === 'closed') {
        LOT_MANAGE_DATA[stageKey].forEach(r => {
          const rf = (r.rfRows && r.rfRows[0]) ? r.rfRows[0].rf : 'RF-MULTI';
          const cust = (r.rfRows && r.rfRows[0]) ? r.rfRows[0].cust : 'หลายรายการ';
          const w = (r.rfRows && r.rfRows[0]) ? r.rfRows[0].wBill : '0.00';
          KANBAN_CLOSED.push({ rf, cust, date: r.date, w, lot: r.lot });
        });
      } else {
        const col = KANBAN_COLS.find(c => c.key === stageKey);
        if (col) {
          LOT_MANAGE_DATA[stageKey].forEach(r => {
            const rf = (r.rfRows && r.rfRows[0]) ? r.rfRows[0].rf : 'RF-MULTI';
            const cust = (r.rfRows && r.rfRows[0]) ? r.rfRows[0].cust : 'หลายรายการ';
            const w = (r.rfRows && r.rfRows[0]) ? r.rfRows[0].wBill : '0.00';
            col.items.push({ rf, cust, date: r.date, w, lot: r.lot });
          });
        }
      }
    });
  }

  syncKanbanData();

  // Helper: render one lane column
  function laneCol(col) {
    return `<div class="lane-col">
      <div class="lane-col-head">
        <span>${esc(col.label)}</span>
        <span class="lc-count">${col.items.length}</span>
      </div>
      <div class="lane-col-body">
        ${col.items.length ? col.items.map(it => `
          <div class="lane-card kcard" data-detail="${esc(it.rf)}">
            <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px;">
              <div class="rf" style="font-weight:700; color:var(--header-bg); font-size:15px;">${esc(it.rf)}</div>
              <div class="num" style="font-family:var(--font-mono); font-weight:700; font-size:15px; white-space:nowrap;">${esc(it.w)} g</div>
            </div>
            <div class="cust" style="margin:6px 0; font-size:15px; color:var(--text-secondary); line-height:1.3;">${esc(it.cust)}</div>
            <div class="meta" style="display:flex; justify-content:space-between; align-items:center; font-size:13.5px; color:#64748B;">
              <span>${esc(it.date)}</span>
              ${it.lot && it.lot !== '—' ? `<span class="lot" style="margin:0;">${esc(it.lot)}</span>` : '<span></span>'}
            </div>
          </div>`).join('') : `<div class="lane-empty">ไม่มีรายการ</div>`}
      </div>
    </div>`;
  }

  // Define 3 lanes — map KANBAN_COLS into the right lane
  const LANE1_KEYS = ['new', 'melt', 'test', 'tdc', 'deduct'];
  const LANE2_KEYS = ['lot', 'presend', 'postsend', 'extract', 'pre99', 'post99'];

  // Count totals per lane
  const l1Total = KANBAN_COLS.filter(c => LANE1_KEYS.includes(c.key)).reduce((s, c) => s + c.items.length, 0);
  const l2Total = KANBAN_COLS.filter(c => LANE2_KEYS.includes(c.key)).reduce((s, c) => s + c.items.length, 0);
  const l3Total = KANBAN_CLOSED.length;

  // Lane 1: ระดับ RF No — NEW → หลอม → ทดสอบ % → หักทอง → TDC
  const rfNodeCols = KANBAN_COLS.filter(c => LANE1_KEYS.includes(c.key));
  const rfNodeHtml = rfNodeCols.map(laneCol).join('');

  // Lane 2: ระดับ Lot No — จัดล็อต → ก่อนส่งรีด → หลังส่งรีด → สกัด → ก่อนส่งหลอม 99 → หลังส่งหลอม 99
  const lotLossCols = KANBAN_COLS.filter(c => LANE2_KEYS.includes(c.key));
  const lotLossHtml = lotLossCols.map(laneCol).join('');

  // Lane 3: ปิดงาน — 30 วันล่าสุด
  const closedHtml = `<div class="lane-col" style="flex:0 0 300px; width:300px; min-width:300px;">
    <div class="lane-col-head"><span>ปิดงาน — 30 วันล่าสุด</span><span class="lc-count">${KANBAN_CLOSED.length}</span></div>
    <div class="lane-col-body">
      ${KANBAN_CLOSED.length ? KANBAN_CLOSED.map(it => `
        <div class="lane-card kcard" data-detail="${esc(it.rf)}">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px;">
            <div class="rf" style="font-weight:700; color:var(--header-bg); font-size:15px;">${esc(it.rf)}</div>
            <div class="num" style="font-family:var(--font-mono); font-weight:700; font-size:15px; white-space:nowrap;">${esc(it.w)} g</div>
          </div>
          <div class="cust" style="margin:6px 0; font-size:15px; color:var(--text-secondary); line-height:1.3;">${esc(it.cust)}</div>
          <div class="meta" style="display:flex; justify-content:space-between; align-items:center; font-size:13.5px; color:#64748B;">
            <span>${esc(it.date)}</span>
            ${it.lot && it.lot !== '—' ? `<span class="lot" style="margin:0;">${esc(it.lot)}</span>` : '<span></span>'}
          </div>
        </div>
      `).join('') : '<div class="lane-empty">ไม่มีรายการปิดงานใน 30 วันที่ผ่านมา</div>'}
    </div>
  </div>`;

  return `
    <div class="page-head">
      <div>
        <h1>ภาพรวม</h1>
        <div class="desc">ภาพรวมสถานะทองตลอดสายการผลิต — แบ่ง 3 เลนตามกระบวนการจริง</div>
      </div>
      <button class="btn btn-primary" data-action="new-order">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        สร้าง Order
      </button>
    </div>

    <!-- SEARCH BAR -->
    <div class="dash-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input type="text" id="dashSearchInput" placeholder="ค้นหา RF No / ลูกค้า...">
      <button data-action="manual-search">ค้นหา</button>
    </div>

    <!-- 3-LANE KANBAN -->
    <div class="lane-wrap">

      <!-- LANE 1 -->
      <div class="lane">
        <div class="lane-strip lane1">
          <div class="lane-badge">1</div>
          <span class="lane-title">RF Node</span>
          <span class="lane-sub">NEW → หลอม → ทดสอบ % → TDC → หักทอง</span>
          <span class="lane-total">${l1Total} รายการ</span>
        </div>
        <div class="lane-cols">${rfNodeHtml || '<div class="lane-empty">ไม่มีรายการในเลนนี้</div>'}</div>
      </div>

      <!-- LANE 2 -->
      <div class="lane">
        <div class="lane-strip lane2">
          <div class="lane-badge">2</div>
          <span class="lane-title">Lot / Loss</span>
          <span class="lane-sub">จัดล็อต → ก่อนส่งรีด → หลังส่งรีด → สกัด → ก่อนส่งหลอม 99 → หลังส่งหลอม 99</span>
          <span class="lane-total">${l2Total} รายการ</span>
        </div>
        <div class="lane-cols">${lotLossHtml || '<div class="lane-empty">ไม่มีรายการในเลนนี้</div>'}</div>
      </div>

      <!-- LANE 3 -->
      <div class="lane">
        <div class="lane-strip lane3">
          <div class="lane-badge">3</div>
          <span class="lane-title">ปิดงาน</span>
          <span class="lane-sub">รายการที่ปิดงานแล้วในช่วง 30 วันล่าสุด</span>
          <span class="lane-total">${l3Total} รายการ</span>
        </div>
        <div class="lane-cols">${closedHtml}</div>
      </div>

    </div>
  `;
}
