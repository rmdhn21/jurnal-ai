// ===== LIBRARY UI MODULE =====
// Handles rendering and interaction for the "Perpustakaan AI" screen

document.addEventListener('DOMContentLoaded', () => {
    initLibrary();
});

function initLibrary() {
    console.log('📖 Library UI Init');
    
    // Add event listeners for category tabs
    const tabs = document.querySelectorAll('#library-category-tabs .tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            renderLibrary(category);
        });
    });

    // Handle Delete Button in Modal
    const deleteBtn = document.getElementById('lib-delete-btn');
    if (deleteBtn) {
        deleteBtn.onclick = async () => {
            const id = deleteBtn.getAttribute('data-id');
            if (id && confirm('Apakah Anda yakin ingin menghapus item ini dari perpustakaan?')) {
                await deleteSavedGeneration(id);
                document.getElementById('library-view-modal').classList.add('hidden');
                const activeCategory = document.querySelector('#library-category-tabs .tab-btn.active')?.getAttribute('data-category') || 'all';
                await renderLibrary(activeCategory);
            }
        };
    }
}

async function renderLibrary(category = 'all') {
    const grid = document.getElementById('library-items-grid');
    if (!grid) return;

    const items = await getSavedGenerations();
    const filteredItems = category === 'all' ? items : items.filter(item => item.category === category);

    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="text-center p-md text-muted" style="background:var(--surface); border-radius:12px; border:1px dashed var(--border);">
                <div style="font-size:2rem; margin-bottom:10px;">📭</div>
                <p>Belum ada item untuk kategori <strong>${category}</strong>.</p>
            </div>
        `;
        return;
    }

    // Sort by timestamp (newest first)
    filteredItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    grid.innerHTML = filteredItems.map(item => {
        const date = new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        let icon = '📄';
        if (item.category === 'EPLS') icon = '🎓';
        if (item.category === 'HSE') icon = '🏗️';
        if (item.category === 'Mind-Map') icon = '🧠';
        if (item.category === 'Flashcards') icon = '🗂️';
        if (item.category === 'Brain Boost') icon = '💡';

        return `
            <div class="card library-card fade-in" onclick="openLibraryItem('${item.id}')" style="cursor:pointer; transition: transform 0.2s; border-left: 4px solid var(--primary); display: flex; justify-content: space-between; align-items: center; padding: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 1.5rem; background: var(--surface-hover); width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 10px;">${icon}</div>
                    <div>
                        <h4 style="margin: 0; font-size: 1rem;">${item.title}</h4>
                        <div style="display: flex; gap: 10px; margin-top: 4px;">
                            <span class="badge-ai" style="font-size: 0.7rem; padding: 2px 6px;">${item.category}</span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">${date}</span>
                        </div>
                    </div>
                </div>
                <div style="color: var(--text-muted);">❯</div>
            </div>
        `;
    }).join('');
}

let currentLibraryFontSize = 14;
let currentLibraryOrientation = 'portrait';
let isLibraryEditing = false;
let currentLibraryItemId = null;

window.openLibraryItem = async function(id) {
    const items = await getSavedGenerations();
    const item = items.find(it => it.id === id);
    if (!item) return;

    const modal = document.getElementById('library-view-modal');
    const titleEl = document.getElementById('lib-view-title');
    const contentEl = document.getElementById('lib-view-content');
    const deleteBtn = document.getElementById('lib-delete-btn');

    titleEl.innerText = item.title;
    deleteBtn.setAttribute('data-id', item.id);
    currentLibraryItemId = item.id;

    // Reset settings
    isLibraryEditing = false;
    currentLibraryFontSize = 14;
    contentEl.style.fontSize = '14px';
    contentEl.contentEditable = 'false';
    document.getElementById('lib-font-size-text').innerText = '14px';
    document.getElementById('lib-edit-toggle').innerText = '📝 Edit';
    document.getElementById('lib-save-edits').classList.add('hidden');
    
    // Auto-detect orientation
    const isHSE = item.category === 'HSE' || item.title.toLowerCase().includes('jsa') || item.title.toLowerCase().includes('ptw');
    currentLibraryOrientation = isHSE ? 'landscape' : 'portrait';
    document.getElementById('lib-orientation-select').value = currentLibraryOrientation;

    // Handle different types of content
    if (item.type === 'mindmap') {
        document.getElementById('lib-settings-bar').classList.add('hidden'); // No edit for SVG
        contentEl.innerHTML = `
            <div id="lib-mindmap-container" style="height: 500px; width: 100%; position: relative;">
                <svg id="lib-markmap-svg" style="width:100%; height:100%;"></svg>
            </div>
        `;
        modal.classList.remove('hidden');
        
        setTimeout(() => {
            if (window.markmap) {
                const { Transformer, Markmap } = window.markmap;
                const transformer = new Transformer();
                const { root } = transformer.transform(item.content);
                Markmap.create('#lib-markmap-svg', { autoFit: true }, root);
            }
        }, 100);
    } else if (item.type === 'flashcards') {
        document.getElementById('lib-settings-bar').classList.add('hidden');
        try {
            const cards = JSON.parse(item.content);
            contentEl.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                    ${cards.map((card, idx) => `
                        <div class="card" style="background: var(--surface-hover); border: 1px solid var(--border);">
                            <div style="font-weight: bold; color: var(--primary); margin-bottom: 5px;">Q${idx + 1}: ${card.front}</div>
                            <div style="border-top: 1px solid var(--border); padding-top: 5px; margin-top: 5px;">A: ${card.back}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            modal.classList.remove('hidden');
        } catch (e) {
            contentEl.innerHTML = `<p class="text-danger">Gagal memuat data flashcard: ${e.message}</p>`;
            modal.classList.remove('hidden');
        }
    } else {
        document.getElementById('lib-settings-bar').classList.remove('hidden');
        contentEl.innerHTML = item.content;
        modal.classList.remove('hidden');
    }
};

window.toggleLibraryEdit = function() {
    const contentEl = document.getElementById('lib-view-content');
    const toggleBtn = document.getElementById('lib-edit-toggle');
    const saveBtn = document.getElementById('lib-save-edits');
    
    isLibraryEditing = !isLibraryEditing;
    
    if (isLibraryEditing) {
        contentEl.contentEditable = 'true';
        contentEl.style.border = '2px solid var(--primary)';
        contentEl.style.outline = 'none';
        contentEl.focus();
        toggleBtn.innerText = '✕ Batal';
        saveBtn.classList.remove('hidden');
    } else {
        contentEl.contentEditable = 'false';
        contentEl.style.border = '1px solid var(--border)';
        toggleBtn.innerText = '📝 Edit';
        saveBtn.classList.add('hidden');
    }
};

window.saveLibraryEdits = async function() {
    if (!currentLibraryItemId) return;
    
    const contentEl = document.getElementById('lib-view-content');
    const newContent = contentEl.innerHTML;
    
    try {
        const items = await getSavedGenerations();
        const item = items.find(it => it.id === currentLibraryItemId);
        if (item) {
            item.content = newContent;
            await saveGeneration(item); // Dexie put will overwrite if ID exists
            alert('Perubahan berhasil disimpan!');
            toggleLibraryEdit();
        }
    } catch (e) {
        alert('Gagal menyimpan perubahan: ' + e.message);
    }
};

window.adjustLibFontSize = function(delta) {
    currentLibraryFontSize += delta;
    if (currentLibraryFontSize < 8) currentLibraryFontSize = 8;
    if (currentLibraryFontSize > 30) currentLibraryFontSize = 30;
    
    const contentEl = document.getElementById('lib-view-content');
    contentEl.style.fontSize = currentLibraryFontSize + 'px';
    document.getElementById('lib-font-size-text').innerText = currentLibraryFontSize + 'px';
};

window.updateLibOrientation = function() {
    currentLibraryOrientation = document.getElementById('lib-orientation-select').value;
};

window.exportLibraryPDF = function() {
    const title = document.getElementById('lib-view-title').innerText;
    let content = document.getElementById('lib-view-content').innerHTML;
    
    const isMindmap = document.getElementById('lib-markmap-svg') !== null;
    
    // Create a temporary cleaning div
    const cleanDiv = document.createElement('div');
    cleanDiv.innerHTML = content;
    
    // Clean up
    cleanDiv.querySelectorAll('.no-print, .action-bar, button, .badge-ai, .loading-spinner').forEach(el => el.remove());
    
    cleanDiv.querySelectorAll('*').forEach(el => {
        // FORCE BLACK COLOR AND WHITE BACKGROUND
        el.style.setProperty('color', '#000', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        el.style.setProperty('background', 'transparent', 'important');
        
        // Remove transitions/animations
        el.style.transition = 'none';
        el.style.animation = 'none';

        // Fix table cutoff
        if (el.tagName === 'TABLE') {
            el.style.width = '100%';
            el.style.tableLayout = 'auto'; // allow dynamic sizing
            el.style.borderCollapse = 'collapse';
        }
        if (el.tagName === 'TH' || el.tagName === 'TD') {
            el.style.border = '1px solid #000';
            el.style.padding = '6px';
            el.style.wordBreak = 'break-word';
            el.style.fontSize = (currentLibraryFontSize - 2) + 'px'; // Tables slightly smaller
        }
    });

    const finalContent = cleanDiv.innerHTML;
    
    const printWindow = window.open('', '_blank', 'height=800,width=1200');
    printWindow.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <style>
                @page {
                    size: ${currentLibraryOrientation};
                    margin: 10mm;
                }
                
                body { 
                    font-family: Arial, Helvetica, sans-serif; 
                    line-height: 1.5; 
                    color: #000 !important; 
                    background: #fff;
                    margin: 0;
                    padding: 20px;
                    font-size: ${currentLibraryFontSize}px;
                }
                
                .document-wrapper { width: 100%; margin: 0 auto; }
                
                header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 3px solid #3182ce;
                    padding-bottom: 15px;
                }
                
                header h2 { margin: 0; color: #3182ce; font-size: 24px; text-transform: uppercase; }
                header h1 { font-size: 18px; margin: 10px 0 0 0; color: #000; font-weight: bold; }
                
                .meta-info {
                    font-size: 11px;
                    color: #444;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                    text-align: right;
                }

                table { width: 100%; border-collapse: collapse; margin: 15px 0; table-layout: auto; page-break-inside: auto; }
                tr { page-break-inside: avoid; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; word-wrap: break-word; }
                th { background: #f2f2f2 !important; font-weight: bold; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                
                footer {
                    margin-top: 30px;
                    font-size: 10px;
                    color: #777;
                    text-align: center;
                    border-top: 1px solid #eee;
                    padding-top: 10px;
                }

                @media print {
                    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="document-wrapper">
                <header>
                    <h2>HSE DEPARTMENT</h2>
                    <h1>${title}</h1>
                </header>
                
                <div class="meta-info">
                    <strong>Tgl Terbit:</strong> ${new Date().toLocaleString('id-ID', { dateStyle: 'full' })} WIB
                </div>

                <div id="content">${finalContent}</div>
                
                <footer>
                    Dicetak melalui Jurnal AI - Intelligent Professional System Hub<br>
                    © 2026 Jurnal AI. Keamanan adalah prioritas utama.
                </footer>
            </div>
            <script>
                if (${isMindmap}) {
                    const svg = document.querySelector('svg');
                    if (svg) { svg.setAttribute('width', '100%'); }
                }
                window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 800); };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
};

// Refresh Library
window.refreshLibraryUI = async function() {
    const activeCategory = document.querySelector('#library-category-tabs .tab-btn.active')?.getAttribute('data-category') || 'all';
    await renderLibrary(activeCategory);
};

window.searchLibrary = async function(query) {
    if (!query) return;
    
    // 1. Navigate to library screen
    if (typeof showScreen === 'function') {
        showScreen('library-screen');
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.screen === 'library-screen'));
    }
    
    // 2. Set category to 'all' to ensure we search everything
    const tabs = document.querySelectorAll('#library-category-tabs .tab-btn');
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-category') === 'all'));
    
    // 3. Render and filter
    const grid = document.getElementById('library-items-grid');
    if (!grid) return;

    const items = await getSavedGenerations();
    const filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="text-center p-md text-muted" style="background:var(--surface); border-radius:12px; border:1px dashed var(--border);">
                <div style="font-size:2rem; margin-bottom:10px;">🔍</div>
                <p>Tidak ditemukan item untuk pencarian: <strong>"${query}"</strong></p>
                <button class="btn btn-secondary btn-sm mt-sm" onclick="renderLibrary('all')">Lihat Semua</button>
            </div>
        `;
        return;
    }

    // Sort by timestamp (newest first)
    filteredItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    grid.innerHTML = filteredItems.map(item => {
        const date = new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        let icon = '📄';
        if (item.category === 'EPLS') icon = '🎓';
        if (item.category === 'HSE') icon = '🏗️';
        if (item.category === 'Mind-Map') icon = '🧠';
        if (item.category === 'Flashcards') icon = '🗂️';
        if (item.category === 'Brain Boost') icon = '💡';

        return `
            <div class="card library-card fade-in" onclick="openLibraryItem('${item.id}')" style="cursor:pointer; transition: transform 0.2s; border-left: 4px solid var(--primary); display: flex; justify-content: space-between; align-items: center; padding: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 1.5rem; background: var(--surface-hover); width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 10px;">${icon}</div>
                    <div>
                        <h4 style="margin: 0; font-size: 1rem;"><mark style="background:rgba(255,255,0,0.3); color:inherit; padding:0 2px;">${item.title}</mark></h4>
                        <div style="display: flex; gap: 10px; margin-top: 4px;">
                            <span class="badge-ai" style="font-size: 0.7rem; padding: 2px 6px;">${item.category}</span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">${date}</span>
                        </div>
                    </div>
                </div>
                <div style="color: var(--text-muted);">❯</div>
            </div>
        `;
    }).join('');
    
    // If there's only one match and it's a very confident hit, open it!
    if (filteredItems.length === 1) {
        setTimeout(() => openLibraryItem(filteredItems[0].id), 500);
    }
};
