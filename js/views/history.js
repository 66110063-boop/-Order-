/* ============================================================
   KGR GROUP — EDIT HISTORY & AUDIT LOG VIEW
   ============================================================ */

function pageHistory() {
  const items = HISTORY.map((h, i) => `
    <div class="tl-item" data-history="${i}">
      <div class="tl-dot"></div>
      <div class="tl-card">
        <div class="tl-top">
          <div class="tl-who">
            <div class="avatar-chip" style="width:24px;height:24px;font-size:16px;">${esc(h.who.slice(0, 1))}</div>
            <div><span class="name">${esc(h.who)}</span><div class="cell-sub">${esc(h.target)}</div></div>
          </div>
          <span class="tl-when">${esc(h.when)}</span>
        </div>
        <div class="tl-desc">${esc(h.desc)}</div>
        <div class="tl-fields">${h.fields.map(f => `<span class="tl-field-chip">${esc(f)}</span>`).join('')}</div>
      </div>
    </div>`).join('');

  return `
    <div class="page-head">
      <div><h1>ประวัติการแก้ไข</h1><div class="desc">Timeline การเปลี่ยนแปลงข้อมูลทั้งระบบ เรียงจากใหม่ไปเก่า คลิกเพื่อดูตารางเปรียบเทียบ</div></div>
    </div>

    <div class="search-row" style="margin-bottom:20px;">
      <select style="max-width:180px;"><option>ทุกโมดูล</option><option>บัญชี / Invoice</option><option>Lot</option><option>ลูกค้า</option><option>Order</option></select>
      <input type="text" placeholder="ช่วงวันที่" style="max-width:180px;">
      <input type="text" placeholder="ค้นหาชื่อผู้แก้ไข" style="max-width:200px;">
      <button class="btn btn-secondary" data-action="manual-search">${iconSearch()} ค้นหา</button>
    </div>

    <div class="card card-pad">
      <div class="timeline">${items}</div>
    </div>
  `;
}

function historyDiffModal(i) {
  const h = HISTORY[i];
  return `
    <div class="modal modal-md">
      <div class="modal-head">
        <div>
          <h3>รายละเอียดการแก้ไข</h3>
          <div class="cell-sub" style="margin-top:3px;">${esc(h.target)} · โดย ${esc(h.who)} · ${esc(h.when)}</div>
        </div>
        <button class="modal-close" data-close-modal>${iconX()}</button>
      </div>
      <div class="modal-body">
        <table class="diff-table">
          <thead><tr><th>ฟิลด์</th><th>ค่าเดิม</th><th>ค่าที่แก้ไขใหม่</th></tr></thead>
          <tbody>
            ${h.diff.map(d => `
              <tr>
                <td class="diff-field">${esc(d.field)}</td>
                <td class="diff-old">${esc(d.old)}</td>
                <td class="diff-new">→ ${esc(d.neu)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close-modal>ปิด</button></div>
    </div>`;
}
