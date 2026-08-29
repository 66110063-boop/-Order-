const fs = require('fs');
let css = fs.readFileSync('d:/work/css/components.css', 'utf8');

// The last replace_file_content failed and deleted lines 408 to 433.
// Let's restore and fix.
css = css.replace(
  /\.lane1 \.lane-badge \{ background: var\(--btn-primary\); \}\n  border-bottom: 1px solid var\(--border\);/,
  `.lane1 .lane-badge { background: var(--btn-primary); }
.lane2 .lane-badge { background: var(--lane2-badge); }
.lane3 .lane-badge { background: var(--st-done-fg); }
.lane-title { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
.lane-sub { font-size: 16px; color: var(--text-secondary); margin-left: 4px; line-height: 1.3; }
.lane-total {
  margin-left: auto; font-size: 16px; font-weight: 700; font-family: var(--font-mono);
  color: var(--text-secondary); white-space: nowrap; line-height: 1.3; padding: 2px 0;
}
.lane-cols { 
  display: flex; flex-wrap: nowrap; gap: 18px; overflow-x: auto; 
  padding-bottom: 12px; padding-left: 2px; padding-right: 2px; padding-top: 2px; 
}
.lane-cols::-webkit-scrollbar { height: 6px; }
.lane-cols::-webkit-scrollbar-track { background: #E2E8F0; border-radius: 4px; }
.lane-cols::-webkit-scrollbar-thumb { background: #94A3B8; border-radius: 4px; }

.lane-grid {
  display: grid; width: 100%; box-sizing: border-box; gap: 12px;
  padding-bottom: 12px; padding-left: 2px; padding-right: 2px; padding-top: 2px;
}
.lane-grid.grid-5 { grid-template-columns: repeat(5, 1fr); }
.lane-grid.grid-6 { grid-template-columns: repeat(6, 1fr); }
.lane-grid .lane-col {
  width: 100% !important; min-width: 0 !important; flex: auto !important;
}
.kcard { cursor: pointer; }

.lane-col {
  flex: 0 0 300px; width: 300px; min-width: 300px; background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-md); display: flex; flex-direction: column;
  box-shadow: var(--shadow-sm);
}
.lane-col-head {
  padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border);`
);

fs.writeFileSync('d:/work/css/components.css', css, 'utf8');
