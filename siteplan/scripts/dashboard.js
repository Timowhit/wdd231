// ===============================================
// ==================== CLOCK ====================
// ===============================================
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('lblTime').innerText = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// ===============================================
// ========== Set dynamic year in footer =========
// ===============================================
// document.getElementById('currentYear').textContent = `© ${new Date().getFullYear()} Magna Steyr Mesa. All rights reserved.`;

// ================================================
// ========= Identify dark mode preference ========
// ================================================
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// ===============================================
// ============ KPI Color Logic ==================
// ===============================================
// Helper to parse numbers from text (handles %, commas, 'm', etc.)
function toNumber(text) {
    if (text == null) return NaN;
    const cleaned = String(text).replace(/[^0-9.-]/g, ''); // keep digits, dot, minus
    return cleaned ? parseFloat(cleaned) : NaN;
}

// Calculate shift progress for colors (6:00 AM to 2:30 PM)
function getShiftProgress() {
    const now = new Date();

    const shiftStart = new Date();
    shiftStart.setHours(6, 0, 0, 0);

    const shiftEnd = new Date();
    shiftEnd.setHours(14, 30, 0, 0);

    const elapsed = now - shiftStart;
     const total = shiftEnd - shiftStart;

     // clamp between 0 and 1 so it doesn’t go negative or >100%
    return Math.min(Math.max(elapsed / total, 0), 1);
}

// Dynamic Cell colors set via JavaScriptfunction 
function getAgeState(age) {
  return age < 45 ? 'good' : age < 60 ? 'warning' : 'bad';
}

function updateCellColors() {
  document.querySelectorAll('.age').forEach(ageEl => {
    const age = toNumber(ageEl.textContent);
    const cell = ageEl.closest('.cell');

    if (!cell || Number.isNaN(age)) return;

    const newState = getAgeState(age);
    const oldState = cell.dataset.state;

    // reset classes
    cell.classList.remove('good', 'warning', 'bad');

    // apply new state
    cell.classList.add(newState);

    // pulse ONLY when crossing a boundary
    if (oldState && oldState !== newState) {
      cell.classList.remove('pulse');
      void cell.offsetWidth; // force reflow so animation restarts
      cell.classList.add('pulse');
    }

    // store current state
    cell.dataset.state = newState;
  });
}

// Dynamic KPI colors set via JavaScriptfunction 
function updateKPIColors() {
    const kpi1Element = document.getElementById('kpi1');
    const kpi2Element = document.getElementById('kpi2');
    const kpi3Element = document.getElementById('kpi3');
    const kpi4Element = document.getElementById('kpi4');

    // Ensure all elements exist
    if (!kpi1Element || !kpi2Element || !kpi3Element || !kpi4Element) {
        console.warn('One or more KPI elements not found.');
        return;
    }

    // Clear prior state
    [kpi1Element, kpi2Element, kpi3Element, kpi4Element]
    .forEach(el => el.classList.remove('good', 'warning', 'bad'));

    // Parse values (handles %, commas, and 'm', etc.)
    const kpi1 = toNumber(kpi1Element.textContent);
    const kpi2 = toNumber(kpi2Element.textContent);
    const kpi3 = toNumber(kpi3Element.textContent);
    const kpi4 = toNumber(kpi4Element.textContent);

    const shiftProgress = getShiftProgress();
    const expectedKpi = shiftProgress * kpi1;

    if ([kpi1, kpi2, kpi3, kpi4].some(Number.isNaN)) {
        console.warn('Invalid KPI number detected', { kpi1, kpi2, kpi3, kpi4 });
        return;
    }

    // KPI2: good if kpi2 <= kpi1
    kpi2Element.classList.add(expectedKpi <= kpi2 ? 'good' : expectedKpi * 0.85 <= kpi2 ? 'warning' : 'bad');

    // KPI3: good if >= 85
    kpi3Element.classList.add(kpi3 >= 85 ? 'good' : kpi3 >= 70 ? 'warning' : 'bad');

    // KPI4: good if <= 80
    kpi4Element.classList.add(kpi4 <= 80 ? 'good' : kpi4 <= 90 ? 'warning' : 'bad');
}

// Run once the DOM is ready
document.addEventListener('DOMContentLoaded', updateKPIColors);
// Run once the DOM is ready
document.addEventListener('DOMContentLoaded', updateCellColors);
