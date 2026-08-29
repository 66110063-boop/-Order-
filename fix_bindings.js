const fs = require('fs');
let dash = fs.readFileSync('d:/work/js/views/dashboard.js', 'utf8');

// 1. Rename kcard -> lane-card for clarity, and add search input ID.
dash = dash.replace(/class="kcard"/g, 'class="lane-card kcard"');
dash = dash.replace(/<input type="text" placeholder="ค้นหา RF No \/ ลูกค้า...">/g, '<input type="text" id="dashSearchInput" placeholder="ค้นหา RF No / ลูกค้า...">');

fs.writeFileSync('d:/work/js/views/dashboard.js', dash, 'utf8');

// 2. Add event bindings to bindPageEvents
let modals = fs.readFileSync('d:/work/js/modals.js', 'utf8');

// Insert bindings at the very end of bindPageEvents
// bindPageEvents ends around line 1020, let's find the end of it.
// We can just find the exportTdcToExcel block which is inside bindPageEvents, and insert our logic right after it.
// Actually, it's safer to just insert our block right before `function openTdcInspectModal`
const hookBlock = `
  // --- DASHBOARD EVENTS ---
  const dashSearch = $('#dashSearchInput');
  if (dashSearch) {
    dashSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      $$('.lane-card').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
      // Update counts
      $$('.lane-col').forEach(col => {
        const visible = Array.from(col.querySelectorAll('.lane-card')).filter(c => c.style.display !== 'none').length;
        const countEl = col.querySelector('.lc-count');
        if (countEl) countEl.innerText = visible;
      });
    });
  }

  $$('.lane-card').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    const rf = el.dataset.detail;
    state.rfSummaryTarget = rf;
    state.page = 'rf-summary';
    renderPage();
  }));
  
  // Make sure new-order triggers modal creation or workflow creation
  $$('[data-action="new-order"]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    order = wfFreshOrder();
    state.wfCurrent = 1; state.wfMaxUnlocked = 1; state.wfStepperLimit = 4; state.wfStepperRange = null;
    state.page = 'workflow';
    renderPage();
  }));

  // --- ORDERS TAB EVENTS ---
  $$('.tabs .tab').forEach(tab => tab.addEventListener('click', (e) => {
    if (state.page !== 'orders') return;
    const tabKey = e.currentTarget.dataset.tab;
    if (tabKey) {
      state.orderTab = tabKey;
      renderPage();
    }
  }));

  // --- LOTS EVENTS ---
  $$('[data-action="open-lot-type"]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    state.lotAllocateType = el.dataset.type;
    renderPage(); // this handles lot allocate type dive-in
  }));
  // Add support for clicking the whole lot card
  $$('.lot-type-card').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = el.querySelector('[data-action="open-lot-type"]');
    if (btn) {
      state.lotAllocateType = btn.dataset.type;
      renderPage();
    }
  }));

  // --- LOT EXPORT ---
  $$('[data-action="export-lot-excel"]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const lotId = e.currentTarget.dataset.lot;
    if (typeof window.exportLotReportToExcel === 'function') {
      window.exportLotReportToExcel(lotId);
    }
  }));

`;

if (!modals.includes('// --- DASHBOARD EVENTS ---')) {
  // Find a good place to insert inside bindPageEvents
  // Let's replace `function openTdcInspectModal` with `hookBlock + '\nfunction openTdcInspectModal'`
  // WAIT, openTdcInspectModal is outside bindPageEvents!
  // It's better to inject it right before the last closing brace of bindPageEvents.
  // In our earlier view, `bindPageEvents` ends somewhere around line 1020, before `function openTdcInspectModal`.
  modals = modals.replace('function openTdcInspectModal', hookBlock + '\nfunction openTdcInspectModal');
}

fs.writeFileSync('d:/work/js/modals.js', modals, 'utf8');

console.log("REPLACED dashboard and modal bindings");
