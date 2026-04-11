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
    const borderWeight = 10;
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
            // Draw separator line
            ctx.fillStyle = '#111827';
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
        const margin = 10;
        const captionHeight = 180;

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
        if (count === 1) {
            H = (W / processedImgs[0].img.width) * processedImgs[0].img.height + captionHeight;
            canvas.width = W;
            canvas.height = H;
            drawAdaptiveSlot(ctx, processedImgs[0].img, 0, 0, W, H - captionHeight, processedImgs[0].label);
        } else if (count === 2) {
            const h1 = (W / processedImgs[0].img.width) * processedImgs[0].img.height;
            const h2 = (W / processedImgs[1].img.width) * processedImgs[1].img.height;
            H = h1 + h2 + margin + captionHeight;
            canvas.width = W;
            canvas.height = H;
            drawAdaptiveSlot(ctx, processedImgs[0].img, 0, 0, W, h1, processedImgs[0].label);
            drawAdaptiveSlot(ctx, processedImgs[1].img, 0, h1 + margin, W, h2, processedImgs[1].label);
        } else if (count === 3) {
            // Option A: 1 Top, 2 Bottom
            const hTop = (W / processedImgs[0].img.width) * processedImgs[0].img.height;
            const wBot = (W - margin) / 2;
            const hBot = Math.max(
                (wBot / processedImgs[1].img.width) * processedImgs[1].img.height,
                (wBot / processedImgs[2].img.width) * processedImgs[2].img.height
            );
            H = hTop + hBot + margin + captionHeight;
            canvas.width = W;
            canvas.height = H;
            drawAdaptiveSlot(ctx, processedImgs[0].img, 0, 0, W, hTop, processedImgs[0].label);
            drawAdaptiveSlot(ctx, processedImgs[1].img, 0, hTop + margin, wBot, hBot, processedImgs[1].label);
            drawAdaptiveSlot(ctx, processedImgs[2].img, wBot + margin, hTop + margin, wBot, hBot, processedImgs[2].label);
        } else {
            // 4 Photos (Grid 2x2)
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
            drawAdaptiveSlot(ctx, processedImgs[0].img, 0, 0, wSlot, hRow1, processedImgs[0].label);
            drawAdaptiveSlot(ctx, processedImgs[1].img, wSlot + margin, 0, wSlot, hRow1, processedImgs[1].label);
            drawAdaptiveSlot(ctx, processedImgs[2].img, 0, hRow1 + margin, wSlot, hRow2, processedImgs[2].label);
            drawAdaptiveSlot(ctx, processedImgs[3].img, wSlot + margin, hRow1 + margin, wSlot, hRow2, processedImgs[3].label);
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

        ctx.fillStyle = '#111827';
        ctx.fillRect(0, H - captionHeight, W, captionHeight);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(captionStr, W / 2, H - 70);

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
    ctx.fillStyle = '#f1f5f9';
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
    
    // Minimal Label Badge
    ctx.fillStyle = 'rgba(17, 24, 39, 0.7)';
    ctx.fillRect(x + 10, y + 10, label.length * 15 + 40, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, sans-serif';
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
