/**
 * Jurnal AI - 3D Rig Viewer Module (V4 Field Package Edition)
 * Inspired by real-world mud pump skid photos including CAT engine, 
 * control box, and pipe frame chassis.
 */

let rigScene, rigCamera, rigRenderer, rigControls;
let rigAnimationFrame;
let rigRaycaster = new THREE.Raycaster();
let rigMouse = new THREE.Vector2();
let rigParts = [];
let rigGltfLoader;
let rigCurrentModel = null;

const RIG_DATA = {
    pulsation_dampener: {
        name: "Pulsation Dampener (K-20)",
        desc: "Botol akumulator tekanan tinggi. Desain K-20 di foto Anda memiliki bodi oval merah yang khas untuk meredam getaran.",
        specs: ["Type: K-20", "Max Pressure: 5000 PSI", "Color: Signal Red"]
    },
    cat_engine: {
        name: "Caterpillar Diesel Engine",
        desc: "Mesin penggerak utama (prime mover). Mesin kuning besar ini menyediakan tenaga ribuan HP untuk menggerakkan pompa.",
        specs: ["Power: 1600 HP", "Color: CAT Yellow", "Engine Type: V12/V16 Diesel"]
    },
    control_cabinet: {
        name: "Main Control Cabinet",
        desc: "Pusat kendali operasional. Mengatur RPM mesin, memantau tekanan pompa, dan sistem keamanan otomatis.",
        specs: ["IP Rating: IP65", "Display: 12-inch HMI", "Material: Blue Powder Coated Steel"]
    },
    fuel_tank: {
        name: "Auxiliary Fuel Tank",
        desc: "Tangki solar cadangan berbentuk silinder untuk menjamin operasional pompa selama 24 jam penuh di lapangan.",
        specs: ["Capacity: 250 Gallons", "Color: Safety Red", "Mount: Side-Saddle"]
    },
    pipe_skid: {
        name: "Tuber Frame Skid",
        desc: "Rangka pondasi yang dibuat dari pipa baja biru diameter besar. Kuat untuk kondisi lumpur dan memudahkan mobilisasi.",
        specs: ["Main Tube: 12-inch Steel Pipe", "Rails: Integral Protective Bars", "Design: Heavy Duty Oilfield"]
    }
};

function initRig3DViewer() {
    const container = document.getElementById('rig-3d-container');
    if (!container || rigRenderer) return;

    rigScene = new THREE.Scene();
    rigScene.background = new THREE.Color(0x0a0a0c);
    rigScene.fog = new THREE.Fog(0x0a0a0c, 40, 150);

    rigCamera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 2000);
    rigCamera.position.set(22, 16, 22);

    rigRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rigRenderer.setSize(container.clientWidth, container.clientHeight);
    rigRenderer.setPixelRatio(window.devicePixelRatio);
    rigRenderer.shadowMap.enabled = true;
    rigRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rigRenderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(rigRenderer.domElement);

    rigControls = new THREE.OrbitControls(rigCamera, rigRenderer.domElement);
    rigControls.enableDamping = true;
    rigControls.dampingFactor = 0.05;
    rigControls.maxPolarAngle = Math.PI / 2.1;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    rigScene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(40, 60, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    rigScene.add(mainLight);

    const blueBackLight = new THREE.PointLight(0x3b82f6, 1.2, 100);
    blueBackLight.position.set(-20, 15, -15);
    rigScene.add(blueBackLight);

    const amberLight = new THREE.PointLight(0xfbbf24, 0.8, 50);
    amberLight.position.set(10, 5, 10);
    rigScene.add(amberLight);

    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');
    rigGltfLoader = new THREE.GLTFLoader();
    rigGltfLoader.setDRACOLoader(dracoLoader);

    buildV4FieldPackage();

    container.addEventListener('click', onRigMouseClick);
    window.addEventListener('resize', onRigWindowResize);

    animateRig();
}

/** HELPER: Create detailed flange */
function createFlange(rad, thick, boltCount, boltSize, mat) {
    const group = new THREE.Group();
    const g = new THREE.CylinderGeometry(rad, rad, thick, 32);
    const m = new THREE.Mesh(g, mat);
    group.add(m);

    const bG = new THREE.CylinderGeometry(boltSize, boltSize, thick * 0.5, 8);
    const bD = rad * 0.85;
    for (let i = 0; i < boltCount; i++) {
        const a = (i / boltCount) * Math.PI * 2;
        const b = new THREE.Mesh(bG, mat);
        b.position.set(Math.cos(a) * bD, thick / 2, Math.sin(a) * bD);
        group.add(b);
    }
    return group;
}

function buildV4FieldPackage() {
    clearCurrentModel();
    const group = new THREE.Group();
    group.name = "field_package_v4";

    // --- PRO MATERIALS ---
    const matBlue = new THREE.MeshPhysicalMaterial({ color: 0x1d4ed8, metalness: 0.6, roughness: 0.3, clearcoat: 0.5 });
    const matYellow = new THREE.MeshPhysicalMaterial({ color: 0xeab308, metalness: 0.2, roughness: 0.4 });
    const matRed = new THREE.MeshPhysicalMaterial({ color: 0xef4444, metalness: 0.4, roughness: 0.3 });
    const matWhiteIns = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 1.0 }); // Rough white
    const matDeepBase = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.2, roughness: 0.7 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.1 });

    // --- 1. PIPE SKID (CHASSIS) ---
    const skidGroup = new THREE.Group();
    group.add(skidGroup);
    
    const mainPipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 22, 16);
    for (let x = -1; x <= 1; x += 2) {
        const p = new THREE.Mesh(mainPipeGeo, matBlue);
        p.rotation.x = Math.PI / 2;
        p.position.set(x * 5, 0.8, 0);
        skidGroup.add(p);
    }
    // Cross pipes
    for (let z = -10; z <= 10; z += 5) {
        const cp = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 10, 16), matBlue);
        cp.rotation.z = Math.PI / 2;
        cp.position.set(0, 0.8, z);
        skidGroup.add(cp);
    }
    // BULL BARS (RAILINGS)
    const railGeo = new THREE.CylinderGeometry(0.3, 0.3, 20, 8);
    for (let x = -1; x <= 1; x += 2) {
        // Horizontal top rail
        const hr = new THREE.Mesh(railGeo, matBlue);
        hr.rotation.x = Math.PI / 2;
        hr.position.set(x * 5.2, 4.5, 0);
        skidGroup.add(hr);
        // Vertical posts
        for (let z = -9; z <= 9; z += 6) {
            const vp = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), matBlue);
            vp.position.set(x * 5.2, 2.5, z);
            skidGroup.add(vp);
        }
    }
    const frontRail = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 8), matBlue);
    frontRail.rotation.z = Math.PI / 2;
    frontRail.position.set(0, 4.5, 10);
    skidGroup.add(frontRail);

    // --- 2. ENGINE (CAT YELLOW) ---
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 3, -4);
    group.add(engineGroup);

    const catBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.5, 9), matYellow);
    catBody.userData = { id: 'cat_engine' };
    engineGroup.add(catBody);
    rigParts.push(catBody);

    const radiator = new THREE.Mesh(new THREE.BoxGeometry(5.5, 5.5, 1), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 }));
    radiator.position.set(0, 0.5, -5);
    engineGroup.add(radiator);

    // EXHAUST (WHITE INSULATION)
    const exhaustBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 3, 16), matWhiteIns);
    exhaustBase.position.set(0, 3, 2);
    engineGroup.add(exhaustBase);

    const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 12, 16), matWhiteIns);
    exhaustPipe.position.set(0, 8, 2);
    engineGroup.add(exhaustPipe);

    // --- 3. MUD PUMP UNIT (BLUE CLIP) ---
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(0, 1.2, 5);
    group.add(pumpGroup);

    // Power End Housing (Beveled)
    const pBody = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), matBlue);
    pBody.position.y = 2;
    pBody.userData = { id: 'pipe_skid' }; // Re-using ID for simplicity
    pumpGroup.add(pBody);

    // Triplex Modules
    for (let i = -1; i <= 1; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5, 3), matBlue);
        m.position.set(i * 2.2, 2.5, 4.5);
        pumpGroup.add(m);

        // Valve Caps
        const fc = createFlange(0.7, 0.4, 8, 0.05, matSteel);
        fc.rotation.x = Math.PI / 2;
        fc.position.set(i * 2.2, 2.5, 6);
        pumpGroup.add(fc);
    }
    
    // RED DAMPENER (K-20 OVAL)
    const dPts = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0.5), new THREE.Vector2(1.8, 2), new THREE.Vector2(1.8, 4), new THREE.Vector2(0.8, 5), new THREE.Vector2(0, 5.2)];
    const dG = new THREE.LatheGeometry(dPts, 32);
    const damp = new THREE.Mesh(dG, matRed);
    damp.position.set(-2, 5, 2.5);
    damp.userData = { id: 'pulsation_dampener' };
    pumpGroup.add(damp);
    rigParts.push(damp);

    // --- 4. CONTROL CABINET & FUEL ---
    const frontGroup = new THREE.Group();
    frontGroup.position.set(0, 1, 9);
    group.add(frontGroup);

    const controlBox = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 4), matBlue);
    controlBox.position.set(2, 4, 0);
    controlBox.userData = { id: 'control_cabinet' };
    frontGroup.add(controlBox);
    rigParts.push(controlBox);

    const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 24), matRed);
    fuelTank.rotation.z = Math.PI / 2;
    fuelTank.position.set(-6, 2, -6); // Side mounted
    fuelTank.userData = { id: 'fuel_tank' };
    group.add(fuelTank);
    rigParts.push(fuelTank);

    // HOSES (SUCTION)
    const hoseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, 0.5, 10),
        new THREE.Vector3(-6, 2, 5),
        new THREE.Vector3(-5, 3.5, 0),
        new THREE.Vector3(-2.5, 2, 4)
    ]);
    const hoseGeo = new THREE.TubeGeometry(hoseCurve, 64, 0.5, 12, false);
    const hose = new THREE.Mesh(hoseGeo, new THREE.MeshStandardMaterial({color: 0x166534, roughness: 0.8})); // Green Hose
    group.add(hose);

    rigScene.add(group);
    rigCurrentModel = group;

    // Floor Grid
    const grid = new THREE.GridHelper(100, 50, 0x222222, 0x0a0a0a);
    grid.position.y = -0.05;
    rigScene.add(grid);

    const statusLabel = document.getElementById('rig-model-status');
    if (statusLabel) {
        statusLabel.innerText = "FIELD UNIT V4 ACTIVATED";
        statusLabel.style.color = "#fbbf24";
        statusLabel.style.background = "rgba(251, 191, 36, 0.1)";
    }
}

// ... helper functions (loadModel, animate, etc. - keep from previous versions) ...

async function loadRigFromURL() {
    const urlInput = document.getElementById('rig-model-url');
    if (!urlInput || !urlInput.value) return;
    loadModel(urlInput.value);
}

function loadRigFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    loadModel(url);
}

function loadModel(url) {
    const loading = document.getElementById('rig-3d-loading');
    if (loading) loading.style.display = 'block';

    rigGltfLoader.load(url, (gltf) => {
        clearCurrentModel();
        rigCurrentModel = gltf.scene;
        rigScene.add(rigCurrentModel);

        const box = new THREE.Box3().setFromObject(rigCurrentModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 15 / maxDim;
        
        rigCurrentModel.scale.setScalar(scale);
        rigCurrentModel.position.sub(center.multiplyScalar(scale));
        rigCurrentModel.position.y = 0;

        rigCurrentModel.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                rigParts.push(node);
            }
        });

        const statusLabel = document.getElementById('rig-model-status');
        if (statusLabel) {
            statusLabel.innerText = "Custom Asset Loaded";
            statusLabel.style.color = "#60a5fa";
            statusLabel.style.background = "rgba(96, 165, 250, 0.1)";
        }
        if (loading) loading.style.display = 'none';
        rigControls.reset();
        rigCamera.position.set(20, 20, 20);
        rigControls.update();
    }, undefined, (error) => {
        console.error(error);
        alert('Format file tidak didukung.');
        if (loading) loading.style.display = 'none';
    });
}

function clearCurrentModel() {
    if (rigCurrentModel) rigScene.remove(rigCurrentModel);
    rigCurrentModel = null;
    rigParts = [];
}

function animateRig() {
    rigAnimationFrame = requestAnimationFrame(animateRig);
    if (rigControls) rigControls.update();
    if (rigRenderer && rigScene && rigCamera) {
        rigRenderer.render(rigScene, rigCamera);
    }
}

function onRigWindowResize() {
    const container = document.getElementById('rig-3d-container');
    if (!container || !rigCamera || !rigRenderer) return;
    rigCamera.aspect = container.clientWidth / container.clientHeight;
    rigCamera.updateProjectionMatrix();
    rigRenderer.setSize(container.clientWidth, container.clientHeight);
}

function onRigMouseClick(event) {
    const container = document.getElementById('rig-3d-container');
    const rect = container.getBoundingClientRect();
    rigMouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    rigMouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    rigRaycaster.setFromCamera(rigMouse, rigCamera);
    const intersects = rigRaycaster.intersectObjects(rigParts, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        let pId = object.userData.id;
        if (!pId) {
            let parent = object;
            while(parent && !parent.userData.id) parent = parent.parent;
            if (parent) pId = parent.userData.id;
        }

        if (pId) showRigPartInfo(pId);
        else showRigPartInfo('generic', object.name || 'Component');
        
        if (object.material && object.material.color) {
            const originalColor = object.material.color.clone();
            object.material.color.setHex(0xf59e0b);
            setTimeout(() => { if (object.material) object.material.color.copy(originalColor); }, 300);
        }
    } else {
        hideRigPartInfo();
    }
}

function showRigPartInfo(id, customName) {
    const data = RIG_DATA[id] || { name: customName || "Component", desc: "Detail teknis dari package unit pompa lumpur lapangan.", specs: ["Standard Rig Package"] };
    const hud = document.querySelector('#rig-3d-hud .card');
    const nameEl = document.getElementById('rig-part-name');
    const descEl = document.getElementById('rig-part-desc');
    const specsEl = document.getElementById('rig-part-specs');

    if (nameEl) nameEl.innerText = data.name;
    if (descEl) descEl.innerText = data.desc;
    if (specsEl) {
        specsEl.innerHTML = data.specs.map(s => `
            <span style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 2px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; border: 1px solid rgba(251, 191, 36, 0.2);">${s}</span>
        `).join('');
    }
    if (hud) hud.style.transform = 'translateY(0)';
}

function hideRigPartInfo() {
    const hud = document.querySelector('#rig-3d-hud .card');
    if (hud) hud.style.transform = 'translateY(150px)';
}

function stopRig3DViewer() {
    if (rigAnimationFrame) cancelAnimationFrame(rigAnimationFrame);
    rigAnimationFrame = null;
}
