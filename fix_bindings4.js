const fs = require('fs');

let modals = fs.readFileSync('d:/work/js/modals.js', 'utf8');

// The faulty block
const badStr = `
  // --- LOT WORKFLOW EVENTS ---
  $$('[data-action="next-lot-stage"]').forEach(btn => btn.addEventListener('click', (e) => {
    const lotId = state.lotDetailId || (e.currentTarget.dataset && e.currentTarget.dataset.lot);
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

const goodStr = `
  // --- LOT WORKFLOW EVENTS ---
  $$('[data-action="next-lot-stage"]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const lotId = state.lotDetailId;
    let lotData = null;
    let currentStage = null;

    if (!lotId) return;

    // Find the lot across all stages
    for (const sKey in window.LOT_MANAGE_DATA) {
      const arr = window.LOT_MANAGE_DATA[sKey];
      const found = arr.find(x => x.lot === lotId);
      if (found) {
        lotData = found;
        currentStage = sKey;
        break;
      }
    }

    if (!lotData) return;
    
    const stageFlow = ['new', 'presend', 'postsend', 'extract', 'pre99', 'post99', 'closed'];
    const currIdx = stageFlow.indexOf(currentStage);
    if (currIdx >= 0 && currIdx < stageFlow.length - 1) {
      const nextStage = stageFlow[currIdx + 1];
      
      // Remove from current
      window.LOT_MANAGE_DATA[currentStage] = window.LOT_MANAGE_DATA[currentStage].filter(x => x.lot !== lotId);
      // Add to next
      window.LOT_MANAGE_DATA[nextStage] = window.LOT_MANAGE_DATA[nextStage] || [];
      window.LOT_MANAGE_DATA[nextStage].push(lotData);

      // Update state if needed
      state.lotDetailStage = nextStage;
      toast('บันทึกและเปลี่ยนสถานะไปขั้นถัดไปเรียบร้อยแล้ว');
      renderPage();
    } else {
      toast('สิ้นสุดกระบวนการแล้ว');
      state.lotDetailId = null;
      renderPage();
    }
  }));
`;

// It might be slightly different in the file right now since I did the powershell regex replace
// Let's just find the index of "// --- LOT WORKFLOW EVENTS ---" and replace till the end of the block.
const startIdx = modals.indexOf('  // --- LOT WORKFLOW EVENTS ---');
if (startIdx !== -1) {
  const endIdx = modals.indexOf('  bindModalEvents();', startIdx);
  if (endIdx !== -1) {
    modals = modals.slice(0, startIdx) + goodStr + '\n' + modals.slice(endIdx);
    fs.writeFileSync('d:/work/js/modals.js', modals, 'utf8');
    console.log("Fixed LOT WORKFLOW EVENTS");
  }
}

