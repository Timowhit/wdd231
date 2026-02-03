// ==================== CLOCK ====================
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('lblTime').innerText = timeString;
}

setInterval(updateClock, 1000);
updateClock();
    
// ========== Set dynamic year in footer =========
// document.getElementById('currentYear').textContent = `© ${new Date().getFullYear()} Magna Steyr Mesa. All rights reserved.`;

// Identify if configured dark mode preference and set theme accordingly
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Helper to parse numbers from text (handles %, commas, 'm', etc.)
function toNumber(text) {
    if (text == null) return NaN;
    const cleaned = String(text).replace(/[^0-9.-]/g, ''); // keep digits, dot, minus
    return cleaned ? parseFloat(cleaned) : NaN;
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
    .forEach(el => el.classList.remove('good', 'bad'));

    // Parse values (handles %, commas, and 'm', etc.)
    const kpi1 = toNumber(kpi1Element.textContent);
    const kpi2 = toNumber(kpi2Element.textContent);
    const kpi3 = toNumber(kpi3Element.textContent);
    const kpi4 = toNumber(kpi4Element.textContent);

    if ([kpi1, kpi2, kpi3, kpi4].some(Number.isNaN)) {
        console.warn('Invalid KPI number detected', { kpi1, kpi2, kpi3, kpi4 });
        return;
    }

    // KPI2: good if kpi2 <= kpi1
    kpi2Element.classList.add(kpi1 <= kpi2 ? 'good' : 'bad');

    // KPI3: good if >= 85
    kpi3Element.classList.add(kpi3 >= 85 ? 'good' : 'bad');

    // KPI4: good if <= 80
    kpi4Element.classList.add(kpi4 <= 80 ? 'good' : 'bad');
}

// Run once the DOM is ready
document.addEventListener('DOMContentLoaded', updateKPIColors);
