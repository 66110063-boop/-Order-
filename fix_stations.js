const fs = require('fs');
let c = fs.readFileSync('d:/work/js/workflow/stations.js', 'utf8');

const brokenChunk = `        <div class="field">
  if (btn) btn.addEventListener('click', () => {`;

if (c.includes(brokenChunk)) {
  console.log("Found broken chunk");
} else {
  console.log("Didn't find broken chunk exactly, I'll search for it");
}
