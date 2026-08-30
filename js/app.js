/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
/* ============================================================
   KGR GROUP — APPLICATION ENTRY POINT & ROUTER
   ============================================================ */

/* Page Router */
function renderPage() {
  const c = $('#content');
  if (!c) return;
  const builders = {
    dashboard: pageDashboard,
    orders: pageOrders,
    'lot-allocate': pageLotAllocate,
    'lot-manage': pageLotManage,
    customers: pageCustomers,
    stock: pageStock,
    accounting: pageAccounting,
    history: pageHistory,
    users: pageUsers,
    'invoice-edit': pageInvoiceEdit,
    'invoice-general-edit': pageInvoiceGeneralEdit,
    'tdc-approve': pageTdcApprove,
    workflow: pageWorkflow,
    'rf-summary': () => pageRfSummary(state.rfSummaryTarget),
  };
  try {
    c.innerHTML = builders[state.page] ? builders[state.page]() : '<div>ไม่พบหน้า</div>';
  } catch (err) {
    console.error('Error rendering page:', state.page, err);
    c.innerHTML = `<div style="padding: 24px; color: #e11d48; text-align: center;"><h2>เกิดข้อผิดพลาด (Render Error)</h2><p>${err.message}</p></div>`;
  }
  
  try {
    if (typeof bindPageEvents === 'function') bindPageEvents();
    
    // Trigger Namespace initEvents
    const ns = {
      dashboard: window.DashboardView,
      orders: window.OrdersView,
      'lot-allocate': window.LotsView,
      'lot-manage': window.LotsView
    };
    if (ns[state.page] && typeof ns[state.page].initEvents === 'function') {
      ns[state.page].initEvents();
    }
  } catch(err) {
    console.error('Error binding events for page:', state.page, err);
  }

  if (state.page === 'workflow') {
    wfRefresh();
    const btnBack = $('[data-action="wf-back"]');
    if (btnBack) btnBack.addEventListener('click', () => { wfSyncAll(); goPage('orders'); });
  }
}

/* Sidebar navigation renderer */
function renderSidebar() {
  const groups = {};
  NAV.forEach(n => { (groups[n.group] = groups[n.group] || []).push(n); });
  let html = '';
  Object.keys(groups).forEach(g => {
    html += `<div class="sidebar-section-label">${esc(g)}</div>`;
    groups[g].forEach(n => {
      const isActive = state.page === n.key || (state.page === 'invoice-edit' && n.key === 'accounting');
      const count = n.key === 'tdc-approve' ? ORDERS.filter(o => !o.cancelled && o.percentApprovalStatus === 'pending').length : (n.key === 'lot-allocate' ? (typeof LOT_ALLOCATE !== 'undefined' ? LOT_ALLOCATE.length : 0) : n.count);
      html += `<div class="nav-item ${isActive ? 'active' : ''}" data-nav="${n.key}">
        ${ICONS[n.key] || ''}<span>${esc(n.label)}</span>
        ${count ? `<span class="badge-count">${count}</span>` : ''}
      </div>`;
    });
  });
  const sidebarNav = $('#sidebarNav');
  if (sidebarNav) {
    sidebarNav.innerHTML = html;
    $$('.nav-item', sidebarNav).forEach(el => el.addEventListener('click', () => { goPage(el.dataset.nav); }));
  }
}

function goPage(key) {
  state.page = key;
  if (key === 'lot-allocate') state.lotAllocateView = null;
  if (key === 'tdc-approve') state.tdcDetailId = null;
  renderSidebar();
  renderBreadcrumb();
  renderPage();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function openLotAllocateView(type) {
  state.page = 'lot-allocate';
  state.lotAllocateView = type;
  state.lotAllocateChecked = [];
  renderSidebar();
  renderBreadcrumb();
  renderPage();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderBreadcrumb() {
  const breadcrumbEl = $('#breadcrumb');
  if (!breadcrumbEl) return;
  if (state.page === 'invoice-edit') {
    const mode = state.invoiceMode === 'new' ? 'สร้าง Invoice ใหม่' : `แก้ไข Invoice · ${esc(state.invoiceNo || '')}`;
    breadcrumbEl.innerHTML = `<span>ระบบจัดการ Order ทอง</span><span>›</span><span data-go="accounting" style="cursor:pointer;">บัญชี</span><span>›</span><b>${esc(mode)}</b>`;
    return;
  }
  if (state.page === 'lot-manage' && state.lotDetailId) {
    breadcrumbEl.innerHTML = `<span>ระบบจัดการ Order ทอง</span><span>›</span><span data-go="lot-manage" style="cursor:pointer;">รีด/สกัด/หลอม99</span><span>›</span><b>${esc(state.lotDetailId)}</b>`;
    return;
  }
  if (state.page === 'tdc-approve' && state.tdcDetailId) {
    breadcrumbEl.innerHTML = `<span>ระบบจัดการ Order ทอง</span><span>›</span><span data-go="tdc-approve" style="cursor:pointer;">TDC Approve</span><span>›</span><b>${esc(state.tdcDetailId)}</b>`;
    return;
  }
  if (state.page === 'lot-allocate' && state.lotAllocateView) {
    const typeLabel = state.lotAllocateView === 'bar' ? 'แบบแท่ง' : 'แบบเม็ด';
    breadcrumbEl.innerHTML = `<span>ระบบจัดการ Order ทอง</span><span>›</span><span data-go="lot-allocate" style="cursor:pointer;">การจัดล็อต</span><span>›</span><b>${esc(typeLabel)}</b>`;
    return;
  }
  if (state.page === 'workflow') {
    const st = WF_STATIONS.find(s => s.n === state.wfCurrent);
    breadcrumbEl.innerHTML = `<span>ระบบจัดการ Order ทอง</span><span>›</span><span data-go="orders" style="cursor:pointer;">รายการสั่งซื้อ</span><span>›</span><b>${esc(order.rfNo)} — ${esc(st ? st.label : '')}</b>`;
    return;
  }
  if (state.page === 'rf-summary') {
    breadcrumbEl.innerHTML = `<span>ระบบจัดการ Order ทอง</span><span>›</span><span data-go="lot-allocate" style="cursor:pointer;">การจัดล็อต</span><span>›</span><b>${esc(state.rfSummaryTarget || '')}</b>`;
    return;
  }
  const n = NAV.find(x => x.key === state.page);
  breadcrumbEl.innerHTML = `<span>ระบบจัดการ Order ทอง</span><span>›</span><b>${esc(n ? n.label : '')}</b>`;
}

/* Numeric-only input lock for all weight/number fields (.num-input) */
function wfNumericKeyGuard(e) {
  const navKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
  if (navKeys.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey) return;
  if (e.key === '.') {
    if (e.target.value.includes('.')) e.preventDefault();
    return;
  }
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

document.addEventListener('keydown', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('num-input')) wfNumericKeyGuard(e);
});

document.addEventListener('input', (e) => {
  const el = e.target;
  if (!(el && el.classList && el.classList.contains('num-input'))) return;
  let v = el.value.replace(/[^0-9.]/g, '');
  const firstDot = v.indexOf('.');
  if (firstDot !== -1) v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
  if (v !== el.value) {
    const pos = el.selectionStart - (el.value.length - v.length);
    el.value = v;
    try { el.setSelectionRange(pos, pos); } catch (_) { }
  }
});

/* Auto-apply inputmode="decimal" to every .num-input */
(function () {
  function applyDecimalMode(root) {
    (root.querySelectorAll ? root : document).querySelectorAll('.num-input:not([inputmode])').forEach(el => {
      el.setAttribute('inputmode', 'decimal');
    });
  }
  applyDecimalMode(document);
  new MutationObserver(() => applyDecimalMode(document)).observe(document.body, { childList: true, subtree: true });
})();

/* Enter key navigation between form inputs */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const el = e.target;
  const tag = el.tagName;
  if (tag !== 'INPUT' && tag !== 'SELECT') return;
  if (tag === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) return;
  e.preventDefault();
  const container = el.closest('.modal, .content, body') || document.body;
  const focusable = Array.from(container.querySelectorAll(
    'input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
  )).filter(f => f.offsetParent !== null);
  const idx = focusable.indexOf(el);
  if (idx > -1 && idx < focusable.length - 1) {
    focusable[idx + 1].focus();
    if (focusable[idx + 1].select) { try { focusable[idx + 1].select(); } catch (_) { } }
  }
});

/* Mobile sidebar drawer toggle */
(function () {
  const btn = document.getElementById('menuToggle');
  const sidebar = document.getElementById('appSidebar');
  const scrim = document.getElementById('sidebarScrim');
  if (!btn || !sidebar || !scrim) return;
  function closeDrawer() {
    sidebar.classList.remove('open');
    scrim.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function openDrawer() {
    sidebar.classList.add('open');
    scrim.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
  btn.addEventListener('click', () => sidebar.classList.contains('open') ? closeDrawer() : openDrawer());
  scrim.addEventListener('click', closeDrawer);
  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('.nav-item') && window.matchMedia('(max-width:768px)').matches) closeDrawer();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeDrawer(); });
})();

/* Boot App */
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderBreadcrumb();
  renderPage();
});
