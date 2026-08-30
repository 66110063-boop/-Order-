const { execSync } = require('child_process');
try {
  execSync('git checkout js/workflow/stations.js', { cwd: 'd:/work' });
  console.log('Restored stations.js');
} catch (e) {
  console.log('Error restoring:', e.message);
}
