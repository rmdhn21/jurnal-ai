/**
 * JS/REPORT-COLLAGE.JS - Smart Adaptive Edition
 * Mendukung multiple halaman per slot dan tata letak dinamis 1-4 foto.
 */

let collageSlots = {
    'pjsm-foto': [],
    'pjsm-form': [],
    'dcu-foto': [],
    'dcu-form': []
};

function initReportCollage() {
    const dateInput = document.getElementById('collage-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    document.getElementById('btn-generate-collage')?.addEventListener('click', generateCollage);
    document.getElementById('btn-download-collage')?.addEventListener('click', downloadCollage);
}

function triggerSlotUpload(key) {
    document.getElementById(`input-${key}`).click();
}

function handleSlotUpload(input, key) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Add to array instead of replacing
            collageSlots[key].push(e.target.result);
            updateSlotPreview(key);
            input.value = ""; // Reset for next selection
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateSlotPreview(key) {
    const previewContainer = document.getElementById(`${key}-preview`);
    if (key.includes('dcu')) {
        // Handle specific preview IDs for DCU
        const dcuPreview = document.getElementById(`pjsm-${key}-preview`);
        if (dcuPreview) dcuPreview.innerHTML = `<img src="${collageSlots[key][collageSlots[key].length-1]}" alt="Preview">`;
    } else {
        previewContainer.innerHTML = `<img src="${collageSlots[key][collageSlots[key].length-1]}" alt="Preview">`;
    }
    
    const slotElement = document.getElementById(`slot-${key}`);
    slotElement.classList.add('has-image');
    
    const counter = document.getElementById(`counter-${key}`);
    counter.innerText = `${collageSlots[key].length} Halaman`;
    counter.style.display = 'block';
}

function clearSlot(key) {
    collageSlots[key] = [];
    const preview = document.getElementById(key.includes('dcu') ? `pjsm-${key}-preview` : `${key}-preview`);
    
    let label = "";
    if (key === 'pjsm-foto') label = 'Foto PJSM<br>(Landscape)';
    if (key === 'pjsm-form') label = 'Form PJSM<br>(Portrait)';
    if (key === 'dcu-foto') label = 'Foto DCU<br>(Portrait)';
    if (key === 'dcu-form') label = 'Form DCU<br>(Landscape)';
    
    preview.innerHTML = `<span class="upload-plus">+</span><span class="upload-label">${label}</span>`;
    
    const slotElement = document.getElementById(`slot-${key}`);
    slotElement.classList.remove('has-image');
    document.getElementById(`counter-${key}`).style.display = 'none';
}

function clearCollageForm() {
    Object.keys(collageSlots).forEach(clearSlot);
    document.getElementById('collage-result-container').classList.add('hidden');
}

/**
 * Stitch multiple images vertically with a separator line
 */
async function stitchVertical(dataUrls) {
    if (dataUrls.length === 1) return await loadImage(dataUrls[0]);
    
    const loadedImgs = await Promise.all(dataUrls.map(url => loadImage(url)));
    
    // Normalize width to the largest one
    const targetW = Math.max(...loadedImgs.map(img => img.width));
    const heights = loadedImgs.map(img => (targetW / img.width) * img.height);
    const borderWeight = 5; // Thinner separator for multi-page stitch
    const totalH = heights.reduce((a, b) => a + b, 0) + (borderWeight * (dataUrls.length - 1));
    
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, totalH);
    
    let currentY = 0;
    loadedImgs.forEach((img, i) => {
        ctx.drawImage(img, 0, currentY, targetW, heights[i]);
        currentY += heights[i];
        
        if (i < loadedImgs.length - 1) {
            // Draw thick separator line
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, currentY, targetW, borderWeight);
            currentY += borderWeight;
        }
    });
    
    return await loadImage(canvas.toDataURL('image/jpeg', 0.95));
}

async function generateCollage() {
    const activeSlots = Object.entries(collageSlots).filter(([k, v]) => v.length > 0);
    if (activeSlots.length === 0) {
        alert('Mohon unggah minimal satu foto!');
        return;
    }

    const btn = document.getElementById('btn-generate-collage');
    btn.innerHTML = '🕒 Processing...';
    btn.disabled = true;

    try {
        const canvas = document.getElementById('collage-canvas');
        const ctx = canvas.getContext('2d');
        const W = 2400;
        const margin = 20; // Increased margin
        const captionHeight = 220; // Increased caption height

        // 1. Pre-process active images (stitch multi-pages)
        const processedImgs = [];
        for (const [key, files] of activeSlots) {
            processedImgs.push({
                img: await stitchVertical(files),
                label: key.replace('-', ' ').toUpperCase()
            });
        }

        const count = processedImgs.length;
        let H = 0;
        
        // 2. Determine Layout and Canvas Height
        const outerPadding = 40; // Thick bold outer frame
        const innerGap = 8; // Thin aesthetic inner gap

        if (count === 1) {
            H = (W / processedImgs[0].img.width) * processedImgs[0].img.height + captionHeight + (outerPadding * 2);
            canvas.width = W;
            canvas.height = H;
        } else if (count === 2) {
            const h1 = ((W - (outerPadding * 2)) / processedImgs[0].img.width) * processedImgs[0].img.height;
            const h2 = ((W - (outerPadding * 2)) / processedImgs[1].img.width) * processedImgs[1].img.height;
            H = h1 + h2 + innerGap + captionHeight + (outerPadding * 2);
            canvas.width = W;
            canvas.height = H;
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
        } else if (count === 4) {
            const drawW = W - (outerPadding * 2);
            const wSlot = (drawW - innerGap) / 2;
            
            const hL1 = (wSlot / processedImgs[0].img.width) * processedImgs[0].img.height;
            const hP1 = (wSlot / processedImgs[1].img.width) * processedImgs[1].img.height;
            const hP2 = (wSlot / processedImgs[2].img.width) * processedImgs[2].img.height;
            const hL2 = (wSlot / processedImgs[3].img.width) * processedImgs[3].img.height;

            const hCol1 = hL1 + hP1 + innerGap;
            const hCol2 = hP2 + hL2 + innerGap;
            
            H = Math.max(hCol1, hCol2) + captionHeight + (outerPadding * 2);
            canvas.width = W;
            canvas.height = H;
        } else {
            const drawW = W - (outerPadding * 2);
            const wSlot = (drawW - innerGap) / 2;
            const cols = 2;
            const rows = Math.ceil(count / cols);
            H = rows * (drawW / 2 * 0.75) + captionHeight + (outerPadding * 2);
            canvas.width = W;
            canvas.height = H;
        }

        // Fill background with Pure White
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);

        if (count === 1) {
            drawAdaptiveSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, W - (outerPadding * 2), H - captionHeight - (outerPadding * 2), processedImgs[0].label);
        } else if (count === 2) {
            const drawW = W - (outerPadding * 2);
            const h1 = (drawW / processedImgs[0].img.width) * processedImgs[0].img.height;
            const h2 = (drawW / processedImgs[1].img.width) * processedImgs[1].img.height;
            drawAdaptiveSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, drawW, h1, processedImgs[0].label);
            drawAdaptiveSlot(ctx, processedImgs[1].img, outerPadding, outerPadding + h1 + innerGap, drawW, h2, processedImgs[1].label);
        } else if (count === 3) {
            const drawW = W - (outerPadding * 2);
            const hTop = (drawW / processedImgs[0].img.width) * processedImgs[0].img.height;
            const wBot = (drawW - innerGap) / 2;
            const hBot = H - captionHeight - (outerPadding * 2) - hTop - innerGap;
            drawAdaptiveSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, drawW, hTop, processedImgs[0].label);
            drawAdaptiveSlot(ctx, processedImgs[1].img, outerPadding, outerPadding + hTop + innerGap, wBot, hBot, processedImgs[1].label);
            drawAdaptiveSlot(ctx, processedImgs[2].img, outerPadding + wBot + innerGap, outerPadding + hTop + innerGap, wBot, hBot, processedImgs[2].label);
        } else if (count === 4) {
            const drawW = W - (outerPadding * 2);
            const wSlot = (drawW - innerGap) / 2;
            
            const hL1 = (wSlot / processedImgs[0].img.width) * processedImgs[0].img.height;
            const hP1 = (wSlot / processedImgs[1].img.width) * processedImgs[1].img.height;
            const hP2 = (wSlot / processedImgs[2].img.width) * processedImgs[2].img.height;
            const hL2 = (wSlot / processedImgs[3].img.width) * processedImgs[3].img.height;

            // Column 1 (Left)
            drawAdaptiveSlot(ctx, processedImgs[0].img, outerPadding, outerPadding, wSlot, hL1, processedImgs[0].label);
            drawAdaptiveSlot(ctx, processedImgs[1].img, outerPadding, outerPadding + hL1 + innerGap, wSlot, hP1, processedImgs[1].label);
            
            // Column 2 (Right)
            drawAdaptiveSlot(ctx, processedImgs[2].img, outerPadding + wSlot + innerGap, outerPadding, wSlot, hP2, processedImgs[2].label);
            drawAdaptiveSlot(ctx, processedImgs[3].img, outerPadding + wSlot + innerGap, outerPadding + hP2 + innerGap, wSlot, hL2, processedImgs[3].label);
        } else {
            const drawW = W - (outerPadding * 2);
            const wSlot = (drawW - innerGap) / 2;
            const cols = 2;
            const rows = Math.ceil(count / cols);
            const slotH = (H - captionHeight - (outerPadding * 2) - ((rows - 1) * innerGap)) / rows;
            
            processedImgs.forEach((data, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = outerPadding + col * (wSlot + innerGap);
                const y = outerPadding + row * (slotH + innerGap);
                drawAdaptiveSlot(ctx, data.img, x, y, wSlot, slotH, data.label);
            });
        }

        // Draw Caption Bar
        const shift = document.getElementById('collage-shift').value;
        const rig = document.getElementById('collage-rig').value;
        const location = document.getElementById('collage-location').value;
        const dateRaw = document.getElementById('collage-date').value;
        const d = new Date(dateRaw);
        const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        const captionStr = `FTT & PJSM Crew ${shift} Rig ${rig}, Lokasi ST-${location}, ${dateFormatted}`;

        // Set UI caption for copying
        const captionDisplay = document.getElementById('collage-caption-text');
        if (captionDisplay) captionDisplay.innerText = captionStr;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, H - captionHeight - outerPadding, W, captionHeight + outerPadding); 
        ctx.fillStyle = '#000000';
        ctx.font = '700 42px "Times New Roman", serif'; // Reduced from 55px
        ctx.textAlign = 'center';
        ctx.fillText(captionStr, W / 2, H - outerPadding - 85);

        document.getElementById('collage-result-container').classList.remove('hidden');
        document.getElementById('collage-result-container').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error(err);
        alert('Gagal membuat kolase.');
    } finally {
        btn.innerHTML = '⚡ Buat Kolase';
        btn.disabled = false;
    }
}

function drawAdaptiveSlot(ctx, img, x, y, w, h, label) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, w, h);
    
    const imgRatio = img.width / img.height;
    const slotRatio = w / h;
    let tw, th, tx, ty;

    if (imgRatio > slotRatio) {
        tw = w;
        th = w / imgRatio;
    } else {
        th = h;
        tw = h * imgRatio;
    }
    tx = x + (w - tw) / 2;
    ty = y + (h - th) / 2;

    ctx.drawImage(img, tx, ty, tw, th);
    
    // Minimal Label Badge (Gallery Style)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(x + 15, y + 15, label.length * 12 + 40, 35); // Reduced size
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "Times New Roman", serif'; // Reduced from 18px
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 30, y + 36);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function downloadCollage() {
    const canvas = document.getElementById('collage-canvas');
    const rig = document.getElementById('collage-rig').value || 'Report';
    const date = document.getElementById('collage-date').value || 'Date';
    const link = document.createElement('a');
    link.download = `HSE_Report_${rig}_${date}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}
