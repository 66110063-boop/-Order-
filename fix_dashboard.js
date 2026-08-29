const fs = require('fs');

let css = fs.readFileSync('d:/work/css/components.css', 'utf8');

// Fix overlay to explicitly ensure no pointer events when inactive (though display:none should do this, but just to be safe if a bug leaves it block but opacity 0)
css = css.replace(
  /\.overlay \{[\s\S]*?\n\}/,
  `.overlay {\n  position: fixed; inset: 0; background: rgba(0,26,51,0.45); backdrop-filter: blur(2px);\n  display: none; align-items: center; justify-content: center; z-index: 100; padding: 24px;\n  pointer-events: none;\n}`
);
css = css.replace(
  /\.overlay\.active \{ display: flex; \}/,
  `.overlay.active { display: flex; pointer-events: auto; }`
);

// Add the new grid layouts for lanes
if (!css.includes('.lane-grid')) {
  css += `\n/* Dashboard Grid Layouts */
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

let html = fs.readFileSync('d:/work/index.html', 'utf8');
// Fix toast pointer events just in case
if (!html.includes('pointer-events: none')) {
    html = html.replace('class="toast" id="toast"', 'class="toast" id="toast" style="pointer-events: none;"');
    fs.writeFileSync('d:/work/index.html', html, 'utf8');
}

let dash = fs.readFileSync('d:/work/js/views/dashboard.js', 'utf8');
// Replace lane-cols for Lane 1
dash = dash.replace(
  `<div class="lane-cols">\${rfNodeHtml`,
  `<div class="lane-grid grid-5">\${rfNodeHtml`
);
// Replace lane-cols for Lane 2
dash = dash.replace(
  `<div class="lane-cols">\${lotLossHtml`,
  `<div class="lane-grid grid-6">\${lotLossHtml`
);
fs.writeFileSync('d:/work/js/views/dashboard.js', dash, 'utf8');

console.log('Fixed dashboard layout and unclickable bug');
