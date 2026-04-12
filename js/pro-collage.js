/**
 * JS/PRO-COLLAGE.JS - Smart Adaptive Edition
 * Dokumentasi Pro dengan Watermark dan Multi-Page Support.
 */

let pdcSlots = {
    1: [],
    2: [],
    3: [],
    4: []
};

function initProCollage() {
    const dateInput = document.getElementById('pdc-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    document.getElementById('btn-generate-pdc')?.addEventListener('click', generatePDC);
    document.getElementById('btn-download-pdc')?.addEventListener('click', downloadPDC);
}

function updatePDCGrid() {
    const count = parseInt(document.getElementById('pdc-count')?.value || 2);
    const mode = document.getElementById('pdc-label-mode')?.value || 'standard';
    
    const label1 = document.getElementById('pdc-label-1');
    const label2 = document.getElementById('pdc-label-2');

    for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`slot-pdc-${i}`);
        if (i <= count) {
            slot?.classList.remove('hidden');
        } else {
            slot?.classList.add('hidden');
        }
    }

    if (mode === 'bf' && count >= 2) {
        if (label1) label1.innerText = "Foto 1 (BEFORE)";
        if (label2) label2.innerText = "Foto 2 (AFTER)";
    } else {
        if (label1) label1.innerText = "Foto 1";
        if (label2) label2.innerText = "Foto 2";
    }
}

function triggerPDCUpload(index) {
    document.getElementById(`input-pdc-${index}`).click();
}

function handlePDCUpload(input, index) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            pdcSlots[index].push(e.target.result);
            updatePDCSlotPreview(index);
            input.value = "";
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updatePDCSlotPreview(index) {
    const preview = document.getElementById(`preview-pdc-${index}`);
    preview.innerHTML = `<img src="${pdcSlots[index][pdcSlots[index].length - 1]}" style="width:100%; height:100%; object-fit:cover;">`;
    
    const slotElement = document.getElementById(`slot-pdc-${index}`);
    slotElement.classList.add('has-image');
    
    const counter = document.getElementById(`counter-pdc-${index}`);
    counter.innerText = `${pdcSlots[index].length} Halaman`;
    counter.style.display = 'block';
}

function clearPDCSlot(index) {
    pdcSlots[index] = [];
    const preview = document.getElementById(`preview-pdc-${index}`);
    const labelText = index === 1 ? 'Foto 1 (BEFORE)' : (index === 2 ? 'Foto 2 (AFTER)' : `Foto ${index}`);
    
    preview.innerHTML = `<span class="upload-plus">+</span><span class="upload-label">${labelText}</span>`;
    
    const slotElement = document.getElementById(`slot-pdc-${index}`);
    slotElement.classList.remove('has-image');
    document.getElementById(`counter-pdc-${index}`).style.display = 'none';
}

function clearPDCForm() {
    [1,2,3,4].forEach(clearPDCSlot);
    document.getElementById('pdc-result-container').classList.add('hidden');
}

/**
 * Stitch with Watermark applied to each page
 */
async function stitchVerticalPDC(dataUrls, task, location) {
    const loadedImgs = await Promise.all(dataUrls.map(url => loadImagePDC(url)));
    const targetW = Math.max(...loadedImgs.map(img => img.width));
    const borderWeight = 12;
    const heights = loadedImgs.map(img => (targetW / img.width) * img.height);
    const totalH = heights.reduce((a, b) => a + b, 0) + (borderWeight * (dataUrls.length - 1));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    let currentY = 0;
    loadedImgs.forEach((img, i) => {
        ctx.drawImage(img, 0, currentY, targetW, heights[i]);
        
        // Watermark each page
        drawPDCWatermark(ctx, 0, currentY, targetW, heights[i]);
        
        currentY += heights[i];
        if (i < loadedImgs.length - 1) {
            ctx.fillStyle = '#111827';
            ctx.fillRect(0, currentY, targetW, borderWeight);
            currentY += borderWeight;
        }
    });

    return await loadImagePDC(canvas.toDataURL('image/jpeg', 0.95));
}

function drawPDCWatermark(ctx, x, y, w, h) {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} - ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()}`;
    
    ctx.font = `${Math.max(20, w/50)}px Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.shadowColor = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(ts, x + w - 30, y + h - 30);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}

async function generatePDC() {
    const activeIndices = [1, 2, 3, 4].filter(i => pdcSlots[i].length > 0);
    if (activeIndices.length === 0) {
        alert('Mohon unggah minimal satu foto!');
        return;
    }

    const task = document.getElementById('pdc-task').value || 'Dokumentasi';
    const unit = document.getElementById('pdc-unit').value || 'Unit';
    const location = document.getElementById('pdc-location').value || 'Field';

    const btn = document.getElementById('btn-generate-pdc');
    btn.innerHTML = '🕒 Processing...';
    btn.disabled = true;

    try {
        const labelMode = document.getElementById('pdc-label-mode')?.value || 'standard';
        const canvas = document.getElementById('pdc-canvas');
        const ctx = canvas.getContext('2d');
        const W = 2000;
        const margin = 12;
        const captionHeight = 350;

        const processedImgs = [];
        for (let i = 0; i < activeIndices.length; i++) {
            const slotIdx = activeIndices[i];
            let label = (i + 1).toString();
            if (labelMode === 'bf') {
                label = (i === 0) ? 'BEFORE' : (i === 1 ? 'AFTER' : (i + 1).toString());
            }
            
            const stitchedImg = await stitchVerticalPDC(pdcSlots[slotIdx], task, location);
            processedImgs.push({
                img: stitchedImg,
                label: label
            });
        }

        const count = processedImgs.length;
        let H = 0;

        if (count === 1) {
            H = (W / processedImgs[0].img.width) * processedImgs[0].img.height + captionHeight;
            canvas.width = W;
            canvas.height = H;
            drawPDCSlot(ctx, processedImgs[0].img, 0, 0, W, H - captionHeight, processedImgs[0].label);
        } else if (count === 2) {
            // Adaptive Layout for 2 Images
            const h1_full = (W / processedImgs[0].img.width) * processedImgs[0].img.height;
            const h2_full = (W / processedImgs[1].img.width) * processedImgs[1].img.height;
            
            const isPortrait1 = processedImgs[0].img.width < processedImgs[0].img.height;
            const isPortrait2 = processedImgs[1].img.width < processedImgs[1].img.height;
            
            if (isPortrait1 || isPortrait2) {
                // Side-by-side if even one is portrait (usually users mix before/after)
                const wSlot = (W - margin) / 2;
                const hRow = Math.max(
                    (wSlot / processedImgs[0].img.width) * processedImgs[0].img.height,
                    (wSlot / processedImgs[1].img.width) * processedImgs[1].img.height
                );
                H = hRow + captionHeight;
                canvas.width = W;
                canvas.height = H;
                drawPDCSlot(ctx, processedImgs[0].img, 0, 0, wSlot, hRow, processedImgs[0].label);
                drawPDCSlot(ctx, processedImgs[1].img, wSlot + margin, 0, wSlot, hRow, processedImgs[1].label);
            } else {
                // Vertical stack for landscape
                H = h1_full + h2_full + margin + captionHeight;
                canvas.width = W;
                canvas.height = H;
                drawPDCSlot(ctx, processedImgs[0].img, 0, 0, W, h1_full, processedImgs[0].label);
                drawPDCSlot(ctx, processedImgs[1].img, 0, h1_full + margin, W, h2_full, processedImgs[1].label);
            }
        } else if (count === 3) {
            const hTop = (W / processedImgs[0].img.width) * processedImgs[0].img.height;
            const wBot = (W - margin) / 2;
            const hBot = Math.max(
                (wBot / processedImgs[1].img.width) * processedImgs[1].img.height,
                (wBot / processedImgs[2].img.width) * processedImgs[2].img.height
            );
            H = hTop + hBot + margin + captionHeight;
            canvas.width = W;
            canvas.height = H;
            drawPDCSlot(ctx, processedImgs[0].img, 0, 0, W, hTop, processedImgs[0].label);
            drawPDCSlot(ctx, processedImgs[1].img, 0, hTop + margin, wBot, hBot, processedImgs[1].label);
            drawPDCSlot(ctx, processedImgs[2].img, wBot + margin, hTop + margin, wBot, hBot, processedImgs[2].label);
        } else {
            const wSlot = (W - margin) / 2;
            const hRow1 = Math.max(
                (wSlot / processedImgs[0].img.width) * processedImgs[0].img.height,
                (wSlot / processedImgs[1].img.width) * processedImgs[1].img.height
            );
            const hRow2 = Math.max(
                (wSlot / processedImgs[2].img.width) * processedImgs[2].img.height,
                (wSlot / processedImgs[3].img.width) * processedImgs[3].img.height
            );
            H = hRow1 + hRow2 + margin + captionHeight;
            canvas.width = W;
            canvas.height = H;
            drawPDCSlot(ctx, processedImgs[0].img, 0, 0, wSlot, hRow1, processedImgs[0].label);
            drawPDCSlot(ctx, processedImgs[1].img, wSlot + margin, 0, wSlot, hRow1, processedImgs[1].label);
            drawPDCSlot(ctx, processedImgs[2].img, 0, hRow1 + margin, wSlot, hRow2, processedImgs[2].label);
            drawPDCSlot(ctx, processedImgs[3].img, wSlot + margin, hRow1 + margin, wSlot, hRow2, processedImgs[3].label);
        }

        // Caption Bar
        const dateRaw = new Date();
        const dateFormatted = `${String(dateRaw.getDate()).padStart(2, '0')}/${String(dateRaw.getMonth() + 1).padStart(2, '0')}/${dateRaw.getFullYear()}`;
        const finalCaption = `${task} - Rig ${unit} - ${location} (${dateFormatted})`;
        
        // Set UI caption for copying
        const captionDisplay = document.getElementById('pdc-caption-text');
        if (captionDisplay) captionDisplay.innerText = finalCaption;
        
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, canvas.height - captionHeight, canvas.width, captionHeight);
        ctx.fillStyle = '#ffffff';
        const fontSize = Math.max(30, Math.min(60, canvas.width / 35));
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        
        // Multiline Wrapping
        wrapTextPDC(ctx, finalCaption, canvas.width / 2, canvas.height - 230, canvas.width - 100, fontSize + 20);

        document.getElementById('pdc-result-container').classList.remove('hidden');
        document.getElementById('pdc-result-container').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error(err);
        alert('Gagal membuat kolase PDC.');
    } finally {
        btn.innerHTML = '⚡ Buat Kolase Pro';
        btn.disabled = false;
    }
}

function drawPDCSlot(ctx, img, x, y, w, h, label) {
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(x, y, w, h);
    
    // Maintain aspect ratio (Object-Fit Contain)
    const imgRatio = img.width / img.height;
    const slotRatio = w / h;
    
    let drawW, drawH, drawX, drawY;
    if (imgRatio > slotRatio) {
        // Image is wider than slot
        drawW = w;
        drawH = w / imgRatio;
        drawX = x;
        drawY = y + (h - drawH) / 2;
    } else {
        // Image is taller than slot
        drawH = h;
        drawW = h * imgRatio;
        drawY = y;
        drawX = x + (w - drawW) / 2;
    }
    
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Label Badge
    ctx.fillStyle = label === 'BEFORE' ? '#ef4444' : (label === 'AFTER' ? '#10b981' : '#374151');
    const badgeW = label.length > 2 ? 180 : 80;
    ctx.fillRect(x + 20, y + 20, badgeW, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 20 + badgeW/2, y + 60);
}

function loadImagePDC(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function downloadPDC() {
    const canvas = document.getElementById('pdc-canvas');
    const task = document.getElementById('pdc-task').value || 'Dokumentasi';
    const link = document.createElement('a');
    link.download = `Pro_Documentation_${task.replace(/\s+/g, '_')}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

function wrapTextPDC(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}
