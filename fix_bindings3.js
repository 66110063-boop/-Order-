const fs = require('fs');

let modals = fs.readFileSync('d:/work/js/modals.js', 'utf8');

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
  
  $$('[data-action="new-order"]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    order = window.wfFreshOrder ? window.wfFreshOrder() : {};
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
    renderPage();
  }));
  
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

  // --- LOT WORKFLOW EVENTS ---
  $$('[data-action="lot-next-stage"]').forEach(btn => btn.addEventListener('click', (e) => {
    const lotId = e.currentTarget.dataset.lot;
    const lot = (window.LOT_MANAGE_DATA || []).find(l => l.lotId === lotId || l.lotNo === lotId);
    if (!lot) return;
    
    const nextStages = { 'จัดล็อต': 'รอส่งรีด', 'รอส่งรีด': 'รอรับกลับจากรีด', 'รอรับกลับจากรีด': 'งานสกัด', 'งานสกัด': 'หลอม 99', 'หลอม 99': 'หลอม 99' };
    if (nextStages[lot.stage]) {
      lot.stage = nextStages[lot.stage];
      toast('บันทึกและเปลี่ยนสถานะเป็น ' + lot.stage);
      renderPage();
    }
  }));
`;

modals = modals.replace('  bindModalEvents();\n}', hookBlock + '\n  bindModalEvents();\n}');

fs.writeFileSync('d:/work/js/modals.js', modals, 'utf8');
console.log('Injected inside bindPageEvents');
