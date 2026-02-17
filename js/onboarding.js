// ===== ONBOARDING TOUR MODULE =====

const TOUR_STEPS = [
    {
        target: null, // Center screen
        title: "Selamat Datang di Jurnal AI! 👋",
        text: "Hai! Saya akan memandu Anda mengenal fitur-fitur aplikasi ini dalam waktu singkat.",
        position: 'center'
    },
    {
        target: '#journal-input',
        title: "📝 Tulis & Refleksi",
        text: "Tulis apa saja di sini. AI akan memberikan respon, validasi, dan saran tindakan untuk Anda.",
        position: 'bottom'
    },
    {
        target: '#mic-btn',
        title: "🎤 Voice Input",
        text: "Malas ngetik? Gunakan fitur Voice Note untuk mencatat jurnal dengan suara.",
        position: 'bottom'
    },
    {
        target: '#nav-planner',
        title: "📅 Planner & Jadwal",
        text: "Atur To-Do List dan Jadwal Harian Anda di sini. Integrasikan saran AI langsung ke sini.",
        position: 'top'
    },
    {
        target: '#nav-finance',
        title: "💰 Keuangan & Budget",
        text: "Catat pemasukan, pengeluaran, dan atur budget harian/bulanan agar keuangan tetap sehat.",
        position: 'top'
    },
    {
        target: '#nav-habits',
        title: "🎯 Habits & Goals",
        text: "Bangun kebiasaan baik dan pantau progress tujuan jangka panjang Anda.",
        position: 'top'
    },
    {
        target: '#settings-btn',
        title: "⚙️ Pengaturan",
        text: "Atur tema, notifikasi, backup data, dan keamanan PIN di sini.",
        position: 'bottom'
    },
    {
        target: null,
        title: "🚀 Siap Dimulai?",
        text: "Itu saja! Selamat menggunakan Jurnal AI untuk produktivitas yang lebih baik.",
        position: 'center'
    }
];

let currentStepIndex = 0;

function initOnboarding() {
    const isCompleted = localStorage.getItem('onboarding_completed');
    if (!isCompleted) {
        // Delay slightly to ensure UI is ready
        setTimeout(startTour, 1500);
    }
}

function startTour() {
    // Create Overlay
    const overlay = document.createElement('div');
    overlay.id = 'tour-overlay';
    overlay.className = 'tour-overlay';
    document.body.appendChild(overlay);

    // Create Tooltip Container
    const tooltip = document.createElement('div');
    tooltip.id = 'tour-tooltip';
    tooltip.className = 'tour-tooltip card';
    document.body.appendChild(tooltip);

    showStep(0);
}

function showStep(index) {
    if (index < 0 || index >= TOUR_STEPS.length) {
        endTour();
        return;
    }

    currentStepIndex = index;
    const step = TOUR_STEPS[index];
    const overlay = document.getElementById('tour-overlay');
    const tooltip = document.getElementById('tour-tooltip');

    // Reset Highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
        el.style.zIndex = '';
        el.style.position = '';
    });

    // Highlight Target (if any)
    let targetEl = null;
    if (step.target) {
        targetEl = document.querySelector(step.target);
        if (targetEl) {
            targetEl.classList.add('tour-highlight');
            // Force verify z-index context (simplified)
            // Ideally we check computed style, but adding class is usually enough with CSS
        } else {
            // If target not found, fallback to center or skip
            console.warn('Tour target not found:', step.target);
        }
    }

    // Update Tooltip Content
    tooltip.innerHTML = `
        <h3>${step.title}</h3>
        <p>${step.text}</p>
        <div class="tour-actions">
            <button class="btn btn-secondary btn-small" onclick="skipTour()">Lewati</button>
            <div class="tour-nav">
                 ${index > 0 ? `<button class="btn btn-secondary btn-small" onclick="prevStep()">⬅️</button>` : ''}
                <button class="btn btn-primary btn-small" onclick="nextStep()">${index === TOUR_STEPS.length - 1 ? 'Selesai 🏁' : 'Lanjut ➡️'}</button>
            </div>
        </div>
        <div class="tour-progress">Langkah ${index + 1} dari ${TOUR_STEPS.length}</div>
    `;

    // Position Tooltip
    positionTooltip(tooltip, targetEl, step.position);
}

function positionTooltip(tooltip, targetEl, position) {
    // Reset positioning
    tooltip.style.top = 'auto';
    tooltip.style.left = 'auto';
    tooltip.style.right = 'auto';
    tooltip.style.bottom = 'auto';
    tooltip.style.transform = 'none';

    if (!targetEl || position === 'center') {
        // Center screen
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        return;
    }

    const rect = targetEl.getBoundingClientRect();
    const margin = 15;

    // Mobile adjustment: Always center-ish close to element if simple logic fails, 
    // but here is a basic implementation

    if (position === 'bottom') {
        tooltip.style.top = `${rect.bottom + margin}px`;
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
    } else if (position === 'top') {
        tooltip.style.bottom = `${window.innerHeight - rect.top + margin}px`;
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
    } else {
        // Fallback center
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }

    // Boundary checks (keep inside screen)
    // ... logic omitted for brevity, CSS max-width/margin usually handles safety
}

function nextStep() {
    showStep(currentStepIndex + 1);
}

function prevStep() {
    showStep(currentStepIndex - 1);
}

function skipTour() {
    endTour();
}

function endTour() {
    const overlay = document.getElementById('tour-overlay');
    const tooltip = document.getElementById('tour-tooltip');

    if (overlay) overlay.remove();
    if (tooltip) tooltip.remove();

    // Remove highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });

    localStorage.setItem('onboarding_completed', 'true');
}
