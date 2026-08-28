/* ============================================================
   KGR GROUP — CORE UTILITIES & HELPERS
   ============================================================ */

/* DOM Query Selectors */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* HTML Escaping */
const esc = s => (s === undefined || s === null) ? '' : String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

/* Number Formatting & Calculation Helpers */
function wfNum(v) { 
  const n = parseFloat(String(v).replace(/,/g, '')); 
  return Number.isFinite(n) ? n : 0; 
}

function wfRound2(v) { 
  if (!Number.isFinite(v)) return 0; 
  return Math.round((v + Number.EPSILON) * 100) / 100; 
}

function wfSafeDiv(a, b) { 
  if (!b) return 0; 
  const r = a / b; 
  return Number.isFinite(r) ? r : 0; 
}

function wfFmt(v) { 
  return Number.isFinite(v) ? v.toFixed(2) : '0.00'; 
}

function todayStr() {
  const d = new Date();
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + (d.getFullYear() + 543);
}

function wfIsValidRfNo(rf) {
  return /^RF-2569-\d{4}$/.test(String(rf || '').trim());
}

function wfParseThaiDate(str) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(str || '').trim());
  if (!m) return null;
  return parseInt(m[3], 10) * 10000 + parseInt(m[2], 10) * 100 + parseInt(m[1], 10);
}

function wfIsFutureDate(str) {
  const d = wfParseThaiDate(str), t = wfParseThaiDate(todayStr());
  if (d == null || t == null) return false;
  return d > t;
}

/* Toast Notifications */
function toast(msg) {
  let container = $('#toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = 'toast show';
  el.innerHTML = `${iconCheck()} <span>${esc(msg)}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 2400);
}

/* CSV Export */
function exportCSV(filename, headers, rows) {
  const content = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* Searchable Combobox Select Handler */
function initSearchableSelect(inputEl, hiddenEl, menuEl, options, onSelect) {
  if (!inputEl || !hiddenEl || !menuEl) return;
  function renderMenu(filter = '') {
    const matched = options.filter(o => o.toLowerCase().includes(filter.toLowerCase()));
    if (matched.length === 0) {
      menuEl.innerHTML = `<div class="ss-empty">ไม่พบข้อมูล</div>`;
    } else {
      menuEl.innerHTML = matched.map(o => `
        <div class="ss-option" data-value="${esc(o)}">${esc(o)}</div>
      `).join('');
    }
    menuEl.style.display = 'block';
  }

  inputEl.addEventListener('focus', () => renderMenu(inputEl.value));
  inputEl.addEventListener('input', () => renderMenu(inputEl.value));

  menuEl.addEventListener('click', (e) => {
    const opt = e.target.closest('.ss-option');
    if (!opt) return;
    const val = opt.dataset.value;
    inputEl.value = val;
    hiddenEl.value = val;
    menuEl.style.display = 'none';
    if (onSelect) onSelect(val);
  });

  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !menuEl.contains(e.target)) {
      menuEl.style.display = 'none';
    }
  });
}

/* SVG Icon Helper Functions */
const iconX = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const iconPlus = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const iconSearch = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const iconChevronRight = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const iconCheck = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const iconTrash = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
const iconLock = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
const iconEdit = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const iconPrint = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;
const iconEye = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const iconDoc = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
const iconChart = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
const iconDownload = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const iconBar = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="6" y1="7" x2="6" y2="17"/></svg>`;
const iconPellet = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>`;
const iconArrowLeft = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
const iconClock = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const iconSave = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`;
