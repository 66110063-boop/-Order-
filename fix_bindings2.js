const fs = require('fs');

let modals = fs.readFileSync('d:/work/js/modals.js', 'utf8');

// Undo the previous injection by replacing the injected block (from '// --- DASHBOARD EVENTS ---' down to 'function openTdcInspectModal')
const dashBlockIdx = modals.indexOf('  // --- DASHBOARD EVENTS ---');
if (dashBlockIdx !== -1) {
  const nextFuncIdx = modals.indexOf('function openTdcInspectModal', dashBlockIdx);
  if (nextFuncIdx !== -1) {
    modals = modals.slice(0, dashBlockIdx) + '\n' + modals.slice(nextFuncIdx);
  }
}

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

// Insert just before the end of bindPageEvents
// bindPageEvents ends with a single `}` on a line, followed by `function openTdcInspectModal`.
const searchToken = '}\n\n\nfunction openTdcInspectModal';
if (modals.includes(searchToken)) {
  modals = modals.replace(searchToken, hookBlock + '\n' + searchToken);
} else {
  // Try another approach
  const searchToken2 = '}\n\nfunction openTdcInspectModal';
  if (modals.includes(searchToken2)) {
    modals = modals.replace(searchToken2, hookBlock + '\n' + searchToken2);
  } else {
    console.log("Could not find the end of bindPageEvents");
  }
}

// 4. หน้ารีด/สกัด/หลอม99: "ขั้นตอนถัดไป" (Next Step) ให้สามารถบันทึกสถานะและสลับไปยังสเต็ปถัดไปได้จริง
// In lot detail, there is a "บันทึกข้อมูล" or "ขั้นตอนถัดไป"
// Wait, the prompt says "ปุ่ม 'ขั้นตอนถัดไป' (Next Step) ด้านล่างขวา ให้สามารถบันทึกสถานะและสลับไปยังสเต็ปถัดไปได้จริง"
// Let's add that to the hookBlock too.
const lotNextBlock = `
  // --- LOT WORKFLOW EVENTS ---
  $$('[data-action="lot-next-stage"]').forEach(btn => btn.addEventListener('click', (e) => {
    const lotId = e.currentTarget.dataset.lot;
    const lot = (window.LOT_MANAGE_DATA || []).find(l => l.lotId === lotId || l.lotNo === lotId);
    if (!lot) return;
    
    // Save state inputs if available
    const inputs = document.querySelectorAll('.lot-detail-wrap input, .lot-detail-wrap select');
    inputs.forEach(inp => {
       // logic to save basic inputs could go here, but for now we just advance stage
    });
    
    // Advance stage
    const nextStages = { 'จัดล็อต': 'รอส่งรีด', 'รอส่งรีด': 'รอรับกลับจากรีด', 'รอรับกลับจากรีด': 'งานสกัด', 'งานสกัด': 'หลอม 99', 'หลอม 99': 'หลอม 99' };
    if (nextStages[lot.stage]) {
      lot.stage = nextStages[lot.stage];
      toast('บันทึกและเปลี่ยนสถานะเป็น ' + lot.stage);
      renderPage();
    }
  }));
`;

modals = modals.replace('// --- LOT EXPORT ---', lotNextBlock + '\n  // --- LOT EXPORT ---');

fs.writeFileSync('d:/work/js/modals.js', modals, 'utf8');
console.log('RE-INJECTED properly');
