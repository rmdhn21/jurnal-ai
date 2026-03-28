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
        deleteBtn.onclick = () => {
            const id = deleteBtn.getAttribute('data-id');
            if (id && confirm('Apakah Anda yakin ingin menghapus item ini dari perpustakaan?')) {
                deleteSavedGeneration(id);
                document.getElementById('library-view-modal').classList.add('hidden');
                const activeCategory = document.querySelector('#library-category-tabs .tab-btn.active')?.getAttribute('data-category') || 'all';
                renderLibrary(activeCategory);
            }
        };
    }
}

function renderLibrary(category = 'all') {
    const grid = document.getElementById('library-items-grid');
    if (!grid) return;

    const items = getSavedGenerations();
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

window.openLibraryItem = function(id) {
    const items = getSavedGenerations();
    const item = items.find(it => it.id === id);
    if (!item) return;

    const modal = document.getElementById('library-view-modal');
    const titleEl = document.getElementById('lib-view-title');
    const contentEl = document.getElementById('lib-view-content');
    const deleteBtn = document.getElementById('lib-delete-btn');

    titleEl.innerText = item.title;
    deleteBtn.setAttribute('data-id', item.id);

    // Handle different types of content
    if (item.type === 'mindmap') {
        contentEl.innerHTML = `
            <div id="lib-mindmap-container" style="height: 500px; width: 100%; position: relative;">
                <svg id="lib-markmap-svg" style="width:100%; height:100%;"></svg>
            </div>
        `;
        modal.classList.remove('hidden');
        
        // Use a timeout to ensure SVG is in DOM before markmap renders
        setTimeout(() => {
            if (window.markmap) {
                const { Transformer, Markmap } = window.markmap;
                const transformer = new Transformer();
                const { root } = transformer.transform(item.content);
                Markmap.create('#lib-markmap-svg', { autoFit: true }, root);
            }
        }, 100);
    } else if (item.type === 'flashcards') {
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
        // Default HTML content
        contentEl.innerHTML = item.content;
        modal.classList.remove('hidden');
    }
};

// Expose renderLibrary globally so navigation can trigger it
window.refreshLibraryUI = function() {
    const activeCategory = document.querySelector('#library-category-tabs .tab-btn.active')?.getAttribute('data-category') || 'all';
    renderLibrary(activeCategory);
};

window.exportLibraryPDF = function() {
    const title = document.getElementById('lib-view-title').innerText;
    let content = document.getElementById('lib-view-content').innerHTML;
    
    // Detection logic for HSE items
    const isHSE = title.toLowerCase().includes('jsa') || 
                  title.toLowerCase().includes('ptw') || 
                  title.toLowerCase().includes('rca') || 
                  title.toLowerCase().includes('tbt') ||
                  title.toLowerCase().includes('incident');

    // Check if it's a mind-map (SVG)
    const isMindmap = document.getElementById('lib-markmap-svg') !== null;
    
    // Create a temporary cleaning div
    const cleanDiv = document.createElement('div');
    cleanDiv.innerHTML = content;
    
    // 1. Remove app-specific UI elements that might have been saved
    cleanDiv.querySelectorAll('.no-print, .action-bar, button, .badge-ai, .loading-spinner').forEach(el => el.remove());
    
    // 2. Clean up inline styles that cause 'App' look (dark backgrounds, etc.)
    cleanDiv.querySelectorAll('*').forEach(el => {
        if (el.style.background.includes('var(') || el.style.background.includes('#')) {
            el.style.background = 'transparent';
        }
        if (el.style.color.includes('var(')) {
            el.style.color = '#111'; // High contrast for print
        }
        if (el.classList.contains('card')) {
            el.style.border = 'none';
            el.style.boxShadow = 'none';
            el.style.padding = '0';
        }
    });

    const finalContent = cleanDiv.innerHTML;
    
    const printWindow = window.open('', '_blank', 'height=800,width=1200');
    printWindow.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;700&display=swap');
                
                @page {
                    size: ${isHSE ? 'A4 landscape' : 'A4 portrait'};
                    margin: 1.5cm;
                }
                
                body { 
                    font-family: ${isHSE ? 'Arial, sans-serif' : "'Inter', sans-serif"}; 
                    line-height: 1.6; 
                    color: #000; 
                    background: #fff;
                    margin: 0;
                    padding: 0;
                    font-size: ${isHSE ? '11px' : '11pt'};
                }
                
                .document-wrapper {
                    max-width: ${isHSE ? '100%' : '800px'};
                    margin: 0 auto;
                }
                
                header {
                    border-bottom: ${isHSE ? '4px solid #3182ce' : '2px solid #333'};
                    margin-bottom: 25px;
                    padding-bottom: 12px;
                    text-align: ${isHSE ? 'center' : 'left'};
                }
                
                header h1 { 
                    font-family: ${isHSE ? 'Arial, sans-serif' : "'Crimson Pro', serif"};
                    font-size: ${isHSE ? '22px' : '2.4rem'}; 
                    margin: 0;
                    color: ${isHSE ? '#3182ce' : '#000'};
                    font-weight: 700;
                    text-transform: ${isHSE ? 'uppercase' : 'none'};
                }
                
                .doc-type {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: ${isHSE ? '#3182ce' : '#666'};
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .meta-info {
                    font-size: 10px;
                    color: #555;
                    margin-bottom: 20px;
                    padding: 8px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                }

                h2, h3, h4 { color: #000; margin-top: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 15px 0; 
                    table-layout: fixed;
                }
                
                th, td { 
                    border: 1px solid #000; 
                    padding: 8px 10px; 
                    text-align: left; 
                    vertical-align: top;
                    word-wrap: break-word;
                }
                
                th { background: #f0f0f0 !important; font-weight: bold; text-align: center; }
                
                pre { 
                    background: #f9f9f9; 
                    padding: 15px; 
                    border: 1px solid #ddd;
                    border-radius: 4px; 
                    white-space: pre-wrap;
                    font-family: monospace;
                    font-size: 10px;
                }

                footer {
                    margin-top: 40px;
                    font-size: 0.7rem;
                    color: #666;
                    text-align: center;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }

                @media print {
                    header { margin-top: 0; }
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            </style>
        </head>
        <body>
            <div class="document-wrapper">
                <header>
                    <div class="doc-type">${isHSE ? 'HSE DEPARTMENT - OFFICIAL DOCUMENT' : 'Jurnal AI • Laporan Belajar'}</div>
                    <h1>${title}</h1>
                    ${isHSE ? '<p style="margin:5px 0 0 0; color:#4a5568; font-size:12px;">AI Generated Professional HSE Report</p>' : ''}
                </header>
                
                <div class="meta-info">
                    <strong>Generated:</strong> ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })} &nbsp; | &nbsp; 
                    <strong>System:</strong> Jurnal AI - Intelligent Hub
                </div>

                <div id="content">${finalContent}</div>
                
                <footer>
                    Dokumen ini dihasilkan secara otomatis oleh sistem AI Jurnal. Keamanan adalah prioritas utama.<br>
                    © 2026 Jurnal AI - Safety & Learning Management System
                </footer>
            </div>
            
            <script>
                if (${isMindmap}) {
                    const svg = document.querySelector('svg');
                    if (svg) {
                        svg.setAttribute('width', '100%');
                        svg.style.maxHeight = 'none'; // Allow it to expand
                    }
                }
                window.onload = () => { 
                    setTimeout(() => { 
                        window.print(); 
                        window.close(); 
                    }, 800); 
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
};
