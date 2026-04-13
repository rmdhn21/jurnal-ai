// ===== HSE EMERGENCY SPEED-DIAL LOGIC =====

const EMERGENCY_PROCEDURES = [
    {
        id: 'h2s',
        title: 'Paparan Gas H2S (Asam)',
        badge: 'Kritis - Fatal',
        actions: [
            'Segera tahan napas (Don\'t inhale).',
            'Cek arah angin (Windsock) dan bergerak ke arah Upwind/Crosswind.',
            'Cari area yang lebih tinggi (H2S lebih berat dari udara).',
            'Gunakan SCBA jika Anda terlatih untuk evakuasi korban.',
            'Lapor Radio: "MAYDAY MAYDAY - H2S LEAK".'
        ]
    },
    {
        id: 'electrical',
        title: 'Tersengat Listrik (Shock)',
        badge: 'Bahaya Tinggi',
        actions: [
            'JANGAN menyentuh korban dengan tangan kosong.',
            'Matikan sumber listrik (Panel/Breaker) segera.',
            'Gunakan benda non-konduktif (kayu/plastik) untuk memisahkan korban dari sumber.',
            'Cek napas dan nadi korban setelah terpisah.',
            'Lakukan CPR jika tidak ada napas/nadi.'
        ]
    },
    {
        id: 'injury',
        title: 'Luka/Pendarahan Hebat',
        badge: 'Pertolongan Pertama',
        actions: [
            'Tekan area luka (Direct Pressure) menggunakan kain bersih.',
            'Posisikan area luka lebih tinggi dari jantung korban.',
            'Gunakan Tourniquet hanya jika pendarahan tidak berhenti (tulis waktu pasang).',
            'Jaga suhu tubuh korban (selimuti) untuk cegah syok.',
            'Segera mobilisasi ke Klinik Rig.'
        ]
    },
    {
        id: 'fire',
        title: 'Kebakaran (Fire)',
        badge: 'Evakuasi',
        actions: [
            'Aktifkan Alarm Kebakaran terdekat.',
            'Gunakan APAR (Metode PASS) hanya jika api kecil.',
            'JANGAN gunakan air untuk api listrik atau minyak (Gunakan Powder/CO2).',
            'Segera menuju Muster Station melalui exit terdekat.',
            'Lakukan Headcount di tempat berkumpul.'
        ]
    }
];

/**
 * Open the Emergency Modal
 */
function openHSEEmergencyModal() {
    const modal = document.getElementById('emergency-modal');
    const list = document.getElementById('emergency-procedure-list');
    
    if (list) {
        list.innerHTML = EMERGENCY_PROCEDURES.map(proc => `
            <div class="emergency-item">
                <span class="emergency-badge">${proc.badge}</span>
                <h4>${proc.title}</h4>
                <ul class="emergency-action-list">
                    ${proc.actions.map(act => `<li>${act}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
    
    if (modal) modal.classList.remove('hidden');
}

/**
 * Close the Emergency Modal
 */
function closeHSEEmergencyModal() {
    const modal = document.getElementById('emergency-modal');
    if (modal) modal.classList.add('hidden');
}

// Global exposure
window.openHSEEmergencyModal = openHSEEmergencyModal;
window.closeHSEEmergencyModal = closeHSEEmergencyModal;
