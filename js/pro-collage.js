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
        const outerPadding = 12; 
        const innerGap = 12;

        // 1. Prepare Caption Text & Calculate Dynamic Height
        const ts = new Date();
        const dateFormatted = `${String(ts.getDate()).padStart(2, '0')}/${String(ts.getMonth() + 1).padStart(2, '0')}/${ts.getFullYear()}`;
        const finalCaption = `${task} - Rig ${unit} - ${location} (${dateFormatted})`;
        
        const fontSize = Math.max(30, Math.min(60, W / 35));
        const lineHeight = fontSize + 20;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        
        // Measure lines to determine captionHeight
        const words = finalCaption.split(' ');
        let testLine = '';
        let lineCount = 1;
        const maxWidth = W - 150;
        for (let n = 0; n < words.length; n++) {
            const metrics = ctx.measureText(testLine + words[n] + ' ');
            if (metrics.width > maxWidth && n > 0) {
                lineCount++;
                testLine = words[n] + ' ';
            } else {
                testLine += words[n] + ' ';
            }
        }
        
        // Final Caption Height: Lines + Padding
        const captionHeight = (lineCount * lineHeight) + 120; // 120px padding (60 top, 60 bot)

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
            H = (W / processedImgs[0].img.width) * processedImgs[0].img.height + captionHeight + (outerPadding * 2);
            canvas.width = W;
            canvas.height = H;
        } else if (count === 2) {
            const drawW = W - (outerPadding * 2);
            const h1_full = (drawW / processedImgs[0].img.width) * processedImgs[0].img.height;
            const h2_full = (drawW / processedImgs[1].img.width) * processedImgs[1].img.height;
            
            const isPortrait1 = processedImgs[0].img.width < processedImgs[0].img.height;
            const isPortrait2 = processedImgs[1].img.width < processedImgs[1].img.height;
            
            if (isPortrait1 || isPortrait2) {
                const wSlot = (drawW - innerGap) / 2;
                const hRow = Math.max(
                    (wSlot / processedImgs[0].img.width) * processedImgs[0].img.height,
                    (wSlot / processedImgs[1].img.width) * processedImgs[1].img.height
                );
                H = hRow + captionHeight + (outerPadding * 2);
                canvas.width = W;
                canvas.height = H;
            } else {
                H = h1_full + h2_full + innerGap + captionHeight + (outerPadding * 2);
                canvas.width = W;
                canvas.height = H;
            }
        } else if (count === 3) {
            const drawW = W - (outerPadding * 2);
            const hTop = (drawW / processedImgs[0].img.width) * processedImgs[0].img.height;
            const wBot = (drawW - innerGap) / 2;
            const hBot = Math.max(
                (wBot / processedImgs[1].img.width) * processedImgs[1].img.height,
                (wBot / processedImgs[2].img.width) * processedImgs[2].img.height
            );
            H = hTop + hBot + innerGap + captionHeight + (outerPadding * 2);
            canvas.width = W;
            canvas.height = H;
        } else {
            const drawW = W - (outerPadding * 2);
            const wSlot = (drawW - innerGap) / 2;
            const hRow1 = Math.max(
                (wSlot / processedImgs[0].img.width) * processedImgs[0].img.height,
                (wSlot / processedImgs[1].img.width) * processedImgs[1].img.height
            );
            const hRow2 = Math.max(
                (wSlot / processedImgs[2].img.width) * processedImgs[2].img.height,
                (wSlot / processedImgs[3].img.width) * processedImgs[3].img.height
            );
            H = hRow1 + hRow2 + innerGap + captionHeight + (outerPadding * 2);
            canvas.width = W;
            canvas.height = H;
        }

        // Fill background with Dark Color
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, W, H);

        if (count === 1) {
            drawPDCSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, W - (outerPadding * 2), H - captionHeight - (outerPadding * 2), processedImgs[0].label);
        } else if (count === 2) {
            const drawW = W - (outerPadding * 2);
            const isPortrait1 = processedImgs[0].img.width < processedImgs[0].img.height;
            const isPortrait2 = processedImgs[1].img.width < processedImgs[1].img.height;
            
            if (isPortrait1 || isPortrait2) {
                const wSlot = (drawW - innerGap) / 2;
                const hRow = H - captionHeight - (outerPadding * 2);
                drawPDCSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, wSlot, hRow, processedImgs[0].label);
                drawPDCSlot(ctx, processedImgs[1].img, outerPadding + wSlot + innerGap, outerPadding, wSlot, hRow, processedImgs[1].label);
            } else {
                const h1 = (drawW / processedImgs[0].img.width) * processedImgs[0].img.height;
                const h2 = (drawW / processedImgs[1].img.width) * processedImgs[1].img.height;
                drawPDCSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, drawW, h1, processedImgs[0].label);
                drawPDCSlot(ctx, processedImgs[1].img, outerPadding, outerPadding + h1 + innerGap, drawW, h2, processedImgs[1].label);
            }
        } else if (count === 3) {
            const drawW = W - (outerPadding * 2);
            const hTop = (drawW / processedImgs[0].img.width) * processedImgs[0].img.height;
            const wBot = (drawW - innerGap) / 2;
            const hBot = H - captionHeight - (outerPadding * 2) - hTop - innerGap;
            drawPDCSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, drawW, hTop, processedImgs[0].label);
            drawPDCSlot(ctx, processedImgs[1].img, outerPadding, outerPadding + hTop + innerGap, wBot, hBot, processedImgs[1].label);
            drawPDCSlot(ctx, processedImgs[2].img, outerPadding + wBot + innerGap, outerPadding + hTop + innerGap, wBot, hBot, processedImgs[2].label);
        } else {
            const drawW = W - (outerPadding * 2);
            const wSlot = (drawW - innerGap) / 2;
            const hRow1 = Math.max(
                (wSlot / processedImgs[0].img.width) * processedImgs[0].img.height,
                (wSlot / processedImgs[1].img.width) * processedImgs[1].img.height
            );
            const hRow2 = H - captionHeight - (outerPadding * 2) - hRow1 - innerGap;
            drawPDCSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, wSlot, hRow1, processedImgs[0].label);
            drawPDCSlot(ctx, processedImgs[1].img, outerPadding + wSlot + innerGap, outerPadding, wSlot, hRow1, processedImgs[1].label);
            drawPDCSlot(ctx, processedImgs[2].img, outerPadding, outerPadding + hRow1 + innerGap, wSlot, hRow2, processedImgs[2].label);
            drawPDCSlot(ctx, processedImgs[3].img, outerPadding + wSlot + innerGap, outerPadding + hRow1 + innerGap, wSlot, hRow2, processedImgs[3].label);
        }

        // 3. Draw Caption Bar
        const captionDisplay = document.getElementById('pdc-caption-text');
        if (captionDisplay) captionDisplay.innerText = finalCaption;
        
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, H - captionHeight - outerPadding, W, captionHeight + outerPadding);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        
        // Centered Multiline Wrapping (dynamic Y)
        const textStartY = H - captionHeight - outerPadding + 80;
        wrapTextPDC(ctx, finalCaption, W / 2, textStartY, maxWidth, lineHeight);

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
    ctx.fillStyle = '#111827';
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
