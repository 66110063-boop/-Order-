const fs = require('fs');
let css = fs.readFileSync('d:/work/css/components.css', 'utf8');

// The replace_file_content tool just deleted a chunk of CSS! Let's restore it.
css = css.replace(
  /\.pill \{ padding: 10px 18px; border-radius: 20px; font-size: 16px; font-weight: 600; border: 1px solid var\(--border-strong\); color: var\(--text-secondary\); cursor: pointer; \}\n\.modal-sm/,
  `.pill { padding: 10px 18px; border-radius: 20px; font-size: 16px; font-weight: 600; border: 1px solid var(--border-strong); color: var(--text-secondary); cursor: pointer; }
.pill.active { background: var(--btn-primary); border-color: var(--btn-primary); color: var(--fg-on-dark); }

/* ============================================================
   MODALS
   ============================================================ */
.overlay {
  position: fixed; inset: 0; background: rgba(0,26,51,0.45); backdrop-filter: blur(2px);
  display: none; align-items: center; justify-content: center; z-index: 100; padding: 24px;
  pointer-events: none;
}
.overlay.active { display: flex; pointer-events: auto; }
.modal {
  background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
  width: 100%; max-height: 88vh; overflow: auto; animation: pop .16s var(--ease-out);
}
@keyframes pop { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: none; } }
.modal-sm`
);

if (!css.includes('.lane-grid')) {
  css += `\n
/* ============================================================
   DASHBOARD KANBAN GRID
   ============================================================ */
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
`;
}

fs.writeFileSync('d:/work/css/components.css', css, 'utf8');

// Ensure toast also doesn't block
let html = fs.readFileSync('d:/work/index.html', 'utf8');
if (!html.includes('pointer-events: none')) {
    html = html.replace('class="toast" id="toast"', 'class="toast" id="toast" style="pointer-events: none;"');
    fs.writeFileSync('d:/work/index.html', html, 'utf8');
}
