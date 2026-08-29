/* ============================================================
   KGR GROUP — USER MANAGEMENT & REPORT VIEWS
   ============================================================ */

function pageUsers() {
  const rows = USERS.map((u, i) => `
    <tr>
      <td class="cell-primary">${esc(u.name)}</td>
      <td>${esc(u.email)}</td>
      <td><span class="badge badge-info">${esc(u.role)}</span></td>
      <td><span class="badge badge-done">ใช้งาน</span></td>
      <td class="right">
        <div class="table-actions">
          <button class="icon-btn" title="ดู" data-action="view-user" data-idx="${i}">${iconEye()}</button>
          <button class="icon-btn" title="แก้ไข" data-action="edit-user" data-idx="${i}">${iconEdit()}</button>
          <button class="icon-btn" title="ลบ (ย้ายถังขยะ)" data-action="delete-user" data-idx="${i}">${iconTrash()}</button>
        </div>
      </td>
    </tr>`).join('');

  return `
    <div class="page-head">
      <div><h1>จัดการผู้ใช้งาน</h1><div class="desc">กำหนดสิทธิ์การใช้งานตามบทบาทหน้าที่</div></div>
      <button class="btn btn-primary" data-action="add-user">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        เพิ่มผู้ใช้งาน
      </button>
    </div>

    <div class="search-row" style="justify-content:space-between; margin-bottom:16px;">
      <div class="search-row">
        <input type="text" placeholder="ค้นหาชื่อหรือชื่อผู้ใช้งาน">
        <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
      </div>
      <div class="trash-toggle" data-action="toggle-user-trash"><div class="switch"></div><span>แสดงรายการที่ลบแล้ว (Soft Delete)</span></div>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>ชื่อ-นามสกุล</th><th>ชื่อผู้ใช้งาน</th><th>สิทธิ์การใช้งาน</th><th>สถานะ</th><th class="right">จัดการ</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="table-foot"><span>ทั้งหมด ${USERS.length} รายการ</span><div class="pager"><button>‹</button><button class="active">1</button><button>›</button></div></div>
    </div>
  `;
}

