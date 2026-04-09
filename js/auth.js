// ===== LOGIN MODULE =====
function getUsers() {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : {};
}

function saveUser(username, passwordHash) {
    const users = getUsers();
    users[username] = { passwordHash, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getSession() {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
}

function saveSession(username) {
    const session = { username, loginAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'jurnal_ai_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function initLoginUI() {
    const addListener = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, handler);
        }
    };

    // Toggle forms
    addListener('show-register-btn', 'click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    });

    addListener('show-login-btn', 'click', () => {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    // Login
    addListener('login-btn', 'click', handleLogin);

    const loginPass = document.getElementById('login-password');
    if (loginPass) {
        loginPass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    // Register
    addListener('register-btn', 'click', handleRegister);

    // Logout
    addListener('logout-btn', 'click', handleLogout);

    // Cloud Login
    addListener('cloud-login-btn', 'click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('cloud-login-form').classList.remove('hidden');
    });

    addListener('back-to-local-btn', 'click', () => {
        document.getElementById('cloud-login-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    addListener('cloud-signin-btn', 'click', handleCloudSignIn);
    addListener('cloud-signup-btn', 'click', handleCloudSignUp);
}

async function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('Masukkan username dan password!');
        return;
    }

    const users = getUsers();
    const user = users[username];

    if (!user) {
        alert('Username tidak ditemukan. Silakan daftar dulu.');
        return;
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
        alert('Password salah!');
        return;
    }

    saveSession(username);
    showMainApp();
}

async function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;

    if (!username || !password) {
        alert('Masukkan username dan password!');
        return;
    }

    if (username.length < 3) {
        alert('Username minimal 3 karakter!');
        return;
    }

    if (password.length < 4) {
        alert('Password minimal 4 karakter!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Password tidak cocok!');
        return;
    }

    const users = getUsers();
    if (users[username]) {
        alert('Username sudah dipakai!');
        return;
    }

    const passwordHash = await hashPassword(password);
    saveUser(username, passwordHash);
    saveSession(username);

    alert('✅ Akun berhasil dibuat!');
    showMainApp();
}

function handleLogout() {
    if (confirm('Yakin mau logout?')) {
        clearSession();
        disableCloudSync();

        if (supabaseClient) {
            supabaseClient.auth.signOut();
        }

        location.reload();
    }
}

// ===== CLOUD AUTH HANDLERS =====
async function handleCloudSignIn() {
    if (!initSupabase()) {
        alert('Cloud service tidak tersedia. Coba lagi nanti.');
        return;
    }

    const email = document.getElementById('cloud-email').value.trim();
    const password = document.getElementById('cloud-password').value;

    if (!email || !password) {
        alert('Masukkan email dan password!');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert('Login gagal: ' + error.message);
            return;
        }

        enableCloudSync();
        await syncFromCloudReplace();

        saveSession(email);

        alert('✅ Cloud login berhasil! Data telah disinkronkan dari cloud.');
        showMainApp();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function handleCloudSignUp() {
    if (!initSupabase()) {
        alert('Cloud service tidak tersedia. Coba lagi nanti.');
        return;
    }

    const email = document.getElementById('cloud-email').value.trim();
    const password = document.getElementById('cloud-password').value;

    if (!email || !password) {
        alert('Masukkan email dan password!');
        return;
    }

    if (password.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            alert('Sign up gagal: ' + error.message);
            return;
        }

        enableCloudSync();
        saveSession(email);
        await syncToCloud();

        alert('✅ Akun cloud berhasil dibuat! Cek email untuk verifikasi (opsional).');
        showMainApp();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}
