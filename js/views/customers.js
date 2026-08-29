/* ============================================================
   KGR GROUP — CUSTOMERS MANAGEMENT VIEW
   ============================================================ */

function pageCustomers() {
  const list = state.custShowTrash ? CUSTOMERS_TRASH : CUSTOMERS;
  const rows = list.map((c, i) => state.custShowTrash ? `
    <tr>
      <td class="cell-primary">${esc(c.name)}</td>
      <td class="num" style="text-align:left; font-family:inherit;">${esc(c.phone)}</td>
      <td class="num" style="text-align:left;">${c.taxId || c.idCard || '-'}</td>
      <td>${esc(c.date)}</td>
      <td><span class="cell-sub">ลบโดย ${esc(c.deletedBy)}<br>${esc(c.deletedAt)}</span></td>
      <td class="right"><button class="btn btn-secondary btn-sm" data-action="restore-customer" data-idx="${i}">${iconRestore()} กู้คืน</button></td>
    </tr>` : `
    <tr>
      <td class="cell-primary">${esc(c.name)}</td>
      <td class="num" style="text-align:left; font-family:inherit;">${esc(c.phone)}</td>
      <td class="num" style="text-align:left;">${c.taxId || c.idCard || '-'}</td>
      <td class="num">${c.orders}</td>
      <td>${esc(c.date)}</td>
      <td class="right">
        <div class="table-actions">
          <button class="icon-btn" title="แก้ไข" data-action="edit-customer" data-idx="${i}">${iconEdit()}</button>
          <button class="icon-btn" title="ลบ (ย้ายถังขยะ)" data-action="delete-customer" data-idx="${i}">${iconTrash()}</button>
        </div>
      </td>
    </tr>`).join('');

  const headCols = state.custShowTrash
    ? `<th>ชื่อลูกค้า</th><th>เบอร์โทร</th><th>เลขประจำตัวผู้เสียภาษี / บัตรประชาชน</th><th>วันที่สร้าง</th><th>ข้อมูลการลบ</th><th class="right">จัดการ</th>`
    : `<th>ชื่อลูกค้า</th><th>เบอร์โทร</th><th>เลขประจำตัวผู้เสียภาษี / บัตรประชาชน</th><th class="num">จำนวน order</th><th>วันที่สร้าง</th><th class="right">จัดการ</th>`;

  return `
    <div class="page-head">
      <div><h1>จัดการลูกค้า</h1><div class="desc">ข้อมูลลูกค้าทั้งหมดในระบบ พร้อมประวัติการสั่งงาน</div></div>
      <button class="btn btn-primary" data-action="add-customer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        เพิ่มลูกค้า
      </button>
    </div>

    <div class="search-row" style="justify-content:space-between; margin-bottom:16px;">
      <div class="search-row">
        <input type="text" placeholder="ค้นหาชื่อหรือเบอร์โทรลูกค้า">
        <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
      </div>
      <div class="trash-toggle" data-action="toggle-trash">
        <div class="switch ${state.custShowTrash ? 'on' : ''}"></div>
        <span>แสดงรายการที่ลบแล้ว (Soft Delete) ${CUSTOMERS_TRASH.length ? `· ${CUSTOMERS_TRASH.length} รายการ` : ''}</span>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr>${headCols}</tr></thead>
        <tbody>${rows || `<tr class="empty-row"><td colspan="5">ไม่มีรายการ</td></tr>`}</tbody>
      </table>
      <div class="table-foot"><span>ทั้งหมด ${list.length} รายการ</span><div class="pager"><button>‹</button><button class="active">1</button><button>›</button></div></div>
    </div>
  `;
}
