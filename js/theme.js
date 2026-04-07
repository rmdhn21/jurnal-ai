// ===== THEME MODULE =====
function initTheme() {
    // 1. Light/Dark Theme
    const savedTheme = localStorage.getItem('jurnal_ai_theme') || 'dark';
    setTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }

    // 2. Color Theme
    const savedColor = localStorage.getItem('jurnal_ai_color_theme') || 'gold';
    setColorTheme(savedColor);

    // Color Picker Listeners
    setupColorPicker();
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jurnal_ai_theme', theme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('jurnal_ai_theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setColorTheme(color) {
    document.documentElement.setAttribute('data-color', color);
    localStorage.setItem('jurnal_ai_color_theme', color);

    // Update active state in picker
    document.querySelectorAll('.color-option').forEach(btn => {
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupColorPicker() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            setColorTheme(color);
        });
    });
}

