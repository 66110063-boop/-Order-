/* ============================================================
   KGR GROUP — DASHBOARD & KANBAN VIEW
   ============================================================ */

function pageDashboard() {
  // Helper: render one lane column
  function laneCol(col) {
    return `<div class="lane-col">
      <div class="lane-col-head">
        <span>${esc(col.label)}</span>
        <span class="lc-count">${col.items.length}</span>
      </div>
      <div class="lane-col-body">
        ${col.items.length ? col.items.map(it => `
          <div class="kcard" data-detail="${esc(it.rf)}">
            <div class="rf">${esc(it.rf)}</div>
            <div class="cust">${esc(it.cust)}</div>
            ${it.lot ? `<div class="lot num">${esc(it.lot)}</div>` : ''}
            <div class="meta"><span>${esc(it.date)}</span><span class="w">${esc(it.w)} g</span></div>
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
  const closedSpecial = `<div class="lane-col" style="flex:0 0 250px;">
    <div class="lane-col-head"><span>ปิดงาน — 30 วันล่าสุด</span><span class="lc-count">${KANBAN_CLOSED.length}</span></div>
    <div class="lane-col-body">
      ${KANBAN_CLOSED.map(it => `
        <div class="kcard" data-detail="${esc(it.rf)}">
          <div class="rf">${esc(it.rf)}</div>
          <div class="cust">${esc(it.cust)}</div>
          ${it.lot ? `<div class="lot num">${esc(it.lot)}</div>` : ''}
          <div class="meta"><span>${esc(it.date)}</span><span class="w">${esc(it.w)} g</span></div>
        </div>`).join('')}
    </div>
  </div>`;
  const closedHtml = closedSpecial;

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
      <input type="text" placeholder="ค้นหา RF No / ลูกค้า...">
      <button data-action="manual-search">ค้นหา</button>
    </div>

    <!-- 3-LANE KANBAN -->
    <div class="lane-wrap">

      <!-- LANE 1 -->
      <div class="lane">
        <div class="lane-strip lane1">
          <div class="lane-badge">1</div>
          <span class="lane-title">RF Node</span>
          <span class="lane-sub">NEW → หลอม → ทดสอบ % → หักทอง → TDC</span>
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
